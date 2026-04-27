import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard = ({ children, className = "" }: GlassCardProps) => {
  return (
    <div
      className={`bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
