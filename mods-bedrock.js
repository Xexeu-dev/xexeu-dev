(() => {
  "use strict";

  const stage = document.querySelector("[data-orbit-stage]");
  const pillar = document.querySelector("[data-pillar]");
  const pillarModel = document.querySelector("[data-pillar-model]");
  const cards = Array.from(document.querySelectorAll("[data-addon-card]"));
  const previousButton = document.querySelector("[data-orbit-prev]");
  const nextButton = document.querySelector("[data-orbit-next]");
  const modal = document.querySelector("[data-addon-modal]");
  const modalCloseButtons = Array.from(
    document.querySelectorAll("[data-addon-close]"),
  );
  const toast = document.querySelector("[data-toast]");
  const toastMessage = document.querySelector("[data-toast-message]");

  if (!stage || !cards.length) return;

  const count = cards.length;
  const step = 360 / count;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let rotation = 0;
  let activeIndex = 0;
  let pointerId = null;
  let pointerStartX = 0;
  let rotationAtPointerStart = 0;
  let suppressCardClick = false;
  let toastTimer = 0;
  let wheelTimer = 0;
  let wheelTotal = 0;
  let lastModalTrigger = null;

  const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;

  const normalizeAngle = (angle) => modulo(angle + 180, 360) - 180;

  const readOrbitValue = (name, fallback) => {
    const value = Number.parseFloat(
      getComputedStyle(stage).getPropertyValue(name),
    );
    return Number.isFinite(value) ? value : fallback;
  };

  const renderOrbit = () => {
    const radius = readOrbitValue("--orbit-radius", 310);
    const ySpread = readOrbitValue("--orbit-y-spread", 112);

    activeIndex = modulo(Math.round(-rotation / step), count);

    cards.forEach((card, index) => {
      const angle = index * step + rotation;
      const radians = (angle * Math.PI) / 180;
      const depth = (Math.cos(radians) + 1) / 2;
      const x = Math.sin(radians) * radius;
      const y = (depth - 0.42) * ySpread;
      const scale = 0.58 + depth * 0.44;
      const opacity = 0.3 + depth * 0.7;
      const brightness = 0.55 + depth * 0.5;
      const blur = (1 - depth) * 1.25;
      const isActive = index === activeIndex;

      card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
      card.style.zIndex = String(Math.round(10 + depth * 30));
      card.classList.toggle("is-active", isActive);

      if (isActive) {
        card.setAttribute("aria-current", "true");
      } else {
        card.removeAttribute("aria-current");
      }
    });

    if (pillarModel) {
      pillarModel.setAttribute(
        "camera-orbit",
        `${normalizeAngle(-rotation).toFixed(1)}deg 76deg 108%`,
      );
    }
  };

  const rotateBy = (direction) => {
    rotation -= direction * step;
    renderOrbit();
  };

  const centerCard = (index) => {
    const currentAngle = index * step + rotation;
    rotation -= normalizeAngle(currentAngle);
    renderOrbit();
  };

  const showToast = (message) => {
    if (!toast || !toastMessage) return;

    window.clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.setAttribute("aria-hidden", "true");
    }, 2600);
  };

  const openModal = (trigger) => {
    if (!modal) return;

    lastModalTrigger = trigger;
    modal.removeAttribute("inert");
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".addon-modal__close");
    window.setTimeout(
      () => closeButton?.focus(),
      reducedMotion.matches ? 0 : 180,
    );
  };

  const closeModal = () => {
    if (!modal || !modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    window.setTimeout(
      () => {
        modal.setAttribute("inert", "");
        lastModalTrigger?.focus();
      },
      reducedMotion.matches ? 0 : 220,
    );
  };

  previousButton?.addEventListener("click", () => rotateBy(-1));
  nextButton?.addEventListener("click", () => rotateBy(1));

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (suppressCardClick) return;

      centerCard(index);

      if (card.dataset.addon === "aether") {
        openModal(card);
        return;
      }

      showToast(card.dataset.placeholder || "Novo conteúdo em breve.");
    });
  });

  stage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      wheelTotal += event.deltaY || event.deltaX;

      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        if (Math.abs(wheelTotal) >= 12) rotateBy(Math.sign(wheelTotal));
        wheelTotal = 0;
      }, 54);
    },
    { passive: false },
  );

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      rotateBy(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      rotateBy(1);
    }

    if ((event.key === "Enter" || event.key === " ") && cards[activeIndex]) {
      event.preventDefault();
      cards[activeIndex].click();
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || modal?.classList.contains("is-open")) return;

    pointerId = event.pointerId;
    pointerStartX = event.clientX;
    rotationAtPointerStart = rotation;
    suppressCardClick = false;
    stage.classList.add("is-dragging");
  });

  stage.addEventListener("pointermove", (event) => {
    if (pointerId !== event.pointerId) return;

    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) > 5) {
      suppressCardClick = true;
      if (!stage.hasPointerCapture(pointerId))
        stage.setPointerCapture(pointerId);
    }
    rotation = rotationAtPointerStart + distance * 0.42;
    renderOrbit();
  });

  const endPointer = (event) => {
    if (pointerId !== event.pointerId) return;

    if (stage.hasPointerCapture(pointerId))
      stage.releasePointerCapture(pointerId);
    pointerId = null;
    stage.classList.remove("is-dragging");
    rotation = Math.round(rotation / step) * step;
    renderOrbit();

    window.setTimeout(() => {
      suppressCardClick = false;
    }, 80);
  };

  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", endPointer);

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  if (pillarModel && pillar) {
    const markModelReady = () => pillar.classList.add("has-model");
    pillarModel.addEventListener("load", markModelReady, { once: true });

    if (pillarModel.loaded) markModelReady();
  }

  document.querySelectorAll("a[data-navigate]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
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
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 180);
    });
  });

  window.addEventListener("resize", renderOrbit, { passive: true });
  renderOrbit();
})();
