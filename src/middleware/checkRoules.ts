import jwt from "jsonwebtoken";

interface JwtPayload {
  //faz a comando "req.idUserRequest = payload.id" funcionar
  tipo: string;
}

const checkRole = (roles: String[] | String) => async (req, res, next) => {
  const tipoDoUser = req.tipo;

  if (roles == "*") {
    return next();
  }
  if (!roles.includes(tipoDoUser)) {
    return res
      .status(401)
      .send({ message: "você não tem permissão para acessar essa rota" });
  }
  return next(); //deu tudo certo, pode continuar o processo
};
export default checkRole;
