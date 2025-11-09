import express from "express";
import { login, register, logout, me } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

export const authRouter = express.Router();

authRouter.get("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/me", requireAuth, me);
