document.addEventListener('DOMContentLoaded', paginaCarregou);
const token = localStorage.getItem("token");

async function paginaCarregou() {
    verificarToken()
    await criarCards()
}
async function criarCards(){
    const tableRow = document.querySelector('tbody.listaLivros')
    tableRow.innerHTML = ""
    let livros = await getLivros()
    
    if(livros.length == 0){
        alert(livros.message)
    }
    let numeroCopias
    for(let livro of livros){
        try{
            numeroCopias = await getTotalCopiasDeUmLivro(livro._id)
        }catch(err){
            console.error(err.message)
            alert("erro ao listar total de cópias")
        }
        tableRow.innerHTML += `
            <tr>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${numeroCopias}</td>
            </tr>
        `
    }
}
async function criarCardsDeLivrosEspecificos(livros){
    const tableRow = document.querySelector('tbody.listaLivros')

    tableRow.innerHTML=""
    let numeroCopias
    for(let livro of livros){
        try{
            numeroCopias = await getTotalCopiasDeUmLivro(livro._id)
        }catch(err){
            console.error(err.message)
            alert("erro ao listar total de cópias")
        }
        tableRow.innerHTML += `
            <tr>
                <td>${livro.titulo}</td>
                <td>${livro.autor}</td>
                <td>${numeroCopias}</td>
                <td>${livro.numero_paginas}</td>
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
        console.error(err.message)
        alert("Erro ao listar livros")
    }
}
async function getTotalCopiasDeUmLivro(idLivro){
    try{
        const respostaApi = await fetch(`http://localhost:3000/listarCopias/${idLivro}`, {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
        })
        const copias = await respostaApi.json()
        return copias.length
    }catch(err){
        console.error(err.message)
        alert("erro ao listar total de cópias dos livros")
    }
}
async function buscarLivros(){
    const filtro = document.querySelector("input#palavra").value
    if(filtro === ""){
        await criarCards()
    }else{
        try{
            const respostaApi = await fetch(`http://localhost:3000/buscarLivros?palavra=${filtro}`, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }})
            const livros = await respostaApi.json()
            await criarCardsDeLivrosEspecificos(livros)
        }catch(err){
            alert(err.message)
            console.error(err.erro)
        }
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
