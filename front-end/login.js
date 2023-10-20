import jwt from "jsonwebtoken";

function geraErro(texto) {
  const alert = document.querySelector("#anuncioDeErro");
  alert.style.display = "flex";
  alert.innerHTML = `${texto}`;
}
async function logar() {
  const email = document.querySelector("#email").value;
  const senha = document.querySelector("#senha").value;
  try {
    const retornoDaApi = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ email, senha }),
    });
    const resposta = await retornoDaApi.json();
    const token = resposta.token;

    if (!token) {
      return geraErro(resposta.message);
    }
    localStorage.setItem("token", resposta.token);

    const payload = jwt.verify(`${token}`, `${process.env.APP_SECRET}`);
    if (payload.tipo === "adm") {
      window.location.assign("https://www.instagram.com");
    } else if (payload.tipo === "resp") {
      window.location.assign("https://www.facebook.com");
    } else {
      window.location.assign("https://www.youtuber.com");
    }
  } catch (err) {
    geraErro(`Ocorreu um erro no sistema - ${err}`);
  }
}
