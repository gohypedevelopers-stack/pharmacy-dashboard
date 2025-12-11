// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../pharmacy/components/Sidebar.jsx"; // Now importing the defined Sidebar

import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";
import { apiRequest } from "../../lib/api.js";
import {
  getPharmacySession,
  getPharmacyToken,
} from "../../lib/pharmacySession.js";

const formatAddress = (address) => {
  if (!address) return "";
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ];
  return parts.filter(Boolean).join(", ");
};

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    storeName: "",
    ownerName: "",
    phoneNumber: "",
    storeAddress: "",
  });
  const token = getPharmacyToken();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        const response = await apiRequest("/api/pharmacy/profile", { token });
        if (cancelled) return;
        const data = response?.data ?? {};
        setProfileData({
          storeName: data.storeName ?? "",
          ownerName: data.ownerName ?? "",
          phoneNumber: data.phoneNumber ?? "",
          storeAddress: formatAddress(data.address),
        });
      } catch (error) {
        console.error("Unable to load pharmacy profile for settings:", error);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [token]);
  return (
    <div className="min-h-screen bg-[#F3F7F6] flex text-slate-800">
      {/* SIDEBAR is now a component wrapping the whole page layout */}
      <Sidebar />

      {/* MAIN */}
      

         <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
           <div>
            <h1 className="text-[18px] font-semibold text-slate-900">
General Settings            </h1>
<span className="text-[12px] text-slate-400">
              Manage your profile, pharmacy details, and general preferences.
            </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <img src={bellicon} alt="Notifications" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                <img src={pharmacyProfile} alt="Profile" />
              </div>
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
                  <Input value={profileData.ownerName} readOnly />
                </Field>
                <Field label="Email Address">
                  <Input
                    value={getPharmacySession()?.user?.email ?? ""}
                    readOnly
                  />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Contact Number">
                  <Input value={profileData.phoneNumber} readOnly />
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
                  <Input value={profileData.storeName} readOnly />
                </Field>
                <Field label="Hours of Operation">
                  <Input defaultValue="9:00 AM - 7:00 PM, Mon-Sat" />
                </Field>
              </div>

              <Field label="Store Address">
                <Input value={profileData.storeAddress} readOnly />
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



export default SettingsPage;
