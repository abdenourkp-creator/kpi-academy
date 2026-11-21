(function (root) {
  "use strict";

  const tasks = [
    { id:"unit-difference", type:"number", title:"1 · اقرأ الفرق بدقة", prompt:"يعرض النظام 14.50 MAD وتعرض فاتورة المورد 14.05 MAD. ما الفرق لكل زجاجة؟", expected:0.45, tolerance:0.001, unit:"MAD", explanation:"14.50 − 14.05 = 0.45 MAD. انتبه إلى موضع الرقم 5 بعد الفاصلة؛ اختلاف المنزلة يغيّر القيمة." },
    { id:"quantity-impact", type:"number", title:"2 · حوّل الفرق إلى أثر مالي", prompt:"إذا كان فرق السعر 0.45 MAD واشترى الفندق 600 زجاجة، فما الفرق الإجمالي؟", expected:270, tolerance:0.001, unit:"MAD", explanation:"0.45 × 600 = 270 MAD. نضرب فرق الوحدة في عدد الوحدات." },
    { id:"annual-impact", type:"number", title:"3 · فكّر في التكرار", prompt:"إذا تكرر الأثر نفسه أسبوعياً لمدة 52 أسبوعاً، فما الأثر السنوي؟", expected:14040, tolerance:0.01, unit:"MAD", explanation:"270 × 52 = 14,040 MAD. الخطأ الصغير يصبح مهماً عندما يتكرر على حجم كبير." },
    { id:"unit-validation", type:"choice", title:"4 · اختبر منطق الوحدات", prompt:"أي عملية لا يمكن تنفيذها مباشرة دون تحويل أو معلومة إضافية؟", options:[["a","2 kg + 500 g"],["b","2 kg + 500 ml"],["c","24 bottles × 8.50 MAD"]], correct:"b", explanation:"kg وحدة كتلة وml وحدة حجم؛ لا تجمعهما مباشرة. تحتاج إلى علاقة كثافة أو تحويل مناسب للمادة." },
    { id:"source-validation", type:"choice", title:"5 · اختر الإجراء المهني", prompt:"قبل تعديل سعر Tonic Water في النظام، ما الإجراء الأكثر مسؤولية؟", options:[["a","تعديل السعر فوراً اعتماداً على الذاكرة"],["b","اعتماد السعر الأعلى لتجنب الخسارة"],["c","مطابقة الفاتورة مع أمر الشراء والاستلام وسجل النظام ثم توثيق التصحيح"],["d","تجاهل الفرق لأنه أقل من درهم"]], correct:"c", explanation:"لا تعدّل البيانات قبل تحديد مصدر الاختلاف. طابق المستندات ذات الصلة، وثّق النتيجة، واتبع صلاحيات الاعتماد." }
  ];

  function numericValue(raw) {
    const value = Number(String(raw == null ? "" : raw).trim().replace(",", "."));
    return Number.isFinite(value) ? value : null;
  }

  function evaluate(id, answer) {
    const task = tasks.find(item => item.id === id);
    if (!task) return { valid:false, correct:false, message:"المهمة غير معروفة." };
    if (task.type === "number") {
      const value = numericValue(answer);
      if (value === null || String(answer == null ? "" : answer).trim() === "") {
        return { valid:false, correct:false, message:"أدخل رقماً صالحاً أولاً." };
      }
      const correct = Math.abs(value - task.expected) <= task.tolerance;
      return { valid:true, correct, expected:task.expected, unit:task.unit, explanation:task.explanation,
        message:correct ? "صحيح. انتقل إلى الخطوة التالية." : "ليست هذه النتيجة. راجع العملية والوحدة ثم حاول مجدداً." };
    }
    const selected = String(answer || "");
    if (!selected) return { valid:false, correct:false, message:"اختر إجابة أولاً." };
    const correct = selected === task.correct;
    return { valid:true, correct, explanation:task.explanation,
      message:correct ? "اختيار صحيح." : "هذا الاختيار لا يحقق التحقق المطلوب. اقرأ التفسير وحاول مجدداً." };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
  }

  function mount(container) {
    if (!container) return false;
    const state = Object.create(null);
    function render() {
      const completed = tasks.filter(task => state[task.id] && state[task.id].correct).length;
      container.innerHTML =
        '<section class="bm001-lab" aria-labelledby="bm001-lab-title">' +
          '<div class="bm001-lab-head"><div><span class="bm001-kicker">PRACTICAL NUMBER SENSE · BM-001</span><h3 id="bm001-lab-title">من فرق صغير إلى قرار موثّق</h3><p>حلّ الموقف خطوة بخطوة. ستحصل على تفسير يوضح طريقة التفكير، وليس علامة صح فقط.</p></div><div class="bm001-score" aria-live="polite"><strong>' + completed + '/' + tasks.length + '</strong><span>مهام صحيحة</span></div></div>' +
          '<div class="bm001-case"><span>الحالة التشغيلية</span><strong>Tonic Water · 600 bottles</strong><div class="bm001-case-data"><div><small>سعر النظام</small><b dir="ltr">14.50 MAD</b></div><div><small>فاتورة المورد</small><b dir="ltr">14.05 MAD</b></div><div><small>الكمية</small><b dir="ltr">600</b></div></div></div>' +
          '<div class="bm001-progress"><div><span>تقدمك في المختبر</span><b>' + Math.round(completed / tasks.length * 100) + '%</b></div><i style="width:' + (completed / tasks.length * 100) + '%"></i></div>' +
          '<div class="bm001-task-list">' + tasks.map(task => {
            const result = state[task.id];
            const control = task.type === "number"
              ? '<label class="bm001-answer"><span>إجابتك · ' + task.unit + '</span><input type="number" step="any" inputmode="decimal" data-answer value="' + escapeHtml(result && result.answer != null ? result.answer : "") + '" placeholder="اكتب النتيجة" aria-label="' + escapeHtml(task.title) + '"></label>'
              : '<fieldset class="bm001-options"><legend>اختر الإجابة الأنسب</legend>' + task.options.map(option => '<label><input type="radio" name="bm001-' + task.id + '" value="' + option[0] + '" data-answer' + (result && result.answer === option[0] ? ' checked' : '') + '><span>' + escapeHtml(option[1]) + '</span></label>').join("") + '</fieldset>';
            const feedback = result ? '<div class="bm001-feedback ' + (result.correct ? 'is-correct' : 'is-incorrect') + '" role="status"><strong>' + (result.correct ? 'إجابة صحيحة' : 'راجع إجابتك') + '</strong><span>' + escapeHtml(result.message) + '</span><p>' + escapeHtml(result.explanation) + '</p></div>' : '';
            return '<article class="bm001-task" data-task="' + task.id + '"><div class="bm001-task-title"><span>' + escapeHtml(task.title) + '</span><small>' + (task.type === "number" ? 'حساب' : 'تحقق واتخاذ قرار') + '</small></div><p>' + escapeHtml(task.prompt) + '</p>' + control + '<div class="bm001-actions"><button type="button" data-check="' + task.id + '">تحقق من الإجابة</button><button type="button" data-reset="' + task.id + '" class="bm001-reset">إعادة المحاولة</button></div>' + feedback + '</article>';
          }).join("") + '</div>' +
          '<div class="bm001-complete" aria-live="polite">' + (completed === tasks.length ? '<strong>أكملت المختبر بنجاح.</strong><p>أثبتّ قدرتك على قراءة الفرق، حساب أثره، والتحقق من مصدر البيانات قبل التصرف.</p>' : '<strong>تذكير مهني</strong><p>هذا المختبر تدريب تعليمي مستقل. إكماله هنا لا يغيّر سجل XP أو يعلّم شروط إكمال الدرس تلقائياً.</p>') + '</div>' +
        '</section>';
      container.querySelectorAll("[data-check]").forEach(button => button.addEventListener("click", () => {
        const task = tasks.find(item => item.id === button.dataset.check);
        const card = button.closest("[data-task]");
        const selected = task.type === "number" ? card.querySelector("[data-answer]").value : (card.querySelector("[data-answer]:checked") || {}).value;
        const result = evaluate(task.id, selected);
        if (result.valid && result.correct) state[task.id] = Object.assign({}, result, { answer:selected });
        else state[task.id] = Object.assign({}, result, { answer:selected, correct:false, explanation:result.explanation || task.explanation });
        render();
      }));
      container.querySelectorAll("[data-reset]").forEach(button => button.addEventListener("click", () => { delete state[button.dataset.reset]; render(); }));
    }
    render();
    return true;
  }

  root.KPI_BM001_LAB = { mount, evaluate, taskCount:tasks.length };
})(window);
