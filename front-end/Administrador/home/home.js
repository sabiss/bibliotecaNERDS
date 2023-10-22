//verifica ao carregar a página se o usuário realmente é um adm
document.addEventListener("DOMContentLoaded", verificaNivelDoUsuario);
function verificaNivelDoUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const payload = JSON.parse(atob(token.split(".")[1]));
  if (payload.tipo != "adm") {
    window.location.assign("../../login.html");
  }
}

//para o funcionamente da lista de opções ao clicar no avatar
const avatarImg = document.getElementById("avatar-img");
const avatarOptions = document.getElementById("avatar-options");

// Adiciona um ouvinte de evento de clique à imagem
avatarImg.addEventListener("click", function () {
  // Verifica se a lista de opções está visível
  const isVisible = getComputedStyle(avatarOptions).display !== "none";

  // Alterna a visibilidade da lista de opções
  if (isVisible) {
    avatarOptions.style.display = "none";
  } else {
    avatarOptions.style.display = "block";
  }
});

function sair() {
  // Remove uma variável específica do localStorage
  localStorage.removeItem("token");
  // Recarregar a página atual
  location.reload(true);
}
