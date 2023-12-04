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
function geraErro(texto) {
  const alert = document.querySelector("div#anuncioDeErro");
  alert.classList.remove('d-none')
  alert.classList.add('d-flex')
  const text = document.querySelector('strong#textoDoErro')
  text.innerHTML = `${texto}`;
}
function fecharAlert(){
  const alert = document.querySelector("div#anuncioDeErro");
  alert.classList.add('d-none')
  alert.classList.remove('d-flex')
  location.reload()
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
    geraErro("Preencha todos os campos");
  }else{
    const token = localStorage.getItem("token");
    const livro = {
      titulo: titulo,
      autor: autor,
      isbn: isbn,
      numero_paginas: numeroPaginas,
      genero: genero
    }
    try {
      const retornoApi = await fetch(`${baseUrl}/cadastrarLivro`, {
        method: 'POST',
        mode: "cors",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(livro)
      })
      const resposta = await retornoApi.json();
      geraErro(resposta.message);
      await criarCopia(titulo)
    } catch (err) {
      console.error(err.erro)
      geraErro(err.message);
    }
  }

  
}
async function criarCopia(titulo){
  const token = localStorage.getItem("token");

  try{
    const respostaApi = await fetch(`http://localhost:3000/adicionarCopia`, {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({titulo: titulo})
    })
    if(!respostaApi.ok){
      const mensagem = await respostaApi.json()
      console.error(mensagem.erro)
      geraErro(mensagem.message)
    }
    const numeroDaCopia = await respostaApi.json()
    alert(`O número de identificação do livro é: ${numeroDaCopia.numero}`)
  }catch(err){
    console.error(err.erro)
    geraErro(err.message)
  }
}