"use client";

import React from "react";
import { Activity, Flame, Zap, Droplets, PieChart } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const data = [
  { name: "Protein", value: 30, color: "#10b981" },
  { name: "Carbs", value: 45, color: "#fbbf24" },
  { name: "Fat", value: 25, color: "#f87171" },
];

interface NutritionPanelProps {
  nutritionData?: any;
}

export function NutritionPanel({ nutritionData }: NutritionPanelProps) {
  // Default data or data from props
  const macros = nutritionData?.macros || {
    protein: 0, carbs: 0, fat: 0,
    protein_percentage: 30, carbs_percentage: 40, fat_percentage: 30
  };

  const chartData = [
    { name: "Protein", value: macros.protein_percentage || 30, color: "#10b981" },
    { name: "Carbs", value: macros.carbs_percentage || 40, color: "#fbbf24" },
    { name: "Fat", value: macros.fat_percentage || 30, color: "#f87171" },
  ];

  const tdee = nutritionData?.tdee || 2000;
  const targetCalories = nutritionData?.target_calories || 2000;

  return (
    <GlassCard title="Nutrition Overview" icon={<Activity size={18} />}>
      <div className="max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent">
        {nutritionData ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Flame size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Target Calories</p>
                  <p className="text-base font-bold text-slate-800">{Math.round(targetCalories)} <span className="text-[10px] font-normal text-slate-500 italic">kcal</span></p>
                  <p className="text-[9px] text-slate-400">TDEE: {tdee}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Protein</span>
                  <span>{macros.protein}g</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${macros.protein_percentage}%` }} />
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Carbs</span>
                  <span>{macros.carbs}g</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${macros.carbs_percentage}%` }} />
                </div>

                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Fat</span>
                  <span>{macros.fat}g</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: `${macros.fat_percentage}%` }} />
                </div>
              </div>
            </div>

            <div className="h-32 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={chartData}
                    innerRadius={35}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <PieChart size={16} className="text-slate-300" />
                <span className="text-[8px] font-bold text-slate-400 uppercase">Macros</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
            <Activity size={32} className="text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">
              Chat to see your nutrition stats.
            </p>
          </div>
        )}

        {nutritionData && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Droplets size={12} className="text-blue-400" />
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Water</p>
                <p className="text-xs font-bold text-slate-700">~2.5L</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-yellow-500" />
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Goal</p>
                <p className="text-xs font-bold text-slate-700 capitalize">{nutritionData.goal_type || "Maintain"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
