document.addEventListener("DOMContentLoaded", paginaCarregou);
const token = localStorage.getItem("token");

async function paginaCarregou() {
  verificarToken();
  await criarTr();
}
async function verificarToken() {
  const token = localStorage.getItem("token");

  if (token) {
    //tem token
    const payload = JSON.parse(atob(token.split(".")[1]));
    const dataAtual = new Date();
    const dataExpiracaoToken = new Date(payload.exp * 1000);

    if (
      payload.tipo != "adm" ||
      payload.tipo != "resp" ||
      dataAtual > dataExpiracaoToken
    ) {
      window.location.assign("../../login.html");
    }
  } else {
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
async function getLivros() {
  try {
    const respostaApi = await fetch("http://localhost:3000/listarLivros", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const livros = await respostaApi.json();
    return livros;
  } catch (err) {
    console.error(err.erro);
    geraAlerta(err.message, "Erro");
  }
}
async function criarTr() {
  const tbody = document.querySelector("tbody.listaLivros");
  tbody.innerHTML = "";
  let livros = await getLivros();

  if (livros.length === 0) {
    tbody.innerHTML = `
            <tr>
                <th>Nenhum empréstimo realizado</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
            </tr>
        `;
  } else {
    let numeroCopias;
    for (let livro of livros) {
      numeroCopias = await getCopiasDeUmLivro(livro._id);
      tbody.innerHTML += `
                <tr>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${numeroCopias.length}</td>
                    <td>${livro.numero_paginas}</td>
                    <td onclick="preencherInputsParaEdicao('${livro._id}')" data-bs-toggle="modal" data-bs-target="#exampleModal"><div class="editar iconesAcao"><img src="../../assets/lapisEdicao.png"></div></td>
                    <td onclick= "remover('${livro._id}')"><div class = "iconesAcao remover"><img src="../../assets/lixo.png"></div></td>
                </tr>
            `;
    }
  }
}
async function exibirSugestoes(livros) {
  const tableRow = document.querySelector("tbody.listaLivros");
  tableRow.innerHTML = "";
  if (livros.length === 0) {
    tableRow.innerHTML += `
        <tr>
            <td>Nenhum Livro Foi Cadastrado Ainda Com Esses Caracteres</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        `;
  }

  for (let livro of livros) {
    const numeroCopias = await getCopiasDeUmLivro(livro._id);
    tableRow.innerHTML += `
      <tr>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${numeroCopias.length}</td>
        <td>${livro.numero_paginas}</td>
        <td onclick="preencherInputsParaEdicao('${livro._id}')" data-bs-toggle="modal" data-bs-target="#exampleModal"><div class="editar iconesAcao"><img src="../../assets/lapisEdicao.png"></div></td>
        <td onclick= "remover('${livro._id}')"><div class = "iconesAcao remover"><img src="../../assets/lixo.png"></div></td>
      </tr> 
    `;
  }
}
async function buscarLivro() {
  const palavraNaBarraDePesquisa = document.querySelector(
    "input#barraDePesquisa"
  ).value;
  if (palavraNaBarraDePesquisa === "") {
    await criarTr();
  } else {
    const livros = await getLivros();
    const livrosSemelhantes = buscarPalavraNosLivros(
      livros,
      palavraNaBarraDePesquisa
    );
    exibirSugestoes(livrosSemelhantes);
  }
}
function removerAcentos(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function buscarPalavraNosLivros(arrayDeObjetos, palavra) {
  const regexComAcento = new RegExp(`.*${palavra}.*`, "i");
  const regexSemAcento = new RegExp(`.*${removerAcentos(palavra)}.*`, "i");

  const objetosEncontrados = arrayDeObjetos.filter((objeto) => {
    return (
      objeto &&
      typeof objeto === "object" &&
      Object.values(objeto).some((valor) => {
        return (
          regexComAcento.test(String(valor)) ||
          regexSemAcento.test(removerAcentos(String(valor)))
        );
      })
    );
  });

  return objetosEncontrados;
}
let idLivroParaAtualizar;
async function preencherInputsParaEdicao(idLivro) {
  idLivroParaAtualizar = idLivro;
  const titulo = document.querySelector("#novoTitulo");
  const autor = document.querySelector("#novoAutor");
  const isbn = document.querySelector("#novoISBN");
  const numeroPaginas = document.querySelector("#novoNumeroDePaginas");
  const genero = document.querySelector("#novoGenero");

  try {
    const respostaApi = await fetch(
      `http://localhost:3000/listarUmLivro/${idLivro}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (respostaApi.ok) {
      const dadosDoLivro = await respostaApi.json();
      console.log(dadosDoLivro);
      titulo.value = dadosDoLivro.titulo;
      autor.value = dadosDoLivro.autor;
      isbn.value = dadosDoLivro.isbn;
      numeroPaginas.value = dadosDoLivro.numero_paginas;
      genero.value = dadosDoLivro.genero;
    }
  } catch (err) {
    console.error(err.erro);
    geraAlerta(err.message, "Erro");
  }
}
function formatarPalavras(palavra) {
  const palavras = palavra.split(" ");

  for (let i = 0; i < palavras.length; i++) {
    palavras[i] = palavras[i][0].toUpperCase() + palavras[i].substr(1);
  }

  return palavras.join(" ");
}
async function atualizarLivro() {
  const novoTitulo = formatarPalavras(
    document.querySelector("#novoTitulo").value
  );
  const novoAutor = formatarPalavras(
    document.querySelector("#novoAutor").value
  );
  const novoISBN = document.querySelector("#novoISBN").value;
  const novoNumeroDePaginas = document.querySelector(
    "#novoNumeroDePaginas"
  ).value;
  const novoGenero = document.querySelector("#novoGenero").value;

  try {
    const respostaApi = await fetch(
      `http://localhost:3000/atualizarLivro/${idLivroParaAtualizar}`,
      {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          novoTitulo,
          novoAutor,
          novoISBN,
          novoNumeroDePaginas,
          novoGenero,
        }),
      }
    );
    const mensagem = await respostaApi.json();
    if (!respostaApi.ok) {
      console.error(mensagem.erro);
      geraAlerta(mensagem.message, "Erro");
    } else {
      geraAlerta(mensagem.message, "AnuncioDeSucesso");
      await criarTr();
    }
  } catch (err) {
    geraAlerta("Erro ao atualizar livro", "Erro");
  }
}
async function getCopiasDeUmLivro(idLivro) {
  try {
    const respostaApi = await fetch(
      `http://localhost:3000/listarCopias/${idLivro}`,
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
      console.error(mensagem.erro);
      geraAlerta(mensagem.message, "Erro");
    }
    const copias = await respostaApi.json();
    return copias;
  } catch (err) {
    console.error(err.erro);
    geraAlerta(err.message, "Erro");
  }
}
async function getLivros() {
  try {
    const respostaApi = await fetch("http://localhost:3000/listarLivros", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!respostaApi.ok) {
      const mensagem = await respostaApi.json();
      geraAlerta(mensagem.message, "Erro");
    }

    const livros = await respostaApi.json();
    return livros;
  } catch (err) {
    console.error(err.erro);
    geraAlerta(err.message, "Erro");
  }
}
async function remover(idLivro) {
  try {
    const respostaApi = await fetch(
      `http://localhost:3000/deletarLivro/${idLivro}`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (respostaApi.ok) {
      const mensagem = await respostaApi.json();
      geraAlerta(mensagem.message, "AnuncioDeSucesso");
      await criarTr();
    }
  } catch (err) {
    if (err.erro) {
      console.error(err.erro);
    } else {
      console.error(err);
    }
    geraAlerta(err.message, "Erro");
  }
}
