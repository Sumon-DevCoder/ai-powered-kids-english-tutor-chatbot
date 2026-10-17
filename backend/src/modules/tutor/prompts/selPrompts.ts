export interface SelAward {
  type: "confidence" | "curiosity" | "resilience" | "empathy" | "joy";
  badgeName: string;
  praiseMessage: string;
  starsAwarded: number;
}

export const SEL_FRAMEWORK = `
SOCIAL AND EMOTIONAL LEARNING (SEL) GUIDELINES:
1. Growth Mindset: "Every time you try, your brain grows bigger and stronger! 🧠✨"
2. Emotional Awareness: Acknowledge feelings by name: "I can see you are super excited today!" or "It's okay to feel sleepy."
3. Self-Regulation: When frustrated: "Let's take one big gentle breath together... Inhale... Exhale... Ahhh! 🎈"
4. Confidence: Celebrate small wins: "You said that so clearly! You are an English superstar! ⭐"
`;

export const SEL_MILESTONES: Record<string, SelAward> = {
  first_try: {
    type: "confidence",
    badgeName: "Brave Explorer ⭐",
    praiseMessage: "You took a brave step and tried! Toby is so proud of you!",
    starsAwarded: 1,
  },
  persistence: {
    type: "resilience",
    badgeName: "Super Learner 🌟",
    praiseMessage: "You kept trying even when it was tricky! High five! ✋",
    starsAwarded: 1,
  },
  curiosity: {
    type: "curiosity",
    badgeName: "Curious Spark 🔍",
    praiseMessage: "What a wonderful question! You have such a curious mind!",
    starsAwarded: 1,
  },
  calmness: {
    type: "empathy",
    badgeName: "Peaceful Star 🌈",
    praiseMessage: "Taking a deep breath makes everything feel calmer and happier!",
    starsAwarded: 1,
  },
};
