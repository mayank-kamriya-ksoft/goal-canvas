import { supabase } from "@/integrations/supabase/client";
import type { TemplatesResponse, VisionBoardTemplate } from "@/types/templates";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export async function fetchTemplates(category?: string): Promise<TemplatesResponse> {
  const url = new URL(`${FUNCTIONS_URL}/templates`);
  if (category) {
    url.searchParams.set('category', category);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return response.json();
}

export async function getTemplateById(id: string): Promise<VisionBoardTemplate | null> {
  const { templates } = await fetchTemplates();
  return templates.find(t => t.id === id) || null;
}
