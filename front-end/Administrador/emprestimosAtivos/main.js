const token = localStorage.getItem('token')
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

async function getEmprestimosAtivos(){
    try{
        const respostaApi = await fetch("http://localhost:3000/listarEmprestimosAtivos", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
        })
        if(emprestimos.message){
            alert(emprestimos.message)
        }
        const emprestimos = await respostaApi.json()
    }catch(err){
        console.error(err.erro)
        alert(err.message)
    }
}