import React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "accent" | "sky" | "mint";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const variantClasses = {
    default: "bg-white border-2 border-amber-100 shadow-sm",
    elevated: "bg-white border-2 border-slate-100 shadow-xl",
    accent: "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-md",
    sky: "bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 shadow-md",
    mint: "bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-md",
  };

  return (
    <div
      className={cn(
        "rounded-3xl p-5 sm:p-6 transition-all duration-300",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
