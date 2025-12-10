// src/pages/DoctorPersonalDetails.jsx
// Step 1 – Personal Details with searchable specialization + state/city
// Uses `country-state-city` to load all cities of the selected state.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { State as CSCState, City as CSCCity } from "country-state-city";
import dpicon from "../assets/dpicon.png";
import RegistrationProgressBar from "../components/RegistrationProgressBar.jsx";
import { apiRequest } from "../lib/api.js";
import { useRegistration } from "../lib/registrationContext.jsx";

// ----------------------
// 1. Specialization list
// ----------------------
const SPECIALIZATIONS = [
  "Addiction Psychiatry",
  "Adolescent Medicine",
  "Aerospace Medicine",
  "Allergy and Immunology",
  "Anatomic Pathology",
  "Burn Surgery",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Chemical Pathology / Clinical Biochemistry",
  "Child and Adolescent Psychiatry",
  "Clinical Immunology",
  "Clinical Neurophysiology",
  "Clinical Pathology / Laboratory Medicine",
  "Clinical Pharmacology",
  "Colorectal Surgery",
  "Community Medicine",
  "Consultation-Liaison Psychiatry / Psychosomatic Medicine",
  "Critical Care / Intensive Care Medicine",
  "Cytopathology",
  "Dermatology",
  "Dermatopathology",
  "Developmental Pediatrics",
  "Emergency Medicine",
  "Endocrine Surgery",
  "Endocrinology",
  "Family Medicine / General Practice",
  "Family Planning / Reproductive Health",
  "Female Pelvic Medicine and Reconstructive Surgery / Urogynecology",
  "Forensic Pathology",
  "Forensic Psychiatry",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics / Geriatric Medicine",
  "Gynecologic Oncology",
  "Hand Surgery",
  "Head and Neck Surgery",
  "Hematology",
  "Hematopathology",
  "Hepato-Pancreato-Biliary Surgery",
  "Hospital Medicine",
  "Imaging & Radiation (Radiology etc.)",
  "Immunology / Immunopathology",
  "Infectious Disease",
  "Internal Medicine (General Medicine)",
  "Interventional Radiology",
  "Laboratory Hematology",
  "Legal / Forensic Medicine (Clinical Forensic Medicine)",
  "Lifestyle Medicine",
  "Maternal–Fetal Medicine",
  "Medical Biochemistry",
  "Medical Genetics / Clinical Genetics",
  "Medical Microbiology / Clinical Microbiology",
  "Medical Oncology",
  "Minimally Invasive / Laparoscopic Surgery",
  "Neonatology",
  "Nephrology",
  "Neurology",
  "Neuropathology",
  "Neurodevelopmental Disabilities",
  "Neurosurgery",
  "Neuroradiology",
  "Nuclear Medicine",
  "Obstetrics and Gynecology",
  "Occupational Medicine",
  "Ophthalmology",
  "Oral and Maxillofacial Surgery",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pain Medicine",
  "Palliative Care / Palliative Medicine",
  "Pathology (General)",
  "Pediatric Allergy and Immunology",
  "Pediatric Cardiology",
  "Pediatric Critical Care Medicine",
  "Pediatric Dermatology",
  "Pediatric Emergency Medicine",
  "Pediatric Endocrinology",
  "Pediatric Gastroenterology",
  "Pediatric Hematology–Oncology",
  "Pediatric Infectious Disease",
  "Pediatric Nephrology",
  "Pediatric Neurology",
  "Pediatric Pulmonology / Respiratory Medicine",
  "Pediatric Rheumatology",
  "Pediatric Surgery",
  "Pediatrics",
  "Physical Medicine and Rehabilitation (PM&R / Physiatry)",
  "Plastic, Reconstructive and Aesthetic Surgery",
  "Podiatric Surgery",
  "Preventive Medicine",
  "Psychiatry (Adult)",
  "Public Health Medicine / Public Health",
  "Pulmonology / Respiratory Medicine",
  "Radiation Oncology / Radiotherapy",
  "Radiology / Diagnostic Radiology",
  "Reproductive Endocrinology and Infertility",
  "Rheumatology",
  "Sleep Medicine",
  "Spine Surgery",
  "Sports Medicine",
  "Stomatology",
  "Surgical Oncology",
  "Thoracic Surgery",
  "Toxicology",
  "Transfusion Medicine",
  "Transplant Surgery",
  "Trauma Surgery",
  "Travel Medicine",
  "Tropical Medicine",
  "Urology",
  "Vascular Surgery",
  "Venereology / Sexually Transmitted Infections Medicine",
  "Other",
];

// ----------------------
// 2. Indian states & map
// ----------------------
const INDIA_STATE_NAMES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const CSC_STATES_IN_INDIA = CSCState.getStatesOfCountry("IN");

const STATE_OPTIONS = CSC_STATES_IN_INDIA
  .filter((st) => INDIA_STATE_NAMES.includes(st.name))
  .sort((a, b) => a.name.localeCompare(b.name));

const STATE_NAME_TO_ISO = STATE_OPTIONS.reduce((acc, st) => {
  acc[st.name] = st.isoCode;
  return acc;
}, {});

// ===================================================================
// Component
// ===================================================================
export default function DoctorPersonalDetails() {
  const navigate = useNavigate();
  const { data, updatePersonal, setDoctorId } = useRegistration();

  const storedPersonal = data.personal || {};
  const [doctorIdInput, setDoctorIdInput] = useState(data.doctorId ?? "");
  const [doctorIdStatus, setDoctorIdStatus] = useState("");

  const [form, setForm] = useState({
    fullName: storedPersonal.fullName || "",
    email: storedPersonal.email || "",
    phoneNumber: storedPersonal.phoneNumber || "",
    yearsOfExperience: storedPersonal.yearsOfExperience || "",
    clinicHospitalName: storedPersonal.clinicHospitalName || "",
    clinicAddress: storedPersonal.clinicAddress || "",
  });

  const handleFormChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---- specialization state ----
  const initialSpec = storedPersonal.medicalSpecialization || "";
  const initialSpecIsOther =
    initialSpec && !SPECIALIZATIONS.includes(initialSpec) && initialSpec !== "Other";
  const [specializationQuery, setSpecializationQuery] = useState(initialSpec);
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    initialSpecIsOther ? "Other" : initialSpec
  );
  const [otherSpecialization, setOtherSpecialization] = useState(
    initialSpecIsOther ? initialSpec : ""
  );
  const [specFocused, setSpecFocused] = useState(false);

  const filteredSpecializations = useMemo(() => {
    const q = specializationQuery.toLowerCase();
    return SPECIALIZATIONS.filter((s) => s.toLowerCase().includes(q));
  }, [specializationQuery]);

  const isSpecializationOther = selectedSpecialization === "Other";

  // ---- state / city state ----
  const stateFromStorage = storedPersonal.state || "";
  const cityFromStorage = storedPersonal.city || "";
  const [stateQuery, setStateQuery] = useState(stateFromStorage);
  const [stateFocused, setStateFocused] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState(
    stateFromStorage && STATE_NAME_TO_ISO[stateFromStorage] ? stateFromStorage : ""
  );
  const [isOtherState, setIsOtherState] = useState(
    Boolean(stateFromStorage && !STATE_NAME_TO_ISO[stateFromStorage])
  );
  const [otherStateName, setOtherStateName] = useState(
    stateFromStorage && !STATE_NAME_TO_ISO[stateFromStorage] ? stateFromStorage : ""
  );

  const [cityQuery, setCityQuery] = useState(cityFromStorage);
  const [cityFocused, setCityFocused] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState(
    !isOtherState ? cityFromStorage : ""
  );
  const [otherCityName, setOtherCityName] = useState(
    isOtherState ? cityFromStorage : ""
  );

  useEffect(() => {
    if (data.doctorId && !doctorIdInput) {
      setDoctorIdInput(data.doctorId);
    }
  }, [data.doctorId, doctorIdInput]);

  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handleDoctorLookup = async () => {
    if (!authToken) {
      setDoctorIdStatus("Login first to auto-detect your doctor ID.");
      return;
    }
    setDoctorIdStatus("Looking up doctor ID...");
    try {
      const resp = await apiRequest("/api/doctors/my-doctor-id", { token: authToken });
      const detectedId =
        resp?.data?.doctorId ?? resp?.doctorId ?? resp?.doctor?.id ?? resp?.doctorId;
      if (detectedId) {
        setDoctorIdInput(detectedId);
        setDoctorId(detectedId);
        setDoctorIdStatus("Linked doctor ID from your account.");
      } else {
        setDoctorIdStatus("No doctor profile found for this account yet.");
      }
    } catch (err) {
      setDoctorIdStatus(err.message || "Unable to find doctor ID.");
    }
  };

  const citiesForSelectedState = useMemo(() => {
    if (!selectedStateName || isOtherState) return [];
    const iso = STATE_NAME_TO_ISO[selectedStateName];
    if (!iso) return [];
    return CSCCity.getCitiesOfState("IN", iso);
  }, [selectedStateName, isOtherState]);

  const filteredCities = useMemo(() => {
    const q = cityQuery.toLowerCase();
    return citiesForSelectedState.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [citiesForSelectedState, cityQuery]);

  const citySuggestions = filteredCities.slice(0, 8); // no scrollbar, show first few matches

  const filteredStateNames = useMemo(() => {
    const q = stateQuery.toLowerCase();
    return STATE_OPTIONS.filter((s) =>
      s.name.toLowerCase().includes(q)
    ).map((s) => s.name);
  }, [stateQuery]);

  const stateSuggestions = [...filteredStateNames, "Other"];

  const handleSelectState = (name) => {
    if (name === "Other") {
      setIsOtherState(true);
      setSelectedStateName("");
      setStateQuery("Other");
      setOtherStateName("");
      setSelectedCityName("");
      setCityQuery("");
      setOtherCityName("");
    } else {
      setIsOtherState(false);
      setSelectedStateName(name);
      setStateQuery(name);
      setOtherStateName("");
      setSelectedCityName("");
      setCityQuery("");
      setOtherCityName("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // required checks for custom fields
    const specializationValue = isSpecializationOther
      ? otherSpecialization.trim()
      : (selectedSpecialization || specializationQuery).trim();

    if (!specializationValue) {
      alert("Please select your medical specialization.");
      return;
    }
    if (isSpecializationOther && !otherSpecialization.trim()) {
      alert("Please enter your specialization in the 'Other' field.");
      return;
    }

    const finalState = isOtherState
      ? otherStateName.trim()
      : selectedStateName;
    const finalCity = isOtherState ? otherCityName.trim() : selectedCityName;

    if (!finalState) {
      alert("Please select or enter your state.");
      return;
    }
    if (!finalCity) {
      alert("Please select or enter your city.");
      return;
    }

    const finalPersonal = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      medicalSpecialization: specializationValue,
      yearsOfExperience: form.yearsOfExperience,
      clinicHospitalName: form.clinicHospitalName.trim(),
      clinicAddress: form.clinicAddress.trim(),
      state: finalState,
      city: finalCity,
    };

    updatePersonal(finalPersonal);
    if (doctorIdInput.trim()) {
      setDoctorId(doctorIdInput);
    }

    navigate("/register/qualifications");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav just for registration flow */}
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
          {/* Progress bar card (step 1) */}
          <div className="rounded-2xl bg-white px-6 py-5 shadow-sm ring-1 ring-slate-200 sm:px-8">
            <RegistrationProgressBar currentStep={1} />
          </div>

          {/* Form card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            {/* Form */}
            <form
              className="space-y-6 px-6 py-6 sm:px-8 sm:py-8"
              onSubmit={handleSubmit}
            >
              <div>
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Personal Details
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Please provide your details as they appear on your official
                  medical certificates.
                </p>
              </div>

              {/* Doctor ID helper */}
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Doctor ID
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={doctorIdInput}
                    onChange={(e) => setDoctorIdInput(e.target.value)}
                    placeholder="Paste your doctorId or auto-detect if logged in"
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={handleDoctorLookup}
                    className="inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 sm:w-48"
                  >
                    Detect from account
                  </button>
                </div>
                {doctorIdStatus && (
                  <p className="text-xs text-slate-500">{doctorIdStatus}</p>
                )}
              </div>

              {/* Full name */}
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full Name (as per certificate)
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleFormChange("fullName")}
                  placeholder="Enter your full name"
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                  required
                />
              </div>

              {/* Email + phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange("email")}
                    placeholder="Enter your email address"
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleFormChange("phoneNumber")}
                    placeholder="Enter your phone number"
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                    required
                  />
                </div>
              </div>

              {/* Specialization + experience */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Medical Specialization (searchable + Other) */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Medical Specialization
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search specialization..."
                      value={specializationQuery}
                      onChange={(e) => {
                        setSpecializationQuery(e.target.value);
                        setSelectedSpecialization("");
                      }}
                      onFocus={() => setSpecFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setSpecFocused(false), 120)
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                      required
                    />
                    {specFocused && filteredSpecializations.length > 0 && (
                      <div className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-sm">
                        {filteredSpecializations.map((spec) => (
                          <button
                            key={spec}
                            type="button"
                            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSelectedSpecialization(spec);
                              setSpecializationQuery(
                                spec === "Other" ? "" : spec
                              );
                              setSpecFocused(false);
                            }}
                          >
                            {spec}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {isSpecializationOther && (
                    <input
                      type="text"
                      placeholder="Enter your specialization"
                      value={otherSpecialization}
                      onChange={(e) =>
                        setOtherSpecialization(e.target.value)
                      }
                      className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                      required
                    />
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    type="number"
                    min="0"
                    value={form.yearsOfExperience}
                    onChange={handleFormChange("yearsOfExperience")}
                    placeholder="e.g., 5"
                    className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                    required
                  />
                </div>
              </div>

              {/* Clinic name */}
              <div className="space-y-1">
                <label
                  htmlFor="clinicName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Clinic / Hospital Name
                </label>
                <input
                  id="clinicName"
                  type="text"
                  value={form.clinicHospitalName}
                  onChange={handleFormChange("clinicHospitalName")}
                  placeholder="Enter clinic or hospital name"
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label
                  htmlFor="clinicAddress"
                  className="block text-sm font-medium text-slate-700"
                >
                  Clinic Address
                </label>
                <textarea
                  id="clinicAddress"
                  rows={3}
                  value={form.clinicAddress}
                  onChange={handleFormChange("clinicAddress")}
                  placeholder="Enter the full address"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                  required
                />
              </div>

              {/* State + city (search + dependent) */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* State */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">
                    State
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search state..."
                      value={stateQuery}
                      onChange={(e) => {
                        setStateQuery(e.target.value);
                        setSelectedStateName("");
                        setIsOtherState(false);
                      }}
                      onFocus={() => setStateFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setStateFocused(false), 120)
                      }
                      className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                      required
                    />
                   {stateFocused && stateSuggestions.length > 0 && (
  <div className="absolute bottom-[110%] left-0 z-10 w-full rounded-md border border-slate-200 bg-white shadow-sm">
    {stateSuggestions.map((name) => (
      <button
        key={name}
        type="button"
        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          handleSelectState(name);
          setStateFocused(false);
        }}
      >
        {name}
      </button>
    ))}
  </div>
)}

                  </div>
                  {isOtherState && (
                    <input
                      type="text"
                      placeholder="Enter your state"
                      value={otherStateName}
                      onChange={(e) => setOtherStateName(e.target.value)}
                      className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                      required
                    />
                  )}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">
                    City
                  </label>

                  {!isOtherState ? (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={
                          selectedStateName
                            ? "Search city..."
                            : "Select state first"
                        }
                        value={cityQuery}
                        onChange={(e) => {
                          setCityQuery(e.target.value);
                          setSelectedCityName("");
                        }}
                        onFocus={() => setCityFocused(true)}
                        onBlur={() =>
                          setTimeout(() => setCityFocused(false), 120)
                        }
                        disabled={!selectedStateName}
                        className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2 disabled:bg-slate-100"
                        required
                      />
                     {cityFocused &&
  selectedStateName &&
  citySuggestions.length > 0 && (
    <div className="absolute bottom-[110%] left-0 z-10 w-full rounded-md border border-slate-200 bg-white shadow-sm">
      {citySuggestions.map((city) => (
        <button
          key={city.name}
          type="button"
          className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setSelectedCityName(city.name);
            setCityQuery(city.name);
            setCityFocused(false);
          }}
        >
          {city.name}
        </button>
      ))}
    </div>
  )}

                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={otherCityName}
                      onChange={(e) => setOtherCityName(e.target.value)}
                      className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
                      required
                    />
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>Save &amp; Continue</span>
                  <span className="text-lg leading-none">↗</span>
                </button>
              </div>
              </form>
            </div>
        </div>
      </main>
    </div>
  );
}
