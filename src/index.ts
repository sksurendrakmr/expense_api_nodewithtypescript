import express from 'express'
import {config} from 'dotenv'
import 'express-async-errors'

import expenseRoute from './routes/ExpenseRoute'
import userRoute from './routes/UserRoute'
import { db } from './db/db';

config();
db()
const app = express();
app.use(express.json());

app.use('/api/v1/expense',expenseRoute);
app.use('/api/v1/user',userRoute)


app.listen(process.env.PORT_NUMBER as string,()=>{
    console.log(`Server started at ${process.env.PORT_NUMBER}`);
})