import mongoose from "mongoose";
import administradores from "../models/Administrador";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usuarios from "../models/Usuario";
import responsaveis from "../models/Responsavel";

class administradorController {
  static logarNoSistema = async (req, res) => {
    const { email, senha } = req.body;
    try {
      const adm = await this.verificarUsoDeEmail(req, res);
      //testes para saber exstência dos dados de login
      if (!adm) {
        return res.status(404).send({ message: "usuário não encontrado" });
      }
      if (!email) {
        return res.status(400).send({ message: "digite o email" });
      }
      if (!senha) {
        return res.status(400).send({ message: "digite a senha" });
      }

      const senhaCerta = await bcrypt.compare(`${senha}`, `${adm.senha}`);
      if (!senhaCerta) {
        return res.status(400).send({ message: "Senha inválida" });
      }
      const token = jwt.sign(
        //payload chave e header
        {
          id: adm._id,
          tipo: adm.tipo,
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

  static verificarUsoDeEmail = async (req, res) => {
    const { email } = req.body;

    try {
      const existeEmUsers = await usuarios.findOne({ email: email });
      const existeEmAdms = await administradores.findOne({ email: email });
      const existeResponsavel = await responsaveis.findOne({ email: email });

      if (existeEmUsers || existeEmAdms || existeResponsavel) {
        return existeEmAdms || existeEmUsers || existeResponsavel;
      }

      return false;
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Erro ao buscar existência de email no sistema" });
    }
  };
  static cadastrarUsuario = async (
    req: express.Request,
    res: express.Response
  ) => {
    if (await this.verificarUsoDeEmail(req, res)) {
      return res
        .status(400)
        .send({ message: "Este email já está sendo usado" });
    }
    const { email, senha, nome } = req.body;

    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(`${senha}`, `${salt}`); //criando hash da senha para depois ser traduzida para senha normal e comparada

    const novoUsuario = new usuarios({
      nome,
      email,
      tipo: "user",
      senha: senhaHash,
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
  static cadastrarAdministrador = async (req, res) => {
    const { email, senha, tipo, nome } = req.body;

    try {
      const existe = await this.verificarUsoDeEmail(req, res);

      if (!existe) {
        const salt = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(`${senha}`, salt);

        const novoAdm = new administradores({
          nome,
          email,
          senha: senhaHash,
          tipo: "adm",
        });

        await novoAdm.save();
        return res
          .status(201)
          .send({ message: "Administrador criado com sucesso" });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao cadastrar Administrador - ${err}` });
    }
  };
  static cadastraResponsavel = async (req, res) => {
    try {
      const existe = await this.verificarUsoDeEmail(req, res);

      if (!existe) {
        const { nome, idade, cpf, email, senha } = req.body;

        const responsavel = new responsaveis({
          nome,
          idade,
          cpf,
          email,
          senha,
          tipo: "resp",
        });

        const salt = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(`${responsavel.senha}`, `${salt}`);

        responsavel.senha = senhaHash;
        await responsavel.save();

        return res
          .status(201)
          .send({ message: "Responsável criado com sucesso" });
      }
    } catch (err) {
      return res
        .status(500)
        .send({ message: ` Erro ao cadastrar responsável - ${err}` });
    }
  };
  static listarResponsaveis = async (req, res) => {
    try {
      const listarResponsaveis = await responsaveis.find();
      return res.status(200).send(listarResponsaveis);
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao buscar responsáveis - Erro: ${err}` });
    }
  };
  static deletarResponsavel = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de usuário inválido" });
    }
    try {
      await responsaveis.findByIdAndDelete(id);
      return res
        .status(200)
        .send({ message: "Responsável deletado com sucesso" });
    } catch (err) {
      return res
        .status(404)
        .send({ message: `Responsável não encontrado - Erro: ${err}` });
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
      await usuarios.findByIdAndDelete(id);
      return res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res.status(500).send(`Erro ao deletar usuário - ${error}`);
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
}

export default administradorController;
