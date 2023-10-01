import express from "express";
import responsaveisController from "../controllers/responsaveisController";

const router = express.Router();

router
  .post("responsavel/cadastrarLivro", responsaveisController.cadastrarLivro)
  .post(
    "responsavel/emprestarLivro",
    responsaveisController.realizarEmprestimoDeLivro
  );

export default router;
