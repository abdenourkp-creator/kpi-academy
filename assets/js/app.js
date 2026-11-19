const MODULES_URL="data/modules.json";
const app=document.getElementById("app");
const pageTitle=document.getElementById("pageTitle");
const titles={dashboard:"لوحة التحكم",modules:"الوحدات التعليمية",calculator:"حاسبة المؤشرات",analytics:"مختبر التحليل",simulator:"محاكاة الإدارة",progress:"التقييم والتقدم"};
let modules=[];

async function loadModules(){
  try{
    const response=await fetch(MODULES_URL);
    if(!response.ok) throw new Error("Unable to load module data");
    modules=await response.json();
    render();
  }catch(error){
    app.innerHTML='<div class="empty-card"><h2>تعذر تحميل بيانات المنهج</h2><p>تحقق من وجود ملف data/modules.json ثم أعد تحميل الصفحة.</p></div>';
    console.error(error);
  }
}
function moduleCard(module){
  return '<article class="module-card"><div class="module-top"><span class="module-number">'+module.code+'</span><span class="module-icon">'+module.icon+'</span></div><h3>'+module.title+'</h3><p>'+module.description+'</p><div class="module-footer"><span>'+module.statusLabel+'</span><a class="text-link" href="#module-'+module.id+'" data-module="'+module.id+'">عرض الوحدة ←</a></div></article>';
}
function dashboard(){
  return '<div class="welcome-panel"><div class="welcome-copy"><span class="eyebrow">KPI ACADEMY · PROFESSIONAL LEARNING</span><h1>حوّل الأرقام إلى قرارات إدارية.</h1><p>منهج عملي لفهم الرياضيات التجارية والمحاسبة ومؤشرات أداء المطاعم، من الأساس الحسابي إلى التفكير الإداري.</p></div><div class="welcome-tag">Learn · Calculate · Analyze · Manage</div></div>'+
  '<div class="stats-grid"><article class="stat-card"><div class="stat-label">الوحدات الأساسية</div><div class="stat-value">03</div><div class="stat-foot">MVP Knowledge Modules</div></article><article class="stat-card"><div class="stat-label">مؤشرات الأداء في السجل</div><div class="stat-value">15</div><div class="stat-foot">Restaurant KPI Registry</div></article><article class="stat-card"><div class="stat-label">دروس الرياضيات التجارية</div><div class="stat-value">32</div><div class="stat-foot">Foundation · 8 Chapters</div></article></div>'+
  '<h2 class="section-title">ابدأ من وحدات المعرفة</h2><div class="module-grid">'+modules.map(moduleCard).join("")+'</div><div class="content-card"><h2>منهجية الأكاديمية</h2><p>لا نكتفي بعرض نتيجة المؤشر. نتعلم تعريفه، ومدخلاته، وأساسه الرياضي، ثم نفسر أثره التشغيلي وحدود ما يمكن أن يخبرنا به.</p></div>';
}
function modulesView(){
  return '<div class="page-heading"><div><span class="eyebrow">KNOWLEDGE ARCHITECTURE</span><h1>الوحدات التعليمية</h1><p>ثلاث وحدات مترابطة تبني القدرة على الحساب، وفهم الأداء المالي، وتحليل عمليات المطاعم.</p></div></div><div class="module-grid">'+modules.map(moduleCard).join("")+'</div>';
}
function moduleDetail(id){
  const module=modules.find(item=>item.id===id);
  if(!module) return modulesView();
  let html='<div class="page-heading"><div><span class="eyebrow">'+module.code+'</span><h1>'+module.title+'</h1><p>'+module.description+'</p></div><a class="text-link" href="#modules">← كل الوحدات</a></div>';
  html+='<div class="content-card"><h2>مخرجات التعلم</h2><p>'+module.outcomes.join(" · ")+'</p></div><h2 class="section-title">الفصول</h2>';
  if(module.chapters.length){
    module.chapters.forEach((chapter,index)=>{html+='<article class="content-card"><span class="module-number">CHAPTER '+String(index+1).padStart(2,"0")+'</span><h2>'+chapter.title+'</h2><p>'+chapter.description+'</p><span class="tag">'+chapter.lessonCount+' دروس</span></article>';});
  }else{
    html+='<div class="empty-card"><h2>المحتوى التفصيلي قيد النقل</h2><p>لن نعرض عناوين أو دروساً مختصرة على أنها محتوى مكتمل. ستُضاف المواد بعد ترحيل صفحات المصدر والتحقق منها.</p></div>';
  }
  return html;
}
function placeholder(view){
  const copy={
    calculator:["حاسبة المؤشرات","ستُبنى الحاسبة على سجل KPI المعتمد، مع عرض المعادلة والمدخلات والوحدات والفترة والافتراضات ورسائل التحقق لكل نتيجة."],
    analytics:["مختبر التحليل","مساحة لتحليل الاتجاهات والمقارنات وقراءة الأرقام ضمن سياق تشغيلي واضح."],
    simulator:["محاكاة الإدارة","ثلاث حالات إدارية تطبيقية ضمن نطاق النسخة الأولية، تُبنى على بيانات وسيناريوهات موثقة."],
    progress:["التقييم والتقدم","سيُسجل التقدم ونقاط XP بناءً على دليل إكمال فعلي. فتح الدرس وحده لا يمنح نقاطاً أو إتماماً."]
  };
  return '<div class="page-heading"><div><span class="eyebrow">IN DEVELOPMENT</span><h1>'+copy[view][0]+'</h1><p>'+copy[view][1]+'</p></div></div><div class="empty-card"><div class="empty-symbol">◌</div><h2>هذه المساحة لم تُنفذ بعد</h2><p>نحن نبنيها على مواصفات KPI Academy المعتمدة، ولن نعرض وظائف وهمية أو نتائج غير محسوبة.</p></div>';
}
function render(){
  const hash=location.hash.replace("#","");
  const match=hash.match(/^module-(.+)$/);
  const view=match?"modules":(titles[hash]?hash:"dashboard");
  pageTitle.textContent=match?"تفاصيل الوحدة":titles[view];
  document.querySelectorAll(".nav-link").forEach(link=>link.classList.toggle("active",link.dataset.view===view));
  app.innerHTML=match?moduleDetail(match[1]):view==="dashboard"?dashboard():view==="modules"?modulesView():placeholder(view);
}
document.addEventListener("click",event=>{
  const link=event.target.closest("[data-module]");
  if(link){event.preventDefault();location.hash="module-"+link.dataset.module;}
});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(link=>link.addEventListener("click",()=>document.getElementById("sidebar").classList.remove("open")));
window.addEventListener("hashchange",render);
loadModules();