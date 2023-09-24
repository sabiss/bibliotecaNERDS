import usuarios from "../models/Usuario.js";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class usuarioController {
  static verificaExistenciaDeUsuario = async (req, res) => {
    const { email } = req.body;
    const usuarioExiste = await usuarios.findOne({ email: email });

    if (usuarioExiste) {
      return true;
    } else {
      return false;
    }
  };

  static cadastrarUsuario = async (
    req: express.Request,
    res: express.Response
  ) => {
    if (await this.verificaExistenciaDeUsuario(req, res)) {
      return res
        .status(422)
        .send({ message: "Este email já está sendo usado" });
    }
    const { email, senha, nome } = req.body;

    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(senha, salt); //criando hash da senha para depois ser traduzida para senha normal e comparada

    const novoUsuario = new usuarios({
      nome,
      email,
      senhaHash,
    });

    try {
      await novoUsuario.save();
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
        return res.status(404).send({ message: "Usuário não encontrado" });
      }
      return res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res.status(500).send(`Erro ao deletar usuário - ${error}`);
    }
  };
}

export default usuarioController;
