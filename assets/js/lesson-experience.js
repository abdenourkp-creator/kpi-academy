(function (root) {
  "use strict";

  const TASKS = [
    {
      id: "food-cost",
      type: "number",
      step: "01",
      title: "احسب Food Cost %",
      prompt: "بلغت تكلفة الطعام 12,000 MAD، بينما صافي مبيعات الطعام 40,000 MAD. ما نسبة Food Cost؟",
      formula: "Food COGS ÷ Food Net Sales × 100",
      expected: 30,
      tolerance: 0.01,
      expectedLabel: "30%",
      explanation: "12,000 ÷ 40,000 × 100 = 30%. كل 100 MAD من صافي مبيعات الطعام تقابلها 30 MAD من تكلفة الطعام."
    },
    {
      id: "beverage-cost",
      type: "choice",
      step: "02",
      title: "تحقق من Beverage Cost %",
      prompt: "تكلفة المشروبات 5,000 MAD، وصافي مبيعات المشروبات 20,000 MAD. أي نتيجة صحيحة؟",
      formula: "Beverage COGS ÷ Beverage Net Sales × 100",
      options: [
        { id: "a", text: "5%" },
        { id: "b", text: "25%" },
        { id: "c", text: "40%" },
        { id: "d", text: "75%" }
      ],
      correct: "b",
      expectedLabel: "25%",
      explanation: "5,000 ÷ 20,000 × 100 = 25%. لا تستخدم مبيعات الطعام في مقام تكلفة المشروبات؛ يجب أن تتطابق قاعدة التكلفة مع قاعدة المبيعات."
    },
    {
      id: "combined-cogs",
      type: "number",
      step: "03",
      title: "احسب النسبة المجمّعة للقسمين",
      prompt: "اجمع تكلفة الطعام والمشروبات أولاً، ثم اقسمها على إجمالي صافي مبيعات القسمين. أدخل النسبة المئوية.",
      formula: "(12,000 + 5,000) ÷ (40,000 + 20,000) × 100",
      expected: 28.3333333333,
      tolerance: 0.02,
      expectedLabel: "28.33%",
      explanation: "إجمالي COGS = 17,000، وإجمالي المبيعات = 60,000. النتيجة 28.33%. هذا متوسط مرجّح بأحجام المبيعات، وليس متوسطاً حسابياً بسيطاً لـ30% و25%."
    },
    {
      id: "labor-cost",
      type: "number",
      step: "04",
      title: "اختر قاعدة Labor Cost الصحيحة",
      prompt: "تكلفة العمالة 15,000 MAD، والفريق يخدم قسمي الطعام والمشروبات. على أساس المبيعات المجمّعة البالغة 60,000 MAD، ما Labor Cost %؟",
      formula: "Labor Cost ÷ Combined F&B Net Sales × 100",
      expected: 25,
      tolerance: 0.01,
      expectedLabel: "25%",
      explanation: "15,000 ÷ 60,000 × 100 = 25%. استخدام Food Sales وحدها يعطي 37.5%، لكنه مقام غير متوافق مع نطاق العمالة في هذا المثال."
    },
    {
      id: "interpretation",
      type: "choice",
      step: "05",
      title: "من النسبة إلى القرار الإداري",
      prompt: "المطعم A يحقق مبيعات 20,000 MAD وتكلفة 4,000 MAD. المطعم B يحقق مبيعات 100,000 MAD وتكلفة 30,000 MAD. ما الاستنتاج الأكثر دقة؟",
      formula: "Gross Profit after COGS = Sales − COGS",
      options: [
        { id: "a", text: "A أفضل بالتأكيد لأن Food Cost لديه أقل." },
        { id: "b", text: "B يحقق Gross Profit أعلى بعد COGS، لكن لا تكفي هذه البيانات للحكم على الأداء الكلي." },
        { id: "c", text: "A وB يحققان الربح نفسه لأننا نقارن النسب فقط." },
        { id: "d", text: "لا يمكن حساب Gross Profit من هذه البيانات." }
      ],
      correct: "b",
      expectedLabel: "الخيار B",
      explanation: "A يحقق 16,000 MAD بعد COGS، بينما B يحقق 70,000 MAD. لكن الحكم الإداري يحتاج أيضاً إلى العمالة والإيجار والجودة ومزيج المبيعات وعوامل أخرى. النسبة الأقل لا تعني تلقائياً ربحاً أعلى."
    }
  ];

  function calculatePercent(part, whole) {
    const numerator = Number(part);
    const denominator = Number(whole);
    if (!Number.isFinite(numerator) || !Number.isFinite(denominator) ||
        numerator < 0 || denominator <= 0) return null;
    return numerator / denominator * 100;
  }

  function evaluateAnswer(taskId, answer) {
    const task = TASKS.find(item => item.id === taskId);
    if (!task) return { valid: false, correct: false, message: "المهمة غير معروفة." };

    if (task.type === "number") {
      const raw = String(answer == null ? "" : answer).trim().replace(",", ".");
      if (!raw) return { valid: false, correct: false, message: "أدخل قيمة قبل التحقق." };
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 0) {
        return { valid: false, correct: false, message: "أدخل رقماً صالحاً موجباً أو صفراً." };
      }
      const correct = Math.abs(value - task.expected) <= task.tolerance;
      return {
        valid: true,
        correct,
        expectedLabel: task.expectedLabel,
        explanation: task.explanation,
        message: correct ? "صحيح. انتقل إلى المهمة التالية." : "ليست هذه النتيجة. راجع البسط والمقام ثم قارن بالحل."
      };
    }

    const correct = String(answer || "") === task.correct;
    return {
      valid: !!answer,
      correct,
      expectedLabel: task.expectedLabel,
      explanation: task.explanation,
      message: !answer ? "اختر إجابة أولاً." : correct ? "اختيار صحيح. اقرأ سبب صحة الاستنتاج." : "هذا الاختيار لا يعبّر عن النتيجة كاملة. راجع التفسير."
    };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function cardMarkup(task) {
    let control = "";
    if (task.type === "number") {
      control = '<div class="le-answer-row"><label for="le-answer-' + task.id + '">إجابتك (%)</label>' +
        '<div class="le-number-input"><input id="le-answer-' + task.id + '" data-answer type="number" min="0" step="any" inputmode="decimal" placeholder="مثلاً 30"><span>%</span></div></div>';
    } else {
      control = '<fieldset class="le-options"><legend>اختر الإجابة الأنسب</legend>' +
        task.options.map(option => '<label class="le-option"><input type="radio" name="le-' + task.id + '" value="' + option.id + '" data-answer><span>' + escapeHtml(option.text) + '</span></label>').join("") +
        '</fieldset>';
    }
    return '<article class="le-task-card" data-task-id="' + task.id + '">' +
      '<div class="le-task-top"><span class="le-step">المهمة ' + task.step + '</span><span class="le-task-kind">' + (task.type === "number" ? "حساب" : "تفسير") + '</span></div>' +
      '<h4>' + escapeHtml(task.title) + '</h4><p class="le-question">' + escapeHtml(task.prompt) + '</p>' +
      '<div class="le-formula" dir="ltr">' + escapeHtml(task.formula) + '</div>' + control +
      '<div class="le-task-actions"><button type="button" class="le-check-button" data-check="' + task.id + '">تحقق من الإجابة</button><span class="le-feedback" data-feedback role="status" aria-live="polite"></span></div>' +
      '</article>';
  }

  function mount(code, container) {
    if (code !== "BM-005" || !container) return false;
    const checked = Object.create(null);
    function renderMarkup() {
      container.innerHTML =
      '<section class="lesson-lab" aria-labelledby="lesson-lab-title">' +
        '<div class="le-hero"><div><span class="le-kicker">مختبر تطبيقي · BUSINESS MATHEMATICS</span><h3 id="lesson-lab-title">حوّل النسب إلى قراءة تشغيلية</h3><p>استخدم بيانات المثال نفسها، ثم احسب النسب وافهم ما تقوله وما لا تقوله.</p></div><div class="le-score"><strong data-score>0/5</strong><span>إجابات صحيحة</span></div></div>' +
        '<div class="le-data-grid" aria-label="بيانات الحالة">' +
          '<div><span>Food Sales</span><strong>40,000 <small>MAD</small></strong></div>' +
          '<div><span>Food COGS</span><strong>12,000 <small>MAD</small></strong></div>' +
          '<div><span>Beverage Sales</span><strong>20,000 <small>MAD</small></strong></div>' +
          '<div><span>Beverage COGS</span><strong>5,000 <small>MAD</small></strong></div>' +
          '<div><span>Labor Cost</span><strong>15,000 <small>MAD</small></strong></div>' +
        '</div>' +
        '<div class="le-progress"><div class="le-progress-copy"><strong>تقدم المختبر</strong><span data-progress-text>لم تتحقق من أي مهمة بعد</span></div><div class="le-progress-track" role="progressbar" aria-label="تقدم المختبر" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0"><i data-progress-fill></i></div></div>' +
        '<div class="le-task-list">' + TASKS.map(cardMarkup).join("") + '</div>' +
        '<div class="le-insight" data-insight role="status" aria-live="polite">ابدأ بالمهمة الأولى. لا تتعجل: حدّد دائماً ما الذي تقيسه، ثم اختر المقام المناسب.</div>' +
        '<div class="le-footer"><p>هذا المختبر تدريب تعليمي داخل الدرس. نتائجه لا تُسجّل كتقييم رسمي، ولا تمنح XP، ولا تستبدل أدلة إكمال الدرس الأربعة.</p><button type="button" class="le-reset-button" data-reset>إعادة المختبر</button></div>' +
      '</section>';
    }
    renderMarkup();

    function updateProgress() {
      const ids = Object.keys(checked);
      const correct = ids.filter(id => checked[id].correct).length;
      const total = TASKS.length;
      const score = container.querySelector("[data-score]");
      const progressText = container.querySelector("[data-progress-text]");
      const fill = container.querySelector("[data-progress-fill]");
      const bar = container.querySelector('[role="progressbar"]');
      if (score) score.textContent = correct + "/" + total;
      if (progressText) progressText.textContent = ids.length + " من " + total + " مهام تم التحقق منها";
      if (fill) fill.style.width = (ids.length / total * 100) + "%";
      if (bar) bar.setAttribute("aria-valuenow", String(ids.length));
      const insight = container.querySelector("[data-insight]");
      if (insight && ids.length === total) {
        insight.textContent = correct === total
          ? "أحسنت. أجبت عن المهام الخمس بشكل صحيح. الخطوة الأهم الآن: اشرح لماذا لا تكفي نسبة واحدة للحكم على أداء المطعم."
          : "أكملت التحقق من المهام. راجع التفسيرات في الإجابات التي أخطأت فيها، ثم أعد المحاولة لترسيخ الفكرة.";
      }
    }

    container.addEventListener("click", function (event) {
      const reset = event.target.closest("[data-reset]");
      if (reset) {
        Object.keys(checked).forEach(key => delete checked[key]);
        renderMarkup();
        updateProgress();
        return;
      }

      const button = event.target.closest("[data-check]");
      if (!button) return;
      const taskId = button.dataset.check;
      const card = button.closest("[data-task-id]");
      if (!card) return;
      const task = TASKS.find(item => item.id === taskId);
      let answer = "";
      if (task.type === "number") {
        const input = card.querySelector("[data-answer]");
        answer = input ? input.value : "";
      } else {
        const selected = card.querySelector("input[data-answer]:checked");
        answer = selected ? selected.value : "";
      }

      const result = evaluateAnswer(taskId, answer);
      const feedback = card.querySelector("[data-feedback]");
      if (!result.valid) {
        if (feedback) {
          feedback.className = "le-feedback is-warning";
          feedback.textContent = result.message;
        }
        return;
      }

      checked[taskId] = result;
      if (feedback) {
        feedback.className = "le-feedback " + (result.correct ? "is-correct" : "is-incorrect");
        feedback.innerHTML = '<strong>' + (result.correct ? "إجابة صحيحة" : "راجع هذه الخطوة") + '</strong>' +
          '<span>' + escapeHtml(result.message) + '</span>' +
          '<small>النتيجة المعتمدة: <b dir="ltr">' + escapeHtml(result.expectedLabel) + '</b></small>' +
          '<span class="le-explanation">' + escapeHtml(result.explanation) + '</span>';
      }
      updateProgress();
    });

    container.addEventListener("input", function (event) {
      const card = event.target.closest("[data-task-id]");
      if (!card) return;
      const id = card.dataset.taskId;
      if (checked[id]) delete checked[id];
      const feedback = card.querySelector("[data-feedback]");
      if (feedback) {
        feedback.className = "le-feedback";
        feedback.textContent = "";
      }
      updateProgress();
    });
    container.addEventListener("change", function (event) {
      const card = event.target.closest("[data-task-id]");
      if (!card) return;
      const id = card.dataset.taskId;
      if (checked[id]) delete checked[id];
      const feedback = card.querySelector("[data-feedback]");
      if (feedback) {
        feedback.className = "le-feedback";
        feedback.textContent = "";
      }
      updateProgress();
    });

    return true;
  }

  root.KPI_LESSON_EXPERIENCE = Object.freeze({
    mount,
    calculatePercent,
    evaluateAnswer,
    taskCount: TASKS.length
  });
})(window);
