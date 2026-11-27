(function (root) {
  "use strict";

  const ENGINE = root.KPI_LEARNING_ENGINE;
  const ASSESSMENT_URL = "data/assessments/business-mathematics.json";
  const CURRICULUM_URL = "data/business-mathematics.json";
  let catalog = null;
  let curriculum = null;
  let loadError = null;
  let loadPromise = null;
  let activeAssessment = null;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function loadCatalog() {
    if (loadPromise) return loadPromise;
    loadPromise = Promise.all([fetch(ASSESSMENT_URL), fetch(CURRICULUM_URL)])
      .then(async responses => {
        if (responses.some(response => !response.ok)) throw new Error("تعذر تحميل بنك الاختبارات أو خريطة المنهج.");
        const data = await Promise.all(responses.map(response => response.json()));
        validateCatalog(data[0]);
        catalog = data[0];
        curriculum = data[1];
        loadError = null;
        refreshCurrentView();
        return true;
      })
      .catch(error => {
        loadError = error.message || "تعذر تحميل بيانات التقييم.";
        loadPromise = null;
        refreshCurrentView();
        return false;
      });
    return loadPromise;
  }

  function validateCatalog(catalog) {
    if (!catalog || catalog.passThreshold !== 80 ||
        !Array.isArray(catalog.chapterAssessments) || catalog.chapterAssessments.length !== 8 ||
        !catalog.finalAssessment || catalog.finalAssessment.id !== "bm-final-practical") {
      throw new Error("هيكل بنك التقييم لا يطابق قواعد Business Mathematics.");
    }
    const all = catalog.chapterAssessments.concat([catalog.finalAssessment]);
    const ids = new Set();
    for (const assessment of all) {
      if (ids.has(assessment.id) || !Array.isArray(assessment.questions) ||
          assessment.questions.length !== assessment.questionCount || !assessment.questions.length) {
        throw new Error("تعريف اختبار مكرر أو غير مكتمل: " + assessment.id);
      }
      ids.add(assessment.id);
      for (const question of assessment.questions) {
        if (!question.id || !question.prompt || !Array.isArray(question.options) ||
            question.options.length < 2 || !question.options.some(option => option.id === question.correctOption)) {
          throw new Error("سؤال غير صالح: " + (question.id || "unknown"));
        }
      }
    }
  }

  function refreshCurrentView() {
    if (root.dispatchEvent && typeof Event !== "undefined") {
      root.dispatchEvent(new Event("hashchange"));
    }
  }

  function getAssessment(id) {
    if (!catalog) return null;
    return catalog.chapterAssessments.find(item => item.id === id) ||
      (catalog.finalAssessment.id === id ? catalog.finalAssessment : null);
  }

  function pct(value, total) {
    return total ? Math.round((value / total) * 100) : 0;
  }

  function storageNote() {
    const status = ENGINE.getStorageStatus();
    if (status.persistent) {
      return '<div class="learning-storage-note"><span class="learning-dot good"></span>يتم حفظ تقدمك محلياً على هذا الجهاز. لا توجد مزامنة سحابية.</div>';
    }
    return '<div class="learning-storage-note warning"><span class="learning-dot"></span>التخزين المحلي غير متاح حالياً؛ قد لا تبقى التغييرات بعد إغلاق الصفحة.</div>';
  }

  function dashboardSummary({ chapterOnly = false, language = "ar" } = {}) {
    const copy = root.KPI.i18n[language].home;
    if (!ENGINE) return "";
    if (!curriculum && !loadPromise && !loadError) loadCatalog();
    if (!curriculum) {
      return loadError
        ? `<section role="alert"><p>${copy.assessError}</p><button type="button" id="retryLearningCatalog">${copy.retry}</button></section>`
        : `<section class="learning-resume" role="status"><h3>${copy.mapLoading}</h3></section>`;
    }
    const data = ENGINE.getDashboard();
    const lessonProgress = pct(data.completedLessons, data.totalLessons);
    const assessmentProgress = pct(data.passedAssessments, data.totalAssessments);
    const lessons = curriculum ? curriculum.chapters.flatMap(chapter => chapter.lessons) : [];
    const inProgress = lessons.map(lesson => ({ lesson, state: ENGINE.getLessonProgress(lesson.code).progress }))
      .filter(item => item.state && item.state.status === "in-progress")
      .sort((a, b) => (b.state.updatedAt || "").localeCompare(a.state.updatedAt || ""));
    const candidate = inProgress.length ? inProgress[0].lesson :
      lessons.find(lesson => {
        const state = ENGINE.getLessonProgress(lesson.code).progress;
        return !state || state.status !== "completed";
      });
    const resumeBlock = candidate
      ? '<section class="learning-resume"><div><span class="eyebrow">متابعة التعلّم</span><h3>' + esc(root.KPI_AR_LABEL ? root.KPI_AR_LABEL(candidate.title.replace(/^BM-\\d+ — /,'')) : candidate.title) + '</h3><p>' + esc(candidate.code) + ' · ' + (inProgress.length ? "تابع من حيث توقفت" : "الدرس التالي المقترح") + '</p></div><a href="#lesson-' + esc(candidate.code) + '" class="primary-action">متابعة الدرس ←</a></section>'
      : '<section class="learning-resume complete"><div><span class="eyebrow">اكتملت الدروس</span><h3>أكملت دروس الرياضيات التجارية الـ32.</h3><p>راجع الاختبارات الفصلية والاختبار النهائي لاستيفاء شروط الإكمال.</p></div><a href="#progress" class="primary-action">عرض الاختبارات ←</a></section>';
    const rows = curriculum.chapters.map(chapter => {
      const done = chapter.lessons.filter(lesson => ENGINE.getLessonProgress(lesson.code).progress?.status === "completed").length;
      const percent = pct(done, chapter.lessons.length);
      const title = language === "ar" && root.KPI_AR_LABEL ? root.KPI_AR_LABEL(chapter.title) : chapter.title;
      return `<div class="chapter-progress-row"><div class="chapter-progress-label"><strong>${copy.chapter} ${esc(chapter.number)} · ${esc(title)}</strong>
        <bdi dir="ltr">${done} / ${chapter.lessons.length}</bdi></div><div class="chapter-progress-track" role="progressbar"
        aria-label="${copy.chapterProgress} · ${esc(title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
        <i style="width:${percent}%"></i></div></div>`;
    }).join("");
    const chapterBlock = `<section class="chapter-progress" aria-labelledby="chapterProgressTitle"><div class="chapter-progress-heading">
      <div><h3 id="chapterProgressTitle">${copy.chapterProgress}</h3><p>${copy.chaptersHint}</p></div>
      <span class="chapter-progress-total"><bdi dir="ltr">${data.completedLessons} / ${data.totalLessons}</bdi> ${copy.lessons}</span>
      </div><div class="chapter-progress-list">${rows}</div></section>`;
    if (chapterOnly) return chapterBlock;
    return '<section class="learning-hero"><div class="learning-hero-copy"><span class="eyebrow">محرك التعلّم · المستوى التأسيسي</span><h2>تقدمك مبني على الإنجاز، لا على فتح الصفحات.</h2><p>كل نقطة وكل حالة نجاح لها سجل واضح يمكنك مراجعته واستعادته.</p></div><div class="learning-hero-metrics"><div><strong>' + data.earnedXp.toLocaleString("en-US") + '</strong><span>نقاط الخبرة المكتسبة</span></div><div><strong>' + data.passedAssessments + '/9</strong><span>الاختبارات المجتازة</span></div></div></section>' + resumeBlock + '<section class="learning-mini-grid"><article class="learning-mini-card"><span>الدروس المكتملة</span><strong>' + data.completedLessons + ' / 32</strong><div class="learning-progress-track"><i style="width:' + lessonProgress + '%"></i></div></article><article class="learning-mini-card"><span>الاختبارات المجتازة</span><strong>' + data.passedAssessments + ' / 9</strong><div class="learning-progress-track"><i style="width:' + assessmentProgress + '%"></i></div></article><article class="learning-mini-card"><span>رصيد XP</span><strong>' + data.earnedXp.toLocaleString("en-US") + ' / ' + data.availableXp.toLocaleString("en-US") + '</strong><div class="learning-progress-track"><i style="width:' + pct(data.earnedXp, data.availableXp) + '%"></i></div></section>' + chapterBlock;
  }
  function lessonPanel(code) {
    const current = ENGINE.getLessonProgress(code);
    const completed = current.progress && current.progress.status === "completed";
    const evidence = current.evidence;
    const reward = ENGINE.getLessonXp(code);
    const rewardLabel = reward ? "+" + reward + " نقطة خبرة" : "تدريب دون نقاط";
    const rewardRule = reward ? "تُمنح النقاط مرة واحدة بعد استكمال أدلة الإنجاز الأربعة." : "يُحفظ إكمال التدريب بعد تسجيل الأدلة الأربعة دون إضافة نقاط خبرة.";
    const check = (key, label, hint) => '<label class="evidence-item"><input type="checkbox" data-evidence="' + key + '"' + (evidence[key] ? " checked" : "") + (completed ? " disabled" : "") + '><span><strong>' + label + '</strong><small>' + hint + '</small></span></label>';
    return '<section class="lesson-progress-panel" id="lessonProgressPanel" data-lesson="' + esc(code) + '"><div class="lesson-progress-head"><div><span class="eyebrow">سجل التعلّم</span><h2>إثبات الإنجاز العملي</h2><p>فتح الدرس لا يمنح نقاطاً. سجّل إكمال الأنشطة الفعلية أولاً.</p></div><span class="lesson-status ' + (completed ? "done" : "active") + '">' + (completed ? "مكتمل" : "قيد التعلم") + '</span></div><div class="evidence-grid">' +
      check("interactiveLab", "تنفيذ المختبر التطبيقي", "طبّقت الحسابات أو خطوات التمرين داخل الدرس.") +
      check("professionalChallenge", "حل التحدي المهني", "أنجزت التحدي التطبيقي وراجعت مخرجاته.") +
      check("fieldChecklist", "مراجعة قائمة التحقق الميدانية", "تحققت من عناصر قائمة التطبيق الميداني.") +
      check("learnerAttested", "إقرار المتعلم", "أؤكد أنني أنجزت العناصر أعلاه بنفسي.") +
      '</div><div class="lesson-progress-actions"><p class="lesson-feedback" id="lessonEvidenceFeedback" role="status">' + (completed ? "تم تسجيل إنجاز هذا الدرس." : "علّم العناصر بعد تنفيذها فعلياً؛ التسجيل في هذه النسخة إقرار ذاتي محلي.") + '</p><button class="primary-action learning-action" id="completeLessonButton"' + (completed ? " disabled" : "") + '>تأكيد الإنجاز <span>' + rewardLabel + '</span></button></div><div class="lesson-xp-rule">' + rewardRule + '</div></section>';
  }

  function mountLessonPanel(code) {
    const mount = document.getElementById("lessonProgressMount");
    if (!mount) return;
    ENGINE.startLesson(code);
    mount.innerHTML = lessonPanel(code);
    const panel = document.getElementById("lessonProgressPanel");
    if (!panel) return;
    panel.querySelectorAll("[data-evidence]").forEach(input => {
      input.addEventListener("change", () => {
        const evidence = {};
        panel.querySelectorAll("[data-evidence]").forEach(item => {
          evidence[item.dataset.evidence] = item.checked;
        });
        const result = ENGINE.saveLessonEvidence(code, evidence);
        const feedback = document.getElementById("lessonEvidenceFeedback");
        if (feedback) feedback.textContent = result.persisted === false
          ? "تم حفظ الحالة في الجلسة الحالية فقط؛ التخزين الدائم غير متاح."
          : "تم حفظ أدلة الإنجاز على هذا الجهاز.";
      });
    });
    const button = document.getElementById("completeLessonButton");
    if (button) button.addEventListener("click", () => {
      const result = ENGINE.completeLesson(code);
      const feedback = document.getElementById("lessonEvidenceFeedback");
      if (!result.ok) {
        if (feedback) feedback.textContent = "لم يكتمل التسجيل بعد. أكمل العناصر الأربعة، بما فيها الإقرار الذاتي.";
        return;
      }
      mount.innerHTML = lessonPanel(code);
      const note = document.getElementById("lessonEvidenceFeedback");
      if (note) note.textContent = result.alreadyCompleted
        ? "هذا الدرس مسجل مسبقاً؛ لم تُمنح نقاط إضافية."
        : result.xpAwarded ? "تم تسجيل الإنجاز وإضافة " + result.xpAwarded + " نقطة خبرة إلى سجلّك." : "تم تسجيل إكمال التدريب دون إضافة نقاط خبرة.";
      if (root.location && root.location.hash === "#progress") refreshCurrentView();
    });
  }

  function assessmentCards() {
    if (!catalog) return '<div class="empty-card"><h2>جارٍ تحميل الاختبارات…</h2></div>';
    const all = catalog.chapterAssessments.concat([catalog.finalAssessment]);
    return all.map((assessment, index) => {
      const summary = ENGINE.getAssessmentSummary(assessment.id);
      const passed = summary.passed;
      const kind = assessment.type === "final" ? "final" : "chapter";
      return '<article class="assessment-card ' + (passed ? "passed" : "") + '"><div class="assessment-card-top"><span class="assessment-index">' + (kind === "final" ? "نهائي" : "الفصل " + String(assessment.chapterNumber).padStart(2,"0")) + '</span><span class="assessment-badge ' + (passed ? "passed" : summary.attemptCount ? "attempted" : "new") + '">' + (passed ? "اجتاز" : summary.attemptCount ? "محاولة سابقة" : "لم يبدأ") + '</span></div><h3>' + esc(assessment.title) + '</h3><p>' + assessment.questionCount + ' أسئلة · النجاح من 80% · إعادة غير محدودة</p><div class="assessment-card-meta"><span>المحاولات: ' + summary.attemptCount + '</span><span>أفضل: ' + (summary.bestScore == null ? "—" : summary.bestScore + "%") + '</span><span>الأخيرة: ' + (summary.latestScore == null ? "—" : summary.latestScore + "%") + '</span></div><a class="text-link assessment-open" href="#assessment-' + assessment.id + '">' + (summary.attemptCount ? "إعادة / مراجعة الاختبار" : "بدء الاختبار") + ' ←</a></article>';
    }).join("");
  }

  function backupPanel() {
    return '<section class="backup-panel"><div><h2>نسخة احتياطية لبيانات التعلم</h2><p>صدّر سجلّك أو استعده على هذا الجهاز. لا توجد مزامنة بين الأجهزة.</p></div><div class="backup-actions"><button class="secondary-action" id="exportLearningBackup">تصدير النسخة</button><label class="secondary-action file-pick">استعادة نسخة<input type="file" id="importLearningBackup" accept="application/json,.json"></label><button class="danger-action" id="resetLearningProgress">إعادة ضبط التقدم</button></div><p class="backup-feedback" id="backupFeedback" role="status"></p></section>';
  }

  function settingsView() {
    return '<div class="page-heading"><div><h1>إعدادات التعلّم</h1></div></div>' +
      storageNote() + backupPanel();
  }

  function progressView() {
    if (!catalog || !curriculum) {
      if (!loadPromise && !loadError) loadCatalog();
      const message = loadError
        ? '<div class="empty-card"><h2>تعذر تحميل بيانات التقييم</h2><p>' + esc(loadError) + '</p><button class="primary-action" id="retryLearningCatalog">إعادة المحاولة</button></div>'
        : '<div class="loading-state">جارٍ تجهيز سجل التعلم…</div>';
      return '<div class="page-heading"><div><span class="eyebrow">التقييم والتقدم</span><h1>التقييم والتقدم</h1><p>سجل الإنجاز والاختبارات والشهادة.</p></div></div>' + message;
    }
    const data = ENGINE.getDashboard();
    const certificate = ENGINE.getCertificateEligibility();
    const completedPct = pct(data.completedLessons, 32);
    const passedPct = pct(data.passedAssessments, 9);
    const chapters = curriculum.chapters.map(chapter => {
      const lessons = chapter.lessons.map(lesson => {
        const record = ENGINE.getLessonProgress(lesson.code);
        const done = record.progress && record.progress.status === "completed";
        const inProgress = record.progress && record.progress.status === "in-progress";
        return '<a class="progress-lesson-link ' + (done ? "done" : inProgress ? "active" : "") + '" href="#lesson-' + lesson.code + '"><span>' + lesson.code + '</span><strong>' + esc(lesson.title) + '</strong><em>' + (done ? "مكتمل" : inProgress ? "قيد التعلم" : "لم يبدأ") + '</em></a>';
      }).join("");
      const count = chapter.lessons.filter(lesson => {
        const record = ENGINE.getLessonProgress(lesson.code);
        return record.progress && record.progress.status === "completed";
      }).length;
      return '<details class="progress-chapter"><summary><span><strong>Chapter ' + String(chapter.number).padStart(2,"0") + ' · ' + esc(chapter.title) + '</strong><small>' + count + ' / ' + chapter.lessons.length + ' دروس مكتملة</small></span><span class="chapter-progress-number">' + pct(count, chapter.lessons.length) + '%</span></summary><div class="progress-lesson-list">' + lessons + '</div></details>';
    }).join("");
    const status = ENGINE.getStorageStatus();
    return '<div class="page-heading"><div><span class="eyebrow">محرك التعلّم · الرياضيات التجارية</span><h1>مركز التقدم والتقييم</h1><p>سجل واحد للدروس، والاختبارات، وXP، وأهلية شهادة الإكمال.</p></div></div>' +
      dashboardSummary() +
      '<section class="progress-section"><div class="progress-section-heading"><div><h2>مسار الدروس</h2><p>32 درساً · 90 نقطة للدرس المؤهل بعد إثبات الإنجاز. التدريب BM-005 دون نقاط.</p></div><strong>' + completedPct + '%</strong></div><div class="learning-progress-track large"><i style="width:' + completedPct + '%"></i></div><div class="progress-chapters">' + chapters + '</div></section>' +
      '<section class="progress-section"><div class="progress-section-heading"><div><h2>الاختبارات التسعة</h2><p>ثمانية اختبارات فصلية واختبار عملي نهائي · عتبة النجاح 80%</p></div><strong>' + passedPct + '%</strong></div><div class="assessment-grid">' + assessmentCards() + '</div></section>' +
      '<section class="certificate-panel ' + (certificate.eligible ? "eligible" : "") + '"><div><span class="eyebrow">إكمال المستوى التأسيسي</span><h2>' + (certificate.eligible ? "متطلبات الإكمال مستوفاة" : "شهادة الإكمال غير متاحة بعد") + '</h2><p>' + esc(certificate.certificateTitle) + '</p><small>الشرط: اجتياز الاختبارات الفصلية الثمانية والاختبار النهائي بنتيجة 80% أو أكثر. شهادة داخلية غير معتمدة خارجياً.</small></div><div class="certificate-state">' + (certificate.eligible ? "ELIGIBLE" : data.passedAssessments + " / 9 PASSED") + '</div></section>' +
      backupPanel() + storageNote() + '<p class="assessment-disclaimer">هذه نسخة تعليمية محلية: الإجابات وسجل الدرجات محفوظان في المتصفح ويمكن تعديلهما من أدوات المطور. لا يوجد مراقب امتحان أو مصادقة أو تحقق مركزي من هوية المتعلم.</p>';
  }

  function renderسuestion(question, index) {
    const options = question.options.map(option => '<label class="quiz-option"><input type="radio" name="' + esc(question.id) + '" value="' + esc(option.id) + '"><span class="quiz-option-key">' + esc(option.id) + '</span><span>' + esc(option.label) + '</span></label>').join("");
    return '<fieldset class="quiz-question"><legend><span class="quiz-question-number">س' + String(index + 1).padStart(2,"0") + '</span>' + esc(question.prompt) + '</legend><div class="quiz-options">' + options + '</div></fieldset>';
  }

  function assessmentHistory(assessment) {
    const summary = ENGINE.getAssessmentSummary(assessment.id);
    if (!summary.attemptCount) return '<p class="assessment-no-history">لا توجد محاولات مسجلة لهذا الاختبار.</p>';
    return '<div class="assessment-history"><h3>سجل المحاولات</h3><div class="assessment-history-list">' + summary.attempts.slice().reverse().map(attempt => '<div><span>#' + attempt.attemptNumber + '</span><strong>' + attempt.score + '%</strong><em class="' + (attempt.passed ? "pass" : "fail") + '">' + (attempt.passed ? "ناجح" : "لم يجتز") + '</em><small>' + new Date(attempt.submittedAt).toLocaleString("ar-MA") + '</small></div>').join("") + '</div></div>';
  }

  function assessmentView(id) {
    if (!catalog) {
      loadCatalog();
      return '<div class="loading-state">جارٍ تحميل بنك الاختبار…</div>';
    }
    const assessment = getAssessment(id);
    if (!assessment) return '<div class="empty-card"><h2>الاختبار غير موجود</h2><a class="text-link" href="#progress">العودة إلى التقدم</a></div>';
    activeAssessment = assessment;
    const summary = ENGINE.getAssessmentSummary(id);
    return '<div class="assessment-toolbar"><a class="text-link" href="#progress">← مركز التقدم</a><span class="tag">' + (assessment.type === "final" ? "الاختبار العملي النهائي" : "اختبار الفصل") + '</span></div><div class="assessment-intro"><span class="eyebrow">حد النجاح · 80%</span><h1>' + esc(assessment.title) + '</h1><p>' + assessment.questionCount + ' أسئلة · الدرجة متساوية لكل سؤال · إعادة غير محدودة · لا توجد نقاط XP للاختبارات.</p><div class="assessment-intro-stats"><span>المحاولات <strong>' + summary.attemptCount + '</strong></span><span>أفضل نتيجة <strong>' + (summary.bestScore == null ? "—" : summary.bestScore + "%") + '</strong></span><span>آخر نتيجة <strong>' + (summary.latestScore == null ? "—" : summary.latestScore + "%") + '</strong></span></div></div><form id="learningAssessmentForm" class="assessment-form" data-assessment="' + esc(id) + '"><div class="quiz-progress-label"><span>أجب عن جميع الأسئلة قبل الإرسال</span><span>' + assessment.questionCount + ' سؤالاً</span></div>' + assessment.questions.map(renderسuestion).join("") + '<p class="quiz-feedback" id="quizFeedback" role="status"></p><button class="primary-action quiz-submit" type="submit">إرسال الإجابات وحساب النتيجة</button></form>' + assessmentHistory(assessment) + storageNote() + '<p class="assessment-disclaimer">الاختبار يعمل محلياً على جهازك. لا توجد مراقبة أو مصادقة أو تحقق خادمي؛ لذلك يعد أداة تعلم وتقييم ذاتي وليس امتحاناً محمياً.</p>';
  }

  function resultView(assessment, attempt) {
    const passed = attempt.passed;
    const detail = assessment.questions.map((question, index) => {
      const answer = attempt.answers[question.id];
      const correctOption = question.options.find(option => option.id === question.correctOption);
      const selectedOption = question.options.find(option => option.id === answer.selected);
      return '<article class="quiz-review-item ' + (answer.correct ? "correct" : "incorrect") + '"><div class="quiz-review-head"><span>س' + String(index + 1).padStart(2,"0") + '</span><strong>' + (answer.correct ? "إجابة صحيحة" : "إجابة غير صحيحة") + '</strong></div><p>' + esc(question.prompt) + '</p><small>إجابتك: ' + esc(selectedOption ? selectedOption.label : "بدون إجابة") + '</small><small>الإجابة الصحيحة: ' + esc(correctOption ? correctOption.label : "") + '</small><p class="quiz-explanation">' + esc(question.explanation) + '</p></article>';
    }).join("");
    return '<section class="assessment-result"><span class="eyebrow">نتيجة المحاولة · #' + attempt.attemptNumber + '</span><div class="assessment-score ' + (passed ? "pass" : "fail") + '"><strong>' + attempt.score + '%</strong><span>' + attempt.correctCount + ' / ' + attempt.questionCount + ' إجابات صحيحة</span></div><h1>' + (passed ? "اجتزت الاختبار" : "لم تصل إلى حد النجاح بعد") + '</h1><p>' + (passed ? "تم حفظ نجاحك. إعادة الاختبار متاحة، ولن تلغي نتيجة النجاح السابقة." : "الحد المطلوب 80%. يمكنك مراجعة الإجابات والمحاولة مجدداً دون حد أقصى.") + '</p><div class="result-actions"><button class="primary-action" id="retryAssessment">إعادة الاختبار</button><a class="secondary-action" href="#progress">العودة إلى التقدم</a></div></section><section class="quiz-review"><h2>مراجعة الإجابات والتفسير</h2>' + detail + '</section>' + storageNote() + '<p class="assessment-disclaimer">لم تُمنح XP لهذه المحاولة؛ سجل الاختبارات منفصل عن سجل XP وفق قرارات المنتج.</p>';
  }

  function renderAssessmentRoute(id, mount) {
    if (!mount) return;
    mount.innerHTML = assessmentView(id);
    const form = document.getElementById("learningAssessmentForm");
    if (!form) return;
    form.addEventListener("submit", event => {
      event.preventDefault();
      const assessment = getAssessment(id);
      const answers = {};
      for (const question of assessment.questions) {
        const selected = form.querySelector('input[name="' + question.id + '"]:checked');
        if (!selected) {
          const feedback = document.getElementById("quizFeedback");
          if (feedback) feedback.textContent = "لم يتم الإرسال: أجب عن جميع الأسئلة أولاً.";
          const missing = form.querySelector('input[name="' + question.id + '"]');
          if (missing) missing.focus();
          return;
        }
        answers[question.id] = selected.value;
      }
      const result = ENGINE.submitAssessment(assessment, answers);
      if (!result.ok) {
        const feedback = document.getElementById("quizFeedback");
        if (feedback) feedback.textContent = "تعذر تسجيل المحاولة. تحقق من الاختبار وحاول مرة أخرى.";
        return;
      }
      mount.innerHTML = resultView(assessment, result.attempt);
      const retry = document.getElementById("retryAssessment");
      if (retry) retry.addEventListener("click", () => renderAssessmentRoute(id, mount));
    });
  }

  function bindProgressActions() {
    const exportButton = document.getElementById("exportLearningBackup");
    const importInput = document.getElementById("importLearningBackup");
    const resetButton = document.getElementById("resetLearningProgress");
    const feedback = document.getElementById("backupFeedback");
    if (exportButton) exportButton.addEventListener("click", () => {
      const blob = new Blob([ENGINE.exportBackup()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "kpi-academy-learning-backup.json";
      link.click();
      root.setTimeout(() => URL.revokeObjectURL(url), 1500);
      if (feedback) feedback.textContent = "تم تجهيز نسخة احتياطية للتنزيل.";
    });
    if (importInput) importInput.addEventListener("change", async () => {
      const file = importInput.files && importInput.files[0];
      if (!file) return;
      const accepted = root.confirm("ستُستبدل بيانات التعلم الحالية بمحتوى النسخة الاحتياطية. هل تريد المتابعة؟");
      if (!accepted) {
        importInput.value = "";
        return;
      }
      try {
        const text = await file.text();
        const result = ENGINE.importBackup(text);
        if (feedback) feedback.textContent = result.ok
          ? "تم استعادة النسخة الاحتياطية والتحقق من سلامة هيكلها."
          : "تعذر الاستعادة: ملف غير صالح أو إصدار غير مدعوم.";
        if (result.ok) refreshCurrentView();
      } catch (_) {
        if (feedback) feedback.textContent = "تعذر قراءة ملف النسخة الاحتياطية.";
      }
      importInput.value = "";
    });
    if (resetButton) resetButton.addEventListener("click", () => {
      const accepted = root.confirm("سيتم حذف تقدمك ومحاولاتك وسجل XP من هذا الجهاز. هل صدّرت نسخة احتياطية وتريد المتابعة؟");
      if (!accepted) return;
      const result = ENGINE.resetProgress();
      if (feedback) feedback.textContent = result.ok ? "تمت إعادة ضبط بيانات التعلم المحلية." : "تعذر إعادة ضبط البيانات.";
      refreshCurrentView();
    });
  }

  function mountProgressActions() {
    bindProgressActions();
    bindCatalogRetry();
  }

  function bindCatalogRetry() {
    const retry = document.getElementById("retryLearningCatalog");
    if (retry) retry.addEventListener("click", () => {
      loadPromise = null;
      loadError = null;
      retry.disabled = true;
      retry.textContent = root.KPI.i18n[document.documentElement.lang].home.loading;
      loadCatalog().then(ok => {
        if (!ok && retry.isConnected) {
          retry.disabled = false;
          retry.textContent = root.KPI.i18n[document.documentElement.lang].home.retry;
        }
      });
    });
  }

  root.KPI_LEARNING_UI = Object.freeze({
    dashboardSummary,
    settingsView,
    bindCatalogRetry,
    progressView,
    mountLessonPanel,
    renderAssessmentRoute,
    mountProgressActions,
    getCatalog: () => catalog
  });
})(window);
