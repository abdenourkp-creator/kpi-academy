(function(){
"use strict";
const stages=[
 {id:"context",label:"Business Context",ar:"سياق العمل",detail:"يُعرض وصف المنشأة، نموذج التشغيل، الفترة، والنطاق الذي تدور فيه الحالة بعد اعتماد سيناريو موثق."},
 {id:"evidence",label:"Available Evidence",ar:"المعلومات المتاحة",detail:"تُعرض بيانات الحالة ومؤشرات KPI ذات الصلة مع وحداتها وفتراتها ومصادرها وحدودها."},
 {id:"decision",label:"Management Decision",ar:"القرار الإداري",detail:"يختار المتعلم إجراءً من بدائل مكتوبة ومعتمدة، أو يقدم تبريراً منظماً للقرار."},
 {id:"consequence",label:"Possible Consequences",ar:"العواقب المحتملة",detail:"تُشرح النتائج المتوقعة لكل اختيار وفق منطق الحالة، دون ادعاء أن التوقع يمثل نتيجة فعلية."},
 {id:"reflection",label:"Reflection & Feedback",ar:"التأمل والتغذية الراجعة",detail:"تُعرض أسباب القرار الأقوى، ومواطن الضعف، والأسئلة التي ينبغي أن يراجعها المدير."}
];
function view(){
 return '<div class="ka-page-intro"><span class="eyebrow">MANAGEMENT SIMULATOR · SCENARIO WORKSPACE</span><h1>محاكاة الإدارة</h1><p>بيئة منظمة للتفكير في القرارات الإدارية باستخدام بيانات ومؤشرات موثقة.</p></div>'+
 '<section class="ka-simulator-empty"><div class="ka-simulator-mark" aria-hidden="true">01</div><div><span class="eyebrow">CONTENT DEPENDENCY</span><h2>مساحة المحاكاة جاهزة — السيناريوهات لم تعتمد بعد</h2><p>نطاق MVP يذكر ثلاثة سيناريوهات إدارية، لكن مصادر KPI Academy التي تمت مراجعتها لا تحتوي حالياً على نصوص حالات مكتملة أو بياناتها أو إجاباتها المعتمدة. لن ننشئ حالات وهمية أو نمنح XP قبل اعتماد المحتوى.</p></div></section>'+
 '<section class="ka-simulator-panel"><div class="ka-section-heading"><div><span class="eyebrow">REUSABLE SCENARIO STRUCTURE</span><h2>بنية الحالة التعليمية</h2><p>هذه مراحل واجهة قابلة لإعادة الاستخدام، وليست سيناريوهات فعلية.</p></div></div>'+
 '<div class="ka-simulator-stages" role="tablist" aria-label="مراحل المحاكاة">'+stages.map((s,i)=>'<button type="button" role="tab" aria-selected="'+(i===0?"true":"false")+'" class="'+(i===0?"active":"")+'" data-simulator-stage="'+s.id+'"><small>0'+(i+1)+'</small><span>'+s.ar+'</span></button>').join("")+'</div>'+
 '<article class="ka-simulator-stage-detail" id="simulatorStageDetail" aria-live="polite"><span class="eyebrow">BUSINESS CONTEXT</span><h3>'+stages[0].label+' · '+stages[0].ar+'</h3><p>'+stages[0].detail+'</p></article>'+
 '<p class="ka-simulator-note">لا توجد حالة نشطة، ولا يتم تسجيل نتيجة أو تقدم أو XP في هذه المساحة حتى اعتماد محتوى السيناريو وقواعد التقييم.</p></section>';
}
function mount(root){
 const buttons=Array.from(root.querySelectorAll("[data-simulator-stage]")),detail=root.querySelector("#simulatorStageDetail");
 buttons.forEach(button=>button.addEventListener("click",()=>{
  const stage=stages.find(item=>item.id===button.dataset.simulatorStage);if(!stage)return;
  buttons.forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-selected",String(active));});
  detail.innerHTML='<span class="eyebrow">'+stage.label.toUpperCase()+'</span><h3>'+stage.label+' · '+stage.ar+'</h3><p>'+stage.detail+'</p>';
 }));
}
window.KPI_SIMULATOR={view,mount,stages};
})();