import express from "express";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// CREATE product (Admin only)
router.post(
  "/",
  protect,
  async (req, res) => {
    const product = new Product(req.body);
    const created = await product.save();
    res.status(201).json(created);
  }
);

export default router;
