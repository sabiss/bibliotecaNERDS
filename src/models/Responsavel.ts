import mongoose from "mongoose";

const responsavelSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: String, required: true },
  cpf: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
});

const responsaveis = mongoose.model("responsaveis", responsavelSchema);

export default responsaveis;
