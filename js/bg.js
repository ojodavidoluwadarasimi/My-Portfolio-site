/* Full page ambient motion: drifting green glows, a slow grid and floating particles.
   Sits behind every section below the hero. Pauses when the tab is hidden. */
(function(){
  var c=document.createElement('canvas');c.id='bgfx';c.setAttribute('aria-hidden','true');
  document.body.insertBefore(c,document.body.firstChild);
  var x=c.getContext('2d'),W,H,dpr=Math.min(devicePixelRatio||1,2),t=0,run=true,sy=0;
  var still=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var blobs=[{x:.2,y:.3,r:.42,s:.00021,p:0},{x:.8,y:.65,r:.5,s:.00017,p:2},{x:.5,y:.95,r:.38,s:.00025,p:4}];
  var N=innerWidth<760?36:70,P=[];
  function size(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}
  function seed(){P=[];for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.4,v:Math.random()*.25+.08,a:Math.random()*.5+.15,d:Math.random()*6.28})}
  function frame(){
    if(!run)return;t+=16;
    x.clearRect(0,0,W,H);
    blobs.forEach(function(b){
      var bx=(b.x+Math.sin(t*b.s+b.p)*.14)*W,by=(b.y+Math.cos(t*b.s*1.3+b.p)*.12)*H-sy*.08,rr=b.r*Math.max(W,H)*.6;
      var g=x.createRadialGradient(bx,by,0,bx,by,rr);
      g.addColorStop(0,'rgba(0,230,118,.075)');g.addColorStop(1,'rgba(0,230,118,0)');
      x.fillStyle=g;x.fillRect(0,0,W,H);
    });
    x.strokeStyle='rgba(0,230,118,.035)';x.lineWidth=1;
    var gs=72,off=(t*.012+sy*.15)%gs;x.beginPath();
    for(var gx=-gs;gx<W+gs;gx+=gs){x.moveTo(gx+off*.5,0);x.lineTo(gx+off*.5,H)}
    for(var gy=-gs;gy<H+gs;gy+=gs){x.moveTo(0,gy+off);x.lineTo(W,gy+off)}
    x.stroke();
    P.forEach(function(p){
      p.y-=p.v;p.x+=Math.sin(t*.0006+p.d)*.18;
      if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
      x.fillStyle='rgba(0,230,118,'+p.a+')';x.beginPath();x.arc(p.x,p.y,p.r,0,6.28);x.fill();
    });
    if(!still)requestAnimationFrame(frame);
  }
  addEventListener('scroll',function(){sy=scrollY},{passive:true});
  addEventListener('resize',function(){size();seed()});
  document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run&&!still)requestAnimationFrame(frame)});
  size();seed();frame();
})();
