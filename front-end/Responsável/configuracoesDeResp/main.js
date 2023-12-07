const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", paginaCarregou());
async function paginaCarregou() {
  verificaUsuario();
  await preencherFormsComDadosDoResponsavel();
}
function verificaUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const dataAtual = new Date();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const dataExpiracaoToken = new Date(payload.exp * 1000);

  if (
    (payload.tipo != "adm" && payload.tipo != "resp") ||
    dataExpiracaoToken < dataAtual
  ) {
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
}
async function getResponsavel() {
  const payload = JSON.parse(atob(decodeURIComponent(token.split(".")[1])));
  if (!payload) {
    geraAlerta("Erro com o token", "Erro");
  } else {
    const id = payload.id;
    try {
      const respostaApi = await fetch(
        `http://localhost:3000/getResponsavelPorId/${id}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!respostaApi.ok) {
        const mensagem = await respostaApi.json();
        geraAlerta(mensagem.message, "Erro");
        if (message.erro) {
          console.error(mensagem.erro);
        }
      } else {
        const responsavel = await respostaApi.json();
        return responsavel;
      }
    } catch (err) {
      geraAlerta(err.message, "Erro");
      if (err.erro) {
        console.error(err.erro);
      }
    }
  }
}
async function preencherFormsComDadosDoResponsavel() {
  const fotoPerfil = document.querySelector("#fotoPerfil");
  const nome = document.querySelector("#nome");
  const email = document.querySelector("#email");

  const responsavel = await getResponsavel();

  nome.value = responsavel.nome;
  email.value = responsavel.email;

  if (responsavel.fotoPerfil) {
    fotoPerfil.style.backgroundImage = `url("${responsavel.fotoPerfil}")'`;
    fotoPerfil.style.backgroundSize = "cover"; // Ajuste o tamanho conforme necessário
    fotoPerfil.style.backgroundPosition = "center"; // Centralize a imagem
    fotoPerfil.style.backgroundRepeat = "no-repeat";
  }
}
