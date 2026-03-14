import { create } from "zustand";
import { persist } from "zustand/middleware";

import { setAuthToken } from "@/services/api";
import { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        setAuthToken(user.access_token);
        set({ user });
      },
      logout: () => {
        setAuthToken(undefined);
        set({ user: null });
      },
    }),
    {
      name: "blindverdict-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.user?.access_token) setAuthToken(state.user.access_token);
      },
    }
  )
);
