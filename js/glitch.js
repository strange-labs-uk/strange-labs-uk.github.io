/**
 * Glitch Text Effect
 * Scrambles .home-about text with random characters.
 * On hover, letters unscramble to reveal the real text.
 * Desktop only — no effect on mobile/touch devices.
 * Preserves <br> elements within the content.
 */

(function () {
  if (window.matchMedia("(max-width: 768px)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var glyphChars =
    "abcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>{}[]アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンΔΘΛΞΠΣΦΨΩαβγδεζηθλμξπσφψωЖДЦШЩЮЯБГЗЛПФЧЫ가나다라마바사아자차카타파하ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛈᛉᛊᛏᛒᛖᛗᛚᛝᛟ";
  var elements = document.querySelectorAll(".home-about");

  elements.forEach(function (el) {
    // Collect text nodes and their original content, skipping <br> elements
    var textNodes = [];
    var allLetters = [];

    (function walk(node) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        if (child.nodeType === 3) {
          // Text node
          var original = child.textContent;
          var nodeLetters = [];
          for (var j = 0; j < original.length; j++) {
            var c = original[j];
            var letter = {
              char: c,
              resolved: c === " " || c === "\n" || c === "\t",
            };
            nodeLetters.push(letter);
            allLetters.push(letter);
          }
          textNodes.push({
            node: child,
            original: original,
            letters: nodeLetters,
          });
        } else if (child.nodeType === 1) {
          // Element node — recurse but preserve <br> etc.
          walk(child);
        }
      }
    })(el);

    var isHovered = false;
    var rafId = null;

    function render() {
      for (var t = 0; t < textNodes.length; t++) {
        var entry = textNodes[t];
        var result = "";
        for (var i = 0; i < entry.letters.length; i++) {
          if (entry.letters[i].resolved) {
            result += entry.letters[i].char;
          } else {
            result += glyphChars[Math.floor(Math.random() * glyphChars.length)];
          }
        }
        entry.node.textContent = result;
      }
    }

    var lastFrame = 0;
    var frameInterval = 80; // ms between scramble updates

    function animateScramble(time) {
      if (time - lastFrame > frameInterval) {
        render();
        lastFrame = time;
      }
      if (!isHovered) {
        rafId = requestAnimationFrame(animateScramble);
      }
    }

    function resolve() {
      var unresolved = [];
      for (var i = 0; i < allLetters.length; i++) {
        if (!allLetters[i].resolved) {
          unresolved.push(i);
        }
      }

      // Shuffle resolve order
      for (var i = unresolved.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = unresolved[i];
        unresolved[i] = unresolved[j];
        unresolved[j] = temp;
      }

      var totalDuration = 800;
      var step = totalDuration / unresolved.length;

      unresolved.forEach(function (idx, order) {
        setTimeout(function () {
          allLetters[idx].resolved = true;
        }, order * step);
      });

      // Final render after all letters have resolved
      setTimeout(function () {
        render();
      }, totalDuration + 50);

      // Keep rendering during resolve at same throttled speed
      (function tick(time) {
        if (time - lastFrame > frameInterval) {
          render();
          lastFrame = time;
        }
        var done = true;
        for (var i = 0; i < allLetters.length; i++) {
          if (!allLetters[i].resolved) {
            done = false;
            break;
          }
        }
        if (!done && isHovered) {
          requestAnimationFrame(tick);
        }
      })(performance.now());
    }

    function unresolve() {
      for (var i = 0; i < allLetters.length; i++) {
        var c = allLetters[i].char;
        if (c !== " " && c !== "\n" && c !== "\t") {
          allLetters[i].resolved = false;
        }
      }
      animateScramble();
    }

    el.addEventListener("mouseenter", function () {
      isHovered = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      resolve();
    });

    el.addEventListener("mouseleave", function () {
      isHovered = false;
      unresolve();
    });

    // Start scrambled
    unresolve();
  });
})();
