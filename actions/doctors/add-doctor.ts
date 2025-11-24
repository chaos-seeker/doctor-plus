import { supabaseClient } from '@/lib/supabase';
import type { Doctor } from '@/types/doctor';

export async function addDoctor(
  payload: Pick<
    Doctor,
    | 'image'
    | 'full_name'
    | 'slug'
    | 'medical_code'
    | 'description'
    | 'documents'
    | 'category_id'
  >,
) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('دسترسی محدود شده است!');
  }

  const { data, error } = await supabaseClient
    .from('doctor')
    .insert(payload)
    .select('*, category(*)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Doctor;
}
