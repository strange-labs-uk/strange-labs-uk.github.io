/**
 * Spacetime Grid - Gravity Well Effect
 * A grid that warps like spacetime bending around a mass,
 * with a slow swirling rotation and breathing pulse.
 */

(function () {
  // Grid colours (rgba)
  var WHITE_GRID = "rgba(255, 255, 255, 0.0001)";
  var RED_GRID = "rgba(76, 0, 144, 0.1)";
  var BLUE_GRID = "rgba(0, 144, 67, 0.2)";

  // Warp offsets for colour grids (multipliers relative to the base warp)
  var RED_STRENGTH = 1;
  var RED_DEPTH = 1;
  var RED_TWIST = 1;

  var BLUE_STRENGTH = 1;
  var BLUE_DEPTH = 1;
  var BLUE_TWIST = 1;

  const canvas = document.createElement("canvas");
  canvas.id = "grid-art";
  canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width, height;
  let animId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  // Calculate the warped position of a point being pulled toward the gravity well
  // with an added rotational twist that falls off with distance
  function warpPoint(x, y, wellX, wellY, strength, depth, twist) {
    const dx = x - wellX;
    const dy = y - wellY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) return { x, y, z: -depth };

    // Rotational swirl — strongest near the well, fades with distance
    const swirlFalloff = Math.exp(-distance / (strength * 1.8));
    const angle = twist * swirlFalloff;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const rdx = dx * cosA - dy * sinA;
    const rdy = dx * sinA + dy * cosA;

    // Gravitational pull — applied after rotation
    const pull = strength / (distance * 0.8);
    const cappedPull = Math.min(pull, 0.95);

    const newX = wellX + rdx * (1 - cappedPull);
    const newY = wellY + rdy * (1 - cappedPull);

    // Z depth (for visual effect - how far "down" into the well)
    const z = -depth * Math.pow(Math.max(0, 1 - distance / (strength * 2)), 2);

    return { x: newX, y: newY, z };
  }

  // Draw a grid with fixed colour and opacity
  function drawGrid(wellX, wellY, strength, depth, twist, color) {
    const gridSize = 60;
    const gridExtent = Math.max(width, height) * 1.5;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Draw horizontal lines
    for (let y = -gridExtent; y < gridExtent; y += gridSize) {
      ctx.beginPath();
      let started = false;

      for (let x = -gridExtent; x < gridExtent; x += 10) {
        const warped = warpPoint(x, y, wellX, wellY, strength, depth, twist);

        const scale = 1 + warped.z * 0.002;
        const screenX = wellX + (warped.x - wellX) * scale;
        const screenY = wellY + (warped.y - wellY) * scale;

        if (
          screenX > -100 &&
          screenX < width + 100 &&
          screenY > -100 &&
          screenY < height + 100
        ) {
          if (!started) {
            ctx.moveTo(screenX, screenY);
            started = true;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
      }
      ctx.stroke();
    }

    // Draw vertical lines
    for (let x = -gridExtent; x < gridExtent; x += gridSize) {
      ctx.beginPath();
      let started = false;

      for (let y = -gridExtent; y < gridExtent; y += 10) {
        const warped = warpPoint(x, y, wellX, wellY, strength, depth, twist);

        const scale = 1 + warped.z * 0.002;
        const screenX = wellX + (warped.x - wellX) * scale;
        const screenY = wellY + (warped.y - wellY) * scale;

        if (
          screenX > -100 &&
          screenX < width + 100 &&
          screenY > -100 &&
          screenY < height + 100
        ) {
          if (!started) {
            ctx.moveTo(screenX, screenY);
            started = true;
          } else {
            ctx.lineTo(screenX, screenY);
          }
        }
      }
      ctx.stroke();
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // Gravity well position (bottom right area)
    const wellX = width * 0.85;
    const wellY = height * 0.85;

    // Breathing pulse — strength oscillates gently
    const breathCycle = time * 0.0003;
    const strength = 300 + Math.sin(breathCycle) * 30;
    const depth = 150 + Math.sin(breathCycle * 0.7) * 15;

    // Swirl — slow back-and-forth rotation
    const swirlCycle = time * 0.00015;
    const twist = Math.sin(swirlCycle) * 0.35;

    // Red-shift grid (behind)
    drawGrid(
      wellX,
      wellY,
      strength * RED_STRENGTH,
      depth * RED_DEPTH,
      twist * RED_TWIST,
      RED_GRID,
    );

    // Blue-shift grid (behind)
    drawGrid(
      wellX,
      wellY,
      strength * BLUE_STRENGTH,
      depth * BLUE_DEPTH,
      twist * BLUE_TWIST,
      BLUE_GRID,
    );

    // White grid (front)
    drawGrid(wellX, wellY, strength, depth, twist, WHITE_GRID);

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);

  // Pause animation when tab is hidden to save resources
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(draw);
    }
  });

  // Skip animation entirely if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  setTimeout(function () {
    resize();
    animId = requestAnimationFrame(draw);
  }, 100);
})();
