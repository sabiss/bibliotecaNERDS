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
  
    if (payload.tipo != "adm" || dataExpiracaoToken < dataAtual) {
      window.location.assign("../../login.html");
    }
}

const sugestoesDiv = document.getElementById('sugestoes');
const barraPesquisa = document.getElementById('barraPesquisa');

function exibirSugestoes(sugestoes) {
    sugestoesDiv.innerHTML = '';

    if (sugestoes.length > 0) {
        for(let livro of sugestoes){
            sugestoesDiv.innerHTML+=
            `<li onclick="selecionarSugestao('${livro.titulo}')">${livro.titulo} - ${livro.autor}</li>`
        }

        sugestoesDiv.style.display = 'block';
    } else {
        sugestoesDiv.style.display = 'none';
    }
}
async function buscarSugestoes() {
    const termoPesquisa = barraPesquisa.value;
    if(termoPesquisa != ""){
        try{
            const respostaApi = await fetch(`http://localhost:3000/buscarLivros?palavra=${termoPesquisa}`, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                }})
            console.log(respostaApi)
            const sugestoes = await respostaApi.json()
            console.log(sugestoes)
            exibirSugestoes(sugestoes);
        }catch(err){
            console.error(err.erro)
            alert(err.message)
        }
    }else{
        const sugestoesDiv = document.getElementById('sugestoes');
        sugestoesDiv.innerHTML = ""
    }
    
}
function selecionarSugestao(sugestao) {
    barraPesquisa.value = sugestao;
    sugestoesDiv.style.display = 'none';
}
async function adicionarCopia(){
    const tituloDoLivro = document.querySelector('input#barraPesquisa').value
    try{
        const respostaApi = await fetch(`http://localhost:3000/adicionarCopia`, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({titulo: tituloDoLivro})
        })
        if(!respostaApi.ok){
            alert("Erro ao adicionar cópia")
        }
        const numeroDaCopia = await respostaApi.json()
        alert(`O número de identificação do livro é: ${numeroDaCopia.numero}`)
        window.location.assign("../home/index.html")
    }catch(err){
        console.error(err.erro)
        alert(err.message)
    }
}