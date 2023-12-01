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
const barraPesquisa = document.getElementById('tituloLivro');

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
            const sugestoes = await respostaApi.json()
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
function formatarCpf(event) {
    let cpf = event.target.value;
    
    // Remove qualquer caractere que não seja número
    cpf = cpf.replace(/\D/g, '');

    // Adiciona a máscara de CPF dinamicamente
    if (cpf.length <= 3) {
        cpf = cpf.replace(/(\d{1,3})/, '$1');
    } else if (cpf.length <= 6) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    // Atualiza o valor do campo
    event.target.value = cpf;
};
async function realizarEmprestimo(){
    const cpf = document.querySelector("input#cpf").value
    const tituloDoLivro = document.querySelector('input#tituloLivro').value
    const numeroDaCopia = document.querySelector('input#numeroCopia').value
    const dataEmprestimo = document.querySelector('input#dataEmprestimo').value
    const dataDevolucao = document.querySelector('input#dataDevolucao').value

    try{
        const respostaApi = await fetch('http://localhost:3000/emprestarLivro', {
            method: 'POST',
            mode: "cors",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(tituloDoLivro, cpf, numeroDaCopia, dataEmprestimo, dataDevolucao)
        })
        if(!respostaApi.ok){
            alert(respostaApi.message)
        }
        const mensagem = await respostaApi.json()
        alert(mensagem.mensagem)
    }catch(err){
        alert(err)
    }
    
}