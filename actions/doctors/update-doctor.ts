import { supabaseClient } from '@/lib/supabase';
import type { Doctor } from '@/types/doctor';

export async function updateDoctor(
  payload: Partial<
    Pick<
      Doctor,
      | 'image'
      | 'full_name'
      | 'slug'
      | 'medical_code'
      | 'description'
      | 'documents'
      | 'category_id'
    >
  > & {
    id: string | number;
  },
) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('دسترسی محدود شده است!');
  }

  const { id, ...rest } = payload;

  const updates: Record<string, unknown> = {};
  if (rest.image !== undefined) updates.image = rest.image;
  if (rest.full_name !== undefined) updates.full_name = rest.full_name;
  if (rest.slug !== undefined) updates.slug = rest.slug;
  if (rest.medical_code !== undefined) updates.medical_code = rest.medical_code;
  if (rest.description !== undefined) updates.description = rest.description;
  if (rest.documents !== undefined) updates.documents = rest.documents;
  if (rest.category_id !== undefined) updates.category_id = rest.category_id;

  const { data, error } = await supabaseClient
    .from('doctor')
    .update(updates)
    .eq('id', id)
    .select('*, category(*)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Doctor;
}
