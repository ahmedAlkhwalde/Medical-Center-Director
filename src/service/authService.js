import { useMutation } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

export const loginUser = async (payload) => {
  const response = await apiClient.post("/admin/login", payload);
  const data = response.data;
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data;
};

export const logoutUser = async (token) => {
  const response = await apiClient.post(
    "/admin/logout",
    null,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  );
  return response.data;
};

export const useLoginMutation = (options = {}) =>
  useMutation({
    mutationFn: loginUser,
    ...options,
  });

export const useLogoutMutation = (options = {}) =>
  useMutation({
    mutationFn: logoutUser,
    ...options,
  });
