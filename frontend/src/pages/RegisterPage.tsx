import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, CheckCircle } from "lucide-react";

import { FormInput } from "@/components/FormInput";
import { PasswordInput } from "@/components/PasswordInput";
import { useLawyerProfileStore } from "@/features/useLawyerProfileStore";
import { authService } from "@/services/auth";

const STEPS = ["Personal Info", "KYC & Verification", "Professional License", "Legal Education", "Experience & Terms"];
const AREAS = ["Criminal Law", "Civil Litigation", "Family Law", "Property Law", "Corporate Law", "Labour Law", "Taxation"];

function FileUploadBox({ label, uploaded, onUpload }: { label: string; uploaded: boolean; onUpload: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div onClick={() => ref.current?.click()} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 transition ${uploaded ? "border-emerald-300 bg-emerald-50" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"}`}>
      {uploaded ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Upload className="h-5 w-5 text-slate-400" />}
      <span className={`text-sm ${uploaded ? "font-medium text-emerald-700" : "text-slate-600"}`}>{uploaded ? `${label} — Uploaded` : label}</span>
      <input ref={ref} type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => { if (e.target.files?.[0]) onUpload(e.target.files[0]); }} />
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const setLawyerProfile = useLawyerProfileStore((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    legal_name: "", dob: "", email: "", mobile: "", password: "",
    pan_uploaded: false, aadhar_uploaded: false, selfie_uploaded: false,
    bar_council_enrolment: "", bar_council_state: "", enrolment_date: "", bar_certificate_uploaded: false,
    law_degree: "", uni_name: "", grad_year: "",
    degree_certificate_uploaded: false, marksheets_uploaded: false, bar_exam_proof_uploaded: false,
    firms: "", area_of_excellence: [] as string[], past_cases_brief: "", terms_accepted: false,
  });

  const toggleArea = (area: string) => {
    setForm((prev) => ({ ...prev, area_of_excellence: prev.area_of_excellence.includes(area) ? prev.area_of_excellence.filter((a) => a !== area) : [...prev.area_of_excellence, area] }));
  };

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      setLawyerProfile({ legal_name: form.legal_name, dob: form.dob, email: form.email, mobile: form.mobile, pan_uploaded: form.pan_uploaded, aadhar_uploaded: form.aadhar_uploaded, selfie_uploaded: form.selfie_uploaded, bar_council_enrolment: form.bar_council_enrolment, bar_council_state: form.bar_council_state, enrolment_date: form.enrolment_date, bar_certificate_uploaded: form.bar_certificate_uploaded, law_degree: form.law_degree, uni_name: form.uni_name, grad_year: form.grad_year, degree_certificate_uploaded: form.degree_certificate_uploaded, marksheets_uploaded: form.marksheets_uploaded, bar_exam_proof_uploaded: form.bar_exam_proof_uploaded, firms: form.firms, area_of_excellence: form.area_of_excellence, past_cases_brief: form.past_cases_brief, payment_upi: "" });
      navigate("/registration-pending");
    },
  });

  const canProceed = () => {
    if (step === 0) return form.legal_name && form.dob && form.email && form.mobile && form.password;
    if (step === 1) return form.pan_uploaded && form.aadhar_uploaded && form.selfie_uploaded;
    if (step === 2) return form.bar_council_enrolment && form.bar_council_state && form.enrolment_date;
    if (step === 3) return form.law_degree && form.uni_name && form.grad_year;
    if (step === 4) return form.area_of_excellence.length > 0 && form.terms_accepted;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else registerMutation.mutate({ name: form.legal_name, email: form.email, password: form.password, role: "Lawyer", bar_council_id: form.bar_council_enrolment, specialization: form.area_of_excellence.join(", "), years_of_experience: form.grad_year ? new Date().getFullYear() - Number(form.grad_year) : 0 });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Lawyer Registration</h1>
        <div className="mt-4 flex gap-1">
          {STEPS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-slate-200"}`} />)}
        </div>
        <p className="mt-2 text-sm text-slate-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>

        <div className="mt-6 space-y-4">
          {step === 0 && (
            <>
              <FormInput label="Legal name" value={form.legal_name} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} />
              <FormInput label="Date of birth" type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FormInput label="Mobile number" type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <PasswordInput label="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </>
          )}
          {step === 1 && (
            <>
              <p className="text-sm text-slate-600">Upload government ID and complete selfie verification.</p>
              <FileUploadBox label="PAN Card" uploaded={form.pan_uploaded} onUpload={() => setForm({ ...form, pan_uploaded: true })} />
              <FileUploadBox label="Aadhar Card" uploaded={form.aadhar_uploaded} onUpload={() => setForm({ ...form, aadhar_uploaded: true })} />
              <FileUploadBox label="Selfie for Verification" uploaded={form.selfie_uploaded} onUpload={() => setForm({ ...form, selfie_uploaded: true })} />
            </>
          )}
          {step === 2 && (
            <>
              <FormInput label="Bar Council enrolment number" value={form.bar_council_enrolment} onChange={(e) => setForm({ ...form, bar_council_enrolment: e.target.value })} />
              <FormInput label="Bar Council state" value={form.bar_council_state} onChange={(e) => setForm({ ...form, bar_council_state: e.target.value })} />
              <FormInput label="Enrolment date" type="date" value={form.enrolment_date} onChange={(e) => setForm({ ...form, enrolment_date: e.target.value })} />
              <FileUploadBox label="Bar Council Certificate" uploaded={form.bar_certificate_uploaded} onUpload={() => setForm({ ...form, bar_certificate_uploaded: true })} />
            </>
          )}
          {step === 3 && (
            <>
              <FormInput label="Law degree" value={form.law_degree} onChange={(e) => setForm({ ...form, law_degree: e.target.value })} placeholder="e.g. LLB, LLM" />
              <FormInput label="University name" value={form.uni_name} onChange={(e) => setForm({ ...form, uni_name: e.target.value })} />
              <FormInput label="Graduation year" type="number" value={form.grad_year} onChange={(e) => setForm({ ...form, grad_year: e.target.value })} />
              <FileUploadBox label="Degree Certificate" uploaded={form.degree_certificate_uploaded} onUpload={() => setForm({ ...form, degree_certificate_uploaded: true })} />
              <FileUploadBox label="Marksheets (Optional)" uploaded={form.marksheets_uploaded} onUpload={() => setForm({ ...form, marksheets_uploaded: true })} />
              <FileUploadBox label="Bar Exam Qualification Proof" uploaded={form.bar_exam_proof_uploaded} onUpload={() => setForm({ ...form, bar_exam_proof_uploaded: true })} />
            </>
          )}
          {step === 4 && (
            <>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Current and past firms / associations</span>
                <textarea value={form.firms} onChange={(e) => setForm({ ...form, firms: e.target.value })} rows={3} placeholder="List your firms..." className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <div>
                <span className="mb-2 block text-sm font-medium text-slate-700">Area of excellence</span>
                <div className="flex flex-wrap gap-2">
                  {AREAS.map((area) => (
                    <button key={area} type="button" onClick={() => toggleArea(area)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${form.area_of_excellence.includes(area) ? "border-primary bg-indigo-50 text-primary" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{area}</button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Past cases (brief, no client names)</span>
                <textarea value={form.past_cases_brief} onChange={(e) => setForm({ ...form, past_cases_brief: e.target.value })} rows={3} placeholder="Brief description..." className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-primary" />
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                <input type="checkbox" checked={form.terms_accepted} onChange={(e) => setForm({ ...form, terms_accepted: e.target.checked })} className="mt-1 h-4 w-4 accent-primary" />
                <span className="text-sm text-slate-700">I agree to the{" "}<Link to="/terms" target="_blank" className="font-medium text-primary hover:underline">Terms and Conditions</Link>{" "}of BlindVerdict.</span>
              </label>
            </>
          )}
        </div>

        {registerMutation.isError && <p className="mt-3 text-sm text-red-600">{(registerMutation.error as any)?.response?.data?.detail || "Registration failed."}</p>}

        <div className="mt-6 flex gap-3">
          {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Back</button>}
          <button onClick={handleNext} disabled={!canProceed() || registerMutation.isPending} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50">
            {step < STEPS.length - 1 ? "Continue" : registerMutation.isPending ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500"><Link to="/register" className="font-medium text-primary hover:underline">Back to role selection</Link></p>
      </div>
    </div>
  );
}
