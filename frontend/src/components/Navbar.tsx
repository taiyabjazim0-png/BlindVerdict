import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-lg font-semibold tracking-tight text-primary">
          BlindVerdict
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium">
            Login
          </Link>
          <Link to="/register" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
