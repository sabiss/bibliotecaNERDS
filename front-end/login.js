document.addEventListener("DOMContentLoaded", verificaSeAindaTemToken());

function verificaSeAindaTemToken() {
  const token = localStorage.getItem("token");

  if (token) {
    //tem token
    const payload = JSON.parse(atob(decodeURIComponent(token.split(".")[1])));
    const dataAtual = new Date();
    const dataExpiracaoToken = new Date(payload.exp * 1000);

    if (dataAtual <= dataExpiracaoToken) {
      //o token não está expirado ainda, então pode entrar sem logar
      const tipoDeUsuario = payload.tipo;

      switch (tipoDeUsuario) {
        case "adm":
          window.location.assign("./Administrador/home/index.html");
          break;
        case "resp":
          window.location.assign("./Responsável/home/index.html");
          break;
        default:
          geraAlerta("Você não é cadastrado no sistema", "Erro");
          break;
      }
    }
  }
}

function geraAlerta(texto, tipoAlerta) {
  const alerta = document.querySelector("div#alerta");
  let text = document.querySelector("strong#textoDoAlerta");
  switch (tipoAlerta) {
    case "Erro":
      alerta.classList.remove("alert-success");
      alerta.classList.remove("alert-warning");
      alerta.classList.add("alert-danger");
      break;
    case "Atencao":
      alerta.classList.remove("alert-danger");
      alerta.classList.remove("alert-success");
      alerta.classList.add("alert-warning");
      break;
  }
  alerta.classList.remove("d-none");
  alerta.classList.add("d-flex");

  text.innerHTML = `${texto}`;
}
function fecharAlert() {
  const alert = document.querySelector("div#alerta");
  alert.classList.add("d-none");
  alert.classList.remove("d-flex");
}
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    logar();
  }
});
async function logar(event) {
  const email = document.querySelector("#email").value;
  const senha = document.querySelector("#senha").value;
  const loadingOverlay = document.querySelector(".loading-overlay");
  loadingOverlay.style.display = "block";

  if (email === "") {
    geraAlerta("Digite seu Email", "Atencao");
  } else if (senha === "") {
    geraAlerta("Digite sua senha", "Atencao");
  } else {
    try {
      const retornoDaApi = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ email, senha }),
      });
      const resposta = await retornoDaApi.json();

      if (!retornoDaApi.ok) {
        geraAlerta(resposta.message, "Erro");
      } else {
        const token = resposta.token;
        localStorage.setItem("token", token);

        const payload = JSON.parse(
          atob(decodeURIComponent(token.split(".")[1]))
        ); //atob() decodifica base64 para sua sequencia normal, ou seja, o payload[1] será descriptografado sem precisar do jwt.verify

        const tipoDeUsuario = payload.tipo;

        switch (tipoDeUsuario) {
          case "adm":
            window.location.assign("./Administrador/home/index.html");
            break;
          case "resp":
            window.location.assign("./Responsável/home/index.html");
            break;
          default:
            geraAlerta("Você não possui cadastro no sistema", "Erro");
            break;
        }
      }
    } catch (err) {
      console.error(err.erro);
      geraAlerta(err.message, "Erro");
    }
  }
}
