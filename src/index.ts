import express from 'express'
import 'express-async-errors'
import {config} from 'dotenv'

import expenseRoute from './routes/ExpenseRoute'
import { db } from './db/db';

config();
db()
const app = express();
app.use(express.json());

app.use('/api/v1/expense',expenseRoute);


app.listen(process.env.PORT_NUMBER as string,()=>{
    console.log(`Server started at ${process.env.PORT_NUMBER}`);
})