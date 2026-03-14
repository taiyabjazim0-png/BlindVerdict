import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ClientProfileData {
  name: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  pan_uploaded: boolean;
  aadhar_uploaded: boolean;
  selfie_uploaded: boolean;
  address_verified: boolean;
  cases_history: string;
}

interface ClientProfileState {
  profile: ClientProfileData | null;
  setProfile: (p: ClientProfileData) => void;
}

export const useClientProfileStore = create<ClientProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    { name: "blindverdict-client-profile" }
  )
);
