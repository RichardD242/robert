"use client";
import React from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Sliders, ScanLine } from "lucide-react";
import Link from "next/link";
import { budgetIconMap } from "@/lib/budget-icons";
import { useBudgetData } from "@/lib/budget-store";
import { eur } from "@/lib/format";

export default function BudgetDashboard() {
  const { monthlyLimit, totalSpent, categories } = useBudgetData();

  const overallPercent = Math.min(Math.round((totalSpent / monthlyLimit) * 100), 100);
  const isOverallOver = totalSpent > monthlyLimit;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-[#111111] bg-black/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-full bg-[#111111] hover:bg-[#1A1A1A] transition-all duration-200 text-[#7F7F7F] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-white font-semibold text-[15px] tracking-wide">robert budget overview</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/upload"
            className="flex items-center gap-2 bg-[#111111] hover:bg-[#1A1A1A] rounded-full px-4 py-2 transition-all duration-200"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#7F7F7F]" />
            <span className="text-[12px] text-[#7F7F7F] font-medium">screenshot</span>
          </Link>
          <button className="flex items-center gap-2 bg-[#111111] hover:bg-[#1A1A1A] rounded-full px-4 py-2 transition-all duration-200">
            <Sliders className="w-3.5 h-3.5 text-[#7F7F7F]" />
            <span className="text-[12px] text-[#7F7F7F] font-medium">adjust limits</span>
          </button>
        </div>
      </header>

      <main className="px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-14">
          <div>
            <p className="text-[11px] text-[#7F7F7F] tracking-[0.18em] font-medium mb-4">
              total monthly budget
            </p>
            <h1 className="text-[80px] font-bold text-white tracking-tight leading-none font-mono">
              {eur(totalSpent)} <span className="text-[32px] text-[#444444] font-normal">/ {eur(monthlyLimit)}</span>
            </h1>

            <div className="flex items-center gap-3 mt-5">
              {isOverallOver ? (
                <div className="flex items-center gap-1.5 bg-[#FF5C5C]/10 border border-[#FF5C5C]/20 px-3 py-1 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-[#FF5C5C]" />
                  <span className="text-[13px] text-[#FF5C5C] font-semibold">over budget by {eur(totalSpent - monthlyLimit)}!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-[#45E393]/10 border border-[#45E393]/20 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-[#45E393]" />
                  <span className="text-[13px] text-[#45E393] font-semibold">{eur(monthlyLimit - totalSpent)} remaining</span>
                </div>
              )}
              <span className="text-[14px] text-[#7F7F7F] font-mono">{overallPercent}% consumed</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-bold text-[#444444] tracking-[0.14em]">
            budget by category
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {categories.map((category) => {
            const percent = Math.round((category.spent / category.limit) * 100);
            const isOver = category.spent > category.limit;
            const Icon = budgetIconMap[category.icon];

            return (
              <div
                key={category.id}
                className="bg-[#1C1C1C] hover:bg-[#232323] rounded-3xl p-6 transition-all duration-200 border border-transparent hover:border-[#2A2A2A]/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#292929] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#7F7F7F]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-[15px]">{category.name}</h3>
                        <p className="text-[#7F7F7F] text-[11px] font-mono mt-0.5">
                          {eur(category.spent)} of {eur(category.limit)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[16px] font-bold font-mono ${isOver ? 'text-[#FF5C5C]' : 'text-white'}`}>
                        {percent}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-[#111111] rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isOver ? 'bg-[#FF5C5C]' : 'bg-[#45E393]'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>

                {isOver && (
                  <div className="mt-4 pt-3 border-t border-[#FF5C5C]/10 flex items-center gap-2 text-[#FF5C5C]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-[11px] font-medium tracking-wide">
                      exceeded limit by {eur(category.spent - category.limit)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
