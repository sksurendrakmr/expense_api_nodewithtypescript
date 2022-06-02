import { Request } from "express";
import { Types } from "mongoose";

export type UserDto = {
  name: string;
  email: string;
  password: string;
  _id?: Types.ObjectId;
};

export type userMethods = {
  generateToken: () => string;
};

export type UserForLoginDto = {
  email: string;
  password: string;
};

export type DecodedPayload = { id: string };

export type AuthMiddlewareReq = Request & { user?: UserDto };
