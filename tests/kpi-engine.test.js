const assert=require("node:assert/strict");
global.window=global;
require("../assets/js/kpi-engine.js");
const ctx={period:"2026-10",scope:"Main Restaurant",currency:"MAD"};
const cases=[
["cogs",{openingInventory:1000,purchases:500,closingInventory:400},1100],
["food-cost",{openingInventory:1000,purchases:500,closingInventory:400,netSales:5500},20],
["beverage-cost",{openingInventory:300,purchases:200,closingInventory:100,netSales:2000},20],
["gross-profit",{netSales:10000,cogs:6000},4000],
["gross-profit-margin",{grossProfit:4000,netSales:10000},40],
["labor-cost",{includedLaborCost:2500,netSales:10000},25],
["prime-cost",{cogs:6000,includedLaborCost:2500},8500],
["prime-cost-percent",{primeCost:8500,netSales:10000},85],
["average-check",{netSales:12000,numberOfChecks:80},150],
["sales-mix",{mode:"unit",itemUnits:30,totalUnits:100},30],
["sales-mix",{mode:"revenue",itemNetSales:4500,totalNetSales:15000},30],
["contribution-margin",{sellingPrice:100,variableCost:35},65],
["break-even-sales",{fixedCosts:6000,totalContributionMargin:4000,netSales:10000},15000],
["inventory-turnover",{periodCogs:12000,openingInventory:3000,closingInventory:3000},4],
["waste",{recordedWasteCost:300,foodBeverageCogs:6000},5],
["revpash",{netFandbRevenue:18000,availableSeats:60,operatingHours:5},60]
];
for(const [id,input,expected] of cases){
 const result=KPIEngine.calculate(id,input,ctx);
 assert.equal(result.ok,true,id+" should calculate: "+JSON.stringify(result.messages));
 assert.ok(Math.abs(result.result-expected)<1e-9,id+" expected "+expected+" got "+result.result);
}
const invalid=[
["cogs",{openingInventory:"",purchases:10,closingInventory:5},"invalid-input"],
["cogs",{openingInventory:"abc",purchases:10,closingInventory:5},"invalid-input"],
["cogs",{openingInventory:-1,purchases:10,closingInventory:5},"invalid-input"],
["food-cost",{openingInventory:1,purchases:1,closingInventory:3,netSales:10},"invalid-input"],
["gross-profit-margin",{grossProfit:10,netSales:0},"not-calculable"],
["average-check",{netSales:100,numberOfChecks:0},"not-calculable"],
["sales-mix",{mode:"unit",itemUnits:101,totalUnits:100},"invalid-input"],
["break-even-sales",{fixedCosts:100,totalContributionMargin:0,netSales:1000},"not-calculable"],
["inventory-turnover",{periodCogs:100,openingInventory:0,closingInventory:0},"not-calculable"],
["waste",{recordedWasteCost:10,foodBeverageCogs:0},"not-calculable"],
["revpash",{netFandbRevenue:100,availableSeats:10,operatingHours:0},"not-calculable"]
];
for(const [id,input,status] of invalid){
 const result=KPIEngine.calculate(id,input,ctx);
 assert.equal(result.ok,false,id+" should reject");
 assert.equal(result.status,status,id+" validation status");
}
assert.equal(KPIEngine.calculate("cogs",{openingInventory:1,purchases:1,closingInventory:0},{period:"",scope:"x",currency:"MAD"}).ok,false);
console.log("KPI Engine tests passed: "+cases.length+" calculation cases and "+invalid.length+" validation cases.");
