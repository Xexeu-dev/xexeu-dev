const toast = document.querySelector("[data-toast]");
const toastMessage = document.querySelector("[data-toast-message]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const projectModal = document.querySelector("[data-project-modal]");
const projectModalImage = document.querySelector("[data-project-image]");
const projectModalType = document.querySelector("[data-project-type]");
const projectModalTitle = document.querySelector("[data-project-title]");
const projectModalDescription = document.querySelector("[data-project-description]");
const projectModalThumbs = document.querySelector("[data-project-thumbs]");
const projectModalLink = document.querySelector("[data-project-link]");

let toastTimer;
let lastProjectTrigger = null;

document.querySelectorAll("[data-coming-soon]").forEach((card) => {
  card.addEventListener("click", () => {
    if (!toast || !toastMessage) return;

    window.clearTimeout(toastTimer);
    toastMessage.textContent = card.dataset.comingSoon;
    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.setAttribute("aria-hidden", "true");
    }, 3200);
  });
});

document.querySelectorAll("[data-navigate]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const modifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (modifiedClick || reducedMotion.matches) return;

    event.preventDefault();
    document.body.classList.add("is-leaving");

    window.setTimeout(() => {
      window.location.assign(link.href);
    }, 240);
  });
});

function selectProjectImage(source, title, thumbButtons, activeButton) {
  if (!projectModalImage) return;

  projectModalImage.src = source;
  projectModalImage.alt = `Imagem do projeto ${title}`;
  thumbButtons.forEach((button) => button.classList.toggle("is-active", button === activeButton));
}

function openProject(card) {
  if (
    !projectModal ||
    !projectModalImage ||
    !projectModalType ||
    !projectModalTitle ||
    !projectModalDescription ||
    !projectModalThumbs ||
    !projectModalLink
  ) {
    return;
  }

  const title = card.dataset.title || "Projeto";
  const mainImage = card.dataset.image || "";
  const gallery = (card.dataset.gallery || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
  const images = [...new Set([mainImage, ...gallery].filter(Boolean))];
  const link = card.dataset.link || "";

  lastProjectTrigger = card;
  projectModalType.textContent = card.dataset.type || "Projeto";
  projectModalTitle.textContent = title;
  projectModalDescription.textContent = card.dataset.description || "";
  projectModalThumbs.replaceChildren();

  const thumbButtons = images.map((source, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.type = "button";
    button.setAttribute("aria-label", `Ver imagem ${index + 1} de ${title}`);
    image.src = source;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    button.append(image);
    projectModalThumbs.append(button);
    button.addEventListener("click", () => {
      selectProjectImage(source, title, thumbButtons, button);
    });
    return button;
  });

  if (images[0]) {
    selectProjectImage(images[0], title, thumbButtons, thumbButtons[0]);
  }

  projectModalThumbs.hidden = images.length < 2;
  projectModalLink.hidden = !link;
  if (link) projectModalLink.href = link;

  projectModal.inert = false;
  projectModal.classList.add("is-open");
  document.body.classList.add("modal-open");
  projectModal.querySelector(".project-modal__close")?.focus();
}

function closeProject() {
  if (!projectModal?.classList.contains("is-open")) return;

  projectModal.classList.remove("is-open");
  projectModal.inert = true;
  document.body.classList.remove("modal-open");
  lastProjectTrigger?.focus();
  lastProjectTrigger = null;
}

document.querySelectorAll("[data-project-card]").forEach((card) => {
  card.addEventListener("click", () => openProject(card));
});

document.querySelectorAll("[data-project-close]").forEach((button) => {
  button.addEventListener("click", closeProject);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProject();
});

const navLinks = [...document.querySelectorAll('.nav-card[href^="#"]')];
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-28% 0px -56% 0px",
      threshold: [0, 0.08, 0.2, 0.45],
    },
  );

  navSections.forEach((section) => sectionObserver.observe(section));
}
