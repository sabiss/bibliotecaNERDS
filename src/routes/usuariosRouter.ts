import usuariosController from "../controllers/usuariosController";
import express from "express";

const router = express.Router();

router
  .get("/usuarios", usuariosController.listarUsuarios)
  .post("/usuarios", usuariosController.cadastrarUsuario)
  .delete("/usuarios/:id", usuariosController.deletarUsuario)
  .post("/usuario/login", usuariosController.logarNoSistema);

export default router;
