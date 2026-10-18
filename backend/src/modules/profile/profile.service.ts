import mongoose from "mongoose";
import { ChildProfile, inMemoryProfileStore, IChildProfile } from "./profile.model";
import ApiError from "../../core/errors/ApiError";
import { StatusCodes } from "http-status-codes";
import logger from "../../core/utils/logger";

export class ProfileService {
  public static async getAllProfiles(): Promise<any[]> {
    try {
      if (mongoose.connection.readyState === 1) {
        const dbProfiles = await ChildProfile.find().lean();
        if (dbProfiles && dbProfiles.length > 0) {
          return dbProfiles;
        }
      }
    } catch {
      // Graceful fallback to memory store
    }
    return Array.from(inMemoryProfileStore.values());
  }

  public static async getProfileById(childId: string): Promise<any> {
    try {
      if (mongoose.connection.readyState === 1) {
        const dbProfile = await ChildProfile.findById(childId).lean();
        if (dbProfile) return dbProfile;
      }
    } catch {
      // Fallback
    }

    const memoryProfile = inMemoryProfileStore.get(childId);
    if (!memoryProfile) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Child profile not found: ${childId}`);
    }
    return memoryProfile;
  }

  public static async createProfile(payload: Partial<IChildProfile>): Promise<any> {
    try {
      const newProfile = await ChildProfile.create(payload);
      inMemoryProfileStore.set(newProfile._id.toString(), newProfile.toObject());
      return newProfile;
    } catch {
      const generatedId = `child_${Date.now()}`;
      const newInMemory = {
        _id: generatedId,
        masteryPoints: 0,
        starsEarned: 0,
        currentStreakDays: 1,
        masteredVocabulary: [],
        recentMood: "curious",
        ...payload,
      };
      inMemoryProfileStore.set(generatedId, newInMemory);
      return newInMemory;
    }
  }

  public static async awardProgress(
    childId: string,
    pointsAwarded: number,
    starAwarded: boolean,
    newWord?: string,
    detectedMood?: string
  ): Promise<{ profile: any; leveledUp: boolean; previousLevel: string }> {
    const profile = await this.getProfileById(childId);
    const previousLevel = profile.currentLevel;
    let leveledUp = false;

    // Update stats
    profile.masteryPoints = (profile.masteryPoints || 0) + pointsAwarded;
    if (starAwarded) {
      profile.starsEarned = (profile.starsEarned || 0) + 1;
    }
    if (newWord && !profile.masteredVocabulary.includes(newWord)) {
      profile.masteredVocabulary.push(newWord);
    }
    if (detectedMood) {
      profile.recentMood = detectedMood;
    }

    // Level progression threshold: 100 points per level
    if (profile.currentLevel === "L1" && profile.masteryPoints >= 100) {
      profile.currentLevel = "L2";
      profile.masteryPoints = profile.masteryPoints - 100;
      leveledUp = true;
      logger.info(`🎉 LEVEL UP! Child ${profile.name} promoted to L2!`);
    } else if (profile.currentLevel === "L2" && profile.masteryPoints >= 100) {
      profile.currentLevel = "L3";
      profile.masteryPoints = profile.masteryPoints - 100;
      leveledUp = true;
      logger.info(`🎉 LEVEL UP! Child ${profile.name} promoted to L3!`);
    }

    // Persist to memory store
    inMemoryProfileStore.set(childId, { ...profile });

    // Persist to DB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        await ChildProfile.findByIdAndUpdate(childId, {
          currentLevel: profile.currentLevel,
          masteryPoints: profile.masteryPoints,
          starsEarned: profile.starsEarned,
          masteredVocabulary: profile.masteredVocabulary,
          recentMood: profile.recentMood,
        });
      } catch {
        // In-memory update was already performed
      }
    }

    return { profile, leveledUp, previousLevel };
  }
}

export default ProfileService;
