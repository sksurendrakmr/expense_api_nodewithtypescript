import { Router } from "express";
import {
  deleteExpense,
  getExpense,
  saveExpense,
  updateExpense,
} from "../controller/ExpenseController";
import { auth } from "../middleware/auth";

const router = Router();

router.route("/").get(auth, getExpense).post(auth, saveExpense);
router.route("/:id").put(auth, updateExpense).delete(auth, deleteExpense);

export default router;
