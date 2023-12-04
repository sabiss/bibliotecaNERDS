document.addEventListener('DOMContentLoaded', paginaCarregou);
const token = localStorage.getItem("token");

async function paginaCarregou() {
    verificarToken()
    await criarCards()
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
}
async function criarCards(){
    const tbody = document.querySelector('tbody.listaLivros')
    tbody.innerHTML = ""
    let livros = await getLivros()
    
    if(livros.length === 0){
        tbody.innerHTML = `
            <tr>
                <th>Nenhum empréstimo realizado</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
            </tr>
        `
    }else{
        let numeroCopias
        for(let livro of livros){
            console.log(livro)
            try{
                numeroCopias = await getCopiasDeUmLivro(livro._id)
            }catch(err){
                console.error(err.message)
                alert("erro ao listar total de cópias")
            }
            tbody.innerHTML += `
                <tr>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${numeroCopias.length}</td>
                    <td>${livro.numero_paginas}</td>
                </tr>
            `
        }
    }
}
async function exibirSugestoes(livros){
    const tableRow = document.querySelector('tbody.listaLivros')
    tableRow.innerHTML=""
    if(livros.length === 0){
        tableRow.innerHTML += `
        <tr>
            <td>Nenhum Livro Foi Cadastrado Ainda Com Esses Caracteres</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        `
    }
    
    for(let livro of livros){
        tableRow.innerHTML += `
            <tr>
                <td>${livro.livro.titulo}</td>
                <td>${livro.livro.autor}</td>
                <td>${livro.numeroDeCopias}</td>
                <td>${livro.livro.numero_paginas}</td>
            </tr>
        `
    }
}
async function getLivros(){
    try{
        const respostaApi = await fetch('http://localhost:3000/listarLivros', {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
        })
        const livros = await respostaApi.json()
        return livros
    }catch(err){
        console.error(err.erro)
        geraErro(err.message)
    }
}
async function getCopiasDeUmLivro(idLivro){
    try{
        const respostaApi = await fetch(`http://localhost:3000/listarCopias/${idLivro}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
        })
        if(!respostaApi.ok){
            const mensagem = await respostaApi.json()
            console.erro(mensagem.erro)
            geraErro(mensagem.message)
        }
        const copias = await respostaApi.json()
        return copias
    }catch(err){
        console.error(err.erro)
        geraErro(err.message)
    }
}
async function buscarLivros(){
    const filtro = document.querySelector("input#palavra").value
    if(filtro === ""){
        await criarCards()
    }
    try{
        const respostaApi = await fetch(`http://localhost:3000/buscarLivros?palavra=${filtro}`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }})
        if(!respostaApi.ok){
            const mensagem = await respostaApi.json()
            console.error(mensagem.erro)
            alert(mensagem.message)
        }
        const livros = await respostaApi.json()
        const livrosComQuantidadeDeCopias = []

        for(let livro of livros){
            const copias = await getCopiasDeUmLivro(livro._id) 
            livrosComQuantidadeDeCopias.push({livro, numeroDeCopias: copias.length})
        }

        exibirSugestoes(livrosComQuantidadeDeCopias)
    }catch(err){
        geraErro(err.message)
        console.error(err.erro)
    }
}
async function getLivros(){
    try{
        const respostaApi = await fetch('http://localhost:3000/listarLivros',{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        if(!respostaApi.ok){
            const mensagem = await respostaApi.json()
            alert(mensagem.message)
        }

        const livros = await respostaApi.json()
        return livros
    }catch(err){
        console.error(err.erro)
        geraErro(err.message)
    }
}
async function verificarToken(){
    const token = localStorage.getItem("token");

    if (token) {
        //tem token
        const payload = JSON.parse(atob(token.split(".")[1]));
        const dataAtual = new Date();
        const dataExpiracaoToken = new Date(payload.exp * 1000);

        if (dataAtual > dataExpiracaoToken) {
            window.location.assign('../../login.html')    
        }
    }else{
        window.location.assign('../../login.html')
    }
}
