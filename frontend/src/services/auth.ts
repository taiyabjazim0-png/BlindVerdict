import { api } from "./api";

export const authService = {
  register: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
};
