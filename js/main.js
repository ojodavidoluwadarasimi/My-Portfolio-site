(function(){
var d=document,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var hero=d.getElementById('home'),burger=d.getElementById('burger'),menu=d.getElementById('menu');
var main=d.getElementById('main'),foot=d.querySelector('footer');
d.getElementById('yr').textContent=new Date().getFullYear();

var top=d.querySelector('.top');function sc(){top.classList.toggle('s',scrollY>innerHeight*.5)}addEventListener('scroll',sc,{passive:true});sc();
/* skip intro on first interaction */
function skip(){hero.classList.add('skip');['pointerdown','keydown','wheel','touchmove'].forEach(function(e){removeEventListener(e,skip)})}
['pointerdown','keydown','wheel','touchmove'].forEach(function(e){addEventListener(e,skip,{passive:true})});

/* menu */
var lastFocus=null;
function setMenu(open){
  menu.classList.toggle('open',open);
  burger.setAttribute('aria-expanded',open);
  burger.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  d.body.classList.toggle('lock',open);
  main.inert=open;foot.inert=open;
  if(open){lastFocus=d.activeElement;setTimeout(function(){var a=menu.querySelector('a');a&&a.focus()},60)}
  else if(lastFocus){burger.focus()}
}
burger.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))});
d.addEventListener('keydown',function(e){
  if(!menu.classList.contains('open'))return;
  if(e.key==='Escape'){setMenu(false);return}
  if(e.key==='Tab'){
    var f=[burger].concat([].slice.call(menu.querySelectorAll('a')));
    var i=f.indexOf(d.activeElement);
    if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}
    else if(!e.shiftKey&&i===f.length-1){e.preventDefault();burger.focus()}
    else if(i===-1){e.preventDefault();f[1].focus()}
  }
});
menu.addEventListener('click',function(e){
  var a=e.target.closest('a');if(!a)return;
  e.preventDefault();var id=a.getAttribute('href');
  setMenu(false);
  setTimeout(function(){var t=d.querySelector(id);t&&t.scrollIntoView({behavior:rm?'auto':'smooth',block:'start'});history.replaceState(null,'',id)},300);
});

/* reveal both directions */
var targets=d.querySelectorAll('.rv,h2[data-split],[data-row]');
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){e.target.classList.toggle('in',e.isIntersecting)})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
  targets.forEach(function(t){io.observe(t)});
}else{targets.forEach(function(t){t.classList.add('in')})}

/* project visual scroll scale */
var vis=[].slice.call(d.querySelectorAll('[data-vis]')),ticking=false;
function upd(){ticking=false;var h=innerHeight;vis.forEach(function(v){var r=v.getBoundingClientRect();if(r.bottom<0||r.top>h)return;var p=Math.min(1,Math.max(0,(h-r.top)/(h+r.height)*1.6));v.style.setProperty('--p',p.toFixed(3))})}
if(!rm){addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});upd()}

/* subtle portrait parallax (pointer devices only) */
var pin=d.getElementById('pin');
if(!rm&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  hero.addEventListener('pointermove',function(e){var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);pin.style.transform='translate('+(x*-14).toFixed(1)+'px,'+(y*-8).toFixed(1)+'px)'});
  hero.addEventListener('pointerleave',function(){pin.style.transform=''});
}

/* copy email */
var toast=d.getElementById('toast'),mail='ojodavidoluwadarasimi100@gmail.com';
d.getElementById('copy').addEventListener('click',function(){
  function ok(){toast.textContent='Email address copied.';setTimeout(function(){toast.textContent=''},2600)}
  function fb(){var t=d.createElement('textarea');t.value=mail;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';d.body.appendChild(t);t.select();try{d.execCommand('copy');ok()}catch(_){toast.textContent='Copy failed. Use the email icon instead.'}d.body.removeChild(t)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(mail).then(ok,fb)}else{fb()}
});
d.getElementById('totop').addEventListener('click',function(){scrollTo({top:0,behavior:rm?'auto':'smooth'})});

/* one continuous particle field behind the portrait */
var cv=d.getElementById('field'),cx=cv.getContext('2d'),W=0,H=0,P=[],run=true,dpr=Math.min(devicePixelRatio||1,2);
function size(){var r=hero.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);
  var n=Math.round(Math.min(70,W*H/20000));if(W<760)n=Math.round(n*.55);
  P=[];for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.22,vy:-Math.random()*.2-.03,r:Math.random()*1.3+.5,a:Math.random()*.5+.25})}
function frame(){
  cx.clearRect(0,0,W,H);
  for(var i=0;i<P.length;i++){var p=P[i];
    if(!rm){p.x+=p.vx;p.y+=p.vy;if(p.y<-4){p.y=H+4;p.x=Math.random()*W}if(p.x<-4)p.x=W+4;if(p.x>W+4)p.x=-4}
    cx.fillStyle='rgba(0,230,118,'+p.a+')';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();
    if(W>760)for(var j=i+1;j<P.length;j++){var q=P[j],dx=p.x-q.x,dy=p.y-q.y,l=dx*dx+dy*dy;if(l<9000){cx.strokeStyle='rgba(0,230,118,'+(.13*(1-l/9000))+')';cx.lineWidth=1;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
  }
  if(run&&!rm)requestAnimationFrame(frame)
}
size();frame();
var rs;addEventListener('resize',function(){clearTimeout(rs);rs=setTimeout(function(){size();if(rm)frame()},150)});
if('IntersectionObserver' in window){new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!run){run=true;frame()}run=v}).observe(hero)}
d.addEventListener('visibilitychange',function(){if(d.hidden){run=false}else if(!run){run=true;frame()}});
})();
