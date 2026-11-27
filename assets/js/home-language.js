(function (root) {
  "use strict";
  const key = "kpi-academy.home-language.v1";
  let preferred = "ar";
  try { if (root.localStorage.getItem(key) === "en") preferred = "en"; } catch {}

  const shellLabels = Array.from(document.querySelectorAll("[data-shell-label]"), node => ({
    node, key: node.dataset.shellLabel, arabic: node.textContent
  }));
  const shellAria = Array.from(document.querySelectorAll("[data-shell-aria]"), node => ({
    node, key: node.dataset.shellAria, arabic: node.getAttribute("aria-label")
  }));

  function isHome() {
    return ["", "#", "#dashboard"].includes(location.hash);
  }

  function apply() {
    const language = isHome() ? preferred : "ar";
    root.KPI.bidi.setLanguage(language);
    const labels = root.KPI.i18n[language].strings;
    for (const { node, key, arabic } of shellLabels) {
      node.textContent = language === "ar" ? arabic : labels[key];
    }
    for (const { node, key, arabic } of shellAria) {
      node.setAttribute("aria-label", language === "ar" ? arabic : labels[key]);
    }
    const button = document.getElementById("homeLanguage");
    button.hidden = !isHome();
    button.lang = language === "ar" ? "en" : "ar";
    button.textContent = language === "ar" ? "English" : "العربية";
    button.setAttribute("aria-label", language === "ar" ? "Show Home in English" : "عرض الرئيسية بالعربية");
    return root.KPI.i18n[language].home;
  }

  function toggle() {
    preferred = preferred === "ar" ? "en" : "ar";
    try { root.localStorage.setItem(key, preferred); } catch {}
    root.dispatchEvent(new Event("hashchange"));
  }
  document.getElementById("homeLanguage").addEventListener("click", toggle);
  root.KPI.homeLanguage = { apply, get language() { return document.documentElement.lang; } };
})(window);
