(() => {
  const commercialPhotos = [
    "blackford-pavilion-pergola.jpg",
    "st-roque.jpg",
    "blackford.jpg",
    "bdance-5.jpg",
    "dance.jpg",
    "fire-hydrant-three.jpg",
    "wedding.jpg",
  ];

  const artisticPhotos = [
    "flowers-1.jpg",
    "flowers-2.jpg",
    "modern-1.jpg",
    "modern-2.jpg",
    "water-1.jpg",
    "water-2.jpg",
    "water-3.jpg",
    "water-4.jpg",
    "water-5.jpg",
  ];

  const expandIcon = `
    <span class="expand-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
        <path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6"/>
      </svg>
    </span>`;

  function labelFromFilename(filename) {
    return filename
      .replace(/\.[^.]+$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function buildGallery(containerId, photos, folder) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    container.innerHTML = "";
    const entries = photos.map((filename) => ({
      thumb: `images/${folder}/thumb/${filename}`,
      full: `images/${folder}/full/${filename}`,
      alt: `${labelFromFilename(filename)} — ${folder} photography by Taken as Read`,
    }));

    entries.forEach((entry, index) => {
      const figure = document.createElement("figure");
      figure.className = "masonry-item gallery-frame";
      figure.setAttribute("role", "button");
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("aria-label", `Open full size image: ${entry.alt}`);

      const img = document.createElement("img");
      img.src = entry.thumb;
      img.alt = entry.alt;
      img.loading = "lazy";
      img.decoding = "async";

      figure.appendChild(img);
      figure.insertAdjacentHTML("beforeend", expandIcon);

      const open = () => openLightbox(entries, index);
      figure.addEventListener("click", open);
      figure.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });

      container.appendChild(figure);
    });

    return entries;
  }

  // Mobile nav
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  function closeMenu() {
    menuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", () => {
    const isActive = menuBtn.classList.toggle("active");
    mobileMenu.classList.toggle("active", isActive);
    menuBtn.setAttribute("aria-expanded", String(isActive));
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  // Sticky nav background on scroll
  const nav = document.getElementById("site-nav");
  const onScrollNav = () => {
    nav.classList.toggle("bg-ink/95", window.scrollY > 24);
    nav.classList.toggle("shadow-lg", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  // Back to top
  const backToTop = document.getElementById("back-to-top");
  const onScrollTop = () => {
    const show = window.scrollY > window.innerHeight;
    backToTop.style.opacity = show ? "1" : "0";
    backToTop.style.transform = show ? "translateY(0)" : "translateY(12px)";
    backToTop.style.pointerEvents = show ? "auto" : "none";
  };
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealTargets.forEach((el) => observer.observe(el));

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCounter = document.getElementById("lightbox-counter");
  let activeSet = [];
  let activeIndex = 0;
  let isZoomed = false;

  function renderLightbox() {
    const entry = activeSet[activeIndex];
    lightboxImage.style.opacity = "0";
    const img = new Image();
    img.onload = () => {
      lightboxImage.src = entry.full;
      lightboxImage.alt = entry.alt;
      requestAnimationFrame(() => (lightboxImage.style.opacity = "1"));
    };
    img.src = entry.full;
    lightboxCounter.textContent = `${activeIndex + 1} / ${activeSet.length}`;
  }

  function openLightbox(entries, index) {
    activeSet = entries;
    activeIndex = index;
    isZoomed = false;
    lightboxImage.classList.remove("zoomed");
    renderLightbox();
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => lightbox.classList.add("active"));
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    setTimeout(() => {
      lightbox.style.display = "none";
    }, 350);
  }

  function step(delta) {
    if (!activeSet.length) return;
    activeIndex = (activeIndex + delta + activeSet.length) % activeSet.length;
    isZoomed = false;
    lightboxImage.classList.remove("zoomed");
    renderLightbox();
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => step(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => step(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxImage.addEventListener("click", () => {
    isZoomed = !isZoomed;
    lightboxImage.classList.toggle("zoomed", isZoomed);
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display !== "flex") return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  buildGallery("commercial-grid", commercialPhotos, "commercial");
  buildGallery("artistic-grid", artisticPhotos, "artistic");
})();
