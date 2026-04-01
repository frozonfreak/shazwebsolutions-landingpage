document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var brandName = body ? body.getAttribute("data-brand-name") : "";
    var brandTargets = document.querySelectorAll("[data-brand-text]");
    var brandBadge = document.querySelector("[data-brand-badge]");
    var pageTitle = document.querySelector("title");
    var metaDescription = document.querySelector('meta[name="description"]');
    var currentYear = document.getElementById("current-year");
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu = document.querySelector(".nav-links");
    var menuLinks = document.querySelectorAll(".nav-links a");
    var revealTargets = document.querySelectorAll("[data-reveal]");
    var parallaxTargets = document.querySelectorAll("[data-parallax]");
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var parallaxState = {
        pointerX: 0,
        pointerY: 0,
        scrollY: window.scrollY || window.pageYOffset || 0
    };
    var parallaxFrame = null;

    if (brandName) {
        brandTargets.forEach(function (target) {
            target.textContent = brandName;
        });

        if (pageTitle) {
            pageTitle.textContent = brandName + " | Tech Services Company";
        }

        if (metaDescription) {
            metaDescription.setAttribute(
                "content",
                brandName + " builds business websites, ecommerce platforms, cloud-backed applications, and modern digital systems for growing companies."
            );
        }

        if (brandBadge) {
            brandBadge.textContent = brandName
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .split(/[\s_-]+/)
                .filter(Boolean)
                .slice(0, 3)
                .map(function (part) {
                    return part.charAt(0).toUpperCase();
                })
                .join("");
        }
    }

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            var isOpen = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        menuLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function renderParallax() {
        parallaxTargets.forEach(function (target) {
            var rect = target.getBoundingClientRect();
            var speed = parseFloat(target.getAttribute("data-parallax-speed")) || 0.05;
            var axis = target.getAttribute("data-parallax-axis") || "y";
            var viewportOffset = (rect.top + rect.height * 0.5) - window.innerHeight * 0.5;
            var scrollShift = viewportOffset * speed * -0.2;
            var pointerShiftX = parallaxState.pointerX * speed * 18;
            var pointerShiftY = parallaxState.pointerY * speed * 18;
            var nextX = axis === "x" || axis === "both" ? pointerShiftX : 0;
            var nextY = axis === "y" || axis === "both" ? scrollShift + pointerShiftY : 0;

            target.style.setProperty("--parallax-x", nextX.toFixed(2) + "px");
            target.style.setProperty("--parallax-y", nextY.toFixed(2) + "px");
        });

        parallaxFrame = null;
    }

    function queueParallax() {
        if (!parallaxFrame) {
            parallaxFrame = window.requestAnimationFrame(renderParallax);
        }
    }

    if (!prefersReducedMotion && parallaxTargets.length) {
        window.addEventListener("scroll", function () {
            parallaxState.scrollY = window.scrollY || window.pageYOffset || 0;
            queueParallax();
        }, {
            passive: true
        });

        window.addEventListener("mousemove", function (event) {
            parallaxState.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
            parallaxState.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
            queueParallax();
        });

        window.addEventListener("resize", queueParallax);
        queueParallax();
    }

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.14
        });

        revealTargets.forEach(function (target, index) {
            target.style.setProperty("--reveal-delay", (index % 6) * 0.06 + "s");
            revealObserver.observe(target);
        });
    } else {
        revealTargets.forEach(function (target) {
            target.classList.add("is-visible");
        });
    }
});
