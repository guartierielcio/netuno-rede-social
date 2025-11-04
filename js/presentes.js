document.addEventListener("DOMContentLoaded", function () {
  // Recuperando o item usuário
  const usuarioSalvo = localStorage.getItem("usuario");

  // Convertendo de volta para objeto
  const usuarioObj = JSON.parse(usuarioSalvo);

  console.log(usuarioObj);

  // Loggoff
  const btnSair = document.querySelector("#btnSair");
  btnSair.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    alert("Usuário foi deslogado com sucesso!");
    window.location.href = "/index.html";
  });

  // GET AMIGOS
  const caixaAmigos = document.getElementById("amigos");

  const requestOptions = {
    method: "GET",
  };

  fetch("http://localhost:3001/amigos", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      caixaAmigos.innerHTML = "";
      let conteudo = "";

      result.forEach((amg) => {
        conteudo = `
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

        caixaAmigos.insertAdjacentHTML("beforeEnd", conteudo);
      });
    })
    .catch((error) => console.error(error));

  // GET PRODUTOS
  const caixaProdutos = document.getElementById("produtos");

  fetch("http://localhost:3001/produtos", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      caixaProdutos.innerHTML = "";
      let conteudo = "";

      result.forEach((prod) => {
        console.log(prod);
        conteudo = `
          <div class="produto">
            <div class="boxImageProduto">
              <img
                src="${prod.foto}"
                alt="${prod.nome}"
              />
            </div>
            <div class="boxTextoProduto">
              <h2>${prod.nome}</h2>
              <span>${prod.valor} pontos</span>
            </div>
            <div>
              <button class="ButtonProduto ${
                !prod.status ? "ButtonProdutoNaoDisponivel" : ""
              }">Resgatar</button>
            </div>
          </div>
        `;

        caixaProdutos.insertAdjacentHTML("beforeEnd", conteudo);
      });
    })
    .catch((error) => console.error(error));
});