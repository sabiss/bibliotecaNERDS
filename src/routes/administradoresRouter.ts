import express from "express";
import administradoresController from "../controllers/administradoresController";
import checkRole from "../middlewares/checkRoles";

const router = express.Router();

router
  .get("/listarUsers",checkRole(["adm"]),administradoresController.listarUsuarios)
  .get("/listarAdministradores", checkRole(["adm"]), administradoresController.listarAdministradores)
  .get("/listarResponsaveis", checkRole(["adm"]),administradoresController.listarResponsaveis)
  .get("/listarAdministradorPorId/:id", checkRole(["adm"]),administradoresController.listarAdministradorPorId)
  .get('/getUsuarioPorEmail/:email', checkRole(["adm"]),administradoresController.buscarUsuarioPorEmail)
  .get("/getBibliotecarioPorEmail/:email", checkRole(["adm"]),administradoresController.buscarBibliotecarioPorEmail)

  .post("/cadastroAdm", checkRole(["adm"]), administradoresController.cadastrarAdministrador)
  .post("/cadastroUser", checkRole(["adm"]),administradoresController.cadastrarUsuario)
  .post("/cadastrarResponsavel",checkRole(["adm"]),administradoresController.cadastraResponsavel)
  
  .put("/editarDadosAdm", checkRole(["adm"]),administradoresController.atualizarDados)

  .delete("/deletarUser", checkRole(["adm"]),administradoresController.deletarUsuario)
  .delete("/deletarResponsavel", checkRole(["adm"]),administradoresController.deletarResponsavel)

export default router;
