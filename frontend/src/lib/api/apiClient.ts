const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
  const res = await fetch(`${API_BASE_URL}/analytics/metrics`, {
    cache: "no-store",
  });
  if (!res.ok) {
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
