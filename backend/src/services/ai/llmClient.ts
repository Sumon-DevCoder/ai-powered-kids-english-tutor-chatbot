import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "../../config/env";
import logger from "../../core/utils/logger";
import { TOBY_MASCOT_PERSONA, LEVEL_GUIDELINES } from "../../modules/tutor/prompts/systemPrompt";
import { ChildMode, MODE_INSTRUCTIONS } from "../../modules/tutor/prompts/modePrompts";
import { SEL_FRAMEWORK } from "../../modules/tutor/prompts/selPrompts";

export interface AICompletionRequest {
  childName: string;
  childAge: number;
  level: "L1" | "L2" | "L3";
  mode: ChildMode;
  userMessage: string;
  conversationHistory: Array<{ sender: "child" | "tutor"; text: string }>;
  masteredVocabulary: string[];
}

export interface AICompletionResult {
  reply: string;
  latencyMs: number;
  provider: "gemini" | "local-engine";
  suggestedWord?: string;
}

export class LlmClient {
  private static geminiClient: GoogleGenerativeAI | null = env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(env.GEMINI_API_KEY)
    : null;

  public static async generateResponse(
    request: AICompletionRequest
  ): Promise<AICompletionResult> {
    const startTime = Date.now();

    // If Gemini API Key is configured, attempt fast Gemini 1.5/2.0 Flash completion with 1700ms watchdog
    if (this.geminiClient && env.GEMINI_API_KEY) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("LLM_TIMEOUT")), 1700)
        );

        const geminiPromise = this.callGemini(request);
        const reply = await Promise.race([geminiPromise, timeoutPromise]);
        const latencyMs = Date.now() - startTime;

        logger.info(`✨ Gemini Flash responded in ${latencyMs}ms (Mode: ${request.mode})`);
        return {
          reply,
          latencyMs,
          provider: "gemini",
        };
      } catch (err: any) {
        logger.warn(`⚠️ Gemini API slow/failed (${err.message}). Using instant local fallback engine to preserve <2s SLA.`);
      }
    }

    // High-Fidelity Local Child Intelligence Engine (Always < 50ms)
    const localReply = this.generateLocalChildResponse(request);
    const latencyMs = Date.now() - startTime;

    return {
      reply: localReply.text,
      latencyMs,
      provider: "local-engine",
      suggestedWord: localReply.suggestedWord,
    };
  }

  private static async callGemini(request: AICompletionRequest): Promise<string> {
    if (!this.geminiClient) throw new Error("Gemini client not initialized");

    const model = this.geminiClient.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 60, // Short response for kids
        temperature: 0.7,
      },
    });

    const systemPrompt = `
${TOBY_MASCOT_PERSONA}
${LEVEL_GUIDELINES[request.level]}
${MODE_INSTRUCTIONS[request.mode]}
${SEL_FRAMEWORK}

Current Child Context:
Name: ${request.childName} (Age: ${request.childAge})
Target Level: ${request.level}
Known Words: ${request.masteredVocabulary.slice(-5).join(", ") || "None yet"}

Remember: Reply in 1-2 SHORT playful sentences! Max 20 words. Use friendly emojis.
`;

    const chatHistory = request.conversationHistory
      .slice(-4)
      .map((msg) => `${msg.sender === "child" ? "Child" : "Toby"}: ${msg.text}`)
      .join("\n");

    const prompt = `${systemPrompt}\n\nRecent Chat:\n${chatHistory}\nChild: ${request.userMessage}\nToby:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  // Fast, deterministic, level-aware child responses for instant feedback (< 30ms)
  private static generateLocalChildResponse(
    req: AICompletionRequest
  ): { text: string; suggestedWord?: string } {
    const text = req.userMessage.toLowerCase();
    const name = req.childName || "friend";

    // 1. SUPPORT MODE (Gentle, Calming, SEL Resilience)
    if (req.mode === "support") {
      const supportReplies = [
        `It's totally okay, ${name}! 🤗 Toby is here with you. Let's take a big soft breath together... ahhh! 🎈`,
        `You are so brave for trying, ${name}! ⭐ Mistakes help our brain grow! Let's do a gentle high-five! ✋`,
        `Don't worry, little star! 🌟 Learning takes time, and you are doing wonderful! Ready for a smile? 😊`,
      ];
      return {
        text: supportReplies[Math.floor(Math.random() * supportReplies.length)]!,
      };
    }

    // 2. ENGAGEMENT MODE (Fun, Rhyme, Playful riddles)
    if (req.mode === "engagement") {
      const engagementReplies = [
        `Riddle time, ${name}! 🍌 I am yellow and monkeys love to eat me! Can you guess who I am?`,
        `Silly sound time! 🐮 The cow goes MOOO! Can you make a silly cow sound with me?`,
        `Bumblebee buzzy bee! 🐝 Buzz buzz buzz! Can you fly around like a tiny bee?`,
        `You worked so hard! Let's play a guessing game: I am fluffy, have long ears, and love carrots! 🥕🐰 Who am I?`,
      ];
      return {
        text: engagementReplies[Math.floor(Math.random() * engagementReplies.length)]!,
        suggestedWord: "Banana",
      };
    }

    // 3. CONVERSATION MODE (Casual Friendly Banter)
    if (req.mode === "conversation") {
      if (text.includes("hello") || text.includes("hi")) {
        return {
          text: `Hello ${name}! 🐻 I am so happy to see you today! How are you feeling right now? ⭐`,
        };
      }
      if (text.includes("dog") || text.includes("pet") || text.includes("cat")) {
        return {
          text: `Aww, animals are the best! 🐶 Toby loves fluffy friends! What is your favorite animal?`,
        };
      }
      return {
        text: `That sounds so cool, ${name}! 🎈 Toby loves chatting with you! What is your favorite toy to play with?`,
      };
    }

    // 4. LEARNING MODE (L1, L2, L3 Specific Curriculum)
    if (req.level === "L1") {
      const l1Words = [
        { word: "Apple", prompt: `Look! A red Apple! 🍎 Can you say: "Apple"? /æ/ /æ/ Apple!` },
        { word: "Cat", prompt: `Meow! 🐱 A cute Cat! Can you say: "Cat"? /k/ /k/ Cat!` },
        { word: "Sun", prompt: `Look up! A bright yellow Sun! ☀️ Can you say: "Sun"?` },
        { word: "Ball", prompt: `Boing! ⚽ A bouncy Ball! Can you say: "Ball"?` },
      ];
      const selected = l1Words[Math.floor(Math.random() * l1Words.length)]!;
      return {
        text: `Super try, ${name}! ⭐ ${selected.prompt}`,
        suggestedWord: selected.word,
      };
    }

    if (req.level === "L2") {
      const l2Phrases = [
        { word: "Blue bird", prompt: `I see a little Blue Bird singing! 🐦 Can you say: "Blue Bird"?` },
        { word: "Big dog", prompt: `Woof! 🐕 Look at that Big Dog running! Can you say: "Big Dog"?` },
        { word: "Green frog", prompt: `Ribbit! 🐸 The green frog jumps high! Can you say: "Green frog"?` },
      ];
      const selected = l2Phrases[Math.floor(Math.random() * l2Phrases.length)]!;
      return {
        text: `You are doing amazing, ${name}! 🌟 ${selected.prompt}`,
        suggestedWord: selected.word,
      };
    }

    // L3 Level
    const l3Stories = [
      { word: "Space rocket", prompt: `3, 2, 1... Blast off! 🚀 The rocket zooms into space! What planets can you see?` },
      { word: "Magic garden", prompt: `Look at the magic garden! 🌸 Which colorful flower do you want to pick first?` },
      { word: "Ocean whale", prompt: `Splash! 🐳 The giant blue whale is swimming in the deep ocean! Isn't that exciting?` },
    ];
    const selected = l3Stories[Math.floor(Math.random() * l3Stories.length)]!;
    return {
      text: `Fantastic English, ${name}! 🏆 ${selected.prompt}`,
      suggestedWord: selected.word,
    };
  }
}

export default LlmClient;
