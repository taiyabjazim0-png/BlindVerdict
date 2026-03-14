import { Link } from "react-router-dom";
import { Scale, User, Briefcase } from "lucide-react";

export function RegisterRolePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Scale className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">Choose how you want to use BlindVerdict</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link to="/register/client" className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 text-left transition hover:border-primary/40 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"><User className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-sm font-bold text-slate-900">Register as Client</p><p className="text-xs text-slate-500">Get legal help and connect with lawyers</p></div>
          </Link>
          <Link to="/register/lawyer" className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-5 text-left transition hover:border-primary/40 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50"><Briefcase className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm font-bold text-slate-900">Register as Lawyer</p><p className="text-xs text-slate-500">Offer your legal expertise and grow your practice</p></div>
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500">Already have an account? <Link to="/" className="font-medium text-primary hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
