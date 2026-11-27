(function(root){"use strict";
const KEY="kpi-academy.study-tools.v1";
const TERMS=[
["Part","الجزء","الكمية التي نريد قياسها مقارنةً بإجمالي أو أساس محدد.","Food COGS = 9,000 MAD في مثال BM-005."],
["Whole","الإجمالي / الكل","المقام الذي تتم مقارنة الجزء به؛ يجب أن يطابق نطاق السؤال.","Food Net Sales = 30,000 MAD في مثال BM-005."],
["Base Value","قيمة الأساس","القيمة المرجعية التي تُقاس النسبة نسبةً إليها.","حدّدها قبل تفسير أي Percentage."],
["Percentage","النسبة المئوية","الجزء مقسوماً على الإجمالي ثم مضروباً في 100.","9,000 ÷ 30,000 × 100 = 30%."],
["Food COGS","تكلفة الطعام المباشرة","تكلفة الطعام المستخدمة في حساب Food Cost وفق تعريف المنشأة.","لا تخلطها مع Beverage COGS."],
["Food Net Sales","صافي مبيعات الطعام","قاعدة المبيعات المستخدمة في مقام Food Cost في المثال.","Food Cost % = Food COGS ÷ Food Net Sales × 100."],
["Beverage Cost","تكلفة المشروبات","نسبة تكلفة المشروبات إلى صافي مبيعات المشروبات.","5,000 ÷ 20,000 × 100 = 25%."],
["Labor Cost","تكلفة العمالة","تكلفة العمالة مقسومة على قاعدة المبيعات المحددة لنطاق العمالة.","إذا خدمت العمالة القسمين، استخدم Combined F&B Net Sales."],
["Weighted Average","المتوسط المرجح","متوسط يراعي حجم كل مجموعة أو وزنها، لا متوسط النسب حسابياً.","Combined COGS % = Total COGS ÷ Total Sales × 100."],
["Actual as % of Budget","الفعلي كنسبة من الميزانية","الإنفاق الفعلي مقسوماً على الميزانية ثم مضروباً في 100.","125% من الميزانية تعني تجاوزها 25%."],
["Percentage Points","النقاط المئوية","الفرق المباشر بين نسبتين مئويتين، ويختلف عن Percentage Change.","من 20% إلى 25% = 5 نقاط مئوية."],
["Occupancy","نسبة الإشغال","Occupied Room Nights ÷ Available Room Nights × 100 وفق سياسة المنشأة.","900 ÷ 1,200 × 100 = 75%."],
["Gross Profit","مجمل الربح","المبيعات ناقص COGS في نطاق الحساب المحدد.","20,000 − 4,000 = 16,000 MAD."],
["Sales Mix","مزيج المبيعات","توزيع المبيعات بين المنتجات أو الفئات؛ يؤثر في قراءة الأداء.","لا يكفي Food Cost وحده للحكم على المطعم."],
["Variance","الانحراف","الفرق بين قيمة فعلية وقيمة مرجعية مثل Budget أو Target.","حدّد المرجع واتجاه الانحراف قبل وصفه."]
];
const fresh=()=>({bookmarks:[],notes:{},reviews:{},masteredTerms:[],revisitTerms:[]});
function read(){try{const x=JSON.parse(root.localStorage.getItem(KEY)||"null");return x&&Array.isArray(x.bookmarks)&&x.notes&&x.reviews?{...fresh(),...x,masteredTerms:Array.isArray(x.masteredTerms)?x.masteredTerms:[],revisitTerms:Array.isArray(x.revisitTerms)?x.revisitTerms:[]}:fresh();}catch(_){return fresh();}}
let state=read();
function save(){try{root.localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(_){return false;}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function dueItems(){return Object.entries(state.reviews).filter(([,r])=>r.nextAt&&Date.parse(r.nextAt)<=Date.now()).map(([code,r])=>({code,...r}));}
function registerVisit(code,title){const r=state.reviews[code]||{stage:0,nextAt:new Date(Date.now()+86400000).toISOString(),title};r.title=title;r.lastOpenedAt=new Date().toISOString();state.reviews[code]=r;save();}
function review(code){const r=state.reviews[code];if(!r)return;const intervals=[1,3,7];r.stage=Math.min((r.stage||0)+1,3);r.lastReviewedAt=new Date().toISOString();r.nextAt=new Date(Date.now()+(r.stage>=3?30:intervals[r.stage])*86400000).toISOString();save();return r;}
function dashboardWidget(curriculum, language = "ar") {
  const copy = root.KPI.i18n[language].home;
  const engine = root.KPI_LEARNING_ENGINE;
  const data = engine.getDashboard();
  const chapters = curriculum?.chapters || [];
  const displayTitle = title => language === "ar" && root.KPI_AR_LABEL ? root.KPI_AR_LABEL(title) : title;
  const titles = new Map(chapters.flatMap(ch => ch.lessons.map(lesson => [lesson.code, displayTitle(lesson.title)])));
  const skills = chapters.filter(ch => ch.lessons.length).map(ch => {
    const done = ch.lessons.filter(lesson => engine.getLessonProgress(lesson.code).progress?.status === "completed").length;
    const percent = Math.round(done / ch.lessons.length * 100);
    return `<a class="st-skill-node" href="#lesson-${esc(ch.lessons[0].code)}">
      <span><b>${esc(String(ch.number).padStart(2,"0"))}</b><strong>${esc(displayTitle(ch.title))}</strong></span>
      <em><bdi>${done}/${ch.lessons.length}</bdi></em><i><span style="width:${percent}%"></span></i></a>`;
  }).join("");
  const badges = [
    [copy.firstBadge, copy.firstBadgeHint, data.completedLessons >= 1],
    [copy.fiveBadge, copy.fiveBadgeHint, data.completedLessons >= 5],
    [copy.examBadge, copy.examBadgeHint, data.passedAssessments >= 1],
    [copy.foundationBadge, copy.foundationHint, data.courseComplete]
  ];
  const saved = state.bookmarks.map(code => `<a href="#lesson-${esc(code)}"><bdi>${esc(code)}</bdi> ${copy.arrow}</a>`).join("");
  const due = dueItems();
  return `<section class="st-dashboard"><h2>${copy.study}</h2>
    <div class="st-dash-stats"><span><strong>${state.bookmarks.length}</strong> ${copy.saved}</span>
      <span><strong>${due.length}</strong> ${copy.due}</span><span><strong>${data.completedLessons}</strong> ${copy.completeLessons}</span></div>
    <div class="st-dashboard-grid"><article class="st-skill-tree"><h3>${copy.skills}</h3><div class="st-skill-list">${skills}</div></article>
      <article class="st-badges"><h3>${copy.badges}</h3><div class="st-badge-list">
      ${badges.map(([title, hint, earned]) => `<div class="st-badge ${earned ? "earned" : "locked"}"><span>${earned ? "✓" : "○"}</span><div><strong>${title}</strong><small>${hint}</small></div></div>`).join("")}</div></article></div>
    ${due.length ? `<div class="st-due-list">${due.slice(0,4).map(item => `<a href="#lesson-${esc(item.code)}"><bdi>${esc(item.code)}</bdi><span>${esc(titles.get(item.code) || item.code)}</span><em>${copy.dueNow} ${copy.arrow}</em></a>`).join("")}</div>` : `<p class="st-empty">${copy.noReview}</p>`}
    ${saved ? `<div class="st-saved-links"><strong>${copy.savedLessons}</strong>${saved}</div>` : ""}
  </section>`;
}

function lessonPanel(code,title){registerVisit(code,title);const saved=state.bookmarks.includes(code),note=state.notes[code]||"",r=state.reviews[code];return '<section class="st-panel"><div class="st-panel-head"><div><span class="eyebrow">STUDY COMPANION</span><h2>أدواتك لهذا الدرس</h2><p>احفظ الفكرة، دوّن ملاحظتك، ثم ارجع إليها في موعد المراجعة.</p></div><button type="button" class="st-bookmark '+(saved?"active":"")+'" id="stBookmark" aria-pressed="'+saved+'">'+(saved?"★ محفوظ":"☆ احفظ الدرس")+'</button></div><div class="st-tools-grid"><article class="st-tool-card"><h3>📝 ملاحظاتي</h3><p>اكتب الفكرة التي تريد تذكرها أو السؤال الذي بقي لديك.</p><textarea id="stNote" rows="4" placeholder="اكتب ملاحظتك هنا...">'+esc(note)+'</textarea><small id="stNoteStatus" role="status">تُحفظ تلقائياً على هذا الجهاز.</small></article><article class="st-tool-card"><h3>🧠 مراجعة متباعدة</h3><p>راجع الدرس بعد يوم، ثم 3 أيام، ثم 7 أيام.</p><div class="st-review-date"><strong>'+(r?new Date(r.nextAt).toLocaleDateString("ar-MA"):"غداً")+'</strong><span>موعد المراجعة التالية</span></div><button type="button" class="st-review-button" id="stReview">راجعت الفكرة اليوم</button><small id="stReviewStatus" role="status">لا تمنح المراجعة XP ولا تغيّر نتائج الاختبارات.</small></article></div><article class="st-glossary"><div><span class="eyebrow">SMART GLOSSARY</span><h3>قاموس المصطلحات</h3><p>ابحث عن المصطلح الإنجليزي واقرأ معناه وتطبيقه.</p></div><input id="stGlossarySearch" type="search" placeholder="ابحث عن Part أو Food Cost..." aria-label="ابحث في المصطلحات"><div class="st-term-list">'+TERMS.map(t=>'<details class="st-term"><summary><span dir="ltr">'+esc(t[0])+'</span><b>'+esc(t[1])+'</b></summary><p>'+esc(t[2])+'</p><small>'+esc(t[3])+'</small></details>').join("")+'</div><p class="st-glossary-foot">قاموس تأسيسي أولي؛ الأمثلة التطبيقية مستندة إلى محتوى BM-005 المعتمد.</p></article></section>';}

function flashcardMarkup(){
return '<section class="st-flashcards" aria-labelledby="stFlashTitle"><div class="st-flash-head"><div><span class="eyebrow">ACTIVE RECALL · 15 TERMS</span><h3 id="stFlashTitle">بطاقات الاستدعاء النشط</h3><p>اختبر ذاكرتك قبل كشف التعريف. صنّف المصطلح ثم انتقل للبطاقة التالية.</p></div><div class="st-flash-counts"><span><b id="stMasteredCount">'+state.masteredTerms.length+'</b> أتقنت</span><span><b id="stRevisitCount">'+state.revisitTerms.length+'</b> للمراجعة</span></div></div><div class="st-flash-card" id="stFlashCard" data-index="0"><div class="st-flash-meta"><span id="stFlashPosition">01 / '+TERMS.length+'</span><span>ENGLISH → ARABIC</span></div><strong id="stFlashTerm" dir="ltr">'+esc(TERMS[0][0])+'</strong><div class="st-flash-answer" id="stFlashAnswer" hidden><b>'+esc(TERMS[0][1])+'</b><p>'+esc(TERMS[0][2])+'</p><small>'+esc(TERMS[0][3])+'</small></div><button type="button" id="stFlashReveal" class="st-flash-reveal" aria-expanded="false">اكشف المعنى</button></div><div class="st-flash-actions"><button type="button" id="stFlashAgain" disabled>↺ أحتاج إلى مراجعتها</button><button type="button" id="stFlashKnown" disabled>✓ أتقنت المصطلح</button></div><div class="st-flash-navigation"><button type="button" id="stFlashPrev" disabled>السابق</button><div class="st-flash-track" role="progressbar" aria-label="موضع بطاقة المصطلح" aria-valuemin="1" aria-valuemax="'+TERMS.length+'" aria-valuenow="1"><i id="stFlashProgress" style="width:'+(100/TERMS.length)+'%"></i></div><button type="button" id="stFlashNext">التالي ←</button></div><p class="st-flash-status" id="stFlashStatus" role="status" aria-live="polite">حاول شرح المصطلح بصوتك قبل كشف الإجابة.</p></section>';
}
function mountFlashcards(container){
let index=0,revealed=false;
const $=id=>container.querySelector("#"+id);
function render(){
const t=TERMS[index];$("stFlashPosition").textContent=String(index+1).padStart(2,"0")+" / "+TERMS.length;
$("stFlashTerm").textContent=t[0];$("stFlashAnswer").hidden=!revealed;
$("stFlashAnswer").innerHTML='<b>'+esc(t[1])+'</b><p>'+esc(t[2])+'</p><small>'+esc(t[3])+'</small>';
$("stFlashReveal").hidden=revealed;$("stFlashReveal").setAttribute("aria-expanded",String(revealed));
$("stFlashAgain").disabled=!revealed;$("stFlashKnown").disabled=!revealed;
$("stFlashPrev").disabled=index===0;$("stFlashNext").disabled=index===TERMS.length-1;
$("stFlashProgress").style.width=((index+1)/TERMS.length*100)+"%";
container.querySelector(".st-flash-navigation [role=progressbar]").setAttribute("aria-valuenow",String(index+1));
$("stMasteredCount").textContent=state.masteredTerms.length;$("stRevisitCount").textContent=state.revisitTerms.length;
}
function classify(known){
const term=TERMS[index][0];
state.masteredTerms=state.masteredTerms.filter(x=>x!==term);
state.revisitTerms=state.revisitTerms.filter(x=>x!==term);
(known?state.masteredTerms:state.revisitTerms).push(term);
const ok=save();
$("stFlashStatus").textContent=ok?(known?"تم تسجيل إتقان "+term+". انتقل إلى البطاقة التالية.":"أضيف "+term+" إلى قائمة المراجعة. كررها بعد قليل."):"تعذر حفظ التصنيف على هذا الجهاز.";
render();
}
$("stFlashReveal").addEventListener("click",()=>{revealed=true;render();});
$("stFlashKnown").addEventListener("click",()=>classify(true));
$("stFlashAgain").addEventListener("click",()=>classify(false));
$("stFlashPrev").addEventListener("click",()=>{index=Math.max(0,index-1);revealed=false;render();});
$("stFlashNext").addEventListener("click",()=>{index=Math.min(TERMS.length-1,index+1);revealed=false;render();});
render();
}
function mountLesson(code,title,container){if(!container)return;container.innerHTML=lessonPanel(code,title)+flashcardMarkup();mountFlashcards(container);const b=container.querySelector("#stBookmark");b.addEventListener("click",()=>{const i=state.bookmarks.indexOf(code);if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.push(code);save();b.classList.toggle("active",i<0);b.setAttribute("aria-pressed",String(i<0));b.textContent=i<0?"★ محفوظ":"☆ احفظ الدرس";});container.querySelector("#stNote").addEventListener("input",e=>{state.notes[code]=e.target.value;const ok=save();container.querySelector("#stNoteStatus").textContent=ok?"تم حفظ الملاحظة على هذا الجهاز.":"تعذر الحفظ؛ انسخ ملاحظتك احتياطياً.";});container.querySelector("#stReview").addEventListener("click",()=>{const r=review(code);container.querySelector("#stReviewStatus").textContent="تم تسجيل المراجعة. موعدك القادم: "+new Date(r.nextAt).toLocaleDateString("ar-MA")+".";});container.querySelector("#stGlossarySearch").addEventListener("input",e=>{const q=e.target.value.trim().toLowerCase();container.querySelectorAll(".st-term").forEach((el,i)=>{const t=TERMS[i];el.hidden=!!q&&!(t[0].toLowerCase().includes(q)||t[1].includes(q)||t[2].toLowerCase().includes(q));});});}
root.KPI_STUDY_TOOLS=Object.freeze({mountLesson,dashboardWidget,dueItems,terms:TERMS,flashcardMarkup,recordTerm:(term,known)=>{if(!TERMS.some(t=>t[0]===term))return false;state.masteredTerms=state.masteredTerms.filter(x=>x!==term);state.revisitTerms=state.revisitTerms.filter(x=>x!==term);(known?state.masteredTerms:state.revisitTerms).push(term);return save();}});
})(window);