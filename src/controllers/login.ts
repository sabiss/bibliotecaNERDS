import ferramentas from "../funcoesAuxiliares/ferramentas";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

class login {
  static logarNoSistema = async (req, res) => {
    const { email, senha } = req.body;
    try {
      const logando = await ferramentas.verificarUsoDeEmail(req, res); //retorna false ou a pessoa que quer logar
      //testes para saber exstência dos dados de login
      if (!logando) {
        return res.status(404).send({ message: "usuário não encontrado" });
      }
      if (!email) {
        return res.status(400).send({ message: "digite o email" });
      }
      if (!senha) {
        return res.status(400).send({ message: "digite a senha" });
      }

      const senhaCerta = await bcrypt.compare(`${senha}`, `${logando.senha}`);
      if (!senhaCerta) {
        return res.status(400).send({ message: "Senha inválida" });
      }
      const token = jwt.sign(
        //payload chave e header
        {
          id: logando._id,
          tipo: logando.tipo,
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
export default login;
