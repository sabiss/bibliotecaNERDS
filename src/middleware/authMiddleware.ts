import express from "express";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send({ message: "Requisição sem token" });
  }

  const [, token] = auth.split(" ");

  const payload = jwt.verify(`${token}`, `${process.env.APP_SECRET}`);

  if (!payload) {
    return res.status(401).send({ message: "token inválido" });
  }
  return next();
};
