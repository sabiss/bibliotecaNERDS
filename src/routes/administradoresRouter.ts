import express from "express";
import middleware from "../middleware/authMiddleware";
import administradoresController from "../controllers/administradoresController";

const router = express.Router();

router
  .use(middleware) //rotas que precisam de autenticação para serem acessadas
  .get("/usuarios", administradoresController.listarUsuarios)
  .post("/usuarios", administradoresController.cadastrarUsuario)
  .delete("/usuarios/:id", administradoresController.deletarUsuario);
