import { supabaseClient } from '@/lib/supabase';
import type { Doctor } from '@/types/doctor';

export async function getDoctor(id: string): Promise<Doctor | null> {
  const { data, error } = await supabaseClient
    .from('doctor')
    .select('*, category(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Doctor | null) ?? null;
}
