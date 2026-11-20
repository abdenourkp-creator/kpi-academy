const MODULES_URL="data/modules.json",BM_URL="data/business-mathematics.json",HA_URL="data/hospitality-accounting-scope.json",KPI_URL="data/kpi-registry.json";
const app=document.getElementById("app"),pageTitle=document.getElementById("pageTitle");

const AR_TITLES={"Business Mathematics":"الرياضيات التجارية","Hospitality Accounting":"محاسبة الضيافة","Restaurant KPIs":"مؤشرات أداء المطاعم","Numerical Foundations":"أساسيات الأعداد","Percentages & Percentage Change":"النسب المئوية والتغير النسبي","Ratios & Proportions":"النسب والتناسب","Averages & Weighted Averages":"المتوسطات والمتوسطات المرجحة","Business Equations":"المعادلات التجارية","Variance Analysis":"تحليل الانحرافات","Units, Rates & Productivity":"وحدات القياس والمعدلات والإنتاجية","Tables, Data & Business Interpretation":"الجداول والبيانات والتفسير التجاري","Understanding Numbers":"فهم الأعداد","Arithmetic Operations":"العمليات الحسابية","Order of Operations":"ترتيب العمليات الحسابية","Rounding & Precision":"التقريب والدقة","Understanding Percentages":"فهم النسب المئوية","Calculating Percentages":"حساب النسب المئوية","Finding the Original Value":"إيجاد القيمة الأصلية","Percentage Increase & Decrease":"الزيادة والنقصان بالنسبة المئوية","Percentage Points vs Percentage Change":"النقاط المئوية مقابل التغير النسبي","Understanding Ratios":"فهم النسب","Simplifying Ratios":"تبسيط النسب","Proportions & Cross Multiplication":"التناسب والضرب التبادلي","Business Resource Allocation":"توزيع الموارد التجارية","Arithmetic Mean":"المتوسط الحسابي","Understanding Weighted Average":"فهم المتوسط المرجح","Average Check & Sales Averages":"متوسط الفاتورة ومتوسطات المبيعات","Interpreting Business Averages":"تفسير المتوسطات التجارية","Understanding Variables":"فهم المتغيرات","Solving Basic Equations":"حل المعادلات الأساسية","Rearranging Formulas":"إعادة ترتيب الصيغ","Finding Missing Business Values":"إيجاد القيم التجارية المفقودة","Understanding Variance":"فهم الانحرافات","Absolute Variance":"الانحراف بالقيمة المطلقة","Variance Percentage":"نسبة الانحراف","Favorable vs Unfavorable":"الانحراف الملائم وغير الملائم","Units of Measurement":"وحدات القياس","Rates & Ratios Over Time":"المعدلات والنسب عبر الزمن","Productivity Calculations":"حساب الإنتاجية","Capacity & Utilization":"السعة ومعدل الاستغلال","Reading Business Tables":"قراءة الجداول التجارية","Understanding Trends & Charts":"فهم الاتجاهات والرسوم البيانية","From Numbers to Decisions":"من الأرقام إلى القرارات","Business Mystery":"الموقف التجاري","Build the Concept":"بناء المفهوم","Worked Case":"مثال تطبيقي محلول","Worked Management Case":"حالة إدارية محلولة","Interactive Lab":"مختبر تطبيقي","Interactive Practice":"تدريب تطبيقي","Professional Challenge":"التحدي المهني","Common Mistakes":"أخطاء شائعة","Assessment":"التقييم","Field Checklist":"قائمة التحقق الميدانية","Field Application Checklist":"قائمة التطبيق الميداني","Final Assessment":"التقييم النهائي","Final Professional Challenge":"التحدي المهني الختامي","Module Completion Standard":"معيار إكمال الوحدة","Management standard":"المعيار الإداري","Decision Chain":"تسلسل اتخاذ القرار","Hospitality Applications":"تطبيقات في قطاع الضيافة","Formula Selection":"اختيار المعادلة المناسبة","Why the Answers Differ":"لماذا تختلف النتائج؟","Definitions":"التعريفات","The Mathematical Principle":"المبدأ الرياضي","The Basic Concept":"المفهوم الأساسي","The Principle":"المبدأ","Worked Examples":"أمثلة محلولة","Hospitality Case":"حالة من قطاع الضيافة","Management Case":"حالة إدارية","Executive Report":"التقرير التنفيذي","Final Business Mystery":"الموقف التجاري الختامي","1. Business Mystery — Which Restaurant Performs Better?":"01 · موقف تجاري: أي المطعمين يحقق أداءً أفضل؟","2. What Does Percent Mean?":"02 · ماذا تعني النسبة المئوية؟","3. Part, Whole and Base Value":"03 · الجزء والإجمالي وقيمة الأساس","4. Convert Between Forms":"04 · التحويل بين الصيغ","5. Percentages Above 100%":"05 · النسب التي تتجاوز 100%","6. Hospitality Applications":"06 · تطبيقات في قطاع الضيافة","7. Worked Case — Why One KPI Is Not Enough":"07 · مثال محلول: لماذا لا يكفي مؤشر واحد؟","8. Interactive Lab":"08 · المختبر التطبيقي","9. Common Mistakes":"09 · الأخطاء الشائعة","10. Professional Challenge — F&B Report":"10 · التحدي المهني: تقرير الطعام والمشروبات","11. Assessment":"11 · التقييم","12. Field Checklist":"12 · قائمة التحقق الميدانية"};
function arLabel(value){return AR_TITLES[value]||value;}
window.KPI_AR_LABEL=arLabel;
const titles={dashboard:"لوحة التحكم",modules:"الوحدات التعليمية",calculator:"حاسبة المؤشرات",analytics:"مختبر التحليل",simulator:"محاكاة الإدارة",progress:"التقييم والتقدم"};
let modules=[],businessMath=null,hospitalityAccounting=null,kpiRegistry=null;
async function loadData(){try{const [m,b,h,k]=await Promise.all([fetch(MODULES_URL),fetch(BM_URL),fetch(HA_URL),fetch(KPI_URL)]);if(!m.ok||!b.ok||!h.ok||!k.ok)throw Error("تعذر تحميل بيانات المنهج والسجل");modules=await m.json();businessMath=await b.json();hospitalityAccounting=await h.json();kpiRegistry=await k.json();render();}catch(e){app.innerHTML='<div class="empty-card"><h2>تعذر تحميل بيانات المنهج</h2><p>تحقق من ملفات البيانات ثم أعد تحميل الصفحة.</p></div>';console.error(e);}}
function moduleCard(m){
 const isMath=m.id==="business-mathematics",isAccounting=m.id==="hospitality-accounting";
 const count=isMath&&businessMath?businessMath.chapters.reduce((n,c)=>n+c.lessons.length,0):0;
 const status=isMath?"متاح الآن":isAccounting?"نطاق معتمد · المنهج التفصيلي قيد الإعداد":"سجل المؤشرات والحاسبة متاحان · المنهج قيد الإعداد";
 const number=isMath?"01":isAccounting?"02":"03";
 return '<article class="ka-module-card"><div class="ka-module-top"><span class="ka-module-index">'+number+'</span><span class="ka-module-status '+(isMath?"available":"planned")+'">'+status+'</span></div><h3>'+esc(arLabel(m.title))+'</h3><p>'+esc(m.description)+'</p><div class="ka-module-outcomes">'+m.outcomes.slice(0,3).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div><div class="ka-module-footer"><span>'+(isMath?count+" درساً · 8 فصول":isAccounting?(hospitalityAccounting?hospitalityAccounting.approvedScope.length:0)+" مجالات معتمدة":(kpiRegistry?kpiRegistry.kpis.length:0)+" مؤشراً معتمداً")+'</span><a class="ka-module-link" href="#module-'+m.id+'" data-module="'+m.id+'">'+(isMath?"ابدأ التعلّم":isAccounting?"استكشف النطاق":"استكشف المؤشرات")+' <span aria-hidden="true">←</span></a></div></article>';
}

function dashboard(){
 const summary=window.KPI_LEARNING_UI?window.KPI_LEARNING_UI.dashboardSummary():"";
 return '<div class="ka-dashboard"><section class="ka-welcome"><div class="ka-welcome-copy"><span class="eyebrow">KPI ACADEMY · HOSPITALITY BUSINESS INTELLIGENCE</span><h1>افهم الأرقام.<br><span>اتخذ قرارات أفضل.</span></h1><p>من الأساس الحسابي إلى قراءة الأداء المالي والتشغيلي في قطاع الضيافة.</p></div><div class="ka-welcome-mark" aria-hidden="true"><span>∑</span><small>LEARN<br>· CALCULATE<br>· ANALYZE</small></div></section><div class="ka-product-facts" aria-label="نطاق الأكاديمية"><div><strong>03</strong><span>وحدات MVP</span></div><div><strong>32</strong><span>درساً موثقاً</span></div><div><strong>15</strong><span>تعريف KPI</span></div><div><strong>01</strong><span>منهج مكتمل حالياً</span></div></div><section class="ka-learning-section"><div class="ka-section-heading"><div><span class="eyebrow">YOUR LEARNING RECORD</span><h2>مساحة تعلّمك</h2><p>التقدم والنقاط والاختبارات مستمدة من سجل التعلم المحلي.</p></div><a href="#progress" class="ka-text-link">عرض السجل الكامل ←</a></div>'+(summary||'<div class="empty-card">محرك التعلّم غير متاح حالياً.</div>')+'</section><section class="ka-modules-section"><div class="ka-section-heading"><div><span class="eyebrow">KNOWLEDGE ARCHITECTURE</span><h2>الوحدات التعليمية</h2><p>ثلاثة مجالات مترابطة، بمستويات مختلفة من جاهزية المحتوى.</p></div><a href="#modules" class="ka-text-link">عرض جميع الوحدات ←</a></div><div class="ka-module-grid">'+modules.map(moduleCard).join("")+'</div></section><section class="ka-method"><span class="eyebrow">THE KPI ACADEMY METHOD</span><p><strong>Learn → Calculate → Analyze → Manage</strong></p><span>كل رقم له تعريف، وكل نتيجة لها أساس حسابي، وكل استنتاج يجب أن يحترم حدود البيانات.</span></section></div>';
}

function modulesView(){return '<div class="ka-page-intro"><span class="eyebrow">KNOWLEDGE ARCHITECTURE</span><h1>الوحدات التعليمية</h1><p>استكشف المحتوى المتاح، وميّز بين المنهج المنشور والنطاق الذي ما زال قيد التطوير.</p></div><div class="ka-module-grid ka-module-grid-page">'+modules.map(moduleCard).join("")+'</div>';}

function moduleDetail(id){const m=modules.find(x=>x.id===id);if(!m)return modulesView();let h='<div class="page-heading"><div><span class="eyebrow">'+m.code+'</span><h1>'+m.title+'</h1><p>'+m.description+'</p></div><a class="text-link" href="#modules">← كل الوحدات</a></div><div class="content-card"><h2>مخرجات التعلم</h2><p>'+m.outcomes.join(" · ")+'</p></div><h2 class="section-title">الفصول والدروس</h2>';if(id==="business-mathematics"&&businessMath){businessMath.chapters.forEach(c=>{h+='<section class="chapter-panel"><div class="chapter-heading"><span class="module-number">الفصل '+String(c.number).padStart(2,"0")+'</span><span class="tag">'+c.lessons.length+' دروس</span></div><h2>'+arLabel(c.title)+'</h2><div class="lesson-list">';c.lessons.forEach(l=>{h+='<a class="lesson-row" href="#lesson-'+l.code+'"><span class="lesson-code">'+l.code+'</span><span class="lesson-name">'+arLabel(l.title.replace(/^BM-\d+ — /,''))+'</span><span class="lesson-xp">90 XP</span><span class="lesson-arrow">←</span></a>';});h+='</div></section>';});}else if(id==="hospitality-accounting"&&hospitalityAccounting){h+='<section class="chapter-panel"><div class="chapter-heading"><span class="module-number">النطاق المعتمد للوحدة</span><span class="tag">المنهج التفصيلي قيد الإعداد</span></div><h2>المجالات المعتمدة ضمن نطاق الوحدة</h2><p class="scope-intro">هذه المجالات مثبتة في مواصفات KPI Academy. لم تحدد الوثائق بعد ترتيب الفصول أو الدروس أو التقييمات؛ لذلك لن نعرضها كمنهج مكتمل.</p><div class="scope-grid">'+hospitalityAccounting.approvedScope.map((x,i)=>'<article class="scope-item"><span class="scope-index">'+String(i+1).padStart(2,"0")+'</span><strong>'+x.title+'</strong><p>'+x.description+'</p></article>').join("")+'</div><div class="notice">'+hospitalityAccounting.curriculumNotice+'</div></section>';}else if(id==="restaurant-kpis"){h+='<section class="chapter-panel ka-kpi-module-panel"><div class="chapter-heading"><span class="module-number">سجل المؤشرات المعتمد</span><span class="tag">'+(kpiRegistry?kpiRegistry.kpis.length:0)+' KPI</span></div><h2>من التعريف إلى الحساب والتفسير</h2><p>هذه تعريفات المؤشرات المعتمدة في سجل KPI Academy. عرض السجل لا يعني أن المنهج التعليمي التفصيلي للوحدة قد اكتمل.</p><div class="ka-kpi-registry-list">'+((kpiRegistry&&Array.isArray(kpiRegistry.kpis))?kpiRegistry.kpis:[]).map((k,i)=>'<article class="ka-kpi-registry-item"><div><span class="scope-index">'+String(i+1).padStart(2,"0")+'</span><strong>'+esc(k.name)+'</strong><small>'+esc(k.unit)+' · '+esc(k.period)+'</small></div><code>'+esc(k.formula)+'</code></article>').join("")+'</div><div class="notice">السجل الحسابي والحاسبة متاحان. ترتيب الفصول والدروس والأنشطة التعليمية لهذه الوحدة لم يعتمد بعد.</div><a class="primary-action ka-calculator-cta" href="#calculator">فتح حاسبة المؤشرات ←</a></section>'}else{h+='<div class="empty-card"><h2>المحتوى التفصيلي قيد الإعداد</h2><p>لن نعرض عناوين أو دروساً مختصرة على أنها محتوى مكتمل.</p></div>';}return h;}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function fmt(s){const value=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,"<em>$1</em>").replace(/\`([^\`]+)\`/g,"<code>$1</code>").replace(/&lt;b&gt;(.*?)&lt;\/b&gt;/g,"<strong>$1</strong>").replace(/&lt;br\s*\/?&gt;/g,"<br>");return value.replace(/(<[^>]*>|[^<]+)/g,part=>part.charAt(0)==="<"?part:part.replace(/[A-Za-z][A-Za-z0-9%+./-]*(?:\s+[A-Za-z][A-Za-z0-9%+./-]*){0,4}/g,match=>'<span class="ltr-term" lang="en" dir="ltr">'+match+'</span>'));}
function markdownHtml(md){
 const source=md.replace(/<b>/gi,"**").replace(/<\/b>/gi,"**").replace(/<br\s*\/?>/gi,"\uE000");
 const lines=source.split(/\r?\n/);
 let html="",paragraph=[],lists=[],tableRows=[];
 const flushParagraph=()=>{if(paragraph.length){html+="<p>"+fmt(esc(paragraph.join(" ")).replace(/\\\|/g,"|")).replace(/\uE000/g,"<br>")+"</p>";paragraph=[];}};
 const closeLists=()=>{while(lists.length){const item=lists.pop();html+="</li></"+item.type+">";}};
 const splitCells=row=>row.trim().replace(/^\|/,"").replace(/\|$/,"").split(/(?<!\\)\|/).map(cell=>cell.trim().replace(/\\\|/g,"|"));
 const flushTable=()=>{if(!tableRows.length)return;const rows=tableRows.map(splitCells).filter(cells=>!cells.every(cell=>/^:?-{3,}:?$/.test(cell)));if(rows.length){html+='<div class="table-scroll" role="region" aria-label="جدول تعليمي" tabindex="0"><table><thead><tr>'+rows[0].map(cell=>'<th scope="col">'+fmt(esc(cell))+'</th>').join("")+'</tr></thead><tbody>'+rows.slice(1).map(row=>"<tr>"+row.map(cell=>"<td>"+fmt(esc(cell))+"</td>").join("")+"</tr>").join("")+'</tbody></table></div>';}tableRows=[];};
 const closeBlocks=()=>{flushParagraph();closeLists();flushTable();};
 for(const raw of lines){
  if(!raw.trim()){closeBlocks();continue;}
  const heading=raw.trim().match(/^(#{1,4})\s+(.+)$/);
  if(heading){closeBlocks();const level=heading[1].length;html+="<h"+level+">"+fmt(esc(arLabel(heading[2])))+"</h"+level+">";continue;}
  if(/^\s*\|/.test(raw)){flushParagraph();closeLists();tableRows.push(raw.trim());continue;}
  flushTable();
  const match=raw.match(/^(\s*)([-*+]\s+|\d+[.)]\s+)(.+)$/);
  if(match){
   flushParagraph();
   const indent=match[1].replace(/\t/g,"  ").length,type=/^\d/.test(match[2])?"ol":"ul";
   while(lists.length&&indent<lists[lists.length-1].indent){const item=lists.pop();html+="</li></"+item.type+">";}
   if(!lists.length){html+="<"+type+"><li>";lists.push({indent,type});}
   else if(indent>lists[lists.length-1].indent){html+="<"+type+"><li>";lists.push({indent,type});}
   else if(indent===lists[lists.length-1].indent&&type===lists[lists.length-1].type){html+="</li><li>";}
   else{const item=lists.pop();html+="</li></"+item.type+">";if(lists.length&&indent===lists[lists.length-1].indent&&type===lists[lists.length-1].type)html+="</li><li>";else{html+="<"+type+"><li>";lists.push({indent,type});}}
   html+=fmt(esc(match[3]).replace(/\\\|/g,"|"));continue;
  }
  closeLists();paragraph.push(raw.trim());
 }
 closeBlocks();return html;
}
async function lessonView(code){
  const chapter=businessMath.chapters.find(item=>item.lessons.some(lesson=>lesson.code===code));
  const lesson=chapter&&chapter.lessons.find(item=>item.code===code);
  if(!lesson){app.innerHTML=moduleDetail("business-mathematics");return;}
  pageTitle.textContent=code;
  app.innerHTML='<div class="loading-state">جارٍ تحميل الدرس من المنهج الأصلي…</div>';
  try{
    const response=await fetch(lesson.sourcePath);
    if(!response.ok)throw Error("Lesson source unavailable");
    const source=await response.text();
    const markdown=source.replace(/^# .+\n+/, "");
    let lessonContent=markdownHtml(markdown);
    if(code==="BM-005"){
      const diagramAt=markdown.indexOf("## 7. Worked Case");
      const labAt=markdown.indexOf("## 9. Common Mistakes");
      const diagramFigure='<figure class="lesson-visual-card"><div class="lesson-visual-copy"><span class="eyebrow">رسم توضيحي · Food Cost</span><h3>كيف تتحول المبيعات والتكلفة إلى نسبة؟</h3><p><strong>هدف التعلم:</strong> تحديد الجزء والمقام الصحيحين قبل تفسير النسبة.</p><p>وفق المثال الأصلي في الدرس: 9,000 MAD Food COGS ÷ 30,000 MAD Food Net Sales = 30%. أي أن كل 100 MAD من صافي مبيعات الطعام تقابلها 30 MAD تكلفة طعام.</p></div><img src="assets/diagrams/restaurant-kpis/food-cost-calculation.svg" alt="مخطط حساب تكلفة الطعام بقسمة Food COGS على Food Net Sales وضرب الناتج في 100"></figure>';
      const labMount='<div id="lessonExperienceMount" aria-label="المختبر التفاعلي"></div>';
      if(diagramAt>=0&&labAt>diagramAt){
        lessonContent=markdownHtml(markdown.slice(0,diagramAt))+diagramFigure+markdownHtml(markdown.slice(diagramAt,labAt))+labMount+markdownHtml(markdown.slice(labAt));
      }else{
        lessonContent=markdownHtml(markdown)+diagramFigure+labMount;
      }
    }
    const allLessons=businessMath.chapters.flatMap(item=>item.lessons);
    const lessonIndex=allLessons.findIndex(item=>item.code===code);
    const previousLesson=lessonIndex>0?allLessons[lessonIndex-1]:null;
    const nextLesson=lessonIndex<allLessons.length-1?allLessons[lessonIndex+1]:null;
    const lessonNavigation='<nav class="ka-lesson-navigation" aria-label="التنقل بين الدروس">'+
      (previousLesson?'<a href="#lesson-'+previousLesson.code+'"><small>الدرس السابق</small><strong>'+esc(arLabel(previousLesson.title.replace(/^BM-\d+ — /,'')))+'</strong></a>':'<span></span>')+
      (nextLesson?'<a class="next" href="#lesson-'+nextLesson.code+'"><small>الدرس التالي</small><strong>'+esc(arLabel(nextLesson.title.replace(/^BM-\d+ — /,'')))+'</strong></a>':'<a href="#progress"><small>الخطوة التالية</small><strong>مراجعة التقييمات</strong></a>')+'</nav>';
    app.innerHTML=
      '<div class="lesson-toolbar"><a class="text-link" href="#module-business-mathematics">← العودة إلى الفصول</a><span class="tag">'+arLabel(chapter.title)+'</span></div>'+
      '<article class="lesson-reader"><div class="ka-lesson-heading"><div class="lesson-meta"><span>'+code+'</span><span>Foundation</span><span>'+lesson.availableXp+' XP متاحة</span></div>'+
      '<h1>'+arLabel(lesson.title)+'</h1><p>الرياضيات التجارية · الفصل '+String(chapter.number).padStart(2,"0")+' من 8</p></div><div class="lesson-body">'+lessonContent+'</div>'+
      '<div class="lesson-end"><p>إكمال الدرس وحده لا يمنح XP. تُمنح النقاط بعد تسجيل أدلة التنفيذ.</p><a class="text-link" href="#module-business-mathematics">العودة إلى قائمة الدروس ↑</a></div>'+lessonNavigation+'</article>'+
      '<div id="lessonProgressMount"></div>';
    const lessonBody=app.querySelector(".lesson-body");
    if(lessonBody){
      const sectionHeadings=Array.from(lessonBody.querySelectorAll("h2"));
      if(sectionHeadings.length){
        const toc=document.createElement("nav");toc.className="ka-lesson-toc";toc.setAttribute("aria-label","محتويات الدرس");
        const tocLabel=document.createElement("strong");tocLabel.textContent="محتويات الدرس";toc.appendChild(tocLabel);
        const tocLinks=document.createElement("div");tocLinks.className="ka-lesson-toc-links";
        sectionHeadings.forEach((heading,index)=>{const id="lesson-section-"+(index+1);heading.id=id;const link=document.createElement("a");link.href="#"+id;link.textContent=heading.textContent;tocLinks.appendChild(link);});
        toc.appendChild(tocLinks);lessonBody.insertBefore(toc,lessonBody.firstChild);
      }
      sectionHeadings.forEach(heading=>{
        const label=heading.textContent.trim();
        let kind="content";
        if(/Business Mystery|الموقف التجاري|لغز/i.test(label))kind="mystery";
        else if(/Common Mistakes|أخطاء شائعة/i.test(label))kind="mistakes";
        else if(/Professional Challenge|التحدي المهني/i.test(label))kind="challenge";
        else if(/Assessment|التقييم/i.test(label))kind="assessment";
        else if(/Field Checklist|Application Checklist|قائمة التحقق/i.test(label))kind="checklist";
        else if(/Interactive Lab|Interactive Practice|مختبر|تدريب تطبيقي/i.test(label))kind="lab";
        else if(/Worked Case|Worked Example|Hospitality Case|Management Case|مثال|حالة/i.test(label))kind="worked";
        else if(/Management Insight|Executive Report|إدارة|التقرير التنفيذي/i.test(label))kind="insight";
        const parent=heading.parentNode,section=document.createElement("section");
        section.className="ka-lesson-section ka-lesson-section--"+kind;
        section.setAttribute("aria-labelledby",heading.id);
        parent.insertBefore(section,heading);section.appendChild(heading);
        let node=section.nextSibling;
        while(node&&!(node.nodeType===1&&node.tagName==="H2")){
          const next=node.nextSibling;section.appendChild(node);node=next;
        }
        section.querySelectorAll("p").forEach(paragraph=>{
          const segments=paragraph.innerHTML.split(/<br\s*\/?>/);
          const rendered=segments.map(segment=>{
            const value=segment.replace(/<[^>]*>/g,"").trim();
            if(value.length>0&&value.length<160&&!/[\u0600-\u06FF]/.test(value)&&/[=×÷]/.test(value)&&/^[A-Za-z0-9\s.,%()+\-×÷=/:]+$/.test(value)){
              return '<span class="ka-formula-block" dir="ltr">'+segment+'</span>';
            }
            return segment;
          });
          paragraph.innerHTML=rendered.join("<br>");
        });
      });
    }
    if(code==="BM-005"&&window.KPI_LESSON_EXPERIENCE){
      window.KPI_LESSON_EXPERIENCE.mount(code,document.getElementById("lessonExperienceMount"));
    }
    if(window.KPI_LEARNING_UI)window.KPI_LEARNING_UI.mountLessonPanel(code);
  }catch(error){
    app.innerHTML='<div class="empty-card"><h2>تعذر تحميل الدرس</h2><p>تحقق من مسار ملف الدرس عند النشر.</p></div>';
    console.error(error);
  }
}
function placeholder(v){if(v==="analytics"&&window.KPI_ANALYTICS)return window.KPI_ANALYTICS.view();if(v==="simulator"&&window.KPI_SIMULATOR)return window.KPI_SIMULATOR.view();if(v==="calculator"&&window.calculatorView)return window.calculatorView();if(v==="progress"&&window.KPI_LEARNING_UI)return window.KPI_LEARNING_UI.progressView();const c={calculator:["حاسبة المؤشرات","ستُبنى الحاسبة على سجل KPI المعتمد، مع عرض المعادلة والمدخلات والوحدات والفترة والافتراضات ورسائل التحقق لكل نتيجة."],analytics:["مختبر التحليل","مساحة لتحليل الاتجاهات والمقارنات وقراءة الأرقام ضمن سياق تشغيلي واضح."],simulator:["محاكاة الإدارة","ثلاث حالات إدارية تطبيقية ضمن نطاق النسخة الأولية، تُبنى على بيانات وسيناريوهات موثقة."],progress:["التقييم والتقدم","سيُسجل التقدم ونقاط XP بناءً على دليل إكمال فعلي. فتح الدرس وحده لا يمنح نقاطاً أو إتماماً."]};return '<div class="page-heading"><div><span class="eyebrow">قيد التطوير</span><h1>'+c[v][0]+'</h1><p>'+c[v][1]+'</p></div></div><div class="empty-card"><div class="empty-symbol">◌</div><h2>هذه المساحة لم تُنفذ بعد</h2><p>لن نعرض وظائف وهمية أو نتائج غير محسوبة.</p></div>';}
function render(){const hash=location.hash.replace("#","");if(/^lesson-section-\d+$/.test(hash)&&document.querySelector(".lesson-reader"))return;const lm=hash.match(/^lesson-(BM-\d{3})$/),mm=hash.match(/^module-(.+)$/),am=hash.match(/^assessment-(bm-chapter-\d{2}|bm-final-practical)$/),v=lm||mm||am?"modules":titles[hash]?hash:"dashboard";pageTitle.textContent=lm?lm[1]:mm?"تفاصيل الوحدة":am?"الاختبار":titles[v];document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.view===(am?"progress":v)));if(am){if(window.KPI_LEARNING_UI)window.KPI_LEARNING_UI.renderAssessmentRoute(am[1],app);else app.innerHTML='<div class="loading-state">محرك التقييم غير متاح.</div>';return;}if(lm){lessonView(lm[1]);return;}app.innerHTML=mm?moduleDetail(mm[1]):v==="dashboard"?dashboard():v==="modules"?modulesView():placeholder(v);if(v==="progress"&&window.KPI_LEARNING_UI)window.KPI_LEARNING_UI.mountProgressActions();if(v==="analytics"&&window.KPI_ANALYTICS)window.KPI_ANALYTICS.mount(app);if(v==="simulator"&&window.KPI_SIMULATOR)window.KPI_SIMULATOR.mount(app);}
document.addEventListener("click",e=>{const a=e.target.closest("[data-module]");if(a){e.preventDefault();location.hash="module-"+a.dataset.module;}});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>document.getElementById("sidebar").classList.remove("open")));
window.addEventListener("hashchange",render);loadData();