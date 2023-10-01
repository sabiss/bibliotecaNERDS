import express from "express";
import middleware from "../middleware/authMiddleware";
import administradoresController from "../controllers/administradoresController";

const router = express.Router();

router
  .post("/adm/login", administradoresController.logarNoSistema) //irei pensar numa lógica melhor

  .use(middleware) //rotas que precisam de autenticação para serem acessadas
  .post("/adm/cadastroAdm", administradoresController.cadastrarAdministrador)
  .get("/adm/listarUsers", administradoresController.listarUsuarios)
  .post("/adm/cadastroUser", administradoresController.cadastrarUsuario)
  .post(
    "/adm/cadastrarResponsavel",
    administradoresController.cadastraResponsavel
  )
  .delete("/adm/deletarUser/:id", administradoresController.deletarUsuario);

export default router;
