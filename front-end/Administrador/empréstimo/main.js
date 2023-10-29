const baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", paginaCarregou());

function paginaCarregou() {
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

  if (payload.tipo != "adm" || dataExpiracaoToken < dataAtual) {
    window.location.assign("../../login.html");
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
  const genero = formatarTexto(document.querySelector("select#genero"));

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

    alert(resposta.message);
    window.location.assign("../home/index.html");
  } catch (err) {
    return alert(`Erro ao cadastrar livro - ${err.message}`);
  }
}
