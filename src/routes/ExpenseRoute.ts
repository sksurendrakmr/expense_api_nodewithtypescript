import {Router} from 'express'
import { deleteExpense, getExpense, saveExpense, updateExpense } from '../controller/ExpenseController';

const router = Router();

router.route('/').get(getExpense).post(saveExpense);
router.route('/:id').put(updateExpense).delete(deleteExpense);

export default router;