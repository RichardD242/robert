"use client";
import React from "react";
import {
  RefreshCw,
  Target,
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  Bell,
  User,
} from "lucide-react";
import { mockDashboardData } from "@/lib/mock-data";
import { eur } from "@/lib/format";

export default function RobertDashboard() {
  const { balance, accounts, spendingGoal, cashFlow } = mockDashboardData;
  const mainAccount = accounts[0];
  const spending = cashFlow.find((f) => f.type === "spending")!;
  const earnings = cashFlow.find((f) => f.type === "earnings")!;

  return (
    <div className="min-h-screen bg-black text-white">

      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-[#111111] bg-black/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-white font-semibold text-[15px] tracking-wide">robert dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-[#111111] transition-all duration-200">
            <Search className="w-[18px] h-[18px] text-[#7F7F7F]" />
          </button>
          <button className="p-2 rounded-full hover:bg-[#111111] transition-all duration-200">
            <Bell className="w-[18px] h-[18px] text-[#7F7F7F]" />
          </button>
          <button className="flex items-center gap-2 bg-[#111111] hover:bg-[#1A1A1A] rounded-full px-4 py-2 transition-all duration-200 ml-1">
            <div className="w-5 h-5 rounded-full bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center">
              <User className="w-3 h-3 text-[#7F7F7F]" />
            </div>
            <span className="text-[12px] text-[#7F7F7F] font-medium">account</span>
          </button>
        </div>
      </header>

      <main className="px-8 py-12 max-w-7xl mx-auto">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-14">
          <div>
            <p className="text-[11px] text-[#7F7F7F] tracking-[0.18em] font-medium mb-4">
              your balance
            </p>
            <h1 className="text-[80px] font-bold text-white tracking-tight leading-none">
              {eur(balance.total)}
            </h1>
            <div className="flex items-center gap-2 mt-5">
              <span className="text-[14px] text-[#45E393] font-semibold">+{eur(balance.changeToday)}</span>
              <span className="text-[14px] text-[#7F7F7F]">today</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2.5 bg-[#111111] hover:bg-[#1A1A1A] rounded-full px-5 py-3 transition-all duration-200 active:scale-95">
              <RefreshCw className="w-4 h-4 text-white" />
              <span className="text-[13px] text-white font-medium">refresh</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-[11px] font-bold text-[#444444] tracking-[0.14em]">
            your accounts
          </span>
          <span className="text-[12px] text-[#7F7F7F] hover:text-white cursor-pointer transition-colors duration-200 font-medium">
            manage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="lg:col-span-2 bg-[#1C1C1C] hover:bg-[#232323] rounded-3xl p-8 cursor-pointer transition-all duration-200 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-[#292929] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-[16px]">{mainAccount.name}</p>
                <p className="text-[#7F7F7F] text-[12px] mt-1">{mainAccount.provider}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[38px] font-bold text-white font-mono leading-none">{eur(mainAccount.balance)}</p>
              <p className="text-[#45E393] text-[13px] font-semibold mt-2">+{mainAccount.changePercent}%</p>
            </div>
          </div>

          <div className="bg-[#1C1C1C] hover:bg-[#232323] rounded-3xl p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#292929] flex items-center justify-center">
                <Target className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px]">{spendingGoal.label}</p>
                <p className="text-[#7F7F7F] text-[11px] mt-0.5">{spendingGoal.category}</p>
              </div>
            </div>
            <div>
              <p className="text-[40px] font-bold text-white font-mono leading-none">{spendingGoal.percentUsed}%</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#7F7F7F] text-[12px]">left until goal</p>
                <p className="text-[#45E393] text-[12px] font-semibold">{eur(spendingGoal.remaining)}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1C1C1C] hover:bg-[#232323] rounded-3xl p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#292929] flex items-center justify-center">
                <TrendingDown className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px]">{spending.label}</p>
                <p className="text-[#7F7F7F] text-[11px] mt-0.5">{spending.period}</p>
              </div>
            </div>
            <div>
              <p className="text-[40px] font-bold text-[#FF5C5C] font-mono leading-none">{eur(spending.amount)}</p>
              <p className="text-[#FF5C5C] text-[12px] font-semibold mt-2">{spending.percent}% this month</p>
            </div>
          </div>

          <div className="bg-[#1C1C1C] hover:bg-[#232323] rounded-3xl p-8 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#292929] flex items-center justify-center">
                <TrendingUp className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px]">{earnings.label}</p>
                <p className="text-[#7F7F7F] text-[11px] mt-0.5">{earnings.period}</p>
              </div>
            </div>
            <div>
              <p className="text-[40px] font-bold text-[#45E393] font-mono leading-none">+{eur(earnings.amount)}</p>
              <p className="text-[#45E393] text-[12px] font-semibold mt-2">+{earnings.percent}% this month</p>
            </div>
          </div>

          <img
            src="/card.jpeg"
            alt="card"
            className="rounded-3xl w-full h-full min-h-[160px] object-cover"
          />

        </div>
      </main>
    </div>
  );
}
