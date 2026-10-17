const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchProfiles(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/profiles`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch profiles");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("fetchProfiles error:", error);
    // Fallback demo profiles if backend is temporarily unreachable
    return [
      {
        _id: "child_leo_l1",
        name: "Leo",
        age: 4,
        avatar: "bear",
        currentLevel: "L1",
        masteryPoints: 20,
        starsEarned: 5,
        currentStreakDays: 2,
        masteredVocabulary: ["Cat", "Red", "Apple"],
      },
      {
        _id: "child_sam_l2",
        name: "Sam",
        age: 5,
        avatar: "fox",
        currentLevel: "L2",
        masteryPoints: 50,
        starsEarned: 12,
        currentStreakDays: 4,
        masteredVocabulary: ["Big dog", "Blue ball", "Happy sun"],
      },
      {
        _id: "child_maya_l3",
        name: "Maya",
        age: 6,
        avatar: "owl",
        currentLevel: "L3",
        masteryPoints: 85,
        starsEarned: 24,
        currentStreakDays: 7,
        masteredVocabulary: ["The rocket is flying to space", "I love chocolate ice cream"],
      },
    ];
  }
}

export async function sendTutorInteraction(payload: {
  childId: string;
  text: string;
  manualModeOverride?: string;
}): Promise<any> {
  const startTime = Date.now();
  try {
    const res = await fetch(`${API_BASE_URL}/tutor/interact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn("API interact failed, using instant client fallback:", error);
    const latencyMs = Date.now() - startTime;
    return {
      reply: `Toby heard you! ⭐ Great try! Can you say: "Happy"? 😊`,
      activeMode: payload.manualModeOverride || "learning",
      detectedMood: "happy",
      reason: "Local graceful fallback",
      level: "L1",
      levelProgress: { currentLevel: "L1", points: 30, starsEarned: 6, leveledUp: false },
      latencyMs,
      provider: "client-fallback",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchAnalyticsMetrics(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/metrics`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch analytics");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("fetchAnalyticsMetrics error:", error);
    return null;
  }
}

export async function resetTutorSession(childId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/tutor/reset/${childId}`, {
      method: "POST",
    });
    return await res.json();
  } catch {
    return { success: true };
  }
}
