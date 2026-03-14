import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Scale } from "lucide-react";

import { FormInput } from "@/components/FormInput";
import { PasswordInput } from "@/components/PasswordInput";
import { useAuthStore } from "@/hooks/useAuthStore";
import { authService } from "@/services/auth";

export function LandingPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [loginRole, setLoginRole] = useState<"Client" | "Lawyer">("Client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => { setUser(data); navigate(data.role === "Client" ? "/client/dashboard" : "/lawyer/dashboard"); },
  });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-slate-900">BlindVerdict</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-sm text-slate-500 transition hover:text-slate-700">Terms</Link>
            <Link to="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">Register</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex flex-1 max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full gap-16 lg:grid-cols-2 lg:items-center">
          <div className="hidden lg:block">
            <h2 className="text-4xl font-bold leading-tight text-slate-900">
              AI-Powered Legal<br />
              <span className="text-primary">Accessibility Platform</span>
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-500">
              Connect with verified lawyers, manage your cases, and get AI-powered legal analysis — all in one secure platform.
            </p>
            <div className="mt-8 flex gap-6 text-sm text-slate-400">
              <div><p className="text-2xl font-bold text-slate-900">20+</p><p>Verified Lawyers</p></div>
              <div><p className="text-2xl font-bold text-slate-900">AI</p><p>Case Analysis</p></div>
              <div><p className="text-2xl font-bold text-slate-900">256-bit</p><p>Encryption</p></div>
            </div>
          </div>

          <div className="w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>

              <div className="mt-6 space-y-4">
                <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Login as</span>
                    <select value={loginRole} onChange={(e) => setLoginRole(e.target.value as "Client" | "Lawyer")} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-primary">
                      <option value="Client">Client</option>
                      <option value="Lawyer">Lawyer</option>
                    </select>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password</Link>
                </div>

                <button onClick={() => loginMutation.mutate({ email, password })} disabled={loginMutation.isPending || !email || !password} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50">
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>

                {loginMutation.isError && <p className="text-sm text-red-600">Invalid credentials. Please try again.</p>}

                <p className="text-center text-sm text-slate-500">
                  New user?{" "}<Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/60 bg-white/80 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-slate-400">
          <span>BlindVerdict 2026</span>
          <div className="flex gap-4">
            <Link to="/terms" className="transition hover:text-slate-600">Terms</Link>
            <a href="#" className="transition hover:text-slate-600">Privacy</a>
            <a href="#" className="transition hover:text-slate-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
