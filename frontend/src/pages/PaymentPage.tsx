import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CreditCard, Shield, CheckCircle, ArrowRight, Info } from "lucide-react";

export function PaymentPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const role = searchParams.get("role") || "client";
  const budget = searchParams.get("budget") || "";

  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const isValid = accountNumber.length >= 8 && accountNumber === confirmAccount && ifsc.length >= 8 && holderName.trim().length > 2 && agreed;

  const handlePay = () => {
    if (!isValid) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => navigate(redirectTo, { replace: true }), 1800);
    }, 2200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <CreditCard className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Platform Payment</h1>
          <p className="mt-1 text-sm text-slate-500">
            Complete payment to {role === "lawyer" ? "begin working on the case" : "activate your case workspace"}
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Payment Successful</h2>
            <p className="mt-2 text-sm text-slate-500">Redirecting you to your dashboard...</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full animate-pulse rounded-full bg-emerald-400" style={{ width: "100%" }} />
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
              <div className="flex gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">5% Platform Commission</p>
                  <p className="mt-1 text-xs text-amber-700">
                    BlindVerdict charges a <strong>5% commission</strong> on the total case value as a platform facilitation fee.
                    This covers mediator coordination, secure document management, encrypted communication, and AI-powered case assistance.
                  </p>
                  {budget && (
                    <p className="mt-2 text-xs font-medium text-amber-800">
                      Estimated case budget: <span className="font-bold">{budget}</span> — Commission will be calculated on final settlement amount.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Shield className="h-4 w-4 text-primary" />
                Bank Account Details
              </h3>
              <p className="mt-1 text-xs text-slate-400">Your account details are encrypted and stored securely.</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Account Holder Name</label>
                  <input
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="As per bank records"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Account Number</label>
                  <input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter account number"
                    type="password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">Confirm Account Number</label>
                  <input
                    value={confirmAccount}
                    onChange={(e) => setConfirmAccount(e.target.value.replace(/\D/g, ""))}
                    placeholder="Re-enter account number"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  {confirmAccount && confirmAccount !== accountNumber && (
                    <p className="mt-1 text-xs text-red-500">Account numbers do not match</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">IFSC Code</label>
                  <input
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="e.g. SBIN0001234"
                    maxLength={11}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-mono uppercase outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                  {ifsc && ifsc.length < 11 && (
                    <p className="mt-1 text-xs text-slate-400">IFSC code must be 11 characters</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800">Fee Breakdown</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Platform facilitation fee</span>
                  <span className="font-medium">5% of settlement</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Mediator coordination</span>
                  <span className="font-medium text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Secure document vault</span>
                  <span className="font-medium text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>AI case assistant</span>
                  <span className="font-medium text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Encrypted communication</span>
                  <span className="font-medium text-emerald-600">Included</span>
                </div>
                <div className="mt-2 border-t border-dashed border-slate-200 pt-2">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Commission</span>
                    <span>5% on final amount</span>
                  </div>
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition hover:border-primary/30">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary accent-primary" />
              <span className="text-xs text-slate-600 leading-relaxed">
                I agree to BlindVerdict's <strong>5% commission</strong> on the final case settlement amount. I understand that the commission will be deducted upon case resolution. I also agree to the platform's Terms & Conditions and Privacy Policy.
              </span>
            </label>

            <button
              onClick={handlePay}
              disabled={!isValid || processing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Confirm and Proceed
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-400">
              Secured by 256-bit encryption. Your bank details are never stored on our servers.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
