import { useState } from "react";

import { Card } from "@/components/Card";
import { PasswordInput } from "@/components/PasswordInput";
import { useLawyerProfileStore } from "@/features/useLawyerProfileStore";
import { useAuthStore } from "@/hooks/useAuthStore";

export function LawyerProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useLawyerProfileStore((s) => s.profile);
  const [showPw, setShowPw] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChange = () => {
    if (newPw !== confirm) { alert("Passwords do not match."); return; }
    if (newPw.length < 6) { alert("Password must be at least 6 characters."); return; }
    alert("Password change requested.");
    setShowPw(false);
    setCurrent("");
    setNewPw("");
    setConfirm("");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Your registration details (read-only except password)</p>

        <div className="mt-6 space-y-4">
          <Section title="Personal information">
            <Field label="Legal name" value={profile?.legal_name || user?.name || "—"} />
            <Field label="Email" value={profile?.email || "—"} />
            <Field label="Date of birth" value={profile?.dob || "—"} />
            <Field label="Mobile" value={profile?.mobile || "—"} />
          </Section>

          {profile && (
            <>
              <Section title="KYC & Verification">
                {profile.pan_uploaded && <p className="text-sm text-slate-600">PAN card uploaded</p>}
                {profile.aadhar_uploaded && <p className="text-sm text-slate-600">Aadhar card uploaded</p>}
                {profile.selfie_uploaded && <p className="text-sm text-slate-600">Selfie verification completed</p>}
              </Section>

              <Section title="Professional License">
                <Field label="Bar Council enrolment" value={profile.bar_council_enrolment} />
                <Field label="Bar Council state" value={profile.bar_council_state} />
                <Field label="Enrolment date" value={profile.enrolment_date} />
              </Section>

              <Section title="Legal Education">
                <Field label="Law degree" value={profile.law_degree} />
                <Field label="University" value={profile.uni_name} />
                <Field label="Graduation year" value={profile.grad_year} />
              </Section>

              <Section title="Experience">
                <Field label="Firms / Associations" value={profile.firms || "—"} />
                <Field label="Areas of excellence" value={profile.area_of_excellence.join(", ") || "—"} />
              </Section>
            </>
          )}

          <div className="border-t border-slate-200 pt-4">
            <button onClick={() => setShowPw(!showPw)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium">
              Change password
            </button>
            {showPw && (
              <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <PasswordInput label="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} />
                <PasswordInput label="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                <PasswordInput label="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <div className="flex gap-2">
                  <button onClick={handleChange} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Update password</button>
                  <button onClick={() => setShowPw(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
