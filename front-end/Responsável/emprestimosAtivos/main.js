const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", paginaCarregou());

async function paginaCarregou() {
  verificaUsuario();
  await preencherTabela();
}
function verificaUsuario() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.assign("../../login.html");
  }
  const dataAtual = new Date();
  const payload = JSON.parse(atob(token.split(".")[1]));
  const dataExpiracaoToken = new Date(payload.exp * 1000);

  if (
    payload.tipo != "adm" ||
    payload.tipo != "resp" ||
    dataExpiracaoToken < dataAtual
  ) {
    window.location.assign("../../login.html");
  }
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
async function getEmprestimosAtivos() {
  try {
    const respostaApi = await fetch(
      "http://localhost:3000/listarEmprestimosAtivos",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!respostaApi.ok) {
      const tr = document.querySelector("tr");
      const message = await respostaApi.json();
      tr.innerHTML = `<th>${message.message}</th>`;
    }
    const emprestimos = await respostaApi.json();
    return emprestimos;
  } catch (err) {
    console.error(err.erro);
    geraErro(err.message);
  }
}

async function preencherTabela() {
  const emprestimos = await getEmprestimosAtivos();
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  if (emprestimos.length === 0) {
    tbody.innerHTML = `
            <tr>
                <th>Nenhum empréstimo realizado</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
                <th>-</th>
            </tr>
        `;
  } else {
    for (let emprestimo of emprestimos) {
      tbody.innerHTML += `
                <tr>
                    <th>${emprestimo.nomeUsuario}</th>
                    <th>${emprestimo.cpf}</th>
                    <th>${emprestimo.tituloLivro}</th>
                    <th>${emprestimo.numeroDaCopia}</th>
                    <th>${emprestimo.dataEmprestimo}</th>
                    <th>${emprestimo.dataDevolucao}</th>
                </tr>
            `;
    }
  }
}
function exibirSugestoes(emprestimos) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  for (let emprestimo of emprestimos) {
    tbody.innerHTML += `
            <tr>
                <th>${emprestimo.nomeUsuario}</th>
                <th>${emprestimo.cpf}</th>
                <th>${emprestimo.tituloLivro}</th>
                <th>${emprestimo.numeroDaCopia}</th>
                <th>${emprestimo.dataEmprestimo}</th>
                <th>${emprestimo.dataDevolucao}</th>
            </tr>
        `;
  }
}
async function buscarEmprestimo() {
  const palavraNaBarraDePesquisa = document.querySelector(
    "input#barraDePesquisa"
  ).value;
  if (palavraNaBarraDePesquisa === "") {
    await preencherTabela();
  } else {
    const emprestimosAtivos = await getEmprestimosAtivos();
    const emprestimosSemelhantes = buscarPalavraNoEmprestimo(
      emprestimosAtivos,
      palavraNaBarraDePesquisa
    );
    exibirSugestoes(emprestimosSemelhantes);
  }
}
function removerAcentos(str) {
  console.log(str);
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function buscarPalavraNoEmprestimo(arrayDeObjetos, palavra) {
  const regexComAcento = new RegExp(`.*${palavra}.*`, "i");
  const regexSemAcento = new RegExp(`.*${removerAcentos(palavra)}.*`, "i");

  const objetosEncontrados = arrayDeObjetos.filter((objeto) => {
    return (
      objeto &&
      typeof objeto === "object" &&
      Object.values(objeto).some((valor) => {
        return (
          regexComAcento.test(String(valor)) ||
          regexSemAcento.test(removerAcentos(String(valor)))
        );
      })
    );
  });

  return objetosEncontrados;
}
