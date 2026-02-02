"use client";

import React from "react";
import { Download, Utensils, ShoppingCart, ChefHat, Clock, Share2 } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { toast } from "sonner";

import { jsPDF } from "jspdf";

interface SummaryPanelProps {
  summaryContent?: string | null;
}

export function SummaryPanel({ summaryContent }: SummaryPanelProps) {
  const handleExportPDF = () => {
    if (!summaryContent) return;

    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // Emerald-500
      doc.text("NutriBot Meal Plan Summary", 20, 20);

      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, 30);

      // Line separator
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(20, 35, 190, 35);

      // Content
      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85); // Slate-700

      // Split text to fit page width
      const splitText = doc.splitTextToSize(summaryContent, 170);
      doc.text(splitText, 20, 45);

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('NutriBot AI - Your Personal Nutrition Assistant', 105, 285, { align: 'center' });
      }

      doc.save(`nutribot-summary-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Summary exported to PDF!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF.");
    }
  };

  return (
    <GlassCard title="Session Summary" icon={<Share2 size={18} />}>
      <div className="space-y-6">
        {summaryContent ? (
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3 sticky top-0 bg-white/50 backdrop-blur-sm py-1 z-10">
              <ChefHat size={14} /> AI Meal Plan Summary
            </h4>
            <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-100 scrollbar-track-transparent whitespace-pre-line text-xs leading-relaxed text-slate-600">
              {summaryContent}
            </div>
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors text-sm font-medium shadow-sm active:scale-95 transform duration-100"
            >
              <Download size={16} />
              Export to PDF
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
            <Utensils size={32} className="text-slate-300 mb-2" />
            <p className="text-xs text-slate-400">
              Start chatting to generate a meal plan summary.
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
