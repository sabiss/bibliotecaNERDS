import jwt from "jsonwebtoken";

interface JwtPayload {
  //faz a comando "req.idUserRequest = payload.id" funcionar
  tipo: string;
}

export default (req, res, next) => {
  const auth = req.headers.authorization; //pegando a autorização no header da requisiçã

  if (!auth) {
    //não tem autorização
    return res
      .status(401)
      .send({ message: "Requisição sem token. Faça Login" });
  }

  const [, token] = auth.split(" ");
  try {
    const payload = jwt.verify(
      //desencriptando payload
      `${token}`,
      `${process.env.APP_SECRET}`
    ) as JwtPayload;
    req.tipo = payload.tipo;
  } catch (err) {
    //tem token, mas ele está errado ou expirado
    return res.status(401).send({
      message: `Token inválido. Faça login no sistema - ${err}`,
    });
  }
  return next(); //deu tudo certo, pode continuar o processo
};
