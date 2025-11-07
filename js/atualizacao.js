document.addEventListener("DOMContentLoaded", () => {
  // Verifica se há usuário logado
  const usuarioSalvo = localStorage.getItem("usuarioLogado");
  if (!usuarioSalvo) {
    alert("Você precisa estar logado para acessar esta página!");
    window.location.href = "index.html";
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  // Preenche os campos com os dados salvos
  document.querySelector("#nome").value = usuario.nome || "";
  document.querySelector("#email").value = usuario.email || "";
  document.querySelector("#dtnascimento").value = usuario.dtnascimento || "";
  document.querySelector("#cep").value = usuario.cep || "";
  document.querySelector("#rua").value = usuario.rua || "";
  document.querySelector("#bairro").value = usuario.bairro || "";
  document.querySelector("#cidade").value = usuario.cidade || "";
  document.querySelector("#estado").value = usuario.estado || "";

  // Atualiza a foto e infos do topo
  const imgPerfil = document.querySelector("#imagemPerfil");
  imgPerfil.src = usuario.foto || "./public/images/elcio.jpg";
  document.querySelector("#nomePerfil").textContent = usuario.nome || "Usuário";
  document.querySelector("#emailPerfil").textContent = usuario.email || "";

  // =============================
  // 🔹 Preencher endereço via CEP
  // =============================
  const inputCep = document.querySelector("#cep");
  inputCep.addEventListener("blur", async () => {
    const cep = inputCep.value.replace(/\D/g, ""); // remove traços e espaços
    if (cep.length === 8) {
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
          alert("CEP não encontrado!");
          return;
        }

        document.querySelector("#rua").value = dados.logradouro || "";
        document.querySelector("#bairro").value = dados.bairro || "";
        document.querySelector("#cidade").value = dados.localidade || "";
        document.querySelector("#estado").value = dados.uf || "";
      } catch (erro) {
        console.error("Erro ao buscar o CEP:", erro);
        alert("Não foi possível buscar o CEP.");
      }
    }
  });

  // =============================
  // 🔹 Botões Voltar e Cancelar
  // =============================
  document.querySelector("#btnVoltarDashboard").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  document.querySelector("#btnCancelar").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  // =============================
  // 🔹 Salvar alterações (PUT)
  // =============================
  document
    .querySelector("#formAtualizacao")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const dadosAtualizados = {
        ...usuario,
        nome: document.querySelector("#nome").value,
        email: document.querySelector("#email").value,
        dtnascimento: document.querySelector("#dtnascimento").value,
        cep: document.querySelector("#cep").value,
        rua: document.querySelector("#rua").value,
        bairro: document.querySelector("#bairro").value,
        cidade: document.querySelector("#cidade").value,
        estado: document.querySelector("#estado").value,
      };

      try {
        const resposta = await fetch(
          `http://localhost:3001/usuarios/${usuario.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosAtualizados),
          }
        );

        if (!resposta.ok) throw new Error("Erro ao atualizar o cadastro.");

        // Atualiza localStorage e mostra mensagem de sucesso
        localStorage.setItem("usuarioLogado", JSON.stringify(dadosAtualizados));
        alert("Endereço salvo com sucesso!");
        window.location.href = "dashboard.html";
      } catch (erro) {
        alert("Falha ao atualizar: " + erro.message);
        console.error(erro);
      }
    });
});
