import mongoose from "mongoose";

const autorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  obras: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "livros",
    require: true,
  },
});

const autores = mongoose.model("autores", autorSchema);

export default autores;
