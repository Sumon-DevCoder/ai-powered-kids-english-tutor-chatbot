import React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "pink" | "purple" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const variantClasses = {
    primary: "bg-amber-100 text-amber-800 border border-amber-300",
    secondary: "bg-sky-100 text-sky-800 border border-sky-300",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    pink: "bg-pink-100 text-pink-800 border border-pink-300",
    purple: "bg-purple-100 text-purple-800 border border-purple-300",
    outline: "bg-white text-slate-700 border border-slate-300",
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-semibold",
    md: "px-3.5 py-1 text-sm font-bold",
    lg: "px-4 py-1.5 text-base font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full shadow-xs tracking-wide",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
