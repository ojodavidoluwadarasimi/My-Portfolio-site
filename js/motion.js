/* Motion layer: scroll progress, cards that fold open as you scroll, 3D tilt with spotlight,
   magnetic buttons, and a pair of eyes that peek in, look at you and blink. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(reduce)return;
  var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var vh=innerHeight,vw=innerWidth;
  function clamp(v,a,b){return v<a?a:v>b?b:v}
  function ease(t){return t*t*(3-2*t)}

  /* progress bar */
  var sp=document.getElementById('sp');

  /* folding cards */
  var sel='.step,.area,.cap,.lab,.repo,.art,.proj .vis,.proj .p-body';
  var items=[].slice.call(document.querySelectorAll(sel)).map(function(el,i){
    el.classList.remove('rv');el.classList.add('fx');
    return {el:el,u:-1,i:i,side:0};
  });
  function sides(){
    items.forEach(function(it){
      var r=it.el.getBoundingClientRect(),c=(r.left+r.width/2)/vw;
      it.side=r.width>vw*.8?0:c<.4?-1:c>.6?1:0;
      it.el.style.setProperty('--side',it.side);
      it.el.style.transformOrigin=it.side<0?'100% 0':it.side>0?'0 0':'50% 0';
      var sib=it.el.parentElement?[].indexOf.call(it.el.parentElement.children,it.el):0;it.stag=(sib%3)*.07;
    });
  }
  var tick=false,lastY=-1;
  function update(){
    tick=false;
    var y=scrollY,doc=document.documentElement.scrollHeight-vh;
    if(sp)sp.style.transform='scaleX('+(doc>0?clamp(y/doc,0,1):0).toFixed(4)+')';
    var rects=items.map(function(it){return it.el.getBoundingClientRect().top});
    items.forEach(function(it,k){
      var start=vh*1.02,end=vh*.6,top=rects[k]+it.stag*vh*.5;
      var u=ease(clamp((start-top)/(start-end),0,1));
      if(Math.abs(u-it.u)>.002){
        it.u=u;it.el.style.setProperty('--u',u.toFixed(3));
        var mv=u>0&&u<1;if(mv!==it.mv){it.mv=mv;it.el.classList.toggle('moving',mv)}
      }
    });
    scrollDir=y>lastY?1:-1;lastY=y;lastScroll=performance.now();
  }
  var scrollDir=1,lastScroll=0;
  function req(){if(!tick){tick=true;requestAnimationFrame(update)}}
  addEventListener('scroll',req,{passive:true});
  addEventListener('resize',function(){vh=innerHeight;vw=innerWidth;sides();req()});
  sides();
  /* images and fonts can move cards: re-measure once things settle */
  addEventListener('load',function(){sides();update()});
  update();

  /* 3D tilt and spotlight */
  if(fine){
    items.forEach(function(it){
      var el=it.el;if(el.classList.contains('vis')||el.classList.contains('p-body'))return;
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        el.classList.remove('settle');
        el.style.setProperty('--mx',(x*100)+'%');el.style.setProperty('--my',(y*100)+'%');
        el.style.setProperty('--tx',((.5-y)*9).toFixed(2)+'deg');el.style.setProperty('--ty',((x-.5)*11).toFixed(2)+'deg');
      });
      el.addEventListener('pointerleave',function(){
        el.classList.add('settle');el.style.setProperty('--tx','0deg');el.style.setProperty('--ty','0deg');
      });
    });
    /* magnetic buttons */
    [].slice.call(document.querySelectorAll('.btn,.cue-btn,.icons a')).forEach(function(b){
      b.addEventListener('pointermove',function(e){
        var r=b.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/r.width,dy=(e.clientY-(r.top+r.height/2))/r.height;
        b.style.translate=(dx*10).toFixed(1)+'px '+(dy*8).toFixed(1)+'px';
      });
      b.addEventListener('pointerleave',function(){b.style.translate='0 0'});
    });
  }

  /* eyes */
  var eyes=document.createElement('div');eyes.className='eyes';eyes.setAttribute('aria-hidden','true');
  eyes.innerHTML='<div class="eye"><i class="pupil"></i><i class="lid"></i></div><div class="eye"><i class="pupil"></i><i class="lid"></i></div>';
  document.body.appendChild(eyes);
  var pup=[].slice.call(eyes.querySelectorAll('.pupil')),eyeEls=[].slice.call(eyes.querySelectorAll('.eye'));
  var tx=vw/2,ty=vh/2,lastPtr=0,shown=false,hideT=0,lastShow=0,onLink=false;
  function aim(x,y){tx=x;ty=y;lastPtr=performance.now()}
  addEventListener('pointermove',function(e){aim(e.clientX,e.clientY);onLink=!!(e.target.closest&&e.target.closest('a,button'))},{passive:true});
  addEventListener('touchstart',function(e){var t=e.touches[0];if(t)aim(t.clientX,t.clientY)},{passive:true});
  addEventListener('touchmove',function(e){var t=e.touches[0];if(t)aim(t.clientX,t.clientY)},{passive:true});
  function look(now){
    var idle=now-lastPtr>3500,recentScroll=now-lastScroll<500;
    eyeEls.forEach(function(el,k){
      var r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,mx=r.width*.2,my=r.height*.22,dx,dy;
      if(idle){ /* nobody is pointing: look straight out at the visitor, drifting a little, down when scrolling */
        dx=Math.sin(now/1900+k*.4)*mx*.35;dy=(recentScroll?scrollDir*my*.8:Math.cos(now/2300)*my*.25);
      }else{
        var vx=tx-cx,vy=ty-cy,d=Math.hypot(vx,vy)||1,f=Math.min(1,d/220);
        dx=vx/d*mx*f;dy=vy/d*my*f;
        if(recentScroll)dy=dy*.4+scrollDir*my*.6;
      }
      pup[k].style.setProperty('--px',dx.toFixed(1)+'px');pup[k].style.setProperty('--py',dy.toFixed(1)+'px');
      pup[k].style.setProperty('--ps',onLink&&!idle?1.28:1);
    });
    requestAnimationFrame(look);
  }
  requestAnimationFrame(look);
  function blink(){
    eyes.classList.add('blink');
    setTimeout(function(){eyes.classList.remove('blink');if(Math.random()<.22)setTimeout(blink,170)},110);
  }
  (function blinkLoop(){setTimeout(function(){if(shown)blink();blinkLoop()},2200+Math.random()*3200)})();
  function menuOpen(){return document.body.classList.contains('lock')}
  function peek(ms){
    var now=performance.now();
    if(shown||menuOpen()||now-lastShow<7000)return;
    shown=true;lastShow=now;eyes.classList.add('show');
    clearTimeout(hideT);
    hideT=setTimeout(function(){eyes.classList.add('sleepy');setTimeout(function(){eyes.classList.remove('show','sleepy');shown=false;lastShow=performance.now()},700)},ms||5200);
  }
  /* appear whenever a new section comes into view, and now and then on its own */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&e.target.id!=='home')peek(5200)})},{threshold:.45});
  [].forEach.call(document.querySelectorAll('main>section'),function(s){io.observe(s)});
  setTimeout(function(){peek(5600)},6500);
  (function loop(){setTimeout(function(){peek(4600);loop()},13000+Math.random()*9000)})();
})();
