(function(root){"use strict";
const D={
"BM-006":{title:"النسب المئوية والتطبيق التجاري",intro:"طبّق النسبة على السعر والميزانية والخصومات والقيم الصافية.",tasks:[
["احسب 12% من 5,000 MAD.",600,"5,000 × 0.12","حوّل 12% إلى 0.12 ثم اضربها في الأساس: 600 MAD."],
["سعر 350 MAD بعد خصم 15%؟",297.5,"350 × (1 − 0.15)","المتبقي 85% من السعر: 297.50 MAD."],
["حصة Food من ميزانية 40,000 MAD إذا خُصص لها 60%؟",24000,"40,000 × 0.60","حصة Food تساوي 24,000 MAD؛ وتتبقى 16,000 لبقية البنود."],
["قيمة 100 MAD بعد خصم 10% ثم 5%؟",85.5,"100 × 0.90 × 0.95","الخصم الثاني يطبق على السعر بعد الخصم الأول؛ الناتج 85.50."],
["استخرج Net من Gross 1,200 MAD مع معدل افتراضي 20%.",1000,"1,200 ÷ 1.20","القسمة تعيد Net إلى 1,000 MAD. المثال رياضي وليس إرشاداً ضريبياً."]]},
"BM-007":{title:"استرجاع القيمة الأصلية",intro:"استخرج العامل أولاً، ثم اقسم القيمة النهائية عليه.",tasks:[
["استخرج الأصل من 680 MAD بعد خصم 15%.",800,"680 ÷ 0.85","عامل السعر المتبقي 0.85؛ الأصل 800 MAD."],
["استخرج الأصل من 1,320 بعد زيادة 10%.",1200,"1,320 ÷ 1.10","عامل الزيادة 1.10؛ الأصل 1,200."],
["استخرج الأصل من 855 بعد خصمين 10% ثم 5%.",1000,"855 ÷ (0.90 × 0.95)","العامل المركب 0.855؛ الأصل 1,000."],
["استخرج Net من Gross 2,400 مع معدل افتراضي 20%.",2000,"2,400 ÷ 1.20","Net = 2,000. المعدل افتراضي للتدريب."],
["Supplier A: 1,020 بعد خصم 15% لثلاث حالات. ما Original Unit Price؟",400,"(1,020 ÷ 0.85) ÷ 3","الأصل الإجمالي 1,200؛ سعر الحالة 400 MAD."]]},
"BM-008":{title:"قياس الزيادة والانخفاض",intro:"احسب التغير من القيمة الأصلية، وافصل التغير النقدي عن النسبة.",tasks:[
["المبيعات من 80,000 إلى 100,000 MAD. ما نسبة التغير؟ أدخل العدد دون %.",25,"(100,000 − 80,000) ÷ 80,000 × 100","الزيادة 20,000؛ مقسومة على الأصل 80,000 تساوي +25%."],
["انخفضت تكلفة الهدر من 10,000 إلى 8,000 MAD. ما نسبة التغير؟",-20,"(8,000 − 10,000) ÷ 10,000 × 100","النتيجة −20%، أي انخفاض بنسبة 20%."],
["سعر 200 MAD بعد زيادة 10%؟",220,"200 × 1.10","السعر الجديد 220 MAD."],
["سعر 150 MAD بعد انخفاض 20%؟",120,"150 × 0.80","السعر الجديد 120 MAD."],
["قيمة 100 ارتفعت 20% ثم انخفضت 20%. ما القيمة النهائية؟",96,"100 × 1.20 × 0.80","التغير الثاني يطبق على 120؛ النتيجة 96 لا 100."]]},
"BM-009":{title:"النقاط المئوية مقابل التغير النسبي",intro:"افصل فرق النقاط المئوية عن نسبة التغير النسبي. إذا كان الأساس صفراً، فالتغير النسبي غير معرّف.",tasks:[
["ارتفع المعدل من 18% إلى 21%. ما فرق النقاط المئوية؟",3,"21% − 18%","الفرق +3 نقاط مئوية. التغير النسبي = (3 ÷ 18) × 100 ≈ +16.67%."],
["انخفض المعدل من 42% إلى 39%. ما فرق النقاط المئوية؟",-3,"39% − 42%","الفرق −3 نقاط مئوية. التغير النسبي = (−3 ÷ 42) × 100 ≈ −7.14%."],
["ارتفع المعدل من 0% إلى 5%. ما فرق النقاط المئوية؟",5,"5% − 0%","الفرق +5 نقاط مئوية. التغير النسبي غير معرّف لأن المقام القديم يساوي صفراً."],
["انخفض Food Cost من 32% إلى 28%. ما التغير بالنقاط المئوية؟",-4,"28% − 32%","انخفاض 4 نقاط مئوية. التغير النسبي = −12.5%."],
["ارتفع Occupancy من 70% إلى 77%. ما التغير بالنقاط المئوية؟",7,"77% − 70%","ارتفاع 7 نقاط مئوية. لا تخلط ذلك مع التغير النسبي البالغ 10%."]
]}}
};
function esc(v){return String(v==null?"":v).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function mount(code,rootEl){const d=D[code];if(!d||!rootEl)return false;let done={};
function render(){rootEl.innerHTML='<section class="pl-lab"><header class="pl-head"><span class="eyebrow">PRACTICE STUDIO · '+code+'</span><h3>'+d.title+'</h3><p>'+d.intro+'</p><div class="pl-score"><strong>'+Object.values(done).filter(Boolean).length+' / 5</strong><span>إجابات صحيحة</span></div></header><div class="pl-list">'+d.tasks.map((t,i)=>'<article class="pl-task" data-task="'+i+'"><span class="pl-index">0'+(i+1)+'</span><h4>'+t[0]+'</h4><label>إجابتك<input data-answer type="number" step="any" inputmode="decimal" placeholder="أدخل النتيجة"></label><button type="button" data-check>تحقق من الإجابة</button><div data-feedback class="pl-feedback" role="status" aria-live="polite"></div></article>').join("")+'</div><p class="pl-lab-disclaimer">مختبر تدريبي داخل الدرس؛ لا يمنح XP ولا يغيّر سجل التقييم الرسمي.</p><button type="button" class="pl-reset">إعادة المحاولة</button></section>';}
render();
rootEl.addEventListener("click",e=>{if(e.target.closest(".pl-reset")){done={};render();return;}const b=e.target.closest("[data-check]");if(!b)return;const card=b.closest(".pl-task"),i=+card.dataset.task,v=card.querySelector("input").value.trim(),fb=card.querySelector("[data-feedback]");if(v===""){fb.className="pl-feedback warning";fb.textContent="أدخل قيمة قبل التحقق.";return;}const ok=Number.isFinite(Number(v))&&Math.abs(Number(v)-d.tasks[i][1])<1e-6;done[i]=ok;fb.className="pl-feedback "+(ok?"correct":"incorrect");fb.innerHTML='<strong>'+(ok?"إجابة صحيحة":"ليست النتيجة الصحيحة بعد")+'</strong><span>المعادلة: <b dir="ltr">'+esc(d.tasks[i][2])+'</b></span><span>'+esc(d.tasks[i][3])+'</span>';rootEl.querySelector(".pl-score strong").textContent=Object.values(done).filter(Boolean).length+" / 5";});
rootEl.addEventListener("input",e=>{if(e.target.matches("[data-answer]")){const f=e.target.closest(".pl-task").querySelector("[data-feedback]");f.textContent="";f.className="pl-feedback";}});
return true;}
root.KPI_PERCENTAGE_LABS=Object.freeze({mount,lessons:Object.keys(D),data:D});
})(window);