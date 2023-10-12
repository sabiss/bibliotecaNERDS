import express from "express";
import responsaveisController from "../controllers/responsaveisController";
import middleware from "../middlewares/authMiddleware";
import checkRole from "../middlewares/checkRoules";
const router = express.Router();

router
  .post("/responsavel/login", responsaveisController.logarNoSistema)

  .use(middleware, checkRole(["resp"]))
  .get("/responsavel/listarLivros", responsaveisController.listarLivros)
  .post("/responsavel/cadastrarLivro", responsaveisController.cadastrarLivro)
  .post("/responsavel/emprestarLivro",responsaveisController.realizarEmprestimoDeLivro)
  .delete("/responsavel/deletarLivro/:id", responsaveisController.deletarLivro)

export default router;
