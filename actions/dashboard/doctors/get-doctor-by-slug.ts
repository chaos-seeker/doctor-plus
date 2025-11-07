import { supabaseClient } from '@/lib/supabase';
import type { Doctor } from '@/types/doctor';

export async function getDoctorBySlug(slug: string): Promise<Doctor | null> {
  const { data, error } = await supabaseClient
    .from('doctor')
    .select('*, category(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Doctor | null) ?? null;
}

