import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const canvas = document.querySelector("#universe");
const smokeCanvas = document.querySelector("#toxicSmoke");
const smokeCtx = smokeCanvas?.getContext("2d");
const codeColumns = Array.from(document.querySelectorAll("[data-code-column]"));
const loaderOverlay = document.querySelector("[data-loader]");
const loaderPercent = document.querySelector("[data-loader-percent]");
const loaderBar = document.querySelector("[data-loader-bar]");
const carouselCount = 14;
const progressParam = new URLSearchParams(window.location.search).get("progress");
const previewProgress = progressParam === null ? NaN : Number(progressParam);
const hasPreviewProgress = Number.isFinite(previewProgress);

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (!hasPreviewProgress) {
  window.scrollTo(0, 0);
}

window.addEventListener("load", () => {
  pageLoaded = true;
});
if (document.readyState === "complete") {
  pageLoaded = true;
}
window.setTimeout(() => {
  pageLoaded = true;
}, 3600);

function updateLoader(delta) {
  if (!loaderOverlay || document.body.classList.contains("is-loaded")) return;
  const assetBonus = (state.loadedColumn ? 12 : 0) + (state.loadedGallery ? 12 : 0);
  const target = pageLoaded ? 100 : 78 + assetBonus;
  visualLoadingProgress = THREE.MathUtils.damp(visualLoadingProgress, target, pageLoaded ? 5.5 : 1.8, delta);
  const visibleProgress = Math.min(100, Math.round(visualLoadingProgress));
  if (loaderPercent) loaderPercent.textContent = `${visibleProgress}%`;
  if (loaderBar) loaderBar.style.width = `${visibleProgress}%`;
  if (loaderOverlay) loaderOverlay.style.setProperty("--loader-fill", visibleProgress);
  if (visibleProgress >= 100 && pageLoaded) {
    if (loaderInterval !== null) {
      window.clearInterval(loaderInterval);
      loaderInterval = null;
    }
    window.setTimeout(() => document.body.classList.add("is-loaded"), 180);
  }
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020407, 0.038);

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 160);
camera.position.set(0.08, 0.14, 7.45);

const clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pointerDown = new THREE.Vector2();
let scrollTarget = 0;
let scrollProgress = 0;
let orbitPosition = 0;
let orbitImpulse = 0;
let orbitVelocity = 0;
let dragSpin = 0;
let dragSpinTarget = 0;
let isDragging = false;
let pointerWasDragged = false;
let hoveredCardIndex = -1;
let pageLoaded = false;
let visualLoadingProgress = 0;
let loaderInterval = null;

const state = {
  loadedColumn: false,
  loadedGallery: false,
  phase: 0,
  orbitScrollRange: carouselCount - 1,
  orbitImpulseStrength: 0.032,
  orbitImpulseReturn: 2.2,
  orbitDrag: 3.6,
  maxOrbitVelocity: 38,
  colors: {
    cyan: new THREE.Color("#78f7ff"),
    pink: new THREE.Color("#ff4bd8"),
    green: new THREE.Color("#62ffc4"),
    amber: new THREE.Color("#ffe16a"),
  },
};

loaderInterval = window.setInterval(() => updateLoader(1 / 30), 33);

const towerScrollStart = 0.285;
const towerScrollEnd = 0.78;
const serviceListRevealProgress = towerScrollStart - 0.015;
const projectsGateStart = 0.805;
const projectsRevealProgress = 0.865;
const towerTopY = 3.35;
const towerCardSpacing = 1.62;
const towerBottomY = towerTopY - (carouselCount - 1) * towerCardSpacing;
const towerCenterY = (towerTopY + towerBottomY) * 0.5;
const towerHeroY = 7.75;
const towerCenterZ = -0.9;
const towerRadiusX = 3.72;
const towerRadiusZ = 2.72;
const towerCardAngleStep = 0.98;
const towerRotationDirection = 1;

const serviceItems = [
  "PYTHON",
  "SERVIDOR SAMP",
  "SERVIDOR MTA",
  "JAVA",
  "C++ & C#",
  "CORREÇÕES",
  "BOT DISCORD",
  "APLICATIVO/LAUNCHERS",
  "SITES & REPOSITORIOS",
  "PROJETOS ESCOLARES",
  "BANCO MYSQL",
  "RENDA EXTRA",
  "ANT-XITER / ANT-DDOS",
  "AULA PERSONALIZADA!",
];

const serviceCardArt = [
  null,
  "./assets/service-cards-clean/02-servidor-samp.png?v=61",
  "./assets/service-cards-clean/03-servidor-mta.png?v=61",
  "./assets/service-cards-clean/04-java.png?v=61",
  "./assets/service-cards-clean/05-cpp-csharp.png?v=61",
  "./assets/service-cards-clean/06-correcoes.png?v=61",
  "./assets/service-cards-clean/07-bot-discord.png?v=61",
  "./assets/service-cards-clean/08-aplicativos-launchers.png?v=61",
  "./assets/service-cards-clean/09-sites-repositorios.png?v=61",
  "./assets/service-cards-clean/10-projetos-escolares.png?v=61",
  "./assets/service-cards-clean/11-banco-mysql.png?v=61",
  "./assets/service-cards-clean/12-renda-extra.png?v=61",
  "./assets/service-cards-clean/13-ant-xiter-ant-ddos.png?v=61",
  "./assets/service-cards-clean/14-aula-personalizada.png?v=61",
];

const serviceDetails = [
  {
    title: "PYTHON",
    price: "A partir de R$: 50,00",
    intro: "Python é perfeito para automações, bots, scripts, ferramentas e sistemas personalizados que resolvem tarefas repetitivas com rapidez.",
    canDo: [
      ["Automações", "Organizar arquivos, preencher planilhas, baixar dados, gerar relatórios e executar tarefas repetitivas."],
      ["Bots", "Bots para Discord, atendimento, comandos, moderação, integração com APIs e rotinas automáticas."],
      ["Ferramentas", "Programas simples para converter arquivos, gerenciar dados, validar listas e acelerar trabalho manual."],
      ["Sistemas web", "Painéis com Flask ou Django, login, cadastro, dashboard e controle administrativo."],
      ["Banco de dados", "MySQL, SQLite ou PostgreSQL para salvar usuários, produtos, mensagens e rankings."],
      ["APIs", "Criar endpoints, integrações, sistemas de login, conexão com pagamentos e automações online."],
    ],
  },
  {
    title: "SERVIDOR SAMP",
    price: "A partir de R$: 50,00",
    intro: "Servidor SAMP personalizado para roleplay, pvp, freeroam ou projetos próprios, com gamemode, mapas, sistemas e manutenção.",
    canDo: [
      ["Gamemodes", "Base do servidor, comandos, funções, regras, empregos, facções e sistemas de jogabilidade."],
      ["Mapas", "Interiores, bases, spawn, lojas, áreas de evento, prefeitura, garagem e pontos personalizados."],
      ["Painéis", "Admin, helper, vip, inventário, login, registro, ranking, banco e notificações."],
      ["Economia", "Dinheiro, banco, lojas, veículos, casas, empresas, recompensas e profissões."],
      ["Roleplay", "RG, celular, organizações, polícia, mecânica, hospital, prefeitura e sistemas de cidade."],
      ["Proteções", "Anti flood, logs, bloqueios de comandos e segurança básica do servidor."],
    ],
  },
  {
    title: "SERVIDOR MTA",
    price: "A partir de R$: 100,00",
    intro: "Servidor MTA com scripts, resources, painel e sistemas personalizados para criar uma experiência moderna dentro do GTA.",
    canDo: [
      ["Resources", "Scripts em Lua para comandos, interfaces, sistemas e mecânicas próprias."],
      ["HUD e painéis", "HUD, login, inventário, loja, painel admin, painel vip e interfaces modernas."],
      ["Roleplay", "Empregos, facções, veículos, casas, economia, documentos e sistemas urbanos."],
      ["Mapas", "Ambientes, interiores, bases, eventos, spawns e espaços personalizados."],
      ["Banco de dados", "Integração com MySQL para contas, inventário, veículos, ranking e histórico."],
      ["Otimização", "Revisão de scripts, redução de lag e correção de conflitos."],
    ],
  },
  {
    title: "JAVA",
    price: "A partir de R$: 35,00",
    intro: "Java serve para sistemas robustos, plugins, aplicações desktop, APIs e projetos que precisam de organização e estabilidade.",
    canDo: [
      ["Plugins", "Plugins para Minecraft, sistemas de comandos, permissões, menus e eventos."],
      ["Desktop", "Ferramentas com interface, cadastros, calculadoras, launchers e gerenciadores."],
      ["APIs", "Backends com Spring Boot, login, cadastro, autenticação e integração com banco."],
      ["Projetos escolares", "POO, listas, arquivos, banco de dados e relatórios."],
      ["Automação", "Leitura de arquivos, geração de documentos, organização de dados e tarefas internas."],
      ["Correções", "Resolver bugs, organizar classes, melhorar arquitetura e desempenho."],
    ],
  },
  {
    title: "C++ & C#",
    price: "A partir de R$: 40,00",
    intro: "C++ e C# são ideais para ferramentas, sistemas Windows, jogos, launchers e integrações que precisam de controle e desempenho.",
    canDo: [
      ["Ferramentas Windows", "Programas com interface, utilitários, gerenciadores e automações locais."],
      ["Launchers", "Launchers para jogos e servidores, atualização de arquivos, login e conexão rápida."],
      ["Jogos", "Protótipos, sistemas em Unity, menus, inventário, UI, movimentação e gameplay."],
      ["APIs e desktop", "Aplicações C# com banco, login, painel administrativo e relatórios."],
      ["Integrações", "Conectar programas com APIs, arquivos, banco de dados e serviços externos."],
      ["Correções", "Resolver erros, crashes, ajustes visuais e problemas de compilação."],
    ],
  },
  {
    title: "CORREÇÕES",
    price: "A partir de R$: 20,00",
    intro: "Correção de bugs, ajustes visuais, melhoria de desempenho e manutenção em projetos que já existem.",
    canDo: [
      ["Bugs", "Corrigir erros, telas quebradas, funções que pararam e problemas de lógica."],
      ["Layout", "Ajustar responsividade, textos, botões, cards, cores, espaçamentos e telas mobile."],
      ["Performance", "Reduzir travamentos, otimizar scripts, diminuir peso de imagens e melhorar carregamento."],
      ["Banco de dados", "Corrigir consultas, cadastros, login, conexão, tabelas e dados inconsistentes."],
      ["Integrações", "Resolver falhas em APIs, bots, pagamentos, webhooks e sistemas externos."],
      ["Melhorias", "Adicionar pequenos recursos, polir experiência e deixar o projeto mais profissional."],
    ],
  },
  {
    title: "BOT DISCORD",
    price: "A partir de R$: 10,00",
    intro: "Bots de Discord para comunidade, servidor, atendimento, loja, suporte, moderação e automações personalizadas.",
    canDo: [
      ["Comandos", "Slash commands, prefixos, menus, botões, embeds e respostas automáticas."],
      ["Moderação", "Ban, mute, warn, logs, anti spam, filtros e proteção básica."],
      ["Tickets", "Sistema de atendimento, categorias, painéis, histórico e fechamento automático."],
      ["Economia", "Moedas, loja, ranking, recompensas, daily, inventário e níveis."],
      ["Integrações", "Conectar com sites, APIs, servidores, banco de dados e webhooks."],
      ["Hospedagem", "Bot online 24/7 com manutenção, reinício e configuração inicial."],
    ],
  },
  {
    title: "APLICATIVO/LAUNCHERS",
    price: "A partir de R$: 300,00",
    intro: "Aplicativos e launchers com identidade visual para jogos, servidores, comunidades e projetos próprios.",
    canDo: [
      ["Launcher SAMP", "IP fixo, botão jogar, redes sociais, notícias, tela customizada e identidade do servidor."],
      ["App Android", "Telas, botões, formulários, login, links, painel simples e integração com web."],
      ["Electron", "Launcher desktop com atualização, atalhos, autenticação e interface moderna."],
      ["Painel inicial", "Home, notícias, status do servidor, changelog e botões rápidos."],
      ["Autenticação", "Login, cadastro, validação de usuário e conexão com banco/API."],
      ["Atualizador", "Baixar arquivos, verificar versão, reparar instalação e abrir jogo."],
    ],
  },
  {
    title: "SITES & REPOSITORIOS",
    price: "A partir de R$: 50,00",
    intro: "Sites modernos, páginas de apresentação, vitrines, portfólios, landing pages e repositórios organizados.",
    canDo: [
      ["Sites interativos", "Menus, animações, botões, sliders, formulários, efeitos visuais e páginas modernas."],
      ["Sistemas web", "Painel de login, dashboard, loja online, cadastro e painel administrativo."],
      ["Bots e APIs", "Integração com bots, atendimento, comandos e sistemas com dados dinâmicos."],
      ["WebGL", "Partículas, animações neon, sites futuristas e interfaces estilo game usando Three.js/WebGL."],
      ["Banco de dados", "Cadastro de usuários, produtos, pedidos, mensagens, ranking e inventário."],
      ["Launchers", "Launchers simples para jogos e servidores usando Electron."],
    ],
  },
  {
    title: "PROJETOS ESCOLARES",
    price: "A partir de R$: 5,00",
    intro: "Ajuda em trabalhos escolares, cursos e faculdade, com código organizado e explicação do funcionamento.",
    canDo: [
      ["Programação", "Python, Java, C, C++, C#, JavaScript, HTML, CSS e banco de dados."],
      ["Sistemas simples", "Cadastro, login, estoque, biblioteca, loja, agenda e painel."],
      ["Explicação", "Descrição do código, lógica usada e orientação para apresentar o trabalho."],
      ["Documentação", "README, prints, passo a passo, requisitos e instruções de execução."],
      ["Interface", "Telas mais bonitas, responsivas e organizadas para entrega."],
      ["Correção", "Ajustar erros, melhorar nota visual e resolver bugs antes da apresentação."],
    ],
  },
  {
    title: "BANCO MYSQL",
    price: "A partir de R$: 20,00",
    intro: "Banco MySQL para armazenar dados de sites, bots, servidores e sistemas com organização e segurança.",
    canDo: [
      ["Modelagem", "Criar tabelas, relacionamentos, campos, índices e estrutura do banco."],
      ["CRUD", "Cadastro, listagem, edição, exclusão e busca de registros."],
      ["Login", "Usuários, senhas, permissões, sessões e controle de acesso."],
      ["Integração", "Conectar MySQL com Python, Java, PHP, Node.js, bots e servidores."],
      ["Relatórios", "Consultas, filtros, rankings, históricos e exportação de dados."],
      ["Backup", "Importar, exportar, limpar e organizar dados importantes."],
    ],
  },
  {
    title: "RENDA EXTRA",
    price: "A partir de R$: 50,00",
    intro: "Ideias e sistemas para criar produtos digitais, automatizar processos e montar pequenas fontes de renda online.",
    canDo: [
      ["Vitrine de serviços", "Página para divulgar trabalho, preço, contato e portfólio."],
      ["Loja simples", "Catálogo, pedidos por WhatsApp, produtos digitais e checkout externo."],
      ["Automação", "Reduzir tarefas manuais e acelerar atendimento, cadastro e divulgação."],
      ["Bots", "Bot de atendimento, vendas, dúvidas frequentes, tickets e avisos."],
      ["Comunidade", "Discord, cargos, sistemas de membros, eventos e monetização."],
      ["Consultoria", "Organizar a ideia e transformar em um projeto viável."],
    ],
  },
  {
    title: "ANT-XITER / ANT-DDOS",
    price: "A partir de R$: 65,00",
    intro: "Proteções e ajustes para reduzir abuso, trapaças, flood e ataques básicos em servidores e comunidades.",
    canDo: [
      ["Anti xiter", "Detectar padrões suspeitos, abuso de comandos, velocidade, armas e ações indevidas."],
      ["Anti flood", "Limitar mensagens, comandos, conexões repetidas e spam."],
      ["Logs", "Registrar ações, punições, alertas, comandos e eventos importantes."],
      ["Permissões", "Separar cargos, acessos, comandos administrativos e áreas protegidas."],
      ["Proteção de bot", "Controle de comandos, rate limit, verificação e segurança básica."],
      ["Monitoramento", "Alertas, histórico, painel simples e revisão de comportamento."],
    ],
  },
  {
    title: "AULA PERSONALIZADA!",
    price: "A partir de R$: 10,00",
    intro: "Aulas personalizadas para aprender programação construindo algo real, no seu ritmo e com foco no seu objetivo.",
    canDo: [
      ["Base de programação", "Lógica, variáveis, condições, laços, funções, arrays e organização."],
      ["Projetos práticos", "Criar bots, sites, sistemas, launchers ou scripts durante a aula."],
      ["JavaScript", "DOM, eventos, APIs, animações, Node.js, banco e interfaces modernas."],
      ["Python", "Automação, bots, arquivos, web scraping, APIs e sistemas simples."],
      ["Web", "HTML, CSS, responsividade, layout, formulário, publicação e portfólio."],
      ["Debug", "Aprender a encontrar erros, entender logs e corrigir bugs."],
    ],
  },
];

const pawnoSnippets = [
  `HCMD(darvida)
{
    if(Spawnado[playerid] == false) return SCM(playerid, Cor_Erro, "Erro");
    new ID, vida, string[128];
    if(sscanf(params, "id", ID, vida)) return SendClientMessage(playerid, ciano, "Modo De Uso");
    SetPlayerHealthEx(ID, vida);
    return 1;
}`,
  `CMD:desautenticardis(playerid, params[])
{
    CancelarAFK(playerid);
    if(pInfo[playerid][pAdmin] < 3) return NAOADM;
    new id;
    if(sscanf(params, "d", id)) return SCM(playerid, ciano, "Modo De Uso");
    SaveAutentication(id);
    return 1;
}`,
  `stock AtualizarInventario(playerid)
{
    for(new slot = 0; slot < MAX_INVENTARIO; slot++)
    {
        PlayerTextDrawShow(playerid, invSlot[playerid][slot]);
        format(str, sizeof str, "%s", ItemNome[playerid][slot]);
    }
    return 1;
}`,
  `mysql_format(Conexao, query, sizeof query,
    "UPDATE contas SET dinheiro=%d, banco=%d, level=%d WHERE id=%d",
    pInfo[playerid][pDinheiro], pInfo[playerid][pBanco], pInfo[playerid][pLevel], pInfo[playerid][pID]);
mysql_tquery(Conexao, query);`,
  `public OnPlayerConnect(playerid)
{
    ResetPlayerData(playerid);
    SendClientMessage(playerid, verde, "Nova Roleplay carregando...");
    SetTimerEx("CarregarConta", 800, false, "d", playerid);
    return 1;
}`,
];

function buildCodeWall() {
  if (!codeColumns.length) return;
  const filler = pawnoSnippets.join("\n\n// ----------------------------------------\n\n");
  codeColumns.forEach((column, index) => {
    column.textContent = Array.from({ length: 5 + index }, (_, repeatIndex) => (
      `// XEXEU DEV,S :: MODULO ${String(index + 1).padStart(2, "0")}.${repeatIndex}\n${filler}`
    )).join("\n\n");
  });
}

buildCodeWall();

const smokeMouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
const smokeParticles = Array.from({ length: 112 }, (_, index) => ({
  x: 18 + Math.random() * Math.max(260, window.innerWidth * 0.48),
  y: window.innerHeight * (0.24 + Math.random() * 0.62),
  baseX: 18 + Math.random() * Math.max(260, window.innerWidth * 0.48),
  radius: 34 + Math.random() * 86,
  drift: 0.18 + Math.random() * 0.72,
  phase: index * 0.61 + Math.random() * 6,
  alpha: 0.035 + Math.random() * 0.075,
}));

function resizeSmokeCanvas() {
  if (!smokeCanvas) return;
  smokeCanvas.width = Math.max(1, Math.floor(window.innerWidth * Math.min(window.devicePixelRatio || 1, 1.25)));
  smokeCanvas.height = Math.max(1, Math.floor(window.innerHeight * Math.min(window.devicePixelRatio || 1, 1.25)));
}

function renderSmoke(delta, elapsed) {
  if (!smokeCtx || !smokeCanvas) return;
  const scaleX = smokeCanvas.width / window.innerWidth;
  const scaleY = smokeCanvas.height / window.innerHeight;
  smokeCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
  smokeCtx.globalCompositeOperation = "lighter";
  smokeParticles.forEach((particle, index) => {
    const dx = particle.x - smokeMouse.x;
    const dy = particle.y - smokeMouse.y;
    const mouseDistance = Math.hypot(dx, dy);
    if (mouseDistance < 190) {
      const power = (1 - mouseDistance / 190) * 0.95;
      particle.x += smokeMouse.vx * power * 0.028 + (dx / Math.max(mouseDistance, 1)) * power * 1.8;
      particle.y += smokeMouse.vy * power * 0.028 + (dy / Math.max(mouseDistance, 1)) * power * 1.2;
    }
    particle.x += Math.sin(elapsed * particle.drift + particle.phase) * 0.22 + delta * 4.4;
    particle.y += Math.cos(elapsed * (particle.drift * 0.72) + particle.phase) * 0.34;
    particle.x += (particle.baseX - particle.x) * 0.006;
    if (particle.x > window.innerWidth * 0.54) {
      particle.x = -particle.radius;
      particle.y = window.innerHeight * (0.18 + Math.random() * 0.7);
      particle.baseX = 18 + Math.random() * Math.max(260, window.innerWidth * 0.48);
    }

    const x = particle.x * scaleX;
    const y = particle.y * scaleY;
    const radius = particle.radius * scaleX * (0.86 + Math.sin(elapsed + index) * 0.08);
    const gradient = smokeCtx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(125, 255, 60, ${particle.alpha * 1.4})`);
    gradient.addColorStop(0.45, `rgba(43, 255, 87, ${particle.alpha})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    smokeCtx.fillStyle = gradient;
    smokeCtx.beginPath();
    smokeCtx.arc(x, y, radius, 0, Math.PI * 2);
    smokeCtx.fill();
  });
  smokeMouse.vx *= 0.72;
  smokeMouse.vy *= 0.72;
  smokeCtx.globalCompositeOperation = "source-over";
}

const root = new THREE.Group();
const columnAnchor = new THREE.Group();
const orbitAnchor = new THREE.Group();
const heroAnchor = new THREE.Group();
const ceilingAnchor = new THREE.Group();
const galleryAnchor = new THREE.Group();
const galleryRoom = new THREE.Group();
const galleryDisplays = new THREE.Group();
const galleryProjects = new THREE.Group();
const mistAnchor = new THREE.Group();
const heroLetterAnchor = new THREE.Group();
scene.add(root, mistAnchor, galleryAnchor);
root.add(columnAnchor, orbitAnchor, heroAnchor, ceilingAnchor);
heroAnchor.add(heroLetterAnchor);
galleryAnchor.add(galleryRoom, galleryDisplays, galleryProjects);
galleryAnchor.visible = false;

const ambient = new THREE.HemisphereLight(0x9bdfff, 0x110014, 1.55);
scene.add(ambient);

const keyLight = new THREE.PointLight(0x7df7ff, 84, 48);
keyLight.position.set(-4.8, 5.6, 7.2);
scene.add(keyLight);

const magentaLight = new THREE.PointLight(0xff4bd8, 72, 44);
magentaLight.position.set(5.4, -0.2, 6.2);
scene.add(magentaLight);

const backLight = new THREE.PointLight(0x62ffc4, 58, 54);
backLight.position.set(0, 2.8, -7.4);
scene.add(backLight);

const galleryAmbient = new THREE.HemisphereLight(0xffffff, 0x5d5d59, 0);
scene.add(galleryAmbient);

const galleryKeyLight = new THREE.SpotLight(0xffffff, 0, 22, Math.PI / 4.6, 0.64, 1.05);
galleryKeyLight.position.set(-2.8, 3.3, 4.5);
galleryKeyLight.target.position.set(0, 0.2, -3.8);
scene.add(galleryKeyLight, galleryKeyLight.target);

const galleryFillLight = new THREE.PointLight(0xf7f4e8, 0, 20);
galleryFillLight.position.set(3.8, 2.1, 1.8);
scene.add(galleryFillLight);

const aura = new THREE.Group();
let columnModel = null;
let galleryModel = null;
const columnSegments = [];
const galleryLightPoints = [];
const galleryProjectRayTargets = [];
const galleryProjectGroups = [];
const auraMaterials = [
  new THREE.MeshBasicMaterial({ color: state.colors.cyan, transparent: true, opacity: 0.36, blending: THREE.AdditiveBlending, depthWrite: false }),
  new THREE.MeshBasicMaterial({ color: state.colors.pink, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false }),
  new THREE.MeshBasicMaterial({ color: state.colors.green, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false }),
];

for (let i = 0; i < 3; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15 + i * 0.42, 0.009, 8, 128), auraMaterials[i % auraMaterials.length]);
  ring.rotation.set(Math.PI * (0.48 + i * 0.08), i * 0.58, i * 0.92);
  aura.add(ring);
}
columnAnchor.add(aura);

const fallbackColumnMaterial = new THREE.MeshStandardMaterial({
  color: 0xbaffdc,
  metalness: 0.74,
  roughness: 0.28,
  emissive: 0x092d15,
  emissiveIntensity: 0.72,
});

const gltfLoader = new GLTFLoader();

const galleryWallMaterial = new THREE.MeshStandardMaterial({
  color: 0xa8a8a3,
  roughness: 0.72,
  metalness: 0.04,
});

const galleryFloorMaterial = new THREE.MeshStandardMaterial({
  color: 0xbcbcb6,
  roughness: 0.58,
  metalness: 0.02,
});

const galleryDarkMaterial = new THREE.MeshStandardMaterial({
  color: 0x3c3c39,
  roughness: 0.8,
  metalness: 0.08,
});

const galleryGlowMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.34,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const galleryPedestalSlots = [
  { x: -4.08, z: 1.04, scale: 1.18, yaw: 0.2 },
  { x: -2.45, z: -0.72, scale: 0.98, yaw: 0.12 },
  { x: -0.76, z: -2.32, scale: 0.82, yaw: 0.04 },
  { x: 0.94, z: -2.32, scale: 0.82, yaw: -0.04 },
  { x: 2.56, z: -0.72, scale: 0.98, yaw: -0.12 },
  { x: 4.08, z: 1.04, scale: 1.18, yaw: -0.2 },
];
const projectButtons = Array.from(document.querySelectorAll("[data-project-open]"));

function addGalleryBox(width, height, depth, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.receiveShadow = false;
  mesh.castShadow = false;
  galleryRoom.add(mesh);
  return mesh;
}

addGalleryBox(11.2, 0.08, 16.4, 0, -1.36, -3.35, galleryFloorMaterial);
addGalleryBox(0.08, 4.8, 16.4, -5.58, 1.02, -3.35, galleryWallMaterial);
addGalleryBox(0.08, 4.8, 16.4, 5.58, 1.02, -3.35, galleryWallMaterial);
addGalleryBox(11.2, 4.8, 0.08, 0, 1.02, -11.55, galleryWallMaterial);
addGalleryBox(11.2, 0.08, 16.4, 0, 3.42, -3.35, galleryWallMaterial);
addGalleryBox(0.06, 0.08, 12.8, -2.55, 3.27, -3.35, galleryDarkMaterial);
addGalleryBox(0.06, 0.08, 12.8, 2.55, 3.27, -3.35, galleryDarkMaterial);

function createWallGlowTexture() {
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = 512;
  glowCanvas.height = 512;
  const ctx = glowCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(256, 108, 0, 256, 108, 250);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.82)");
  gradient.addColorStop(0.28, "rgba(255, 255, 255, 0.34)");
  gradient.addColorStop(0.68, "rgba(255, 255, 255, 0.08)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(glowCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

const wallGlowTexture = createWallGlowTexture();
const wallGlowMaterial = new THREE.MeshBasicMaterial({
  map: wallGlowTexture,
  transparent: true,
  opacity: 0.42,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});

[-4.4, -2.65, -0.95, 0.85, 2.72].forEach((z, index) => {
  const leftGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 2.4), wallGlowMaterial.clone());
  leftGlow.position.set(-5.525, 1.18 + Math.sin(index) * 0.05, z);
  leftGlow.rotation.y = Math.PI / 2;
  leftGlow.material.opacity = 0.2 + (index % 2) * 0.08;
  galleryRoom.add(leftGlow);

  const rightGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 2.4), wallGlowMaterial.clone());
  rightGlow.position.set(5.525, 1.18 + Math.cos(index) * 0.05, z);
  rightGlow.rotation.y = -Math.PI / 2;
  rightGlow.material.opacity = 0.2 + ((index + 1) % 2) * 0.08;
  galleryRoom.add(rightGlow);
});

galleryPedestalSlots.forEach((slot, index) => {
  const glow = new THREE.Mesh(new THREE.CircleGeometry(0.78 * slot.scale, 48), galleryGlowMaterial.clone());
  glow.position.set(slot.x, -1.31, slot.z);
  glow.rotation.x = -Math.PI / 2;
  glow.material.opacity = 0.24 + index * 0.012;
  galleryRoom.add(glow);

  const topLight = new THREE.PointLight(0xffffff, 0, 4.2);
  topLight.position.set(slot.x, 1.8, slot.z + 0.08);
  topLight.userData.galleryBaseIntensity = 0.9 + slot.scale * 0.34;
  galleryLightPoints.push(topLight);
  galleryRoom.add(topLight);
});

function addFallbackGalleryPedestal(slot) {
  const pedestalGroup = new THREE.Group();
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x8f938d,
    roughness: 0.54,
    metalness: 0.08,
  });
  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0x253531,
    roughness: 0.34,
    metalness: 0.24,
    emissive: 0x06170f,
    emissiveIntensity: 0.22,
  });
  const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0xc99d3b,
    roughness: 0.28,
    metalness: 0.62,
    emissive: 0x201202,
    emissiveIntensity: 0.18,
  });
  const column = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.64, 0.72), baseMaterial);
  column.position.y = -0.54;
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.14, 1.08), galleryDarkMaterial.clone());
  base.position.y = -1.36;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.13, 1.02), topMaterial);
  top.position.y = 0.33;
  const upperTrim = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.055, 1.12), trimMaterial);
  upperTrim.position.y = 0.22;
  const lowerTrim = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.055, 0.98), trimMaterial);
  lowerTrim.position.y = -1.17;
  pedestalGroup.add(base, column, lowerTrim, upperTrim, top);
  pedestalGroup.position.set(slot.x, -0.04, slot.z);
  pedestalGroup.rotation.y = slot.yaw;
  pedestalGroup.scale.setScalar(slot.scale);
  galleryDisplays.add(pedestalGroup);
  return pedestalGroup;
}

function createGalleryTextTexture(title, subtitle, width = 512, height = 192) {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = width;
  labelCanvas.height = height;
  const ctx = labelCanvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fff6bd");
  gradient.addColorStop(0.55, "#d9a538");
  gradient.addColorStop(1, "#8c641a");
  ctx.fillStyle = "rgba(8, 7, 5, 0.88)";
  ctx.beginPath();
  ctx.roundRect(18, 18, width - 36, height - 36, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 215, 112, 0.92)";
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.fillStyle = gradient;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 44px Courier New, monospace";
  ctx.fillText(title.toUpperCase(), width * 0.5, height * 0.42, width - 64);
  ctx.fillStyle = "#fff0a0";
  ctx.font = "900 28px Courier New, monospace";
  ctx.fillText(subtitle.toUpperCase(), width * 0.5, height * 0.72, width - 76);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createGalleryProjectExhibit(slot, index, button) {
  if (!button) return;
  const group = new THREE.Group();
  const topY = -0.04 + 0.395 * slot.scale;
  const frameWidth = 1.18 * slot.scale;
  const frameHeight = 0.66 * slot.scale;
  const frameDepth = 0.06 * slot.scale;
  const imageSrc = button.dataset.projectImage || button.querySelector("img")?.getAttribute("src") || "";
  const title = button.dataset.projectTitle || button.querySelector(".frame-name")?.textContent || "Projeto";
  const subtitle = button.querySelector(".frame-plaque")?.textContent || "Projeto";

  group.position.set(slot.x, topY + frameHeight * 0.45, slot.z - 0.22 * slot.scale);
  group.rotation.y = slot.yaw * 0.7;
  group.userData.projectIndex = index;

  const frameBack = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth + 0.14 * slot.scale, frameHeight + 0.13 * slot.scale, frameDepth),
    new THREE.MeshStandardMaterial({
      color: 0x090806,
      metalness: 0.74,
      roughness: 0.24,
      emissive: 0x261500,
      emissiveIntensity: 0.18,
    }),
  );
  frameBack.userData.projectIndex = index;
  group.add(frameBack);
  galleryProjectRayTargets.push(frameBack);

  const goldLip = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth + 0.05 * slot.scale, frameHeight + 0.04 * slot.scale, frameDepth * 1.14),
    new THREE.MeshStandardMaterial({
      color: 0xc99d3b,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x2b1700,
      emissiveIntensity: 0.18,
    }),
  );
  goldLip.position.z = 0.012 * slot.scale;
  goldLip.scale.set(1, 1, 0.62);
  goldLip.userData.projectIndex = index;
  group.add(goldLip);
  galleryProjectRayTargets.push(goldLip);

  const imageMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const imagePlane = new THREE.Mesh(new THREE.PlaneGeometry(frameWidth, frameHeight), imageMaterial);
  imagePlane.position.z = frameDepth * 0.78;
  imagePlane.userData.projectIndex = index;
  group.add(imagePlane);
  galleryProjectRayTargets.push(imagePlane);

  if (imageSrc) {
    textureLoader.load(imageSrc, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      imageMaterial.map = texture;
      imageMaterial.needsUpdate = true;
    });
  }

  const plaqueTexture = createGalleryTextTexture(title, subtitle);
  const plaque = new THREE.Mesh(
    new THREE.PlaneGeometry(frameWidth * 0.95, 0.26 * slot.scale),
    new THREE.MeshBasicMaterial({
      map: plaqueTexture,
      transparent: true,
      side: THREE.DoubleSide,
    }),
  );
  plaque.position.set(0, -frameHeight * 0.5 - 0.22 * slot.scale, frameDepth * 0.9);
  plaque.userData.projectIndex = index;
  group.add(plaque);
  galleryProjectRayTargets.push(plaque);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.64 * slot.scale, 40),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
  );
  shadow.position.set(0, -frameHeight * 0.5 - 0.05 * slot.scale, -0.03);
  shadow.rotation.x = -Math.PI / 2;
  group.add(shadow);

  galleryProjects.add(group);
  galleryProjectGroups.push(group);
}

function buildGalleryPedestalCorridor() {
  galleryPedestalSlots.forEach(addFallbackGalleryPedestal);
  galleryPedestalSlots.forEach((slot, index) => createGalleryProjectExhibit(slot, index, projectButtons[index]));
  galleryModel = galleryDisplays;
  state.loadedGallery = true;
}

galleryAnchor.position.set(0, 0, 0);
galleryAnchor.rotation.set(0, 0, 0);

buildGalleryPedestalCorridor();

gltfLoader.load(
  "./assets/model/coluna-site.glb",
  (gltf) => {
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    bounds.getSize(size);
    bounds.getCenter(center);
    const maxAxis = Math.max(size.x, size.y, size.z, 1);

    model.position.sub(center);
    model.scale.set(11.4 / maxAxis, 8.15 / maxAxis, 11.4 / maxAxis);
    model.rotation.set(0, 0, 0);
    model.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      child.material = materials.map((material) => {
        const tuned = material ? material.clone() : fallbackColumnMaterial.clone();
        tuned.side = THREE.DoubleSide;
        if ("metalness" in tuned) tuned.metalness = Math.max(tuned.metalness ?? 0, 0.42);
        if ("roughness" in tuned) tuned.roughness = Math.min(tuned.roughness ?? 0.45, 0.42);
        if ("emissive" in tuned) {
          tuned.emissive = new THREE.Color(0x082814);
          tuned.emissiveIntensity = Math.max(tuned.emissiveIntensity ?? 0, 0.28);
        }
        return tuned;
      });
      if (child.material.length === 1) {
        child.material = child.material[0];
      }
      child.castShadow = false;
      child.receiveShadow = false;
      child.frustumCulled = false;
    });

    columnModel = new THREE.Group();
    [-2, -1, 0, 1, 2].forEach((segmentIndex) => {
      const segment = segmentIndex === 0 ? model : model.clone(true);
      segment.position.y = towerCenterY + segmentIndex * 7.25;
      columnModel.add(segment);
      columnSegments.push(segment);
    });
    columnAnchor.add(columnModel);
    state.loadedColumn = true;
  },
  undefined,
  () => {
    state.loadedColumn = false;
  },
);

function getTowerProgress(progress) {
  return THREE.MathUtils.clamp((progress - towerScrollStart) / (towerScrollEnd - towerScrollStart), 0, 1);
}

const glassParticleCount = 420;
const glassParticlePositions = new Float32Array(glassParticleCount * 3);
const glassParticleColors = new Float32Array(glassParticleCount * 3);
const glassParticleSeeds = new Float32Array(glassParticleCount);
const starGold = new THREE.Color("#ffd66b");
const starWhite = new THREE.Color("#fff7dd");
const starShadow = new THREE.Color("#17120a");

function createStarSpriteTexture() {
  const starCanvas = document.createElement("canvas");
  starCanvas.width = 64;
  starCanvas.height = 64;
  const ctx = starCanvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.24, "rgba(255, 230, 132, 0.92)");
  gradient.addColorStop(0.58, "rgba(68, 49, 19, 0.38)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(starCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

const starSpriteTexture = createStarSpriteTexture();

for (let i = 0; i < glassParticleCount; i += 1) {
  const i3 = i * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = 0.7 + Math.random() * 1.85;
  const height = (Math.random() - 0.5) * 5.4;
  glassParticlePositions[i3] = Math.cos(angle) * radius;
  glassParticlePositions[i3 + 1] = height;
  glassParticlePositions[i3 + 2] = Math.sin(angle) * radius * 0.58;
  glassParticleSeeds[i] = Math.random();

  const color = glassParticleSeeds[i] > 0.72 ? starWhite : glassParticleSeeds[i] > 0.28 ? starGold : starShadow;
  glassParticleColors[i3] = color.r;
  glassParticleColors[i3 + 1] = color.g;
  glassParticleColors[i3 + 2] = color.b;
}

const glassParticleGeometry = new THREE.BufferGeometry();
glassParticleGeometry.setAttribute("position", new THREE.BufferAttribute(glassParticlePositions, 3));
glassParticleGeometry.setAttribute("color", new THREE.BufferAttribute(glassParticleColors, 3));

const glassParticleMaterial = new THREE.PointsMaterial({
  size: 0.034,
  map: starSpriteTexture,
  vertexColors: true,
  transparent: true,
  opacity: 0.72,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const glassParticles = new THREE.Points(glassParticleGeometry, glassParticleMaterial);
columnAnchor.add(glassParticles);

const debrisCount = 280;
const debrisDummy = new THREE.Object3D();
const debrisData = Array.from({ length: debrisCount }, (_, index) => ({
  angle: Math.random() * Math.PI * 2,
  radius: 0.9 + Math.random() * 3.25,
  height: (Math.random() - 0.5) * ((towerTopY - towerBottomY) + 6.2),
  speed: 0.08 + Math.random() * 0.24,
  spin: new THREE.Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2),
  scale: 0.035 + Math.random() * 0.105,
  phase: index * 0.49 + Math.random() * 5,
}));
const debrisGeometry = new THREE.BoxGeometry(1, 1, 1);
const debrisMaterial = new THREE.MeshStandardMaterial({
  color: 0x050706,
  metalness: 0.52,
  roughness: 0.32,
  emissive: 0x041407,
  emissiveIntensity: 0.22,
  transparent: true,
  opacity: 0.86,
});
const debrisMesh = new THREE.InstancedMesh(debrisGeometry, debrisMaterial, debrisCount);
debrisMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
columnAnchor.add(debrisMesh);

function updateDebris(elapsed, visibleAmount) {
  debrisMesh.visible = visibleAmount > 0.02;
  debrisMaterial.opacity = 0.38 + visibleAmount * 0.48;
  debrisData.forEach((piece, index) => {
    const angle = piece.angle + elapsed * piece.speed;
    const wobble = Math.sin(elapsed * 0.7 + piece.phase) * 0.18;
    debrisDummy.position.set(
      Math.cos(angle) * (piece.radius + wobble),
      towerCenterY + piece.height + Math.sin(elapsed * 0.55 + piece.phase) * 0.14,
      Math.sin(angle) * (piece.radius * 0.55 + wobble * 0.3),
    );
    debrisDummy.rotation.set(
      elapsed * piece.spin.x + piece.phase,
      elapsed * piece.spin.y,
      elapsed * piece.spin.z,
    );
    debrisDummy.scale.set(piece.scale * 1.45, piece.scale * (0.5 + (index % 3) * 0.42), piece.scale * 1.02);
    debrisDummy.updateMatrix();
    debrisMesh.setMatrixAt(index, debrisDummy.matrix);
  });
  debrisMesh.instanceMatrix.needsUpdate = true;
}

const particleCount = 900;
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
const particleSeeds = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i += 1) {
  const i3 = i * 3;
  const cluster = Math.random() > 0.48;
  const angle = Math.random() * Math.PI * 2;
  const radius = cluster ? 1.45 + Math.random() * 4.2 : 5 + Math.random() * 24;
  const height = cluster ? (Math.random() - 0.5) * 5.8 : (Math.random() - 0.5) * 12;
  const sideBias = cluster ? (Math.random() > 0.5 ? 1 : -1) * (1.1 + Math.random() * 1.5) : 0;

  particlePositions[i3] = Math.cos(angle) * radius + sideBias;
  particlePositions[i3 + 1] = height;
  particlePositions[i3 + 2] = Math.sin(angle) * radius * (cluster ? 0.34 : 0.72);
  particleSeeds[i] = Math.random();

  const color = particleSeeds[i] > 0.76 ? starWhite : particleSeeds[i] > 0.22 ? starGold : starShadow;
  particleColors[i3] = color.r;
  particleColors[i3 + 1] = color.g;
  particleColors[i3 + 2] = color.b;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.026,
  map: starSpriteTexture,
  vertexColors: true,
  transparent: true,
  opacity: 0.84,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
mistAnchor.add(particles);

const chameleonParticleCount = 520;
const chameleonPositions = new Float32Array(chameleonParticleCount * 3);
const chameleonColors = new Float32Array(chameleonParticleCount * 3);
const chameleonSeeds = new Float32Array(chameleonParticleCount);
const chameleonPalette = [
  new THREE.Color("#7cff00"),
  new THREE.Color("#00ffc8"),
  new THREE.Color("#fff200"),
  new THREE.Color("#7df9ff"),
  new THREE.Color("#111827"),
];

for (let i = 0; i < chameleonParticleCount; i += 1) {
  const i3 = i * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.4 + Math.random() * 9.5;
  const color = chameleonPalette[i % chameleonPalette.length];
  chameleonPositions[i3] = 1.2 + Math.cos(angle) * radius + Math.random() * 5.4;
  chameleonPositions[i3 + 1] = (Math.random() - 0.5) * 18;
  chameleonPositions[i3 + 2] = -1.8 + Math.sin(angle) * radius * 0.48;
  chameleonSeeds[i] = Math.random() * Math.PI * 2;
  chameleonColors[i3] = color.r;
  chameleonColors[i3 + 1] = color.g;
  chameleonColors[i3 + 2] = color.b;
}

const chameleonGeometry = new THREE.BufferGeometry();
chameleonGeometry.setAttribute("position", new THREE.BufferAttribute(chameleonPositions, 3));
chameleonGeometry.setAttribute("color", new THREE.BufferAttribute(chameleonColors, 3));
const chameleonMaterial = new THREE.PointsMaterial({
  size: 0.02,
  map: starSpriteTexture,
  vertexColors: true,
  transparent: true,
  opacity: 0.28,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const chameleonParticles = new THREE.Points(chameleonGeometry, chameleonMaterial);
mistAnchor.add(chameleonParticles);

const pyramidCount = 22;
const pyramidDummy = new THREE.Object3D();
const pyramidData = Array.from({ length: pyramidCount }, (_, index) => ({
  angle: (index / pyramidCount) * Math.PI * 2 + Math.random() * 0.4,
  radius: 2.1 + Math.random() * 4.8,
  y: towerBottomY + Math.random() * (towerTopY - towerBottomY),
  speed: 0.06 + Math.random() * 0.12,
  scale: 0.08 + Math.random() * 0.12,
  phase: Math.random() * Math.PI * 2,
}));
const pyramidGeometry = new THREE.ConeGeometry(0.5, 0.78, 4, 1);
const pyramidMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  emissive: 0x7a5100,
  emissiveIntensity: 0.48,
  metalness: 0.72,
  roughness: 0.28,
  transparent: true,
  opacity: 0.88,
});
const pyramidMesh = new THREE.InstancedMesh(pyramidGeometry, pyramidMaterial, pyramidCount);
pyramidMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
columnAnchor.add(pyramidMesh);

function updatePyramids(elapsed, visibleAmount) {
  pyramidMesh.visible = visibleAmount > 0.08;
  pyramidMaterial.opacity = 0.34 + visibleAmount * 0.54;
  pyramidData.forEach((piece, index) => {
    const angle = piece.angle + elapsed * piece.speed;
    pyramidDummy.position.set(
      Math.cos(angle) * piece.radius,
      piece.y + Math.sin(elapsed * 0.48 + piece.phase) * 0.2,
      Math.sin(angle) * piece.radius * 0.62,
    );
    pyramidDummy.rotation.set(
      elapsed * (0.2 + index * 0.01),
      -angle + elapsed * 0.42,
      Math.sin(elapsed + piece.phase) * 0.22,
    );
    pyramidDummy.scale.setScalar(piece.scale);
    pyramidDummy.updateMatrix();
    pyramidMesh.setMatrixAt(index, pyramidDummy.matrix);
  });
  pyramidMesh.instanceMatrix.needsUpdate = true;
}

function createCeilingTexture() {
  const ceilingCanvas = document.createElement("canvas");
  ceilingCanvas.width = 1024;
  ceilingCanvas.height = 512;
  const ctx = ceilingCanvas.getContext("2d");
  ctx.clearRect(0, 0, ceilingCanvas.width, ceilingCanvas.height);

  const bg = ctx.createLinearGradient(0, 0, 0, ceilingCanvas.height);
  bg.addColorStop(0, "rgba(125, 249, 255, 0.34)");
  bg.addColorStop(0.38, "rgba(18, 74, 84, 0.18)");
  bg.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, ceilingCanvas.width, ceilingCanvas.height);

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 14; i += 1) {
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255, 255, 255, 0.24)" : "rgba(125, 249, 255, 0.2)";
    ctx.lineWidth = 1.2 + (i % 4) * 0.35;
    ctx.beginPath();
    const y = 24 + i * 30;
    ctx.moveTo(-80, y);
    for (let x = -80; x <= ceilingCanvas.width + 90; x += 24) {
      ctx.lineTo(x, y + Math.sin(x * 0.025 + i * 0.77) * (12 + i * 0.4));
    }
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "lighter";
  const hexSize = 24;
  for (let row = 0; row < 11; row += 1) {
    for (let col = 0; col < 28; col += 1) {
      const x = col * hexSize * 1.55 + (row % 2) * hexSize * 0.78 - 40;
      const y = 86 + row * hexSize * 1.16;
      const alpha = 0.035 + Math.sin(row * 0.8 + col * 0.33) * 0.025;
      ctx.strokeStyle = `rgba(255, 244, 186, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let k = 0; k < 6; k += 1) {
        const a = Math.PI / 6 + k * Math.PI / 3;
        const px = x + Math.cos(a) * hexSize;
        const py = y + Math.sin(a) * hexSize;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(ceilingCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.4, 1);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

const ceilingTexture = createCeilingTexture();
const ceilingMaterial = new THREE.MeshBasicMaterial({
  map: ceilingTexture,
  color: 0xbfffff,
  transparent: true,
  opacity: 0,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const ceilingPlane = new THREE.Mesh(new THREE.PlaneGeometry(14.4, 12.8, 1, 1), ceilingMaterial);
ceilingPlane.rotation.x = -Math.PI / 2;
ceilingPlane.position.set(0, 8.46, 1.12);
ceilingAnchor.add(ceilingPlane);

const ceilingRingMaterial = new THREE.LineBasicMaterial({
  color: 0xffe8a8,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending,
});
for (let i = 0; i < 4; i += 1) {
  const ring = new THREE.LineLoop(createRoundedBorderGeometry(2.4 + i * 0.72, 1.14 + i * 0.34, 0.18));
  ring.material = ceilingRingMaterial.clone();
  ring.rotation.x = -Math.PI / 2;
  ring.rotation.z = i * 0.34;
  ring.position.set(0, 8.38 - i * 0.055, 1.06);
  ceilingAnchor.add(ring);
}

function createHeroInfoTexture() {
  const infoCanvas = document.createElement("canvas");
  infoCanvas.width = 2060;
  infoCanvas.height = 760;
  const ctx = infoCanvas.getContext("2d");
  ctx.clearRect(0, 0, infoCanvas.width, infoCanvas.height);
  const cx = infoCanvas.width / 2;

  const bg = ctx.createLinearGradient(0, 0, infoCanvas.width, infoCanvas.height);
  bg.addColorStop(0, "rgba(0, 217, 255, 0.18)");
  bg.addColorStop(0.48, "rgba(2, 10, 16, 0.76)");
  bg.addColorStop(1, "rgba(0, 255, 200, 0.14)");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(70, 62, infoCanvas.width - 140, infoCanvas.height - 124, 58);
  ctx.fill();
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fill();
  ctx.strokeStyle = "rgba(125, 249, 255, 0.56)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(125, 249, 255, 0.65)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "rgba(239, 255, 255, 0.94)";
  ctx.font = '700 45px "Courier New", monospace';
  ctx.fillText("FULL STACK  |  FREELANCER  |  SAMP/MTA  |  SITES  |  APPS", cx, 158);

  ctx.shadowBlur = 10;
  ctx.fillStyle = "rgba(190, 255, 216, 0.92)";
  ctx.font = '700 36px "Courier New", monospace';
  ctx.fillText("Sites, apps, launchers, bots e servidores SAMP/MTA.", cx, 296);
  ctx.fillText("Paineis, automacoes, MySQL, correcoes, anti-xiter e aulas.", cx, 386);
  ctx.fillText("4+ anos programando  |  atendimento 24/7  |  Pix facilitado.", cx, 476);

  ctx.fillStyle = "rgba(255, 226, 94, 0.92)";
  ctx.font = '700 32px "Courier New", monospace';
  ctx.fillText("Deslize para entrar na torre de servicos", cx, 610);

  const texture = new THREE.CanvasTexture(infoCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createHeroFallbackTexture() {
  const titleCanvas = document.createElement("canvas");
  titleCanvas.width = 1600;
  titleCanvas.height = 360;
  const ctx = titleCanvas.getContext("2d");
  ctx.clearRect(0, 0, titleCanvas.width, titleCanvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255, 215, 0, 0.76)";
  ctx.shadowBlur = 28;
  const gradient = ctx.createLinearGradient(0, 72, 0, 278);
  gradient.addColorStop(0, "rgba(255, 255, 236, 0.58)");
  gradient.addColorStop(0.34, "rgba(255, 229, 116, 0.42)");
  gradient.addColorStop(0.72, "rgba(204, 166, 54, 0.34)");
  gradient.addColorStop(1, "rgba(255, 247, 194, 0.45)");
  ctx.fillStyle = gradient;
  ctx.font = '900 156px "Arial Black", Impact, sans-serif';
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255, 242, 174, 0.9)";
  ctx.strokeText("XEXEU DEV'S", 800, 184);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 215, 0, 0.46)";
  ctx.strokeText("XEXEU DEV'S", 804, 188);
  ctx.fillText("XEXEU DEV'S", 800, 184);
  const texture = new THREE.CanvasTexture(titleCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function buildHeroInfoPlane() {
  const infoMaterial = new THREE.MeshBasicMaterial({
    map: createHeroInfoTexture(),
    transparent: true,
    opacity: 0.94,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const infoPlane = new THREE.Mesh(new THREE.PlaneGeometry(7.55, 2.78), infoMaterial);
  infoPlane.position.set(0, -1.38, 0.02);
  heroAnchor.add(infoPlane);
}

function addHeroCrystals() {
  const crystalGeometry = new THREE.OctahedronGeometry(0.09, 0);
  const crystalMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xeaffff, metalness: 0.2, roughness: 0.05, emissive: 0x123a44, emissiveIntensity: 0.42 }),
    new THREE.MeshStandardMaterial({ color: 0x7df9ff, metalness: 0.35, roughness: 0.08, emissive: 0x063640, emissiveIntensity: 0.58 }),
    new THREE.MeshStandardMaterial({ color: 0xb8fff2, metalness: 0.25, roughness: 0.06, emissive: 0x0b372b, emissiveIntensity: 0.48 }),
  ];

  for (let i = 0; i < 34; i += 1) {
    const material = crystalMaterials[i % crystalMaterials.length].clone();
    const crystal = new THREE.Mesh(crystalGeometry, material);
    const side = i % 2 ? 1 : -1;
    crystal.position.set(
      side * (1.1 + (i % 9) * 0.25),
      0.44 + Math.sin(i * 1.38) * 0.58,
      -0.08 + Math.cos(i * 0.91) * 0.2,
    );
    crystal.rotation.set(i * 0.31, i * 0.53, i * 0.17);
    crystal.scale.setScalar(0.55 + ((i * 7) % 11) * 0.065);
    heroAnchor.add(crystal);
  }
}

function buildHeroFallback() {
  const titlePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(6.5, 1.46),
    new THREE.MeshBasicMaterial({
      map: createHeroFallbackTexture(),
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  titlePlane.position.set(0, 0.55, 0.04);
  heroAnchor.add(titlePlane);
}

function buildHeroText(font) {
  heroLetterAnchor.clear();
  const text = "XEXEU DEV'S";
  const options = {
    font,
    size: 0.64,
    depth: 0.13,
    curveSegments: 8,
    bevelEnabled: true,
    bevelThickness: 0.024,
    bevelSize: 0.012,
    bevelSegments: 3,
  };
  const titleMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe7a3,
    transparent: true,
    opacity: 0.34,
    metalness: 0.82,
    roughness: 0.12,
    emissive: 0x5d3a08,
    emissiveIntensity: 0.62,
    side: THREE.DoubleSide,
  });
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xfff2ae,
      transparent: true,
      opacity: 0.86,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
  });
  const shadowWireMaterial = new THREE.LineBasicMaterial({
      color: 0x7df9ff,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
  });
  const letterEntries = [];
  let cursor = 0;
  text.split("").forEach((letter) => {
    if (letter === " ") {
      letterEntries.push({ letter, width: 0.33 });
      cursor += 0.33;
      return;
    }
    const geometry = new TextGeometry(letter, options);
    geometry.computeBoundingBox();
    const width = (geometry.boundingBox?.max.x ?? 0.4) - (geometry.boundingBox?.min.x ?? 0);
    letterEntries.push({ letter, geometry, width });
    cursor += width + 0.035;
  });

  let x = -cursor / 2;
  letterEntries.forEach((entry, index) => {
    if (!entry.geometry) {
      x += entry.width;
      return;
    }
    const letterGroup = new THREE.Group();
    const mesh = new THREE.Mesh(entry.geometry, titleMaterial.clone());
    const glow = new THREE.Mesh(entry.geometry.clone(), glowMaterial.clone());
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(entry.geometry), wireMaterial.clone());
    const cyanWire = new THREE.LineSegments(new THREE.WireframeGeometry(entry.geometry.clone()), shadowWireMaterial.clone());
    glow.scale.set(1.045, 1.08, 1.02);
    glow.position.z = -0.035;
    wire.position.z = 0.014;
    cyanWire.position.set(0.024, -0.026, -0.018);
    letterGroup.add(glow, mesh, wire, cyanWire);
    letterGroup.position.set(x, 0.55, 0.02);
    letterGroup.userData = {
      index,
      baseX: x,
      baseY: 0.55,
      rollOffset: (index % 2 ? 1 : -1) * (1.9 + index * 0.12),
      delay: index * 0.058,
      childrenMaterials: [mesh.material, glow.material, wire.material, cyanWire.material],
      materialBases: [mesh.material.opacity, glow.material.opacity, wire.material.opacity, cyanWire.material.opacity],
    };
    heroLetterAnchor.add(letterGroup);
    x += entry.width + 0.035;
  });
}

heroAnchor.position.set(0.08, towerHeroY, -1.04);
heroAnchor.rotation.set(0, -0.04, 0);
buildHeroInfoPlane();
addHeroCrystals();
new FontLoader().load(
  "https://unpkg.com/three@0.164.1/examples/fonts/helvetiker_bold.typeface.json",
  buildHeroText,
  undefined,
  buildHeroFallback,
);

const cardWidth = 3.52;
const cardHeight = 1.98;
const cardRadius = 0.18;
const cardDepth = 0.095;

function createRoundedRectShape(width, height, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

function applyPlanarUvs(geometry, width, height) {
  const position = geometry.attributes.position;
  const uvs = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i += 1) {
    uvs[i * 2] = (position.getX(i) + width / 2) / width;
    uvs[i * 2 + 1] = (position.getY(i) + height / 2) / height;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}

function createRoundedShapeGeometry(width, height, radius) {
  const geometry = new THREE.ShapeGeometry(createRoundedRectShape(width, height, radius), 10);
  applyPlanarUvs(geometry, width, height);
  return geometry;
}

function createRoundedBorderGeometry(width, height, radius) {
  const points = createRoundedRectShape(width, height, radius).getPoints(10);
  return new THREE.BufferGeometry().setFromPoints(points);
}

const cardGlassColors = [
  "#00D9FF",
  "#8A2BFF",
  "#00FFC8",
  "#FF3DF2",
  "#FFF200",
  "#FF8A00",
  "#FF2E2E",
  "#7CFF00",
  "#005DFF",
  "#7DF9FF",
  "#C77DFF",
  "#FFD700",
  "#EFFFFF",
  "#111827",
];

function makeCardPalette(hex) {
  const accent = new THREE.Color(hex);
  const voidColor = new THREE.Color("#020407");
  const smokeColor = new THREE.Color("#111827");
  return {
    accent: `#${accent.getHexString()}`,
    soft: `#${accent.clone().lerp(new THREE.Color("#ffffff"), 0.24).getHexString()}`,
    mid: `#${accent.clone().lerp(voidColor, 0.56).getHexString()}`,
    deep: `#${accent.clone().lerp(voidColor, 0.84).getHexString()}`,
    smoke: `#${accent.clone().lerp(smokeColor, 0.78).getHexString()}`,
    three: accent,
  };
}

const cardPalettes = cardGlassColors.map(makeCardPalette);

function hexToRgba(hex, alpha) {
  const color = new THREE.Color(hex);
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
}

function createCardBaseLayer(index) {
  const videoCanvas = document.createElement("canvas");
  videoCanvas.width = 768;
  videoCanvas.height = 432;
  const ctx = videoCanvas.getContext("2d");
  const texture = new THREE.CanvasTexture(videoCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const w = videoCanvas.width;
  const h = videoCanvas.height;
  const palette = cardPalettes[index % cardPalettes.length];

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, hexToRgba(palette.accent, 0.14));
  bg.addColorStop(0.54, hexToRgba(palette.mid, 0.54));
  bg.addColorStop(1, hexToRgba(palette.deep, 0.82));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 4; i += 1) {
    const x = w * (0.18 + ((index * 97 + i * 181) % 620) / 768);
    const y = h * (0.16 + ((index * 71 + i * 113) % 310) / 432);
    const radius = 120 + i * 42;
    const orb = ctx.createRadialGradient(x, y, 0, x, y, radius);
    orb.addColorStop(0, hexToRgba(palette.soft, 0.28));
    orb.addColorStop(1, hexToRgba(palette.accent, 0));
    ctx.fillStyle = orb;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 7; i += 1) {
    const y = 62 + i * 52;
    ctx.strokeStyle = i % 2 ? "rgba(255, 255, 255, 0.055)" : hexToRgba(palette.accent, 0.075);
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = -80; x <= w + 80; x += 56) {
      ctx.lineTo(x, y + Math.sin(x * 0.016 + index + i) * 12);
    }
    ctx.stroke();
  }

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 130; i += 1) {
    const x = (Math.sin(i * 18.17 + index * 2.7) * 0.5 + 0.5) * w;
    const y = (Math.cos(i * 10.91 + index * 1.9) * 0.5 + 0.5) * h;
    const size = 1 + ((i + index) % 4) * 0.65;
    ctx.fillStyle = i % 5 === 0 ? "rgba(255, 255, 255, 0.18)" : hexToRgba(palette.accent, 0.12);
    ctx.beginPath();
    ctx.ellipse(x, y, size * 2.6, size, (i * 37) % Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(0, 0, w, h);
  texture.needsUpdate = true;
  return { texture };
}

function createCardBackLayer(index) {
  const backCanvas = document.createElement("canvas");
  backCanvas.width = 768;
  backCanvas.height = 432;
  const ctx = backCanvas.getContext("2d");
  const texture = new THREE.CanvasTexture(backCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const w = backCanvas.width;
  const h = backCanvas.height;
  const palette = cardPalettes[index % cardPalettes.length];

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, hexToRgba(palette.deep, 0.92));
  bg.addColorStop(0.5, hexToRgba(palette.smoke, 0.88));
  bg.addColorStop(1, "rgba(2, 4, 7, 0.96)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "screen";
  for (let i = 0; i < 11; i += 1) {
    const x = ((Math.sin(index * 1.8 + i * 2.3) * 0.5 + 0.5) * 0.86 + 0.07) * w;
    const y = ((Math.cos(index * 1.4 + i * 1.7) * 0.5 + 0.5) * 0.72 + 0.14) * h;
    const rx = 90 + (i % 4) * 34;
    const ry = 22 + (i % 3) * 11;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i * 0.53 + index * 0.2) % Math.PI);
    const smear = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    smear.addColorStop(0, hexToRgba(palette.soft, 0.2));
    smear.addColorStop(1, hexToRgba(palette.accent, 0));
    ctx.fillStyle = smear;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = hexToRgba(palette.soft, 0.12);
  ctx.lineWidth = 2;
  for (let y = 38; y < h; y += 38) {
    ctx.beginPath();
    ctx.moveTo(42, y);
    for (let x = 42; x < w - 42; x += 50) {
      ctx.lineTo(x, y + Math.sin(index + x * 0.014 + y * 0.021) * 8);
    }
    ctx.stroke();
  }

  ctx.fillStyle = hexToRgba(palette.soft, 0.07);
  ctx.beginPath();
  ctx.roundRect(168, 126, 432, 150, 32);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fillRect(214, 184, 340, 14);
  ctx.fillRect(266, 218, 236, 10);

  ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
  ctx.fillRect(0, 0, w, h);
  texture.needsUpdate = true;
  return { texture };
}

function fillGradientText(ctx, text, x, y, font, topColor, bottomColor, align = "center") {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.78)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 8;
  const metrics = ctx.measureText(text);
  const height = (metrics.actualBoundingBoxAscent || 90) + (metrics.actualBoundingBoxDescent || 22);
  const gradient = ctx.createLinearGradient(0, y - height / 2, 0, y + height / 2);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  ctx.fillStyle = gradient;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawPythonMark(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;

  const blue = ctx.createLinearGradient(-110, -110, 120, 80);
  blue.addColorStop(0, "#2f7fc2");
  blue.addColorStop(1, "#1d4f85");
  const yellow = ctx.createLinearGradient(-70, 0, 130, 120);
  yellow.addColorStop(0, "#ffe76a");
  yellow.addColorStop(1, "#f1bd12");

  ctx.fillStyle = blue;
  ctx.beginPath();
  ctx.roundRect(-122, -112, 210, 132, 35);
  ctx.roundRect(-170, -45, 156, 112, 35);
  ctx.fill();
  ctx.clearRect(-34, -44, 112, 34);

  ctx.fillStyle = yellow;
  ctx.beginPath();
  ctx.roundRect(-42, -10, 210, 132, 35);
  ctx.roundRect(12, -52, 156, 112, 35);
  ctx.fill();
  ctx.clearRect(-42, 54, 112, 34);

  ctx.fillStyle = "#020407";
  ctx.beginPath();
  ctx.arc(-96, -88, 12, 0, Math.PI * 2);
  ctx.arc(92, 82, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function createPythonServiceTexture() {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 1920;
  labelCanvas.height = 1080;
  const ctx = labelCanvas.getContext("2d");

  ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
  ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

  drawPythonMark(ctx, 308, 276, 0.86);
  fillGradientText(ctx, "PYTHON", 820, 272, '900 148px "Arial Black", Impact, sans-serif', "#f7cf22", "#319bd9");
  fillGradientText(ctx, "Automa\u00e7\u00e3o, bots, scripts,", 960, 462, '900 92px "Arial Black", Impact, sans-serif', "#4aa8d7", "#6cc0d4");
  fillGradientText(ctx, "ferramentas, integra\u00e7\u00f5es e", 960, 612, '900 92px "Arial Black", Impact, sans-serif', "#bdd07b", "#9aaa58");
  fillGradientText(ctx, "sistemas personalizados", 960, 762, '900 92px "Arial Black", Impact, sans-serif', "#f2d51a", "#d8b505");
  fillGradientText(ctx, "A partir de R$: 50,00", 1220, 902, '900 74px "Arial Black", Impact, sans-serif', "#f2d51a", "#42a1cc");

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
  return texture;
}

function splitLabel(text) {
  const words = text.replace(/\s*\/\s*/g, " / ").split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > 16 && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = next;
  });
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function createLabelTexture(text, index) {
  if (index === 0) {
    return createPythonServiceTexture();
  }

  if (serviceCardArt[index]) {
    const texture = textureLoader.load(serviceCardArt[index]);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    return texture;
  }

  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 1024;
  labelCanvas.height = 512;
  const ctx = labelCanvas.getContext("2d");
  const accent = index % 2 ? "rgba(255, 92, 226, 0.92)" : "rgba(126, 255, 245, 0.92)";
  const glow = index % 2 ? "rgba(255, 65, 220, 0.55)" : "rgba(80, 255, 230, 0.55)";

  ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
  ctx.fillStyle = "rgba(2, 6, 9, 0.22)";
  ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.28;
  ctx.strokeRect(72, 64, 880, 384);
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = glow;
  ctx.shadowBlur = 24;
  ctx.fillStyle = "rgba(245, 252, 255, 0.82)";
  ctx.font = '700 32px "Courier New", monospace';
  ctx.fillText("XEXEU DEV,S", 512, 122);

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  const lines = splitLabel(text);
  const mainSize = lines.some((line) => line.length > 15) ? 66 : 82;
  ctx.font = `700 ${mainSize}px "Courier New", monospace`;
  const startY = 238 - (lines.length - 1) * (mainSize * 0.47);
  lines.forEach((line, lineIndex) => {
    ctx.fillText(line, 512, startY + lineIndex * (mainSize * 0.92));
  });

  ctx.fillStyle = accent;
  ctx.font = '700 28px "Courier New", monospace';
  ctx.fillText(`SERVICE ${String(index + 1).padStart(2, "0")} / ${serviceItems.length}`, 512, 402);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
  return texture;
}

const cardGeometry = createRoundedShapeGeometry(cardWidth, cardHeight, cardRadius);
const glowGeometry = createRoundedShapeGeometry(3.72, 2.16, 0.22);
const borderGeometry = createRoundedBorderGeometry(3.72, 2.16, 0.22);
const slabGeometry = new THREE.ExtrudeGeometry(createRoundedRectShape(3.72, 2.16, 0.22), {
  depth: cardDepth,
  bevelEnabled: false,
  curveSegments: 10,
});
slabGeometry.translate(0, 0, -cardDepth / 2);
const backGeometry = createRoundedShapeGeometry(3.5, 1.96, 0.18);
const orbitCards = [];
const cardBaseNormal = new THREE.Vector3(0, 0, 1);
const cardRadialNormal = new THREE.Vector3();
const cardTiltAxis = new THREE.Vector3(0, 0, 1);
const cardTilt = new THREE.Quaternion();

function createCardReflectionTexture() {
  const reflectionCanvas = document.createElement("canvas");
  reflectionCanvas.width = 1024;
  reflectionCanvas.height = 512;
  const ctx = reflectionCanvas.getContext("2d");
  ctx.clearRect(0, 0, reflectionCanvas.width, reflectionCanvas.height);

  const diagonal = ctx.createLinearGradient(0, 0, reflectionCanvas.width, reflectionCanvas.height);
  diagonal.addColorStop(0.0, "rgba(255,255,255,0)");
  diagonal.addColorStop(0.34, "rgba(255,255,255,0)");
  diagonal.addColorStop(0.44, "rgba(255,255,255,0.42)");
  diagonal.addColorStop(0.5, "rgba(183,255,255,0.2)");
  diagonal.addColorStop(0.58, "rgba(255,255,255,0)");
  diagonal.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = diagonal;
  ctx.fillRect(0, 0, reflectionCanvas.width, reflectionCanvas.height);

  const top = ctx.createLinearGradient(0, 0, 0, reflectionCanvas.height);
  top.addColorStop(0, "rgba(255,255,255,0.18)");
  top.addColorStop(0.18, "rgba(255,255,255,0.05)");
  top.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, reflectionCanvas.width, reflectionCanvas.height);

  const texture = new THREE.CanvasTexture(reflectionCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

const cardReflectionTexture = createCardReflectionTexture();
const expandHintGeometry = createRoundedShapeGeometry(1.08, 0.3, 0.08);

function createExpandHintTexture() {
  const hintCanvas = document.createElement("canvas");
  hintCanvas.width = 512;
  hintCanvas.height = 160;
  const ctx = hintCanvas.getContext("2d");
  ctx.clearRect(0, 0, hintCanvas.width, hintCanvas.height);
  const bg = ctx.createLinearGradient(0, 0, hintCanvas.width, hintCanvas.height);
  bg.addColorStop(0, "rgba(0, 0, 0, 0.44)");
  bg.addColorStop(0.5, "rgba(124, 255, 88, 0.22)");
  bg.addColorStop(1, "rgba(0, 0, 0, 0.52)");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(16, 26, hintCanvas.width - 32, hintCanvas.height - 52, 34);
  ctx.fill();
  ctx.strokeStyle = "rgba(216, 255, 120, 0.9)";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(124, 255, 88, 0.95)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "rgba(239, 255, 255, 0.96)";
  ctx.font = '900 46px "Courier New", monospace';
  ctx.fillText("EXPANDIR", 256, 82);
  const texture = new THREE.CanvasTexture(hintCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

const expandHintTexture = createExpandHintTexture();

Array.from({ length: carouselCount }).forEach((_, index) => {
  const card = new THREE.Group();
  const baseLayer = createCardBaseLayer(index);
  const backLayer = createCardBackLayer(index);
  const palette = cardPalettes[index % cardPalettes.length];
  const accentColor = palette.three.clone();
  const slabColor = palette.three.clone().lerp(new THREE.Color("#05070b"), 0.72);
  const backEdgeColor = palette.three.clone().lerp(new THREE.Color("#111827"), 0.46);
  const glassTintColor = palette.three.clone().lerp(new THREE.Color("#020407"), 0.68);

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const imageMaterial = new THREE.MeshBasicMaterial({
    map: baseLayer.texture,
    transparent: true,
    opacity: 1,
    side: THREE.FrontSide,
    depthWrite: true,
    depthTest: true,
  });
  const borderMaterial = new THREE.LineBasicMaterial({
    color: accentColor.clone().lerp(new THREE.Color("#ffffff"), 0.12),
    transparent: true,
    opacity: 0.56,
    blending: THREE.AdditiveBlending,
  });
  const slabMaterial = new THREE.MeshBasicMaterial({
    color: slabColor,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
  });
  const backMaterial = new THREE.MeshBasicMaterial({
    map: backLayer.texture,
    color: backEdgeColor,
    transparent: true,
    opacity: 0.92,
    side: THREE.FrontSide,
    depthWrite: true,
    depthTest: true,
  });
  const glassMaterial = new THREE.MeshBasicMaterial({
    color: glassTintColor,
    transparent: true,
    opacity: 0.16,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
  });
  const reflectionMaterial = new THREE.MeshBasicMaterial({
    map: cardReflectionTexture,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
  });
  const labelTexture = createLabelTexture(serviceItems[index], index);
  const labelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
    opacity: 1,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
  });
  const expandMaterial = new THREE.MeshBasicMaterial({
    map: expandHintTexture,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
    depthTest: true,
  });

  const slab = new THREE.Mesh(slabGeometry, slabMaterial);
  const back = new THREE.Mesh(backGeometry, backMaterial);
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  const image = new THREE.Mesh(cardGeometry, imageMaterial);
  const glass = new THREE.Mesh(cardGeometry, glassMaterial);
  const reflection = new THREE.Mesh(cardGeometry, reflectionMaterial);
  const label = new THREE.Mesh(cardGeometry, labelMaterial);
  const border = new THREE.LineLoop(borderGeometry, borderMaterial);
  const expandHint = new THREE.Mesh(expandHintGeometry, expandMaterial);
  back.position.z = -0.047;
  back.rotation.y = Math.PI;
  glow.position.z = 0.052;
  image.position.z = 0.06;
  glass.position.z = 0.068;
  reflection.position.z = 0.074;
  label.position.z = 0.081;
  border.position.z = 0.088;
  expandHint.position.set(1.24, -0.86, 0.102);

  card.add(slab, back, glow, image, glass, reflection, label, border, expandHint);
  card.userData = {
    index,
    baseAngle: index * towerCardAngleStep,
    towerY: towerTopY - index * towerCardSpacing,
    title: serviceItems[index],
    baseLayer,
    backLayer,
    imageMaterial,
    labelMaterial,
    glassMaterial,
    reflectionMaterial,
    glowMaterial,
    borderMaterial,
    slabMaterial,
    backMaterial,
    expandMaterial,
  };
  orbitAnchor.add(card);
  orbitCards.push(card);
});
orbitAnchor.visible = true;

function updateScroll() {
  scrollTarget = readScrollProgress();
}

function pushOrbit(deltaY) {
  const clippedDelta = THREE.MathUtils.clamp(deltaY, -260, 260);
  orbitVelocity += clippedDelta * state.orbitImpulseStrength;
  orbitVelocity = THREE.MathUtils.clamp(orbitVelocity, -state.maxOrbitVelocity, state.maxOrbitVelocity);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = window.innerWidth < 720 ? 54 : 44;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  resizeSmokeCanvas();
}

function getMaxScroll() {
  const doc = document.documentElement;
  const body = document.body;
  const pageHeight = Math.max(
    body.scrollHeight,
    doc.scrollHeight,
    body.offsetHeight,
    doc.offsetHeight,
    body.clientHeight,
    doc.clientHeight,
  );
  return Math.max(1, pageHeight - window.innerHeight);
}

function readScrollProgress() {
  const doc = document.documentElement;
  const body = document.body;
  const scrollY = window.scrollY || window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
  return THREE.MathUtils.clamp(scrollY / getMaxScroll(), 0, 1);
}

function scrollToCard(index) {
  const targetIndex = THREE.MathUtils.clamp(index, 0, serviceItems.length - 1);
  const towerProgress = THREE.MathUtils.clamp(targetIndex / state.orbitScrollRange, 0, 1);
  const progress = towerScrollStart + towerProgress * (towerScrollEnd - towerScrollStart);
  orbitImpulse = 0;
  orbitVelocity = 0;
  scrollTarget = progress;
  window.scrollTo({
    top: getMaxScroll() * progress,
    behavior: "smooth",
  });
}

const serviceLinks = Array.from(document.querySelectorAll(".query-panel a[data-card-index]"));
const detailOverlay = document.querySelector("[data-service-detail]");
const detailClose = document.querySelector("[data-detail-close]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailKicker = document.querySelector("[data-detail-kicker]");
const detailPrice = document.querySelector("[data-detail-price]");
const detailIntro = document.querySelector("[data-detail-intro]");
const detailHeading = document.querySelector("[data-detail-heading]");
const detailList = document.querySelector("[data-detail-list]");
const projectGalleryModal = document.querySelector("[data-project-gallery-modal]");
const projectGalleryTitle = document.querySelector("[data-project-gallery-title]");
const projectGalleryClose = document.querySelector("[data-project-gallery-close]");
const projectGalleryImage = document.querySelector("[data-project-gallery-image]");
const projectGalleryDescription = document.querySelector("[data-project-gallery-description]");
const projectGalleryLink = document.querySelector("[data-project-gallery-link]");
const projectGalleryPlaceholders = document.querySelector("[data-project-gallery-placeholders]");

function setPointerFromEvent(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function openServiceDetail(index) {
  const detail = serviceDetails[index];
  if (!detail || !detailOverlay) return;
  const palette = cardPalettes[index % cardPalettes.length];
  detailOverlay.style.setProperty("--detail-color", palette.accent);
  detailKicker.textContent = detail.kicker ?? "INFORMAÇÕES NO TOPO";
  detailTitle.textContent = detail.title;
  detailPrice.textContent = detail.price;
  detailIntro.textContent = detail.intro;
  detailHeading.textContent = `Dá pra fazer com ${detail.title}:`;
  detailList.replaceChildren(...detail.canDo.map(([title, description]) => {
    const item = document.createElement("li");
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    strong.textContent = title;
    span.textContent = description;
    item.append(strong, span);
    return item;
  }));
  detailOverlay.classList.add("is-open");
  detailOverlay.setAttribute("aria-hidden", "false");
}

function closeServiceDetail() {
  if (!detailOverlay) return;
  detailOverlay.classList.remove("is-open");
  detailOverlay.setAttribute("aria-hidden", "true");
}

function getCardFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData && Number.isInteger(current.userData.index)) return current;
    current = current.parent;
  }
  return null;
}

function getGalleryProjectFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData && Number.isInteger(current.userData.projectIndex)) return current;
    current = current.parent;
  }
  return null;
}

function handleGalleryProjectClick(event) {
  if (!galleryAnchor.visible || !galleryProjectRayTargets.length || !projectButtons.length) return false;
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(galleryProjectRayTargets, true);
  if (!intersections.length) return false;
  const project = getGalleryProjectFromObject(intersections[0].object);
  const index = project?.userData.projectIndex;
  if (!Number.isInteger(index) || !projectButtons[index]) return false;
  openProjectGallery(projectButtons[index]);
  return true;
}

function handleCardClick(event) {
  if (detailOverlay?.classList.contains("is-open")) return;
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(orbitCards, true);
  if (!intersections.length) return;
  const card = getCardFromObject(intersections[0].object);
  if (!card || !card.visible) return;
  const index = card.userData.index;
  if ((card.userData.focus ?? 0) > 0.42) openServiceDetail(index);
  else scrollToCard(index);
}

function updateHoveredCardFromPointer() {
  hoveredCardIndex = -1;
  if (detailOverlay?.classList.contains("is-open") || !orbitAnchor.visible) return;
  raycaster.setFromCamera(pointer, camera);
  const intersections = raycaster.intersectObjects(orbitCards, true);
  if (!intersections.length) return;
  const card = getCardFromObject(intersections[0].object);
  if (card?.visible && (card.userData.focus ?? 0) > 0.32) {
    hoveredCardIndex = card.userData.index;
  }
}

window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("wheel", (event) => {
  pushOrbit(event.deltaY);
}, { passive: true });
window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  smokeMouse.vx = event.clientX - smokeMouse.x;
  smokeMouse.vy = event.clientY - smokeMouse.y;
  smokeMouse.x = event.clientX;
  smokeMouse.y = event.clientY;
  setPointerFromEvent(event);
  updateHoveredCardFromPointer();
  if (isDragging) {
    if (Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 9) {
      pointerWasDragged = true;
    }
    dragSpinTarget += event.movementX * 0.012;
    pushOrbit(event.movementY * -1.2);
  }
});
window.addEventListener("pointerdown", (event) => {
  isDragging = true;
  pointerWasDragged = false;
  pointerDown.set(event.clientX, event.clientY);
  document.body.classList.add("is-dragging");
});
window.addEventListener("pointerup", (event) => {
  isDragging = false;
  document.body.classList.remove("is-dragging");
  if (!pointerWasDragged && event.target === canvas) {
    if (handleGalleryProjectClick(event)) return;
    handleCardClick(event);
  }
});
window.addEventListener("pointercancel", () => {
  isDragging = false;
  pointerWasDragged = false;
  hoveredCardIndex = -1;
  document.body.classList.remove("is-dragging");
});
window.addEventListener("pointerleave", () => {
  hoveredCardIndex = -1;
});
detailClose?.addEventListener("click", closeServiceDetail);
detailOverlay?.addEventListener("click", (event) => {
  if (event.target === detailOverlay) closeServiceDetail();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeServiceDetail();
    closeProjectGallery();
  }
});
serviceLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToCard(Number(link.dataset.cardIndex));
  });
});

function openProjectGallery(trigger) {
  if (!projectGalleryModal) return;
  const title = trigger.dataset.projectTitle || trigger.dataset.projectGallery || "Projeto";
  const image = trigger.dataset.projectImage || "";
  const description = trigger.dataset.projectDescription || "Projeto criado por XEXEU DEV'S com foco em visual, funcionamento e entrega personalizada.";
  const link = trigger.dataset.projectLink || "";
  const galleryImages = (trigger.dataset.projectGalleryImages || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  if (projectGalleryTitle) projectGalleryTitle.textContent = title;
  if (projectGalleryImage) {
    projectGalleryImage.src = image;
    projectGalleryImage.alt = title;
  }
  if (projectGalleryDescription) projectGalleryDescription.textContent = description;
  if (projectGalleryLink) {
    projectGalleryLink.href = link || "#";
    projectGalleryLink.classList.toggle("is-hidden", !link);
  }
  if (projectGalleryPlaceholders) {
    projectGalleryPlaceholders.replaceChildren(...galleryImages.map((src, index) => {
      const shot = document.createElement("img");
      shot.src = src;
      shot.alt = `${title} foto ${index + 1}`;
      shot.loading = "lazy";
      return shot;
    }));
    projectGalleryPlaceholders.classList.toggle("is-hidden", galleryImages.length === 0);
  }
  projectGalleryModal.classList.add("is-open");
  projectGalleryModal.setAttribute("aria-hidden", "false");
}

document.querySelectorAll("[data-project-gallery], [data-project-open]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!projectGalleryModal) return;
    openProjectGallery(button);
  });
});

function closeProjectGallery() {
  projectGalleryModal?.classList.remove("is-open");
  projectGalleryModal?.setAttribute("aria-hidden", "true");
}

projectGalleryClose?.addEventListener("click", closeProjectGallery);
projectGalleryModal?.addEventListener("click", (event) => {
  if (event.target === projectGalleryModal) closeProjectGallery();
});

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();
  updateLoader(delta);
  updateScroll();
  scrollProgress = scrollTarget;
  const towerTarget = getTowerProgress(scrollTarget);
  const towerProgress = getTowerProgress(scrollProgress);
  const heroExit = THREE.MathUtils.smoothstep(scrollProgress, 0.1, 0.2);
  const towerEnter = THREE.MathUtils.smoothstep(scrollProgress, 0.215, towerScrollStart);
  const towerReveal = THREE.MathUtils.smoothstep(scrollProgress, 0.235, towerScrollStart);
  const towerExit = 1 - THREE.MathUtils.smoothstep(scrollProgress, towerScrollEnd + 0.015, projectsRevealProgress);
  const towerVisibility = towerReveal * towerExit;
  const introCeilingPhase = THREE.MathUtils.smoothstep(scrollProgress, 0.145, 0.225) * (1 - THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.305));
  const projectsGatePhase = THREE.MathUtils.smoothstep(scrollProgress, towerScrollEnd - 0.015, projectsGateStart) * (1 - THREE.MathUtils.smoothstep(scrollProgress, projectsGateStart + 0.025, projectsRevealProgress));
  const ceilingPhase = Math.min(1, introCeilingPhase + projectsGatePhase * 0.95);
  const cameraTrackY = THREE.MathUtils.lerp(towerTopY + 0.08, towerBottomY - 0.08, towerProgress);
  const galleryVisibility = THREE.MathUtils.smoothstep(scrollProgress, projectsRevealProgress - 0.018, projectsRevealProgress + 0.025);
  const galleryZoom = THREE.MathUtils.smoothstep(scrollProgress, projectsRevealProgress + 0.012, 0.995);
  const galleryMouseStrength = galleryVisibility * (0.55 + galleryZoom * 0.45);

  document.documentElement.style.setProperty("--gallery-zoom", galleryZoom.toFixed(4));
  document.documentElement.style.setProperty("--gallery-scale", (1 + galleryZoom * 0.08).toFixed(4));
  document.documentElement.style.setProperty("--gallery-mouse-x", pointer.x.toFixed(4));
  document.documentElement.style.setProperty("--gallery-mouse-y", pointer.y.toFixed(4));
  document.documentElement.style.setProperty("--gallery-shift-x", `${(-pointer.x * 16 * galleryMouseStrength).toFixed(2)}px`);
  document.documentElement.style.setProperty("--gallery-shift-y", `${(pointer.y * 9 * galleryMouseStrength).toFixed(2)}px`);

  orbitImpulse += orbitVelocity * delta;
  orbitImpulse = THREE.MathUtils.damp(orbitImpulse, 0, state.orbitImpulseReturn, delta);
  orbitVelocity = THREE.MathUtils.damp(orbitVelocity, 0, state.orbitDrag, delta);
  const rawOrbitPosition = towerTarget * state.orbitScrollRange + orbitImpulse;
  orbitPosition = THREE.MathUtils.clamp(rawOrbitPosition, 0, state.orbitScrollRange);
  if (orbitPosition !== rawOrbitPosition) {
    orbitImpulse = orbitPosition - towerTarget * state.orbitScrollRange;
    orbitVelocity = 0;
  }

  const clampedProgress = THREE.MathUtils.clamp(towerProgress, 0, 1);
  const activeFloat = orbitPosition;
  const scrollBreath = Math.sin(clampedProgress * Math.PI);
  const isMobile = window.innerWidth < 720;
  const mobileScale = isMobile ? 0.72 : 1;
  dragSpin = THREE.MathUtils.damp(dragSpin, dragSpinTarget, 9, delta);
  const activeIndex = THREE.MathUtils.clamp(Math.round(activeFloat), 0, serviceLinks.length - 1);
  serviceLinks.forEach((link, index) => {
    link.classList.toggle("is-active", index === activeIndex);
  });

  root.position.set(isMobile ? -0.12 : 0.28, 0, 0);
  root.rotation.set(0, 0, 0);
  document.body.classList.toggle("hide-hero-code", false);
  document.body.classList.toggle("show-services-list", scrollProgress >= serviceListRevealProgress && scrollProgress < projectsGateStart);
  document.body.classList.toggle("show-projects", scrollProgress >= projectsRevealProgress);
  galleryAnchor.visible = galleryVisibility > 0.01;
  galleryAnchor.position.set(
    pointer.x * 0.18 * galleryMouseStrength,
    -0.06 + pointer.y * 0.08 * galleryMouseStrength,
    -0.2 - galleryZoom * 0.72,
  );
  galleryAnchor.rotation.set(
    -pointer.y * 0.032 * galleryMouseStrength,
    pointer.x * 0.062 * galleryMouseStrength,
    pointer.x * 0.008 * galleryMouseStrength,
  );
  galleryRoom.position.z = -galleryZoom * 0.24;
  galleryDisplays.rotation.y = Math.sin(elapsed * 0.18) * 0.012 * galleryVisibility;
  galleryAmbient.intensity = galleryVisibility * 0.62;
  galleryKeyLight.intensity = galleryVisibility * (9.5 + galleryZoom * 4.5);
  galleryFillLight.intensity = galleryVisibility * (1.8 + galleryZoom * 1.2);
  galleryLightPoints.forEach((light) => {
    light.intensity = galleryVisibility * (light.userData.galleryBaseIntensity ?? 1);
  });
  heroAnchor.visible = heroExit < 0.98;
  heroAnchor.position.set(0.08, towerHeroY + heroExit * 1.35, -1.04 - heroExit * 0.44);
  heroAnchor.scale.setScalar(isMobile ? 0.45 : 1);
  heroLetterAnchor.children.forEach((letter) => {
    const entry = letter.userData;
    const entrance = THREE.MathUtils.smoothstep(elapsed - entry.delay, 0, 1.05);
    const settle = 1 - entrance;
    letter.position.set(
      entry.baseX + entry.rollOffset * settle,
      entry.baseY + Math.sin((1 - entrance) * Math.PI) * 0.48,
      0.02 + settle * 0.28,
    );
    letter.rotation.set(
      settle * Math.PI * 1.35,
      settle * (entry.index % 2 ? -0.55 : 0.55),
      settle * (entry.rollOffset > 0 ? -Math.PI * 1.6 : Math.PI * 1.6),
    );
    const opacity = THREE.MathUtils.clamp(entrance * (1 - heroExit * 0.55), 0, 1);
    entry.childrenMaterials.forEach((material, materialIndex) => {
      material.opacity = opacity * entry.materialBases[materialIndex];
    });
  });

  const towerSpin = activeFloat * -0.44 * towerRotationDirection + dragSpin * 0.08;
  columnAnchor.visible = towerVisibility > 0.04;
  orbitAnchor.visible = towerVisibility > 0.04;
  columnAnchor.rotation.set(0, towerSpin * 0.42, 0);
  columnAnchor.position.set(0, 0, towerCenterZ);
  columnAnchor.scale.setScalar(isMobile ? 0.84 : 1);

  ceilingAnchor.visible = ceilingPhase > 0.015;
  ceilingAnchor.position.y = Math.sin(elapsed * 0.28) * 0.04;
  ceilingAnchor.rotation.y = Math.sin(elapsed * 0.12) * 0.04;
  ceilingTexture.offset.x += delta * 0.012;
  ceilingTexture.offset.y += delta * 0.007;
  ceilingMaterial.opacity = ceilingPhase * 0.68;
  ceilingAnchor.children.forEach((child, index) => {
    if (!child.material || child === ceilingPlane) return;
    child.material.opacity = ceilingPhase * (0.12 + index * 0.055);
    child.rotation.z += delta * (0.018 + index * 0.008);
  });

  aura.rotation.y += delta * 0.12;
  aura.rotation.x = Math.sin(elapsed * 0.18) * 0.12;
  aura.children.forEach((ring, index) => {
    ring.material.opacity = 0.14 + Math.sin(elapsed * 0.8 + index) * 0.035 + scrollBreath * 0.09;
    ring.rotation.z += delta * (0.035 + index * 0.006);
  });
  if (columnModel) {
    columnModel.rotation.y += delta * (0.12 + Math.abs(orbitVelocity) * 0.01);
    columnSegments.forEach((segment, index) => {
      segment.rotation.y += delta * (0.035 + index * 0.006);
    });
  }
  glassParticles.rotation.y -= delta * (0.3 + scrollBreath * 0.22);
  glassParticles.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
  glassParticles.position.y = towerCenterY;
  glassParticles.scale.set(1.24, 4.35, 1.24);
  glassParticleMaterial.opacity = towerVisibility * (0.42 + scrollBreath * 0.34);
  updateDebris(elapsed, towerVisibility);
  updatePyramids(elapsed, towerVisibility);

  if (orbitCards.length) orbitCards.forEach((card, index) => {
    const y = card.userData.towerY;
    const distanceFromCamera = Math.abs(y - cameraTrackY);
    const angle = (index - activeFloat) * towerCardAngleStep * towerRotationDirection + dragSpin * 0.04;
    const front = (Math.cos(angle) + 1) * 0.5;
    const sideAmount = Math.abs(Math.sin(angle));
    const focus = THREE.MathUtils.clamp(1 - distanceFromCamera * 0.62, 0, 1);
    const towerWindow = THREE.MathUtils.clamp(1 - Math.max(0, distanceFromCamera - 3.65) * 0.3, 0, 1);
    const visible = towerVisibility * towerWindow;
    const x = Math.sin(angle) * towerRadiusX;
    const z = towerCenterZ + Math.cos(angle) * towerRadiusZ;
    card.userData.focus = focus;
    card.userData.visibleAmount = visible;

    card.position.set(x, y, z);
    cardRadialNormal.set(x, 0, z - towerCenterZ).normalize();
    card.quaternion.setFromUnitVectors(cardBaseNormal, cardRadialNormal);
    cardTilt.setFromAxisAngle(cardTiltAxis, THREE.MathUtils.degToRad(Math.sin(angle * 1.3) * 4.8));
    card.quaternion.multiply(cardTilt);

    const hovered = hoveredCardIndex === index;
    const hoverPulse = hovered ? 0.045 + Math.sin(elapsed * 8) * 0.018 : 0;
    card.scale.setScalar((0.56 + front * 0.18 + focus * 0.22 + hoverPulse) * mobileScale);
    card.visible = visible > 0.025;
    card.children.forEach((child) => {
      child.renderOrder = 0;
    });

    const frontContent = THREE.MathUtils.smoothstep(front, 0.18, 0.5);
    card.userData.imageMaterial.opacity = visible;
    card.userData.labelMaterial.opacity = visible * frontContent * THREE.MathUtils.clamp(0.72 + focus * 0.28, 0.6, 1);
    card.userData.glassMaterial.opacity = visible * THREE.MathUtils.clamp(0.13 + focus * 0.04 + sideAmount * 0.05, 0.12, 0.23);
    card.userData.reflectionMaterial.opacity = visible * frontContent * THREE.MathUtils.clamp(0.08 + focus * 0.18 + sideAmount * 0.03, 0.04, 0.28);
    card.userData.glowMaterial.opacity = visible * THREE.MathUtils.clamp(0.045 + focus * 0.08 + sideAmount * 0.035, 0.035, 0.16);
    card.userData.borderMaterial.opacity = visible * THREE.MathUtils.clamp(0.22 + focus * 0.32 + sideAmount * 0.1, 0.16, 0.58);
    card.userData.slabMaterial.opacity = visible * THREE.MathUtils.clamp(0.2 + sideAmount * 0.2, 0.16, 0.4);
    card.userData.backMaterial.opacity = visible * THREE.MathUtils.clamp(0.62 + (1 - front) * 0.3 + sideAmount * 0.1, 0.54, 0.96);
    card.userData.expandMaterial.opacity = visible * frontContent * THREE.MathUtils.clamp((focus - 0.28) * 1.65 + (hovered ? 0.38 : 0), 0, 0.88);
  });

  mistAnchor.rotation.y += delta * (0.018 + scrollBreath * 0.028);
  particles.rotation.x = Math.sin(elapsed * 0.11) * 0.08;
  particleMaterial.size = 0.025 + scrollBreath * 0.026;
  particleMaterial.opacity = (0.55 + scrollBreath * 0.28) * (1 - galleryVisibility * 0.64);
  chameleonParticles.rotation.y -= delta * 0.014;
  chameleonParticles.position.y = THREE.MathUtils.lerp(towerHeroY - 2.4, cameraTrackY, towerEnter) * 0.18;
  chameleonMaterial.opacity = (0.18 + towerEnter * 0.18) * (1 - galleryVisibility * 0.58) + galleryVisibility * 0.045;

  const heroCamera = new THREE.Vector3(0.1, towerHeroY + 0.02, isMobile ? 9.15 : 8.3);
  const towerCamera = new THREE.Vector3(0.1, cameraTrackY + 0.02, isMobile ? 8.45 : 7.28);
  const targetCamera = heroCamera.lerp(towerCamera, towerEnter);
  const heroLook = new THREE.Vector3(0.2, towerHeroY - 0.16, -0.82);
  const towerLook = new THREE.Vector3(0.28, cameraTrackY - 0.08, towerCenterZ + 0.24);
  const targetLook = heroLook.lerp(towerLook, towerEnter);
  const galleryCamera = new THREE.Vector3(
    pointer.x * 0.18 * galleryMouseStrength,
    1.04 + pointer.y * 0.1 * galleryMouseStrength,
    (isMobile ? 8.2 : 7.55) - galleryZoom * (isMobile ? 2.05 : 3.55),
  );
  const galleryLook = new THREE.Vector3(
    pointer.x * 0.24 * galleryMouseStrength,
    0.76 + pointer.y * 0.08 * galleryMouseStrength,
    -3.1 - galleryZoom * 4.9,
  );
  targetCamera.lerp(galleryCamera, galleryVisibility);
  targetLook.lerp(galleryLook, galleryVisibility);
  camera.position.copy(targetCamera);
  camera.lookAt(targetLook);

  const mainLightFade = 1 - galleryVisibility * 0.62;
  keyLight.intensity = (76 + scrollBreath * 34) * mainLightFade;
  magentaLight.intensity = (62 + scrollBreath * 44) * mainLightFade;
  backLight.intensity = (44 + scrollBreath * 38) * mainLightFade;

  renderer.render(scene, camera);
  renderSmoke(delta, elapsed);
  requestAnimationFrame(animate);
}

resizeSmokeCanvas();
updateScroll();

if (hasPreviewProgress) {
  requestAnimationFrame(() => {
    const maxScroll = getMaxScroll();
    window.scrollTo(0, maxScroll * THREE.MathUtils.clamp(previewProgress, 0, 1));
    updateScroll();
    scrollProgress = scrollTarget;
    orbitPosition = getTowerProgress(scrollTarget) * state.orbitScrollRange;
    orbitImpulse = 0;
    orbitVelocity = 0;
  });
}

animate();

