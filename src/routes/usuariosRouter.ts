import usuariosController from "../controllers/usuariosController";
import middleware from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router
  .use(middleware)
  .get("/usuarios", usuariosController.listarUsuarios)
  .post("/usuarios", usuariosController.cadastrarUsuario)
  .delete("/usuarios/:id", usuariosController.deletarUsuario)
  .post("/usuario/login", usuariosController.logarNoSistema);

export default router;
