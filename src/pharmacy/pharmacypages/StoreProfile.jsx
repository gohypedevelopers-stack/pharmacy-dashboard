import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import bellicon from "../assets/bellicon.png";
import pharmacyProfile from "../assets/pharmacyprofile.png";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
    <p className="text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

const EditableField = ({ label, value, name, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="h-11 rounded-2xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            <section className="mx-auto w-full max-w-4xl rounded-[28px] border border-slate-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] space-y-6">
              {error && (
                <div className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Store Profile
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Manage your pharmacy details and contact information.
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing((prev) => !prev)}
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                >
                  {editing ? "Cancel" : "Edit profile"}
                </button>
              </div>

              {editing ? (
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
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
                  <div className="grid gap-4 md:grid-cols-3">
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
                  <div className="grid gap-4 md:grid-cols-3">
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
                      type="date"
                    />
                    <EditableField
                      label="GST Number"
                      name="gstNumber"
                      value={form.gstNumber}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleSave}
                      className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Field label="Store Name" value={profile.storeName || "—"} />
                  <Field label="Owner / Contact person" value={profile.ownerName || "—"} />
                  <Field label="Phone" value={profile.phoneNumber || "—"} />
                  <Field label="License ID" value={profile.drugLicenseNumber || "—"} />
                  <Field label="License Authority" value={profile.licenseAuthority || "—"} />
                  <Field label="License Expiry" value={expirationLabel} />
                  <Field label="WhatsApp" value={profile.whatsappNumber || "—"} />
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
