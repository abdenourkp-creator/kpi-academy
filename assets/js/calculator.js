(function(){
"use strict";
const fieldDefs={
openingInventory:["Opening Inventory","قيمة المخزون الافتتاحي"],purchases:["Purchases","المشتريات"],closingInventory:["Closing Inventory","قيمة المخزون الختامي"],netSales:["Net Sales","صافي المبيعات"],cogs:["COGS","تكلفة البضاعة المباعة"],grossProfit:["Gross Profit","مجمل الربح"],includedLaborCost:["Included Labor Cost","تكلفة العمالة المشمولة"],primeCost:["Prime Cost","التكلفة الأولية"],numberOfChecks:["Number of Checks","عدد الفواتير"],itemUnits:["Item Units","وحدات الصنف"],totalUnits:["Total Units","إجمالي الوحدات"],itemNetSales:["Item Net Sales","صافي مبيعات الصنف"],totalNetSales:["Total Net Sales","إجمالي صافي المبيعات"],sellingPrice:["Selling Price","سعر البيع"],variableCost:["Variable Cost","التكلفة المتغيرة"],fixedCosts:["Fixed Costs","التكاليف الثابتة"],totalContributionMargin:["Total Contribution Margin","إجمالي هامش المساهمة"],periodCogs:["Period COGS","تكلفة البضاعة للفترة"],recordedWasteCost:["Recorded Waste Cost","تكلفة الهدر المسجلة"],foodBeverageCogs:["Food & Beverage COGS","تكلفة الأغذية والمشروبات المباعة"],netFandbRevenue:["Net F&B Revenue","صافي إيرادات الأغذية والمشروبات"],availableSeats:["Available Seats","عدد المقاعد المتاحة"],operatingHours:["Operating Hours","ساعات التشغيل"]};
const configs={
"cogs":["openingInventory","purchases","closingInventory"],
"food-cost":["openingInventory","purchases","closingInventory","netSales"],
"beverage-cost":["openingInventory","purchases","closingInventory","netSales"],
"gross-profit":["netSales","cogs"],"gross-profit-margin":["grossProfit","netSales"],
"labor-cost":["includedLaborCost","netSales"],"prime-cost":["cogs","includedLaborCost"],
"prime-cost-percent":["primeCost","netSales"],"average-check":["netSales","numberOfChecks"],
"sales-mix":[],"contribution-margin":["sellingPrice","variableCost"],
"break-even-sales":["fixedCosts","totalContributionMargin","netSales"],
"inventory-turnover":["periodCogs","openingInventory","closingInventory"],
"waste":["recordedWasteCost","foodBeverageCogs"],"revpash":["netFandbRevenue","availableSeats","operatingHours"]};
let registry=[];
const el=id=>document.getElementById(id);
function input(key){const f=fieldDefs[key];return '<label class="calc-field"><span>'+f[1]+' <small>'+f[0]+'</small></span><input type="number" min="0" step="any" name="'+key+'" inputmode="decimal" required placeholder="0.00"></label>';}
function fieldsFor(id,mode){if(id==="sales-mix")return mode==="unit"?["itemUnits","totalUnits"]:mode==="revenue"?["itemNetSales","totalNetSales"]:[];return configs[id]||[];}
function calculatorView(){
 const selected=el("kpiSelect")?.value||"cogs",item=registry.find(x=>x.id===selected);
 return '<div class="page-heading"><div><span class="eyebrow">DETERMINISTIC CALCULATION ENGINE</span><h1>حاسبة مؤشرات الأداء</h1><p>أدخل بيانات فترة واحدة ولنفس نطاق المنشأة. ستظهر المعادلة والمدخلات والافتراضات ونتيجة التحقق.</p></div></div>'+
 '<section class="calculator-layout"><form id="kpiForm" class="calc-form" novalidate><div class="calc-section"><label class="calc-field"><span>المؤشر <small>KPI</small></span><select id="kpiSelect">'+registry.map(x=>'<option value="'+x.id+'" '+(x.id===selected?"selected":"")+'>'+x.name+'</option>').join("")+'</select></label><div id="kpiFormula" class="formula-panel">'+(item?item.formula:"")+'</div></div>'+
 '<div class="calc-section"><h2>بيانات التقرير</h2><div class="calc-grid"><label class="calc-field"><span>الفترة <small>Reporting Period</small></span><input name="period" required placeholder="مثال: 2026-10"></label><label class="calc-field"><span>نطاق المنشأة <small>Outlet / Scope</small></span><input name="scope" required placeholder="مثال: Main Restaurant"></label><label class="calc-field"><span>العملة <small>Currency</small></span><select name="currency"><option value="MAD">MAD</option><option value="SAR">SAR</option><option value="AED">AED</option><option value="USD">USD</option><option value="EUR">EUR</option></select></label></div></div>'+
 '<div class="calc-section"><h2>مدخلات الحساب</h2><div id="kpiInputs" class="calc-grid"></div><div id="modeField"></div></div><button class="primary-action" type="submit">احسب المؤشر <span>→</span></button></form><aside class="calc-result" id="calcResult"><div class="result-empty">∑<h2>النتيجة ستظهر هنا</h2><p>أكمل المدخلات المطلوبة ثم نفّذ الحساب.</p></div></aside></section>';
}
function renderInputs(){
 const id=el("kpiSelect").value,mode=el("salesMode")?.value||"";
 const fields=fieldsFor(id,mode);
 el("kpiInputs").innerHTML=fields.map(input).join("");
 el("modeField").innerHTML=id==="sales-mix"?'<label class="calc-field"><span>نوع Sales Mix <small>Required calculation mode</small></span><select id="salesMode"><option value="">اختر نوع الحساب</option><option value="unit">Unit Mix</option><option value="revenue">Revenue Mix</option></select></label>':"";
 if(id==="sales-mix"&&!mode){el("kpiInputs").innerHTML='<p class="calc-hint">اختر Unit Mix أو Revenue Mix أولاً حتى تظهر المدخلات المناسبة.</p>';}
 el("kpiFormula").textContent=(registry.find(x=>x.id===id)||{}).formula||"";
}
function showResult(result){
 const box=el("calcResult");
 if(!result.ok){box.innerHTML='<div class="result-error"><span>!</span><h2>تعذر حساب المؤشر</h2><ul>'+result.messages.map(x=>"<li>"+x+"</li>").join("")+'</ul></div>';return;}
 const amount=result.result.toLocaleString("en-US",{maximumFractionDigits:2});
 box.innerHTML='<div class="result-success"><span class="result-label">CALCULATION RESULT</span><h2>'+result.name+'</h2><div class="result-number">'+amount+' <small>'+result.units+'</small></div><div class="result-details"><h3>Formula</h3><p>'+result.formula+'</p><h3>Inputs</h3><dl>'+Object.entries(result.inputs).map(([k,v])=>'<dt>'+((fieldDefs[k]||[k,k])[1])+'</dt><dd>'+v.toLocaleString("en-US")+'</dd>').join("")+'</dl><h3>Reporting context</h3><p>'+result.period+' · '+result.scope+' · '+result.currency+'</p><h3>Assumptions</h3><ul>'+(result.assumptions.length?result.assumptions.map(x=>"<li>"+x+"</li>").join(""):"<li>تم تطبيق تعريف KPI Academy دون افتراض إضافي.</li>")+'</ul></div><p class="result-foot">تم الاحتفاظ بالدقة الكاملة في الحساب؛ التقريب للعرض فقط.</p></div>';
}
async function init(){
 try{const r=await fetch("data/kpi-registry.json");if(!r.ok)throw Error("KPI registry not found");registry=(await r.json()).kpis;
 const root=el("app");if(!root)return;
 document.addEventListener("change",e=>{if(e.target.id==="kpiSelect"){renderInputs();el("calcResult").innerHTML='<div class="result-empty">∑<h2>النتيجة ستظهر هنا</h2><p>أكمل المدخلات المطلوبة ثم نفّذ الحساب.</p></div>';}if(e.target.id==="salesMode"){const value=e.target.value;renderInputs();const select=el("salesMode");if(select)select.value=value;}});
 document.addEventListener("submit",e=>{if(e.target.id!=="kpiForm")return;e.preventDefault();const form=new FormData(e.target),id=el("kpiSelect").value,raw={};for(const [key,value] of form.entries())if(!["period","scope","currency"].includes(key))raw[key]=value;if(id==="sales-mix")raw.mode=el("salesMode").value;const result=window.KPIEngine.calculate(id,raw,{period:form.get("period"),scope:form.get("scope"),currency:form.get("currency")});showResult(result);});
 window.calculatorView=calculatorView;
 }catch(e){console.error(e);}
}
init();
})();