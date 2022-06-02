import {Router} from 'express'
import { getExpense, saveExpense } from '../controller/ExpenseController';

const router = Router();

router.route('/').get(getExpense).post(saveExpense);

export default router;