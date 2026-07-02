import { useSyncExternalStore } from "react";
import { mockBudgetData } from "./mock-data";
import { BudgetData, ScannedTransaction } from "./types";

const STORAGE_KEY = "robert_budget_data";
const listeners = new Set<() => void>();

export function loadBudgetData(): BudgetData {
  if (typeof window === "undefined") return mockBudgetData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return mockBudgetData;
  try {
    return JSON.parse(raw) as BudgetData;
  } catch {
    return mockBudgetData;
  }
}

export function saveBudgetData(data: BudgetData) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  listeners.forEach((listener) => listener());
}

export function applyTransactions(base: BudgetData, transactions: ScannedTransaction[]): BudgetData {
  const categories = base.categories.map((c) => ({ ...c }));

  for (const tx of transactions) {
    const category = categories.find((c) => c.id === tx.categoryId);
    if (category) category.spent += tx.amount;
  }

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  return { ...base, categories, totalSpent };
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function useBudgetData(): BudgetData {
  return useSyncExternalStore(subscribe, loadBudgetData, () => mockBudgetData);
}
