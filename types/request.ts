export type Request = {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  gender: 'male' | 'female' | null;
  birth_date: string;
  phone: string;
  specialist: string;
  user_id: string | null;
  created_at: string;
};

