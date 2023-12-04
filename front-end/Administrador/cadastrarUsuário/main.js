const token = localStorage.getItem("token");


document.getElementById('cpf').addEventListener('input', function (event) {
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
});
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
async function cadastrarNovoUsuario(){
    const nomeSemFormatacao = document.querySelector('input#nome').value
    const nome = capitalizarPalavras(nomeSemFormatacao)
    const email = document.querySelector('input#email').value
    const senha = document.querySelector('input#senha').value
    const cpf = document.querySelector('input#cpf').value

    if(nome === "" || email === "" || senha === "" || cpf === ""){
        geraErro("Preencha todos os campos do formulário")
    }else{
        const usuario = {
            email, senha, nome, cpf
        }
        try{
            const respostaApi = await fetch("http://localhost:3000/cadastroUser", {
                method: 'POST',
                mode: "cors",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(usuario)
            })
            const mensagem = await respostaApi.json()
            geraErro(mensagem.message)
            if(respostaApi.ok){
                location.reload()
            }
        }catch(err){
            console.error(err.erro)
            geraErro(err.message)
        }
    }
}
function capitalizarPalavras(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}
