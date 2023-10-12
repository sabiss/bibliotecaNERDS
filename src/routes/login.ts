import express from "express";
import login from "../controllers/login";

const router = express.Router();

router.post("/login", login.logarNoSistema);

export default router;
