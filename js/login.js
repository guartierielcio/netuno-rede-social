document.addEventListener("DOMContentLoaded", function () {
  // Selecionar o formulário pelo ID
  const form = document.getElementById("login-form");

  // Selecionar o campo de e-mail
  const emailInput = document.querySelector("#email");

  // Selecionar o campo de senha
  const senhaInput = document.getElementById("senha");

  // Adiciona um ouvinte de evento para o envio (submit) do formulario
  form.addEventListener("submit", async function (event) {
    // Impede o comportamento padrao do formulário
    // que faz a página recarregar
    event.preventDefault();

    // Obtem os valores digitados pelo usuário
    // Removendo os espaços extras
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    try {
      // Envia uma requisiçao POST para a rota de Login
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST", // Método POST
        headers: {
          "Content-Type": "application/json", // Define que o corpo será em JSON
        },
        body: JSON.stringify({ email, senha }),
      });

      // Converte a resposta da API em um objeto JavaScript
      const data = await response.json();

      // Verifica se a resposta foi bem-sucedida (status 200)
      if (response.ok) {
        // Exibir uma mensagem de sucesso
        alert("Login efetuado com sucesso!");

        // retorno dos dados
        console.log(data);

        // Salvando no LocalStorage do Navegador
        if (data.user && data.user.foto) {
  localStorage.setItem("usuario", JSON.stringify(data.user));
} else {
  // Se não houver foto, adiciona uma imagem padrão
  const usuarioComFotoPadrao = {
    ...data.user,
    foto: "https://i.ibb.co/album/foto-padrao.png" // substitua com o link da sua imagem padrão
  };
  localStorage.setItem("usuario", JSON.stringify(usuarioComFotoPadrao));
}

        window.location.href = "/dashboard.html";
      } else {
        alert(data.error || "Erro ao fazer login");
      }
    } catch (error) {
      // Caso ocorrer algum erro na requisiçao
      // Por exemplo se o servidor estiver off
      console.error("Erro na requisição: ", error);
      alert("Erro de conexão com o servidor.");
    }
  });
});