import { supabaseClient } from '@/lib/supabase';
import type { Category } from '@/types/category';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseClient
    .from('category')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Category[]) ?? [];
}
