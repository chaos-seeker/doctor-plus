import { supabaseClient } from '@/lib/supabase';

export async function deleteCategory(id: string | number) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('دسترسی محدود شده است!');
  }

  const { error } = await supabaseClient.from('category').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
