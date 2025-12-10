const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const createHeaders = (token, isForm = false) => {
  const headers = {};
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const parseResponse = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
};

export async function apiRequest(path, { method = "GET", body, token, isForm } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: createHeaders(token, isForm),
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const parsed = await parseResponse(response);
  if (!response.ok) {
    const message = parsed?.message ?? parsed?.error ?? response.statusText;
    throw new Error(typeof message === "string" ? message : "Something went wrong");
  }
  return parsed;
}
