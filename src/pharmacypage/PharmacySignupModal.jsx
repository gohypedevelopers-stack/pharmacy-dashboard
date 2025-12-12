// src/components/PharmacyDeliverySignupModal.jsx

import React, { useEffect, useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { State, City } from "country-state-city";
import { apiRequest } from "../lib/api.js";

const COUNTRY_CODE = "IN";

const PHARMACY_TYPE_OPTIONS = [
  "Retail",
  "Online",
  "Hospital-attached",
  "Clinic-attached",
  "Wholesale",
  "Other",
];

export default function PharmacyDeliverySignupModal({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}) {
  const [form, setForm] = useState({
    ownerName: "",
    whatsappNumber: "",
    storeName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    drugLicenseNumber: "",
    licenseAuthority: "",
    licenseExpiryDate: "",
    gstNumber: "",
    panNumber: "",
    pharmacyType: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [cityOptions, setCityOptions] = useState([]);
  const stateOptions = useMemo(() => State.getStatesOfCountry(COUNTRY_CODE), []);

  useEffect(() => {
    if (!form.state) {
      setCityOptions([]);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.state]);

  const closeModal = () => {
    handleVerificationClose();
    onClose?.();
  };

  if (!isOpen) return null;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePhoneChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, state: value, city: "" }));
    setCityOptions(value ? City.getCitiesOfState(COUNTRY_CODE, value) : []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.drugLicenseNumber.trim()) {
      setError("Drug License Number is required.");
      return;
    }

    if (!form.licenseAuthority.trim()) {
      setError("License issuing authority is required.");
      return;
    }

    if (!form.licenseExpiryDate) {
      setError("License validity / expiry date is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // You can adjust this endpoint name to match your backend
      const response = await apiRequest("/api/pharmacy/delivery/sign-up", {
        method: "POST",
        body: {
          ownerName: form.ownerName,
          whatsappNumber: form.whatsappNumber,
          storeName: form.storeName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          drugLicenseNumber: form.drugLicenseNumber,
          licenseAuthority: form.licenseAuthority,
          licenseExpiryDate: form.licenseExpiryDate, // string yyyy-mm-dd
          gstNumber: form.gstNumber || undefined,
          panNumber: form.panNumber || undefined,
          pharmacyType: form.pharmacyType,
          address: {
            line1: form.addressLine1,
            line2: form.addressLine2,
            state: form.state,
            city: form.city,
            pincode: form.pincode,
          },
        },
      });

      onSuccess?.(form.email);

      // reset form after successful submit
      setForm({
        ownerName: "",
        whatsappNumber: "",
        storeName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        drugLicenseNumber: "",
        licenseAuthority: "",
        licenseExpiryDate: "",
        gstNumber: "",
        panNumber: "",
        pharmacyType: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        city: "",
        pincode: "",
      });

    } catch (err) {
      setError(err.message || "Unable to sign up right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
        onClick={closeModal}
      >
        <div
  className="mx-auto max-h-[95vh] w-full max-w-sm overflow-visible rounded-[28px] 
  border-[5px] border-blue-700/80 bg-gradient-to-b from-white to-slate-50 p-3 
  shadow-[0_30px_70px_rgba(15,23,42,0.25)] ring-1 ring-blue-600/40"        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white/95 p-5 shadow-lg shadow-blue-900/10 ring-1 ring-slate-200/70">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Pharmacy Delivery Sign up
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="text-slate-400 hover:text-slate-600"
            >
              &times;
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 max-h-[70vh] overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-blue-500/70">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Owner / Contact person name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Owner / Contact person name
                </label>
                <input
                  value={form.ownerName}
                  onChange={handleChange("ownerName")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              

              {/* Official pharmacy / store name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Official pharmacy / store name
                </label>
                <input
                  value={form.storeName}
                  onChange={handleChange("storeName")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Business email */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Business email (for login & communication)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                  placeholder="store@example.com"
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Phone number (with country code)
                </label>
                <PhoneInput
                  country="in"
                  value={form.phoneNumber}
                  onChange={handlePhoneChange("phoneNumber")}
                  inputClass="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  buttonClass="border border-slate-200"
                  containerClass="w-full"
                  enableSearch
                  specialLabel=""
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange("password")}
                    required
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-500"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Drug License Number */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Drug License Number
                </label>
                <input
                  value={form.drugLicenseNumber}
                  onChange={handleChange("drugLicenseNumber")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* License issuing authority / council name */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  License issuing authority / council name
                </label>
                <input
                  value={form.licenseAuthority}
                  onChange={handleChange("licenseAuthority")}
                  required
                  placeholder="e.g., State Drug Control Department"
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* License validity / expiry date */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  License validity / expiry date
                </label>
                <input
                  type="date"
                  value={form.licenseExpiryDate}
                  onChange={handleChange("licenseExpiryDate")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* GST & PAN */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    GST Number
                  </label>
                  <input
                    value={form.gstNumber}
                    onChange={handleChange("gstNumber")}
                    placeholder="Optional"
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    PAN Number (business or proprietor)
                  </label>
                  <input
                    value={form.panNumber}
                    onChange={handleChange("panNumber")}
                    placeholder="Optional"
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Pharmacy type */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Pharmacy type
                </label>
                <select
                  value={form.pharmacyType}
                  onChange={handleChange("pharmacyType")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  {PHARMACY_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Address Line 1 (building, street)
                </label>
                <input
                  value={form.addressLine1}
                  onChange={handleChange("addressLine1")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Address Line 2 (area / landmark) – optional
                </label>
                <input
                  value={form.addressLine2}
                  onChange={handleChange("addressLine2")}
                  placeholder="Area, landmark"
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* State & City */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    State
                  </label>
                  <select
                    value={form.state}
                    onChange={handleStateChange}
                    required
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select state</option>
                    {stateOptions.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    City
                  </label>
                  <select
                    value={form.city}
                    onChange={handleChange("city")}
                    required
                    disabled={!cityOptions.length}
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {cityOptions.length ? "Select city" : "Select state first"}
                    </option>
                    {cityOptions.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pincode */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Pincode
                </label>
                <input
                  value={form.pincode}
                  onChange={handleChange("pincode")}
                  required
                  maxLength={10}
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-rose-600" role="alert">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-500/30 transition hover:from-blue-700 hover:to-emerald-600 disabled:from-blue-300 disabled:to-slate-400 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating pharmacy account..." : "Create pharmacy account"}
              </button>
            </form>
          </div>

          {/* Footer switch to login */}
          <div className="mt-3 text-xs text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold hover:underline"
              onClick={() => {
                closeModal();
                onSwitchToLogin?.();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}
