const toast = document.querySelector("[data-toast]");
const toastMessage = document.querySelector("[data-toast-message]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let toastTimer;

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
