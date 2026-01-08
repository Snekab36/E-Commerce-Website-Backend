import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

/*
 Cart Schema
*/
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

/*
 @route   POST /api/cart
 @desc    Add item to cart
*/
router.post("/", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { productId, title, price, image } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, title, price, image, quantity: 1 }],
      });
    } else {
      const item = cart.items.find(i => i.productId === productId);

      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productId, title, price, image, quantity: 1 });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
 @route   GET /api/cart
*/
router.get("/", protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
 @route   PUT /api/cart/:productId
*/
router.put("/:productId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(i => i.productId === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
 @route   DELETE /api/cart/:productId
*/
router.delete("/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      i => i.productId !== req.params.productId
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
