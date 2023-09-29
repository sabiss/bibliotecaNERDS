import express from "express";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).send({ message: "Requisição sem token" });
  }

  const [, token] = auth.split(" ");
  try {
    const payload = jwt.verify(`${token}`, `${process.env.APP_SECRET}`);
  } catch (err) {
    return res.status(401).send({ message: "token inválido" });
  }

  return next();
};
