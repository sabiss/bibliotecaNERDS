const checkRole = (roles: String[] | String) => (req, res, next) => {
  const tipoDoUser = req.tipo;

  if (!roles.includes(tipoDoUser)) {
    return res
      .status(401)
      .send({ message: "você não tem permissão para acessar essa rota" });
  }
  return next(); //deu tudo certo, pode continuar o processo
};
export default checkRole;
