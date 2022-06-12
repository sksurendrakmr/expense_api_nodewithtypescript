import { NextFunction, Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import { AuthMiddlewareReq } from "../dto/UserDto";

const multerStoarge = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Image upload is not of type image"), false);
  }
};

const upload = multer({
  storage: multerStoarge,
  fileFilter: multerFilter,
});

export const uploadExpenseImg = upload.fields([
  { name: "expenseImgs", maxCount: 2 },
]);

//Resizing and formatting imgs
export const resizeExpenseImgs = async (
  req: AuthMiddlewareReq,
  res: Response,
  next: NextFunction
) => {
  const typedReqFiles = req.files as {
    [filedName: string]: Express.Multer.File[];
  };

  if (!typedReqFiles.expenseImgs) return next();

  req.body.expenseImgs = [];
  const expenseImgsPromise = typedReqFiles.expenseImgs.map((file, index) => {
    const fileName = `Expense_${req.user?._id}_${index + 1}_${Date.now()}.jpeg`;

    req.body.expenseImgs?.push(fileName);

    return sharp(typedReqFiles.expenseImgs[index].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/imgs/expense/${fileName}`);
  });

  await Promise.all(expenseImgsPromise);
  next();
};
