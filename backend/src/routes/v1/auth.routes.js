
import { Router } from "express";
import { register, login } from "../../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
