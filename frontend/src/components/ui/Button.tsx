import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "pink" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shadow-md hover:shadow-lg";

  const variantClasses = {
    primary:
      "bg-amber-400 hover:bg-amber-500 text-slate-900 border-b-4 border-amber-600 hover:border-amber-700 hover:-translate-y-0.5",
    secondary:
      "bg-sky-400 hover:bg-sky-500 text-white border-b-4 border-sky-600 hover:border-sky-700 hover:-translate-y-0.5",
    success:
      "bg-emerald-400 hover:bg-emerald-500 text-white border-b-4 border-emerald-600 hover:border-emerald-700 hover:-translate-y-0.5",
    pink:
      "bg-pink-400 hover:bg-pink-500 text-white border-b-4 border-pink-600 hover:border-pink-700 hover:-translate-y-0.5",
    outline:
      "bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300",
    ghost:
      "bg-transparent hover:bg-amber-50 text-slate-700 shadow-none hover:shadow-none",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-sm sm:text-base",
    lg: "px-6 py-3.5 text-base sm:text-lg rounded-2xl",
    xl: "px-8 py-4 text-xl sm:text-2xl rounded-3xl",
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Thinking...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
