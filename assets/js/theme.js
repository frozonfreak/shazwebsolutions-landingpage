/* ============================================================
   ARUVIFLOW — THEME.JS
   Runs in <head> before CSS paints — sets the colour theme with
   no flash. Toggle wiring lives in scripts.js.
   ============================================================ */
(function () {
    try {
        var stored = localStorage.getItem("af-theme");
        if (stored === "light" || stored === "dark") {
            document.documentElement.setAttribute("data-theme", stored);
        }
        /* no stored choice → CSS handles it via prefers-color-scheme */
    } catch (e) {}
})();
