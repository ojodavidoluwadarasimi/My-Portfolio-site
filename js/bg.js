/* Full page ambient motion: drifting green glows, a slow grid, floating particles and a tire that rolls with the page.
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

  /* Rolling tire: fixed on the right edge, turns and rolls along an upright road as the page scrolls.
     Wheel angle = distance scrolled / radius, so the tread really looks like it grips the road. */
  var ss=0; /* smoothed scroll, gives a little inertia */
  function tire(){
    if(window.__carOn)return;
    var vis=Math.min(1,Math.max(0,(sy-H*.4)/(H*.5)))*(W<760?.2:.3);if(vis<=.01)return;
    ss+=(sy-ss)*.16;
    var R=Math.max(54,Math.min(W<760?56:96,Math.min(W,H)*.13)),s=R/170;
    var lx=W-(W<760?12:30),cx=lx-R*.45,cy=H*.5;   /* partly off screen so it stays at the edge, behind nothing important */
    var rot=-ss/R;                     /* radians, counter clockwise when scrolling down */
    x.save();x.globalAlpha=vis;
    /* road */
    x.strokeStyle='rgba(0,230,118,.4)';x.lineWidth=1.5;x.beginPath();x.moveTo(lx,0);x.lineTo(lx,H);x.stroke();
    x.strokeStyle='rgba(0,230,118,.3)';x.lineWidth=3;
    var gap=140*s,dash=60*s,off=ss%gap;x.beginPath();
    for(var y=-gap;y<H+gap;y+=gap){x.moveTo(lx+16*s,y-off);x.lineTo(lx+16*s,y-off+dash)}
    x.stroke();
    /* glow */
    var g=x.createRadialGradient(cx,cy,R*.4,cx,cy,R*1.6);g.addColorStop(0,'rgba(0,230,118,.05)');g.addColorStop(1,'rgba(0,230,118,0)');
    x.fillStyle=g;x.fillRect(cx-R*1.7,cy-R*1.7,R*3.4,R*3.4);
    function P(r,a){return [cx+r*s*Math.cos(a),cy+r*s*Math.sin(a)]}
    function ring(r,fill,stroke,w){x.beginPath();x.arc(cx,cy,r*s,0,6.2832);if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=w*s;x.stroke()}}
    ring(170,'rgba(14,18,20,.92)','rgba(0,230,118,.9)',3);
    var n=44,i,k,p1,p2,p3,p4,a;
    for(k=0;k<n;k++){
      a=rot+k*6.2832/n;
      p1=P(168,a-.056);p2=P(168,a+.056);p3=P(146,a+.038);p4=P(146,a-.038);
      x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.lineTo(p3[0],p3[1]);x.lineTo(p4[0],p4[1]);x.closePath();
      x.fillStyle='rgba(0,230,118,.16)';x.fill();x.strokeStyle='rgba(0,230,118,.55)';x.lineWidth=1*s;x.stroke();
    }
    ring(140,null,'rgba(0,230,118,.3)',1.5);
    ring(136,'rgba(20,25,27,.95)','rgba(0,230,118,.25)',1);
    for(k=0;k<72;k++){
      a=rot+k*.0873;var L=k%6?7:12,u=P(130,a),v=P(130-L,a);
      x.strokeStyle=k%6?'rgba(0,230,118,.4)':'rgba(0,230,118,.85)';x.lineWidth=1.4*s;x.beginPath();x.moveTo(u[0],u[1]);x.lineTo(v[0],v[1]);x.stroke();
    }
    ring(96,null,'rgba(0,230,118,.45)',1.5);
    ring(90,'rgba(10,13,15,.96)','rgba(180,255,214,.95)',4);
    for(k=0;k<5;k++){
      a=rot+k*1.2566;p1=P(30,a-.16);p2=P(30,a+.16);p3=P(88,a+.06);p4=P(88,a-.06);
      x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.lineTo(p3[0],p3[1]);x.lineTo(p4[0],p4[1]);x.closePath();
      x.fillStyle='rgba(0,230,118,.3)';x.fill();x.strokeStyle='rgba(0,230,118,.95)';x.lineWidth=1*s;x.stroke();
    }
    ring(34,'rgba(16,20,22,.98)','rgba(180,255,214,.98)',3);
    for(k=0;k<5;k++){a=rot+k*1.2566+.628;p1=P(22,a);x.beginPath();x.arc(p1[0],p1[1],4*s,0,6.2832);x.fillStyle='rgba(180,255,214,1)';x.fill()}
    ring(8,'rgba(0,230,118,1)',null,0);
    x.restore();
  }
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
    tire();
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
