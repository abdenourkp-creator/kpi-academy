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
    await page.getByRole("heading", { name: "حوّل الأرقام إلى قرارات إدارية." }).waitFor();
    await page.waitForFunction(() => !!window.KPI_LEARNING_ENGINE && !!window.KPI_LEARNING_UI);
    assert.equal(await page.evaluate(() => window.KPI_LEARNING_ENGINE.getDashboard().earnedXp), 0);

    await page.locator('a[href="#progress"]').first().click();
    await page.getByRole("heading", { name: "مركز التقدم والتقييم" }).waitFor();
    assert.equal(await page.locator(".assessment-card").count(), 9);
    assert.equal(await page.locator(".learning-resume").count(), 1);
    assert.match(await page.locator(".learning-resume").textContent(), /BM-001|جارٍ تحميل خريطة الدروس/);

    const failurePage = await context.newPage();
    await failurePage.addInitScript(() => {
      const originalFetch = window.fetch.bind(window);
      let failOnce = true;
      window.fetch = (input, init) => {
        const url = String(input);
        if (failOnce && url.includes("data/assessments/business-mathematics.json")) {
          failOnce = false;
          return Promise.reject(new TypeError("simulated assessment catalog network failure"));
        }
        return originalFetch(input, init);
      };
    });
    await failurePage.goto("http://127.0.0.1:" + port + "/#progress", { waitUntil: "networkidle" });
    await failurePage.getByRole("heading", { name: "تعذر تحميل بيانات التقييم" }).waitFor();
    await failurePage.locator("#retryLearningCatalog").click();
    await failurePage.waitForFunction(() => document.querySelectorAll(".assessment-card").length === 9);
    await failurePage.close();

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
