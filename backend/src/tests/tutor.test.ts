import { describe, it, expect } from "vitest";
import TutorService from "../modules/tutor/tutor.service";
import ChildModeDetector from "../services/ai/modeDetector";
import ProfileService from "../modules/profile/profile.service";

describe("AI Kids English Tutor - Core Engine Tests", () => {
  it("should detect fatigue and switch to Engagement Mode", () => {
    const result = ChildModeDetector.detectMode("I am so tired today", "learning", 1);
    expect(result.mode).toBe("engagement");
    expect(result.detectedMood).toBe("tired");
    expect(result.selTriggered).toBe("joy");
  });

  it("should detect frustration and switch to Support Mode", () => {
    const result = ChildModeDetector.detectMode("This is too hard I cannot do it", "learning", 1);
    expect(result.mode).toBe("support");
    expect(result.detectedMood).toBe("frustrated");
    expect(result.selTriggered).toBe("resilience");
  });

  it("should automatically break learning fatigue after 3 consecutive learning turns", () => {
    const result = ChildModeDetector.detectMode("Apple", "learning", 3);
    expect(result.mode).toBe("engagement");
    expect(result.reason).toContain("Preventing learning fatigue");
  });

  it("should maintain multi-child profile isolation between L1 (Leo) and L3 (Maya)", async () => {
    const leoResponse = await TutorService.processInteraction({
      childId: "child_leo_l1",
      text: "Cat",
    });
    expect(leoResponse.level).toBe("L1");

    const mayaResponse = await TutorService.processInteraction({
      childId: "child_maya_l3",
      text: "I want to fly to space!",
    });
    expect(mayaResponse.level).toBe("L3");

    // Contexts must remain isolated
    const leoHistory = TutorService.getSessionHistory("child_leo_l1");
    const mayaHistory = TutorService.getSessionHistory("child_maya_l3");

    expect(leoHistory.childId).toBe("child_leo_l1");
    expect(mayaHistory.childId).toBe("child_maya_l3");
    expect(leoHistory.messages).not.toEqual(mayaHistory.messages);
  });

  it("should fulfill the sub-2.0s latency performance requirement", async () => {
    const startTime = Date.now();
    const response = await TutorService.processInteraction({
      childId: "child_leo_l1",
      text: "Hello Toby!",
    });
    const totalDuration = Date.now() - startTime;

    expect(response.latencyMs).toBeLessThan(2000);
    expect(totalDuration).toBeLessThan(2000);
    expect(response.reply).toBeDefined();
    expect(response.reply.length).toBeGreaterThan(0);
  });

  it("should progress points and award stars for child interactions", async () => {
    const initialProfile = await ProfileService.getProfileById("child_sam_l2");
    const initialPoints = initialProfile.masteryPoints;

    await TutorService.processInteraction({
      childId: "child_sam_l2",
      text: "The blue bird is singing",
    });

    const updatedProfile = await ProfileService.getProfileById("child_sam_l2");
    expect(updatedProfile.masteryPoints).toBeGreaterThan(initialPoints);
  });
});
