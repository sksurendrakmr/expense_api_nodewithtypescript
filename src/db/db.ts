import mongoose from "mongoose";

export const db = () => {
  mongoose
    .connect(process.env.DB_URL as string)
    .then(() => console.log("Connected to DB"))
    .catch((err: unknown) => console.log("Error occured while connected to db",JSON.stringify(err)));
};
