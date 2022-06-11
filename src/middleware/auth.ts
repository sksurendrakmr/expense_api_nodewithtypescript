import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthMiddlewareReq, DecodedPayload } from "../dto/UserDto";
import { User } from "../models/UserModel";

export const auth = async (
  req: AuthMiddlewareReq,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedPayload;

      const user = await User.findById(decoded.id);
      if (!user)
        return res.status(401).json({ message: "User is not authorized" });

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "User is not authorized", error });
    }
  }
  if (!token)
    return res.status(401).json({ message: "User is not authorized" });
};
