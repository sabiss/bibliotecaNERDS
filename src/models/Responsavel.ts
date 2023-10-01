import mongoose from "mongoose";

const responsavelSchema = new mongoose.Schema({
  nome: { type: String, require: true },
  idade: { type: String, require: true },
  matricula: { type: String, require: true },
  cpf: { type: String, require: true },
});

const responsaveis = mongoose.model("responsaveis", responsavelSchema);

export default responsaveis;
