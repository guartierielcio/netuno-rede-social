// É uma forma de garantir que os códigos do JavaScript
// só rodem depois que o HTML já está pronto.

document.addEventListener("DOMContentLoaded", function () {
  // document.querySelector() é uma forma moderna e versátil de buscar elementos no DOM.
  const btnAvancar = document.querySelector("#btn-avancar");

  // outra forma de utilizar é:
  // const btnAvancar = document.getElementById("btn-avancar");
  btnAvancar.addEventListener("click", function () {
    if (!validarNome() || !validarSexo()) {
      return;
    }

    const steps = document.querySelectorAll(".step");

    // Troca a classe "active" entre os passos do formulário
    // Remove a classe ativa do passo atual (steps[0])
    // e adiciona no próximo passo (steps[1]) para mostrar que ele agora está visível ou selecionado
    steps[0].classList.remove("active");
    steps[1].classList.add("active");

    // Esconde o formulário da primeira etapa (form-01)
    // e mostra o formulário da segunda etapa (form-02)
    // Isso serve para fazer a troca de telas no formulário por etapas
    document.querySelector(".form-01").style.display = "none";
    document.querySelector(".form-02").style.display = "block";

    document.querySelector("#btn-avancar").style.display = "none";
    document.querySelector("#btn-finalizar").style.display = "block";
  });

  // Função assíncrona para buscar o endereço a partir do CEP informado
  async function buscerEndereco(cep) {
    try {
      // Faz a requisição para a API ViaCEP usando o CEP informado
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      // Verifica se a resposta da API foi bem-sucedida (status 200~299)
      if (!resposta.ok) {
        throw new Error("Erro na requisição");
      }

      // Converte a resposta em JSON
      const dados = await resposta.json();

      // Se o CEP não for encontrado, a API retorna um campo "erro"
      if (dados.erro) {
        throw new Error("CEP não foi encontrado");
      }

      // Retorna os dados do endereço
      return dados;
    } catch (error) {
      // Se der erro em qualquer parte do processo, exibe no console
      console.error("Erro ao buscar o CEP: ", error.message);
      return null; // Retorna null em caso de erro
    }
  }

  // Quando o campo de CEP perde o foco (blur), executa a função abaixo
  document.querySelector("#cep").addEventListener("blur", async function () {
    // Pega o valor do campo e remove qualquer caractere que não seja número
    const cep = this.value.replace(/\D/g, "");

    // Verifica se o CEP tem exatamente 8 dígitos
    if (cep.length === 8) {
      // Chama a função para buscar o endereço na API ViaCEP
      const endereco = await buscerEndereco(cep);

      // Se o endereço for encontrado, preenche os campos do formulário
      if (endereco) {
        document.querySelector("#rua").value = endereco.logradouro || "";
        document.querySelector("#bairro").value = endereco.bairro || "";
        document.querySelector("#cidade").value = endereco.localidade || "";
        document.querySelector("#estado").value = endereco.uf || "";
      } else {
        // Se o CEP for inválido ou não for encontrado na API
        alert("CEP é inválido ou não foi encontrado");
      }
    } else {
      // Alerta se o CEP digitado não tiver 8 dígitos
      alert("CEP deve conter 8 dígitos!");
    }
  });

  // Validacões
  function validarNome() {
    const nome = document.querySelector("#nome").value;
    if (nome === "") {
      alert("Digite seu nome!");
      return false;
    }

    return true;
  }

  function validarSexo() {
    const sexoSelecionado = document.querySelector(
      'input[name="sexo"]:checked'
    );

    if (!sexoSelecionado) {
      alert("Por favor, selecione o sexo!");
      return false;
    }

    return true;
  }

  // Mascaras
  const cpf = document.querySelector("#cpf");
  cpf.addEventListener("input", () => {
    cpf.value = cpf.value
      .replace(/\D/g, "") // Remove tudo que não for número
      .slice(0, 11) // Limita a 11 dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Primeiro ponto
      .replace(/(\d{3})(\d)/, "$1.$2") // Segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Hífen
  });

  const cep = document.querySelector("#cep");
  cep.addEventListener("input", () => {
    cep.value = cep.value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/^(\d{5})(\d)/, "$1-$2") // Insere o hífen depois dos 5 primeiros dígitos
      .replace(/(-\d{3})\d+?$/, "$1"); // Impede que digite mais que 8 dígitos no total
  });
});