import express from "express";
import conexaoComDataBase from "./config/dbconnect.js";
import router from "./routes/index.js";

const app = express();

conexaoComDataBase.on(
  "error",
  console.log.bind(console, "erro na conexão com o MongoDB")
);

conexaoComDataBase.once("open", () => {
  console.log("Banco conectado");
});

app.use(express.json());
router(app);

export default app;
