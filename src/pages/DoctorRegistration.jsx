// src/pages/DoctorRegistration.jsx
// STEP 3 – MEDICAL REGISTRATION DETAILS
// - Registration number: required.
// - Council Name: searchable dropdown like Medical Specialization, with "Other" option.
// - Issue Date: React DatePicker with external calendar icon button (12px gap).
// - Upload registration certificate (required) + Preview in new tab.
// - On submit to /register/identity.

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dpicon from "../assets/dpicon.png";
import RegistrationProgressBar from "../components/RegistrationProgressBar.jsx";
import { useRegistration } from "../lib/registrationContext.jsx";

// Council list (plus "Other")
const COUNCIL_OPTIONS = [
  "National Medical Commission (NMC)",
  "Andhra Pradesh Medical Council",
  "Arunachal Pradesh Medical Council",
  "Assam Medical Council",
  "Bihar Medical Council",
  "Chandigarh Medical Council",
  "Chhattisgarh Medical Council",
  "Delhi Medical Council",
  "Goa Medical Council",
  "Gujarat Medical Council",
  "Haryana State Medical Council",
  "Himachal Pradesh Medical Council",
  "Jammu & Kashmir Medical Council",
  "Jharkhand Medical Council",
  "Karnataka Medical Council",
  "Kerala State Medical Council",
  "Madhya Pradesh Medical Council",
  "Maharashtra Medical Council",
  "Manipur Medical Council",
  "Meghalaya Medical Council",
  "Mizoram Medical Council",
  "Nagaland Medical Council",
  "Odisha Medical Council",
  "Puducherry Medical Council",
  "Punjab Medical Council",
  "Rajasthan Medical Council",
  "Sikkim Medical Council",
  "Tamil Nadu Medical Council",
  "Telangana Medical Council",
  "Tripura Medical Council",
  "Uttar Pradesh Medical Council",
  "Uttarakhand Medical Council",
  "West Bengal Medical Council",
  "Other",
];

export default function DoctorRegistration() {
  const { data, updateRegistration, updateFiles } = useRegistration();
  const storedRegistration = data.registration || {};

  const [registrationNumber, setRegistrationNumber] = useState(
    storedRegistration.registrationNumber || ""
  );
  const [councilQuery, setCouncilQuery] = useState(
    storedRegistration.councilDisplayName || storedRegistration.councilName || ""
  );
  const [selectedCouncil, setSelectedCouncil] = useState(
    storedRegistration.councilDisplayName || storedRegistration.councilName || ""
  );
  const [councilOther, setCouncilOther] = useState(
    storedRegistration.councilDisplayName &&
      !COUNCIL_OPTIONS.includes(storedRegistration.councilDisplayName)
      ? storedRegistration.councilDisplayName
      : ""
  );
  const [showCouncilDropdown, setShowCouncilDropdown] = useState(false);

  const [issueDate, setIssueDate] = useState(
    storedRegistration.issueDate ? new Date(storedRegistration.issueDate) : null
  );
  const [certificateFile, setCertificateFile] = useState(
    data.files.registrationCertificate
  );

  const datePickerRef = useRef(null);
  const navigate = useNavigate();

  const filteredCouncilOptions = COUNCIL_OPTIONS.filter((c) =>
    c.toLowerCase().includes(councilQuery.trim().toLowerCase())
  );

  const isCouncilOther = selectedCouncil === "Other";
  const validIssueDate =
    issueDate instanceof Date && !Number.isNaN(issueDate.getTime());

  const normalizeCouncilName = (value) => {
    if (!value) return "";
    const lower = value.toLowerCase();
    if (lower.includes("national medical commission") || lower.includes("nmc") || lower.includes("mci")) {
      return "MCI";
    }
    return "State Council";
  };

  const isCouncilValid =
    selectedCouncil &&
    (!isCouncilOther || (isCouncilOther && councilOther.trim() !== ""));

  const isFormValid =
    registrationNumber.trim() !== "" &&
    isCouncilValid &&
    validIssueDate &&
    certificateFile;

  const handleCouncilSelect = (option) => {
    setSelectedCouncil(option);
    setCouncilQuery(option === "Other" ? "" : option);
    setShowCouncilDropdown(false);

    if (option !== "Other") {
      setCouncilOther("");
    }
  };

  const handleCertificatePreview = () => {
    if (!certificateFile) return;
    const url = URL.createObjectURL(certificateFile);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const councilLabel = isCouncilOther ? councilOther.trim() : selectedCouncil;
    const councilForApi = normalizeCouncilName(councilLabel || selectedCouncil);
    const issueDateIso =
      issueDate instanceof Date && !Number.isNaN(issueDate.getTime())
        ? issueDate.toISOString()
        : "";

    updateRegistration({
      registrationNumber: registrationNumber.trim(),
      councilName: councilForApi,
      councilDisplayName: councilLabel,
      issueDate: issueDateIso,
    });
    updateFiles({
      registrationCertificate: certificateFile,
    });
    navigate("/register/identity");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Registration header */}
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
          {/* Progress bar card (step 3) */}
          <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 sm:px-8">
            <RegistrationProgressBar currentStep={3} />
          </div>

          {/* Form card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <form
              className="space-y-6 px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
              onSubmit={handleSubmit}
            >
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Medical Registration Details
                </h1>
              </div>

              {/* Registration number + Council row */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Registration number (required) */}
                <div className="space-y-1">
                  <label
                    htmlFor="registrationNumber"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Registration Number<span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="registrationNumber"
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Enter your registration number"
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                    required
                  />
                </div>

                {/* Council Name: searchable dropdown like specialization */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Council Name<span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={councilQuery}
                      onChange={(e) => {
                        setCouncilQuery(e.target.value);
                        setShowCouncilDropdown(true);
                        setSelectedCouncil("");
                      }}
                      onFocus={() => setShowCouncilDropdown(true)}
                      placeholder="Search council..."
                      className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                    />

                    {showCouncilDropdown && (
                      <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                        {filteredCouncilOptions.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-slate-500">
                            No councils found.
                          </div>
                        ) : (
                          filteredCouncilOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleCouncilSelect(option)}
                              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                                selectedCouncil === option
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-slate-700"
                              }`}
                            >
                              <span>{option}</span>
                              {selectedCouncil === option && (
                                <span className="text-xs">✓</span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {isCouncilOther && (
                    <div className="mt-2 space-y-1">
                      <label
                        htmlFor="councilOther"
                        className="block text-xs font-medium text-slate-600"
                      >
                        If Other, please specify
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="councilOther"
                        type="text"
                        value={councilOther}
                        onChange={(e) => setCouncilOther(e.target.value)}
                        placeholder="Enter council name"
                        className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Issue Date row – DatePicker + calendar icon with ~12px gap */}
              <div className="space-y-1">
                <label
                  htmlFor="issueDateInput"
                  className="block text-sm font-medium text-slate-700"
                >
                  Issue Date<span className="text-rose-500">*</span>
                </label>

                <div className="flex items-center gap-3">
                  <DatePicker
                    id="issueDateInput"
                    ref={datePickerRef}
                    selected={issueDate}
                    onChange={(date) => setIssueDate(date)}
                    placeholderText="mm/dd/yyyy"
                    dateFormat="MM/dd/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="h-10 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                  />

                  <button
                    type="button"
                    onClick={() => datePickerRef.current?.setOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Open calendar"
                  >
                    📅
                  </button>
                </div>
              </div>

              {/* Upload registration certificate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Upload Registration Certificate
                  <span className="text-rose-500">*</span>
                </label>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    ⬆️
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    SVG, PNG, JPG or PDF (MAX. 5MB)
                  </p>

                  <div className="mt-4 flex gap-2">
                    <input
                      id="registrationCert"
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        setCertificateFile(e.target.files?.[0] ?? null)
                      }
                    />
                    <label
                      htmlFor="registrationCert"
                      className="cursor-pointer rounded-md bg-slate-200 px-4 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-300"
                    >
                      Browse
                    </label>

                    {certificateFile && (
                      <button
                        type="button"
                        onClick={handleCertificatePreview}
                        className="rounded-md border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        Preview
                      </button>
                    )}
                  </div>

                  {certificateFile && (
                    <p className="mt-3 max-w-full break-all text-xs text-slate-600">
                      Selected:{" "}
                      <span className="font-medium">
                        {certificateFile.name}
                      </span>
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Ensure certificate text is clearly visible.
                </p>
              </div>

              {/* Save & Continue */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`rounded-md px-6 py-2 text-sm font-semibold shadow-sm ${
                    isFormValid
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "cursor-not-allowed bg-slate-200 text-slate-400"
                  }`}
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
