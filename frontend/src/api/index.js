const API_URL = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const register = async (email, username, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getLibrary = async (params = {}) => {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined,
      ),
    ),
  ).toString();

  const res = await fetch(`${API_URL}/library${query ? `?${query}` : ""}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getLibraryItem = async (id) => {
  const res = await fetch(`${API_URL}/library/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const createLibraryItem = async (formData) => {
  const res = await fetch(`${API_URL}/library`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateLibraryItem = async (id, formData) => {
  const res = await fetch(`${API_URL}/library/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const deleteLibraryItem = async (id) => {
  const res = await fetch(`${API_URL}/library/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const toggleFavorite = async (id) => {
  const res = await fetch(`${API_URL}/library/${id}/favorite`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const getProfile = async () => {
  const res = await fetch(`${API_URL}/profile`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};

export const updateProfile = async (formData) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
};
