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

export interface UserProfileUpdateRequest {
  name: string;
  birth_date: string;
  gender: string;
  height: number;
  weight: number;
}

export interface UserBodyUpdateRequest {
  height?: number;
  weight?: number;
}

// Meal - 입력용 (프론트 → 백엔드)
export interface MealItem {
  food_name_kr: string;
  amount_g: number;
  category: string;
}

export interface MealCreateRequest {
  meal_type: string;
  eaten_at: string;
  image_url: string;
  note: string;
  items: MealItem[];
}

// Meal - 생성 응답
export interface CreateMealResponse {
  user_id: number;
  image_url: string;
  meal_id: number;
}

// Meal - 조회 응답 (백엔드 → 프론트)
export interface MealItemResponse {
  name: string;
  amount_g: number;
  calories: number;
  carb: number;
  protein: number;
  fat: number;
  sugar: number;
}

export interface MealResponse {
  id: number;
  user_id: number;
  eaten_at: string;
  image_url: string;
  meal_type: string;
  total_calories: number;
  total_carb: number;
  total_protein: number;
  total_fat: number;
  total_sugar: number;
  note: string;
  items: MealItemResponse[];
}

// Image Upload
export interface ImageUploadResponse {
  file_name: string;
  image_url: string;
  message: string;
}

// TDEE
export interface PeriodNutritionRequest {
  activity_level: string;
  start_date: string;
  end_date: string;
}

export interface DailyTdee {
  calories: number;
  tdee: number;
  message: string;
}

export interface PeriodTdee {
  date: string;
  daily_tdee: DailyTdee;
}

export interface OneDayActiveLevels {
  sedentary: number;
  light: number;
  moderate: number;
  active: number;
  very_active: number;
}

export interface OneDayTdeeResponse {
  total_calories: number;
  levels: OneDayActiveLevels;
  message: string;
}

// Sub Category
export interface SubCategoryResponse {
  name: string;
}
