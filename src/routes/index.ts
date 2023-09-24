import express from "express";

const routes = (app) => {
  //pega a instância do express que é o app
  app.use(
    //outras rotas que serão USE(u)das
    express.json()
  );
};

export default routes;
