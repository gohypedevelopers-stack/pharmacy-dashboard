export function getPharmacySession() {
  try {
    const stored = localStorage.getItem("pharmacySession");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse pharmacy session from localStorage:", error);
    return null;
  }
}

export function getPharmacyToken() {
  return getPharmacySession()?.token ?? null;
}
