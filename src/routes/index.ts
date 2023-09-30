import express from "express";
import usuarios from "../routes/usuariosRouter";
import administradores from "../routes/administradoresRouter";

const routes = (app) => {
  //pega a instância do express que é o app
  app.use(
    //outras rotas que serão USE(u)das
    express.json(),
    usuarios,
    administradores
  );
};

export default routes;
