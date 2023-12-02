const token = localStorage.getItem('token')
document.addEventListener("DOMContentLoaded", paginaCarregou());

async function paginaCarregou(){
    verificaUsuario()
    await preencherTabela()
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

async function getEmprestimosAtivos(){
    try{
        const respostaApi = await fetch("http://localhost:3000/listarEmprestimosAtivos", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
        })
        if(!respostaApi.ok){
            const tr = document.querySelector("tr")
            const message = await respostaApi.json()
            tr.innerHTML = `<th>${message.message}</th>`
        }
        const emprestimos = await respostaApi.json()
        return emprestimos
    }catch(err){
        console.error(err.erro)
        alert(err.message)
    }
}

async function preencherTabela(){
    const emprestimos = await getEmprestimosAtivos()
    const tbody = document.querySelector("tbody")
    tbody.innerHTML = ""
    for(let emprestimo of emprestimos){
        tbody.innerHTML += `
            <tr>
                <th>${emprestimo.nomeUsuario}</th>
                <th>${emprestimo.cpf}</th>
                <th>${emprestimo.tituloLivro}</th>
                <th>${emprestimo.numeroDaCopia}</th>
                <th>${emprestimo.dataEmprestimo}</th>
                <th>${emprestimo.dataDevolucao}</th>
            </tr>
        `
    }
}
function exibirSugestoes(emprestimos){
    const tbody = document.querySelector("tbody")
    tbody.innerHTML = ""
    for(let emprestimo of emprestimos){
        tbody.innerHTML += `
            <tr>
                <th>${emprestimo.nomeUsuario}</th>
                <th>${emprestimo.cpf}</th>
                <th>${emprestimo.tituloLivro}</th>
                <th>${emprestimo.numeroDaCopia}</th>
                <th>${emprestimo.dataEmprestimo}</th>
                <th>${emprestimo.dataDevolucao}</th>
            </tr>
        `
    }
}
async function buscarEmprestimo(){
    const palavraNaBarraDePesquisa = document.querySelector("input#barraDePesquisa").value
    try{
        const respostaApi = await fetch(`http://localhost:3000/buscarEmprestimos?palavra=${palavraNaBarraDePesquisa}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        if(!respostaApi.ok){
            const mensagem = await respostaApi.json()
            alert(mensagem.message)
        }
        const sugestoes = await respostaApi.json()
        exibirSugestoes(sugestoes)
    }catch(err){
        console.error(err)
        alert("Erro ao buscar por empréstimos")
    }
}