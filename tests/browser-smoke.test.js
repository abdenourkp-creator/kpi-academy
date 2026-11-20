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
  ".md": "text/markdown; charset=utf-8"
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
    await page.getByRole("heading", { name: "افهم الأرقام. اتخذ قرارات أفضل." }).waitFor();
    assert.equal(await page.locator(".ka-module-card").count(), 3, "dashboard must show exactly the three approved MVP modules");
    await page.locator(".chapter-progress").waitFor();
    assert.equal(await page.locator(".chapter-progress-row").count(), 8, "dashboard must render one live progress row per curriculum chapter");
    await page.waitForFunction(() => !!window.KPI_LEARNING_ENGINE && !!window.KPI_LEARNING_UI);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0);

    await page.locator('a[href="#progress"]').first().click();
    await page.getByRole("heading", { name: "مركز التقدم والتقييم" }).waitFor();
    assert.equal(await page.locator(".assessment-card").count(), 9);
    assert.equal(await page.locator(".learning-resume").count(), 1);
    assert.match(await page.locator(".learning-resume").textContent(), /BM-001|جارٍ تحميل خريطة الدروس/);

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

    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-005", { waitUntil: "networkidle" });
    await page.locator(".lesson-visual-card").waitFor();
    await page.locator(".ka-lesson-toc").waitFor();
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
    assert.equal(await page.locator('[role="progressbar"]').getAttribute("aria-valuenow"), "5");
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0,
      "interactive practice must not award XP or change completion rules");
    await page.locator("[data-reset]").click();
    assert.equal(await page.locator("[data-score]").textContent(), "0/5", "lab reset must clear only the temporary exercise state");
    assert.match(await page.locator("[data-insight]").textContent(), /ابدأ بالمهمة الأولى/,
      "lab reset must restore the initial guidance message");

    await page.goto("http://127.0.0.1:" + port + "/#lesson-BM-001", { waitUntil: "networkidle" });
    await page.locator("#lessonProgressPanel").waitFor();
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

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:" + port + "/#dashboard", { waitUntil: "networkidle" });
    await page.locator(".chapter-progress").waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false, "dashboard visual chart must fit mobile width");
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
