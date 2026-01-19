import axiosClient from "./axiosClient";

export interface LoginRequest { email: string; password: string; }
export interface AuthResponse { token: string; email: string; role: string; }

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const res = await axiosClient.post("/api/auth/login", data);
  return res.data;
};

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "ADMIN";
}

export const registerUser = async (data: RegisterUserRequest): Promise<any> => {
  const res = await axiosClient.post("/api/users/register", data);
  return res.data;
};
