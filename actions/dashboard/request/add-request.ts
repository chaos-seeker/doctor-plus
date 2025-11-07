import { supabaseClient } from '@/lib/supabase';
import type { Request } from '@/types/request';

export async function addRequest(
  payload: Pick<
    Request,
    | 'first_name'
    | 'last_name'
    | 'national_id'
    | 'gender'
    | 'birth_date'
    | 'phone'
    | 'specialist'
    | 'user_id'
  >,
) {
  const { data, error } = await supabaseClient
    .from('request')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Request;
}

