(function(global){
"use strict";
const definitions={
"cogs":{formula:"Opening Inventory + Purchases − Closing Inventory",unit:"Currency",fields:["openingInventory","purchases","closingInventory"],run:v=>v.openingInventory+v.purchases-v.closingInventory},
"food-cost":{formula:"Food COGS ÷ Food Net Sales × 100",unit:"%",fields:["openingInventory","purchases","closingInventory","netSales"],run:v=>((v.openingInventory+v.purchases-v.closingInventory)/v.netSales)*100},
"beverage-cost":{formula:"Beverage COGS ÷ Beverage Net Sales × 100",unit:"%",fields:["openingInventory","purchases","closingInventory","netSales"],run:v=>((v.openingInventory+v.purchases-v.closingInventory)/v.netSales)*100},
"gross-profit":{formula:"Net Sales − COGS",unit:"Currency",fields:["netSales","cogs"],run:v=>v.netSales-v.cogs},
"gross-profit-margin":{formula:"Gross Profit ÷ Net Sales × 100",unit:"%",fields:["grossProfit","netSales"],run:v=>v.grossProfit/v.netSales*100},
"labor-cost":{formula:"Included Labor Cost ÷ Net Sales × 100",unit:"%",fields:["includedLaborCost","netSales"],run:v=>v.includedLaborCost/v.netSales*100},
"prime-cost":{formula:"COGS + Included Labor Cost",unit:"Currency",fields:["cogs","includedLaborCost"],run:v=>v.cogs+v.includedLaborCost},
"prime-cost-percent":{formula:"Prime Cost ÷ Net Sales × 100",unit:"%",fields:["primeCost","netSales"],run:v=>v.primeCost/v.netSales*100},
"average-check":{formula:"Net Sales ÷ Number of Checks",unit:"Currency / check",fields:["netSales","numberOfChecks"],run:v=>v.netSales/v.numberOfChecks},
"sales-mix":{formula:"Selected mode: Item Units ÷ Total Units × 100 OR Item Net Sales ÷ Total Net Sales × 100",unit:"%",fields:[],run:v=>{if(v.mode==="unit")return v.itemUnits/v.totalUnits*100;if(v.mode==="revenue")return v.itemNetSales/v.totalNetSales*100;throw Error("Select Unit Mix or Revenue Mix.");}},
"contribution-margin":{formula:"Selling Price − Variable Cost",unit:"Currency / unit",fields:["sellingPrice","variableCost"],run:v=>v.sellingPrice-v.variableCost},
"break-even-sales":{formula:"Fixed Costs ÷ Contribution Margin Ratio; CM Ratio = Total Contribution Margin ÷ Net Sales",unit:"Currency",fields:["fixedCosts","totalContributionMargin","netSales"],run:v=>{const ratio=v.totalContributionMargin/v.netSales;if(ratio<=0)throw Error("Contribution Margin Ratio must be positive and non-zero.");return v.fixedCosts/ratio;}},
"inventory-turnover":{formula:"Period COGS ÷ Average Inventory; Average Inventory = (Opening + Closing) ÷ 2",unit:"Times per period",fields:["periodCogs","openingInventory","closingInventory"],run:v=>{const avg=(v.openingInventory+v.closingInventory)/2;return v.periodCogs/avg;}},
"waste":{formula:"Recorded Waste Cost ÷ Food & Beverage COGS × 100",unit:"%",fields:["recordedWasteCost","foodBeverageCogs"],run:v=>v.recordedWasteCost/v.foodBeverageCogs*100},
"revpash":{formula:"Net F&B Revenue ÷ Available Seat Hours; Available Seat Hours = Available Seats × Operating Hours",unit:"Currency / available seat hour",fields:["netFandbRevenue","availableSeats","operatingHours"],run:v=>v.netFandbRevenue/(v.availableSeats*v.operatingHours)}
};
const labels={openingInventory:"Opening Inventory",purchases:"Purchases",closingInventory:"Closing Inventory",netSales:"Net Sales",cogs:"COGS",grossProfit:"Gross Profit",includedLaborCost:"Included Labor Cost",primeCost:"Prime Cost",numberOfChecks:"Number of Checks",itemUnits:"Item Units",totalUnits:"Total Units",itemNetSales:"Item Net Sales",totalNetSales:"Total Net Sales",sellingPrice:"Selling Price",variableCost:"Variable Cost",fixedCosts:"Fixed Costs",totalContributionMargin:"Total Contribution Margin",periodCogs:"Period COGS",recordedWasteCost:"Recorded Waste Cost",foodBeverageCogs:"Food & Beverage COGS",netFandbRevenue:"Net F&B Revenue",availableSeats:"Available Seats",operatingHours:"Operating Hours"};
function calculate(id,raw,context){
 const d=definitions[id];if(!d)return {ok:false,status:"not-supported",messages:["Unknown KPI identifier."]};
 const v={},messages=[];
 const fields=id==="sales-mix"?(raw.mode==="unit"?["itemUnits","totalUnits"]:raw.mode==="revenue"?["itemNetSales","totalNetSales"]:[]):d.fields;
 if(id==="sales-mix"&&!raw.mode)messages.push("Select and label Sales Mix as Unit Mix or Revenue Mix.");
 for(const key of fields){
  const x=raw[key];
  if(x===undefined||x===null||String(x).trim()===""){messages.push("Missing required input: "+labels[key]+".");continue;}
  const n=Number(x);if(!Number.isFinite(n)){messages.push("Non-numeric input: "+labels[key]+".");continue;}
  if(n<0){messages.push("Negative values are not permitted for "+labels[key]+".");continue;}
  v[key]=n;
 }
 if(!context||!context.period||!context.scope||!context.currency)messages.push("Reporting period, outlet scope, and currency are required.");
 if(messages.length)return {ok:false,status:"invalid-input",messages};
 if(context.periodStart&&context.periodEnd&&context.periodEnd<context.periodStart)return {ok:false,status:"invalid-period",messages:["Reporting period end precedes its start."]};
 if(["food-cost","beverage-cost","gross-profit-margin","labor-cost","prime-cost-percent","average-check"].includes(id)&&v.netSales===0)return {ok:false,status:"not-calculable",messages:["Net Sales is zero; division by zero is not permitted."]};
 if(id==="sales-mix"&&((raw.mode==="unit"&&v.totalUnits===0)||(raw.mode==="revenue"&&v.totalNetSales===0)))return {ok:false,status:"not-calculable",messages:["Selected Sales Mix denominator is zero."]};
 if(id==="average-check"&&v.numberOfChecks===0)return {ok:false,status:"not-calculable",messages:["Number of Checks is zero."]};
 if(id==="waste"&&v.foodBeverageCogs===0)return {ok:false,status:"not-calculable",messages:["Food & Beverage COGS denominator is zero."]};
 if(id==="revpash"&&(v.availableSeats===0||v.operatingHours===0))return {ok:false,status:"not-calculable",messages:["Available Seat Hours must be greater than zero."]};
 if(id==="inventory-turnover"&&(v.openingInventory+v.closingInventory)===0)return {ok:false,status:"not-calculable",messages:["Average Inventory is zero."]};
 try{
  const result=d.run(v);if(!Number.isFinite(result))return {ok:false,status:"not-calculable",messages:["The calculation did not produce a finite result."]};
  const assumptions=[];if(id==="waste")assumptions.push("KPI Academy internal denominator: Food & Beverage COGS.");
  if(id==="sales-mix")assumptions.push(raw.mode==="unit"?"Mode: Unit Mix.":"Mode: Revenue Mix.");
  if(id==="labor-cost")assumptions.push("Included labor follows the outlet policy supplied by the operator.");
  if(id==="revpash")assumptions.push("Available seats and operating hours must already account for unavailable seats/time.");
  return {ok:true,status:"calculated",kpiId:id,name:id==="sales-mix"?(raw.mode==="unit"?"Sales Mix — Unit Mix":"Sales Mix — Revenue Mix"):id,formula:d.formula,inputs:v,units:d.unit,period:context.period,scope:context.scope,currency:context.currency,assumptions,result,displayResult:result.toLocaleString("en-US",{maximumFractionDigits:2})};
 }catch(e){return {ok:false,status:"not-calculable",messages:[e.message]};}
}
global.KPIEngine=Object.freeze({calculate,definitions:Object.keys(definitions)});
})(window);