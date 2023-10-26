//verifica ao carregar a página se o usuário realmente é um adm
document.addEventListener("DOMContentLoaded", paginaCarregou());

function paginaCarregou() {
  verificaNivelDoUsuario();
  preencherTotais();
}

function verificaNivelDoUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.tipo != "adm") {
    window.location.assign("../../login.html");
  }
  preencherTotais();
}

//para o funcionamente da lista de opções ao clicar no avatar
const avatarImg = document.getElementById("avatar-img");
const avatarOptions = document.getElementById("avatar-options");

// Adiciona um ouvinte de evento de clique à imagem
avatarImg.addEventListener("click", function () {
  // Verifica se a lista de opções está visível
  const visivel = getComputedStyle(avatarOptions).display !== "none";

  // Alterna a visibilidade da lista de opções
  if (visivel) {
    avatarOptions.style.display = "none";
  } else {
    avatarOptions.style.display = "block";
  }
});
async function preencherTotais() {
  const totalLivrosAtrasados = document.querySelector("#totalAtrasados");
  const totalEmprestimosAtivos = document.querySelector("#totalAtivos");
  const totalLivrosCadastrados = document.querySelector("#totalCadastrados");
  const totalEmprestimos = document.querySelector("#totalEmprestados");

  const token = localStorage.getItem("token");

  try {
    const retornoApi = await fetch("http://localhost:3000/listarTotais", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const totais = await retornoApi.json();
    console.log(totais);
    totalEmprestimosAtivos.innerHTML = totais.totalEmprestimoAtivos;
    totalLivrosCadastrados.innerHTML = totais.totalLivrosCadastrados;
    totalEmprestimos.innerHTML = totais.totalEmprestados;
  } catch (err) {
    // alert(`Ocorreu um Erro - ${err}`);
  }
}
function sair() {
  // Remove uma variável específica do localStorage
  localStorage.removeItem("token");
  // Recarregar a página atual
  location.reload(true);
}
