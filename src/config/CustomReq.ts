import { Request } from "express";

export type CustomReq<T> = Omit<Request,'body'> & {body:T};