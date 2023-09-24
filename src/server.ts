import app from "./app.js";
const porta = process.env.PORT || 8080;

app.listen(porta, () => {
  console.log(`Iniciando porta http://localhost:${porta}`);
});
