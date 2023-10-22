// document.addEventListener("DOMContentLoaded", minhaFuncao);
// function minhaFuncao() {
//   const token = localStorage.getItem("token");

//   const payload = JSON.parse(atob(token.split(".")[1]));

//   if (payload != "adm") {
//     window.location.assign("../../login.html");
//   }
// }

// Adicione um ouvinte de evento para o evento 'DOMContentLoaded'

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
