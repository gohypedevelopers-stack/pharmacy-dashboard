// src/pages/DoctorIdentity.jsx
// STEP 4 – Government ID upload with preview + continue to face verification.

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import dpicon from "../assets/dpicon.png";
import RegistrationProgressBar from "../components/RegistrationProgressBar.jsx";
import { useRegistration } from "../lib/registrationContext.jsx";

export default function DoctorIdentity() {
  const { data, updateIdentity, updateFiles } = useRegistration();
  const [selectedType, setSelectedType] = useState(data.identity.documentType || null);
  const [uploadedFile, setUploadedFile] = useState(data.files.governmentId);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const docOptions = [
    { id: "Aadhaar Card", label: "Aadhaar Card" },
    { id: "PAN Card", label: "PAN Card" },
    { id: "Passport", label: "Passport" },
    { id: "Driving License", label: "Driving License" },
  ];

  const handleFileSelect = (files) => {
    const file = files?.[0];
    if (!file) return;

    if (!selectedType) {
      alert("Please select a document type before uploading.");
      return;
    }

    setUploadedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const isContinueEnabled = !!selectedType && !!uploadedFile;

  const handleContinue = () => {
    if (!isContinueEnabled) return;
    updateIdentity({ documentType: selectedType });
    updateFiles({ governmentId: uploadedFile });
    navigate("/register/face-verification");
  };

  const handlePreview = () => {
    if (!uploadedFile) return;
    const url = URL.createObjectURL(uploadedFile);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
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

      {/* Progress card + form card */}
      <main className="w-full py-8 sm:py-10">
        <div className="space-y-3.5">
          {/* Progress bar card (step 4) */}
          <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 sm:px-8">
            <RegistrationProgressBar currentStep={4} />
          </div>

          {/* Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Upload Government ID
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Please upload any one of the following documents.
                </p>
              </div>

              {/* Document options */}
              <div className="space-y-3">
                {docOptions.map((opt) => {
                  const isActive = selectedType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedType(opt.id)}
                      className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm ${
                        isActive
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isActive
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="text-slate-800">{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Drag & drop area */}
              <div
                className={`mt-4 rounded-2xl border border-dashed px-6 py-10 text-center ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-300 bg-slate-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-3 flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    ⬆️
                  </div>
                </div>
                <p className="text-sm text-slate-800">
                  Drag &amp; drop your file here or{" "}
                  <button
                    type="button"
                    className="text-blue-600 underline underline-offset-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    click to upload
                  </button>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Accepted formats: JPG, PNG, PDF. Max size: 5MB.
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />

                {uploadedFile && (
                  <div className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-600">
                    <p className="max-w-full break-all">
                      Selected file:{" "}
                      <span className="font-medium">{uploadedFile.name}</span>
                    </p>
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Preview
                    </button>
                  </div>
                )}
              </div>

              {/* Continue button */}
              <div className="mt-4">
                <button
                  type="button"
                  disabled={!isContinueEnabled}
                  onClick={handleContinue}
                  className={`flex w-full items-center justify-center rounded-md px-6 py-2 text-sm font-semibold shadow-sm ${
                    isContinueEnabled
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
