const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", paginaCarregou());
async function paginaCarregou() {
  verificaUsuario();
  await preencherFormsComDadosDoUser();
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
async function getAdministrador() {
  const payload = JSON.parse(atob(decodeURIComponent(token.split(".")[1])));
  if (!payload) {
    geraAlerta("Erro com o token", "Erro");
  } else {
    const id = payload.id;
    try {
      const respostaApi = await fetch(
        `http://localhost:3000/listarAdministradorPorId/${id}`,
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
        const administrador = await respostaApi.json();
        return administrador;
      }
    } catch (err) {
      geraAlerta(err.message, "Erro");
      if (err.erro) {
        console.error(err.erro);
      }
    }
  }
}
async function preencherFormsComDadosDoUser() {
  const fotoPerfil = document.querySelector("#fotoPerfil");
  const nome = document.querySelector("#nome");
  const email = document.querySelector("#email");

  let user;
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.tipo === "adm") {
    user = await getAdministrador();
  } else if (payload.tipo === "resp") {
    user = await getResponsavel();
  } else {
    window.location.assign("../../login.html");
  }

  nome.value = user.nome;
  email.value = user.email;

  if (user.fotoPerfil) {
    fotoPerfil.style.backgroundImage = `url("${user.fotoPerfil}")'`;
    fotoPerfil.style.backgroundSize = "cover"; // Ajuste o tamanho conforme necessário
    fotoPerfil.style.backgroundPosition = "center"; // Centralize a imagem
    fotoPerfil.style.backgroundRepeat = "no-repeat";
  }
}
function pegarImagem(event) {
  const arquivo = event.target;
  const formData = new FormData();

  formData.append("image", arquivo.files[0]);

  exibirParaOUserAImagemSubmetida(arquivo.files[0]);
}
function exibirParaOUserAImagemSubmetida(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const imageContainer = document.getElementById("fotoPerfil");
    imageContainer.style.backgroundImage = `url('${imageUrl}')`;
    // Outras manipulações de estilo, se necessário
  };

  reader.readAsDataURL(file);
}
