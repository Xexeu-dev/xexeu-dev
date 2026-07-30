const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const assetRoot = "./assets/modpacks/catalog";

const packs = [
  {
    id: "kimetsu-no-yaiba",
    name: "Kimetsu no Yaiba",
    subtitle: "Disponivel",
    card: `${assetRoot}/kimetsu-no-yaiba-card.webp`,
    hero: `${assetRoot}/kimetsu-no-yaiba-hero.webp`,
    available: true,
    images: [
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
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
      "Use o corvo para localizar o objetivo da proxima missao.",
      "Adicione seus companheiros com /amigo [nick].",
      "Escolha o Castelo Otimizado em computadores mais fracos.",
    ],
    download:
      "https://github.com/Xexeu-dev/xexeu-dev/releases/download/kimetsu-java-v1.0.1/Kimetsu-no-Yaiba-Modpack-Xexeu-1.0.1.zip",
  },
  {
    id: "orespawn-rework",
    name: "Orespawn Rework",
    subtitle: "Em breve",
    card: `${assetRoot}/orespawn-rework-card.webp`,
    hero: `${assetRoot}/orespawn-rework-hero.webp`,
    available: false,
    tags: ["Aventura", "Chefes", "Exploracao"],
  },
  {
    id: "the-sims-rework",
    name: "The Sims Rework",
    subtitle: "Em breve",
    card: `${assetRoot}/the-sims-rework-card.webp`,
    hero: `${assetRoot}/the-sims-rework-hero.webp`,
    available: false,
    tags: ["Simulacao", "Construcao", "Vida"],
  },
  {
    id: "god-of-war",
    name: "God of War",
    subtitle: "Em breve",
    card: `${assetRoot}/god-of-war-card.webp`,
    hero: `${assetRoot}/god-of-war-hero.webp`,
    available: false,
    tags: ["Aventura", "Combate", "Mitologia"],
  },
  {
    id: "black-phone",
    name: "Black Phone",
    subtitle: "Em breve",
    card: `${assetRoot}/black-phone-card.webp`,
    hero: `${assetRoot}/black-phone-hero.webp`,
    available: false,
    tags: ["Terror", "Historia", "Sobrevivencia"],
  },
  {
    id: "distant-horizons-optimized",
    name: "Distant Horizons Otimizado",
    subtitle: "Em breve",
    card: `${assetRoot}/distant-horizons-optimized-card.webp`,
    hero: `${assetRoot}/distant-horizons-optimized-hero.webp`,
    available: false,
    tags: ["Otimizacao", "Distancia", "Visual"],
  },
  {
    id: "terraria-modpack",
    name: "Terraria Modpack",
    subtitle: "Em breve",
    card: `${assetRoot}/terraria-modpack-card.webp`,
    hero: `${assetRoot}/terraria-modpack-hero.webp`,
    available: false,
    tags: ["Aventura", "Chefes", "Exploracao"],
  },
  {
    id: "tiktok-modpack",
    name: "TikTok Modpack",
    subtitle: "Em breve",
    card: `${assetRoot}/tiktok-modpack-card.webp`,
    hero: `${assetRoot}/tiktok-modpack-hero.webp`,
    available: false,
    tags: ["Interativo", "Lives", "Multiplayer"],
  },
  {
    id: "medal-of-honor",
    name: "Medal of Honor",
    subtitle: "Em breve",
    card: `${assetRoot}/medal-of-honor-card.webp`,
    hero: `${assetRoot}/medal-of-honor-hero.webp`,
    available: false,
    tags: ["Acao", "Historia", "Combate"],
  },
  {
    id: "naruto-rework",
    name: "Naruto Rework",
    subtitle: "Em breve",
    card: `${assetRoot}/naruto-rework-card.webp`,
    hero: `${assetRoot}/naruto-rework-hero.webp`,
    available: false,
    tags: ["Anime", "Ninjas", "RPG"],
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

function renderPack(pack) {
  title.textContent = pack.available ? `Modpack ${pack.name}` : pack.name;

  if (!pack.available) {
    packDetails.hidden = true;
    comingSoon.hidden = false;
    comingSoon.style.setProperty("--coming-image", `url("${pack.hero}")`);
    comingSoon.setAttribute("aria-label", `${pack.name}: em breve`);

    version.textContent = "EM BREVE";
    compatibility.textContent = "EM BREVE";
    type.textContent = "Modpack";
    size.textContent = "EM BREVE";
    updated.textContent = "EM BREVE";
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
  if (distance === 0) return;

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
  if (imageDialog?.open || tutorialDialog?.open) return;
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
