import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
  className?: string;
}

const PrimaryButton = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}: PrimaryButtonProps) => {
  const base =
    "px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-white text-green-900 hover:bg-green-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    ghost: "border border-white/40 text-white hover:bg-white/10",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
