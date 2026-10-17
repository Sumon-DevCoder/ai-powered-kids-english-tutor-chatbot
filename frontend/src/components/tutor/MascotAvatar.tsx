import React from "react";
import { cn } from "@/lib/utils/cn";

export type MascotState = "idle" | "listening" | "thinking" | "talking" | "cheering";

interface MascotAvatarProps {
  state?: MascotState;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  state = "idle",
  className,
  size = "lg",
}) => {
  const sizeMap = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-44 h-44 sm:w-52 sm:h-52",
    xl: "w-60 h-60 sm:w-72 sm:h-72",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none transition-transform duration-300",
        sizeMap[size],
        state === "idle" && "animate-float",
        state === "cheering" && "animate-bounce",
        state === "listening" && "scale-105",
        className
      )}
    >
      {/* Background Soft Glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-2xl opacity-40 transition-colors duration-500",
          state === "listening" && "bg-sky-400 opacity-60 scale-110",
          state === "thinking" && "bg-amber-400 opacity-60 scale-110",
          state === "cheering" && "bg-pink-400 opacity-70 scale-120 animate-pulse",
          state === "talking" && "bg-emerald-400 opacity-50",
          state === "idle" && "bg-amber-200"
        )}
      />

      {/* SVG Mascot: Toby the English Bear */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Ear */}
        <circle cx="50" cy="55" r="26" fill="#D97706" />
        <circle cx="50" cy="55" r="16" fill="#FDE68A" />

        {/* Right Ear */}
        <circle cx="150" cy="55" r="26" fill="#D97706" />
        <circle cx="150" cy="55" r="16" fill="#FDE68A" />

        {/* Head Base */}
        <circle cx="100" cy="110" r="70" fill="#F59E0B" />

        {/* Fur Cheeks */}
        <ellipse cx="60" cy="125" rx="14" ry="10" fill="#FBBF24" opacity="0.6" />
        <ellipse cx="140" cy="125" rx="14" ry="10" fill="#FBBF24" opacity="0.6" />

        {/* Rosy Cheeks */}
        <ellipse cx="62" cy="132" rx="10" ry="7" fill="#F43F5E" opacity="0.4" />
        <ellipse cx="138" cy="132" rx="10" ry="7" fill="#F43F5E" opacity="0.4" />

        {/* Snout / Muzzle */}
        <ellipse cx="100" cy="135" rx="34" ry="26" fill="#FEF3C7" />

        {/* Cute Dark Nose */}
        <path
          d="M92 122 C92 118, 108 118, 108 122 C108 128, 92 128, 92 122 Z"
          fill="#1E293B"
        />

        {/* Dynamic Mouth based on State */}
        {state === "talking" ? (
          <path
            d="M86 136 Q100 156 114 136 Z"
            fill="#E11D48"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : state === "cheering" ? (
          <path
            d="M84 134 Q100 160 116 134 Z"
            fill="#E11D48"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M88 135 Q100 148 112 135"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Eyes based on State */}
        {state === "cheering" ? (
          // Happy squinting crescent eyes
          <>
            <path
              d="M68 98 Q78 86 88 98"
              stroke="#1E293B"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M112 98 Q122 86 132 98"
              stroke="#1E293B"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          // Big sparkly cartoon eyes
          <>
            {/* Left Eye */}
            <circle cx="78" cy="95" r="10" fill="#1E293B" />
            <circle cx="75" cy="92" r="3.5" fill="white" />
            <circle cx="81" cy="97" r="1.5" fill="white" />

            {/* Right Eye */}
            <circle cx="122" cy="95" r="10" fill="#1E293B" />
            <circle cx="119" cy="92" r="3.5" fill="white" />
            <circle cx="125" cy="97" r="1.5" fill="white" />
          </>
        )}

        {/* Little Graduation Cap or Star Badge */}
        <polygon points="100,28 128,40 100,52 72,40" fill="#4F46E5" />
        <line x1="128" y1="40" x2="135" y2="60" stroke="#FBBF24" strokeWidth="3" />
        <circle cx="135" cy="62" r="3" fill="#FBBF24" />
      </svg>

      {/* State Bubble Overlay */}
      {state === "listening" && (
        <div className="absolute -top-3 -right-2 bg-sky-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          Listening...
        </div>
      )}

      {state === "thinking" && (
        <div className="absolute -top-3 -right-2 bg-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1">
          ✨ Thinking...
        </div>
      )}

      {state === "cheering" && (
        <div className="absolute -top-4 -right-4 bg-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg animate-wiggle flex items-center gap-1">
          🎉 High Five! ⭐
        </div>
      )}
    </div>
  );
};

export default MascotAvatar;
