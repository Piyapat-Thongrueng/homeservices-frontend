export interface Category {
  id: number;
  name: string;
  name_th: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number | null;
  min_price: number | null;
  max_price: number | null;
  category_id: number;
  category_name: string;
  category_name_th: string;
  image: string;
  avg_rating: number;
  order_count: number;
  created_at: string;
}

export interface ServiceFilterParams {
  search?: string;
  category_id?: number | null;
  min_price?: number;
  max_price?: number;
  sort_by?: string;   // "name" | "price" | "created_at"
  order?: string;     // "ASC" | "DESC"
  filter?: string;    // "recommended" | "popular"
}