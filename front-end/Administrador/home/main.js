const baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", paginaCarregou());

async function paginaCarregou() {
  verificaUsuario();
  await preencherTotais();
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
function abreFechaMenu() {
  const avatarOptions = document.getElementById("avatar-options");
  const visivel = getComputedStyle(avatarOptions).display !== "none";

  // Alterna a visibilidade da lista de opções
  if (visivel) {
    avatarOptions.style.display = "none";
  } else {
    avatarOptions.style.display = "block";
  }
}
async function preencherTotais() {
  const totalLivrosAtrasados = document.querySelector("#totalAtrasados");
  const totalEmprestimosAtivos = document.querySelector("#totalAtivos");
  const totalLivrosCadastrados = document.querySelector("#totalCadastrados");
  const totalEmprestimos = document.querySelector("#totalEmprestados");

  const token = localStorage.getItem("token");

  try {
    const retornoApi = await fetch(`${baseUrl}/listarTotais`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const totais = await retornoApi.json();

    totalEmprestimosAtivos.innerHTML = totais.totalEmprestimoAtivos;
    totalLivrosCadastrados.innerHTML = totais.totalLivrosCadastrados;
    totalEmprestimos.innerHTML = totais.totalEmprestados;
  } catch (err) {
    alert(
      `Ocorreu um Erro ao listar os totais de livros e emprestimos- ${err}`
    );
  }
}
async function devolucao() {
  const nomeLivro = document.querySelector("input#livroDevolucao").value;
  const cpf = document.querySelector("input#cpfAlunoDevolucao").value;
  const numeroDaCopia = document.querySelector("input#numeroCopia").value;

  const token = localStorage.getItem("token");

  try {
    const retornoApi = await fetch(`${baseUrl}/registrarDevolucao`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nomeLivro, cpf, numeroDaCopia }),
    });

    const resposta = await retornoApi.json();
    alert(resposta.message);
  } catch (err) {
    alert(`${err}`);
  }
}
function fechaModal(modalEspecifico) {
  //fecha os modais de formulários
  modalParaFechar = document.querySelector(`#${modalEspecifico}`);
  const modal = bootstrap.Modal.getInstance(modalParaFechar);
  modal.hide();
}
function sair() {
  // Remove uma variável específica do localStorage
  localStorage.removeItem("token");
  // Recarregar a página atual
  location.reload(true);
}
function cpf(input) {
  let valor = input.value;

  // Remove caracteres não numéricos
  valor = valor.replace(/\D/g, "");
  if (valor.length > 11) {
    valor = valor.substring(0, 11);
  }
  // Aplica a máscara de CPF
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  // Define o valor formatado de volta no campo
  input.value = valor;
}
