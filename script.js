/**
 * Md Rijwan Ansari — Professional Portfolio Scripts
 * Progressive enhancements, mobile menu, scrollspy, interactive copy & form handling.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const header = document.getElementById("site-header");
  const menuButton = document.getElementById("menu-toggle");
  const navigation = document.getElementById("primary-navigation");
  const currentYearSpan = document.getElementById("current-year");
  const backToTopBtn = document.getElementById("back-to-top");
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailDisplay = document.getElementById("email-address-display");
  const copyBtnText = document.getElementById("copy-btn-text");
  const toastNotice = document.getElementById("toast-notice");
  const toastMessage = document.getElementById("toast-message");
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const navLinks = document.querySelectorAll(".nav-link");

  // 1. Dynamic Copyright Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Header Scroll Effect
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Menu
  if (menuButton && navigation) {
    const toggleMenu = () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      navigation.classList.toggle("is-open", !isExpanded);
    };

    menuButton.addEventListener("click", toggleMenu);

    // Close when clicking nav links
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navigation.classList.contains("is-open")) {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(e.target) &&
        !menuButton.contains(e.target)
      ) {
        navigation.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 4. Smooth Back to Top
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 5. Toast Notification System
  let toastTimer = null;
  const showToast = (message) => {
    if (!toastNotice) return;
    if (toastMessage) toastMessage.textContent = message;
    toastNotice.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove("show");
    }, 3200);
  };

  // 6. Copy Email to Clipboard
  if (copyEmailBtn && emailDisplay) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = emailDisplay.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        if (copyBtnText) copyBtnText.textContent = "Copied!";
        copyEmailBtn.style.background = "var(--accent-emerald)";
        copyEmailBtn.style.color = "#070a13";
        showToast("Email copied to clipboard: " + email);

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = "Copy";
          copyEmailBtn.style.background = "";
          copyEmailBtn.style.color = "";
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast("Email copied to clipboard!");
      }
    });
  }

  // 7. ScrollSpy Active Nav Link
  const sections = document.querySelectorAll("section[id]");
  if ("IntersectionObserver" in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // 8. Contact Form Handling
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("sender-name");
      const emailInput = document.getElementById("sender-email");
      const subjectInput = document.getElementById("sender-subject");
      const messageInput = document.getElementById("sender-message");

      const name = nameInput ? nameInput.value.trim() : "";
      const email = emailInput ? emailInput.value.trim() : "";
      const subject = subjectInput ? subjectInput.value.trim() : "";
      const message = messageInput ? messageInput.value.trim() : "";

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.textContent = "Please fill in all required fields.";
          formFeedback.className = "form-feedback is-visible";
          formFeedback.style.color = "#f87171";
          formFeedback.style.background = "rgba(239, 68, 68, 0.1)";
          formFeedback.style.border = "1px solid rgba(239, 68, 68, 0.3)";
        }
        return;
      }

      // Generate mailto draft link
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject || 'New Message from ' + name}`);
      const mailtoBody = encodeURIComponent(`Hello Md Rijwan,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);
      const targetEmail = "mdrijwanansari.work@gmail.com";
      const mailtoUrl = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

      if (formFeedback) {
        formFeedback.innerHTML = `<strong>Thank you, ${escapeHTML(name)}!</strong> Preparing your message. If your mail client does not open automatically, <a href="${mailtoUrl}" style="text-decoration: underline; color: inherit; font-weight: bold;">click here to send</a>.`;
        formFeedback.className = "form-feedback is-visible is-success";
      }

      showToast("Opening email client draft...");

      // Trigger mailto client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      contactForm.reset();
    });
  }

  // Helper function to prevent XSS in feedback
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
