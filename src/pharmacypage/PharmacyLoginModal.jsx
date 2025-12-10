// src/components/PharmacyLoginModal.jsx

import React, { useState } from "react";
import { apiRequest } from "../lib/api.js";

export default function PharmacyLoginModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToSignup,
  onForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await apiRequest("/api/pharmacy/sign-in", {
        method: "POST",
        body: { email, password },
      });

      setEmail("");
      setPassword("");
      onSuccess?.({
        token: response.token,
        user: response.user,
        pharmacy: response.pharmacy || null,
      });
    } catch (err) {
      setError(err.message || "Unable to login right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Pharmacy Login
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            &times;
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Login with your pharmacy account to manage orders and inventory.
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              htmlFor="pharmacyLoginEmail"
              className="block text-xs font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="pharmacyLoginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="store@example.com"
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="pharmacyLoginPassword"
              className="block text-xs font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="pharmacyLoginPassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-blue-600 hover:underline text-xs font-semibold self-start"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer: signup link */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span>Don&apos;t have a pharmacy account? </span>
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm font-extrabold"
              onClick={() => {
                onClose();
                onSwitchToSignup?.();
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
