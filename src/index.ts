import express from 'express'
import {config} from 'dotenv'

config();
const app = express();



app.listen(process.env.PORT_NUMBER as string,()=>{
    console.log(`Server started at ${process.env.PORT_NUMBER}`);
})