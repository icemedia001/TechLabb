import express from "express";
import { login, signup, forgotPassword } from "../controllers/auth.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password",forgotPassword);
export default router;