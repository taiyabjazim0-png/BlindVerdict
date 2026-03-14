import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/utils/cn";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function PasswordInput({ label, value, onChange, placeholder, className, id }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border border-slate-300 bg-white py-2 pl-3 pr-10 text-sm outline-none transition focus:border-primary",
            className
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}
