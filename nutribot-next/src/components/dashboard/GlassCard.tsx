import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  title?: string;
  icon?: React.ReactNode;
}

export function GlassCard({ children, className, contentClassName, title, icon }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl",
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-white/20 flex items-center gap-2">
          {icon && <span className="text-emerald-600">{icon}</span>}
          <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        </div>
      )}
      <div className={cn("p-6", contentClassName, className?.includes("h-full") && "h-full flex flex-col")}>{children}</div>
    </div>
  );
}
