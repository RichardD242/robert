import { Car, Film, Home, ShoppingBag, Utensils, Wallet } from "lucide-react";
import { BudgetIcon } from "./types";

export const budgetIconMap: Record<BudgetIcon, typeof Wallet> = {
  utensils: Utensils,
  home: Home,
  film: Film,
  car: Car,
  "shopping-bag": ShoppingBag,
  wallet: Wallet,
};
