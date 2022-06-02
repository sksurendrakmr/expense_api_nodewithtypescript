import { Request } from "express";
import { UserDto } from "../dto/UserDto";

export type CustomReq<T> = Omit<Request, "body"> & { body: T; user?: UserDto };
