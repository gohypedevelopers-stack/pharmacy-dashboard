import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import bellicon from "../assets/bellicon.png";
import pharmacyProfile from "../assets/pharmacyprofile.png";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
      {label}
    </p>
    <p className="text-base md:text-lg font-semibold text-slate-900">
      {value}
    </p>
  </div>
);

const EditableField = ({ label, value, name, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="h-11 rounded-2xl border border-slate-200 bg-slate-50/60 px-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
    />
  </div>
);

export default function StoreProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    storeName: "",
    ownerName: "",
    phoneNumber: "",
    whatsappNumber: "",
    drugLicenseNumber: "",
    licenseAuthority: "",
    licenseExpiryDate: "",
    gstNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const token = getPharmacyToken();

  const loadProfile = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest("/api/pharmacy/profile", {
        token,
      });
      setProfile(response?.data ?? null);
      if (response?.data) {
        setForm({
          storeName: response.data.storeName || "",
          ownerName: response.data.ownerName || "",
          phoneNumber: response.data.phoneNumber || "",
          whatsappNumber: response.data.whatsappNumber || "",
          drugLicenseNumber: response.data.drugLicenseNumber || "",
          licenseAuthority: response.data.licenseAuthority || "",
          licenseExpiryDate:
            response.data.licenseExpiryDate &&
            response.data.licenseExpiryDate.slice(0, 10),
          gstNumber: response.data.gstNumber || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError(err.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [token]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      await apiRequest("/api/pharmacy/profile", {
        method: "PUT",
        token,
        body: {
          storeName: form.storeName,
          ownerName: form.ownerName,
          phoneNumber: form.phoneNumber,
          whatsappNumber: form.whatsappNumber,
          drugLicenseNumber: form.drugLicenseNumber,
          licenseAuthority: form.licenseAuthority,
          licenseExpiryDate: form.licenseExpiryDate,
          gstNumber: form.gstNumber,
        },
      });
      setEditing(false);
      await loadProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const expirationLabel = useMemo(() => {
    if (!profile?.licenseExpiryDate) return "Not set";
    return new Date(profile.licenseExpiryDate).toLocaleDateString();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-600">Loading store profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-600">No profile available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
                  {/* Header */}
                  <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
                    <h1 className="text-[18px] font-semibold text-slate-900">
                      Store Profile
                    </h1>
        
                    <div className="flex items-center gap-4">
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <img src={bellicon} alt="Notifications" />
                      </button>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                        <img src={pharmacyProfile} alt="Profile" />
                      </div>
                    </div>
                  </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto px-4 md:px-10 py-6 md:py-8">
            <section className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-100 bg-white/95 p-6 md:p-10 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-8">
              {error && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}

              {/* Title + actions */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Store Profile
                  </span>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                    Manage your pharmacy details and contact information.
                  </h2>
                  <p className="text-sm text-slate-500 max-w-xl">
                    This information is used on invoices, prescriptions and
                    communication with your customers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.45)] transition hover:bg-emerald-600"
                >
                  {editing ? "Cancel" : "Edit profile"}
                </button>
              </div>

              {/* Content: edit or view */}
              {editing ? (
                <form className="space-y-7">
                  <div className="grid gap-5 md:grid-cols-2">
                    <EditableField
                      label="Store Name"
                      name="storeName"
                      value={form.storeName}
                      onChange={handleFormChange}
                    />
                    <EditableField
                      label="Owner / Contact Person"
                      name="ownerName"
                      value={form.ownerName}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <EditableField
                      label="Phone"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleFormChange}
                    />
                    <EditableField
                      label="WhatsApp"
                      name="whatsappNumber"
                      value={form.whatsappNumber}
                      onChange={handleFormChange}
                    />
                    <EditableField
                      label="License ID"
                      name="drugLicenseNumber"
                      value={form.drugLicenseNumber}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <EditableField
                      label="License Authority"
                      name="licenseAuthority"
                      value={form.licenseAuthority}
                      onChange={handleFormChange}
                    />
                    <EditableField
                      label="License Expiry"
                      name="licenseExpiryDate"
                      value={form.licenseExpiryDate}
                      onChange={handleFormChange}
                    />
                    <EditableField
                      label="GST Number"
                      name="gstNumber"
                      value={form.gstNumber}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSave}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-7 py-2.5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.45)] transition hover:bg-emerald-600 disabled:opacity-60 disabled:shadow-none"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-9">
                  {/* Top summary row */}
                  <div className="grid gap-4 rounded-2xl bg-slate-100 p-4 md:p-5 md:grid-cols-3">
                    <Field
                      label="Store Name"
                      value={profile.storeName || "—"}
                    />
                    <Field
                      label="Owner / Contact person"
                      value={profile.ownerName || "—"}
                    />
                    <Field
                      label="Phone"
                      value={profile.phoneNumber || "—"}
                    />
                  </div>

                  {/* Details grid */}
                  <div className="grid gap-4 rounded-2xl bg-slate-100 p-8 md:p-5 md:grid-cols-3">
                    <Field
                      label="License ID"
                      value={profile.drugLicenseNumber || "—"}
                    />
                    <Field
                      label="License Authority"
                      value={profile.licenseAuthority || "—"}
                    />
                    <Field label="License Expiry" value={expirationLabel} />

                    <Field
                      label="WhatsApp"
                      value={profile.whatsappNumber || "—"}
                    />
                    <Field
                      label="GST Number"
                      value={profile.gstNumber || "—"}
                    />
                  
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
