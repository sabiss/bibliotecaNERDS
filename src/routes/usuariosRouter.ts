import usuariosController from "../controllers/usuariosController";
import middleware from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router
  //rotas públicas
  .post("/usuarios/login", usuariosController.logarNoSistema)

  .use(middleware); //rotas que precisam de autenticação para serem acessadas

export default router;
