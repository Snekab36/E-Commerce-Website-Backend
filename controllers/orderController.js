import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const order = await Order.create({
    user: req.user.id,
    orderItems: req.body.items,
    shippingAddress: req.body.shipping,
    totalPrice: req.body.total,
    isPaid: false,
  });
  res.json(order);
};
