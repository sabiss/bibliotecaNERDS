const token = localStorage.getItem("token");

document.getElementById("cpf").addEventListener("input", function (event) {
  let cpf = event.target.value;

  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, "");

  // Adiciona a máscara de CPF dinamicamente
  if (cpf.length <= 3) {
    cpf = cpf.replace(/(\d{1,3})/, "$1");
  } else if (cpf.length <= 6) {
    cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  } else if (cpf.length <= 9) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  } else {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
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

  if (
    (payload.tipo != "adm" && payload.tipo != "resp") ||
    dataExpiracaoToken < dataAtual
  ) {
    window.location.assign("../../login.html");
  }
}
function geraAlerta(texto, tipoAlerta) {
  const alerta = document.querySelector("div#alerta");
  let text = document.querySelector("strong#textoDoAlerta");
  switch (tipoAlerta) {
    case "Erro":
      alerta.classList.remove("alert-success");
      alerta.classList.remove("alert-warning");
      alerta.classList.add("alert-danger");
      break;
    case "AnuncioDeSucesso":
      alerta.classList.remove("alert-danger");
      alerta.classList.remove("alert-warning");
      alerta.classList.add("alert-success");
      break;
    case "Atencao":
      alerta.classList.remove("alert-danger");
      alerta.classList.remove("alert-success");
      alerta.classList.add("alert-warning");
      break;
  }
  alerta.classList.remove("d-none");
  alerta.classList.add("d-flex");

  text.innerHTML = `${texto}`;
}
function fecharAlert() {
  const alerta = document.querySelector("div#alerta");
  alerta.classList.add("d-none");
  alerta.classList.remove("d-flex");
}
async function cadastrarNovoUsuario() {
  const nomeSemFormatacao = document.querySelector("input#nome").value;
  const nome = capitalizarPalavras(nomeSemFormatacao);
  const email = document.querySelector("input#email").value;
  const senha = document.querySelector("input#senha").value;
  const cpf = document.querySelector("input#cpf").value;

  if (nome === "" || email === "" || senha === "" || cpf === "") {
    geraAlerta("Preencha todos os campos do formulário", "Atencao");
  } else {
    const usuario = {
      email,
      senha,
      nome,
      cpf,
    };
    try {
      const respostaApi = await fetch("http://localhost:3000/cadastroUser", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });
      const mensagem = await respostaApi.json();
      geraAlerta(mensagem.message, "AnuncioDeSucesso");
    } catch (err) {
      console.error(err.erro);
      geraAlerta(err.message, "Erro");
    }
  }
}
function capitalizarPalavras(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}
