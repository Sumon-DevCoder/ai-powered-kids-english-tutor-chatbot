"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatBubbleProps {
  sender: "child" | "tutor";
  text: string;
  mode?: string;
  latencyMs?: number;
  timestamp?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  mode,
  latencyMs,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = (content: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const cleanText = content.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.2; // Slightly higher/friendly bear pitch

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (sender === "tutor") {
    return (
      <div className="flex items-start gap-3 w-full max-w-2xl animate-fade-in my-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-xl shrink-0 shadow-md">
          🐻
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <div className="bg-white border-2 border-amber-200 rounded-3xl rounded-tl-sm p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative">
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
              {text}
            </p>

            {/* Audio Read-Out Button */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-100">
              <button
                type="button"
                onClick={() => speakText(text)}
                aria-label="Listen to Toby read this aloud"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer select-none"
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4 text-red-500" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>Listen 🔊</span>
                  </>
                )}
              </button>

              {/* Latency and Mode Indicator */}
              <div className="flex items-center gap-2">
                {mode && (
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {mode}
                  </span>
                )}
                {latencyMs !== undefined && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ⚡ {latencyMs}ms
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Child Message
  return (
    <div className="flex items-end justify-end gap-3 w-full max-w-2xl ml-auto my-2 animate-fade-in">
      <div className="bg-sky-500 text-white rounded-3xl rounded-br-sm p-4 sm:p-5 shadow-md max-w-lg">
        <p className="text-base sm:text-lg font-semibold">{text}</p>
      </div>
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-400 border-2 border-sky-600 flex items-center justify-center text-xl shrink-0 shadow-md">
        🧒
      </div>
    </div>
  );
};

export default ChatBubble;
