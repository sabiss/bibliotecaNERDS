import mongoose from "mongoose";

const livrosSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "autores",
    require: true,
  },
  isbn: { type: Number, require: true },
  numero_paginas: { type: Number, require: true },
  genero: { type: String, require: true },
  editora: { type: String },
  quantidade: { type: Number, require: true },
  //TOMBO
});

const livros = mongoose.model("livros", livrosSchema);

export default livros;
