document.addEventListener("DOMContentLoaded", () => {

  // Função async para enviar dados ao JSON Server
  async function cadastrarUsuario(dados) {
    const myHeader = new Headers();
    myHeader.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeader,
      body: JSON.stringify(dados),
      redirect: "follow",
    };

    try {
      const resposta = await fetch("http://localhost:3001/usuarios", requestOptions);
      const result = await resposta.json();
      console.log("Usuário cadastrado:", result);
    } catch (error) {
      console.log("Erro ao enviar dados:", error);
    }
  }

  // Botão Avançar
  const btnAvancar = document.querySelector("#btn-avancar");
  const form01 = document.querySelector(".form-01");
  const form02 = document.querySelector(".form-02");
  const step2 = document.querySelector("#step-2");

  form02.style.display = "none";

  btnAvancar.addEventListener("click", (e) => {
    e.preventDefault();
    form01.style.display = "none";
    form02.style.display = "block";
    step2.classList.add("active");
  });

  // Botão Finalizar
  const btnFinalizar = document.querySelector("#btn-finalizar");
  
  btnFinalizar.addEventListener("click", async (e) => {
    e.preventDefault();

    // Coleta os dados do formulário
    const dados = {
      nome: document.querySelector("#nome").value,
      email: document.querySelector("#email").value,
      senha: document.querySelector("#senha").value,
      sexo: document.querySelector('input[name="sexo"]:checked')?.value || null,
      dtnascimento: document.querySelector("#nascimento").value,
      cpf: document.querySelector("#cpf").value,
      cep: document.querySelector("#cep").value,
      rua: document.querySelector("#rua").value,
      bairro: document.querySelector("#bairro").value,
      cidade: document.querySelector("#cidade").value,
      uf: document.querySelector("#estado").value,
      numero: document.querySelector("#numero").value,
      complemento: document.querySelector("#complemento").value
    };

    console.log("Dados coletados:", dados);

    // Antes de enviar, buscar todos os usuários existentes para gerar id numérico
    try {
      const response = await fetch("http://localhost:3001/usuarios");
      const usuariosExistentes = await response.json();

      // Gera o próximo ID numérico
      const proximoId = usuariosExistentes.length
        ? Math.max(
            ...usuariosExistentes.map(u => {
              const num = parseInt(u.id, 10);
              return isNaN(num) ? 0 : num;
            })
          ) + 1
        : 1;

      dados.id = proximoId;

      // Envia os dados ao JSON Server
      await cadastrarUsuario(dados);
    } catch (error) {
      console.log("Erro ao buscar usuários existentes:", error);
    }
  });

});
