import { Request, Response } from "express";
import Joi from "joi";
import { CustomReq } from "../config/CustomReq";
import { ExpenseDto } from "../dto/ExpenseDto";
import { AuthMiddlewareReq } from "../dto/UserDto";
import { Expense } from "../models/ExpenseModel";
import { APIFilter } from "../utils/API_Filter";
import { DateUtils } from "../utils/DateUtils";
import { stats, statsAggragate } from "../utils/statsUtils";

export const getExpense = async (req: AuthMiddlewareReq, res: Response) => {
  const typedReqQuery = req.query as { [key: string]: string };
  const apiFilterInstance = new APIFilter(Expense.find(), typedReqQuery, [
    "title",
  ])
    .filter()
    .sort();

  let query = apiFilterInstance.query;

  if (req.query.title) {
    const title = typedReqQuery.title.split(",");
    query = query.find({ title: { $in: title } });
  }

  const expense = await query.find({ user: req.user?._id });
  res.status(200).json(expense);
};

export const saveExpense = async (req: AuthMiddlewareReq, res: Response) => {
  const { error } = validateExpense(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (!req.user) return res.status(400).json({ message: "User not found!" });
  const savedExpense = await Expense.create<ExpenseDto>(req.body);

  res.status(201).json(savedExpense);
};

export const updateExpense = async (
  req: CustomReq<ExpenseDto>,
  res: Response
) => {
  const { error } = validateExpense(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  if (!req.user) return res.status(404).json({ message: "User not found" });
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  if (expense.user.toString() !== req.user._id?.toString())
    return res.status(404).json({ message: "User not found" });
  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedExpense)
    return res.status(404).json({ message: "Expense with this id not found!" });
  res.status(200).json(updatedExpense);
};

export const deleteExpense = async (
  req: CustomReq<ExpenseDto>,
  res: Response
) => {
  if (!req.user) return res.status(404).json({ message: "User not found" });
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: "Expense not found" });

  if (req.user._id?.toString() !== expense.user.toString())
    return res.status(404).json({ message: "User not found" });
  const deletedExpense = await Expense.findByIdAndDelete<ExpenseDto>(
    req.params.id
  );
  if (!deletedExpense)
    return res.status(404).json({ message: "Expense with id not found!" });
  res.status(200).json(deletedExpense);
};

export const expenseStats = async (req: Request, res: Response) => {
  const { firstDateOfCurrentMonth, lastDateOfCurrentMonth } =
    DateUtils.getFirstAndLastDateOfCurrentMonth();
  const { firstDateOfPreviousMonth, lastDateOfPreviousMonth } =
    DateUtils.getFirstAndLastDateOfPreviousMonth();
  const { firstDateOfCurrentWeek, lastDateOfCurrentWeek } =
    DateUtils.getFirstAndLastDateOfCurrentWeek();
  const { firstDateOfPreviousWeek, lastDateOfPreviousWeek } =
    DateUtils.getFirstAndLastDateOfPreviousWeek();

  switch (req.params.month) {
    case "currentMonth": {
      const { expense, income, category } = await stats(
        firstDateOfCurrentMonth,
        lastDateOfCurrentMonth
      );
      return res.status(200).json({
        currentMonth: {
          expense,
          income,
          category,
        },
      });
    }
    case "prevMonth": {
      const { expense, income, category } = await stats(
        firstDateOfPreviousMonth,
        lastDateOfPreviousMonth
      );
      return res.status(200).json({
        currentMonth: {
          expense,
          income,
          category,
        },
      });
    }
    case "currentWeek": {
      const { expense, income, category } = await stats(
        firstDateOfCurrentWeek,
        lastDateOfCurrentWeek
      );
      return res.status(200).json({
        currentMonth: {
          expense,
          income,
          category,
        },
      });
    }
    case "prevWeek": {
      const { expense, income, category } = await stats(
        firstDateOfPreviousWeek,
        lastDateOfPreviousWeek
      );
      return res.status(200).json({
        currentMonth: {
          expense,
          income,
          category,
        },
      });
    }
    case "total": {
      const expense = await statsAggragate({ category: { $eq: "expense" } });
      const income = await statsAggragate({ category: { $eq: "income" } });
      const category = await statsAggragate({}, "$title");
      return res.status(200).json({
        currentMonth: {
          expense,
          income,
          category,
        },
      });
    }
    default: {
      res.status(400).json({
        message:
          "parmas should be total or currentMonth or currentWeek or prevWeek or prevMonth",
      });
    }
  }
};

const validateExpense = (expense: ExpenseDto) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    category: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string(),
    date: Joi.date(),
    user: Joi.string().required(),
    expenseImgs: Joi.array().items(Joi.string()),
  });

  return schema.validate(expense);
};
