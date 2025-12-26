import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Get the app origin for cookie domain
const APP_ORIGIN = Deno.env.get('APP_ORIGIN') || '*';

const corsHeaders = {
  'Access-Control-Allow-Origin': APP_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

// Validation constants
const MAX_BOARD_DATA_SIZE = 10 * 1024 * 1024; // 10MB max for board_data JSON
const MAX_TITLE_LENGTH = 200;
const MAX_CATEGORY_LENGTH = 50;
const MAX_BOARDS_PER_USER = 100;

// Parse session token from cookies
function getSessionTokenFromCookies(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'session_token') {
      return value;
    }
  }
  return null;
}

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
    const { action, token: bodyToken, ...data } = body;

    // Try to get token from cookies first, then fall back to body (for backward compatibility)
    const token = getSessionTokenFromCookies(req) || bodyToken;

    // Validate session
    const session = await validateSession(supabase, token);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
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

        if (error) {
          console.error('Error fetching boards');
          return new Response(
            JSON.stringify({ error: 'Failed to fetch boards' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ boards }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get': {
        const { boardId } = data;
        
        if (!boardId) {
          return new Response(
            JSON.stringify({ error: 'Board ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: board, error } = await supabase
          .from('vision_boards')
          .select('*')
          .eq('id', boardId)
          .eq('user_id', userId)
          .single();

        if (error || !board) {
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
        const { title, category, boardData } = data;

        // Validate title
        const boardTitle = (title || 'Untitled Board').trim();
        if (boardTitle.length > MAX_TITLE_LENGTH) {
          return new Response(
            JSON.stringify({ error: `Title must be less than ${MAX_TITLE_LENGTH} characters` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate category
        const boardCategory = (category || 'personal').trim();
        if (boardCategory.length > MAX_CATEGORY_LENGTH) {
          return new Response(
            JSON.stringify({ error: `Category must be less than ${MAX_CATEGORY_LENGTH} characters` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate board data
        const validation = validateBoardData(boardData);
        if (!validation.valid) {
          return new Response(
            JSON.stringify({ error: validation.error }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check user's board count
        const { count } = await supabase
          .from('vision_boards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (count && count >= MAX_BOARDS_PER_USER) {
          return new Response(
            JSON.stringify({ error: `Maximum of ${MAX_BOARDS_PER_USER} boards allowed per user` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data: board, error } = await supabase
          .from('vision_boards')
          .insert({
            user_id: userId,
            title: boardTitle,
            category: boardCategory,
            board_data: boardData || {},
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating board');
          return new Response(
            JSON.stringify({ error: 'Failed to create board' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Board created successfully');

        return new Response(
          JSON.stringify({ board }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { boardId, title, category, boardData } = data;

        if (!boardId) {
          return new Response(
            JSON.stringify({ error: 'Board ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Verify board ownership
        const { data: existingBoard, error: fetchError } = await supabase
          .from('vision_boards')
          .select('id')
          .eq('id', boardId)
          .eq('user_id', userId)
          .single();

        if (fetchError || !existingBoard) {
          return new Response(
            JSON.stringify({ error: 'Board not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

        if (title !== undefined) {
          const boardTitle = title.trim();
          if (boardTitle.length > MAX_TITLE_LENGTH) {
            return new Response(
              JSON.stringify({ error: `Title must be less than ${MAX_TITLE_LENGTH} characters` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          updateData.title = boardTitle;
        }

        if (category !== undefined) {
          const boardCategory = category.trim();
          if (boardCategory.length > MAX_CATEGORY_LENGTH) {
            return new Response(
              JSON.stringify({ error: `Category must be less than ${MAX_CATEGORY_LENGTH} characters` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          updateData.category = boardCategory;
        }

        if (boardData !== undefined) {
          const validation = validateBoardData(boardData);
          if (!validation.valid) {
            return new Response(
              JSON.stringify({ error: validation.error }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          updateData.board_data = boardData;
        }

        const { data: board, error } = await supabase
          .from('vision_boards')
          .update(updateData)
          .eq('id', boardId)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating board');
          return new Response(
            JSON.stringify({ error: 'Failed to update board' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Board updated successfully');

        return new Response(
          JSON.stringify({ board }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { boardId } = data;

        if (!boardId) {
          return new Response(
            JSON.stringify({ error: 'Board ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('vision_boards')
          .delete()
          .eq('id', boardId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error deleting board');
          return new Response(
            JSON.stringify({ error: 'Failed to delete board' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Board deleted successfully');

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'duplicate': {
        const { boardId } = data;

        if (!boardId) {
          return new Response(
            JSON.stringify({ error: 'Board ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check user's board count
        const { count } = await supabase
          .from('vision_boards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (count && count >= MAX_BOARDS_PER_USER) {
          return new Response(
            JSON.stringify({ error: `Maximum of ${MAX_BOARDS_PER_USER} boards allowed per user` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get original board
        const { data: originalBoard, error: fetchError } = await supabase
          .from('vision_boards')
          .select('*')
          .eq('id', boardId)
          .eq('user_id', userId)
          .single();

        if (fetchError || !originalBoard) {
          return new Response(
            JSON.stringify({ error: 'Board not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create duplicate
        const { data: newBoard, error } = await supabase
          .from('vision_boards')
          .insert({
            user_id: userId,
            title: `${originalBoard.title} (Copy)`,
            category: originalBoard.category,
            board_data: originalBoard.board_data,
          })
          .select()
          .single();

        if (error) {
          console.error('Error duplicating board');
          return new Response(
            JSON.stringify({ error: 'Failed to duplicate board' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

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