import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.ObjectId,
    ref: "usuarios",
    required: true,
  },
  id_livro: {
    type: mongoose.Schema.ObjectId,
    ref: "livros",
    required: true,
  },
  data_emprestimo: { type: Date, default: Date.now, required: true },
  data_devolucao: { type: Date, required: true },
});

const emprestimos = mongoose.model("emprestimos", emprestimoSchema);

export default emprestimos;
