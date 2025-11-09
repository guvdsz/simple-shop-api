import express from "express";
import { getCartItems, addItemToCart } from "../controllers/cartController.js";

export const cartRouter = express.Router();

cartRouter.get("/", getCartItems);
cartRouter.post("/", addItemToCart);
