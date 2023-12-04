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
function geraAlerta(texto, alerta = 'Erro') {
    let alert
    let text
    switch(alerta){
        case 'Erro':
            alert = document.querySelector("div#anuncioDeErro")
            text = document.querySelector('strong#textoDoErro')
            break
        case 'NovaCopia':
            alert = document.querySelector("div#anuncioDeNovaCopia")
            text = document.querySelector('strong#textoDoAnuncio')
            break
    }
    alert.classList.remove('d-none')
    alert.classList.add('d-flex')
    
    text.innerHTML = `${texto}`;
}
function fecharAlert(alertaParaFechar = 'Erro'){
    let alert
    switch(alertaParaFechar){
        case 'Erro':
            alert = document.querySelector("div#anuncioDeErro");
            break
        case 'AnuncioDeNovaCopia':
            alert = document.querySelector("div#anuncioDeNovaCopia");
            break
    }
    
    alert.classList.add('d-none')
    alert.classList.remove('d-flex')
    location.reload()
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
            const sugestoes = await respostaApi.json()
            exibirSugestoes(sugestoes);
        }catch(err){
            console.error(err.erro)
            geraAlerta(err.message)
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
    if(tituloDoLivro === ""){
        geraAlerta('Preencha o Nome do Livro')
    }else{
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
                const mensagemDeErro = await respostaApi.json()
                console.log(mensagemDeErro.erro)
                geraAlerta(mensagemDeErro.message)
            }else{
                const numeroDaCopia = await respostaApi.json()
                geraAlerta(`O número de identificação do livro é: ${numeroDaCopia.numero}`, 'NovaCopia')
            }
        }catch(err){
            console.error(err.erro)
            geraErro(err.message)
        }
    }
    
}