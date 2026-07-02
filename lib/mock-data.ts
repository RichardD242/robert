import { BudgetData, DashboardData } from "./types";

export const mockDashboardData: DashboardData = {
  balance: {
    total: 1500,
    changeToday: 50,
    currency: "EUR",
  },
  accounts: [
    {
      id: "acc_1",
      name: "main account",
      provider: "revolut",
      balance: 1450,
      changePercent: 5,
    },
  ],
  spendingGoal: {
    id: "goal_1",
    label: "spending limit",
    category: "goal",
    percentUsed: 50,
    remaining: 55,
  },
  cashFlow: [
    {
      id: "flow_spending",
      label: "spending",
      period: "vs last month",
      amount: -40,
      percent: -5,
      type: "spending",
    },
    {
      id: "flow_earnings",
      label: "earnings",
      period: "vs last month",
      amount: 40,
      percent: 5,
      type: "earnings",
    },
  ],
};

export const mockBudgetData: BudgetData = {
  monthlyLimit: 250,
  totalSpent: 184,
  categories: [
    { id: "food", name: "food & dining", spent: 42, limit: 40, icon: "utensils" },
    { id: "rent", name: "rent & housing", spent: 95, limit: 95, icon: "home" },
    { id: "entertainment", name: "entertainment", spent: 28, limit: 20, icon: "film" },
    { id: "transport", name: "transport", spent: 9, limit: 15, icon: "car" },
    { id: "shopping", name: "shopping", spent: 10, limit: 30, icon: "shopping-bag" },
  ],
};
