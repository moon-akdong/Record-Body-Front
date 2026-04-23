import {
  TokenResponse,
  RegisterRequest,
  User,
  MealCreateRequest,
  MealResponse,
  ImageUploadResponse,
} from "@/types/api";
import { getToken, removeToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError(401, "Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail || res.statusText);
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
): Promise<MealResponse> {
  return request<MealResponse>("/meals/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMealsByDate(
  date: Date
): Promise<MealResponse[]> {
  const dateStr = date.toISOString();
  return request<MealResponse[]>(
    `/meals/by-date?eaten_at=${encodeURIComponent(dateStr)}`
  );
}

export async function getMealById(mealId: number): Promise<MealResponse> {
  return request<MealResponse>(`/meals/${mealId}`);
}

export async function deleteMeal(mealId: number): Promise<void> {
  return request<void>(`/meals/${mealId}`, { method: "DELETE" });
}

// Sub Categories
export async function getSubCategories(): Promise<string[]> {
  return request<string[]>("/meals/sub-category");
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
