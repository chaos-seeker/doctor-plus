import type { Category } from './category';

export type Doctor = {
  id: string;
  image: string;
  full_name: string;
  slug: string;
  medical_code: string;
  description: string;
  documents: string[];
  category_id: string;
  category: Category | null;
  created_at: string;
};
