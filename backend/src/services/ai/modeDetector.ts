import { ChildMode } from "../../modules/tutor/prompts/modePrompts";

export interface ModeDetectionResult {
  mode: ChildMode;
  detectedMood: "happy" | "tired" | "frustrated" | "curious" | "shy";
  reason: string;
  selTriggered?: "confidence" | "curiosity" | "resilience" | "empathy" | "joy";
}

export class ChildModeDetector {
  public static detectMode(
    userText: string,
    currentMode: ChildMode,
    consecutiveLearningTurns: number,
    manualOverride?: ChildMode
  ): ModeDetectionResult {
    if (manualOverride) {
      return {
        mode: manualOverride,
        detectedMood: "curious",
        reason: `Manually set by evaluator to ${manualOverride}`,
      };
    }

    const text = (userText || "").toLowerCase().trim();

    // 1. Check for Fatigue / Boredom -> Switch to Engagement (Fun)
    const fatigueKeywords = [
      "tired",
      "sleepy",
      "boring",
      "bored",
      "stop",
      "no more",
      "yawn",
      "don't want",
      "play game",
      "funny",
    ];
    if (fatigueKeywords.some((w) => text.includes(w))) {
      return {
        mode: "engagement",
        detectedMood: "tired",
        reason: "Detected fatigue or desire for fun; switching to Engagement Mode.",
        selTriggered: "joy",
      };
    }

    // 2. Check for Frustration / Difficulty -> Switch to Support
    const distressKeywords = [
      "sad",
      "cry",
      "crying",
      "too hard",
      "can't",
      "cant do",
      "i don't know",
      "scared",
      "angry",
      "mad",
      "hate",
      "bad",
    ];
    if (distressKeywords.some((w) => text.includes(w))) {
      return {
        mode: "support",
        detectedMood: "frustrated",
        reason: "Detected frustration or difficulty; switching to Support Mode.",
        selTriggered: "resilience",
      };
    }

    // 3. Consecutive Learning Turn Fatigue Breaker
    // If child has answered 3 consecutive learning turns, break out into Engagement
    if (currentMode === "learning" && consecutiveLearningTurns >= 3) {
      return {
        mode: "engagement",
        detectedMood: "happy",
        reason: "Preventing learning fatigue after 3 consecutive lessons; offering a fun break.",
        selTriggered: "joy",
      };
    }

    // 4. Check for Casual Friendly / Conversational Chat
    const conversationKeywords = [
      "hi",
      "hello",
      "hey",
      "how are you",
      "my name is",
      "i like",
      "i have a",
      "what is your name",
      "friend",
      "today i",
    ];
    if (conversationKeywords.some((w) => text.startsWith(w) || text.includes(w))) {
      return {
        mode: "conversation",
        detectedMood: "curious",
        reason: "Friendly greeting or personal remark detected; switching to Conversation Mode.",
        selTriggered: "curiosity",
      };
    }

    // 5. Default: Maintain current mode or resume learning gently
    return {
      mode: currentMode || "learning",
      detectedMood: "happy",
      reason: "Continuing ongoing session flow naturally.",
      selTriggered: "confidence",
    };
  }
}

export default ChildModeDetector;
