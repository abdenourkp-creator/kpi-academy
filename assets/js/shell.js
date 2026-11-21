(function(){ "use strict";
const drawer=document.getElementById("moreDrawer"),backdrop=document.getElementById("drawerBackdrop"),toggle=document.getElementById("moreToggle");
if(!drawer||!backdrop||!toggle)return;
function setOpen(open){drawer.classList.toggle("open",open);backdrop.hidden=!open;drawer.setAttribute("aria-hidden",String(!open));toggle.setAttribute("aria-expanded",String(open));if(open){const first=drawer.querySelector("a");if(first)first.focus();}else toggle.focus();}
toggle.addEventListener("click",()=>setOpen(!drawer.classList.contains("open")));
backdrop.addEventListener("click",()=>setOpen(false));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer.classList.contains("open"))setOpen(false);});
drawer.querySelectorAll('a[data-view]').forEach(a=>a.addEventListener("click",()=>setOpen(false)));
drawer.querySelectorAll(".drawer-static-link").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();setOpen(false);let note=document.getElementById("shellNotice");if(!note){note=document.createElement("div");note.id="shellNotice";note.className="ka-shell-notice";note.setAttribute("role","status");document.body.appendChild(note);}note.textContent="يمكنك الوصول إلى الإعدادات الشخصية هنا عند توفرها.";note.hidden=false;window.setTimeout(()=>{note.hidden=true;},2600);}));
const more=document.getElementById("moreToggle");
if(more){const update=()=>more.classList.toggle("active",drawer.classList.contains("open"));more.addEventListener("click",update);backdrop.addEventListener("click",update);}
})();