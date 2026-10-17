import ProfileService from "../profile/profile.service";
import ChildModeDetector from "../../services/ai/modeDetector";
import LlmClient from "../../services/ai/llmClient";
import { ChildMode } from "./prompts/modePrompts";
import { SEL_MILESTONES, SelAward } from "./prompts/selPrompts";
import logger from "../../core/utils/logger";

export interface InteractionRequest {
  childId: string;
  text: string;
  manualModeOverride?: ChildMode;
}

export interface InteractionResponse {
  reply: string;
  activeMode: ChildMode;
  detectedMood: string;
  reason: string;
  level: "L1" | "L2" | "L3";
  selFeedback?: SelAward;
  levelProgress: {
    currentLevel: string;
    points: number;
    starsEarned: number;
    leveledUp: boolean;
  };
  latencyMs: number;
  provider: string;
  timestamp: string;
}

interface ChildSessionState {
  childId: string;
  activeMode: ChildMode;
  consecutiveLearningTurns: number;
  messages: Array<{ sender: "child" | "tutor"; text: string; mode: ChildMode; timestamp: Date }>;
  totalInteractions: number;
}

// In-Memory LRU Session Cache for instant < 5ms retrieval across multiple children
const sessionCache = new Map<string, ChildSessionState>();

export class TutorService {
  private static getOrCreateSession(childId: string): ChildSessionState {
    let session = sessionCache.get(childId);
    if (!session) {
      session = {
        childId,
        activeMode: "learning",
        consecutiveLearningTurns: 0,
        messages: [],
        totalInteractions: 0,
      };
      sessionCache.set(childId, session);
    }
    return session;
  }

  public static async processInteraction(
    req: InteractionRequest
  ): Promise<InteractionResponse> {
    const session = this.getOrCreateSession(req.childId);
    const profile = await ProfileService.getProfileById(req.childId);

    // 1. Detect Child Mode & Mood (Learning / Conversation / Engagement / Support)
    const modeResult = ChildModeDetector.detectMode(
      req.text,
      session.activeMode,
      session.consecutiveLearningTurns,
      req.manualModeOverride
    );

    // Update session mode
    session.activeMode = modeResult.mode;

    // Track consecutive learning turns to prevent cognitive fatigue
    if (session.activeMode === "learning") {
      session.consecutiveLearningTurns += 1;
    } else {
      session.consecutiveLearningTurns = 0; // Reset counter when resting/playing
    }

    // 2. Generate Context-Aware LLM Response with Sub-2s SLA
    const aiResult = await LlmClient.generateResponse({
      childName: profile.name,
      childAge: profile.age,
      level: profile.currentLevel,
      mode: session.activeMode,
      userMessage: req.text,
      conversationHistory: session.messages.slice(-6),
      masteredVocabulary: profile.masteredVocabulary || [],
    });

    // 3. Evaluate Social and Emotional Learning (SEL)
    let selFeedback: SelAward | undefined;
    if (modeResult.selTriggered) {
      if (modeResult.selTriggered === "resilience") {
        selFeedback = SEL_MILESTONES.persistence;
      } else if (modeResult.selTriggered === "curiosity") {
        selFeedback = SEL_MILESTONES.curiosity;
      } else if (modeResult.selTriggered === "joy") {
        selFeedback = SEL_MILESTONES.calmness;
      } else {
        selFeedback = SEL_MILESTONES.first_try;
      }
    }

    // 4. Update Child Profile Progression (Stars & Level Progression)
    const pointsToAdd = session.activeMode === "learning" ? 25 : 15;
    const starAwarded = !!selFeedback;
    const progressUpdate = await ProfileService.awardProgress(
      req.childId,
      pointsToAdd,
      starAwarded,
      aiResult.suggestedWord,
      modeResult.detectedMood
    );

    // 5. Store in Session History
    session.messages.push({
      sender: "child",
      text: req.text,
      mode: session.activeMode,
      timestamp: new Date(),
    });

    session.messages.push({
      sender: "tutor",
      text: aiResult.reply,
      mode: session.activeMode,
      timestamp: new Date(),
    });

    session.totalInteractions += 1;

    logger.info(
      `[Tutor Interaction] Child: ${profile.name} (${profile.currentLevel}) | Mode: ${session.activeMode} | Mood: ${modeResult.detectedMood} | Latency: ${aiResult.latencyMs}ms`
    );

    return {
      reply: aiResult.reply,
      activeMode: session.activeMode,
      detectedMood: modeResult.detectedMood,
      reason: modeResult.reason,
      level: progressUpdate.profile.currentLevel,
      selFeedback,
      levelProgress: {
        currentLevel: progressUpdate.profile.currentLevel,
        points: progressUpdate.profile.masteryPoints,
        starsEarned: progressUpdate.profile.starsEarned,
        leveledUp: progressUpdate.leveledUp,
      },
      latencyMs: aiResult.latencyMs,
      provider: aiResult.provider,
      timestamp: new Date().toISOString(),
    };
  }

  public static getSessionHistory(childId: string) {
    const session = this.getOrCreateSession(childId);
    return {
      childId,
      activeMode: session.activeMode,
      totalInteractions: session.totalInteractions,
      messages: session.messages,
    };
  }

  public static resetSession(childId: string) {
    sessionCache.delete(childId);
    return { success: true, message: `Session for child ${childId} has been reset.` };
  }
}

export default TutorService;
