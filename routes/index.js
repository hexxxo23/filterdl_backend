import express from "express";
import { getUsers,Login,Register } from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/refreshToken.js";
const router = express.Router();

router.get("/fdl/users",verifyToken,getUsers);
router.post("/fdl/register",Register);
router.post("/fdl/login",Login);

router.get("/fdl/token",refreshToken);


export default router;