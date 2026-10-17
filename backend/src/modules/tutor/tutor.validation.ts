import { z } from "zod";

export const interactSchema = z.object({
  body: z.object({
    childId: z.string().min(1, "childId is required"),
    text: z.string().min(1, "text is required").max(500),
    manualModeOverride: z
      .enum(["learning", "conversation", "engagement", "support"])
      .optional(),
  }),
});

export const sessionParamSchema = z.object({
  params: z.object({
    childId: z.string().min(1, "childId parameter is required"),
  }),
});
