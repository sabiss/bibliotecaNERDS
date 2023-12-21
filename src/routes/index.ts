import express from "express";
import administradores from "../routes/administradoresRouter";
import responsaveis from "../routes/responsaveisRouter";
import login from "../routes/login";
import authMiddleware from "../middlewares/authMiddleware";
import fotos from "../routes/fotosRoutes";

const routes = (app) => {
  //pega a instância do express que é o app
  app.use(
    //outras rotas que serão USE(u)das
    express.json(),
    login,
    authMiddleware,
    administradores,
    responsaveis,
    fotos
  );
};

export default routes;
