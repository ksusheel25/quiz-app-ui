import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
}
