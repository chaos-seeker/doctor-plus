import { supabaseClient } from '@/lib/supabase';

export async function deleteDoctor(id: string | number) {
  const { error } = await supabaseClient.from('doctor').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
