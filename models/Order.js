import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderItems: [],
  totalPrice: Number,
  shippingAddress: String,
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
