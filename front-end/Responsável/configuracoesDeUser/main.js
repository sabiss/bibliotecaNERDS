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
  abrirTelaDeLoading();
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
    const foto = await getFotoPerfil(user.fotoPerfil);
    fotoPerfil.style.background = `url("../../../uploads/${foto}") center/cover no-repeat`;
  } else {
    fotoPerfil.style.background =
      "url('../../assets/avatarGrande.png') center/cover no-repeat";
  }
  fecharTelaDeLoading();
}
function pegarImagem(event) {
  const arquivo = event.target;

  exibirParaOUserAImagemSubmetida(arquivo.files[0]);
}
let usuarioEnviouImagem = false;
function exibirParaOUserAImagemSubmetida(file) {
  usuarioEnviouImagem = true;
  const reader = new FileReader();

  reader.onload = function (e) {
    const imageUrl = e.target.result;
    const imageContainer = document.getElementById("fotoPerfil");
    imageContainer.style.backgroundImage = `url('${imageUrl}')`;
    // Outras manipulações de estilo, se necessário
  };

  reader.readAsDataURL(file);
}
async function editarDados() {
  abrirTelaDeLoading();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const senha = document.querySelector("#senha").value;
  const nome = document.querySelector("#nome").value;
  const email = document.querySelector("#email").value;

  if (!nome && !email && !senha) {
    geraAlerta(
      "A atualização não poderá ser com informações nulas. Digite algo",
      "Atencao"
    );
  } else {
    let respostaApi;
    if (payload.tipo === "adm") {
      try {
        respostaApi = await fetch("http://localhost:3000/editarDadosAdm", {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, email, senha, id: payload.id }),
        });
      } catch (error) {
        if (error.erro) {
          console.error(error.erro);
        }
        geraAlerta(error.message, "Erro");
      }
    } else {
      try {
        respostaApi = await fetch("http://localhost:3000/editarDadosResp", {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ nome, email, senha, id: payload.id }),
        });
      } catch (error) {
        if (error.erro) {
          console.error(error.erro);
        }
        geraAlerta(error.message, "Erro");
      }
    }
    const mensagem = await respostaApi.json();
    if (respostaApi.ok) {
      geraAlerta(
        `${mensagem.message}. Os novos dados passarão a ser exibidos quando você realizar login novamente`,
        "AnuncioDeSucesso"
      );
    } else {
      geraAlerta(mensagem.message, "Erro");
    }
  }
  await editarFoto();
  fecharTelaDeLoading();
}
async function removerFotoAntiga(usuario) {
  try {
    const respostaApi = await fetch(
      `http://localhost:3000/deletarFoto/${usuario.fotoPerfil}`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ src: usuario.fotoPerfil }),
      }
    );
    const mensagem = await respostaApi.json();
    if (!respostaApi.ok) {
      if (mensagem.erro) {
        console.error(mensagem.erro);
      }
      geraAlerta(mensagem.message, "Erro");
    }
  } catch (error) {
    if (error.erro) {
      console.error(error.erro);
    }
    geraAlerta(error.message, "Erro");
  }
}
async function salvarFotoNoBanco() {
  const foto = document.querySelector("input#inputImagem").files[0];
  const formData = new FormData();
  formData.append("file", foto);

  try {
    const respostaApi = await fetch("http://localhost:3000/adicionarFoto", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const foto = await respostaApi.json();

    if (respostaApi.ok) {
      return foto;
    } else {
      geraAlerta(foto.message, "Erro");
    }
  } catch (error) {
    geraAlerta(error.message, "Erro");
    if (error.erro) {
      console.error(error.erro);
    }
  }
}
async function atualizarFotoDePerfil(idUsuario, srcDaFoto) {
  try {
    const respostaApi = await fetch(
      "http://localhost:3000/atualizarFotoDePerfil",
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario, src: srcDaFoto }),
      }
    );
    const retorno = await respostaApi.json();

    if (respostaApi.ok) {
      geraAlerta(retorno.message, "AnuncioDeSucesso");
    } else {
      if (retorno.erro) {
        console.error(retorno.erro);
      }
      geraAlerta(retorno.message, "Erro");
    }
  } catch (error) {
    if (error.erro) {
      console.error(error.erro);
    }
    geraAlerta(error.message, "Erro");
  }
}
async function editarFoto() {
  try {
    if (usuarioEnviouImagem) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      let user;

      if (payload.tipo === "adm") {
        user = await getAdministrador();
      } else if (payload.tipo === "resp") {
        user = await getResponsavel();
      } else {
        window.location.assign("../../login.html");
      }

      if (user.fotoPerfil) {
        await removerFotoAntiga(user);
      }

      const foto = await salvarFotoNoBanco();
      if (foto) {
        const retorno = await atualizarFotoDePerfil(user._id, foto.src);
        geraAlerta(retorno.message, "AnuncioDeSucesso");
      }
    }
  } catch (error) {
    geraAlerta(error.message, "erro");
  }
}
async function getFotoPerfil(idFoto) {
  try {
    const respostaApi = await fetch(`http://localhost:3000/foto/${idFoto}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const foto = await respostaApi.json();

    if (respostaApi.ok) {
      return foto.nome;
    } else {
      geraAlerta(foto.message, "Erro");
    }
  } catch (error) {
    geraAlerta(error.message, "Erro");
  }
}
function abrirTelaDeLoading() {
  const telaDeLoading = document.querySelector("div#telaDeLoading");
  telaDeLoading.style.display = "flex";
}
function fecharTelaDeLoading() {
  const telaDeLoading = document.querySelector("div#telaDeLoading");
  telaDeLoading.style.display = "none";
}
