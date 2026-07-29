const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const selectorCards = [...document.querySelectorAll("[data-pack-id]")];
const mainImage = document.querySelector("[data-main-image]");
const imageCaption = document.querySelector("[data-image-caption]");
const thumbButtons = [...document.querySelectorAll("[data-gallery-image]")];
const previousButton = document.querySelector("[data-carousel-prev]");
const nextButton = document.querySelector("[data-carousel-next]");
const currentIndex = document.querySelector("[data-current-index]");
const totalIndex = document.querySelector("[data-total-index]");

let selectedIndex = 0;

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function selectGalleryImage(button) {
  if (!mainImage || !button) return;

  const source = button.dataset.galleryImage;
  if (!source) return;

  thumbButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  mainImage.classList.add("is-changing");

  window.setTimeout(
    () => {
      mainImage.src = source;
      mainImage.alt = button.dataset.galleryAlt || "";
      if (imageCaption) imageCaption.textContent = button.dataset.galleryCaption || "";
      mainImage.classList.remove("is-changing");
    },
    reducedMotion.matches ? 0 : 140,
  );
}

function selectPack(index) {
  if (!selectorCards.length) return;

  selectedIndex = Math.max(0, Math.min(index, selectorCards.length - 1));
  selectorCards.forEach((card, cardIndex) => {
    const active = cardIndex === selectedIndex;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-selected", String(active));
  });

  if (currentIndex) currentIndex.textContent = formatIndex(selectedIndex);
  if (totalIndex) totalIndex.textContent = formatIndex(selectorCards.length - 1);
  if (previousButton) previousButton.disabled = selectedIndex === 0;
  if (nextButton) nextButton.disabled = selectedIndex === selectorCards.length - 1;
}

selectorCards.forEach((card, index) => {
  card.addEventListener("click", () => selectPack(index));
});

thumbButtons.forEach((button) => {
  button.addEventListener("click", () => selectGalleryImage(button));
});

previousButton?.addEventListener("click", () => selectPack(selectedIndex - 1));
nextButton?.addEventListener("click", () => selectPack(selectedIndex + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") selectPack(selectedIndex - 1);
  if (event.key === "ArrowDown") selectPack(selectedIndex + 1);
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
    window.setTimeout(() => window.location.assign(link.href), 220);
  });
});

selectPack(0);
