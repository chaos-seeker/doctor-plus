import { supabaseClient } from '@/lib/supabase';

export interface Category {
  id: string;
  name_fa: string;
  slug: string;
  image: string;
  created_at: string;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseClient
    .from('category')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
