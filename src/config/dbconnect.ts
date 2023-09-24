import mongoose from "mongoose";
import "dotenv/config";

const senha = process.env.db_senha;
const user = process.env.db_user;

mongoose.connect(
  `mongodb+srv://${user}:${senha}@bibliotecanerds.wht7vis.mongodb.net/?retryWrites=true&w=majority`
);

let conexaoComDataBase = mongoose.connection;

export default conexaoComDataBase;
