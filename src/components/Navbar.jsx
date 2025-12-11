// src/components/Navbar.jsx
// Top navigation for Home & Benefits pages.

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";

export default function Navbar({
  onLoginClick,
  isAuthenticated,
  onLogout,
  onSignupClick,
  pharmacySession,
  onPharmacyLogout,
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const isBenefits = pathname === "/benefits";
  const isDashboard = pathname.startsWith("/dashboard");

  const handleDashboardClick = (event) => {
    if (!isAuthenticated) {
      event.preventDefault();
      onLoginClick?.();
    }
  };

  const hasPharmacySession = Boolean(pharmacySession?.token);
  const pharmacyName =
    pharmacySession?.pharmacy?.storeName ||
    pharmacySession?.user?.userName ||
    "Partner Pharmacy";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="flex w-full items-center justify-between py-3">
        {/* Logo / brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={icon} className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold text-slate-900">
            Doorspital Partner
          </span>
        </Link>

        {/* Main nav links */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a
  href="#about"
  className="hover:text-slate-900 hover:underline underline-offset-4"
>
  About
</a>

          <a href="#testimonials"   className="hover:text-slate-900 hover:underline underline-offset-4"
>
            Testimonials
          </a>
          <Link
            to="/benefits"
            className={`hover:text-slate-900 hover:underline underline-offset-4 ${
              isBenefits ? "font-semibold text-slate-900" : ""
            }`}
          >
            Benefits
          </Link>
          <Link
            to="/dashboard"
            onClick={handleDashboardClick}
            className={`hover:text-slate-900 hover:underline underline-offset-4 ${
              isDashboard ? "font-semibold text-slate-900" : ""
            }`}
          >
            Dashboard
          </Link>
        </nav>

        {/* Right-side auth buttons */}
        <div className="flex items-center gap-3">
          {hasPharmacySession ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                
              </div>
              <button
                type="button"
                onClick={() => navigate("/pharmacy")}
                className="rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800"
              >
                Open Pharmacy
              </button>
              <button
                type="button"
                onClick={onPharmacyLogout}
                className="rounded-full border-2 border-red-800 px-2 py-2 text-sm font-semibold text-red-600 hover:bg-slate-200"
              >
                Logout
              </button>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-800"
              >
                Open Dashboard
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border-2 border-red-800 px-2 py-2 text-sm font-semibold text-red-600 hover:bg-slate-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="rounded-full border-2 border-blue-700 px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                onClick={onLoginClick}
              >
                Login
              </button>
              <button
                className="rounded-full bg-gradient-to-r from-blue-700 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow"
                onClick={onSignupClick}
              >
                Register Free
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
