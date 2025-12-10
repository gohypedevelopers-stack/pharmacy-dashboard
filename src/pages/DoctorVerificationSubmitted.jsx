// src/pages/DoctorVerificationSubmitted.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function DoctorVerificationSubmitted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f0ff] via-[#f5fbff] to-[#e9fdfb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full items-center justify-between py-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-700 text-xs font-bold text-white">
              <div className="space-y-0.5">
                <span className="block h-0.5 w-3 rounded bg-white" />
                <span className="block h-0.5 w-3 rounded bg-white" />
                <span className="block h-0.5 w-3 rounded bg-white" />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">Doorspital Partner</span>
          </Link>
          <nav className="flex items-center gap-6 text-xs font-medium text-slate-600 sm:text-sm">
            <button className="hover:text-slate-900">Dashboard</button>
            <button className="hover:text-slate-900">Help</button>
            <button className="text-rose-600 hover:text-rose-700">Logout</button>
          </nav>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-[32px] bg-white/90 px-8 py-12 shadow-[0_35px_120px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-lg">
              <svg
                className="h-10 w-10"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 24l6 6 10-12" />
                <circle cx="24" cy="24" r="22" strokeOpacity="0.3" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Verification Submitted</h1>
            <p className="text-sm text-slate-500">
              Our team will review your documents within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-1 w-full rounded-2xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:max-w-xs"
            >
              Go to Dashboard
            </button>
            <p className="text-xs text-slate-400">You can close this tab once you reach the dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
