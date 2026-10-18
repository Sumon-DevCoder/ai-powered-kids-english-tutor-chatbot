const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const AUTH_TOKEN_KEY = "toby_parent_auth_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export async function loginParent(credentials: {
  email: string;
  password: string;
}): Promise<{ user: any; token: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Failed to login");
  }

  if (json.data?.token) {
    setAuthToken(json.data.token);
  }

  return json.data;
}

export async function fetchCurrentUser(): Promise<any> {
  const token = getAuthToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Unauthorized");
  }
  return json.data;
}

export async function fetchProfiles(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/profiles`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch profiles: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("fetchProfiles error:", error);
    throw error;
  }
}

export async function sendTutorInteraction(payload: {
  childId: string;
  text: string;
  manualModeOverride?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/tutor/interact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return json.data;
}

export async function fetchAnalyticsMetrics(): Promise<any> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/analytics/metrics`, {
    cache: "no-store",
    headers,
  });
  if (!res.ok) {
    if (res.status === 401) {
      removeAuthToken();
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(`Failed to fetch analytics: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

export async function resetTutorSession(childId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/tutor/reset/${childId}`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to reset tutor session: ${res.status}`);
  }
  return await res.json();
}

