// src/pages/DoctorQualifications.jsx
// STEP 2 – QUALIFICATIONS
// - MBBS certificate upload is mandatory.
// - Optional other degree upload.
// - Each upload shows a "Preview" button which opens the file in a new tab.
// - On submit → go to /register/registration.

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dpicon from "../assets/dpicon.png";
import RegistrationProgressBar from "../components/RegistrationProgressBar.jsx";
import { useRegistration } from "../lib/registrationContext.jsx";

export default function DoctorQualifications() {
  const { data, updateFiles } = useRegistration();
  const [mbbsFile, setMbbsFile] = useState(data.files.mbbsCertificate);
  const [otherFile, setOtherFile] = useState(data.files.mdMsBdsCertificate);

  const navigate = useNavigate();

  // Open the given file in a new tab using an Object URL
  const handlePreviewFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mbbsFile) {
      alert("Please upload your MBBS Certificate before continuing.");
      return;
    }
    updateFiles({
      mbbsCertificate: mbbsFile,
      mdMsBdsCertificate: otherFile,
    });
    navigate("/register/registration");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header reused in registration flow */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={dpicon} className="w-8 h-8 object-contain" />
            <span className="text-sm font-semibold text-slate-900">
              Doorspital Partner
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-xs font-medium text-slate-600 sm:text-sm">
            <button className="hover:text-slate-900">Dashboard</button>
            <button className="hover:text-slate-900">Help</button>
            <button className="text-rose-600 hover:text-rose-700">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Progress bar card + form card */}
      <main className="w-full py-8 sm:py-10">
        <div className="space-y-3.5">
          {/* Progress bar card (step 2) */}
          <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 sm:px-8">
            <RegistrationProgressBar currentStep={2} />
          </div>

          {/* Card with upload form */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <form
              className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
              onSubmit={handleSubmit}
            >
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Upload Your Qualifications
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Please upload your medical degree certificates for verification.
                </p>
              </div>

              {/* Two upload cards side by side on desktop */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* MBBS certificate (required) */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    📄
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    MBBS Certificate<span className="text-rose-500">*</span>
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Drag &amp; drop file here or
                  </p>

                  {/* File input is hidden; label acts as button */}
                  <div className="mt-4 flex gap-2">
                    <input
                      id="mbbsUpload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) =>
                        setMbbsFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <label
                      htmlFor="mbbsUpload"
                      className="cursor-pointer rounded-md bg-slate-200 px-4 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-300"
                    >
                      Browse
                    </label>

                    {/* Preview button appears only when file selected */}
                    {mbbsFile && (
                      <button
                        type="button"
                        onClick={() => handlePreviewFile(mbbsFile)}
                        className="rounded-md border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        Preview
                      </button>
                    )}
                  </div>

                  {/* Show selected filename */}
                  {mbbsFile && (
                    <p className="mt-3 max-w-full break-all text-xs text-slate-500">
                      Selected:{" "}
                      <span className="font-medium">{mbbsFile.name}</span>
                    </p>
                  )}
                </div>

                {/* Other degree (optional) */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    📄
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    MD/MS/BDS/Other (optional)
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Drag &amp; drop file here or
                  </p>

                  <div className="mt-4 flex gap-2">
                    <input
                      id="otherUpload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) =>
                        setOtherFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <label
                      htmlFor="otherUpload"
                      className="cursor-pointer rounded-md bg-slate-200 px-4 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-300"
                    >
                      Browse
                    </label>

                    {/* Preview only if a file is selected */}
                    {otherFile && (
                      <button
                        type="button"
                        onClick={() => handlePreviewFile(otherFile)}
                        className="rounded-md border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        Preview
                      </button>
                    )}
                  </div>

                  {otherFile && (
                    <p className="mt-3 max-w-full break-all text-xs text-slate-500">
                      Selected:{" "}
                      <span className="font-medium">{otherFile.name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Save & continue */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-blue-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Save &amp; Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
