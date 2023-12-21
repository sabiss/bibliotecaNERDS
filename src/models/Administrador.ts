import mongoose, { Schema } from "mongoose";

const schemaAdm = new Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  tipo: { type: String, required: true },
  cpf: { type: String, required: true },
  fotoPerfil: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fotos",
    required: false,
  },
});

const administradores = mongoose.model("administradores", schemaAdm);

export default administradores;
