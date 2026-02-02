"use client";

import React from "react";
import { Calendar as CalendarIcon, Edit2, Plus } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { motion as Motion } from "motion/react";

const defaultDays = [
  { day: "Mon", meal: "Greek Salad", emoji: "🥗", color: "bg-emerald-50" },
  { day: "Tue", meal: "Chicken Stir-fry", emoji: "🥘", color: "bg-amber-50" },
  { day: "Wed", meal: "Pasta Primavera", emoji: "🍝", color: "bg-rose-50" },
  { day: "Thu", meal: "Quinoa Bowl", emoji: "🥣", color: "bg-blue-50" },
  { day: "Fri", meal: "Grilled Fish", emoji: "🐟", color: "bg-teal-50" },
  { day: "Sat", meal: "Homemade Pizza", emoji: "🍕", color: "bg-orange-50" },
  { day: "Sun", meal: "Smoothie Bowl", emoji: "🍓", color: "bg-purple-50" },
];

interface CalendarPanelProps {
  calendarData?: any[] | null;
}

export function CalendarPanel({ calendarData }: CalendarPanelProps) {
  // Use data from props or default dummy data if not available yet
  // Map strings to colors/emojis simply
  const displayData = calendarData && calendarData.length > 0
    ? calendarData.map((d, i) => ({
      day: d.day,
      lunch: d.lunch,
      dinner: d.dinner,
      color: defaultDays[i % 7].color,
      emoji: "🍽️"
    }))
    : null; // Show dummy or empty state

  // If no data, show placeholder or dummy? User said "currently using dummy data" and implied they want to REPLACE it.
  // But if the user hasn't chatted yet, we should show empty or prompt state.
  // However, for visual consistency, let's keep dummy data as "Example" until real data comes in, OR just show empty state.
  // Let's show empty/"Start Chat" state if null, to prove it's connected.

  return (
    <GlassCard title="Meal Calendar" icon={<CalendarIcon size={18} />}>
      <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent">
        {displayData ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Lunch</h4>
              <div className="grid grid-cols-7 gap-2">
                {displayData.map((item: any) => (
                  <Motion.div
                    key={`lunch-${item.day}`}
                    whileHover={{ y: -4 }}
                    className={`flex flex-col items-center p-2 rounded-xl border border-white/50 ${item.color} shadow-sm group cursor-pointer transition-all hover:shadow-md`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.day}</span>
                    <div className="text-lg mb-1">{item.emoji}</div>
                    <div className="w-full min-h-[40px] flex items-center justify-center">
                      <p className="text-[9px] text-center font-medium text-slate-600 line-clamp-2 leading-tight">
                        {item.lunch || item.meal}
                      </p>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Dinner</h4>
              <div className="grid grid-cols-7 gap-2">
                {displayData.map((item: any, idx: number) => (
                  <Motion.div
                    key={`dinner-${item.day}`}
                    whileHover={{ y: -4 }}
                    className={`flex flex-col items-center p-2 rounded-xl border border-white/50 bg-slate-50 shadow-sm group cursor-pointer transition-all hover:shadow-md`}
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.day}</span>
                    <div className="text-lg mb-1">🥘</div>
                    <div className="w-full min-h-[40px] flex items-center justify-center">
                      <p className="text-[9px] text-center font-medium text-slate-600 line-clamp-2 leading-tight">
                        {item.dinner || "Leftovers"}
                      </p>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
            <CalendarIcon size={32} className="text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">
              Generate a meal plan to see your calendar.
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p suppressHydrationWarning className="text-[10px] text-slate-400 font-medium italic">
          Last updated: Today, 2:45 PM
        </p>
        <button className="text-[10px] flex items-center gap-1 font-bold text-emerald-600 hover:underline">
          <Edit2 size={10} /> Full Schedule
        </button>
      </div>
    </GlassCard>
  );
}
