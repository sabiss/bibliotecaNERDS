const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", paginaCarregou());
async function paginaCarregou() {
  verificaUsuario();
}
function verificaUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const dataAtual = new Date();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const dataExpiracaoToken = new Date(payload.exp * 1000);

  if (payload.tipo != "adm" && payload.tipo != "resp") {
    window.location.assign("../../login.html");
  } else if (dataExpiracaoToken < dataAtual) {
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
function fecharAlerta() {
  const alerta = document.querySelector("div#alerta");
  alerta.classList.add("d-none");
  alerta.classList.remove("d-flex");
  location.reload();
}
async function getUsuario() {
  const emailDoUsuario = document.querySelector("#emailDoUsuario").value;
  if (!emailDoUsuario) {
    geraAlerta("Digite o email do usuário", "Atencao");
  } else {
    try {
      const respostaApi = await fetch(
        `http://localhost:3000/getUsuarioPorEmail/${emailDoUsuario}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (respostaApi.ok) {
        const usuario = await respostaApi.json();
        return usuario;
      } else {
        const mensagem = await respostaApi.json();
        geraAlerta(mensagem.message, "Erro");
      }
    } catch (error) {
      geraAlerta(error.message, "Erro");
      if (error.erro) {
        console.error(error.erro);
      }
    }
  }
}
async function preencherNomeDeUsuario() {
  const usuario = await getUsuario();
  const nomeDoUsuario = document.querySelector("#nome");
  nomeDoUsuario.innerHTML = usuario.nome;
}
async function deletar() {
  const emailDoUsuario = document.querySelector("#emailDoUsuario").value;
  try {
    const respostaApi = await fetch("http://localhost:3000/deletarUser", {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: emailDoUsuario }),
    });
    const retorno = await respostaApi.json();
    if (respostaApi.ok) {
      geraAlerta(retorno.message, "AnuncioDeSucesso");
    } else {
      geraAlerta(retorno.message, "Erro");
    }
  } catch (error) {
    geraAlerta(error.message, "Erro");
    if (error.erro) {
      console.error(error.erro);
    }
  }
}
