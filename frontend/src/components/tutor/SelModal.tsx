"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Star, Sparkles, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface SelModalProps {
  badgeName: string;
  praiseMessage: string;
  starsAwarded: number;
  onClose: () => void;
}

export const SelModal: React.FC<SelModalProps> = ({
  badgeName,
  praiseMessage,
  starsAwarded,
  onClose,
}) => {
  useEffect(() => {
    // Fire festive child-friendly confetti celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#10B981", "#38BDF8", "#EC4899", "#8B5CF6"],
      });
    } catch {
      // Graceful fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center relative animate-bounce-gentle">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Sparkling Trophy/Star */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-500 flex items-center justify-center text-4xl sm:text-5xl shadow-lg animate-wiggle">
          🌟
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
          Social & Emotional Milestone
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 mb-1">
          {badgeName}
        </h3>

        <p className="text-sm sm:text-base font-bold text-slate-600 mb-5 leading-snug">
          {praiseMessage}
        </p>

        <div className="flex items-center justify-center gap-2 mb-6 bg-amber-50 py-2.5 rounded-2xl border border-amber-200">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-spin" />
          <span className="text-base font-extrabold text-amber-900">
            +{starsAwarded} Star Earned!
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full text-base font-black"
          onClick={onClose}
        >
          YAY! Keep Playing! 🎈
        </Button>
      </div>
    </div>
  );
};

export default SelModal;
