import mongoose from "mongoose";
import administradores from "../models/Administrador";
import express from "express";
import bcrypt from "bcrypt";
import usuarios from "../models/Usuario";
import responsaveis from "../models/Responsavel";
import ferramentas from "../funcoesAuxiliares/ferramentas";

class administradorController {
  static cadastrarUsuario = async (
    req: express.Request,
    res: express.Response
  ) => {
    if (await ferramentas.verificarUsoDeEmail(req, res)) {
      return res
        .status(400)
        .send({ message: "Este email já está sendo usado" });
    }
    const { email, senha, nome, cpf } = req.body;

    const salt = await bcrypt.genSalt();
    const senhaHash = await bcrypt.hash(`${senha}`, `${salt}`); //criando hash da senha para depois ser traduzida para senha normal e comparada

    const novoUsuario = new usuarios({
      nome,
      email,
      tipo: "user",
      senha: senhaHash,
      cpf,
    });

    try {
      await novoUsuario.save();
      res.status(201).send({ message: "Usuário Criado com Sucesso" });
    } catch (error) {
      res.status(500).send({
        message: `Erro ao salvar usuário no Banco`,
        erro: error,
      });
    }
  };
  static cadastrarAdministrador = async (req, res) => {
    const { email, senha, tipo, nome } = req.body;

    try {
      const existe = await ferramentas.verificarUsoDeEmail(req, res);

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
  static listarAdministradores = async (req, res) => {
    try {
      const adms = await administradores.find();
      return res.status(200).send(adms);
    } catch (err) {
      return res
        .status(500)
        .send({ message: `Erro ao listar administradores - ${err}` });
    }
  };
  static listarAdministradorPorId = async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .send({ message: "Erro ao reconhecer id do usuário" });
    } else {
      try {
        const adm = await administradores.findOne({ _id: id });
        if (!adm) {
          return res
            .status(404)
            .send({ message: "Administrador não encontrado" });
        } else {
          return res.status(200).send(adm);
        }
      } catch (err) {
        return req
          .status(500)
          .send({ message: "Erro ao buscar o Administrador", erro: err });
      }
    }
  };
  static cadastraResponsavel = async (req, res) => {
    try {
      const existe = await ferramentas.verificarUsoDeEmail(req, res);

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
        .send({ message: ` Erro ao cadastrar responsável`, erro: err });
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
    const { email } = req.body;

    try {
      const usuarioDeletado = await usuarios.findOneAndDelete({ email: email });
      if (!usuarioDeletado) {
        return res.status(404).send({ message: "Usuário não encontrado" });
      }
      return res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .send({ message: `Erro ao deletar usuário`, erro: error });
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
  static atualizarDados = async (req, res) => {
    const { nome, email, senha, id } = req.body;
    let administrador;
    try {
      if (!senha) {
        administrador = await administradores.findOneAndUpdate(
          { _id: id },
          { $set: { nome: nome, email: email } },
          { new: true }
        );
      } else {
        administrador = await administradores.findOneAndUpdate(
          { _id: id },
          { $set: { nome: nome, email: email, senha: senha } },
          { new: true }
        );
      }
      if (!administrador) {
        return res
          .status(404)
          .send({ message: "Administrador não encontrado" });
      }
      return res.status(200).send({ message: "Dados Atualizados" });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ message: "Erro ao atualizar dados", erro: error });
    }
  };
  static buscarUsuarioPorEmail = async (req, res) => {
    const email = req.params.email;
    if (!email) {
      return res.status(400).send({ message: "Digite o email do usuário" });
    }
    try {
      const usuario = await usuarios.findOne({ email: email });
      if (!usuario) {
        return res
          .status(404)
          .send({ message: "Usuário com esse email não encontrado" });
      }
      return res.status(200).send(usuario);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Erro ao buscar usuário", erro: error });
    }
  };
}

export default administradorController;
