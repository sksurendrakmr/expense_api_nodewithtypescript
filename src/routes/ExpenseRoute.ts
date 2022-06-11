import { Router } from "express";
import {
  deleteExpense,
  getExpense,
  saveExpense,
  updateExpense,
} from "../controller/ExpenseController";
import { auth } from "../middleware/auth";
import { resizeExpenseImgs, uploadExpenseImg } from "../middleware/upload";

const router = Router();

router
  .route("/")
  .get(auth, getExpense)
  .post(auth, uploadExpenseImg, resizeExpenseImgs, saveExpense);
router.route("/:id").put(auth, updateExpense).delete(auth, deleteExpense);

export default router;
