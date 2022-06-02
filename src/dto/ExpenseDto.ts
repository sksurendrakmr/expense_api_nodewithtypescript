export type ExpenseTitle =
  | "Food & Drink"
  | "Recharge"
  | "Bill"
  | "Others"
  | "Shopping"
  | "Groceries"
  | "Investment"
  | "Travel"
  | "Fuel"
  | "Rent";

export type ExpenseCategory = "income" | "expense";

export type ExpenseDto = {
  title: ExpenseTitle;
  amount: number;
  category: ExpenseCategory;
  description?:string;
  date?:Date
};