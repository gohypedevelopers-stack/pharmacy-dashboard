import React, { useEffect, useMemo, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { City, State } from "country-state-city";
import { apiRequest } from "../lib/api.js";

const countryCode = "IN";
const timezoneOptions = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
];
const specializationOptions = [
  "General Physician",
  "Family Medicine Doctor",
  "Primary Care Doctor",
  "Cardiologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Nephrologist",
  "Endocrinologist",
  "Rheumatologist",
  "Hematologist",
  "Infectious Disease Specialist",
  "Neurologist",
  "Neurosurgeon",
  "Psychiatrist",
  "Psychologist",
  "Orthopedic Surgeon",
  "Physiotherapist",
  "Sports Medicine Specialist",
  "Oncologist",
  "Radiation Oncologist",
  "Surgical Oncologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Optometrist",
  "Pediatrician",
  "Gynecologist",
  "Obstetrician",
  "Fertility Specialist",
  "Urologist",
  "Dermatologist",
  "Plastic Surgeon",
  "Dentist",
  "Orthodontist",
  "Endodontist",
  "Periodontist",
  "Oral & Maxillofacial Surgeon",
  "Pathologist",
  "Radiologist",
  "Emergency Medicine Specialist",
  "Critical Care Specialist",
  "Anesthesiologist",
  "Geriatrician",
  "Pain Management Specialist",
  "Palliative Care Specialist",
  "General Surgeon",
  "Cardiothoracic Surgeon",
  "Vascular Surgeon",
  "Spine Surgeon",
  "Hand Surgeon",
  "Hepatologist",
  "Allergist / Immunologist",
  "Occupational Medicine Specialist",
  "Nuclear Medicine Specialist",
  "Neonatologist",
  "Pulmonary Critical Care Specialist",
  "Bariatric Surgeon",
  "Chiropractor",
  "Audiologist",
  "Diabetologist",
  "Cosmetic Surgeon",
  "Forensic Medicine Specialist",
  "Public Health Specialist",
  "Medical Geneticist",
  "Reproductive Endocrinologist",
  "Sleep Medicine Specialist",
  "Tropical Medicine Specialist",
  "Internal Medicine Specialist",
  "Rehabilitation Medicine Specialist",
  "Proctologist",
  "Colorectal Surgeon",
  "Laparoscopic Surgeon",
  "Transplant Surgeon",
  "Clinical Nutritionist / Dietician",
  "Thoracic Surgeon",
  "Ortho Trauma Surgeon",
  "Neuropsychiatrist",
  "Interventional Cardiologist",
  "Interventional Radiologist",
  "Podiatrist",
  "Osteopath",
  "Speech & Language Therapist",
  "Other",
];

export default function SignupModal({ isOpen, onClose, onSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    otherSpecialization: "",
    experienceYears: "",
    consultationFee: "",
    timezone: "",
    state: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const stateOptions = useMemo(() => State.getStatesOfCountry(countryCode), []);

  useEffect(() => {
    if (!form.state) {
      setCityOptions([]);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.state]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSpecializationChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({
      ...prev,
      specialization: value,
      otherSpecialization: value === "Other" ? prev.otherSpecialization : "",
    }));
  };

  const handleStateChange = (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, state: value, city: "" }));
    setCityOptions(value ? City.getCitiesOfState(countryCode, value) : []);
  };

  const handlePhoneChange = (value) => {
    setForm((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await apiRequest("/api/doctors/sign-up", {
        method: "POST",
        body: {
          userName: form.name,
          phoneNumber: form.phoneNumber,
          email: form.email,
          password: form.password,
          specialization:
            form.specialization === "Other" ? form.otherSpecialization : form.specialization,
          experienceYears: form.experienceYears,
          consultationFee: form.consultationFee,
          timezone: form.timezone,
          state: form.state,
          city: form.city,
        },
      });
      const submittedEmail = form.email;
      setForm({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        otherSpecialization: "",
        experienceYears: "",
        consultationFee: "",
        timezone: "",
        state: "",
        city: "",
      });
      onSuccess?.(submittedEmail);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-auto max-h-[85vh] w-full max-w-sm overflow-visible rounded-[28px] border-[5px] border-blue-700/80 bg-gradient-to-b from-white to-slate-50 p-3 shadow-[0_30px_70px_rgba(15,23,42,0.25)] ring-1 ring-blue-600/40"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white/95 p-5 shadow-lg shadow-blue-900/10 ring-1 ring-slate-200/70">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Sign up</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 min-h-0 max-h-[70vh] overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-blue-500/70">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Name</label>
                <input
                  value={form.name}
                  onChange={handleChange("name")}
                  required
className="h-10 w-full rounded-md border-[5px] border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-0.5 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Phone number</label>
                <PhoneInput
                  country="in"
                  value={form.phoneNumber}
                  onChange={handlePhoneChange}
                  inputClass="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  buttonClass="border border-slate-200"
                  containerClass="w-full"
                  enableSearch
                  specialLabel=""
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Password</label>
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
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-500"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                      >
                        <path
                          fill="currentColor"
                          d="M12 5c-4.333 0-7.667 3.333-9 7 1.333 3.667 4.667 7 9 7s7.667-3.333 9-7c-1.333-3.667-4.667-7-9-7Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"
                        />
                        <circle cx="12" cy="12" r="2.5" fill="white" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                      >
                        <path
                          fill="currentColor"
                          d="M12 5c-4.333 0-7.667 3.333-9 7 1.333 3.667 4.667 7 9 7s7.667-3.333 9-7c-1.333-3.667-4.667-7-9-7Z"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18"
                        />
                        <circle cx="12" cy="12" r="2.5" fill="white" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Confirm password</label>
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
                    onClick={() => setShowConfirm((value) => !value)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-slate-500"
                  >
                    {showConfirm ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                      >
                        <path
                          fill="currentColor"
                          d="M12 5c-4.333 0-7.667 3.333-9 7 1.333 3.667 4.667 7 9 7s7.667-3.333 9-7c-1.333-3.667-4.667-7-9-7Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"
                        />
                        <circle cx="12" cy="12" r="2.5" fill="white" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                      >
                        <path
                          fill="currentColor"
                          d="M12 5c-4.333 0-7.667 3.333-9 7 1.333 3.667 4.667 7 9 7s7.667-3.333 9-7c-1.333-3.667-4.667-7-9-7Z"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 3l18 18"
                        />
                        <circle cx="12" cy="12" r="2.5" fill="white" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Specialization</label>
                <select
                  value={form.specialization}
                  onChange={handleSpecializationChange}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select specialization</option>
                  {specializationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {form.specialization === "Other" && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Please specify</label>
                  <input
                    value={form.otherSpecialization}
                    onChange={handleChange("otherSpecialization")}
                    required
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.experienceYears}
                    onChange={handleChange("experienceYears")}
                    required
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Consultation fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={form.consultationFee}
                    onChange={handleChange("consultationFee")}
                    required
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Timezone</label>
                <select
                  value={form.timezone}
                  onChange={handleChange("timezone")}
                  required
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timezone</option>
                  {timezoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">State</label>
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
                  <label className="block text-xs font-medium text-slate-700">City</label>
                  <select
                    value={form.city}
                    onChange={handleChange("city")}
                    required
                    disabled={!cityOptions.length}
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">{cityOptions.length ? "Select city" : "Select state first"}</option>
                    {cityOptions.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error && (
                <p className="text-sm text-rose-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-500/30 transition hover:from-blue-700 hover:to-emerald-600 disabled:from-blue-300 disabled:to-slate-400 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing up..." : "Create Doctor account"}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
