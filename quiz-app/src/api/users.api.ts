import axiosClient from "./axiosClient";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await axiosClient.get<User[]>("/api/users");
  return data;
};

// Update user role
export const updateUserRole = async (
  userId: number,
  role: "STUDENT" | "ADMIN"
): Promise<User> => {
  const { data } = await axiosClient.put<User>(
    `/api/users/${userId}/role?role=${role}`
  );
  return data;
};
