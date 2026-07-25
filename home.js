const cards = document.querySelectorAll(".option-card");
const toast = document.querySelector("[data-toast]");
const toastMessage = document.querySelector("[data-toast-message]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let toastTimer;

cards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    card.style.setProperty("--pointer-x", `${pointerX}%`);
    card.style.setProperty("--pointer-y", `${pointerY}%`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--pointer-x");
    card.style.removeProperty("--pointer-y");
  });
});

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
    }, 260);
  });
});
