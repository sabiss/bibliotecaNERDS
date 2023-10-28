const baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", paginaCarregou());

function paginaCarregou() {
  verificaUsuario();
  preencherTotais();
}

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

function abreFechaMenu() {
  const avatarOptions = document.getElementById("avatar-options");
  const visivel = getComputedStyle(avatarOptions).display !== "none";

  // Alterna a visibilidade da lista de opções
  if (visivel) {
    avatarOptions.style.display = "none";
  } else {
    avatarOptions.style.display = "block";
  }
}

async function preencherTotais() {
  const totalLivrosAtrasados = document.querySelector("#totalAtrasados");
  const totalEmprestimosAtivos = document.querySelector("#totalAtivos");
  const totalLivrosCadastrados = document.querySelector("#totalCadastrados");
  const totalEmprestimos = document.querySelector("#totalEmprestados");

  const token = localStorage.getItem("token");

  try {
    const retornoApi = await fetch(`${baseUrl}/listarTotais`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const totais = await retornoApi.json();

    totalEmprestimosAtivos.innerHTML = totais.totalEmprestimoAtivos;
    totalLivrosCadastrados.innerHTML = totais.totalLivrosCadastrados;
    totalEmprestimos.innerHTML = totais.totalEmprestados;
  } catch (err) {
    alert(
      `Ocorreu um Erro ao listar os totais de livros e emprestimos- ${err}`
    );
  }
}

async function cadastrarNovoLivro() {
  const titulo = document.querySelector("input#tituloLivro").value;
  const autor = document.querySelector("input#nomeAutor").value;
  const isbn = document.querySelector("input#isbn").value;
  const numero_paginas = document.querySelector("input#numeroPaginas").value;
  const genero = document.querySelector("select#generoLiterario").value;

  if (!titulo || !autor || !isbn || !numeroPaginas || !genero) {
    return alert("Preencha todos os campos");
  }

  const token = localStorage.getItem("token");

  try {
    const retornoApi = await fetch(`${baseUrl}/cadastrarLivro`, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo, autor, isbn, numero_paginas, genero }),
    });
    const resposta = await retornoApi.json();

    fechaModal("modalCadastroLivro");
    alert(resposta.message);
    location.reload(true);
  } catch (err) {
    return alert(`Erro ao cadastrar livro - ${err.message}`);
  }
}
function sair() {
  // Remove uma variável específica do localStorage
  localStorage.removeItem("token");
  // Recarregar a página atual
  location.reload(true);
}

function fechaModal(modalEspecifico) {
  //fecha os modais de formulários
  modalParaFechar = document.querySelector(`#${modalEspecifico}`);
  const modal = bootstrap.Modal.getInstance(modalParaFechar);
  modal.hide();
}
