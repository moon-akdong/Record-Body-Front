import {
  TokenResponse,
  RegisterRequest,
  User,
  MealCreateRequest,
  CreateMealResponse,
  MealResponse,
  ImageUploadResponse,
  SubCategoryResponse,
} from "@/types/api";
import { getToken, removeToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "/api";
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams)
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined" && !path.startsWith("/users/login")) {
      window.location.href = "/login";
    }
    throw new ApiError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error("API Error:", res.status, JSON.stringify(body, null, 2));
    const detail = Array.isArray(body.detail)
      ? body.detail.map((d: { loc?: string[]; msg?: string }) => `${d.loc?.join(".")}: ${d.msg}`).join(", ")
      : body.detail || res.statusText;
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export async function login(
  email: string,
  password: string
): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  return request<TokenResponse>("/users/login", {
    method: "POST",
    body,
  });
}

export async function register(data: RegisterRequest): Promise<User> {
  return request<User>("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// User
export async function getMe(): Promise<User> {
  return request<User>("/users/me");
}

// Meals
export async function createMeal(
  data: MealCreateRequest
): Promise<CreateMealResponse> {
  return request<CreateMealResponse>("/meals/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMealsByDate(
  date: Date
): Promise<MealResponse[]> {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const dateStr = `${y}-${m}-${d}T00:00:00`;
  return request<MealResponse[]>(
    `/meals/by-date?eaten_at=${encodeURIComponent(dateStr)}`
  );
}

export async function getMealById(mealId: number): Promise<MealResponse> {
  return request<MealResponse>(`/meals/id/${mealId}`);
}

export async function deleteMeal(mealId: number): Promise<void> {
  return request<void>(`/meals/${mealId}`, { method: "DELETE" });
}

// Record Dates
export async function getRecordDates(
  year: number,
  month: number
): Promise<string[]> {
  const data = await request<{ month: string[] }>(
    `/check_record/month_record?year=${year}&month=${month}`
  );
  return data.month;
}

// Sub Categories
export async function getSubCategories(): Promise<string[]> {
  const data = await request<SubCategoryResponse[]>("/meals/sub-category");
  return data.map((item) => item.name);
}

// Image Upload
export async function uploadImage(
  file: File
): Promise<ImageUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return request<ImageUploadResponse>("/upload/image", {
    method: "POST",
    body: formData,
  });
}

export { ApiError };
