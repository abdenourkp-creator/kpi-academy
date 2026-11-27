(function (root) {
  "use strict";

  const clipInfo = {
    "BM-001": ["فهم الأعداد في تقرير المطعم", "10 ثوانٍ", "المبيعات 12,000 درهم، وعدد الضيوف 80. اقسم المبيعات على الضيوف لتحصل على متوسط إنفاق قدره 150 درهمًا."],
    "BM-005": ["من تكلفة الطعام إلى هامش الربح", "15 ثانية", "صافي المبيعات 42,000 درهم والتكلفة 12,600 درهم. التكلفة تمثل 30% من المبيعات. مجمل الربح 29,400 درهم وهامشه 70%."]
  };

  function clip(code) {
    const info = clipInfo[code];
    if (!info) return "";
    return '<section class="sprint-clip" id="lesson-video" aria-label="فيديو الدرس">' +
      '<div class="sprint-clip-head"><h2>' + info[0] + '</h2><span>' + info[1] + '</span></div>' +
      '<video controls playsinline preload="none" aria-label="' + info[0] + '">' +
      '<source src="assets/video/' + code.toLowerCase() + '.mp4" type="video/mp4">' +
      '<a href="assets/video/' + code.toLowerCase() + '.mp4">تحميل المقطع</a></video>' +
      '<details><summary>النص المكتوب للمقطع</summary><p>' + info[2] + '</p></details></section>';
  }

  function quickLinks(copy, isEnglish) {
    const links = [
      ["modules", "modules", "الوحدات التعليمية", "Modules"],
      ["calculator", "tools", "حاسبة المؤشرات", "KPI Calculator"],
      ["analytics", "analytics", "مختبر التحليل", "Analytics Lab"],
      ["lesson-BM-005?tab=lab", "tools", "حالة تطبيقية", "Practical Case"],
      ["simulator", "simulator", "محاكاة الإدارة", "Simulator"],
      ["progress", "progress", "التقييم والتقدم", "Assessments & Progress"]
    ];
    return `<section aria-labelledby="home-tools-title">
      <div class="ka-home-heading"><h2 id="home-tools-title">${copy.toolTitle}</h2></div>
      <nav class="sprint-shortcuts" aria-labelledby="home-tools-title">${links.map(([route, icon, label, english]) =>
        `<a href="#${route}"><svg aria-hidden="true"><use href="#ka-icon-${icon}"/></svg>
          <strong>${isEnglish ? english : label}</strong>${isEnglish ? "" : `<small lang="en" dir="ltr">${english}</small>`}</a>`).join("")}</nav>
    </section>`;
  }

  function learningRoute(curriculum, progress, translate, escape, copy) {
    function chapterRow(chapter) {
      const { lessons, number, title } = chapter;
      const done = lessons.filter(lesson => progress[lesson.code]?.status === "completed").length;
      const started = lessons.find(lesson => progress[lesson.code]?.status === "in-progress");
      const next = started || lessons.find(lesson => progress[lesson.code]?.status !== "completed");
      const status = !lessons.length ? copy.noLessons : !next ? copy.done : started || done ? copy.started : copy.unstarted;
      const label = escape(translate(title));
      const review = next || lessons[0];
      return `<li>
        <span class="ka-chapter-index" aria-label="${copy.chapter} ${escape(String(number))}">${escape(String(number).padStart(2, "0"))}</span>
        <div class="ka-route-topic"><strong>${label}</strong><small>${status} · <bdi dir="ltr">${done} / ${lessons.length}</bdi></small>
          ${lessons.length ? `<progress aria-label="${copy.chapterProgress} · ${label}" value="${done}" max="${lessons.length}"></progress>` : ""}</div>
        ${review ? `<a href="#lesson-${escape(review.code)}" aria-label="${next ? copy.open : copy.review} ${escape(review.code)} · ${label}"><span aria-hidden="true">${copy.arrow}</span></a>` : ""}
      </li>`;
    }
    return `<section class="sprint-route" aria-labelledby="sprint-route-title">
      <div class="ka-home-heading"><h2 id="sprint-route-title">${copy.chapters}</h2><a href="#module-business-mathematics">${copy.showLessons} ${copy.arrow}</a></div>
      ${curriculum.chapters.length ? `<ol>${curriculum.chapters.map(chapterRow).join("")}</ol>` : `<p>${copy.noChapters}</p>`}
    </section>`;
  }

  function overview(curriculum, translate, escape, language = "ar") {
    const copy = root.KPI.i18n[language].home;
    const engine = root.KPI_LEARNING_ENGINE;
    const stats = engine.getDashboard();
    const lessons = curriculum.chapters.flatMap(chapter => chapter.lessons.map(lesson => ({ ...lesson, chapter })));
    const progress = engine.getState().lessonProgress;
    const next = lessons.filter(lesson => progress[lesson.code]?.status === "in-progress")
      .sort((a, b) => (progress[b.code].updatedAt || "").localeCompare(progress[a.code].updatedAt || ""))[0] ||
      lessons.find(lesson => progress[lesson.code]?.status !== "completed");
    const pct = stats.totalLessons > 0 ? Math.round(stats.completedLessons / stats.totalLessons * 100) : 0;
    const empty = lessons.length === 0;
    const target = next ? "#lesson-" + next.code : empty ? "#modules" : "#progress";
    const title = next ? translate(next.title.replace(/^BM-\d+ — /, "")) : empty ? copy.empty : copy.results;
    const evidence = next ? engine.getLessonProgress(next.code).evidence : null;
    const evidenceCount = evidence ? ["interactiveLab", "professionalChallenge", "fieldChecklist", "learnerAttested"]
      .filter(key => evidence[key] === true).length : 0;
    const lessonContext = next ? `<p class="ka-resume-context">${copy.math} · ${copy.chapter} ${escape(String(next.chapter.number))}${language === "en" ? " · Taught in Arabic" : ""}</p>` : "";
    const lessonEvidence = next ? `<div class="ka-resume-evidence"><span>${copy.evidence} <bdi dir="ltr">${evidenceCount} / 4</bdi></span>
      <progress aria-label="${copy.meter}" value="${evidenceCount}" max="4"></progress></div>` : "";
    let currentLabel = empty ? copy.curriculum : copy.finished;
    if (next) currentLabel = progress[next.code]?.status === "in-progress" ? copy.return : copy.next;
    return `<div class="sprint-overview">
      <div class="ka-current-learning">
        <article class="sprint-resume">
          <div class="ka-resume-heading"><strong>${currentLabel}</strong>${next ? `<bdi class="sprint-code">${escape(next.code)}</bdi>` : ""}</div>
          <h2>${escape(title)}</h2>${lessonContext}${lessonEvidence}
          <div class="ka-resume-actions"><a class="sprint-primary" href="${target}">${next ? copy.continue : empty ? copy.modules : copy.seeResults} ${copy.arrow}</a>
          ${next && clipInfo[next.code] ? `<a class="sprint-video-link" href="${target}?tab=video">${copy.video}</a>` : ""}</div>
        </article>
        <section class="ka-home-score" aria-labelledby="home-progress-title">
          <div class="ka-home-heading"><h2 id="home-progress-title">${copy.yourProgress}</h2><a href="#progress">${copy.details}</a></div>
          <div class="ka-home-metrics">
            <div class="sprint-ring" style="--value:${pct}%"><div><strong dir="ltr">${pct}%</strong><span>${copy.total}</span></div></div>
            <dl><div><dt>${copy.xp}</dt><dd><bdi dir="ltr">${stats.earnedXp.toLocaleString("en-US")} XP</bdi></dd></div>
            <div><dt>${copy.completed}</dt><dd><bdi dir="ltr">${stats.completedLessons} / ${stats.totalLessons}</bdi></dd></div>
            <div><dt>${copy.passed}</dt><dd><bdi dir="ltr">${stats.passedAssessments} / ${stats.totalAssessments}</bdi></dd></div></dl>
          </div>
        </section>
      </div>
      ${quickLinks(copy, language === "en")}${learningRoute(curriculum, progress, translate, escape, copy)}
    </div>`;
  }

  function lessonProgress() {
    const stats = root.KPI_LEARNING_ENGINE.getDashboard();
    const percent = stats.totalLessons > 0 ? Math.round(stats.completedLessons / stats.totalLessons * 100) : 0;
    return '<div class="sprint-lesson-progress"><span>دروس مكتملة</span><progress aria-label="تقدم الدروس" max="' +
      Math.max(1, stats.totalLessons) + '" value="' + stats.completedLessons + '"></progress><strong dir="ltr">' +
      stats.completedLessons + ' / ' + stats.totalLessons + ' · ' + percent + '%</strong></div>';
  }

  function grossMargin() {
    return '<section class="sprint-gross" aria-labelledby="gross-title">' +
      '<div class="sprint-case"><img src="assets/photos/coastal-hotel.webp" alt="">' +
      '<div><span class="sprint-code">Gross Profit &amp; Gross Profit Margin</span><h2 id="gross-title">هامش الربح الإجمالي</h2>' +
      '<p>حقق مطعم فندق ساحلي خلال أسبوع صافي مبيعات طعام قدره <bdi>42,000 MAD</bdi>، وبلغت تكلفة الطعام <bdi>12,600 MAD</bdi>. احسب مجمل الربح وهامشه.</p></div></div>' +
      '<div class="sprint-gross-calculator"><h3>حاسبة هامش الربح</h3><div class="sprint-inputs">' +
      '<label>صافي مبيعات الطعام (MAD)<input data-gross-sales type="number" min="0" step="0.01" value="42000" dir="ltr"></label>' +
      '<label>تكلفة الطعام (MAD)<input data-gross-cost type="number" min="0" step="0.01" value="12600" dir="ltr"></label></div>' +
      '<div class="sprint-score" aria-live="polite"><div class="sprint-ring" data-margin-ring><div><strong dir="ltr" data-margin-value></strong><span>هامش الربح</span></div></div>' +
      '<div><span>مجمل الربح</span><strong class="sprint-profit" dir="ltr" data-gross-profit></strong><small dir="ltr" data-gross-formula></small></div></div>' +
      '<p data-gross-insight role="status"></p></div></section>';
  }

  function mountGross(container) {
    const card = container.querySelector(".sprint-gross");
    if (!card) return;
    const get = selector => card.querySelector(selector);
    const salesInput = get("[data-gross-sales]");
    const costInput = get("[data-gross-cost]");
    const context = { period: "Week", scope: "Food", currency: "MAD" };
    const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

    function update() {
      const netSales = salesInput.value;
      const cogs = costInput.value;
      const result = root.KPIEngine.calculate("gross-profit", { netSales, cogs }, context);
      const valid = result.ok && Number.isFinite(result.result);
      const margin = valid && Number(netSales) > 0 ? result.result / Number(netSales) * 100 : NaN;
      const hasMargin = Number.isFinite(margin);
      const percent = hasMargin ? margin.toFixed(1) + "%" : "—";
      get("[data-margin-ring]").style.setProperty("--value", hasMargin ? Math.max(0, Math.min(100, margin)) + "%" : "0%");
      get("[data-margin-value]").textContent = percent;
      get("[data-gross-profit]").textContent = valid ? money.format(result.result) + " MAD" : "—";
      get("[data-gross-formula]").textContent = valid ? money.format(Number(netSales)) + " − " + money.format(Number(cogs)) + " = " + money.format(result.result) : "";
      get("[data-gross-insight]").textContent = !valid ? "أدخل رقمين صالحين وغير سالبين." :
        !hasMargin ? "يتعذّر حساب هامش الربح عندما تكون المبيعات صفرًا." :
        margin < 0 ? "تكلفة الطعام أعلى من صافي المبيعات. تحقّق من الهدر والمخزون وتطابق فترة القياس." :
        "من كل 100 درهم من صافي المبيعات، يبقى " + money.format(margin) + " درهم بعد تكلفة الطعام. قارن النتيجة بهدف المطعم وبالفترة نفسها.";
    }

    salesInput.addEventListener("input", update);
    costInput.addEventListener("input", update);
    update();
  }

  function mountLesson(container, tab) {
    const controls = container.querySelector(".sprint-lesson-controls");
    if (!controls) return;
    const body = container.querySelector(".lesson-body");
    const destinations = {
      explain: body,
      lab: container.querySelector(".sprint-gross, [id^=bm00][id$=LabMount], #percentageLabMount, .ka-lesson-section--lab"),
      challenge: container.querySelector(".ka-lesson-section--challenge"),
      checklist: container.querySelector(".ka-lesson-section--checklist"),
      video: container.querySelector(".sprint-clip")
    };
    for (const button of controls.querySelectorAll("button")) {
      const target = destinations[button.dataset.section];
      if (!target) {
        button.remove();
        continue;
      }
      button.addEventListener("click", () => {
        controls.querySelectorAll("button").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
        target.scrollIntoView({ block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    }
    if (tab && destinations[tab]) controls.querySelector('[data-section="' + tab + '"]')?.click();
  }

  function lessonControls() {
    return '<nav class="sprint-lesson-controls" aria-label="أقسام الدرس">' +
      [["explain", "الشرح"], ["lab", "المختبر التطبيقي"], ["challenge", "التحدي المهني"], ["checklist", "قائمة التحقق"], ["video", "الفيديو"]]
        .map(([id, label]) => '<button type="button" data-section="' + id + '" aria-pressed="' + (id === "explain") + '">' + label + '</button>').join("") +
      '</nav>';
  }

  root.KPI_SPRINT = Object.freeze({ overview, clip, grossMargin, lessonControls, lessonProgress, mountGross, mountLesson });
})(window);
