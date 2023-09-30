import mongoose, { Schema } from "mongoose";

const schemaUsuario = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  tipo: { type: String, required: true },
  senha: { type: String, required: true },
});

const usuarios = mongoose.model("usuarios", schemaUsuario);

export default usuarios;
