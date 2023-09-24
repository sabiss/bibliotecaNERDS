import mongoose, { Schema } from "mongoose";

interface Usuario extends Document {
  nome: string;
  email: string;
  senhaHash: string;
}

const schemaUsuario = new Schema<Usuario>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senhaHash: { type: String, required: true },
});

const usuarios = mongoose.model<Usuario>("usuarios", schemaUsuario);

export default usuarios;
