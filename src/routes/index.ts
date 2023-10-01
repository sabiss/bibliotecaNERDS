import express from "express";
import usuarios from "../routes/usuariosRouter";
import administradores from "../routes/administradoresRouter";
import responsaveis from "../routes/responsaveisRouter";

const routes = (app) => {
  //pega a instância do express que é o app
  app.use(
    //outras rotas que serão USE(u)das
    express.json(),
    usuarios,
    administradores,
    responsaveis
  );
};

export default routes;
