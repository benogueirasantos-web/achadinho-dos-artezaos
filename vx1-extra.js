(()=>{'use strict';
const launch=document.getElementById('achi-launch'),chat=document.getElementById('achi-chat');
if(launch){let drag=null,suppress=false;const pad=8;
function move(x,y){const w=launch.offsetWidth,h=launch.offsetHeight;launch.style.right='auto';launch.style.bottom='auto';launch.style.left=Math.max(pad,Math.min(window.innerWidth-w-pad,x))+'px';launch.style.top=Math.max(pad,Math.min(window.innerHeight-h-pad,y))+'px'}
launch.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=launch.getBoundingClientRect();drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:r.left,top:r.top,moved:false};launch.setPointerCapture(e.pointerId)});
launch.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.hypot(dx,dy)>7)drag.moved=true;if(drag.moved){launch.classList.add('vx-dragging');move(drag.left+dx,drag.top+dy)}});
launch.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const wasMoved=drag.moved;drag=null;launch.classList.remove('vx-dragging');if(wasMoved){suppress=true;setTimeout(()=>suppress=false,100);try{const r=launch.getBoundingClientRect();localStorage.setItem('achi-launch-vx-position',JSON.stringify({x:r.left/window.innerWidth,y:r.top/window.innerHeight}))}catch(err){}}});
launch.addEventListener('pointercancel',()=>{drag=null;launch.classList.remove('vx-dragging')});
launch.addEventListener('click',e=>{if(suppress){e.stopImmediatePropagation();e.preventDefault();suppress=false}},true);
function restore(){try{const p=JSON.parse(localStorage.getItem('achi-launch-vx-position')||'null');if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y))move(p.x*window.innerWidth,p.y*window.innerHeight)}catch(e){}}
restore();window.addEventListener('resize',()=>{if(launch.style.left){const r=launch.getBoundingClientRect();move(r.left,r.top)}});
}
const dialog=document.getElementById('vx-gallery-dialog'),big=document.getElementById('vx-gallery-big'),caption=document.getElementById('vx-gallery-caption');
document.querySelectorAll('[data-photo]').forEach(btn=>btn.addEventListener('click',()=>{big.src=btn.dataset.photo;big.alt=btn.dataset.title;caption.textContent=btn.dataset.title;if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','')}));
document.getElementById('vx-gallery-close')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
})();
