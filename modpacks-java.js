const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const packs = [
  {
    id: "slayer-legends",
    name: "Slayer Legends",
    subtitle: "Em breve",
    card: "./assets/portal/card-services-exact.webp",
    images: [
      "./assets/portal/card-services-exact.webp",
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
      "./assets/portal/card-services-exact.webp",
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
    ],
    lead: "Um novo modpack esta sendo preparado.",
    description: "Este espaco sera liberado quando o proximo modpack estiver pronto.",
    version: "Em breve",
    compatibility: "A definir",
    type: "Modpack",
    size: "-",
    updated: "-",
    tags: ["Em breve"],
    download: "",
  },
  {
    id: "shinobi-world",
    name: "Shinobi World",
    subtitle: "Em breve",
    card: "./assets/portal/card-others-exact.webp",
    images: [
      "./assets/portal/card-others-exact.webp",
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
      "./assets/portal/card-others-exact.webp",
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
    ],
    lead: "Uma nova aventura esta a caminho.",
    description: "Selecao reservada para um futuro modpack de Xexeu Dev.",
    version: "Em breve",
    compatibility: "A definir",
    type: "Modpack",
    size: "-",
    updated: "-",
    tags: ["Em breve"],
    download: "",
  },
  {
    id: "kimetsu",
    name: "Kimetsu no Yaiba",
    subtitle: "Demon Slayer",
    card: "./assets/modpacks/kimetsu/kimetsu-card.webp",
    images: [
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
    ],
    lead: "Entre em uma jornada completa inspirada em Demon Slayer.",
    description:
      "Enfrente onis e luas superiores, aprenda respiracoes, evolua como cacador ou demonio e conclua uma campanha feita para jogar sozinho ou com amigos.",
    version: "1.0.0",
    compatibility: "Forge 1.20.1",
    type: "Modpack",
    size: "276 MB",
    updated: "29/07/2026",
    tags: ["Aventura", "Anime", "RPG", "Missoes", "Multiplayer"],
    download:
      "https://github.com/Xexeu-dev/xexeu-dev/releases/download/kimetsu-java-v1.0.0/Kimetsu-no-Yaiba-Modpack-Xexeu-1.0.0.zip",
  },
  {
    id: "craft-evolution",
    name: "Craft Evolution",
    subtitle: "Em breve",
    card: "./assets/portal/card-java-exact.webp",
    images: [
      "./assets/portal/card-java-exact.webp",
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
      "./assets/portal/card-java-exact.webp",
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
    ],
    lead: "Mais um mundo esta sendo construido.",
    description: "Selecao reservada para um futuro modpack de Xexeu Dev.",
    version: "Em breve",
    compatibility: "A definir",
    type: "Modpack",
    size: "-",
    updated: "-",
    tags: ["Em breve"],
    download: "",
  },
  {
    id: "sky-realms",
    name: "Sky Realms",
    subtitle: "Em breve",
    card: "./assets/portal/modpacks-java.webp",
    images: [
      "./assets/portal/modpacks-java.webp",
      "./assets/modpacks/kimetsu/kimetsu-menu.png",
      "./assets/portal/modpacks-java.webp",
      "./assets/modpacks/kimetsu/kimetsu-cover.png",
    ],
    lead: "Uma futura jornada entre mundos.",
    description: "Selecao reservada para um futuro modpack de Xexeu Dev.",
    version: "Em breve",
    compatibility: "A definir",
    type: "Modpack",
    size: "-",
    updated: "-",
    tags: ["Em breve"],
    download: "",
  },
];

const wheel = document.querySelector("[data-mod-wheel]");
const previousButton = document.querySelector("[data-wheel-prev]");
const nextButton = document.querySelector("[data-wheel-next]");
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
const downloadButton = document.querySelector("[data-download-button]");
const downloadLabel = document.querySelector("[data-download-label]");
const galleryImages = [...document.querySelectorAll("[data-gallery-image]")];
const galleryTiles = [...document.querySelectorAll("[data-gallery-index]")];
const imageDialog = document.querySelector("[data-image-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogClose = document.querySelector("[data-dialog-close]");

let selectedIndex = 2;
let wheelLocked = false;

function circularDistance(index, center) {
  let distance = index - center;
  const half = packs.length / 2;
  if (distance > half) distance -= packs.length;
  if (distance < -half) distance += packs.length;
  return distance;
}

function createWheelCards() {
  if (!wheel) return;

  packs.forEach((pack, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "wheel-card";
    card.dataset.packIndex = String(index);
    card.setAttribute("role", "option");
    card.innerHTML = `
      <img src="${pack.card}" alt="" width="320" height="180" />
      <span class="wheel-card__copy">
        <strong>${pack.name}</strong>
        <small>${pack.subtitle}</small>
      </span>
    `;
    card.addEventListener("click", () => selectPack(index));
    wheel.append(card);
  });
}

function updateWheel() {
  document.querySelectorAll("[data-pack-index]").forEach((card) => {
    const index = Number(card.dataset.packIndex);
    const slot = circularDistance(index, selectedIndex);
    const visible = slot >= -2 && slot <= 2;
    card.dataset.slot = String(slot);
    card.dataset.hidden = String(!visible);
    card.classList.toggle("is-active", slot === 0);
    card.setAttribute("aria-selected", String(slot === 0));
    card.tabIndex = slot === 0 ? 0 : -1;
  });
}

function renderPack(pack) {
  title.textContent = `Modpack ${pack.name}`;
  status.textContent = pack.download ? "Modpack completo" : "Em desenvolvimento";
  lead.textContent = pack.lead;
  description.textContent = pack.description;
  version.textContent = pack.version;
  compatibility.textContent = pack.compatibility;
  type.textContent = pack.type;
  size.textContent = pack.size;
  updated.textContent = pack.updated;

  tagList.replaceChildren(
    ...pack.tags.map((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      return item;
    }),
  );

  galleryImages.forEach((image, index) => {
    image.src = pack.images[index] || pack.images[0];
    image.alt = `${pack.name}, imagem ${index + 1}`;
  });

  downloadButton.classList.toggle("is-disabled", !pack.download);
  downloadButton.href = pack.download || "#";
  downloadButton.setAttribute("aria-disabled", String(!pack.download));
  downloadLabel.textContent = pack.download ? "Baixar mod!" : "Em breve";
}

function selectPack(index) {
  if (wheelLocked || index === selectedIndex) return;

  wheelLocked = true;
  selectedIndex = (index + packs.length) % packs.length;
  updateWheel();
  renderPack(packs[selectedIndex]);

  window.setTimeout(() => {
    wheelLocked = false;
  }, reducedMotion.matches ? 0 : 430);
}

function moveWheel(direction) {
  selectPack(selectedIndex + direction);
}

createWheelCards();
updateWheel();
renderPack(packs[selectedIndex]);

previousButton?.addEventListener("click", () => moveWheel(-1));
nextButton?.addEventListener("click", () => moveWheel(1));

wheel?.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    if (wheelLocked) return;
    moveWheel(event.deltaY > 0 ? 1 : -1);
  },
  { passive: false },
);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") moveWheel(-1);
  if (event.key === "ArrowDown" || event.key === "ArrowRight") moveWheel(1);
});

downloadButton?.addEventListener("click", (event) => {
  if (downloadButton.classList.contains("is-disabled")) event.preventDefault();
});

galleryTiles.forEach((tile, index) => {
  tile.addEventListener("click", () => {
    if (!imageDialog || !dialogImage) return;
    dialogImage.src = galleryImages[index].src;
    dialogImage.alt = galleryImages[index].alt;
    imageDialog.showModal();
  });
});

dialogClose?.addEventListener("click", () => imageDialog?.close());
imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

document.querySelector("[data-details-button]")?.addEventListener("click", () => {
  document.querySelector(".pack-copy")?.scrollIntoView({
    behavior: reducedMotion.matches ? "auto" : "smooth",
    block: "center",
  });
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
