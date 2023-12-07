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
function fecharAlert() {
  const alerta = document.querySelector("div#alerta");
  alerta.classList.add("d-none");
  alerta.classList.remove("d-flex");
}
const sugestoesDiv = document.getElementById("sugestoes");
const barraPesquisa = document.getElementById("barraPesquisa");

function exibirSugestoes(sugestoes) {
  sugestoesDiv.innerHTML = "";

  if (sugestoes.length > 0) {
    for (let livro of sugestoes) {
      sugestoesDiv.innerHTML += `<li onclick="selecionarSugestao('${livro.titulo}')">${livro.titulo} - ${livro.autor}</li>`;
    }

    sugestoesDiv.style.display = "block";
  } else {
    sugestoesDiv.style.display = "none";
  }
}
async function buscarSugestoes() {
  const termoPesquisa = barraPesquisa.value;
  if (termoPesquisa != "") {
    try {
      const respostaApi = await fetch(
        `http://localhost:3000/buscarLivros?palavra=${termoPesquisa}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sugestoes = await respostaApi.json();
      exibirSugestoes(sugestoes);
    } catch (err) {
      console.error(err.erro);
      geraAlerta(err.message);
    }
  } else {
    const sugestoesDiv = document.getElementById("sugestoes");
    sugestoesDiv.innerHTML = "";
  }
}
function selecionarSugestao(sugestao) {
  barraPesquisa.value = sugestao;
  sugestoesDiv.style.display = "none";
}
async function adicionarCopia() {
  const tituloDoLivro = document.querySelector("input#barraPesquisa").value;
  if (tituloDoLivro === "") {
    geraAlerta("Preencha o Nome do Livro", "Atencao");
  } else {
    try {
      const respostaApi = await fetch(`http://localhost:3000/adicionarCopia`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: tituloDoLivro }),
      });
      if (!respostaApi.ok) {
        const mensagemDeErro = await respostaApi.json();
        console.log(mensagemDeErro.erro);
        geraAlerta(mensagemDeErro.message, "Erro");
      } else {
        const numeroDaCopia = await respostaApi.json();
        geraAlerta(
          `O número de identificação do livro é: ${numeroDaCopia.numero}`,
          "AnuncioDeSucesso"
        );
      }
    } catch (err) {
      console.error(err.erro);
      geraAlerta(err.message, "Erro");
    }
  }
}
