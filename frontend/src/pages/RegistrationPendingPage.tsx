import { Link } from "react-router-dom";
import { Clock, CheckCircle, Shield } from "lucide-react";

export function RegistrationPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-slate-900">Registration Received</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-slate-600">
          Thank you for registering with BlindVerdict. We have received your application and our team is manually verifying your profile and documents.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-slate-800">Document Verification</p>
              <p className="mt-1 text-xs text-slate-500">Your identity documents and credentials are being reviewed for authenticity.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-sm font-medium text-slate-800">Profile Approval</p>
              <p className="mt-1 text-xs text-slate-500">Once verified, you will receive a confirmation email and can log in to your account.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-slate-800">Estimated Timeline</p>
              <p className="mt-1 text-xs text-slate-500">Please allow up to <strong>7 working days</strong> for the verification process to complete.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
