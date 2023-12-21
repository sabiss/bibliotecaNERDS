import mongoose, { Schema } from "mongoose";

const fotoSchema: Schema = new mongoose.Schema({
  nome: { type: String, required: true },
  src: { type: String, required: true },
});

const fotos = mongoose.model("fotos", fotoSchema);

export default fotos;
