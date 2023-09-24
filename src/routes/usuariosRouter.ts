import usuariosController from "../controllers/usuariosController.js";
import express from "express";

const router = express.Router();

router
  .get("/usuarios", usuariosController.listarUsuarios)
  .post("/usuarios", usuariosController.cadastrarUsuario)
  .delete("/usuarios/:id", usuariosController.deletarUsuario);

export default router;
