// src/pages/VerificationSubmitted.jsx
// "Verification Submitted" success screen (no real dashboard page)

import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function VerificationSubmitted() {
  const navigate = useNavigate();

  const goHome = () => {
    // No dashboard page – just send user to home
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-emerald-50">
      {/* Top nav */}
      <header className="border-b border-slate-200 bg-transparent">
        <div className="flex w-full items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-700 text-xs font-bold text-white">
              <div className="space-y-0.5">
                <span className="block h-0.5 w-3 rounded bg-white" />
                <span className="block h-0.5 w-3 rounded bg-white" />
                <span className="block h-0.5 w-3 rounded bg-white" />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              DoOrSPital Partner
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-xs font-medium text-slate-600 sm:text-sm">
            {/* This looks like "Dashboard" but goes to home */}
            <button className="hover:text-slate-900" onClick={goHome}>
              Dashboard
            </button>
            <button className="hover:text-slate-900">Help</button>
            <button className="text-rose-600 hover:text-rose-700">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Center card */}
      <main className="flex w-full items-center justify-center py-10 sm:py-16">
        <div className="w-full max-w-md rounded-2xl bg-white px-8 py-10 text-center shadow-xl ring-1 ring-slate-200">
          {/* Green check icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
              <span className="text-2xl text-white">✓</span>
            </div>
          </div>

          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Verification Submitted
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Our team will review your documents within 24 hours.
          </p>

          <button
            type="button"
            onClick={goHome}
            className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
