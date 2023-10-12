import express from "express";
import middleware from "../middlewares/authMiddleware";
import administradoresController from "../controllers/administradoresController";
import checkRole from "../middlewares/checkRoules";

const router = express.Router();

router
  .post("/adm/login", administradoresController.logarNoSistema)

  .use(middleware, checkRole(["adm"]))//autentica o token e vê se seu token pode ter acesso
  .post("/adm/cadastroAdm", administradoresController.cadastrarAdministrador)
  .get("/adm/listarUsers",administradoresController.listarUsuarios)
  .get("/adm/listarResponsaveis", administradoresController.listarResponsaveis)
  .post("/adm/cadastroUser", administradoresController.cadastrarUsuario)
  .post("/adm/cadastrarResponsavel",administradoresController.cadastraResponsavel)
  .delete("/adm/deletarUser/:id", administradoresController.deletarUsuario)
  .delete("/adm/deletarResponsavel/:id", administradoresController.deletarResponsavel)

export default router;
