import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LawyerProfileData {
  legal_name: string;
  dob: string;
  email: string;
  mobile: string;
  pan_uploaded: boolean;
  aadhar_uploaded: boolean;
  selfie_uploaded: boolean;
  bar_council_enrolment: string;
  bar_council_state: string;
  enrolment_date: string;
  bar_certificate_uploaded: boolean;
  law_degree: string;
  uni_name: string;
  grad_year: string;
  degree_certificate_uploaded: boolean;
  marksheets_uploaded: boolean;
  bar_exam_proof_uploaded: boolean;
  firms: string;
  area_of_excellence: string[];
  past_cases_brief: string;
  payment_upi: string;
}

interface LawyerProfileState {
  profile: LawyerProfileData | null;
  setProfile: (p: LawyerProfileData) => void;
}

export const useLawyerProfileStore = create<LawyerProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
    }),
    { name: "blindverdict-lawyer-profile" }
  )
);
