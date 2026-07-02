"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { mockBudgetData } from "@/lib/mock-data";
import { budgetIconMap } from "@/lib/budget-icons";
import { ScannedTransaction } from "@/lib/types";
import { applyTransactions, loadBudgetData, saveBudgetData } from "@/lib/budget-store";
import { eur } from "@/lib/format";

const readFileAsBase64 = (file: File): Promise<{ data: string; mediaType: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [, data] = result.split(",");
      resolve({ data, mediaType: file.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function UploadPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ScannedTransaction[]>([]);

  const scan = async (file: File) => {
    setError(null);
    setTransactions([]);
    setIsScanning(true);
    setPreview(URL.createObjectURL(file));

    try {
      const { data, mediaType } = await readFileAsBase64(file);
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: data, mediaType }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "scan failed");

      const found: ScannedTransaction[] = json.transactions ?? [];
      setTransactions(found);

      if (found.length === 0) {
        setError("no transactions found in that image");
        return;
      }

      const updated = applyTransactions(loadBudgetData(), found);
      saveBudgetData(updated);
      setIsRedirecting(true);
      router.push("/budget");
    } catch (err) {
      setError(err instanceof Error ? err.message : "scan failed");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) scan(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) scan(file);
  };

  const categoryName = (id: string) =>
    mockBudgetData.categories.find((c) => c.id === id)?.name ?? "other";

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-[#111111] bg-black/90 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/budget"
            className="p-2 rounded-full bg-[#111111] hover:bg-[#1A1A1A] transition-all duration-200 text-[#7F7F7F] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-white font-semibold text-[15px] tracking-wide">scan a statement</span>
        </div>
      </header>

      <main className="px-8 py-12 max-w-3xl mx-auto flex flex-col items-center gap-8">
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all w-full ${
            isScanning
              ? "border-[#45E393]/40 bg-[#45E393]/5"
              : "border-[#2A2A2A] hover:border-[#45E393]/60 hover:bg-[#111111]"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isScanning}
          />
          {preview ? (
            <img src={preview} alt="uploaded statement" className="max-h-64 rounded-2xl object-contain mb-4" />
          ) : (
            <UploadCloud className="w-12 h-12 mb-4 text-[#7F7F7F]" />
          )}
          <span className="text-[15px] font-semibold text-white flex items-center gap-2">
            {(isScanning || isRedirecting) && <Loader2 className="w-4 h-4 animate-spin" />}
            {isRedirecting
              ? "done, opening your budget"
              : isScanning
              ? "scanning"
              : "drop a screenshot of your revolut statement"}
          </span>
          <span className="text-[12px] text-[#7F7F7F] mt-2">png, jpg</span>
        </label>

        {error && (
          <div className="flex items-center gap-2 text-[#FF5C5C] text-[13px]">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {transactions.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#45E393] text-[13px] font-medium">
              <CheckCircle2 className="w-4 h-4" />
              found {transactions.length} transaction{transactions.length === 1 ? "" : "s"}
            </div>

            {transactions.map((tx, i) => {
              const category = mockBudgetData.categories.find((c) => c.id === tx.categoryId);
              const Icon = category ? budgetIconMap[category.icon] : budgetIconMap.wallet;

              return (
                <div
                  key={i}
                  className="bg-[#1C1C1C] rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#292929] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#7F7F7F]" />
                    </div>
                    <div>
                      <p className="text-white text-[14px] font-semibold">{tx.merchant}</p>
                      <p className="text-[#7F7F7F] text-[11px] mt-0.5">
                        {categoryName(tx.categoryId)} · {tx.date || "no date"}
                      </p>
                    </div>
                  </div>
                  <span className="text-white text-[14px] font-mono font-bold">{eur(tx.amount)}</span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
