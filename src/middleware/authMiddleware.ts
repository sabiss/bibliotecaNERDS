import express from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  //faz a comando "req.idUserRequest = payload.id" funcionar
  id: string;
}

export default async (req, res, next) => {
  const auth = req.headers.authorization; //pegando a autorização no header da requisição

  if (!auth) {
    //não tem autorização
    return res
      .status(401)
      .send({ message: "Requisição sem token. Faça Login" });
  }

  const [, token] = auth.split(" ");
  try {
    const payload = jwt.verify(
      `${token}`,
      `${process.env.APP_SECRET}`
    ) as JwtPayload;

    req.id = payload.id;
  } catch (err) {
    //tem token, mas ele está errado ou expirado
    return res
      .status(401)
      .send({ message: "Token inválido ou expirado. Faça login no sistema" });
  }

  return next(); //deu tudo certo, pode continuar o processo
};