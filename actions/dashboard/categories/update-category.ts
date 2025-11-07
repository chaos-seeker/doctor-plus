import { supabaseClient } from '@/lib/supabase';

export async function updateCategory(
  payload: Partial<{ name: string; slug: string }> & { id: string | number },
) {
  const { id, ...rest } = payload;

  const updates: Record<string, unknown> = {};
  if (rest.name !== undefined) updates.name = rest.name;
  if (rest.slug !== undefined) updates.slug = rest.slug;

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
