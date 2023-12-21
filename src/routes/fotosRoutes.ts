import express from "express";
const router = express.Router();
import { upload } from "../config/multer";
import FotosController from "../controllers/fotosController";
import checkRole from "../middlewares/checkRoles";

router
  .post("/adicionarFoto", checkRole(["adm", "resp"]), upload.single("file"), FotosController.criarFoto)
  .put("/atualizarFotoDePerfil", checkRole(["adm", "resp"]), FotosController.atualizarFoto)
  .delete("/deletarFoto/:id", checkRole(["adm", "resp"]), FotosController.removerFoto)
  .get("/foto/:id", checkRole(["adm", "resp"]), FotosController.getFoto)

export default router;
