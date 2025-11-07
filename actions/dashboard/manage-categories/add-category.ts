import { supabaseClient } from '@/lib/supabase';
import type { Category } from '@/types/category';

export async function addCategory(
  payload: Pick<Category, 'name' | 'slug' | 'image'>,
) {
  const { data, error } = await supabaseClient
    .from('category')
    .insert({
      name: payload.name,
      slug: payload.slug,
      image: payload.image,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data;
}
