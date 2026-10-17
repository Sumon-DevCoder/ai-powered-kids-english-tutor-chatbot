"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Star, Award } from "lucide-react";

export interface ChildProfile {
  _id: string;
  name: string;
  age: number;
  avatar: string;
  currentLevel: "L1" | "L2" | "L3";
  masteryPoints: number;
  starsEarned: number;
  currentStreakDays: number;
  masteredVocabulary: string[];
}

interface ProfileSwitcherProps {
  profiles: ChildProfile[];
  activeChildId: string;
  onSelectChild: (child: ChildProfile) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  profiles,
  activeChildId,
  onSelectChild,
}) => {
  const avatarEmoji: Record<string, string> = {
    bear: "🐻",
    fox: "🦊",
    owl: "🦉",
    bunny: "🐰",
  };

  const levelLabels: Record<string, string> = {
    L1: "L1: Words",
    L2: "L2: Phrases",
    L3: "L3: Stories",
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Switch Child Profile (Multi-Child Isolation)
        </span>
        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          3 Demo Kids Loaded
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
        {profiles.map((profile) => {
          const isActive = profile._id === activeChildId;
          return (
            <button
              key={profile._id}
              type="button"
              onClick={() => onSelectChild(profile)}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer shrink-0 text-left select-none",
                isActive
                  ? "bg-amber-400 border-amber-600 shadow-md scale-102 text-slate-900"
                  : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
              )}
            >
              <span className="text-2xl sm:text-3xl shrink-0">
                {avatarEmoji[profile.avatar] || "🐻"}
              </span>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold">{profile.name}</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-white/70 border border-slate-300">
                    Age {profile.age}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className={cn(
                    "font-bold",
                    isActive ? "text-slate-900" : "text-amber-600"
                  )}>
                    {levelLabels[profile.currentLevel]}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-800">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {profile.starsEarned || 0}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSwitcher;
