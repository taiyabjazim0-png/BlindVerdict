import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, ...rest }: Props) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        {...rest}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
    </label>
  );
}
