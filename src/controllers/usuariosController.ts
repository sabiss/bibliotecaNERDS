import usuarios from "../models/Usuario.js";
import express from "express";
import mongoose from "mongoose";

class usuarioController {
  static cadastrarUsuario = async (
    req: express.Request,
    res: express.Response
  ) => {
    const usuario = new usuarios(req.body);
    try {
      await usuario.save();
      res.status(201).send({ message: "Usuário Criado com Sucesso" });
    } catch (error) {
      res.status(500).send({
        message: `Erro ao salvar usuário no Banco - ${error}`,
      });
    }
  };

  static listarUsuarios = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const listaUsuarios: Object[] = await usuarios.find();
      res.status(200).json(listaUsuarios);
    } catch (error) {
      res.status(500).send({
        message: `Erro ao buscar lista de usuários no banco - ${error}`,
      });
    }
  };

  static deletarUsuario = async (
    req: express.Request,
    res: express.Response
  ) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de usuário inválido" });
    }
    try {
      const erro = await usuarios.findByIdAndDelete(id);
      if (!erro) {
        res
          .status(200)
          .send({ message: "usuário deletado com sucesso" + erro });
      } else {
        res.status(404).send({ message: `usuário não encontrado - ${erro}` });
      }
    } catch (erro) {
      res.status(500).send(`Usuário não encontrado - ${erro}`);
    }
  };
}

export default usuarioController;
