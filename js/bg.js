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

  /* 3D wireframe: an icosahedron that spins with scroll and leans toward the pointer */
  var ph=(1+Math.sqrt(5))/2,V=[[-1,ph,0],[1,ph,0],[-1,-ph,0],[1,-ph,0],[0,-1,ph],[0,1,ph],[0,-1,-ph],[0,1,-ph],[ph,0,-1],[ph,0,1],[-ph,0,-1],[-ph,0,1]],E=[];
  for(var a=0;a<12;a++)for(var b=a+1;b<12;b++){var dx=V[a][0]-V[b][0],dy=V[a][1]-V[b][1],dz=V[a][2]-V[b][2];if(Math.abs(Math.sqrt(dx*dx+dy*dy+dz*dz)-2)<.01)E.push([a,b])}
  var mx=0,my=0;
  addEventListener('pointermove',function(e){mx=e.clientX/W-.5;my=e.clientY/H-.5},{passive:true});
  function rot(p,ax,ay){var c=Math.cos(ay),s=Math.sin(ay),x1=p[0]*c+p[2]*s,z1=-p[0]*s+p[2]*c,c2=Math.cos(ax),s2=Math.sin(ax),y2=p[1]*c2-z1*s2,z2=p[1]*s2+z1*c2;return [x1,y2,z2]}
  function solid(R,cx,cy,ax,ay,alpha,k){
    var P2=V.map(function(v){var r=rot([v[0]*k,v[1]*k,v[2]*k],ax,ay),f=4.6/(4.6+r[2]*.9);return [cx+r[0]*R*f,cy+r[1]*R*f,r[2],f]});
    x.lineWidth=1.2;
    E.forEach(function(e){var A=P2[e[0]],B=P2[e[1]],d=(A[2]+B[2])/2,al=alpha*(.45+.55*(1-(d+2)/4));x.strokeStyle='rgba(0,230,118,'+al.toFixed(3)+')';x.beginPath();x.moveTo(A[0],A[1]);x.lineTo(B[0],B[1]);x.stroke()});
    P2.forEach(function(p){x.fillStyle='rgba(180,255,214,'+(alpha*1.6*(.5+.5*(1-(p[2]+2)/4))).toFixed(3)+')';x.beginPath();x.arc(p[0],p[1],1.6+p[3]*1.2,0,6.28);x.fill()});
  }
  function crystal(){
    var vis=Math.min(1,Math.max(0,(sy-H*.45)/(H*.5)))*(W<760?.55:1);if(vis<=0)return;
    var doc=Math.max(1,document.documentElement.scrollHeight-H),p=sy/doc;
    var R=Math.min(W,H)*(W<760?.2:.17),cx=W*(.80-.12*Math.sin(p*11)),cy=H*(.34+.2*Math.cos(p*8));
    var ay=t*.00028+sy*.0016+mx*1.1,ax=t*.00018+sy*.0009+my*.8;
    var g=x.createRadialGradient(cx,cy,0,cx,cy,R*2.1);g.addColorStop(0,'rgba(0,230,118,'+(.10*vis).toFixed(3)+')');g.addColorStop(1,'rgba(0,230,118,0)');x.fillStyle=g;x.fillRect(cx-R*2.2,cy-R*2.2,R*4.4,R*4.4);
    solid(R,cx,cy,ax,ay,.36*vis,1);
    solid(R,cx,cy,-ax*1.3,-ay*1.2,.22*vis,.52);
    x.strokeStyle='rgba(0,230,118,'+(.22*vis).toFixed(3)+')';x.lineWidth=1;x.beginPath();x.ellipse(cx,cy,R*1.55,R*.5,ay*.6,0,6.28);x.stroke();
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
    crystal();
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
