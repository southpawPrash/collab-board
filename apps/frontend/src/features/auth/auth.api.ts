const API_BASE = "http://localhost:3000"; // backend port

export type SignupResponse = {
  id: number;
  email: string;
};

export const signup = async (
  email: string,
  password: string,
): Promise<SignupResponse> => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
};

export const login = async (
  email: string,
  password: string,
): Promise<{ access_token: string }> => {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};
