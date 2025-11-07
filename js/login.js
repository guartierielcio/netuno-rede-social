// arquivo: js/login.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const emailInput = document.querySelector("#email");
  const senhaInput = document.getElementById("senha");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    try {
      // ✅ Busca o usuário no JSON Server
      const resposta = await fetch(`http://localhost:3001/usuarios?email=${email}&senha=${senha}`);
      const dados = await resposta.json();

      // Se encontrou o usuário:
      if (dados.length > 0) {
        const usuario = dados[0];
        alert("✅ Login efetuado com sucesso!");

        // Salva no LocalStorage
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

        // Redireciona para o dashboard
        window.location.href = "dashboard.html";
      } else {
        alert("❌ Email ou senha incorretos!");
      }
    } catch (erro) {
      console.error("Erro na requisição: ", erro);
      alert("⚠️ Erro de conexão com o servidor.");
    }
  });
});
