import express from "express";
import usuarios from "../routes/usuariosRouter";

const routes = (app) => {
  //pega a instância do express que é o app
  app.use(
    //outras rotas que serão USE(u)das
    express.json(),
    usuarios
  );
};

export default routes;
