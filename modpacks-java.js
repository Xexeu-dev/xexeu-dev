const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const assetRoot = "./assets/modpacks/catalog";

const packs = [
  {
    id: "kimetsu-no-yaiba",
    name: "Kimetsu no Yaiba",
    subtitle: "",
    card: `${assetRoot}/kimetsu-no-yaiba-card-v2.webp`,
    hero: `${assetRoot}/kimetsu-no-yaiba-hero.webp`,
    available: true,
    images: [
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
      "./assets/modpacks/kimetsu/kimetsu-gallery-hashiras.png",
      "./assets/modpacks/kimetsu/kimetsu-gallery-castle.png",
      "./assets/modpacks/kimetsu/kimetsu-gallery-interaction.png",
    ],
    lead: "Entre em uma jornada completa inspirada em Demon Slayer.",
    description:
      "Enfrente onis e luas superiores, aprenda respiracoes, evolua como cacador ou demonio e conclua uma campanha feita para jogar sozinho ou com amigos.",
    version: "1.0.1",
    compatibility: "Forge 1.20.1",
    type: "Modpack",
    size: "249 MB",
    updated: "29/07/2026",
    tags: ["Aventura", "Anime", "RPG", "Missoes", "Multiplayer"],
    tips: [
      "Missoes e progressao guiadas pelo corvo.",
      "Respiracoes, marcas e tecnicas personalizadas.",
      "Chefes, Luas Superiores e Castelo Infinito.",
      "Cooperativo com progresso compartilhado por /amigo.",
      "Castelo Padrao ou Otimizado para seu computador.",
      "Interacoes, treinamento e aliancas com NPCs.",
    ],
    download:
      "https://github.com/Xexeu-dev/xexeu-dev/releases/download/kimetsu-java-v1.0.1/Kimetsu-no-Yaiba-Modpack-Xexeu-1.0.1.zip",
  },
  {
    id: "orespawn-rework",
    name: "Orespawn Rework",
    subtitle: "Em desenvolvimento",
    card: `${assetRoot}/orespawn-rework-card-v2.webp`,
    hero: `${assetRoot}/orespawn-rework-hero.webp`,
    available: false,
    tags: ["Aventura", "Chefes", "Exploracao"],
  },
  {
    id: "the-sims-rework",
    name: "The Sims Rework",
    subtitle: "Em breve",
    card: `${assetRoot}/the-sims-rework-card-v2.webp`,
    hero: `${assetRoot}/the-sims-rework-hero.webp`,
    available: false,
    tags: ["Simulacao", "Construcao", "Vida"],
  },
  {
    id: "god-of-war",
    name: "God of War",
    subtitle: "Em breve",
    card: `${assetRoot}/god-of-war-card-v2.webp`,
    hero: `${assetRoot}/god-of-war-hero.webp`,
    available: false,
    tags: ["Aventura", "Combate", "Mitologia"],
  },
  {
    id: "black-phone",
    name: "Black Phone",
    subtitle: "Em breve",
    card: `${assetRoot}/black-phone-card-v2.webp`,
    hero: `${assetRoot}/black-phone-hero.webp`,
    available: false,
    tags: ["Terror", "Historia", "Sobrevivencia"],
  },
  {
    id: "distant-horizons-optimized",
    name: "Distant Horizons Otimizado",
    subtitle: "Em breve",
    card: `${assetRoot}/distant-horizons-optimized-card-v2.webp`,
    hero: `${assetRoot}/distant-horizons-optimized-hero.webp`,
    available: false,
    tags: ["Otimizacao", "Distancia", "Visual"],
  },
  {
    id: "terraria-modpack",
    name: "Terraria Modpack",
    subtitle: "Em breve",
    card: `${assetRoot}/terraria-modpack-card-v2.webp`,
    hero: `${assetRoot}/terraria-modpack-hero.webp`,
    available: false,
    tags: ["Aventura", "Chefes", "Exploracao"],
  },
  {
    id: "tiktok-modpack",
    name: "TikTok Modpack",
    subtitle: "Em breve",
    card: `${assetRoot}/tiktok-modpack-card-v2.webp`,
    hero: `${assetRoot}/tiktok-modpack-hero.webp`,
    available: false,
    tags: ["Interativo", "Lives", "Multiplayer"],
  },
  {
    id: "medal-of-honor",
    name: "Medal of Honor",
    subtitle: "Em breve",
    card: `${assetRoot}/medal-of-honor-card-v2.webp`,
    hero: `${assetRoot}/medal-of-honor-hero.webp`,
    available: false,
    tags: ["Acao", "Historia", "Combate"],
  },
  {
    id: "naruto-rework",
    name: "Naruto Rework",
    subtitle: "Em breve",
    card: `${assetRoot}/naruto-rework-card-v2.webp`,
    hero: `${assetRoot}/naruto-rework-hero.webp`,
    available: false,
    tags: ["Anime", "Ninjas", "RPG"],
  },
];

const missions = [
  {
    number: 1,
    arc: "Treinamento inicial",
    title: "MINHA HISTORIA",
    objective: "Entrar no Monte Sagiri.",
    start: "Derrote seu primeiro Demon e use o corvo para localizar o Monte Sagiri. A missao termina ao entrar no bioma.",
  },
  {
    number: 2,
    arc: "Treinamento inicial",
    title: "OBRIGADO MESTRE!",
    objective: "Chamar Sabito para um treino PvP e vencer.",
    start: "No Monte Sagiri, use Shift + botao direito em Sabito, escolha Vamos Batalhar e venca o treino antes de ficar com dois coracoes.",
  },
  {
    number: 3,
    arc: "Treinamento inicial",
    title: "HORA DA VINGANCA",
    objective: "Derrotar ou ajudar a derrotar o Hand Demon.",
    start: "Procure o Hand Demon na regiao de treinamento e cause pelo menos um dano nele antes da morte. Assistencia tambem conta.",
  },
  {
    number: 4,
    arc: "Treinamento inicial",
    title: "ESTOU PRONTO",
    objective: "Desafiar Urokodaki para um treino PvP.",
    start: "Use Shift + botao direito em Urokodaki e escolha Vamos Batalhar. Iniciar o desafio ja conclui esta etapa.",
  },
  {
    number: 5,
    arc: "Vila e Tamayo",
    title: "PRIMEIRA MISSAO?",
    objective: "Encontrar uma vila e se aproximar de um aldeao.",
    start: "Peca a proxima localizacao ao corvo. Ele localiza uma vila real; aproxime-se de qualquer Villager para concluir.",
  },
  {
    number: 6,
    arc: "Vila e Tamayo",
    title: "TIRANDO O LIXO",
    objective: "Derrotar ou ajudar a derrotar tres Horned Demon.",
    start: "Permaneca na vila e participe da derrota dos tres Horned Demon. O terceiro abre o poco com o barril e Scarlet Ore Rare.",
  },
  {
    number: 7,
    arc: "Vila e Tamayo",
    title: "UM DEMONIO DO BEM?",
    objective: "Encontrar Tamayo e falar com ela.",
    start: "Escolha Mansao Tamayo no menu do corvo, siga o locate de house_tamayo e interaja com Tamayo usando Shift + botao direito.",
  },
  {
    number: 8,
    arc: "Vila e Tamayo",
    title: "PORQUE MUZAN OS MANDOU?",
    objective: "Derrotar ou ajudar a derrotar Susamaru e Yahaba.",
    start: "Depois da conversa com Tamayo, o tempo fica noturno e os dois aparecem perto do jogador. Cause dano nos dois antes que morram.",
  },
  {
    number: 9,
    arc: "Monte Natagumo",
    title: "PRIMEIRA MISSAO OFICIAL",
    objective: "Entrar no Monte Natagumo.",
    start: "Use Proxima Localizacao no corvo e siga as coordenadas do Monte Natagumo. A altura Y nao e exigida.",
  },
  {
    number: 10,
    arc: "Monte Natagumo",
    title: "VENHAM TODOS VOCES",
    objective: "Derrotar a mae, a irma, o pai e o irmao de Rui.",
    start: "Explore o Monte Natagumo e participe da derrota dos quatro membros da familia de Rui. Eles precisam cair na mesma progressao.",
  },
  {
    number: 11,
    arc: "Monte Natagumo",
    title: "LUA INFERIOR, QUANTO PODER!",
    objective: "Derrotar ou ajudar a derrotar Rui, Lua Inferior 5.",
    start: "Apos a familia ser derrotada, encontre Rui e cause pelo menos um dano antes da morte dele.",
  },
  {
    number: 12,
    arc: "Trem e Distrito",
    title: "PILAR DAS CHAMAS, ME AJUDE!",
    objective: "Pedir ajuda a Rengoku pela interacao do NPC.",
    start: "Use Shift + botao direito em Rengoku e escolha Preciso de Ajuda. Ele passa a acompanhar sua batalha.",
  },
  {
    number: 13,
    arc: "Trem e Distrito",
    title: "O BEM VENCE",
    objective: "Derrotar ou ajudar a derrotar Enmu.",
    start: "Peca ao corvo a estrutura do Trem Infinito, encontre Enmu dentro dela e participe da derrota.",
  },
  {
    number: 14,
    arc: "Trem e Distrito",
    title: "ENCENDEIE SEU CORACAO!",
    objective: "Atingir Akaza depois que Rengoku iniciar o confronto.",
    start: "Apos Enmu morrer, espere Rengoku atacar Akaza e acerte Akaza pelo menos uma vez durante o confronto.",
  },
  {
    number: 15,
    arc: "Trem e Distrito",
    title: "BOATOS DE UMA LUA SUPERIOR",
    objective: "Pedir ajuda a Uzui e Tanjiro.",
    start: "Interaja separadamente com Uzui e Tanjiro usando Shift + botao direito e escolha Preciso de Ajuda nos dois.",
  },
  {
    number: 16,
    arc: "Trem e Distrito",
    title: "CORTEM AS CABECAS!",
    objective: "Derrotar ou ajudar a derrotar Daki e Gyutaro.",
    start: "Enfrente Daki ate Gyutaro surgir naturalmente. Cause dano nos dois antes das mortes para registrar participacao.",
  },
  {
    number: 17,
    arc: "Treinamento Hashira",
    title: "ME AJUDE A MELHORAR",
    objective: "Desafiar Kanawo para um treino PvP e vencer.",
    start: "Use Shift + botao direito em Kanawo, escolha Vamos Batalhar e venca o treino.",
  },
  {
    number: 18,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO HASHIRA!",
    objective: "Desafiar Uzui e retirar pelo menos metade da vida dele.",
    start: "Inicie o PvP pela interacao de Uzui e reduza a vida dele a 50% ou menos.",
  },
  {
    number: 19,
    arc: "Treinamento Hashira",
    title: "PILAR DA NEVOA",
    objective: "Pedir ajuda a Tokito.",
    start: "Use Shift + botao direito em Tokito e escolha Preciso de Ajuda.",
  },
  {
    number: 20,
    arc: "Treinamento Hashira",
    title: "NAO POSSO ERRAR!",
    objective: "Derrotar ou ajudar a derrotar Gyokko.",
    start: "Encontre Gyokko durante a progressao e cause pelo menos um dano antes que ele seja derrotado.",
  },
  {
    number: 21,
    arc: "Treinamento Hashira",
    title: "PILAR DO AMOR",
    objective: "Pedir ajuda a Mitsuri.",
    start: "Use Shift + botao direito em Mitsuri e escolha Preciso de Ajuda.",
  },
  {
    number: 22,
    arc: "Treinamento Hashira",
    title: "O AMOR VENCE O ODIO!",
    objective: "Derrotar ou ajudar a derrotar Hantengu.",
    start: "Participe do confronto contra Hantengu e suas formas ate a derrota final ser registrada.",
  },
  {
    number: 23,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DA AGUA",
    objective: "Desafiar Giyu Tomioka para um treino PvP.",
    start: "Use Shift + botao direito em Giyu Tomioka e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 24,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DO INSETO",
    objective: "Desafiar Shinobu Kocho para um treino PvP.",
    start: "Use Shift + botao direito em Shinobu Kocho e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 25,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DO AMOR",
    objective: "Desafiar Mitsuri para um treino PvP.",
    start: "Use Shift + botao direito em Mitsuri e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 26,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DA ROCHA",
    objective: "Desafiar Gyomei para um treino PvP.",
    start: "Use Shift + botao direito em Gyomei e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 27,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DA SERPENTE",
    objective: "Desafiar Obanai para um treino PvP.",
    start: "Use Shift + botao direito em Obanai e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 28,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DO SOM",
    objective: "Desafiar Uzui para um treino PvP.",
    start: "Use Shift + botao direito em Uzui e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 29,
    arc: "Treinamento Hashira",
    title: "TREINAMENTO DA NEVOA",
    objective: "Desafiar Tokito para um treino PvP.",
    start: "Use Shift + botao direito em Tokito e escolha Vamos Batalhar. Nao e necessario vencer.",
  },
  {
    number: 30,
    arc: "Castelo Infinito",
    title: "A UM PASSO DO PONTO FINAL",
    objective: "Entregar 20 unidades de Blood Muzan para Tamayo.",
    start: "Leve 20 Blood Muzan no inventario e clique em Tamayo. Ela recolhe o sangue e entrega Human Return e Cell Destruction.",
  },
  {
    number: 31,
    arc: "Castelo Infinito",
    title: "HOJE TODA DESGRACA ACABA! OU NAO?",
    objective: "Atacar Muzan ate ele ficar com 80% da vida.",
    start: "Depois de ajudar Tamayo, encontre Muzan no Overworld e reduza a vida dele a 80%. Nakime inicia o transporte.",
  },
  {
    number: 32,
    arc: "Castelo Infinito",
    title: "QUE LUGAR E ESSE?",
    objective: "Entrar no Castelo Infinito.",
    start: "Esta etapa conclui automaticamente quando Nakime terminar de puxar o grupo para a dimensao do castelo.",
  },
  {
    number: 33,
    arc: "Castelo Infinito",
    title: "APENAS UM TAPA BURACO",
    objective: "Derrotar ou ajudar a derrotar Kaigaku.",
    start: "Aguarde a primeira onda do castelo e cause dano em Kaigaku antes da derrota.",
  },
  {
    number: 34,
    arc: "Castelo Infinito",
    title: "EU VINGAREI O FOGO!",
    objective: "Derrotar ou ajudar a derrotar Akaza.",
    start: "Depois de Kaigaku, aguarde a proxima onda e participe da derrota de Akaza.",
  },
  {
    number: 35,
    arc: "Castelo Infinito",
    title: "MENOS UMA LUA!",
    objective: "Derrotar ou ajudar a derrotar Doma.",
    start: "Apos Akaza, siga o transporte para o templo de Doma e cause dano nele antes da morte.",
  },
  {
    number: 36,
    arc: "Castelo Infinito",
    title: "EU NAO POSSO PARAR AQUI!",
    objective: "Derrotar ou ajudar a derrotar Kokushibo.",
    start: "Sobreviva a onda seguinte e participe da derrota de Kokushibo para liberar o confronto final.",
  },
  {
    number: 37,
    arc: "Castelo Infinito",
    title: "MONSTRO SEM CORACAO!",
    objective: "Derrotar ou ajudar a derrotar Muzan.",
    start: "Vinte segundos apos Kokushibo, enfrente Muzan. Aos 50% de vida a luta volta ao Overworld; termine o confronto la.",
  },
  {
    number: 38,
    arc: "Castelo Infinito",
    title: "TUDO ESTA ACABADO",
    objective: "Derrotar ou ajudar a derrotar Tanjiro Demon King.",
    start: "Tanjiro Demon King surge apos a morte de Muzan. Cause dano e sobreviva ate a derrota final para pacificar o mundo.",
  },
];

// Two laps keep the visible cards close together while preserving a full wheel.
const wheelSlots = [...packs, ...packs];
const slotCount = wheelSlots.length;
const stepAngle = 360 / slotCount;

const wheel = document.querySelector("[data-mod-wheel]");
const wheelPanel = document.querySelector(".wheel-panel");
const previousButton = document.querySelector("[data-wheel-prev]");
const nextButton = document.querySelector("[data-wheel-next]");
const packDetails = document.querySelector("[data-pack-details]");
const comingSoon = document.querySelector("[data-coming-soon]");
const title = document.querySelector("[data-pack-title]");
const status = document.querySelector("[data-pack-status]");
const lead = document.querySelector("[data-pack-lead]");
const description = document.querySelector("[data-pack-description]");
const version = document.querySelector("[data-info-version]");
const compatibility = document.querySelector("[data-info-compatibility]");
const type = document.querySelector("[data-info-type]");
const size = document.querySelector("[data-info-size]");
const updated = document.querySelector("[data-info-updated]");
const tagList = document.querySelector("[data-tag-list]");
const tipList = document.querySelector("[data-tip-list]");
const downloadButton = document.querySelector("[data-download-button]");
const downloadLabel = document.querySelector("[data-download-label]");
const tutorialButton = document.querySelector("[data-tutorial-button]");
const tutorialDialog = document.querySelector("[data-tutorial-dialog]");
const tutorialClose = document.querySelector("[data-tutorial-close]");
const tutorialScroll = document.querySelector("[data-tutorial-scroll]");
const missionsButton = document.querySelector("[data-missions-button]");
const missionsDialog = document.querySelector("[data-missions-dialog]");
const missionsClose = document.querySelector("[data-missions-close]");
const missionsScroll = document.querySelector("[data-missions-scroll]");
const missionsList = document.querySelector("[data-missions-list]");
const galleryImages = [...document.querySelectorAll("[data-gallery-image]")];
const galleryTiles = [...document.querySelectorAll("[data-gallery-index]")];
const imageDialog = document.querySelector("[data-image-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogClose = document.querySelector("[data-dialog-close]");

const requestedPackId =
  new URLSearchParams(window.location.search).get("pack") ||
  window.location.hash.replace(/^#/, "");
const requestedPackIndex = packs.findIndex((pack) => pack.id === requestedPackId);

let rotationSteps = requestedPackIndex >= 0 ? requestedPackIndex : 0;
let wheelLocked = false;
let touchStartX = null;

function normalizeIndex(index, total = slotCount) {
  return ((index % total) + total) % total;
}

function circularDistance(index, center, total = slotCount) {
  let distance = index - center;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

function selectedWheelIndex() {
  return normalizeIndex(rotationSteps);
}

function selectedPack() {
  return packs[normalizeIndex(rotationSteps, packs.length)];
}

function createWheelCards() {
  if (!wheel) return;

  const track = document.createElement("div");
  track.className = "wheel-track";
  track.dataset.wheelTrack = "";

  wheelSlots.forEach((pack, index) => {
    const card = document.createElement("button");
    const image = document.createElement("img");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const subtitle = document.createElement("small");

    card.type = "button";
    card.className = "wheel-card";
    card.dataset.wheelIndex = String(index);
    card.dataset.packIndex = String(index % packs.length);
    card.style.setProperty("--card-angle", `${index * stepAngle}deg`);
    card.setAttribute("role", "option");
    card.setAttribute("aria-label", `Selecionar ${pack.name}`);

    if (pack.name.length > 21) card.classList.add("has-long-title");

    image.src = pack.card;
    image.alt = "";
    image.width = 480;
    image.height = 270;
    image.loading = index > 5 ? "lazy" : "eager";

    copy.className = "wheel-card__copy";
    name.textContent = pack.name;
    subtitle.textContent = pack.subtitle;
    copy.append(name, subtitle);
    card.append(image, copy);

    card.addEventListener("click", () => selectWheelSlot(index));
    track.append(card);
  });

  wheel.append(track);
}

function updateWheel() {
  const track = document.querySelector("[data-wheel-track]");
  const center = selectedWheelIndex();

  track?.style.setProperty("--wheel-rotation", `${rotationSteps * -stepAngle}deg`);
  track?.style.setProperty(
    "--wheel-counter-rotation",
    `${rotationSteps * stepAngle}deg`,
  );

  document.querySelectorAll("[data-wheel-index]").forEach((card) => {
    const index = Number(card.dataset.wheelIndex);
    const slot = circularDistance(index, center);
    const active = slot === 0;

    card.dataset.slot = String(slot);
    card.dataset.hidden = String(Math.abs(slot) > 3);
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-selected", String(active));
    card.tabIndex = active ? 0 : -1;
  });
}

function renderTags(tags) {
  if (!tagList) return;

  tagList.replaceChildren(
    ...tags.map((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      return item;
    }),
  );
}

function renderTips(tips) {
  if (!tipList) return;

  tipList.replaceChildren(
    ...tips.map((tip) => {
      const item = document.createElement("li");
      item.textContent = tip;
      return item;
    }),
  );
}

function renderMissions() {
  if (!missionsList) return;

  let previousArc = "";
  const items = missions.map((mission) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    const content = document.createElement("article");
    const header = document.createElement("header");
    const arc = document.createElement("small");
    const title = document.createElement("h3");
    const objective = document.createElement("p");
    const start = document.createElement("p");
    const objectiveLabel = document.createElement("strong");
    const startLabel = document.createElement("strong");

    item.className = "mission-entry";
    if (mission.arc !== previousArc) item.classList.add("starts-arc");
    previousArc = mission.arc;

    number.className = "mission-entry__number";
    number.textContent = String(mission.number).padStart(2, "0");

    arc.textContent = mission.arc;
    title.textContent = mission.title;
    header.append(arc, title);

    objective.className = "mission-entry__objective";
    objectiveLabel.textContent = "Objetivo: ";
    objective.append(objectiveLabel, mission.objective);

    start.className = "mission-entry__start";
    startLabel.textContent = "Como iniciar: ";
    start.append(startLabel, mission.start);

    content.append(header, objective, start);
    item.append(number, content);
    return item;
  });

  missionsList.replaceChildren(...items);
}

function renderPack(pack) {
  title.textContent = pack.available ? `Modpack ${pack.name}` : pack.name;

  if (!pack.available) {
    packDetails.hidden = true;
    comingSoon.hidden = false;
    comingSoon.style.setProperty("--coming-image", `url("${pack.hero}")`);
    comingSoon.setAttribute("aria-label", `${pack.name}: ${pack.subtitle}`);
    comingSoon.querySelector("strong").textContent = pack.subtitle;

    version.textContent = pack.subtitle.toUpperCase();
    compatibility.textContent = pack.subtitle.toUpperCase();
    type.textContent = "Modpack";
    size.textContent = pack.subtitle.toUpperCase();
    updated.textContent = pack.subtitle.toUpperCase();
    renderTags(pack.tags);
    return;
  }

  comingSoon.hidden = true;
  comingSoon.style.removeProperty("--coming-image");
  comingSoon.removeAttribute("aria-label");
  packDetails.hidden = false;

  status.textContent = "Modpack completo";
  lead.textContent = pack.lead;
  description.textContent = pack.description;
  version.textContent = pack.version;
  compatibility.textContent = pack.compatibility;
  type.textContent = pack.type;
  size.textContent = pack.size;
  updated.textContent = pack.updated;
  renderTags(pack.tags);
  renderTips(pack.tips);

  galleryImages.forEach((image, index) => {
    image.src = pack.images[index] || pack.images[0];
    image.alt = `${pack.name}, imagem ${index + 1}`;
  });

  downloadButton.classList.remove("is-disabled");
  downloadButton.href = pack.download;
  downloadButton.setAttribute("aria-disabled", "false");
  downloadLabel.textContent = "Baixar mod!";
}

function releaseWheel() {
  window.setTimeout(() => {
    wheelLocked = false;
  }, reducedMotion.matches ? 0 : 640);
}

function selectWheelSlot(index) {
  if (wheelLocked) return;

  const distance = circularDistance(
    normalizeIndex(index),
    selectedWheelIndex(),
  );
  if (distance === 0) {
    if (window.matchMedia("(max-width: 980px)").matches) {
      document.querySelector("[data-showcase]")?.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    }
    return;
  }

  wheelLocked = true;
  rotationSteps += distance;
  updateWheel();
  renderPack(selectedPack());
  releaseWheel();
}

function moveWheel(direction) {
  if (wheelLocked) return;

  wheelLocked = true;
  rotationSteps += direction;
  updateWheel();
  renderPack(selectedPack());
  releaseWheel();
}

createWheelCards();
renderMissions();
updateWheel();
renderPack(selectedPack());

previousButton?.addEventListener("click", () => moveWheel(-1));
nextButton?.addEventListener("click", () => moveWheel(1));

wheel?.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    moveWheel(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false },
);

wheelPanel?.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  },
  { passive: true },
);

wheelPanel?.addEventListener(
  "touchend",
  (event) => {
    if (touchStartX === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = touchEndX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) < 45) return;
    moveWheel(distance < 0 ? 1 : -1);
  },
  { passive: true },
);

wheelPanel?.addEventListener("touchcancel", () => {
  touchStartX = null;
});

document.addEventListener("keydown", (event) => {
  if (imageDialog?.open || tutorialDialog?.open || missionsDialog?.open) return;
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") moveWheel(-1);
  if (event.key === "ArrowDown" || event.key === "ArrowRight") moveWheel(1);
});

downloadButton?.addEventListener("click", (event) => {
  if (downloadButton.classList.contains("is-disabled")) event.preventDefault();
});

tutorialButton?.addEventListener("click", () => {
  if (!tutorialDialog || tutorialDialog.open) return;
  if (tutorialScroll) tutorialScroll.scrollTop = 0;
  tutorialDialog.showModal();
});

tutorialClose?.addEventListener("click", () => tutorialDialog?.close());
tutorialDialog?.addEventListener("click", (event) => {
  if (event.target === tutorialDialog) tutorialDialog.close();
});

missionsButton?.addEventListener("click", () => {
  if (!missionsDialog || missionsDialog.open) return;
  if (missionsScroll) missionsScroll.scrollTop = 0;
  missionsDialog.showModal();
});

missionsClose?.addEventListener("click", () => missionsDialog?.close());
missionsDialog?.addEventListener("click", (event) => {
  if (event.target === missionsDialog) missionsDialog.close();
});

galleryTiles.forEach((tile, index) => {
  tile.addEventListener("click", () => {
    if (!imageDialog || !dialogImage || !galleryImages[index]?.src) return;

    dialogImage.src = galleryImages[index].src;
    dialogImage.alt = galleryImages[index].alt;
    imageDialog.showModal();
  });
});

dialogClose?.addEventListener("click", () => imageDialog?.close());
imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

document.querySelectorAll("[data-navigate]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      reducedMotion.matches
    ) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => window.location.assign(link.href), 180);
  });
});
