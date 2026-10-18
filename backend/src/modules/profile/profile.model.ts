import mongoose, { Schema, Document } from "mongoose";

export interface IChildProfile {
  _id: string;
  name: string;
  age: number; // strictly 3 to 7
  avatar: string; // e.g. "bear", "fox", "owl", "bunny"
  currentLevel: "L1" | "L2" | "L3";
  masteryPoints: number;
  starsEarned: number;
  currentStreakDays: number;
  masteredVocabulary: string[];
  favoriteTopics: string[];
  recentMood: "happy" | "tired" | "frustrated" | "curious" | "shy";
  createdAt?: Date;
  updatedAt?: Date;
}

const childProfileSchema = new Schema<IChildProfile>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 2, max: 8 },
    avatar: { type: String, default: "bear" },
    currentLevel: { type: String, enum: ["L1", "L2", "L3"], default: "L1" },
    masteryPoints: { type: Number, default: 0 },
    starsEarned: { type: Number, default: 0 },
    currentStreakDays: { type: Number, default: 1 },
    masteredVocabulary: { type: [String], default: [] },
    favoriteTopics: { type: [String], default: ["Animals", "Colors"] },
    recentMood: {
      type: String,
      enum: ["happy", "tired", "frustrated", "curious", "shy"],
      default: "curious",
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const ChildProfile = mongoose.model<IChildProfile>(
  "ChildProfile",
  childProfileSchema
);

// High-Speed In-Memory Profiles Store for Multi-Child Demo & Offline Mode
export const initialProfiles: Array<{
  _id: string;
  name: string;
  age: number;
  avatar: string;
  currentLevel: "L1" | "L2" | "L3";
  masteryPoints: number;
  starsEarned: number;
  currentStreakDays: number;
  masteredVocabulary: string[];
  favoriteTopics: string[];
  recentMood: "happy" | "tired" | "frustrated" | "curious" | "shy";
}> = [
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
    favoriteTopics: ["Animals", "Colors"],
    recentMood: "curious",
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
    masteredVocabulary: ["Big dog", "Blue ball", "Happy sun", "Running fast"],
    favoriteTopics: ["Vehicles", "Sports"],
    recentMood: "happy",
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
    masteredVocabulary: [
      "The rocket is flying to space",
      "I love chocolate ice cream",
      "My fluffy rabbit likes carrots",
    ],
    favoriteTopics: ["Space", "Stories", "Dinosaurs"],
    recentMood: "happy",
  },
];

export const inMemoryProfileStore = new Map<string, any>(
  initialProfiles.map((p) => [p._id, { ...p }])
);

export const seedInitialProfiles = async () => {
  try {
    for (const p of initialProfiles) {
      const exists = await ChildProfile.findById(p._id);
      if (!exists) {
        await ChildProfile.create(p);
      }
    }
  } catch (err) {
    // Graceful
  }
};
