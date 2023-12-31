import express from "express";
import administradoresController from "../controllers/administradoresController";
import checkRole from "../middlewares/checkRoles";

const router = express.Router();

router
  .post("/cadastroAdm", checkRole(["adm"]), administradoresController.cadastrarAdministrador)
  .get("/listarUsers",checkRole(["adm"]),administradoresController.listarUsuarios)
  .get("/listarResponsaveis", checkRole(["adm"]),administradoresController.listarResponsaveis)
  .post("/cadastroUser", checkRole(["adm"]),administradoresController.cadastrarUsuario)
  .post("/cadastrarResponsavel",checkRole(["adm"]),administradoresController.cadastraResponsavel)
  .delete("/deletarUser/:id", checkRole(["adm"]),administradoresController.deletarUsuario)
  .delete("/deletarResponsavel/:id", checkRole(["adm"]),administradoresController.deletarResponsavel)

export default router;
