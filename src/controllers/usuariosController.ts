import usuarios from "../models/Usuario";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class usuarioController {
  static verificaExistenciaDeUsuario = async (req, res) => {
    const { email } = req.body;
    const usuario = await usuarios.findOne({ email: email });
    if (usuario) {
      return usuario;
    }
    return false;
  };
  static logarNoSistema = async (req, res) => {
    const { email, senha } = req.body;
    try {
      const usuario = await this.verificaExistenciaDeUsuario(req, res);
      //testes para saber exstência dos dados de login
      if (!usuario) {
        return res.status(404).send({ message: "usuário não encontrado" });
      }
      if (!email) {
        return res.status(400).send({ message: "digite o email" });
      }
      if (!senha) {
        return res.status(400).send({ message: "digite a senha" });
      }

      const senhaCerta = await bcrypt.compare(`${senha}`, `${usuario.senha}`);
      if (!senhaCerta) {
        return res.status(400).send({ message: "Senha inválida" });
      }
      const token = jwt.sign(
        //payload chave e header
        {
          id: usuario._id,
        },
        `${process.env.APP_SECRET}`,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).send({ message: `seu token - ${token}` });
    } catch (erro) {
      res.status(500).send({ message: "Erro ao realizar login" });
    }
  };
}

export default usuarioController;
