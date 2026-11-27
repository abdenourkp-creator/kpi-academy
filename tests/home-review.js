"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async function captureHome(browser, origin, output) {
  fs.mkdirSync(output, { recursive: true });
  const measurements = [];
  for (const language of ["ar", "en"]) {
    for (const width of [320, 360, 390, 430, 768, 1024, 1365]) {
      const height = width === 320 ? 568 : width <= 430 ? 844 : 900;
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
      try {
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
        page.on("requestfailed", request => errors.push(request.url()));
        page.on("response", response => { if (response.status() >= 400) errors.push(response.url()); });
        await page.goto(origin + "/#dashboard", { waitUntil: "networkidle" });
        if (language === "en") await page.locator("#homeLanguage").click();
        await page.locator(".sprint-resume .sprint-primary").waitFor();
        const bounds = await page.evaluate(() => {
          const nav = document.querySelector(".mobile-bottom-nav").getBoundingClientRect();
          return {
            pageHeight: document.documentElement.scrollHeight,
            resumeBottom: Math.ceil(document.querySelector(".sprint-resume .sprint-primary").getBoundingClientRect().bottom),
            visibleBottom: Math.floor(nav.height ? nav.top : innerHeight),
            language: document.documentElement.lang,
            direction: document.documentElement.dir
          };
        });
        assert.equal(bounds.language, language);
        assert.equal(bounds.direction, language === "ar" ? "rtl" : "ltr");
        assert.ok(bounds.resumeBottom <= bounds.visibleBottom, "resume action outside initial viewport at " + language + "/" + width);
        const shot = "home-" + language + "-" + width + ".png";
        await page.screenshot({ path: path.join(output, shot), animations: "disabled" });
        await page.locator(".ka-dashboard-details > summary").click();
        const layout = await page.evaluate(() => {
          const controls = document.querySelectorAll(".ka-dashboard :is(a,button,summary), .mobile-bottom-link, #homeLanguage, #menuToggle, .mobile-brand, .main-nav a");
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            smallTargets: [...controls].filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.width && rect.height && getComputedStyle(el).visibility === "visible" && (rect.width < 44 || rect.height < 44);
            }).map(el => el.textContent.trim())
          };
        });
        assert.equal(layout.overflow, false);
        assert.deepEqual(layout.smallTargets, []);
        assert.deepEqual(errors, []);
        measurements.push({ screenshot: shot, width, height, ...bounds, ...layout, errors });
      } finally {
        await page.close();
      }
    }
  }
  fs.writeFileSync(path.join(output, "measurements.json"), JSON.stringify(measurements, null, 2) + "\n");
};
