const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const {chromium}=require("playwright");
const currentRoot=path.resolve(__dirname,"..");
const baselineRoot=path.resolve(process.argv[2]||"/tmp/kpi-baseline");
const output=path.join(currentRoot,"test-results","visual-capture");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",".md":"text/markdown",".svg":"image/svg+xml"};
function startServer(root){return new Promise(resolve=>{const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);const relative=pathname==="/ "||pathname==="/"? "index.html":pathname.replace(/^\/+/,"");const target=path.resolve(root,relative);if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end("Forbidden");return;}fs.readFile(target,(error,data)=>{if(error){res.writeHead(404).end("Not found");return;}res.writeHead(200,{"Content-Type":mime[path.extname(target)]||"application/octet-stream"});res.end(data);});});server.listen(0,"127.0.0.1",()=>resolve({server,port:server.address().port}));});}
const routes=[
 {id:"dashboard",hash:"#dashboard",wait:".page-content"},
 {id:"modules",hash:"#modules",wait:".page-content"},
 {id:"module-detail",hash:"#module-business-mathematics",wait:".chapter-panel"},
 {id:"restaurant-kpi-registry",hash:"#module-restaurant-kpis",wait:".page-content"},
 {id:"lesson-reader",hash:"#lesson-BM-005",wait:".lesson-reader"},
 {id:"kpi-calculator",hash:"#calculator",wait:"#kpiForm"},
 {id:"analytics-lab",hash:"#analytics",wait:"#analyticsChart"},
 {id:"management-simulator",hash:"#simulator",wait:".ka-simulator-panel"},
 {id:"progress-assessments",hash:"#progress",wait:".progress-section"}
];
async function capture(browser,root,label,viewport,routesToCapture){
 const {server,port}=await startServer(root);
 try{
  const context=await browser.newContext({viewport});
  const page=await context.newPage();
  for(const route of routesToCapture){
   await page.goto("http://127.0.0.1:"+port+"/"+route.hash,{waitUntil:"networkidle"});
   try{await page.locator(route.wait).first().waitFor({timeout:10000});}catch(_){}
   const dir=path.join(output,label,viewport.width+"x"+viewport.height);
   fs.mkdirSync(dir,{recursive:true});
   await page.screenshot({path:path.join(dir,route.id+".png"),fullPage:true,animations:"disabled"});
  }
  await context.close();
 }finally{server.close();}
}
(async()=>{
 if(!fs.existsSync(path.join(baselineRoot,"index.html")))throw new Error("Baseline source is missing: "+baselineRoot);
 fs.rmSync(output,{recursive:true,force:true});
 const browser=await chromium.launch({headless:true});
 try{
  await capture(browser,baselineRoot,"before",{width:1365,height:900},routes);
  await capture(browser,currentRoot,"after",{width:1365,height:900},routes);
  const mobileRoutes=routes.filter(x=>["dashboard","module-detail","restaurant-kpi-registry","lesson-reader","kpi-calculator","analytics-lab","management-simulator"].includes(x.id));
  for(const width of [360,390,430,768,1024]) await capture(browser,currentRoot,"after",{width,height:width<=430?844:900},mobileRoutes);
  const files=[];
  function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())walk(full);else files.push(full);}}
  walk(output);
  if(files.length!==53)throw new Error("Expected 53 screenshots, captured "+files.length);
  console.log("Visual capture complete: "+files.length+" before/after desktop and after mobile screenshots.");
 }finally{await browser.close();}
})();