// Importacoes dos pacotes que iremos utilizar
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Configurações
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Middleware para criar usuário com ID
server.post("/usuarios", (req, res, next) => {
  const usuarios = router.db.get("usuarios").value();
  const lastId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) : 0;
  req.body.id = lastId + 1;
  next();
});

server.post("/auth/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
  }

  const usuario = router.db.get("usuarios").find({ email, senha }).value();

  if (!usuario) {
    return res.status(401).json({ error: "E-mail ou senha inválidos" });
  }

  // Simular um Token (Fake)
  const token = Buffer.from(`${usuario.email}:${usuario.senha}`).toString(
    "base64"
  );

  res.json({
    message: "Login feito com sucesso!",
    user: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      foto: usuario.foto,
    },
    token,
  });
});

server.use(router);

server.listen(3001, () => {
  console.log("Nosso Servidor Backend Está Rodando em http://localhost:3001");
});