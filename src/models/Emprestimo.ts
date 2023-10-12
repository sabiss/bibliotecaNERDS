import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.ObjectId,
    ref: "usuarios",
    required: true,
  },
  idLivro: {
    type: mongoose.Schema.ObjectId,
    ref: "livros",
    required: true,
  },
  dataEmprestimo: { type: Date, default: Date.now },
  dataDevolucao: { type: Date, required: true },
});

const emprestimos = mongoose.model("emprestimos", emprestimoSchema);

export default emprestimos;
