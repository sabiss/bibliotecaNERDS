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
function formatarTexto(input) {
  const textoDigitado = input.value;
  const palavras = textoDigitado.split(" ");

  const palavrasFormatadas = palavras.map((palavra) => {
    if (palavra.length > 0) {
      return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    } else {
      return "";
    }
  });

  return palavrasFormatadas.join(" ");
}
async function cadastrarNovoLivro() {
  const titulo = formatarTexto(document.querySelector("input#tituloLivro"));
  const autor = formatarTexto(document.querySelector("input#nomeAutor"));
  const isbn = document.querySelector("input#isbn").value;
  const numeroPaginas = document.querySelector("input#numeroPaginas").value;
  const genero = formatarTexto(
    document.querySelector("select#generoLiterario")
  );

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
      body: JSON.stringify({
        titulo: titulo,
        autor: autor,
        isbn: isbn,
        numero_paginas: numeroPaginas,
        genero: genero,
      }),
    });
    const resposta = await retornoApi.json();

    fechaModal("modalCadastroLivro");
    alert(resposta.message);
    location.reload(true);
  } catch (err) {
    return alert(`Erro ao cadastrar livro - ${err.message}`);
  }
}
async function devolucao() {
  const nomeLivro = document.querySelector("input#livroDevolucao").value;
  const cpf = document.querySelector("input#cpfAlunoDevolucao");
  const numeroDaCopia = document.querySelector("input#numeroCopia");
}

function fechaModal(modalEspecifico) {
  //fecha os modais de formulários
  modalParaFechar = document.querySelector(`#${modalEspecifico}`);
  const modal = bootstrap.Modal.getInstance(modalParaFechar);
  modal.hide();
}
function sair() {
  // Remove uma variável específica do localStorage
  localStorage.removeItem("token");
  // Recarregar a página atual
  location.reload(true);
}
function cpf(input) {
  let valor = input.value;

  // Remove caracteres não numéricos
  valor = valor.replace(/\D/g, "");
  if (valor.length > 11) {
    valor = valor.substring(0, 11);
  }
  // Aplica a máscara de CPF
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  // Define o valor formatado de volta no campo
  input.value = valor;
}
