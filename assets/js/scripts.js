/* ============================================================
   ARUVIFLOW — SCRIPTS.JS
   Minimal vanilla JS — fast, no dependencies
   ============================================================ */

/* ── Google Analytics ─────────────────────────────────────── */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "G-XS0SCLLDST", { anonymize_ip: true });

document.addEventListener("DOMContentLoaded", function () {
    var body      = document.body;
    var brandName = body ? body.getAttribute("data-brand-name") : "";

    /* ── Brand personalisation ────────────────────── */
    if (brandName) {
        document.querySelectorAll("[data-brand-text]").forEach(function (el) {
            el.textContent = brandName;
        });
    }

    /* ── Current year ─────────────────────────────── */
    var yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Colour theme toggle ──────────────────────── */
    var themeBtn = document.querySelector(".theme-toggle");
    if (themeBtn) {
        var root = document.documentElement;
        var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

        var currentTheme = function () {
            return root.getAttribute("data-theme") ||
                   (systemDark.matches ? "dark" : "light");
        };
        var syncLabel = function () {
            var t = currentTheme();
            themeBtn.textContent = t === "dark" ? "Light" : "Dark";
            themeBtn.setAttribute("aria-label", "Switch to " + (t === "dark" ? "light" : "dark") + " theme");
            themeBtn.setAttribute("aria-pressed", String(t === "dark"));
        };
        var applyTheme = function (t) {
            root.setAttribute("data-theme", t);
            try { localStorage.setItem("af-theme", t); } catch (e) {}
            syncLabel();
        };

        syncLabel();
        themeBtn.addEventListener("click", function () {
            applyTheme(currentTheme() === "dark" ? "light" : "dark");
        });
        systemDark.addEventListener("change", function () {
            if (!root.getAttribute("data-theme")) syncLabel();
        });
    }

    /* ── Mobile nav ───────────────────────────────── */
    var navToggle = document.querySelector(".nav-toggle");
    var navMenu   = document.querySelector(".nav-links");

    if (navToggle && navMenu) {
        var closeMenu = function (restoreFocus) {
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Open navigation");
            if (restoreFocus) navToggle.focus();
        };

        var openMenu = function () {
            navMenu.classList.add("is-open");
            navToggle.setAttribute("aria-expanded", "true");
            navToggle.setAttribute("aria-label", "Close navigation");
            var firstLink = navMenu.querySelector("a");
            if (firstLink) firstLink.focus();
        };

        navToggle.addEventListener("click", function () {
            if (navMenu.classList.contains("is-open")) {
                closeMenu(false);
            } else {
                openMenu();
            }
        });

        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                closeMenu(false);
            });
        });

        document.addEventListener("click", function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu(false);
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
                closeMenu(true);
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 820) closeMenu(false);
        }, { passive: true });
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
            var max  = doc.scrollHeight - doc.clientHeight;
            var pct  = max > 0 ? (window.scrollY / max) * 100 : 0;
            progressEl.style.setProperty("--scroll-pct", Math.min(pct, 100).toFixed(1) + "%");
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
        updateProgress();
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

    /* ── Live IST clock (hero) ────────────────────── */
    var clockTimeEl = document.getElementById("hero-clock-time");
    if (clockTimeEl) {
        var updateClock = function () {
            try {
                clockTimeEl.textContent = new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit"
                }).format(new Date());
            } catch (e) {}
        };
        updateClock();
        setInterval(updateClock, 30000);
    }

    /* ── Scope estimator ──────────────────────────── */
    var estType       = document.getElementById("est-type");
    var estComplexity = document.getElementById("est-complexity");
    var estTimeline   = document.getElementById("est-timeline");
    var estWeeksEl    = document.getElementById("est-weeks");
    var estModelEl    = document.getElementById("est-model");
    var estNoteEl     = document.getElementById("est-note");
    var estCta        = document.getElementById("est-cta");

    if (estType && estComplexity && estTimeline && estWeeksEl) {
        var updateEstimate = function () {
            var typeOpt    = estType.options[estType.selectedIndex];
            var baseWeeks  = parseFloat(typeOpt.getAttribute("data-weeks"));
            var model      = typeOpt.getAttribute("data-model");
            var multOpt    = estComplexity.options[estComplexity.selectedIndex];
            var mult       = parseFloat(multOpt.getAttribute("data-mult"));
            var timeline   = estTimeline.value;

            estModelEl.textContent = model;

            if (baseWeeks === 0) {
                estWeeksEl.textContent = "Rolling engagement";
                estNoteEl.textContent  = "Monthly capacity and scope are agreed up front, and adjusted as the work evolves.";
                return;
            }

            var low  = Math.max(1, Math.round(baseWeeks * mult));
            var high = Math.max(low + 1, Math.round(baseWeeks * mult * 1.3));
            var rangeText = low + "–" + high + " weeks";

            if (timeline === "tight") {
                estNoteEl.textContent = "Tight timelines are workable, but usually mean shipping a smaller first phase before the rest.";
            } else {
                estNoteEl.textContent = "A short scoping call confirms exact cost and timeline before anything is agreed.";
            }
            estWeeksEl.textContent = rangeText;
        };

        [estType, estComplexity, estTimeline].forEach(function (el) {
            el.addEventListener("change", updateEstimate);
        });
        updateEstimate();

        if (estCta) {
            estCta.addEventListener("click", function () {
                var projectField = document.querySelector('input[name="project"]');
                if (projectField && !projectField.value) {
                    var typeLabel = estType.options[estType.selectedIndex].textContent;
                    projectField.value = typeLabel + " — " + estWeeksEl.textContent;
                }
            });
        }
    }

    /* ── Contact form async state ─────────────────── */
    var contactForm   = document.querySelector(".contact-form");
    var contactStatus = document.getElementById("contact-status");
    var contactSubmit = document.getElementById("contact-submit");

    if (contactForm && contactStatus && contactSubmit) {
        var setFormStatus = function (type, message) {
            contactStatus.classList.remove("is-success", "is-error");
            if (type) contactStatus.classList.add("is-" + type);
            contactStatus.textContent = message || "";
        };

        contactForm.addEventListener("invalid", function () {
            setFormStatus("error", "Please fill in the required fields before sending.");
        }, true);

        contactForm.addEventListener("input", function () {
            if (contactStatus.classList.contains("is-error") && contactForm.checkValidity()) {
                setFormStatus("", "");
            }
        });

        contactForm.addEventListener("submit", function (e) {
            if (!window.fetch) return;

            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                setFormStatus("error", "Please fill in the required fields before sending.");
                return;
            }

            var originalLabel = contactSubmit.textContent;
            contactSubmit.disabled = true;
            contactSubmit.textContent = "Sending...";
            contactForm.setAttribute("aria-busy", "true");
            setFormStatus("", "Sending your message...");

            fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: { "Accept": "application/json" }
            }).then(function (response) {
                if (!response.ok) throw new Error("Form submission failed");
                contactForm.reset();
                setFormStatus("success", "Message sent. We will reply by email soon.");
            }).catch(function () {
                setFormStatus("error", "The message could not be sent. Please email hello@aruviflow.com or try again.");
            }).finally(function () {
                contactSubmit.disabled = false;
                contactSubmit.textContent = originalLabel;
                contactForm.removeAttribute("aria-busy");
            });
        });
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

    /* ── Button press feedback (micro-interaction) ── */
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
        btn.addEventListener("pointercancel", function () {
            btn.style.transform = "";
        });
        btn.addEventListener("blur", function () {
            btn.style.transform = "";
        });
    });
});
