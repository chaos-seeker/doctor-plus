import { supabaseClient } from '@/lib/supabase';
import type { Category } from '@/types/category';

export async function getCategory(id: string): Promise<Category | null> {
  const { data, error } = await supabaseClient
    .from('category')
    .select('*')
    .eq('id', id)
    .maybeSingle<Category>();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
}
