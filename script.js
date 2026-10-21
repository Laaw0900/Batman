"use strict";

const CHAVE_USUARIOS = "virtosNSR_usuarios";
const CHAVE_SESSAO = "virtosNSR_sessao";

// Troque pelo número real do WhatsApp: país + DDD + número, só dígitos.
const WHATSAPP = "5541999999999";

const carros = [
  {
    id: 1,
    marca: "Honda",
    modelo: "Civic EXL",
    ano: 2022,
    km: "35.000 km",
    cambio: "Automático",
    preco: 135900,
    imagem: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    descricao: "Sedã confortável, com design moderno e excelente dirigibilidade."
  },
  {
    id: 2,
    marca: "Toyota",
    modelo: "Corolla XEi",
    ano: 2023,
    km: "28.000 km",
    cambio: "Automático",
    preco: 148900,
    imagem: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
    descricao: "Sedã conhecido pelo conforto, espaço interno e praticidade."
  },
  {
    id: 3,
    marca: "Volkswagen",
    modelo: "Golf Comfortline",
    ano: 2020,
    km: "52.000 km",
    cambio: "Automático",
    preco: 105900,
    imagem: "https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=800&q=80",
    descricao: "Hatch com estilo esportivo e ótimo desempenho para o dia a dia."
  },
  {
    id: 4,
    marca: "Jeep",
    modelo: "Compass Longitude",
    ano: 2023,
    km: "24.000 km",
    cambio: "Automático",
    preco: 159900,
    imagem: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
    descricao: "SUV espaçoso para quem procura conforto e versatilidade."
  },
  {
    id: 5,
    marca: "Chevrolet",
    modelo: "Onix LT",
    ano: 2022,
    km: "39.000 km",
    cambio: "Manual",
    preco: 72900,
    imagem: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    descricao: "Carro compacto para deslocamentos urbanos e viagens."
  },
  {
    id: 6,
    marca: "Hyundai",
    modelo: "HB20 Comfort",
    ano: 2023,
    km: "22.000 km",
    cambio: "Manual",
    preco: 75900,
    imagem: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    descricao: "Compacto com visual moderno e boa praticidade."
  },
  {
    id: 7,
    marca: "BMW",
    modelo: "Série 3 320i",
    ano: 2022,
    km: "31.000 km",
    cambio: "Automático",
    preco: 239900,
    imagem: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    descricao: "Sedã premium que combina desempenho, tecnologia e conforto."
  },
  {
    id: 8,
    marca: "Fiat",
    modelo: "Strada Freedom",
    ano: 2023,
    km: "26.000 km",
    cambio: "Manual",
    preco: 99900,
    imagem: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    descricao: "Picape versátil para trabalho e uso cotidiano."
  }
];

const $ = id => document.getElementById(id);

function obterUsuarios() {
  try {
    const usuarios = JSON.parse(
      localStorage.getItem(CHAVE_USUARIOS) || "[]"
    );

    return Array.isArray(usuarios) ? usuarios : [];
  } catch {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  try {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
    return true;
  } catch (erro) {
    console.error("Não foi possível salvar os dados:", erro);
    return false;
  }
}

function obterSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO) || "null");
  } catch {
    return null;
  }
}

function formatarPreco(preco) {
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function mensagemConta(texto, tipo = "") {
  const area = $("mensagemConta");
  area.textContent = texto;
  area.className = "mensagem";

  if (tipo) {
    area.classList.add(tipo);
  }
}

async function gerarHashSenha(senha, salt) {
  if (!window.crypto?.subtle) {
    throw new Error(
      "Abra o site com o Live Server ou HTTPS para testar o cadastro."
    );
  }

  const chave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(senha),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 150000,
      hash: "SHA-256"
    },
    chave,
    256
  );

  return Array.from(
    new Uint8Array(bits),
    b => b.toString(16).padStart(2, "0")
  ).join("");
}

function criarSalt() {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(16)),
    b => b.toString(16).padStart(2, "0")
  ).join("");
}

// CATÁLOGO DE VEÍCULOS

function preencherFiltroMarcas() {
  const filtro = $("filtroMarca");

  [...new Set(carros.map(carro => carro.marca))]
    .sort()
    .forEach(marca => {
      const opcao = document.createElement("option");
      opcao.value = marca;
      opcao.textContent = marca;
      filtro.appendChild(opcao);
    });
}

function criarCartao(carro) {
  const artigo = document.createElement("article");
  artigo.className = "cartao-carro";

  const imagem = document.createElement("img");
  imagem.className = "imagem-carro";
  imagem.src = carro.imagem;
  imagem.alt = `Foto ilustrativa do ${carro.marca} ${carro.modelo}`;
  imagem.loading = "lazy";

  imagem.onerror = () => {
    imagem.onerror = null;
    imagem.src =
      "https://placehold.co/600x400/f0f0f0/333333?text=Veiculo";
  };

  const info = document.createElement("div");
  info.className = "carro-info";

  const marca = document.createElement("p");
  marca.className = "carro-marca";
  marca.textContent = carro.marca;

  const titulo = document.createElement("h3");
  titulo.textContent = carro.modelo;

  const ano = document.createElement("p");
  ano.className = "carro-detalhes";
  ano.textContent = `Ano ${carro.ano}`;

  const km = document.createElement("p");
  km.className = "carro-detalhes";
  km.textContent = carro.km;

  const preco = document.createElement("p");
  preco.className = "carro-preco";
  preco.textContent = formatarPreco(carro.preco);

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "botao-detalhes";
  botao.textContent = "Ver detalhes";
  botao.setAttribute(
    "aria-label",
    `Ver detalhes do ${carro.marca} ${carro.modelo}`
  );

  botao.addEventListener("click", () => abrirDetalhes(carro.id));

  info.append(marca, titulo, ano, km, preco, botao);
  artigo.append(imagem, info);

  return artigo;
}

function renderizarCarros() {
  const busca = $("busca").value
    .trim()
    .toLocaleLowerCase("pt-BR");

  const marca = $("filtroMarca").value;

  const encontrados = carros.filter(carro => {
    const texto = `${carro.marca} ${carro.modelo} ${carro.ano}`
      .toLocaleLowerCase("pt-BR");

    return texto.includes(busca) &&
      (!marca || carro.marca === marca);
  });

  const grade = $("gradeCarros");
  grade.replaceChildren(...encontrados.map(criarCartao));

  $("contador").textContent =
    `${encontrados.length} de ${carros.length} veículos encontrados`;

  $("semResultados").classList.toggle(
    "oculto",
    encontrados.length > 0
  );
}

function abrirDetalhes(id) {
  const carro = carros.find(item => item.id === id);

  if (!carro) return;

  $("modalImagem").src = carro.imagem;
  $("modalImagem").alt =
    `Foto ilustrativa do ${carro.marca} ${carro.modelo}`;

  $("modalMarca").textContent = carro.marca;
  $("modalNome").textContent = carro.modelo;
  $("modalDescricao").textContent = carro.descricao;
  $("modalAno").textContent = `Ano: ${carro.ano}`;
  $("modalKm").textContent = `Quilometragem: ${carro.km}`;
  $("modalCambio").textContent = `Câmbio: ${carro.cambio}`;
  $("modalPreco").textContent = formatarPreco(carro.preco);

  const texto = encodeURIComponent(
    `Olá! Tenho interesse no ${carro.marca} ${carro.modelo} ` +
    `(${carro.ano}), anunciado por ${formatarPreco(carro.preco)}. ` +
    "Gostaria de mais informações."
  );

  $("modalWhatsApp").href =
    `https://wa.me/${WHATSAPP}?text=${texto}`;

  $("modalCarro").showModal();
  $("fecharModal").focus();
}

// CADASTRO E LOGIN

function mostrarFormulario(tipo) {
  const cadastroAtivo = tipo === "cadastro";

  $("formCadastro").classList.toggle("oculto", !cadastroAtivo);
  $("formLogin").classList.toggle("oculto", cadastroAtivo);

  $("abaCadastro").classList.toggle("ativa", cadastroAtivo);
  $("abaLogin").classList.toggle("ativa", !cadastroAtivo);

  $("abaCadastro").setAttribute(
    "aria-pressed",
    String(cadastroAtivo)
  );

  $("abaLogin").setAttribute(
    "aria-pressed",
    String(!cadastroAtivo)
  );

  mensagemConta("");
}

async function cadastrarUsuario(evento) {
  evento.preventDefault();

  const nome = $("nome").value.trim();
  const email = $("email").value.trim().toLowerCase();
  const telefone = $("telefone").value.trim();
  const senha = $("senha").value;
  const confirmar = $("confirmarSenha").value;

  if (nome.length < 2) {
    mensagemConta("Informe seu nome completo.", "erro");
    return;
  }

  if (senha.length < 8) {
    mensagemConta(
      "A senha precisa ter pelo menos 8 caracteres.",
      "erro"
    );
    return;
  }

  if (senha !== confirmar) {
    mensagemConta("As senhas não coincidem.", "erro");
    return;
  }

  if (telefone.replace(/\D/g, "").length < 10) {
    mensagemConta("Informe DDD e telefone válidos.", "erro");
    return;
  }

  const usuarios = obterUsuarios();

  if (usuarios.some(usuario => usuario.email === email)) {
    mostrarFormulario("login");
    $("emailLogin").value = email;

    mensagemConta(
      "Este e-mail já está cadastrado. Entre na sua conta.",
      "erro"
    );
    return;
  }

  const botao = $("botaoCadastro");
  botao.disabled = true;
  botao.textContent = "Salvando...";

  try {
    const salt = criarSalt();
    const hashSenha = await gerarHashSenha(senha, salt);

    const novoUsuario = {
      id: Date.now(),
      nome,
      email,
      telefone,
      salt,
      hashSenha,
      dataCadastro: new Date().toISOString()
    };

    if (!salvarUsuarios([...usuarios, novoUsuario])) {
      throw new Error(
        "O navegador não conseguiu salvar os dados. Verifique o armazenamento disponível."
      );
    }

    $("formCadastro").reset();
    mostrarFormulario("login");
    $("emailLogin").value = email;

    mensagemConta(
      "Cadastro salvo neste navegador. Entre com seu e-mail e senha.",
      "sucesso"
    );

    $("emailLogin").focus();
  } catch (erro) {
    mensagemConta(
      erro.message || "Não foi possível salvar o cadastro.",
      "erro"
    );
  } finally {
    botao.disabled = false;
    botao.textContent = "Salvar cadastro";
  }
}

async function entrarNaConta(evento) {
  evento.preventDefault();

  const email = $("emailLogin").value.trim().toLowerCase();
  const senha = $("senhaLogin").value;

  const usuario = obterUsuarios().find(
    item => item.email === email
  );

  if (!usuario) {
    mensagemConta(
      "E-mail não encontrado. Confira os dados ou crie seu cadastro.",
      "erro"
    );
    return;
  }

  const botao = $("botaoLogin");
  botao.disabled = true;
  botao.textContent = "Verificando...";

  try {
    const hash = await gerarHashSenha(senha, usuario.salt);

    if (hash !== usuario.hashSenha) {
      mensagemConta("Senha incorreta. Tente novamente.", "erro");
      $("senhaLogin").focus();
      return;
    }

    localStorage.setItem(
      CHAVE_SESSAO,
      JSON.stringify({ email: usuario.email })
    );

    $("formLogin").reset();
    atualizarConta();

    mensagemConta(
      `Bem-vindo(a), ${usuario.nome}!`,
      "sucesso"
    );
  } catch (erro) {
    mensagemConta(
      erro.message || "Não foi possível entrar na conta.",
      "erro"
    );
  } finally {
    botao.disabled = false;
    botao.textContent = "Entrar na conta";
  }
}

function atualizarConta() {
  const sessao = obterSessao();

  const usuario = sessao
    ? obterUsuarios().find(item => item.email === sessao.email)
    : null;

  $("usuarioLogado").textContent =
    usuario ? `Olá, ${usuario.nome}` : "";

  $("botaoSair").classList.toggle("oculto", !usuario);

  if (usuario) {
    $("formCadastro").classList.add("oculto");
    $("formLogin").classList.add("oculto");

    $("abaCadastro").classList.remove("ativa");
    $("abaLogin").classList.remove("ativa");

    $("abaCadastro").setAttribute("aria-pressed", "false");
    $("abaLogin").setAttribute("aria-pressed", "false");

    mensagemConta(
      `Você está conectado(a) como ${usuario.email}.`,
      "sucesso"
    );
  } else {
    mostrarFormulario("cadastro");
  }
}

function sairDaConta() {
  localStorage.removeItem(CHAVE_SESSAO);
  atualizarConta();
  mensagemConta("Você saiu da sua conta.", "sucesso");
  $("abaCadastro").focus();
}

// Funções auxiliares para consultar e excluir cadastros durante os testes.
// Não exibem o hash nem o salt da senha.

function consultarCadastros() {
  return obterUsuarios().map(({ salt, hashSenha, ...usuario }) => usuario);
}

function excluirCadastro(email) {
  const normalizado = email.trim().toLowerCase();
  const usuarios = obterUsuarios();

  const atualizados = usuarios.filter(
    usuario => usuario.email !== normalizado
  );

  if (atualizados.length === usuarios.length) {
    return false;
  }

  if (!salvarUsuarios(atualizados)) {
    return false;
  }

  const sessao = obterSessao();

  if (sessao?.email === normalizado) {
    localStorage.removeItem(CHAVE_SESSAO);
    atualizarConta();
  }

  return true;
}

// EVENTOS, ACESSIBILIDADE E INICIALIZAÇÃO

$("busca").addEventListener("input", renderizarCarros);
$("filtroMarca").addEventListener("change", renderizarCarros);

$("limparFiltros").addEventListener("click", () => {
  $("busca").value = "";
  $("filtroMarca").value = "";

  renderizarCarros();
  $("busca").focus();
});

$("abaCadastro").addEventListener(
  "click",
  () => mostrarFormulario("cadastro")
);

$("abaLogin").addEventListener(
  "click",
  () => mostrarFormulario("login")
);

$("formCadastro").addEventListener(
  "submit",
  cadastrarUsuario
);

$("formLogin").addEventListener(
  "submit",
  entrarNaConta
);

$("botaoSair").addEventListener("click", sairDaConta);

$("fecharModal").addEventListener("click", () => {
  $("modalCarro").close();
});

$("modalCarro").addEventListener("click", evento => {
  if (evento.target === $("modalCarro")) {
    $("modalCarro").close();
  }
});

$("modalCarro").addEventListener("close", () => {
  const primeiroBotaoDetalhes =
    document.querySelector(".botao-detalhes");

  if (primeiroBotaoDetalhes) {
    primeiroBotaoDetalhes.focus();
  }
});

$("telefone").addEventListener("input", evento => {
  let numero = evento.target.value
    .replace(/\D/g, "")
    .slice(0, 11);

  if (numero.length > 10) {
    numero = numero.replace(
      /^(\d{2})(\d{5})(\d{0,4})$/,
      "($1) $2-$3"
    );
  } else if (numero.length > 6) {
    numero = numero.replace(
      /^(\d{2})(\d{4})(\d{0,4})$/,
      "($1) $2-$3"
    );
  } else if (numero.length > 2) {
    numero = numero.replace(
      /^(\d{2})(\d+)$/,
      "($1) $2"
    );
  }

  evento.target.value = numero;
});

$("botaoMenu").addEventListener("click", () => {
  const aberto = $("navegacao").classList.toggle("aberto");

  $("botaoMenu").setAttribute(
    "aria-expanded",
    String(aberto)
  );

  $("botaoMenu").setAttribute(
    "aria-label",
    aberto ? "Fechar menu" : "Abrir menu"
  );
});

$("navegacao").querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    $("navegacao").classList.remove("aberto");

    $("botaoMenu").setAttribute("aria-expanded", "false");
    $("botaoMenu").setAttribute("aria-label", "Abrir menu");
  });
});

$("anoAtual").textContent = new Date().getFullYear();

preencherFiltroMarcas();
renderizarCarros();
atualizarConta();