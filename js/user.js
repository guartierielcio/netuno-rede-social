document.addEventListener("DOMContentLoaded", function () {

  // 🔹 Recuperando o usuário logado
  const usuarioSalvo = localStorage.getItem("usuarioLogado");
  const usuarioObj = JSON.parse(usuarioSalvo);

  if (!usuarioObj) {
    alert("Você precisa estar logado para acessar esta página!");
    window.location.href = "index.html";
    return;
  }

  // 🔹 Atualizando o perfil no topo do dashboard
  document.querySelector("#imagemPerfil").src = usuarioObj.foto;
  document.querySelector("#nomePerfil").innerText = usuarioObj.nome;
  document.querySelector("#emailPerfil").innerText = usuarioObj.email;

  // 🔹 Botão de Logoff
  const btnSair = document.querySelector("#btnSair");
  btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    alert("Usuário foi deslogado com sucesso!");
    window.location.href = "index.html";
  });

  // 🔹 Função para formatar data
  function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 🔹 Função para carregar publicações
  async function carregarPublicacoes() {
    const requestOptions = { method: "GET" };
    const caixaPublicacoes = document.getElementById("publicacoes");

    try {
      const response = await fetch("http://localhost:3001/publicacoes", requestOptions);
      const result = await response.json();

      caixaPublicacoes.innerHTML = "";
      result.forEach((pub) => {
        const conteudo = `
          <div class="publicacao">
            <div class="pubHeader">
              <div>
                <img src="${pub.foto}" alt="Foto Perfil do ${pub.nome}" class="imgPerfilPub" />
              </div>
              <div>
                <h3 class="nomePerfilPub">${pub.nome}</h3>
                <h3 class="dataPerfilPub">${pub.dtcadastro}</h3>
              </div>
            </div>
            <div class="pubBody">
              <div class="boxTextoPub">
                <h3 class="textoPub">${pub.texto}</h3>
              </div>
              <a href="${pub.url || "#"}" target="_blank" class="urlPub">
                <img src="${pub.imagem || ""}" alt="" class="imgPub" />
              </a>
            </div>
            <div class="pubFooter">
              <img src="./public/images/favorite.png" alt="Curtir" />
              Curtir
            </div>
          </div>
        `;
        caixaPublicacoes.insertAdjacentHTML("beforeend", conteudo);
      });
    } catch (error) {
      console.error("Erro ao carregar publicações:", error);
    }
  }

  // 🔹 Função para carregar amigos
  async function carregarAmigos() {
    const requestOptions = { method: "GET" };
    const caixaAmigos = document.getElementById("amigos");

    try {
      const response = await fetch("http://localhost:3001/amigos", requestOptions);
      const result = await response.json();

      caixaAmigos.innerHTML = "";
      result.forEach((amg) => {
        const conteudo = `
          <div class="amigo">
            <div class="boxImagemAmigo">
              <img src="${amg.foto}" alt="Foto da ${amg.nome}" />
            </div>
            <div class="boxInfoAmigo">
              <p class="nomeAmigo">${amg.nome}</p>
              <p class="emailAmigo">${amg.email}</p>
            </div>
          </div>
        `;
        caixaAmigos.insertAdjacentHTML("beforeend", conteudo);
      });
    } catch (error) {
      console.error("Erro ao carregar amigos:", error);
    }
  }

  // 🔹 Função para cadastrar nova publicação
  async function cadastrarPublicacao(dados) {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dados,
        redirect: "follow",
      };

      const resposta = await fetch("http://localhost:3001/publicacoes", requestOptions);
      if (!resposta.ok) throw new Error("Erro ao cadastrar publicação");

      // Limpar campos
      document.querySelector("#ImgPub").value = "";
      document.querySelector("#urlPub").value = "";
      document.querySelector("#txtPub").value = "";

      // Atualizar lista de publicações
      carregarPublicacoes();
    } catch (error) {
      console.error(error);
      alert("Erro ao publicar. Tente novamente.");
    }
  }

  // 🔹 Botão publicar
  const buttonPublicacao = document.getElementById("btnPublicar");
  buttonPublicacao.addEventListener("click", () => {
    const ImgPub = document.querySelector("#ImgPub").value;
    const urlPub = document.querySelector("#urlPub").value;
    const txtPub = document.querySelector("#txtPub").value;

    const dados = JSON.stringify({
      nome: usuarioObj.nome,
      foto: usuarioObj.foto,
      dtcadastro: getFormattedDate(),
      imagem: ImgPub,
      url: urlPub,
      texto: txtPub,
      curtidas: true,
    });

    cadastrarPublicacao(dados);
  });

  // 🔹 Botão Editar Perfil
  const btnEditar = document.querySelector("#btnEditarPerfil");
  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (!usuario) {
        alert("Você precisa estar logado!");
        return;
      }
      window.location.href = "atualizacao.html";
    });
  }

  // 🔹 Inicialização
  carregarPublicacoes();
  carregarAmigos();
});
