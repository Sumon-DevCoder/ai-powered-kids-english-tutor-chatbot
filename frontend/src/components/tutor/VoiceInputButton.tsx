"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface VoiceInputButtonProps {
  onSpeechResult: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onSpeechResult,
  disabled = false,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [hasSupport, setHasSupport] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setHasSupport(false);
      }
    }
  }, []);

  const startListening = () => {
    if (disabled || isListening) return;

    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser. You can type using the quick buttons!");
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onSpeechResult(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={startListening}
        disabled={disabled}
        aria-label="Hold to speak to Toby"
        className={cn(
          "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-xl",
          "border-4 active:scale-90 select-none",
          isListening
            ? "bg-red-500 border-red-300 animate-ping shadow-red-300/50"
            : "bg-gradient-to-tr from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 border-amber-200 text-slate-900 hover:scale-105",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {isListening ? (
          <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-pulse" />
        ) : (
          <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950 drop-shadow-sm" />
        )}
      </button>

      <span className="text-xs sm:text-sm font-bold text-slate-600 select-none flex items-center gap-1">
        {isListening ? (
          <span className="text-red-600 font-extrabold animate-pulse flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Listening to your sweet voice...
          </span>
        ) : (
          "Tap to Speak to Toby 🎙️"
        )}
      </span>
    </div>
  );
};

export default VoiceInputButton;
