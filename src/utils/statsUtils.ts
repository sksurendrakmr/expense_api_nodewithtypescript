import { AnyObject } from "mongoose";
import { Expense } from "../models/ExpenseModel";

export const getMatchConditionForStats = (
  firstDate: string,
  lastDate: string
) => {
  const matchConditionForExpenseStats = {
    $and: [
      { category: { $eq: "expense" } },
      { date: { $gte: new Date(firstDate), $lte: new Date(lastDate) } },
    ],
  };
  const matchConditionForIncomeStats = {
    $and: [
      { category: { $eq: "income" } },
      { date: { $gte: new Date(firstDate), $lte: new Date(lastDate) } },
    ],
  };

  const matchConditionForCategory = {
    date: { $gte: new Date(firstDate), $lte: new Date(lastDate) },
  };

  return {
    matchConditionForCategory,
    matchConditionForExpenseStats,
    matchConditionForIncomeStats,
  };
};

export const statsAggragate = async (match: AnyObject, groupBy?: string) => {
  let groupById: string | null = groupBy ? groupBy : null;
  return await Expense.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: groupById,
        expenses: { $sum: "$amount" },
        numOfRecords: { $sum: 1 },
      },
    },
  ]);
};

export const stats = async (firstDate: string, lastDate: string) => {
  const {
    matchConditionForCategory,
    matchConditionForExpenseStats,
    matchConditionForIncomeStats,
  } = getMatchConditionForStats(firstDate, lastDate);
  const expense = await statsAggragate(matchConditionForExpenseStats);
  const income = await statsAggragate(matchConditionForIncomeStats);
  const category = await statsAggragate(matchConditionForCategory, "$title");

  return { expense, income, category };
};
