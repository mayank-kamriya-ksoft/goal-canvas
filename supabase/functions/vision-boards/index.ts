import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation constants
const MAX_BOARD_DATA_SIZE = 10 * 1024 * 1024; // 10MB max for board_data JSON
const MAX_TITLE_LENGTH = 200;
const MAX_CATEGORY_LENGTH = 50;
const MAX_BOARDS_PER_USER = 100;

// Helper to validate board_data size and structure
function validateBoardData(boardData: any): { valid: boolean; error?: string } {
  if (boardData === null || boardData === undefined) {
    return { valid: true }; // Empty is allowed
  }

  try {
    const jsonStr = JSON.stringify(boardData);
    if (jsonStr.length > MAX_BOARD_DATA_SIZE) {
      return { valid: false, error: `Board data exceeds maximum size of ${MAX_BOARD_DATA_SIZE / 1024 / 1024}MB` };
    }
    
    // Check for excessive nesting (prevent DoS via deep recursion)
    const nestingDepth = getMaxNestingDepth(boardData);
    if (nestingDepth > 50) {
      return { valid: false, error: 'Board data has excessive nesting depth' };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid JSON structure in board_data' };
  }
}

// Helper to check JSON nesting depth
function getMaxNestingDepth(obj: any, currentDepth = 0): number {
  if (currentDepth > 50) return currentDepth; // Early exit for performance
  
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }
  
  let maxDepth = currentDepth;
  const values = Array.isArray(obj) ? obj : Object.values(obj);
  
  for (const value of values) {
    const depth = getMaxNestingDepth(value, currentDepth + 1);
    if (depth > maxDepth) maxDepth = depth;
    if (maxDepth > 50) break; // Early exit
  }
  
  return maxDepth;
}

// Helper to validate session
async function validateSession(supabase: any, token: string) {
  if (!token) {
    return null;
  }

  const { data: session, error } = await supabase
    .from('sessions')
    .select('id, user_id, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (error) {
    console.error('Session validation error');
    return null;
  }

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at) < new Date()) {
    return null;
  }

  return session;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use external Supabase if configured, otherwise fall back to default
    const supabaseUrl = Deno.env.get('EXTERNAL_SUPABASE_URL') || Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('EXTERNAL_SUPABASE_SERVICE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, token, ...data } = body;

    // Validate session for all operations
    const session = await validateSession(supabase, token);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = session.user_id;

    switch (action) {
      case 'list': {
        const { data: boards, error } = await supabase
          .from('vision_boards')
          .select('id, title, category, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ boards }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get': {
        const { boardId } = data;
        
        const { data: board, error } = await supabase
          .from('vision_boards')
          .select('*')
          .eq('id', boardId)
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        if (!board) {
          return new Response(
            JSON.stringify({ error: 'Board not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ board }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const { title, board_data, category } = data;

        // Validate title length
        if (title && title.length > MAX_TITLE_LENGTH) {
          return new Response(
            JSON.stringify({ error: `Title must be ${MAX_TITLE_LENGTH} characters or less` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate category length
        if (category && category.length > MAX_CATEGORY_LENGTH) {
          return new Response(
            JSON.stringify({ error: `Category must be ${MAX_CATEGORY_LENGTH} characters or less` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate board_data size and structure
        const boardValidation = validateBoardData(board_data);
        if (!boardValidation.valid) {
          return new Response(
            JSON.stringify({ error: boardValidation.error }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check user's board count limit
        const { count, error: countError } = await supabase
          .from('vision_boards')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (countError) throw countError;

        if (count !== null && count >= MAX_BOARDS_PER_USER) {
          return new Response(
            JSON.stringify({ error: `Maximum of ${MAX_BOARDS_PER_USER} boards allowed per user` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: board, error } = await supabase
          .from('vision_boards')
          .insert({
            user_id: userId,
            title: (title || 'Untitled Board').slice(0, MAX_TITLE_LENGTH),
            board_data: board_data || {},
            category: (category || 'personal').slice(0, MAX_CATEGORY_LENGTH),
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ board }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { boardId, title, board_data, category } = data;

        // Validate title length
        if (title !== undefined && title.length > MAX_TITLE_LENGTH) {
          return new Response(
            JSON.stringify({ error: `Title must be ${MAX_TITLE_LENGTH} characters or less` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate category length
        if (category !== undefined && category.length > MAX_CATEGORY_LENGTH) {
          return new Response(
            JSON.stringify({ error: `Category must be ${MAX_CATEGORY_LENGTH} characters or less` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate board_data size and structure
        if (board_data !== undefined) {
          const boardValidation = validateBoardData(board_data);
          if (!boardValidation.valid) {
            return new Response(
              JSON.stringify({ error: boardValidation.error }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title.slice(0, MAX_TITLE_LENGTH);
        if (board_data !== undefined) updateData.board_data = board_data;
        if (category !== undefined) updateData.category = category.slice(0, MAX_CATEGORY_LENGTH);

        const { data: board, error } = await supabase
          .from('vision_boards')
          .update(updateData)
          .eq('id', boardId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ board }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { boardId } = data;

        const { error } = await supabase
          .from('vision_boards')
          .delete()
          .eq('id', boardId)
          .eq('user_id', userId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'duplicate': {
        const { boardId } = data;

        // First, get the original board
        const { data: originalBoard, error: fetchError } = await supabase
          .from('vision_boards')
          .select('*')
          .eq('id', boardId)
          .eq('user_id', userId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        if (!originalBoard) {
          return new Response(
            JSON.stringify({ error: 'Board not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create a duplicate with a new title
        const { data: newBoard, error: insertError } = await supabase
          .from('vision_boards')
          .insert({
            user_id: userId,
            title: `${originalBoard.title} (Copy)`,
            board_data: originalBoard.board_data,
            category: originalBoard.category,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        console.log('Board duplicated successfully');

        return new Response(
          JSON.stringify({ board: newBoard }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Vision boards error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
