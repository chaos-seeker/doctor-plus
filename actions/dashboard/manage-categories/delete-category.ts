import { supabaseClient } from '@/lib/supabase';

export async function deleteCategory(id: string | number) {
  const { error } = await supabaseClient.from('category').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
