const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", verificaUsuario());
function verificaUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const dataAtual = new Date();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const dataExpiracaoToken = new Date(payload.exp * 1000);

  if (payload.tipo != "adm" || dataExpiracaoToken < dataAtual) {
    window.location.assign("../../login.html");
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
    case "AnuncioDeSucesso":
      alerta.classList.remove("alert-danger");
      alerta.classList.remove("alert-warning");
      alerta.classList.add("alert-success");
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
  const alerta = document.querySelector("div#alerta");
  alerta.classList.add("d-none");
  alerta.classList.remove("d-flex");
  location.reload();
}
async function devolver() {
  const numeroDaCopia = document.querySelector("#numeroDaCopia").value;

  if (numeroDaCopia === "") {
    geraAlerta("Insira o Número da Cópia", "Atencao");
  } else {
    try {
      const respostaApi = await fetch(
        "http://localhost:3000/registrarDevolucao",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
          body: JSON.stringify({ numeroDaCopia }),
        }
      );
      if (!respostaApi.ok) {
        const mensagem = await respostaApi.json();
        geraAlerta(mensagem.message, "Erro");
      } else {
        const mensagem = await respostaApi.json();
        geraAlerta(mensagem.message, "AnuncioDeSucesso");
      }
    } catch (err) {
      console.error(err.erro);
      geraAlerta(err.message, "Erro");
    }
  }
}
