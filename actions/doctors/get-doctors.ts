import { supabaseClient } from '@/lib/supabase';
import type { Doctor } from '@/types/doctor';

export async function getDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabaseClient
    .from('doctor')
    .select('*, category(*)')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Doctor[]) ?? [];
}
