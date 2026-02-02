"use client";

import React from "react";
import { Header } from "@/components/dashboard/Header";
import { ChatPanel } from "@/components/dashboard/ChatPanel";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { NutritionPanel } from "@/components/dashboard/NutritionPanel";
import { CalendarPanel } from "@/components/dashboard/CalendarPanel";
import { Toaster } from "sonner";

export default function DashboardPage() {
    const [nutritionData, setNutritionData] = React.useState<any>(null);
    const [summaryContent, setSummaryContent] = React.useState<string | null>(null);
    const [calendarData, setCalendarData] = React.useState<any[] | null>(null);

    return (
        <div className="min-h-screen bg-[#f8fcfb] bg-gradient-to-br from-[#f8fcfb] via-[#fffef7] to-[#f3faf8] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Header />

            <main className="max-w-7xl mx-auto p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[700px]">
                    {/* LEFT / CENTER: AI Chat Panel (Spans 8 columns on large screens) */}
                    <div className="lg:col-span-8 h-full">
                        <ChatPanel
                            onUpdateNutrition={setNutritionData}
                            onUpdateSummary={setSummaryContent}
                            onUpdateCalendar={setCalendarData}
                        />
                    </div>

                    {/* RIGHT: Stats and Info (Spans 4 columns on large screens) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-50 scrollbar-track-transparent">
                        <SummaryPanel summaryContent={summaryContent} />
                        <NutritionPanel nutritionData={nutritionData} />
                        <CalendarPanel calendarData={calendarData} />
                    </div>
                </div>
            </main>

            <Toaster position="bottom-right" richColors />

            {/* Decorative background elements */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="fixed bottom-10 right-10 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />
        </div>
    );
}
