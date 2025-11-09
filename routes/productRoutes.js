import express from "express";
import { getProductById, getProducts, getProductsBySearch } from "../controllers/productsController.js";

export const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/search", getProductsBySearch);
productRouter.get("/:id", getProductById);
