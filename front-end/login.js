document.addEventListener("DOMContentLoaded", verificaSeAindaTemToken());

function verificaSeAindaTemToken() {
  const token = localStorage.getItem("token");

  if (token) {
    //tem token
    const payload = JSON.parse(atob(token.split(".")[1]));
    const dataAtual = new Date();
    const dataExpiracaoToken = new Date(payload.exp * 1000);

    if (!dataAtual > dataExpiracaoToken) {
      //o token não está expirado ainda, então pode entrar sem logar
      const tipoDeUsuario = payload.tipo;

      switch (tipoDeUsuario) {
        case "adm":
          window.location.assign("./Administrador/home/index.html");
          break;
        case "resp":
          window.location.assign("https://www.facebook.com");
          break;
        default:
          window.location.assign("https://www.youtuber.com");
          break;
      }
    }
  }
}

function geraErro(texto) {
  const alert = document.querySelector("#anuncioDeErro");
  alert.style.display = "flex";
  alert.innerHTML = `${texto}`;
}
async function logar() {
  const email = document.querySelector("#email").value;
  const senha = document.querySelector("#senha").value;
  const loadingOverlay = document.querySelector(".loading-overlay");
  loadingOverlay.style.display = "block";

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
      geraErro(resposta.message);
    }
    localStorage.setItem("token", token);

    const payload = JSON.parse(atob(token.split(".")[1])); //atob() decodifica base64 para sua sequencia normal, ou seja, o payload[1] será descriptografado sem precisar do jwt.verify

    const tipoDeUsuario = payload.tipo;

    switch (tipoDeUsuario) {
      case "adm":
        window.location.assign("./Administrador/home/index.html");
        break;
      case "resp":
        window.location.assign("https://www.facebook.com");
        break;
      default:
        window.location.assign("https://www.youtuber.com");
        break;
    }
  } catch (err) {
    geraErro(`Ocorreu um erro no sistema - ${err}`);
  }
}
