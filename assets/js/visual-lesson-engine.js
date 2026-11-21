(function (root) {
  "use strict";
  const SCENE_DURATIONS = [9, 11, 11, 12, 13, 12, 11, 11];
  const SCENE_ROLES = [
    { id: "hook", label: "سؤال افتتاحي", kind: "hook", match: /business mystery|mystery|لغز|موقف تجاري|سؤال/i },
    { id: "concept", label: "المفهوم الأساسي", kind: "concept", match: /what is|definition|concept|مفهوم|ما هو|التعريف|المبدأ/i },
    { id: "structure", label: "تفكيك الفكرة", kind: "structure", match: /place value|steps|process|structure|المنزلة|خطوات|مراحل|العناصر/i },
    { id: "worked", label: "مثال تطبيقي", kind: "worked", match: /worked case|worked example|example|مثال|حالة/i },
    { id: "application", label: "تطبيق مهني", kind: "application", match: /hospitality applications|application|تطبيقات|التطبيق العملي/i },
    { id: "mistakes", label: "أخطاء يجب تجنبها", kind: "mistakes", match: /common mistakes|mistakes|أخطاء شائعة|أخطاء/i },
    { id: "challenge", label: "تحدي مهني", kind: "challenge", match: /professional challenge|challenge|التحدي المهني|التحدي/i },
    { id: "recap", label: "الخلاصة", kind: "recap", match: /field checklist|assessment|summary|checklist|التقييم|قائمة التحقق|الخلاصة/i }
  ];
  function plainText(value) {
    return String(value || "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[\x60*_>#|]/g, " ").replace(/\s+/g, " ").trim();
  }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }
  function extractSections(markdown) {
    const lines = String(markdown || "").split(/\r?\n/);
    const sections = [];
    let current = null;
    lines.forEach(line => {
      const heading = line.match(/^#{1,3}\s+(.+?)\s*$/);
      if (heading) {
        if (current) sections.push(current);
        current = { title: plainText(heading[1]), body: [] };
      } else if (current) current.body.push(line);
    });
    if (current) sections.push(current);
    return sections.map((section, index) => ({
      index, title: section.title, text: plainText(section.body.join(" ")).slice(0, 520)
    })).filter(section => section.title);
  }
  function pickSection(sections, role, used, fallbackIndex) {
    const match = sections.find(section => !used.has(section.index) && role.match.test(section.title));
    if (match) { used.add(match.index); return match; }
    const fallback = sections.find(section => !used.has(section.index) && section.text.length > 24) ||
      sections[fallbackIndex % Math.max(sections.length, 1)] ||
      { index: -1, title: role.label, text: "الفكرة الرئيسية لهذا الدرس." };
    used.add(fallback.index);
    return fallback;
  }
  function visualFor(kind, index) {
    const patterns = {
      hook: ["signal", "question", "focus"], concept: ["core", "orbit", "definition"],
      structure: ["layers", "sequence", "flow"], worked: ["calculation", "input", "result"],
      application: ["venue", "decision", "outcome"], mistakes: ["warning", "compare", "correct"],
      challenge: ["target", "steps", "decision"], recap: ["summary", "check", "complete"]
    };
    const options = patterns[kind] || ["focus"];
    return { pattern: options[index % options.length], accent: index % 2 ? "teal" : "blue" };
  }
  function buildStoryboard(input) {
    const source = input || {};
    const sections = extractSections(source.markdown);
    const used = new Set();
    const scenes = SCENE_ROLES.map((role, index) => {
      const section = pickSection(sections, role, used, index);
      return {
        id: role.id, role: role.label, kind: role.kind,
        title: section.title || role.label,
        summary: section.text || "راجع الفكرة الأساسية في هذا الجزء من الدرس.",
        duration: SCENE_DURATIONS[index], sourceSectionIndex: section.index,
        visual: visualFor(role.kind, index)
      };
    });
    return {
      schemaVersion: 1, lessonCode: String(source.code || "LESSON"),
      lessonTitle: plainText(source.title || source.code || "Visual lesson"),
      duration: SCENE_DURATIONS.reduce((sum, value) => sum + value, 0),
      languageModes: ["ar", "en"], generatedBy: "KPI_VISUAL_LESSON_ENGINE", scenes
    };
  }
  function visualMarkup(scene, index) {
    const accent = scene.visual.accent === "teal" ? "#2B9B91" : "#4B83D4";
    const pale = scene.visual.accent === "teal" ? "#DDF3EF" : "#E4EEFC";
    const label = escapeHtml(scene.role);
    const n = index + 1;
    const shapes = {
      hook: '<circle cx="480" cy="250" r="108" fill="' + pale + '"/><circle cx="480" cy="250" r="72" fill="none" stroke="' + accent + '" stroke-width="10" stroke-dasharray="280 180" transform="rotate(-90 480 250)"/><path d="M480 170V250L540 292" fill="none" stroke="#17324D" stroke-width="12" stroke-linecap="round"/><circle cx="480" cy="250" r="12" fill="' + accent + '"/>',
      concept: '<rect x="270" y="145" width="420" height="210" rx="28" fill="' + pale + '"/><rect x="315" y="190" width="330" height="24" rx="12" fill="' + accent + '" opacity=".9"/><rect x="315" y="238" width="245" height="16" rx="8" fill="#8CA3BC"/><rect x="315" y="272" width="285" height="16" rx="8" fill="#B7C6D7"/><circle cx="630" cy="318" r="24" fill="' + accent + '"/>',
      structure: '<rect x="230" y="150" width="500" height="70" rx="18" fill="' + pale + '"/><rect x="300" y="250" width="360" height="70" rx="18" fill="' + accent + '" opacity=".9"/><path d="M480 220V245m-10-10 10 10 10-10" fill="none" stroke="#17324D" stroke-width="8" stroke-linecap="round"/><path d="M480 320V355m-10-10 10 10 10-10" fill="none" stroke="#17324D" stroke-width="8" stroke-linecap="round"/>',
      worked: '<rect x="220" y="175" width="190" height="145" rx="20" fill="' + pale + '"/><rect x="550" y="175" width="190" height="145" rx="20" fill="#E7F5F1"/><path d="M425 248H535m-18-18 18 18-18 18" fill="none" stroke="' + accent + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="315" cy="248" r="28" fill="' + accent + '"/><circle cx="645" cy="248" r="28" fill="#2B9B91"/>',
      application: '<path d="M240 330V210L480 120 720 210V330" fill="' + pale + '" stroke="' + accent + '" stroke-width="10" stroke-linejoin="round"/><rect x="315" y="235" width="110" height="95" rx="12" fill="#fff"/><rect x="535" y="235" width="110" height="95" rx="12" fill="#fff"/><path d="M480 165V325" stroke="' + accent + '" stroke-width="8" stroke-dasharray="12 12"/>',
      mistakes: '<path d="M480 125 690 355H270Z" fill="#FFF1D8" stroke="#D89A36" stroke-width="10" stroke-linejoin="round"/><path d="M480 205V275" stroke="#A76D19" stroke-width="16" stroke-linecap="round"/><circle cx="480" cy="315" r="10" fill="#A76D19"/>',
      challenge: '<circle cx="480" cy="250" r="135" fill="none" stroke="' + pale + '" stroke-width="28"/><circle cx="480" cy="250" r="92" fill="none" stroke="' + accent + '" stroke-width="22"/><circle cx="480" cy="250" r="48" fill="#17324D"/><path d="M480 250 590 140" stroke="' + accent + '" stroke-width="12" stroke-linecap="round"/>',
      recap: '<rect x="280" y="145" width="400" height="220" rx="24" fill="' + pale + '"/><path d="m345 225 28 28 52-60M345 300l28 28 52-60" fill="none" stroke="' + accent + '" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><rect x="465" y="205" width="165" height="16" rx="8" fill="#8CA3BC"/><rect x="465" y="280" width="135" height="16" rx="8" fill="#8CA3BC"/>'
    };
    return '<svg class="vle-visual vle-visual--' + scene.kind + '" viewBox="0 0 960 500" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="vle-bg-' + n + '" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F7FAFE"/><stop offset="1" stop-color="#EAF1F8"/></linearGradient></defs><rect width="960" height="500" rx="32" fill="url(#vle-bg-' + n + ')"/><g class="vle-orbit" fill="none" stroke="#C9D7E6" stroke-width="2"><circle cx="480" cy="250" r="190" stroke-dasharray="4 14"/><circle cx="480" cy="250" r="225" stroke-dasharray="2 18"/></g><g class="vle-shapes">' + shapes[scene.kind] + '</g><text x="480" y="435" text-anchor="middle" fill="#60758C" font-family="Arial,sans-serif" font-size="18" letter-spacing="4">KPI ACADEMY · VISUAL LEARNING</text></svg>';
  }
  function mount(container, input) {
    if (!container) return null;
    const storyboard = buildStoryboard(input);
    let active = 0, remaining = storyboard.scenes[0].duration, timer = null;
    container.innerHTML = '<section class="vle-panel" aria-labelledby="vle-title" data-vle-root>' +
      '<div class="vle-heading"><div><span class="vle-eyebrow">KPI ACADEMY · VISUAL LESSON</span><h2 id="vle-title">الفيديو التعليمي التوضيحي</h2><p>تم إنشاء مخطط بصري تلقائياً من محتوى الدرس.</p></div><span class="vle-status">STORYBOARD READY</span></div>' +
      '<div class="vle-stage" data-vle-stage aria-live="polite"></div>' +
      '<div class="vle-scene-copy"><div><span data-vle-count>المشهد 1 من 8</span><h3 data-vle-scene-title></h3><p data-vle-summary></p></div><strong data-vle-time>00:09</strong></div>' +
      '<div class="vle-progress" role="progressbar" aria-label="تقدم معاينة الفيديو" aria-valuemin="0" aria-valuemax="8" aria-valuenow="1"><i data-vle-progress></i></div>' +
      '<div class="vle-timeline" data-vle-timeline></div>' +
      '<div class="vle-controls"><button type="button" data-vle-action="previous" aria-label="المشهد السابق">السابق</button><button type="button" class="vle-play" data-vle-action="play">▶ تشغيل المعاينة</button><button type="button" data-vle-action="next" aria-label="المشهد التالي">التالي</button></div>' +
      '<p class="vle-disclosure">هذه معاينة حركة ومخطط مشاهد داخل الدرس، وليست ملف MP4 نهائياً. التوليد الصوتي والتصدير النهائي يحتاجان إلى خدمة إنتاج خلفية آمنة، وسيتم ربطهما في المرحلة التالية.</p></section>';
    const rootNode = container.querySelector("[data-vle-root]");
    const stage = rootNode.querySelector("[data-vle-stage]");
    const title = rootNode.querySelector("[data-vle-scene-title]");
    const summary = rootNode.querySelector("[data-vle-summary]");
    const count = rootNode.querySelector("[data-vle-count]");
    const time = rootNode.querySelector("[data-vle-time]");
    const progress = rootNode.querySelector("[data-vle-progress]");
    const progressBar = rootNode.querySelector('[role="progressbar"]');
    const timeline = rootNode.querySelector("[data-vle-timeline]");
    const playButton = rootNode.querySelector('[data-vle-action="play"]');
    timeline.innerHTML = storyboard.scenes.map((scene, index) =>
      '<button type="button" data-vle-scene="' + index + '" aria-label="الانتقال إلى ' + escapeHtml(scene.role) + '"><span>' + String(index + 1).padStart(2, "0") + '</span><small>' + escapeHtml(scene.role) + '</small></button>'
    ).join("");
    function stop() {
      if (timer) root.clearInterval(timer);
      timer = null;
      playButton.textContent = "▶ تشغيل المعاينة";
      playButton.dataset.vleAction = "play";
    }
    function renderScene() {
      const scene = storyboard.scenes[active];
      stage.innerHTML = visualMarkup(scene, active);
      title.textContent = scene.title;
      summary.textContent = scene.summary || "الفكرة الأساسية في هذا الجزء من الدرس.";
      count.textContent = "المشهد " + (active + 1) + " من " + storyboard.scenes.length + " · " + scene.role;
      time.textContent = "00:" + String(remaining).padStart(2, "0");
      progress.style.width = ((active + 1) / storyboard.scenes.length * 100) + "%";
      progressBar.setAttribute("aria-valuenow", String(active + 1));
      Array.from(timeline.querySelectorAll("button")).forEach((button, index) => {
        button.classList.toggle("is-active", index === active);
        button.setAttribute("aria-current", index === active ? "step" : "false");
      });
    }
    function goTo(index) {
      active = Math.max(0, Math.min(storyboard.scenes.length - 1, index));
      remaining = storyboard.scenes[active].duration;
      renderScene();
    }
    function play() {
      if (timer) { stop(); return; }
      if (active === storyboard.scenes.length - 1 && remaining === 0) goTo(0);
      playButton.textContent = "Ⅱ إيقاف المعاينة";
      playButton.dataset.vleAction = "pause";
      timer = root.setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          if (active >= storyboard.scenes.length - 1) {
            remaining = 0; renderScene(); stop(); return;
          }
          goTo(active + 1);
        } else renderScene();
      }, 1000);
    }
    rootNode.addEventListener("click", event => {
      const button = event.target.closest("[data-vle-action], [data-vle-scene]");
      if (!button) return;
      if (button.hasAttribute("data-vle-scene")) {
        stop(); goTo(Number(button.dataset.vleScene)); return;
      }
      const action = button.dataset.vleAction;
      if (action === "play" || action === "pause") play();
      if (action === "previous") { stop(); goTo(active - 1); }
      if (action === "next") { stop(); goTo(active + 1); }
    });
    renderScene();
    return { storyboard, goTo, destroy: stop };
  }
  root.KPI_VISUAL_LESSON_ENGINE = { version: "0.1.0", buildStoryboard, extractSections, mount };
})(window);
