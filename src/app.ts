import express from "express";
import conexaoComDataBase from "./config/dbconnect";
import router from "./routes/index";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config({ path: `${__dirname}/.env` });

const app = express();

conexaoComDataBase.on(
  "error",
  console.log.bind(console, "erro na conexão com o MongoDB")
);

conexaoComDataBase.once("open", () => {
  console.log("Banco conectado");
});

app.use("/public", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.json(), cors("*"));
router(app);

export default app;
