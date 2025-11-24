import { supabaseClient } from '@/lib/supabase';

export async function addCategory(payload: { name: string; slug: string }) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('دسترسی محدود شده است!');
  }

  const { data, error } = await supabaseClient
    .from('category')
    .insert({
      name: payload.name,
      slug: payload.slug,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return data;
}
