// Auth
export interface LoginRequest {
  username: string; // email value
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  birth_date: string;
  gender: string;
  height: number;
  weight: number;
}

// User
export interface User {
  name: string;
  email: string;
  birth_date: string;
  gender: string;
  height: number;
  weight: number;
  created_at: string;
}

// Meal
export interface MealItem {
  food_name: string;
  amount_g: number;
  category: string;
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
}

export interface MealCreateRequest {
  meal_type: string;
  eaten_at: string;
  image_url?: string;
  memo?: string;
  items: MealItem[];
}

export interface MealItemResponse extends MealItem {
  id: number;
  meal_id: number;
}

export interface MealResponse {
  id: number;
  user_id: number;
  meal_type: string;
  eaten_at: string;
  image_url: string | null;
  memo: string | null;
  created_at: string;
  items: MealItemResponse[];
}

// Image Upload
export interface ImageUploadResponse {
  image_url: string;
}
