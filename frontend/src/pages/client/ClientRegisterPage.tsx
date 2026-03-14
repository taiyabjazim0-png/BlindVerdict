import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";

import { FormInput } from "@/components/FormInput";
import { PasswordInput } from "@/components/PasswordInput";
import { useClientProfileStore } from "@/features/useClientProfileStore";
import { authService } from "@/services/auth";

const STEPS = ["Basic Info", "KYC", "Verification", "History & Terms"];

function FileUploadBox({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => ref.current?.click()}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition ${uploaded ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"}`}
    >
      {uploaded ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Upload className="h-5 w-5 text-slate-400" />}
      <span className={`text-sm ${uploaded ? "font-medium text-emerald-700" : "text-slate-600"}`}>
        {uploaded ? `${label} — Uploaded` : label}
      </span>
      <input ref={ref} type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { if (e.target.files?.[0]) onUpload(e.target.files[0]); }} />
    </div>
  );
}

export function ClientRegisterPage() {
  const navigate = useNavigate();
  const setProfile = useClientProfileStore((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", dob: "", gender: "", email: "", mobile: "", password: "",
    pan_uploaded: false, aadhar_uploaded: false,
    selfie_uploaded: false, address_verified: false,
    cases_history: "", terms_accepted: false,
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      setProfile({ name: form.name, dob: form.dob, gender: form.gender, email: form.email, mobile: form.mobile, pan_uploaded: form.pan_uploaded, aadhar_uploaded: form.aadhar_uploaded, selfie_uploaded: form.selfie_uploaded, address_verified: form.address_verified, cases_history: form.cases_history });
      navigate("/registration-pending");
    },
  });

  const canProceed = () => {
    if (step === 0) return form.name && form.dob && form.gender && form.email && form.mobile && form.password;
    if (step === 1) return form.pan_uploaded && form.aadhar_uploaded;
    if (step === 2) return form.selfie_uploaded && form.address_verified;
    if (step === 3) return form.terms_accepted;
    return true;
  };

  const handleSubmit = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else registerMutation.mutate({ name: form.name, email: form.email, password: form.password, role: "Client" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Client Registration</h1>
        <div className="mt-4 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-slate-200"}`} />
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

        <div className="mt-6 space-y-4">
          {step === 0 && (
            <>
              <FormInput label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <FormInput label="Date of birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Gender</span>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FormInput label="Mobile number" type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="10-digit mobile number" />
              <PasswordInput label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </>
          )}
          {step === 1 && (
            <>
              <p className="text-sm text-slate-600">Upload your government ID documents for KYC verification.</p>
              <FileUploadBox label="PAN Card" uploaded={form.pan_uploaded} onUpload={() => setForm({ ...form, pan_uploaded: true })} />
              <FileUploadBox label="Aadhar Card" uploaded={form.aadhar_uploaded} onUpload={() => setForm({ ...form, aadhar_uploaded: true })} />
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-slate-600">Complete identity verification.</p>
              <FileUploadBox label="Selfie for Verification" uploaded={form.selfie_uploaded} onUpload={() => setForm({ ...form, selfie_uploaded: true })} />
              <FileUploadBox label="Address Proof Document" uploaded={form.address_verified} onUpload={() => setForm({ ...form, address_verified: true })} />
            </>
          )}
          {step === 3 && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Past legal cases (if any)</span>
                <textarea value={form.cases_history} onChange={(e) => setForm({ ...form, cases_history: e.target.value })} rows={3} placeholder="Brief description of any past legal cases..." className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                <input type="checkbox" checked={form.terms_accepted} onChange={(e) => setForm({ ...form, terms_accepted: e.target.checked })} className="mt-1 h-4 w-4 accent-primary" />
                <span className="text-sm text-slate-700">
                  I agree to the{" "}
                  <Link to="/terms" target="_blank" className="font-medium text-primary hover:underline">Terms and Conditions</Link>{" "}
                  of BlindVerdict.
                </span>
              </label>
            </>
          )}
        </div>

        {registerMutation.isError && (
          <p className="mt-3 text-sm text-red-600">{(registerMutation.error as any)?.response?.data?.detail || "Registration failed."}</p>
        )}

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Back</button>
          )}
          <button onClick={handleSubmit} disabled={!canProceed() || registerMutation.isPending} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50">
            {step < STEPS.length - 1 ? "Continue" : registerMutation.isPending ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/register" className="font-medium text-primary hover:underline">Back to role selection</Link>
        </p>
      </div>
    </div>
  );
}
