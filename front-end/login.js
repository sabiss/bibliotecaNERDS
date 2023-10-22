function geraErro(texto) {
  const alert = document.querySelector("#anuncioDeErro");
  alert.style.display = "flex";
  alert.innerHTML = `${texto}`;
}
async function logar() {
  const email = document.querySelector("#email").value;
  const senha = document.querySelector("#senha").value;
  try {
    const retornoDaApi = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ email, senha }),
    });
    const resposta = await retornoDaApi.json();
    const token = resposta.token;

    if (!token) {
      geraErro(resposta.message);
    }
    localStorage.setItem("token", resposta.token);

    const payload = JSON.parse(atob(token.split(".")[1])); //atob() decodifica base64 para sua sequencia normal, ou seja, o payload[1] será descriptografado sem precisar do jwt.verify

    const tipoDeUsuario = payload.tipo;

    switch (tipoDeUsuario) {
      case "adm":
        window.location.assign("./Administrador/home/home.html");
        break;
      case "resp":
        window.location.assign("https://www.facebook.com");
        break;
      default:
        window.location.assign("https://www.youtuber.com");
        break;
    }
  } catch (err) {
    geraErro(`Ocorreu um erro no sistema - ${err}`);
  }
}