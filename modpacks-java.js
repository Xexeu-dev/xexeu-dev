const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const slotCount = 18;
const stepAngle = 360 / slotCount;

const kimetsuPack = {
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
  features: [
    "38 missoes e progressao",
    "Onis, luas e chefes",
    "Armas e respiracoes",
    "Historia personalizada",
    "Castelo Infinito",
    "Compativel com multiplayer",
  ],
  download:
    "https://github.com/Xexeu-dev/xexeu-dev/releases/download/kimetsu-java-v1.0.0/Kimetsu-no-Yaiba-Modpack-Xexeu-1.0.0.zip",
};

const slots = Array.from({ length: slotCount }, (_, index) =>
  index === 0 ? kimetsuPack : null,
);

const wheel = document.querySelector("[data-mod-wheel]");
const wheelPanel = document.querySelector(".wheel-panel");
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
const featureItems = [...document.querySelectorAll("[data-feature-grid] strong")];
const downloadButton = document.querySelector("[data-download-button]");
const downloadLabel = document.querySelector("[data-download-label]");
const detailsButton = document.querySelector("[data-details-button]");
const galleryImages = [...document.querySelectorAll("[data-gallery-image]")];
const galleryTiles = [...document.querySelectorAll("[data-gallery-index]")];
const imageDialog = document.querySelector("[data-image-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogClose = document.querySelector("[data-dialog-close]");

let selectedIndex = 0;
let rotationSteps = 0;
let wheelLocked = false;
let touchStartX = null;

function normalizeIndex(index) {
  return ((index % slotCount) + slotCount) % slotCount;
}

function circularDistance(index, center) {
  let distance = index - center;
  if (distance > slotCount / 2) distance -= slotCount;
  if (distance < -slotCount / 2) distance += slotCount;
  return distance;
}

function createWheelCards() {
  if (!wheel) return;

  const track = document.createElement("div");
  track.className = "wheel-track";
  track.dataset.wheelTrack = "";

  slots.forEach((pack, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `wheel-card${pack ? "" : " is-placeholder"}`;
    card.dataset.packIndex = String(index);
    card.style.setProperty("--card-angle", `${index * stepAngle}deg`);
    card.setAttribute("role", "option");
    card.setAttribute(
      "aria-label",
      pack ? `Selecionar ${pack.name}` : "Espaco vazio, em breve",
    );

    if (pack) {
      card.innerHTML = `
        <img src="${pack.card}" alt="" width="320" height="180" />
        <span class="wheel-card__copy">
          <strong>${pack.name}</strong>
          <small>${pack.subtitle}</small>
        </span>
      `;
    }

    card.addEventListener("click", () => selectSlot(index));
    track.append(card);
  });

  wheel.append(track);
}

function updateWheel() {
  const track = document.querySelector("[data-wheel-track]");
  track?.style.setProperty("--wheel-rotation", `${rotationSteps * -stepAngle}deg`);
  track?.style.setProperty(
    "--wheel-counter-rotation",
    `${rotationSteps * stepAngle}deg`,
  );

  document.querySelectorAll("[data-pack-index]").forEach((card) => {
    const index = Number(card.dataset.packIndex);
    const slot = circularDistance(index, selectedIndex);
    const active = slot === 0;
    card.dataset.slot = String(slot);
    card.dataset.hidden = String(Math.abs(slot) > 3);
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-selected", String(active));
    card.tabIndex = active ? 0 : -1;
  });
}

function renderTags(tags) {
  tagList.replaceChildren(
    ...tags.map((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      return item;
    }),
  );
}

function renderPack(pack) {
  if (!pack) {
    status.textContent = "Em breve";
    title.textContent = "Em breve";
    lead.textContent = "EM BREVE";
    description.textContent = "Um novo modpack ocupara este espaco futuramente.";
    version.textContent = "EM BREVE";
    compatibility.textContent = "EM BREVE";
    type.textContent = "EM BREVE";
    size.textContent = "EM BREVE";
    updated.textContent = "EM BREVE";
    featureItems.forEach((item) => {
      item.textContent = "EM BREVE";
    });
    renderTags(["EM BREVE"]);

    galleryImages.forEach((image) => {
      image.hidden = true;
      image.removeAttribute("src");
      image.alt = "";
    });
    galleryTiles.forEach((tile) => tile.classList.add("is-placeholder"));

    downloadButton.classList.add("is-disabled");
    downloadButton.href = "#";
    downloadButton.setAttribute("aria-disabled", "true");
    downloadLabel.textContent = "Em breve";
    detailsButton.disabled = true;
    return;
  }

  status.textContent = "Modpack completo";
  title.textContent = `Modpack ${pack.name}`;
  lead.textContent = pack.lead;
  description.textContent = pack.description;
  version.textContent = pack.version;
  compatibility.textContent = pack.compatibility;
  type.textContent = pack.type;
  size.textContent = pack.size;
  updated.textContent = pack.updated;
  featureItems.forEach((item, index) => {
    item.textContent = pack.features[index];
  });
  renderTags(pack.tags);

  galleryImages.forEach((image, index) => {
    image.hidden = false;
    image.src = pack.images[index] || pack.images[0];
    image.alt = `${pack.name}, imagem ${index + 1}`;
  });
  galleryTiles.forEach((tile) => tile.classList.remove("is-placeholder"));

  downloadButton.classList.remove("is-disabled");
  downloadButton.href = pack.download;
  downloadButton.setAttribute("aria-disabled", "false");
  downloadLabel.textContent = "Baixar mod!";
  detailsButton.disabled = false;
}

function selectSlot(index) {
  if (wheelLocked) return;

  const normalized = normalizeIndex(index);
  const distance = circularDistance(normalized, selectedIndex);
  if (distance === 0) return;

  wheelLocked = true;
  rotationSteps += distance;
  selectedIndex = normalized;
  updateWheel();
  renderPack(slots[selectedIndex]);

  window.setTimeout(() => {
    wheelLocked = false;
  }, reducedMotion.matches ? 0 : 640);
}

function moveWheel(direction) {
  if (wheelLocked) return;
  rotationSteps += direction;
  selectedIndex = normalizeIndex(rotationSteps);
  wheelLocked = true;
  updateWheel();
  renderPack(slots[selectedIndex]);

  window.setTimeout(() => {
    wheelLocked = false;
  }, reducedMotion.matches ? 0 : 640);
}

createWheelCards();
updateWheel();
renderPack(slots[selectedIndex]);

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
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") moveWheel(-1);
  if (event.key === "ArrowDown" || event.key === "ArrowRight") moveWheel(1);
});

downloadButton?.addEventListener("click", (event) => {
  if (downloadButton.classList.contains("is-disabled")) event.preventDefault();
});

galleryTiles.forEach((tile, index) => {
  tile.addEventListener("click", () => {
    if (
      tile.classList.contains("is-placeholder") ||
      !imageDialog ||
      !dialogImage
    ) {
      return;
    }
    dialogImage.src = galleryImages[index].src;
    dialogImage.alt = galleryImages[index].alt;
    imageDialog.showModal();
  });
});

dialogClose?.addEventListener("click", () => imageDialog?.close());
imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

detailsButton?.addEventListener("click", () => {
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
