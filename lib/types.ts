export interface Balance {
  total: number;
  changeToday: number;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  provider: string;
  balance: number;
  changePercent: number;
}

export interface SpendingGoal {
  id: string;
  label: string;
  category: string;
  percentUsed: number;
  remaining: number;
}

export interface CashFlowStat {
  id: string;
  label: string;
  period: string;
  amount: number;
  percent: number;
  type: "spending" | "earnings";
}

export interface DashboardData {
  balance: Balance;
  accounts: Account[];
  spendingGoal: SpendingGoal;
  cashFlow: CashFlowStat[];
}

export type BudgetIcon =
  | "utensils"
  | "home"
  | "film"
  | "car"
  | "shopping-bag"
  | "wallet";

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  limit: number;
  icon: BudgetIcon;
}

export interface BudgetData {
  monthlyLimit: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

export interface ScannedTransaction {
  merchant: string;
  amount: number;
  date: string;
  categoryId: string;
}
