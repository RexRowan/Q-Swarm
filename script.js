const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");
const map = document.getElementById("matrixMap");
let particles = [];
let nodes = [];

function resize() {
  const r = map.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = r.width * dpr; canvas.height = r.height * dpr;
  canvas.style.width = r.width+"px"; canvas.style.height = r.height+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  nodes = [...map.querySelectorAll(".map-node")].map(el => ({
    el,
    x: r.width * parseFloat(el.style.getPropertyValue("--x"))/100,
    y: r.height * parseFloat(el.style.getPropertyValue("--y"))/100
  }));
  particles = Array.from({length:55},()=>({x:Math.random()*r.width,y:Math.random()*r.height,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22,a:.2+Math.random()*.55}));
}
window.addEventListener("resize",resize); resize();

function frame(t){
  const r=map.getBoundingClientRect(); ctx.clearRect(0,0,r.width,r.height);
  ctx.lineWidth=1;
  for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
    const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
    if(d<330){
      ctx.strokeStyle=`rgba(0,190,255,${Math.max(0,.17-d/2100)})`;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
  }
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>r.width)p.vx*=-1;if(p.y<0||p.y>r.height)p.vy*=-1;
    ctx.fillStyle=`rgba(80,180,255,${p.a})`;ctx.fillRect(p.x,p.y,1,1);
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

const buttons=[...document.querySelectorAll(".console-btn")];
const cards=[...document.querySelectorAll(".agent-card")];
const mapNodes=[...document.querySelectorAll(".map-node")];
buttons.forEach(btn=>btn.addEventListener("click",()=>{
  buttons.forEach(b=>b.classList.remove("selected"));btn.classList.add("selected");
  const f=btn.dataset.filter;
  cards.forEach(c=>c.style.display=f==="all"||c.classList.contains(f)?"":"none");
  mapNodes.forEach(n=>n.style.opacity=f==="all"||n.classList.contains(f)?"1":"0.13");
}));
document.getElementById("agentSearch").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase();
  cards.forEach(c=>c.style.display=c.innerText.toLowerCase().includes(q)?"":"none");
  mapNodes.forEach(n=>n.style.opacity=n.dataset.name.toLowerCase().includes(q)?"1":q?".1":"1");
});
