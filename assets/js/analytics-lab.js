(function(){
"use strict";
const sample=[
 {period:"Sample Period 01",openingInventory:18000,purchases:42000,closingInventory:16000,netSales:120000,labor:36000},
 {period:"Sample Period 02",openingInventory:16000,purchases:47000,closingInventory:17000,netSales:132000,labor:39600},
 {period:"Sample Period 03",openingInventory:17000,purchases:45000,closingInventory:18000,netSales:126000,labor:39000}
];
const metrics={
 grossProfit:{label:"Gross Profit",unit:"MAD",format:v=>money(v),description:"Net Sales − COGS",meaning:"يوضح المبلغ المتبقي بعد خصم COGS من Net Sales. لا يمثل صافي الربح ولا يشمل جميع المصروفات.",limit:"لا يمكن استخدام Gross Profit وحده للحكم على الربحية النهائية."},
 grossProfitMargin:{label:"Gross Profit Margin",unit:"%",format:v=>pct(v),description:"Gross Profit ÷ Net Sales × 100",meaning:"يقيس نسبة صافي المبيعات المتبقية بعد COGS عبر الفترات المعروضة.",limit:"لا توجد هنا Benchmark؛ المقارنة وصفية ولا تثبت أن المستوى جيد أو سيئ."},
 laborCost:{label:"Labor Cost %",unit:"%",format:v=>pct(v),description:"Included Labor Cost ÷ Net Sales × 100",meaning:"يقارن تكلفة العمالة المشمولة بصافي المبيعات في الفترة نفسها.",limit:"النتيجة تعتمد على تعريف Included Labor Cost وسياسة المنشأة."},
 primeCost:{label:"Prime Cost",unit:"MAD",format:v=>money(v),description:"COGS + Included Labor Cost",meaning:"يجمع COGS وتكلفة العمالة المشمولة وفق التعريف المستخدم في السجل.",limit:"لا يشمل تلقائياً جميع المصروفات التشغيلية."},
 primeCostPercent:{label:"Prime Cost %",unit:"%",format:v=>pct(v),description:"Prime Cost ÷ Net Sales × 100",meaning:"يعرض Prime Cost كنسبة من Net Sales للفترة نفسها.",limit:"لا توجد Benchmark مرفقة، ولا يجوز تفسير النسبة خارج سياق المنشأة."}
};
function money(v){return v.toLocaleString("en-US",{maximumFractionDigits:0})+" MAD";}
function pct(v){return v.toFixed(2)+"%";}
function calculatePeriod(row){
 const context={period:row.period,scope:"Educational sample outlet",currency:"MAD"};
 const cogs=window.KPIEngine.calculate("cogs",{openingInventory:row.openingInventory,purchases:row.purchases,closingInventory:row.closingInventory},context);
 if(!cogs.ok)throw new Error("Sample COGS calculation failed");
 const gross=window.KPIEngine.calculate("gross-profit",{netSales:row.netSales,cogs:cogs.result},context);
 const margin=window.KPIEngine.calculate("gross-profit-margin",{grossProfit:gross.result,netSales:row.netSales},context);
 const labor=window.KPIEngine.calculate("labor-cost",{includedLaborCost:row.labor,netSales:row.netSales},context);
 const prime=window.KPIEngine.calculate("prime-cost",{cogs:cogs.result,includedLaborCost:row.labor},context);
 const primePercent=window.KPIEngine.calculate("prime-cost-percent",{primeCost:prime.result,netSales:row.netSales},context);
 const all=[gross,margin,labor,prime,primePercent];
 if(all.some(x=>!x.ok))throw new Error("Sample KPI calculation failed");
 return {period:row.period,netSales:row.netSales,cogs:cogs.result,grossProfit:gross.result,grossProfitMargin:margin.result,laborCost:labor.result,primeCost:prime.result,primeCostPercent:primePercent.result};
}
function series(){return sample.map(calculatePeriod);}
function chart(metricKey){
 const spec=metrics[metricKey]||metrics.grossProfitMargin,rows=series(),values=rows.map(x=>x[metricKey]),max=Math.max(...values)*1.18||1;
 const bars=rows.map((row,i)=>{const y=42+i*66,w=values[i]/max*340;return '<g><text x="12" y="'+(y+18)+'" text-anchor="start" class="ka-chart-label">'+row.period.replace("Sample Period ","P") +'</text><rect x="130" y="'+y+'" width="340" height="24" rx="6" class="ka-chart-track"/><rect x="130" y="'+y+'" width="'+w.toFixed(2)+'" height="24" rx="6" class="ka-chart-bar"/><text x="'+Math.min(130+w+30,500)+'" y="'+(y+17)+'" class="ka-chart-value">'+spec.format(values[i])+'</text></g>';}).join("");
 return '<svg viewBox="0 0 720 250" role="img" aria-label="'+spec.label+' comparison across three educational sample periods"><line x1="130" y1="25" x2="130" y2="235" class="ka-chart-axis"/>'+bars+'</svg>';
}
function table(){
 return series().map(row=>'<tr><th scope="row">'+row.period+'</th><td>'+money(row.netSales)+'</td><td>'+money(row.cogs)+'</td><td>'+money(row.grossProfit)+'</td><td>'+pct(row.grossProfitMargin)+'</td><td>'+pct(row.laborCost)+'</td><td>'+pct(row.primeCostPercent)+'</td></tr>').join("");
}
function view(){
 return '<div class="ka-page-intro"><span class="eyebrow">ANALYTICS LAB · EDUCATIONAL DATA</span><h1>مختبر التحليل</h1><p>قارن المؤشرات عبر فترات تدريبية، واقرأ الاتجاهات قبل الانتقال إلى تفسير القرار الإداري.</p></div>'+
 '<section class="ka-sample-notice"><strong>بيانات تعليمية افتراضية</strong><span>جميع القيم التالية صُنعت لأغراض التعلم واختبار الواجهة. ليست بيانات مطعم حقيقي ولا أداءً تشغيلياً فعلياً.</span></section>'+
 '<section class="ka-analytics-panel"><div class="ka-analytics-head"><div><span class="eyebrow">PERIOD COMPARISON</span><h2>مقارنة المؤشرات</h2><p>النطاق: Educational sample outlet · العملة: MAD · الفترات: ثلاث فترات تدريبية</p></div><label class="ka-analytics-select">المؤشر<select id="analyticsMetric"><option value="grossProfitMargin">Gross Profit Margin</option><option value="grossProfit">Gross Profit</option><option value="laborCost">Labor Cost %</option><option value="primeCost">Prime Cost</option><option value="primeCostPercent">Prime Cost %</option></select></label></div>'+
 '<div id="analyticsChart" class="ka-analytics-chart">'+chart("grossProfitMargin")+'</div><div class="ka-analytics-explanation" id="analyticsExplanation"><strong>'+metrics.grossProfitMargin.description+'</strong><p>'+metrics.grossProfitMargin.meaning+'</p><small>'+metrics.grossProfitMargin.limit+'</small></div></section>'+
 '<section class="ka-analytics-panel"><div class="ka-section-heading"><div><span class="eyebrow">SOURCE DATA & CALCULATED OUTPUT</span><h2>جدول المقارنة</h2><p>المخرجات مشتقة من المدخلات الافتراضية عبر KPIEngine.</p></div></div><div class="table-scroll" role="region" aria-label="جدول نتائج البيانات التعليمية" tabindex="0"><table class="ka-analytics-table"><thead><tr><th>الفترة</th><th>Net Sales</th><th>COGS</th><th>Gross Profit</th><th>Gross Margin</th><th>Labor Cost</th><th>Prime Cost %</th></tr></thead><tbody>'+table()+'</tbody></table></div><p class="ka-analytics-foot">مصدر البيانات: مجموعة تدريبية داخلية ثابتة. الصيغ من سجل KPI Academy؛ لا توجد معايير مقارنة خارجية أو بيانات حية.</p></section>';
}
function mount(root){
 const select=root.querySelector("#analyticsMetric");if(!select)return;
 select.addEventListener("change",()=>{
  const key=select.value,spec=metrics[key]||metrics.grossProfitMargin;
  root.querySelector("#analyticsChart").innerHTML=chart(key);
  const box=root.querySelector("#analyticsExplanation");
  box.innerHTML="<strong>"+spec.description+"</strong><p>"+spec.meaning+"</p><small>"+spec.limit+"</small>";
 });
}
window.KPI_ANALYTICS={view,mount,series,metrics};
})();