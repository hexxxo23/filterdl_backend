import express from "express";
import { getUsers,Register } from "../controllers/User.js";

const router = express.Router();

router.get("/fdl/users",getUsers);
router.post("/fdl/register",Register);


export default router;