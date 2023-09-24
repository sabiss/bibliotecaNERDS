import app from "./app.js";
const porta = process.env.PORT;

app.listen(porta, () => {
  console.log(`Iniciando porta http://localhost:${porta}`);
});
