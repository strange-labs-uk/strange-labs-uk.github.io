/**
 * Contact Form - Gravity Well Button
 * Opens a contact form modal from the button at the grid's focal point
 */

(function () {
  const btn = document.getElementById("well-btn");
  const overlay = document.getElementById("contact-overlay");
  const closeBtn = document.getElementById("contact-close");
  const form = document.getElementById("contact-form");

  if (!btn || !overlay) return;

  function open() {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  // Close on overlay background click
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      close();
    }
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = form.querySelector(".contact-submit");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Collect form data
    const data = {
      name: form.querySelector("#contact-name").value,
      email: form.querySelector("#contact-email").value,
      message: form.querySelector("#contact-message").value,
    };

    // TODO: Replace with your actual form endpoint (e.g. Formspree, Netlify Forms, or custom API)
    // For now, log the data and show a success state
    console.log("Contact form submission:", data);

    setTimeout(function () {
      submitBtn.textContent = "Sent!";
      setTimeout(function () {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        close();
      }, 1200);
    }, 600);
  });
})();
