import usuariosController from "../controllers/usuariosController";
import middleware from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router
  //rotas públicas
  .post("/usuarios/login", usuariosController.logarNoSistema)

  .use(middleware) //rotas que precisam de autenticação para serem acessadas
  .get("/usuarios", usuariosController.listarUsuarios)
  .post("/usuarios", usuariosController.cadastrarUsuario)
  .delete("/usuarios/:id", usuariosController.deletarUsuario);

export default router;
