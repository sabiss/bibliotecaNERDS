import mongoose, { Schema } from "mongoose";

const schemaAdm = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senhaHash: { type: String, required: true },
  tipo: { type: String, required: true },
});

const administradores = mongoose.model("administradores", schemaAdm);

export default administradores;
