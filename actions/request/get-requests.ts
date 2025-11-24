import { supabaseClient } from '@/lib/supabase';
import type { Request } from '@/types/request';

export async function getRequests(): Promise<Request[]> {
  const { data, error } = await supabaseClient
    .from('request')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Request[]) ?? [];
}

