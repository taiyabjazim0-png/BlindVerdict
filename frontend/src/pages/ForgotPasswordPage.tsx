import { Link } from "react-router-dom";

import { Card } from "@/components/Card";
import { FormInput } from "@/components/FormInput";

export function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-xl font-semibold">Forgot password</h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter your email and we will send you a link to reset your password.
        </p>
        <div className="mt-6 space-y-4">
          <FormInput label="Email" type="email" placeholder="Enter your email" />
          <button className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white">
            Send reset link
          </button>
          <p className="text-center text-sm text-slate-600">
            <Link to="/" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
