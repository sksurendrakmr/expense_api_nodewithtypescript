import { Request } from "express";

export type UserDto = {
    name:string;
    email:string;
    password:string;
}

export type userMethods = {
    generateToken:()=>string;
}

export type UserForLoginDto = {
    email:string;
    password:string;
}

export type DecodedPayload = {id:string};

export type AuthMiddlewareReq = Request & {user?:UserDto}