document.addEventListener("DOMContentLoaded", paginaCarregou());

async function paginaCarregou() {
    verificaUsuario();
    await exibirEmprestimos()
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
async function exibirEmprestimos(){
    const emprestimosAtrasados = await getEmprestimosAtrasados()
    const tbody = document.querySelector('tbody')

    tbody.innerHTML=""

    for(let emprestimo of emprestimosAtrasados){
        tbody.innerHTML += `
            <tr>
                <th>${emprestimo.emprestimo.nomeUsuario}</th>
                <th>${emprestimo.emprestimo.cpf}</th>
                <th>${emprestimo.emprestimo.tituloLivro}</th>
                <th>#${emprestimo.emprestimo.numeroDaCopia}</th>
                <th>${emprestimo.atraso} ${emprestimo.atraso === 1? 'dia' : 'dias'}</th>
            </tr>
        `
    }
}
function exibirSugestoes(emprestimosSemelhantes){
    const tbody = document.querySelector('tbody')

    tbody.innerHTML=""

    for(let emprestimo of emprestimosSemelhantes){
        tbody.innerHTML += `
            <tr>
                <th>${emprestimo.emprestimo.nomeUsuario}</th>
                <th>${emprestimo.emprestimo.cpf}</th>
                <th>${emprestimo.emprestimo.tituloLivro}</th>
                <th>#${emprestimo.emprestimo.numeroDaCopia}</th>
                <th>${emprestimo.atraso} ${emprestimo.atraso === 1? 'dia' : 'dias'}</th>
            </tr>
        `
    }
}
async function getEmprestimosAtrasados(){
    const token = localStorage.getItem("token");
    try{
        const respostaApi = await fetch('http://localhost:3000/listarEmprestimosAtrasados', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        if(!respostaApi.ok){
            const message = await respostaApi.json()
            console.error(message.erro)
            alert(message.message)
        }

        const emprestimos = await respostaApi.json()
        return emprestimos
    }catch(err){
        console.error(err.erro)
        alert(err.message)
    }
}
async function buscarEmprestimoAtrasado(){
    const palavraNaBarraDePesquisa = document.querySelector('#palavra').value
    if(palavraNaBarraDePesquisa === ""){
        exibirEmprestimos()
    }else{
        try{
            const emprestimosAtrasados = await getEmprestimosAtrasados()
            const emprestimosSemelhantes = buscarPalavraNoEmprestimo(emprestimosAtrasados, palavraNaBarraDePesquisa)
            if(emprestimosSemelhantes.length === 0){
                const tbody = document.querySelector('tbody')

                tbody.innerHTML = `
                    <tr>
                        <th>Nenhum empréstimo econtrado</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                    </tr>
                `
            }else{
                exibirSugestoes(emprestimosSemelhantes)
            }
        }catch(err){
            console.error(err.erro)
            alert(err.message)
        }
    }
    
}
function buscarPalavraNoEmprestimo(arrayDeObjetos, palavra) {
    const regex = new RegExp(`.*${palavra}.*`, 'i');

    const objetosEncontrados = arrayDeObjetos.filter(objeto => {
        return (
        objeto.emprestimo &&
        typeof objeto.emprestimo === 'object' &&
        Object.values(objeto.emprestimo).some(valor => regex.test(String(valor)))
        );
    });

    return objetosEncontrados;
}
  