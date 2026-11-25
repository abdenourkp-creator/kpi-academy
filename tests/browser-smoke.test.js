const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4"
};

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
      const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
      const target = path.resolve(root, relative);
      if (target !== root && !target.startsWith(root + path.sep)) {
        res.writeHead(403).end("Forbidden");
        return;
      }
      fs.readFile(target, (error, data) => {
        if (error) {
          res.writeHead(404).end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": mime[path.extname(target)] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

(async () => {
  const { server, port } = await startServer();
  let browser;
  const failures = [];
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, acceptDownloads: true });
    const page = await context.newPage();
    page.on("pageerror", error => failures.push(error.message));

    await page.goto("http://127.0.0.1:" + port + "/", { waitUntil: "networkidle" });
    await page.setViewportSize({ width: 390, height: 844 });
    const menuButton = page.locator("#menuToggle");
    await menuButton.click();
    assert.equal(await menuButton.getAttribute("aria-expanded"), "true", "mobile menu must expose its expanded state");
    await page.keyboard.press("Escape");
    assert.equal(await menuButton.getAttribute("aria-expanded"), "false", "Escape must close the mobile menu");
    await page.setViewportSize({ width: 1365, height: 900 });
    await page.getByRole("heading", { name: "أكاديمية ذكاء الأعمال لقطاع الضيافة" }).waitFor();
    assert.equal(await page.locator(".skip-link").getAttribute("href"), "#main-content", "keyboard users must have a skip link to the main landmark");
    assert.equal(await page.locator("#main-content").getAttribute("tabindex"), "-1", "the main landmark must be programmatically focusable");
    assert.equal(await page.locator(".ka-module-card").count(), 3, "dashboard must show exactly the three approved MVP modules");
    assert.equal(await page.locator(".ka-module-art img").count(), 3, "all modules must have visual illustrations");
    assert.equal(await page.locator(".ka-welcome-visual img").evaluate(img => img.complete && img.naturalWidth > 0), true, "dashboard hero illustration must load");
    assert.equal(await page.locator(".ka-module-art img").evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)), true, "module illustrations must load");
    await page.locator(".chapter-progress").waitFor();
    assert.equal(await page.locator(".chapter-progress-row").count(), 8, "dashboard must render one live progress row per curriculum chapter");
    assert.equal(await page.locator(".st-skill-node").count(), 8, "dashboard must render the eight-chapter skill tree");
    assert.equal(await page.locator(".st-badge").count(), 4, "dashboard must render four progress-derived achievement badges");
    assert.equal(await page.locator(".sprint-ring strong").textContent(), "0%");
    assert.equal(await page.locator(".sprint-resume").getByRole("link", { name: /متابعة الدرس/ }).getAttribute("href"), "#lesson-BM-001");
    await page.setViewportSize({ width: 390, height: 844 });
    const shortcutRoutes = ["modules", "calculator", "analytics", "lesson-BM-005?tab=lab", "simulator", "progress"];
    for (const route of shortcutRoutes) {
      const shortcut = page.locator('.sprint-shortcuts a[href="#' + route + '"]');
      assert.equal(await shortcut.count(), 1, "each live quick action must appear once");
      assert.ok((await shortcut.boundingBox()).height >= 44, "shortcut must meet minimum touch height");
      await shortcut.click();
      await page.waitForFunction(expected => location.hash === "#" + expected, route);
      await page.locator(".sprint-shortcuts").waitFor({ state: "detached" });
      await page.goto("http://127.0.0.1:" + port + "/#dashboard", { waitUntil: "networkidle" });
    }
    await page.setViewportSize({ width: 1365, height: 900 });
    await page.goto("http://127.0.0.1:" + port + "/#module-business-mathematics", { waitUntil: "networkidle" });
    assert.equal(await page.locator(".ka-chapter-visual").count(), 8, "all eight chapters must have visual learning maps");
    await page.goto("http://127.0.0.1:" + port + "/#module-restaurant-kpis", { waitUntil: "networkidle" });
    await page.locator(".ka-kpi-registry-list").waitFor();
    assert.equal(await page.locator(".ka-kpi-registry-item").count(), 15, "Restaurant KPIs module must render the exact approved registry, not invented curriculum");

    await page.waitForFunction(() => !!window.KPI_LEARNING_ENGINE && !!window.KPI_LEARNING_UI);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0);


    await page.goto("http://127.0.0.1:" + port + "/#analytics", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "مختبر التحليل" }).waitFor();
    await page.locator(".ka-sample-notice").waitFor();
    assert.equal(await page.locator(".ka-analytics-table tbody tr").count(), 3, "analytics must show three clearly labelled educational sample periods");
    await page.locator("#analyticsMetric").selectOption("laborCost");
    assert.match(await page.locator(".ka-analytics-explanation").textContent(), /Included Labor Cost/);
    assert.match(await page.locator(".ka-analytics-chart svg").getAttribute("aria-label"), /Labor Cost/);

    await page.goto("http://127.0.0.1:" + port + "/#simulator", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /THE LIVE VENUE/ }).waitFor();
    await page.locator(".lv-event").waitFor();
    assert.equal(await page.locator(".lv-choice").count(), 3, "Live Venue must present three trade-off decisions for the first shift event");
    assert.match(await page.locator(".lv-live").textContent(), /SIMULATION LIVE/);
    assert.equal(await page.evaluate(() => localStorage.getItem("kpiAcademy.liveVenue.shifts.v1")), null,
      "a newly started incomplete shift must not be persisted");
    for (let turn = 0; turn < 6; turn++) {
      assert.equal(await page.locator(".lv-choice").count(), 3, "each event must offer three operational trade-offs");
      await page.locator(".lv-choice").nth(turn === 0 ? 1 : 0).click();
      if (turn === 2) {
        assert.match(await page.locator("#lvConsequences").textContent(), /تراكم ضغط المطبخ/,
          "a delayed operating consequence must appear after the configured decision interval");
      }
    }
    await page.getByRole("heading", { name: "هذه هي بصمتك الإدارية." }).waitFor();
    assert.equal(await page.locator(".lv-history-row").count(), 6, "debrief must reconstruct all six decisions");
    assert.match(await page.locator(".lv-debrief").textContent(), /المحاكاة تعليمية افتراضية/);
    assert.equal(await page.locator(".lv-memory-list article").count(), 1, "completed shift must be archived once");
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("kpiAcademy.liveVenue.shifts.v1")).length), 1);
    await page.locator("[data-live-restart]").click();
    assert.equal(await page.locator(".lv-choice").count(), 3, "restart must begin a fresh shift");
    for (let turn = 0; turn < 6; turn++) await page.locator(".lv-choice").first().click();
    await page.getByRole("heading", { name: "هذه هي بصمتك الإدارية." }).waitFor();
    assert.equal(await page.locator(".lv-memory-list article").count(), 2, "second completed shift must be retained");
    assert.equal(await page.locator(".lv-delta-grid article").count(), 4, "shift comparison must report all four dimensions");
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("kpiAcademy.liveVenue.shifts.v1")).length), 2);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false,
      "Live Venue debrief and archive must fit a 390px mobile viewport");
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0,
      "Live Venue shifts must remain isolated from learning XP");
    await page.setViewportSize({ width: 1365, height: 900 });
    
    await page.locator('a[href="#progress"]').first().click();
    await page.getByRole("heading", { name: "مركز التقدم والتقييم" }).waitFor();
    assert.equal(await page.locator(".assessment-card").count(), 9);
    assert.equal(await page.locator(".learning-resume").count(), 1);
    await page.waitForFunction(() => document.querySelector(".learning-resume")?.textContent.includes("BM-005"));
    assert.match(await page.locator(".learning-resume").textContent(), /BM-005/, "opening the practical-case shortcut must resume the visited unfinished lesson");

    const failurePage = await context.newPage();
    const recoveryPageErrors = [];
    failurePage.on("pageerror", error => recoveryPageErrors.push(error.message));
    await failurePage.addInitScript(() => {
      const originalFetch = window.fetch.bind(window);
      window.__assessmentFetchTrace = { matching: 0, failed: 0, succeeded: 0, urls: [], hash: "" };
      let failOnce = true;
      window.fetch = (input, init) => {
        const url = new URL(typeof input === "string" ? input : input.url, window.location.href);
        if (url.pathname.endsWith("/data/assessments/business-mathematics.json")) {
          const trace = window.__assessmentFetchTrace;
          trace.matching += 1;
          trace.urls.push(url.href);
          trace.hash = window.location.hash;
          if (failOnce) {
            failOnce = false;
            trace.failed += 1;
            return Promise.reject(new TypeError("simulated assessment catalog network failure"));
          }
          return originalFetch(input, init).then(response => {
            trace.succeeded += response.ok ? 1 : 0;
            return response;
          });
        }
        return originalFetch(input, init);
      };
    });
    await failurePage.goto("http://127.0.0.1:" + port + "/#progress", { waitUntil: "networkidle" });
    await failurePage.getByRole("heading", { name: "تعذر تحميل بيانات التقييم" }).waitFor();
    const failedTrace = await failurePage.evaluate(() => window.__assessmentFetchTrace);
    assert.equal(failedTrace.failed, 1, "the first assessment catalog request must be rejected by the injected failure");
    assert.equal(failedTrace.matching, 1, "the UI must not silently auto-retry after entering its error state");
    assert.match(failedTrace.urls[0], /data\/assessments\/business-mathematics\.json$/);
    assert.equal(failedTrace.hash, "#progress");
    assert.equal(await failurePage.locator("#retryLearningCatalog").count(), 1);
    await failurePage.locator("#retryLearningCatalog").click();
    await failurePage.waitForFunction(() => document.querySelectorAll(".assessment-card").length === 9);
    const recoveredTrace = await failurePage.evaluate(() => window.__assessmentFetchTrace);
    assert.equal(recoveredTrace.matching, 2, "manual retry must issue exactly one subsequent catalog request");
    assert.equal(recoveredTrace.failed, 1);
    assert.equal(recoveredTrace.succeeded, 1, "the retry request must receive a successful HTTP response");
    assert.deepEqual(recoveryPageErrors, [], "catalog failure and recovery must not cause uncaught page errors");
    await failurePage.close();

    for (const code of ["BM-006","BM-007","BM-008","BM-009"]) {
      await page.goto("http://127.0.0.1:" + port + "/#lesson-" + code, { waitUntil: "networkidle" });
      await page.locator("#percentageLabMount .pl-lab").waitFor();
      assert.equal(await page.locator(".pl-task").count(), 5, code + " must render five source-aligned interactive tasks");
      const first = page.locator(".pl-task").first();
      await first.locator("[data-answer]").fill(code === "BM-006" ? "600" : code === "BM-007" ? "800" : code === "BM-008" ? "25" : "3");
      await first.locator("[data-check]").click();
      assert.match(await first.locator("[data-feedback]").textContent(), /إجابة صحيحة/);
      assert.equal(await page.locator(".pl-lab-disclaimer").count(), 1);
    }

    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-004", { waitUntil: "networkidle" });
    await page.locator("#bm004LabMount .bm004-lab").waitFor();
    assert.equal(await page.locator(".bm004-task").count(), 10, "BM-004 must render ten source-aligned interactive tasks");
    await page.locator('[data-task="round-half-up"] [data-answer]').fill("4.45");
    await page.locator('[data-check="round-half-up"]').click();
    assert.match(await page.locator('[data-task="round-half-up"] .bm004-feedback').textContent(), /صحيح/);
    await page.locator('[data-task="recipe-exact"] [data-answer]').fill("24.84");
    await page.locator('[data-check="recipe-exact"]').click();
    assert.match(await page.locator('[data-task="recipe-exact"] .bm004-feedback').textContent(), /صحيح/);
    await page.locator('[data-task="policy"] input[value="b"]').check();
    await page.locator('[data-check="policy"]').click();
    assert.match(await page.locator('[data-task="policy"] .bm004-feedback').textContent(), /صحيح/);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0,
      "BM-004 practice must not award XP or change learning completion rules");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false,
      "BM-004 interactive lab must fit a mobile viewport");

    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-005", { waitUntil: "networkidle" });
    await page.locator(".ka-chapter-visual.compact svg").waitFor();
    assert.equal(await page.locator(".ka-chapter-visual.compact svg").count(), 1, "lesson must include its chapter visual anchor");
    await page.locator(".lesson-visual-card").waitFor();
    await page.locator(".ka-lesson-toc").waitFor();
    await page.locator(".ka-lesson-toc-links a").first().click();
    await page.locator(".lesson-reader").waitFor();
    assert.equal(await page.locator(".lesson-reader").count(), 1, "section navigation must not route away from the active lesson");
    assert.ok(await page.locator(".ka-lesson-section").count() >= 8, "lesson sections must be grouped into semantic reading panels");
    for (const kind of ["worked", "lab", "mistakes", "challenge", "assessment", "checklist"]) assert.ok(await page.locator(".ka-lesson-section--" + kind).count() > 0, "lesson must style the " + kind + " section distinctly");
    assert.ok(await page.locator(".ka-lesson-navigation a").count() >= 1, "lesson navigation must expose a next or previous lesson link");
    assert.match(await page.locator(".lesson-visual-copy").textContent(), /9,000 MAD.*30,000 MAD.*30%/);
    assert.ok(await page.locator(".lesson-visual-card img").getAttribute("alt"));
    assert.equal((await page.request.get("http://127.0.0.1:" + port + "/assets/diagrams/restaurant-kpis/food-cost-calculation.svg")).status(), 200);
    await page.locator("#lessonExperienceMount .lesson-lab").waitFor();
    assert.equal(await page.locator(".le-task-card").count(), 5, "BM-005 must render five interactive learning tasks");

    await page.locator("#le-answer-food-cost").fill("30");
    await page.locator('[data-check="food-cost"]').click();
    assert.match(await page.locator('[data-task-id="food-cost"] .le-feedback').textContent(), /إجابة صحيحة/);

    await page.locator('input[name="le-beverage-cost"][value="b"]').check();
    await page.locator('[data-check="beverage-cost"]').click();
    await page.locator("#le-answer-combined-cogs").fill("28.33");
    await page.locator('[data-check="combined-cogs"]').click();
    await page.locator("#le-answer-labor-cost").fill("25");
    await page.locator('[data-check="labor-cost"]').click();
    await page.locator('input[name="le-interpretation"][value="b"]').check();
    await page.locator('[data-check="interpretation"]').click();

    assert.equal(await page.locator("[data-score]").textContent(), "5/5");
    assert.equal(await page.getByRole("progressbar", { name: "تقدم المختبر" }).getAttribute("aria-valuenow"), "5");
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0,
      "interactive practice must not award XP or change completion rules");
    await page.locator("[data-reset]").click();
    assert.equal(await page.locator("[data-score]").textContent(), "0/5", "lab reset must clear only the temporary exercise state");
    assert.match(await page.locator("[data-insight]").textContent(), /ابدأ بالمهمة الأولى/,
      "lab reset must restore the initial guidance message");

    const visualLessons = ["BM-001","BM-002","BM-003","BM-004","BM-005","BM-006","BM-007","BM-008","BM-009","BM-010","BM-011","BM-012","BM-013","BM-014","BM-015","BM-016","BM-017","BM-018","BM-019","BM-020","BM-021","BM-022","BM-023","BM-024","BM-025","BM-026","BM-027","BM-028","BM-029","BM-030","BM-031","BM-032"];
    for (const code of visualLessons) {
      await page.goto("http://127.0.0.1:" + port + "/#lesson-" + code, { waitUntil: "networkidle" });
      const visual = page.locator(".lesson-visual-card img");
      await visual.waitFor({ state: "attached" });
      await visual.scrollIntoViewIfNeeded();
      await visual.waitFor({ state: "visible" });
      assert.ok(await visual.getAttribute("alt"), code + " visual must have meaningful alternative text");
      await visual.evaluate(img => img.decode());
      assert.ok(await visual.evaluate(img => img.naturalWidth > 0), code + " visual SVG must load successfully");
    }

    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-001", { waitUntil: "networkidle" });
    await page.locator(".bm001-lab").waitFor();
    assert.equal(await page.locator(".bm001-task").count(), 5, "BM-001 must render five guided practice tasks");
    await page.locator('[data-task="unit-difference"] input').fill("0.40");
    await page.locator('[data-check="unit-difference"]').click();
    assert.equal(await page.locator('[data-task="unit-difference"] input').inputValue(), "0.40",
      "incorrect answers must remain visible so learners can revise their reasoning");
    await page.locator('[data-task="unit-difference"] input').fill("0.45");
    await page.locator('[data-check="unit-difference"]').click();
    assert.match(await page.locator('[data-task="unit-difference"] .bm001-feedback').textContent(), /إجابة صحيحة/);
    await page.locator('[data-task="quantity-impact"] input').fill("270");
    await page.locator('[data-check="quantity-impact"]').click();
    await page.locator('[data-task="annual-impact"] input').fill("14040");
    await page.locator('[data-check="annual-impact"]').click();
    await page.locator('[data-task="unit-validation"] input[value="b"]').check();
    await page.locator('[data-check="unit-validation"]').click();
    await page.locator('[data-task="source-validation"] input[value="c"]').check();
    await page.locator('[data-check="source-validation"]').click();
    assert.match(await page.locator(".bm001-complete").textContent(), /أكملت المختبر بنجاح/);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0,
      "BM-001 lab must not bypass the existing XP evidence requirements");
    await page.locator(".st-panel").waitFor();
    assert.equal(await page.locator(".st-term").count(), 15, "lesson must expose the foundation glossary");
    await page.locator("#stGlossarySearch").fill("Food Cost");
    assert.ok(await page.locator(".st-term:not([hidden])").count() >= 1, "glossary search must filter matching terms");
    await page.locator("#stGlossarySearch").fill("");
    await page.locator("#stNote").fill("راجع Part و Whole قبل حساب النسبة.");
    assert.match(await page.locator("#stNoteStatus").textContent(), /تم حفظ الملاحظة/);
    await page.locator("#stBookmark").click();
    assert.equal(await page.locator("#stBookmark").getAttribute("aria-pressed"), "true");
    await page.locator("#lessonProgressPanel").waitFor();
    await page.locator("#stFlashCard").waitFor();
    assert.equal(await page.locator("#stFlashTerm").textContent(), "Part", "lesson flashcards must start from the first glossary term");
    await page.locator("#stFlashReveal").click();
    assert.equal(await page.locator("#stFlashAnswer").isVisible(), true, "flashcard answer must reveal on demand");
    await page.locator("#stFlashKnown").click();
    assert.equal(await page.locator("#stMasteredCount").textContent(), "1", "mastery classification must update immediately");
    await page.locator("#stFlashNext").click();
    assert.equal(await page.locator("#stFlashTerm").textContent(), "Whole", "next flashcard must advance the active recall deck");

    assert.ok(await page.locator(".ka-formula-block").count() > 0, "standalone formulas must be visually distinguished");
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0);
    await page.locator("#completeLessonButton").click();
    assert.match(await page.locator("#lessonEvidenceFeedback").textContent(), /أكمل العناصر الأربعة/);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0);

    for (const key of ["interactiveLab", "professionalChallenge", "fieldChecklist", "learnerAttested"]) {
      await page.locator('[data-evidence="' + key + '"]').check();
    }
    await page.locator("#completeLessonButton").click();
    await page.waitForFunction(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp === 90);
    assert.equal(await page.locator(".lesson-status").textContent(), "مكتمل");

    const xpBeforeBm002 = await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp);
    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-002", { waitUntil: "networkidle" });
    await page.locator(".bm002-lab").waitFor();
    assert.equal(await page.locator(".bm002-task").count(), 7, "BM-002 must render seven arithmetic and decision tasks");
    await page.locator('[data-task="sales-total"] input').fill("4000");
    await page.locator('[data-check="sales-total"]').click();
    assert.equal(await page.locator('[data-task="sales-total"] input').inputValue(), "4000",
      "incorrect BM-002 answers must remain visible for revision");
    await page.locator('[data-task="sales-total"] input').fill("4075");
    await page.locator('[data-check="sales-total"]').click();
    assert.match(await page.locator('[data-task="sales-total"] .bm002-feedback').textContent(), /إجابة صحيحة/);
    for (const [id, answer] of [["report-gap","1200"],["line-revenue","1530"],["average-check","150"],["cogs","13000"],["water-variance","-2"]]) {
      await page.locator('[data-task="' + id + '"] input').fill(answer);
      await page.locator('[data-check="' + id + '"]').click();
      assert.match(await page.locator('[data-task="' + id + '"] .bm002-feedback').textContent(), /إجابة صحيحة/, id + " must validate");
    }
    await page.locator('[data-task="management-action"] input[value="c"]').check();
    await page.locator('[data-check="management-action"]').click();
    assert.match(await page.locator('[data-task="management-action"] .bm002-feedback').textContent(), /قرار مهني صحيح/);
    assert.match(await page.locator(".bm002-note").textContent(), /اكتمل المختبر بنجاح/);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), xpBeforeBm002,
      "BM-002 practice must not award XP or bypass lesson evidence requirements");
    const bm002Visual = page.locator(".lesson-visual-card img");
    await bm002Visual.waitFor({ state: "attached" });
    await bm002Visual.scrollIntoViewIfNeeded();
    await bm002Visual.waitFor({ state: "visible" });
    assert.ok(await bm002Visual.getAttribute("alt"), "BM-002 lesson visual must have alternative text");
    await bm002Visual.evaluate(img => img.decode());
    assert.ok(await bm002Visual.evaluate(img => img.naturalWidth > 0), "BM-002 lesson visual must load successfully");

    const xpBeforeBm003 = await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp);
    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-003", { waitUntil: "networkidle" });
    await page.locator(".bm003-lab").waitFor();
    assert.equal(await page.locator(".bm003-task").count(), 11, "BM-003 must render eleven order-of-operations tasks");
    await page.locator('[data-task="priority"] input').fill("160");
    await page.locator('[data-check="priority"]').click();
    assert.equal(await page.locator('[data-task="priority"] input').inputValue(), "160",
      "incorrect BM-003 answers must remain visible for revision");
    await page.locator('[data-task="priority"] input').fill("140");
    await page.locator('[data-check="priority"]').click();
    assert.match(await page.locator('[data-task="priority"] .bm003-feedback').textContent(), /حساب صحيح/);
    for (const [id, answer] of [["parentheses","300"],["equal-precedence","27"],["division-first","180"],["bracketed-division","46.67"],["cocktail-cost","14"],["net-sales","29500"],["average-check","196.67"],["beverage-cost","30"],["inverse-check","29500"]]) {
      await page.locator('[data-task="' + id + '"] input').fill(answer);
      await page.locator('[data-check="' + id + '"]').click();
      assert.match(await page.locator('[data-task="' + id + '"] .bm003-feedback').textContent(), /حساب صحيح/, id + " must validate");
    }
    await page.locator('[data-task="formula-choice"] input[value="b"]').check();
    await page.locator('[data-check="formula-choice"]').click();
    assert.match(await page.locator('[data-task="formula-choice"] .bm003-feedback').textContent(), /اختيار صحيح/);
    assert.match(await page.locator(".bm003-footer").textContent(), /اكتمل التدريب/);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), xpBeforeBm003,
      "BM-003 practice must not award XP or bypass lesson evidence requirements");
    const bm003Visual = page.locator(".lesson-visual-card img");
    await bm003Visual.waitFor({ state: "attached" });
    await bm003Visual.scrollIntoViewIfNeeded();
    await bm003Visual.waitFor({ state: "visible" });
    await bm003Visual.evaluate(img => img.decode());
    assert.ok(await bm003Visual.evaluate(img => img.naturalWidth > 0), "BM-003 lesson visual must load successfully");
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false,
      "BM-003 lesson and lab must fit a mobile viewport");

    const bank = JSON.parse(fs.readFileSync(path.join(root, "data/assessments/business-mathematics.json"), "utf8"));
    const exam = bank.chapterAssessments[0];
    await page.goto("http://127.0.0.1:" + port + "/#assessment-" + exam.id, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: exam.title }).waitFor();
    for (const question of exam.questions) {
      await page.locator('input[name="' + question.id + '"][value="' + question.correctOption + '"]').check();
    }
    await page.locator("#learningAssessmentForm button[type=submit]").click();
    await page.getByRole("heading", { name: "اجتزت الاختبار" }).waitFor();
    assert.equal(await page.locator(".assessment-score strong").textContent(), "100%");

    const failedAnswers = exam.questions.map(q => ({ q, wrong: q.options.find(o => o.id !== q.correctOption).id }));
    await page.locator("#retryAssessment").click();
    for (const item of failedAnswers) {
      await page.locator('input[name="' + item.q.id + '"][value="' + item.wrong + '"]').check();
    }
    await page.locator("#learningAssessmentForm button[type=submit]").click();
    await page.getByRole("heading", { name: "لم تصل إلى حد النجاح بعد" }).waitFor();
    const examSummary = await page.evaluate(id => window.KPI_LEARNING_ENGINE.getAssessmentSummary(id), exam.id);
    assert.equal(examSummary.attemptCount, 2);
    assert.equal(examSummary.bestScore, 100);
    assert.equal(examSummary.latestScore, 0);
    assert.equal(examSummary.passed, true, "a failed retake must not erase the earlier pass");

    await page.goto("http://127.0.0.1:" + port + "/#progress", { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "مركز التقدم والتقييم" }).waitFor();
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 90);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().passedAssessments), 1);

    const downloadPromise = page.waitForEvent("download");
    await page.locator("#exportLearningBackup").click();
    const download = await downloadPromise;
    const backupPath = await download.path();
    const backup = JSON.parse(fs.readFileSync(backupPath, "utf8"));
    assert.equal(backup.backupTag, "KPI_ACADEMY_LEARNING_BACKUP");
    assert.equal(backup.state.xpTransactions.length, 1);

    page.once("dialog", dialog => dialog.accept());
    await page.locator("#resetLearningProgress").click();
    await page.waitForFunction(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp === 0);
    page.once("dialog", dialog => dialog.accept());
    await page.locator("#importLearningBackup").setInputFiles({
      name: "kpi-academy-learning-backup.json",
      mimeType: "application/json",
      buffer: fs.readFileSync(backupPath)
    });
    await page.waitForFunction(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp === 90);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().passedAssessments), 1);

    await page.goto("http://127.0.0.1:" + port + "/#calculator", { waitUntil: "networkidle" });
    await page.locator("#kpiForm").waitFor();
    await page.locator('input[name="period"]').fill("2026-11");
    const xssPayload = '<img src=x onerror="window.__kpiXss=1">';
    await page.locator('input[name="scope"]').fill(xssPayload);
    await page.locator('input[name="openingInventory"]').fill("100");
    await page.locator('input[name="purchases"]').fill("50");
    await page.locator('input[name="closingInventory"]').fill("40");
    await page.locator('#kpiForm button[type="submit"]').click();
    await page.locator(".result-success").waitFor();
    assert.equal(await page.locator("#calcResult img").count(), 0, "user-entered report context must not create HTML elements");
    assert.ok((await page.locator("#calcResult .result-details").textContent()).includes(xssPayload),
      "report context must be shown as literal text after escaping");
    assert.equal(await page.evaluate(() => window.__kpiXss || 0), 0, "user-entered report context must not execute script-capable markup");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:" + port + "/#dashboard", { waitUntil: "networkidle" });
    await page.locator(".chapter-progress").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "dashboard visual chart must fit mobile width");
    await page.goto("http://127.0.0.1:" + port + "/#analytics", { waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "analytics table must remain within the mobile viewport");
    await page.goto("http://127.0.0.1:" + port + "/#simulator", { waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "simulator workspace must fit mobile width");
    await page.locator('[data-simulator-stage="decision"]').click();
    await page.locator('[data-choice="b"]').click();
    assert.match(await page.locator("#kaSimFeedback").textContent(), /اختيار قوي/);
    await page.locator('[data-scenario="average-check"]').click();
    await page.locator('[data-simulator-stage="evidence"]').click();
    assert.match(await page.locator("#simulatorStageDetail").textContent(), /Average Check: 120/);
    await page.locator('[data-simulator-stage="decision"]').click();
    await page.locator('[data-choice="b"]').click();
    assert.match(await page.locator("#kaSimFeedback").textContent(), /اختيار قوي/);
    await page.locator('[data-scenario="inventory-turnover"]').click();
    await page.locator('[data-simulator-stage="decision"]').click();
    await page.locator('[data-choice="b"]').click();
    assert.match(await page.locator("#kaSimFeedback").textContent(), /اختيار قوي/);
    await page.goto("http://127.0.0.1:" + port + "/#progress", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.equal(overflow, false, "progress view must not overflow horizontally on a mobile viewport");
    assert.equal(await page.locator("html").getAttribute("dir"), "rtl");

    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-001", { waitUntil: "networkidle" });
    await page.locator("#lessonProgressPanel").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false,
      "lesson reader and evidence controls must fit a mobile viewport");
    assert.equal(await page.locator(".lesson-meta").evaluate(node => getComputedStyle(node).direction), "ltr");

    await page.goto("http://127.0.0.1:" + port + "/#assessment-bm-final-practical", { waitUntil: "networkidle" });
    await page.locator("#learningAssessmentForm").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false,
      "final assessment options must fit a mobile viewport");


    const responsiveWidths = [360, 390, 430, 768, 1024, 1366];
    const responsiveRoutes = ["#dashboard", "#modules", "#module-restaurant-kpis", "#lesson-BM-001", "#calculator", "#analytics", "#simulator"];
    for (const width of responsiveWidths) {
      await page.setViewportSize({ width, height: width <= 430 ? 844 : 900 });
      for (const route of responsiveRoutes) {
        await page.goto("http://127.0.0.1:" + port + "/" + route, { waitUntil: "networkidle" });
        const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        assert.equal(hasOverflow, false, route + " must not overflow at " + width + "px");
      }
    }

    // Exercise the dashboard's lab deep link in a separate learner profile.
    const labContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const labPage = await labContext.newPage();
    labPage.on("pageerror", error => failures.push(error.message));
    await labPage.goto("http://127.0.0.1:" + port + "/#dashboard", { waitUntil: "networkidle" });
    const resume = labPage.locator(".sprint-resume");
    assert.match(await resume.locator(".ka-resume-context").textContent(), /الرياضيات التجارية/);
    const evidenceMeter = resume.getByRole("progressbar", { name: "متطلبات إكمال الدرس" });
    assert.equal(await evidenceMeter.getAttribute("value"), "0");
    await labPage.evaluate(() => {
      window.KPI_LEARNING_ENGINE.startLesson("BM-006");
      window.KPI_LEARNING_ENGINE.saveLessonEvidence("BM-006", { interactiveLab: true });
    });
    await labPage.reload({ waitUntil: "networkidle" });
    assert.equal(await resume.locator(".sprint-primary").getAttribute("href"), "#lesson-BM-006");
    assert.equal(await evidenceMeter.getAttribute("value"), "1");
    assert.equal(await evidenceMeter.getAttribute("max"), "4");
    assert.equal(await labPage.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0);
    await labPage.getByRole("link", { name: /المختبر التطبيقي/ }).click();
    await labPage.locator("[data-margin-value]").waitFor();
    assert.equal(await labPage.locator("[data-margin-value]").textContent(), "70.0%");
    assert.equal(await labPage.locator("[data-gross-profit]").textContent(), "29,400 MAD");
    await labPage.locator("[data-gross-cost]").fill("50000");
    assert.equal(await labPage.locator("[data-margin-value]").textContent(), "-19.0%");
    await labPage.locator("[data-gross-sales]").fill("0");
    assert.equal(await labPage.locator("[data-margin-value]").textContent(), "—");
    for (const clip of ["bm-001", "bm-005"]) {
      const response = await labPage.request.get("http://127.0.0.1:" + port + "/assets/video/" + clip + ".mp4");
      assert.equal(response.headers()["content-type"], "video/mp4");
      assert.ok((await response.body()).length > 1000);
    }
    assert.equal(await labPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false,
      "the gross-margin case must fit the mobile viewport");
    await labContext.close();

    assert.deepEqual(failures, [], "browser must not emit uncaught page errors");
    console.log("Browser smoke passed: dashboard load state and assessment retry, 9 assessments, lesson evidence/90 XP, assessment pass + failed retake history, backup export/restore, RTL mobile overflow on progress/lesson/exam, LTR metadata and zero uncaught page errors.");
    await context.close();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})();
