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
function fecharAlert() {
  const alerta = document.querySelector("div#alerta");
  alerta.classList.add("d-none");
  alerta.classList.remove("d-flex");
  location.reload();
}
const sugestoesDiv = document.getElementById("sugestoes");
const barraPesquisa = document.getElementById("tituloLivro");

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
      geraErro(err.message);
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
function formatarCpf(event) {
  let cpf = event.target.value;

  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, "");

  // Adiciona a máscara de CPF dinamicamente
  if (cpf.length <= 3) {
    cpf = cpf.replace(/(\d{1,3})/, "$1");
  } else if (cpf.length <= 6) {
    cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  } else if (cpf.length <= 9) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  }

  // Atualiza o valor do campo
  event.target.value = cpf;
}

function formatarDataParaString(data) {
  const ano = data.getFullYear();
  const mes = (data.getMonth() + 1).toString().padStart(2, "0"); // adiciona zero à esquerda se for necessário
  const dia = data.getDate().toString().padStart(2, "0"); // adiciona zero à esquerda se for necessário

  return `${ano}-${mes}-${dia}`;
}
async function realizarEmprestimo() {
  const cpf = document.querySelector("input#cpf").value;
  const tituloDoLivro = document.querySelector("input#tituloLivro").value;
  const numeroDaCopia = document.querySelector("input#numeroCopia").value;
  const devolucao = document.querySelector("input#dataDevolucao").value;

  if (
    cpf == "" ||
    tituloDoLivro == "" ||
    numeroDaCopia == "" ||
    devolucao == ""
  ) {
    geraAlerta("Preencha todos os campos do formulário", "Atencao");
  } else {
    const hoje = new Date();
    const dataDevolucao = new Date(devolucao);

    if (dataDevolucao.getTime() <= hoje.getTime()) {
      geraAlerta("Insira uma data de devolução válida", "Atencao");
    } else {
      const emprestimo = {
        tituloDoLivro,
        cpf,
        numeroDaCopia,
        dataEmprestimo: formatarDataParaString(new Date()),
        dataDevolucao: devolucao,
      };
      try {
        const respostaApi = await fetch(
          "http://localhost:3000/emprestarLivro",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(emprestimo),
          }
        );
        const mensagem = await respostaApi.json();
        geraAlerta(mensagem.message, "AnuncioDeSucesso");
        setTimeout(function () {
          window.location.reload();
        }, 5000);
      } catch (err) {
        console.error(err.erro);
        geraAlerta(err.message, "Erro");
      }
    }
  }
}
