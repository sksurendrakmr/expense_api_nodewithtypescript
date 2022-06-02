import { Request, Response } from "express";
import joi from "joi";
import { CustomReq } from "../config/CustomReq";
import { ExpenseDto } from "../dto/ExpenseDto";
import { Expense } from "../models/ExpenseModel";
import { APIFilter } from "../utils/API_Filter";

export const getExpense = async (req: Request, res: Response) => {
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

  const expense = await query;
  res.status(200).json(expense);
};

export const saveExpense = async (
  req: CustomReq<ExpenseDto>,
  res: Response
) => {
  const { error } = validateExpense(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const savedExpense = await Expense.create<ExpenseDto>({
    title: req.body.title,
    amount: req.body.amount,
    description: req.body.description,
    category: req.body.category,
    date: req.body.date,
  });

  res.status(201).json(savedExpense);
};

const validateExpense = (expense: ExpenseDto) => {
  const schema = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    amount: joi.number().required(),
    description: joi.string(),
  });

  return schema.validate(expense);
};
