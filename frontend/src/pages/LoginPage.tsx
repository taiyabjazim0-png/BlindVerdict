import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Card } from "@/components/Card";
import { FormInput } from "@/components/FormInput";
import { useAuthStore } from "@/hooks/useAuthStore";
import { authService } from "@/services/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data);
      navigate(data.role === "Client" ? "/client/dashboard" : "/lawyer/dashboard");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-slate-600">Access your BlindVerdict workspace.</p>
        <div className="mt-6 space-y-4">
          <FormInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => loginMutation.mutate({ email, password })}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            Login
          </button>
          {loginMutation.isError && <p className="text-sm text-red-600">Invalid credentials.</p>}
          <p className="text-sm text-slate-600">
            New user?{" "}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
