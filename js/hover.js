/**
 * Progressive Hover Effects
 * The longer you hover, the more the card transforms
 */

(function () {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    let hoverStart = null;
    let animationFrame = null;

    const updateProgress = () => {
      if (!hoverStart) return;

      const elapsed = Date.now() - hoverStart;
      const progress = Math.min(elapsed / 3000, 1); // 3 seconds to full effect

      // Eased progress for smoother feel
      const eased = 1 - Math.pow(1 - progress, 3);

      // Stage 1 (0-0.3): Subtle glow begins
      // Stage 2 (0.3-0.7): Title shifts, glow intensifies
      // Stage 3 (0.7-1): Full effect

      const glowOpacity = eased * 0.15;
      const titleOffset = eased * 8;

      card.style.setProperty("--hover-progress", eased);
      card.style.setProperty("--glow-opacity", glowOpacity);
      card.style.setProperty("--title-offset", `${titleOffset}px`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    card.addEventListener("mouseenter", () => {
      hoverStart = Date.now();
      animationFrame = requestAnimationFrame(updateProgress);
    });

    card.addEventListener("mouseleave", () => {
      hoverStart = null;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      // Animate back to initial state
      card.style.setProperty("--hover-progress", 0);
      card.style.setProperty("--glow-opacity", 0);
      card.style.setProperty("--title-offset", "0px");
    });
  });
})();
