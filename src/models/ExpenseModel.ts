import mongoose, { Schema } from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Provide a valid expense title"],
      enum: [
        "FoodAndDrink",
        "Recharge",
        "Travel",
        "Fuel",
        "Investment",
        "Rent",
        "Shopping",
        "Groceries",
        "Others",
        "Bill",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Enter a valid expense or income amount"],
    },
    description: {
      type: String,
      maxlength: 45,
      default: "",
    },
    date: {
      type: Date,
      default: new Date(),
    },
    category: {
      type: String,
      required: [true, "Choose a valid expense category"],
      enum: ["income", "expense"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
