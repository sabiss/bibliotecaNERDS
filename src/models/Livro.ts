import mongoose from "mongoose";

const livrosSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  isbn: { type: Number, required: true },
  numero_paginas: { type: Number, required: true },
  genero: { type: String, required: true },
  editora: { type: String, required: true },
  copias: { type: [Number] },
  //TOMBO
});

livrosSchema.virtual("quantidade").get(function () {
  return this.copias.length;
});

const livros = mongoose.model("livros", livrosSchema);

export default livros;
