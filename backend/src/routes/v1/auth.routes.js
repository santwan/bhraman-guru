/**
 * @file This file defines the routes specifically for user authentication functionalities.
 * It maps HTTP endpoints like /register, /login, and /logout to their
 * corresponding controller functions, which handle the core logic.
 */

import { Router } from "express";
import { register, login } from "../../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

export default authRouter;
