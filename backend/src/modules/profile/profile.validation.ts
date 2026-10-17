import { z } from "zod";

export const createProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(30),
    age: z.number().min(2).max(8),
    avatar: z.enum(["bear", "fox", "owl", "bunny"]).default("bear"),
    currentLevel: z.enum(["L1", "L2", "L3"]).default("L1"),
    favoriteTopics: z.array(z.string()).optional(),
  }),
});

export const updateProfileSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Child profile ID is required"),
  }),
  body: z.object({
    name: z.string().min(1).max(30).optional(),
    age: z.number().min(2).max(8).optional(),
    avatar: z.enum(["bear", "fox", "owl", "bunny"]).optional(),
    currentLevel: z.enum(["L1", "L2", "L3"]).optional(),
    recentMood: z.enum(["happy", "tired", "frustrated", "curious", "shy"]).optional(),
    favoriteTopics: z.array(z.string()).optional(),
  }),
});
