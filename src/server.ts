import app from "./app";
const porta = process.env.PORT;

app.listen(porta, () => {
  console.log(`Iniciando porta http://localhost:${porta}`);
});
