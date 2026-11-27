(function () {
  "use strict";

  const drawer = document.getElementById("moreDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  const toggle = document.getElementById("moreToggle");
  if (!drawer || !backdrop || !toggle) return;

  function setOpen(open) {
    if (!open) toggle.focus();
    drawer.classList.toggle("open", open);
    toggle.classList.toggle("active", open);
    backdrop.hidden = !open;
    drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    if (open) drawer.querySelector("a")?.focus();
  }

  toggle.addEventListener("click", () => setOpen(!drawer.classList.contains("open")));
  backdrop.addEventListener("click", () => setOpen(false));
  drawer.addEventListener("click", event => {
    if (event.target.closest("a[href]")) setOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && drawer.classList.contains("open")) setOpen(false);
  });
})();
