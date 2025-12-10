import React, { useEffect, useState } from "react";
import { apiRequest } from "../lib/api.js";

export default function OTPModal({ isOpen, onClose, email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const sendOtp = async () => {
    if (!email) return;
    setIsSendingOtp(true);
    setError("");
    try {
      await apiRequest("/api/auth/forgot-password-send-otp", { method: "POST", body: { email } });
      setStatus("OTP sent to your email.");
      setTimer(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    sendOtp();
  }, [isOpen, email]);

  useEffect(() => {
    if (!isOpen || timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(interval);
  }, [timer, isOpen]);

  const handleVerify = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await apiRequest("/api/auth/forgot-password-verify-otp", {
        method: "POST",
        body: { email, otp },
      });
      setOtp("");
      onVerified?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Verify OTP</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            &times;
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-slate-900">{email}</span>.
        </p>

        <form className="mt-4 space-y-4" onSubmit={handleVerify}>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {status && <p className="text-xs text-emerald-600">{status}</p>}
          {error && (
            <p className="text-xs text-rose-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">
            Resend OTP {timer > 0 ? `in ${timer}s` : ""}
          </span>
          <button
            type="button"
            onClick={sendOtp}
            disabled={timer > 0 || isSendingOtp}
            className="text-blue-600 hover:underline disabled:text-slate-400"
          >
            {isSendingOtp ? "Sending..." : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
