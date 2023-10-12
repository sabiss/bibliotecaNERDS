import usuariosController from "../controllers/usuariosController";
import middleware from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router

//.use(middleware); //rotas que precisam de autenticação para serem acessadas
export default router;
