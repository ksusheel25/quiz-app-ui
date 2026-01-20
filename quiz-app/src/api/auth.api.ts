// auth.api.ts
import axiosClient from "./axiosClient";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

export const loginUser = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const { data: response } = await axiosClient.post<AuthResponse>(
    "/api/auth/login",
    data
  );
  // Store email and role in localStorage for later use
  localStorage.setItem("userEmail", response.email);
  localStorage.setItem("userRole", response.role);
  return response;
};

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "ADMIN";
}

export const registerUser = async (
  data: RegisterUserRequest
): Promise<void> => {
  await axiosClient.post("/api/users/register", data);
};

export const isLoggedIn = () => !!localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
};

export const getUserEmail = () => localStorage.getItem("userEmail") || "";
export const getUserRole = () => localStorage.getItem("userRole") as "STUDENT" | "ADMIN" | null;