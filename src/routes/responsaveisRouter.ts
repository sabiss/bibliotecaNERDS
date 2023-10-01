import express from "express";
import responsaveisController from "../controllers/responsaveisController";

const router = express.Router();

router
  .get("/responsavel/listarLivros", responsaveisController.listarLivros)
  .post("/responsavel/cadastrarLivro", responsaveisController.cadastrarLivro)
  .post("/responsavel/emprestarLivro/:id",responsaveisController.realizarEmprestimoDeLivro)
  .post("/responsavel/login", responsaveisController.logarNoSistema)
  .delete("/responsavel/deletarLivro/:id", responsaveisController.deletarLivro)

export default router;
