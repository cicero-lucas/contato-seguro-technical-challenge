import { Router } from "express";
import userRoutes from "./userRoutes";
import ticketRoutes from "./ticketRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/users", userRoutes);
router.use("/tickets", ticketRoutes);
router.use("/auth", authRoutes);

export default router;
