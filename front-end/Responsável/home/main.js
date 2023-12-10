const baseUrl = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", paginaCarregou());

async function paginaCarregou() {
  verificaUsuario();
  preencherNomeUsuario();
  await preencherTotais();
}
function geraErro(texto) {
  const alert = document.querySelector("div#anuncioDeErro");
  alert.classList.remove("d-none");
  alert.classList.add("d-flex");
  const text = document.querySelector("strong#textoDoErro");
  text.innerHTML = `${texto}`;
}
function fecharAlert() {
  const alert = document.querySelector("div#anuncioDeErro");
  alert.classList.add("d-none");
  alert.classList.remove("d-flex");
}
function verificaUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const dataAtual = new Date();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const dataExpiracaoToken = new Date(payload.exp * 1000);

  if (payload.tipo != "resp") {
    window.location.assign("../../login.html");
  } else if (dataExpiracaoToken < dataAtual) {
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
    //Total de livro
    const respostaApiTotalLivros = await fetch(`${baseUrl}/listarLivros`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!respostaApiTotalLivros.ok) {
      const messageTotalLivros = await respostaApiTotalLivros.json();
      console.error(messageTotalLivros.erro);
      geraErro(messageTotalLivros.message);
    } else {
      const livros = await respostaApiTotalLivros.json();
      totalLivrosCadastrados.innerHTML = livros.length;
    }

    //Empréstimos Ativos
    const respostaApiTotalEmprestimosAtivos = await fetch(
      `${baseUrl}/listarEmprestimosAtivos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!respostaApiTotalEmprestimosAtivos.ok) {
      const messageTotalEmprestimosAtivos =
        await respostaApiTotalEmprestimosAtivos.json();
      console.error(messageTotalEmprestimosAtivos.erro);
      geraErro(messageTotalEmprestimosAtivos.message);
    } else {
      const emprestimosAtivos = await respostaApiTotalEmprestimosAtivos.json();
      totalEmprestimosAtivos.innerHTML = emprestimosAtivos.length;
    }

    //Livros atrasados
    const respostaApiTotalEmprestimosAtrasados = await fetch(
      `${baseUrl}/listarEmprestimosAtrasados`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!respostaApiTotalEmprestimosAtrasados.ok) {
      const messageTotalEmprestimosAtrasados =
        await respostaApiTotalEmprestimosAtrasados.json();
      console.error(messageTotalEmprestimosAtrasados.erro);
      geraErro(messageTotalEmprestimosAtrasados.message);
    } else {
      const emprestimosAtrasados =
        await respostaApiTotalEmprestimosAtrasados.json();
      totalLivrosAtrasados.innerHTML = emprestimosAtrasados.length;
    }

    //Todos os empréstimos já feitos
    const respostaApiTotalEmprestimos = await fetch(
      `${baseUrl}/listarTodosOsEmprestimos`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!respostaApiTotalEmprestimos.ok) {
      const messageTotalEmprestimos = await respostaApiTotalEmprestimos.json();
      console.error(messageTotalEmprestimos.erro);
      geraErro(messageTotalEmprestimos.message);
    } else {
      const emprestimos = await respostaApiTotalEmprestimos.json();
      totalEmprestimos.innerHTML = emprestimos.length;
    }
  } catch (err) {
    console.error(err.erro);
    geraErro(err.message);
  }
}
function preencherNomeUsuario() {
  const token = localStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));

  const nome = document.querySelector("p#nomeUser");
  nome.innerHTML += `${payload.nome}`;
}
function sair() {
  // Remove uma variável específica do localStorage
  localStorage.removeItem("token");
  // Recarregar a página atual
  verificaUsuario();
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
