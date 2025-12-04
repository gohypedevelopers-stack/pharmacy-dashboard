// src/pages/SettingsPage.jsx
import React from "react";
import Sidebar from "../components/Sidebar.jsx"; // Now importing the defined Sidebar

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-[#F3F7F6] flex text-slate-800">
      {/* SIDEBAR is now a component wrapping the whole page layout */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-[#F3F7F6] border-b border-transparent flex items-center justify-between px-4 md:px-8">
          <div>
            <h2 className="font-semibold text-slate-900 text-[20px]">
              General Settings
            </h2>
            <p className="text-[12px] text-slate-400">
              Manage your profile, pharmacy details, and general preferences.
            </p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 space-y-5 max-w-5xl">
          {/* Profile Information */}
          <section className="bg-white rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100 px-6 py-5">
            <header className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-[14px] text-slate-900">
                Profile Information
              </h3>
            </header>

            <div className="space-y-4 text-[13px]">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name">
                  <Input defaultValue="John Doe" />
                </Field>
                <Field label="Email Address">
                  <Input defaultValue="john.doe@greenleaf.com" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Contact Number">
                  <Input defaultValue="+1 (555) 123-4567" />
                </Field>
              </div>
            </div>
          </section>

          {/* Pharmacy Details */}
          <section className="bg-white rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100 px-6 py-5">
            <header className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-[14px] text-slate-900">
                Pharmacy Details
              </h3>
            </header>

            <div className="space-y-4 text-[13px]">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Store Name">
                  <Input defaultValue="GreenLeaf Central Pharmacy" />
                </Field>
                <Field label="Hours of Operation">
                  <Input defaultValue="9:00 AM - 7:00 PM, Mon-Sat" />
                </Field>
              </div>

              <Field label="Store Address">
                <Input defaultValue="123 Health Ave, Wellness City, ST 12345" />
              </Field>
            </div>
          </section>

          {/* General Preferences */}
          <section className="bg-white rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100 px-6 py-5 mb-4">
            <header className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-semibold text-[14px] text-slate-900">
                General Preferences
              </h3>
            </header>

            <div className="space-y-5 text-[13px]">
              <PreferenceRow
                title="Enable Dark Mode"
                description="Switch between light and dark themes."
              >
                <Toggle enabled={false} />
              </PreferenceRow>

              <PreferenceRow
                title="Email Notifications"
                description="Receive notifications about new orders and updates."
              >
                <Toggle enabled={true} />
              </PreferenceRow>

              <PreferenceRow
                title="Language"
                description="Choose your preferred language."
              >
                <LanguageSelect />
              </PreferenceRow>
            </div>
          </section>

          {/* Footer buttons */}
          <div className="pb-10 flex justify-end gap-3 text-[13px]">
            <button className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button className="px-5 py-2 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600">
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Helper components - included here as they were in the original code */

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[12px] text-slate-500">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
  />
);

const PreferenceRow = ({ title, description, children }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
    <div>
      <p className="font-medium text-slate-800 text-[13px]">{title}</p>
      <p className="text-[12px] text-slate-400">{description}</p>
    </div>
    <div>{children}</div>
  </div>
);

const Toggle = ({ enabled }) => (
  <button
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-emerald-500" : "bg-slate-300"
    }`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform ${
        enabled ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

const LanguageSelect = () => (
  <div className="relative">
    <select className="appearance-none h-9 rounded-full border border-slate-200 bg-white pl-4 pr-8 text-[13px] text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500">
      <option>English</option>
      <option>Spanish</option>
      <option>French</option>
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
      {"\u25BE"} {/* Down arrow/caret */}
    </span>
  </div>
);

export default SettingsPage;