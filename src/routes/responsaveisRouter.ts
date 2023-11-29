import express from "express";
import responsaveisController from "../controllers/responsaveisController";
import checkRole from "../middlewares/checkRoles";
const router = express.Router();

router
  .get("/listarLivros", checkRole(["resp", "adm"]), responsaveisController.listarLivros)
  .get("/listarEmprestimosAtivos", checkRole(["resp", "adm"]), responsaveisController.listarEmprestimosAtivos)
  .get("/listarTodosOsEmprestimos", checkRole(["resp", "adm"]), responsaveisController.listasTodosOsEmprestimos)
  .get("/listarTotais", checkRole(["resp", "adm"]), responsaveisController.listarTotais)
  .get("/listarCopias/:id", checkRole(["resp", "adm"]),responsaveisController.listarCopias)
  .post("/adicionarCopia", checkRole(["resp", "adm"]),responsaveisController.adicionarCopiaDeLivro)
  .post("/cadastrarLivro", checkRole(["resp", "adm"]), responsaveisController.cadastrarLivro)
  .post("/emprestarLivro", checkRole(["resp", "adm"]), responsaveisController.realizarEmprestimoDeLivro)
  .delete("/deletarLivro/:id", checkRole(["resp", "adm"]), responsaveisController.deletarLivro)
  .put("/registrarDevolucao", checkRole(["resp", "adm"]), responsaveisController.registrarDevolucaoDeLivro)
  
  

export default router;
