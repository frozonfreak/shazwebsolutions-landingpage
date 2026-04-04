/* ============================================================
   SHAZWEBSOLUTIONS — SCRIPTS.JS
   Minimal vanilla JS — fast, no dependencies
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    var body      = document.body;
    var brandName = body ? body.getAttribute("data-brand-name") : "";

    /* ── Brand personalisation ────────────────────── */
    if (brandName) {
        document.querySelectorAll("[data-brand-text]").forEach(function (el) {
            el.textContent = brandName;
        });

        var title = document.querySelector("title");
        if (title) title.textContent = brandName + " | Tech Services Company";

        var desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute("content",
            brandName + " builds business websites, ecommerce platforms, " +
            "cloud-backed applications, and modern digital systems for growing companies.");

        /* Initials badge */
        document.querySelectorAll("[data-brand-badge]").forEach(function (el) {
            el.textContent = brandName
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .split(/[\s_-]+/).filter(Boolean)
                .slice(0, 3)
                .map(function (w) { return w.charAt(0).toUpperCase(); })
                .join("");
        });
    }

    /* ── Current year ─────────────────────────────── */
    var yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Mobile nav ───────────────────────────────── */
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu   = document.querySelector(".nav-links");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            var open = navMenu.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(open));
        });

        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navMenu.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ── Header scroll state ──────────────────────── */
    var header = document.querySelector(".site-header");
    if (header) {
        var updateHeader = function () {
            header.classList.toggle("scrolled", window.scrollY > 20);
        };
        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();
    }

    /* ── Scroll progress bar ──────────────────────── */
    var progressEl = document.getElementById("scroll-progress");
    if (progressEl) {
        var updateProgress = function () {
            var doc  = document.documentElement;
            var pct  = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
            progressEl.style.setProperty("--scroll-pct", Math.min(pct, 100).toFixed(1) + "%");
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
    }

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── Scroll reveal ────────────────────────────── */
    if ("IntersectionObserver" in window) {
        var revealObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
            el.style.setProperty("--reveal-delay", (i % 5) * 0.07 + "s");
            revealObs.observe(el);
        });
    } else {
        document.querySelectorAll("[data-reveal]").forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    /* ── Stats count-up ───────────────────────────── */
    if (!prefersReduced && "IntersectionObserver" in window) {
        var countEls = document.querySelectorAll(".stat-number[data-count]");

        if (countEls.length) {
            var countObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    countObs.unobserve(entry.target);

                    var el     = entry.target;
                    var target = parseInt(el.getAttribute("data-count"), 10);
                    var suffix = el.getAttribute("data-suffix") || "";
                    var start  = 0;
                    var dur    = 1000; /* ms */
                    var t0     = null;

                    function step(ts) {
                        if (!t0) t0 = ts;
                        var progress = Math.min((ts - t0) / dur, 1);
                        /* Ease-out quart */
                        var eased = 1 - Math.pow(1 - progress, 4);
                        el.textContent = Math.round(eased * target) + suffix;
                        if (progress < 1) requestAnimationFrame(step);
                    }

                    requestAnimationFrame(step);
                });
            }, { threshold: 0.5 });

            countEls.forEach(function (el) { countObs.observe(el); });
        }
    }

    /* ── Project details toggle ───────────────────── */
    document.querySelectorAll(".project-details-toggle").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var expanded = btn.getAttribute("aria-expanded") === "true";
            var panel    = btn.nextElementSibling;
            var label    = btn.querySelector(".toggle-label");

            btn.setAttribute("aria-expanded", String(!expanded));
            panel.setAttribute("aria-hidden",  String(expanded));
            label.textContent = expanded ? "View technical details" : "Hide technical details";
        });
    });

    /* ── Marquee pause on hover ───────────────────── */
    var marqueeInner = document.querySelector(".marquee-inner");
    var marqueeStrip = document.querySelector(".marquee-strip");

    if (marqueeInner && marqueeStrip) {
        marqueeStrip.addEventListener("mouseenter", function () {
            marqueeInner.style.animationPlayState = "paused";
        });
        marqueeStrip.addEventListener("mouseleave", function () {
            marqueeInner.style.animationPlayState = "running";
        });
    }

    /* ── Button active ripple (micro-interaction) ─── */
    document.querySelectorAll(".btn").forEach(function (btn) {
        btn.addEventListener("pointerdown", function () {
            btn.style.transform = "scale(0.97)";
        });
        btn.addEventListener("pointerup", function () {
            btn.style.transform = "";
        });
        btn.addEventListener("pointerleave", function () {
            btn.style.transform = "";
        });
    });
});
