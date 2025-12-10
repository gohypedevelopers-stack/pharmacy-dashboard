import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "doctorRegistrationData";

const defaultState = {
  doctorId: "",
  personal: {
    fullName: "",
    email: "",
    phoneNumber: "",
    medicalSpecialization: "",
    yearsOfExperience: "",
    clinicHospitalName: "",
    clinicAddress: "",
    state: "",
    city: "",
  },
  registration: {
    registrationNumber: "",
    councilName: "",
    councilDisplayName: "",
    issueDate: "",
  },
  identity: {
    documentType: "",
  },
  files: {
    mbbsCertificate: null,
    mdMsBdsCertificate: null,
    registrationCertificate: null,
    governmentId: null,
    selfie: null,
  },
};

const hydrateFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      personal: { ...defaultState.personal, ...parsed.personal },
      registration: { ...defaultState.registration, ...parsed.registration },
      identity: { ...defaultState.identity, ...parsed.identity },
      files: { ...defaultState.files },
    };
  } catch {
    return defaultState;
  }
};

const RegistrationContext = createContext(null);

export const RegistrationProvider = ({ children }) => {
  const [data, setData] = useState(() => hydrateFromStorage());

  useEffect(() => {
    const snapshot = {
      doctorId: data.doctorId,
      personal: data.personal,
      registration: data.registration,
      identity: data.identity,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [data.doctorId, data.personal, data.registration, data.identity]);

  const setDoctorId = (doctorId) =>
    setData((prev) => ({
      ...prev,
      doctorId: doctorId?.trim() ?? "",
    }));

  const updatePersonal = (updates) =>
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...updates },
    }));

  const updateRegistration = (updates) =>
    setData((prev) => ({
      ...prev,
      registration: { ...prev.registration, ...updates },
    }));

  const updateIdentity = (updates) =>
    setData((prev) => ({
      ...prev,
      identity: { ...prev.identity, ...updates },
    }));

  const updateFiles = (files) =>
    setData((prev) => ({
      ...prev,
      files: { ...prev.files, ...files },
    }));

  const resetRegistration = (preserveDoctorId = true) => {
    const doctorId = preserveDoctorId ? data.doctorId : "";
    setData({ ...defaultState, doctorId });
    if (!preserveDoctorId) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      data,
      setDoctorId,
      updatePersonal,
      updateRegistration,
      updateIdentity,
      updateFiles,
      resetRegistration,
    }),
    [data]
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
};

export const useRegistration = () => {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error("useRegistration must be used within a RegistrationProvider");
  }
  return ctx;
};
