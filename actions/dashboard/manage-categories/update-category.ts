import { supabaseClient } from '@/lib/supabase';
import type { Category } from '@/types/category';

export async function updateCategory(
  payload: Partial<Pick<Category, 'name' | 'slug' | 'image'>> & {
    id: string | number;
  },
) {
  const { id, ...rest } = payload;

  const updates: Record<string, unknown> = {};
  if (rest.name !== undefined) updates.name = rest.name;
  if (rest.slug !== undefined) updates.slug = rest.slug;
  if (rest.image !== undefined) updates.image = rest.image;

  const { data, error } = await supabaseClient
    .from('category')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
