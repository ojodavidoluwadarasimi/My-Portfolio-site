import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {MeshoptDecoder} from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

/* Vehicle layer. Loads assets/car.glb (a licensed model supplied by the site owner). If the file is missing, WebGL fails
   or the device is weak, nothing happens and the existing background stays exactly as it is. */
(function(){
  var MODEL=document.currentScript&&document.currentScript.dataset.model||'assets/car.glb';
  var CFG={length:3.6,facing:Math.PI}; /* facing: rotate so the nose points up the screen (away from camera) */
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  if((navigator.hardwareConcurrency||4)<=2||(navigator.deviceMemory||4)<=2)return;
  var mobile=innerWidth<760||matchMedia('(pointer:coarse)').matches;

  /* where the car is allowed, 0 hides it. Decided from the section in the middle of the screen. */
  var ALLOW={about:.3,approach:.34,technologies:.26,building:.24,interests:.3};
  var secs=[].slice.call(document.querySelectorAll('main>section[id]'));

  fetch(MODEL,{method:'HEAD'}).then(function(r){if(r.ok)boot()}).catch(function(){});

  function boot(){
    var renderer;
    try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'})}catch(e){return}
    var cv=renderer.domElement;cv.id='car';cv.setAttribute('aria-hidden','true');
    cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:0;transition:none';
    var bg=document.getElementById('bgfx');bg&&bg.parentNode?bg.parentNode.insertBefore(cv,bg.nextSibling):document.body.prepend(cv);
    renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
    var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(34,1,.1,60);
    var pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;
    var key=new THREE.DirectionalLight(0xffffff,1.1);key.position.set(-3,6,2);scene.add(key);
    var rim=new THREE.DirectionalLight(0x00e676,1.2);rim.position.set(4,2,-5);scene.add(rim);

    var car=new THREE.Group(),body=new THREE.Group();car.add(body);scene.add(car);
    var axle='z',wheels=[],brakeMats=[],lights=[],tail=[];
    var dr=new DRACOLoader().setDecoderPath('js/draco/');var gl=new GLTFLoader().setDRACOLoader(dr).setMeshoptDecoder(MeshoptDecoder);
    gl.load(MODEL,function(g){
      g.scene.updateMatrixWorld(true);
      var WHEEL=/pneu|tyre|tire|rim_texture|jante|pzeo|bleu_details|visse|wheel|^rim$/i;
      var PAINT=/carpaint|body|paint|material\.?(071|072|073|074|080|081)(?!\d)/i;
      var NOPAINT=/glass|window|tyre|tire|pneu|rubber|light|lamp|chrome|interior|seat|brake|frein|caliper|plate|grill|vent|carbon|jante|rim/i;
      /* find the four wheel centres from the tyre meshes, then split each merged wheel part into four spinning wheels */
      var bb=new THREE.Box3().setFromObject(g.scene),mid=bb.getCenter(new THREE.Vector3()),szz=bb.getSize(new THREE.Vector3());
      var lenAxis=szz.x>szz.z?'x':'z',wAxis=lenAxis==='x'?'z':'x';
      var parts=[];g.scene.traverse(function(o){if(o.isMesh&&WHEEL.test((o.material&&o.material.name||'')+' '+o.name))parts.push(o)});
      var V=new THREE.Vector3(),cent=[0,1,2,3].map(function(){return new THREE.Box3()});
      function quad(x,z){var l=lenAxis==='x'?x:z,w=lenAxis==='x'?z:x;return (l>mid[lenAxis]?1:0)+(w>mid[wAxis]?2:0)}
      function eachTri(o,fn){var ge=o.geometry,pos=ge.attributes.position,ix=ge.index,n=ix?ix.count:pos.count,A=new THREE.Vector3(),B=new THREE.Vector3(),C=new THREE.Vector3();
        for(var i=0;i<n;i+=3){var a=ix?ix.getX(i):i,b=ix?ix.getX(i+1):i+1,c=ix?ix.getX(i+2):i+2;
          A.fromBufferAttribute(pos,a).applyMatrix4(o.matrixWorld);B.fromBufferAttribute(pos,b).applyMatrix4(o.matrixWorld);C.fromBufferAttribute(pos,c).applyMatrix4(o.matrixWorld);
          fn(i,A,B,C,a,b,c)}}
      var tyres=parts.filter(function(o){return /pneu|tyre|tire/i.test((o.material&&o.material.name||'')+' '+o.name)});
      (tyres.length?tyres:parts).forEach(function(o){eachTri(o,function(i,A,B,C){V.copy(A).add(B).add(C).multiplyScalar(1/3);var q=quad(V.x,V.z);cent[q].expandByPoint(A);cent[q].expandByPoint(B);cent[q].expandByPoint(C)})});
      var piv=[0,1,2,3].map(function(q){var p=new THREE.Group();p.position.copy(cent[q].isEmpty()?mid:cent[q].getCenter(new THREE.Vector3()));g.scene.add(p);return p});
      wheels=[];axle=wAxis;
      if(parts.length&&cent.every(function(c){return !c.isEmpty()})){
        parts.forEach(function(o){
          var ge=o.geometry,groups=[[],[],[],[]];
          eachTri(o,function(i,A,B,C,a,b,c){V.copy(A).add(B).add(C).multiplyScalar(1/3);groups[quad(V.x,V.z)].push(a,b,c)});
          o.updateMatrixWorld(true);
          groups.forEach(function(ix,q){
            if(!ix.length)return;
            var gg=new THREE.BufferGeometry();
            Object.keys(ge.attributes).forEach(function(k){gg.setAttribute(k,ge.attributes[k])});
            gg.setIndex(ix);
            var mm=new THREE.Mesh(gg,o.material);
            /* bake the original transform, then centre on the wheel so it turns about its own axle */
            gg=gg.clone();gg.applyMatrix4(o.matrixWorld);gg.translate(-piv[q].position.x,-piv[q].position.y,-piv[q].position.z);mm.geometry=gg;
            piv[q].add(mm);
          });
          o.parent.remove(o);
        });
        wheels=piv;
      }
      /* paint the bodywork in the portfolio green (glass, tyres, lights and trim stay as they are) */
      var seen=[],hsl={};
      g.scene.traverse(function(o){if(!o.isMesh)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(function(mt){
        if(!mt||!mt.color||seen.indexOf(mt)>=0)return;seen.push(mt);
        var nm=(mt.name||'')+' '+(o.name||'');
        if(mt.transparent||(mt.opacity!==undefined&&mt.opacity<.9))return;
        if(mt.emissive&&mt.emissive.getHex()>0)return;   /* lamps keep their own colour */
        mt.color.getHSL(hsl);
        var isPaint=PAINT.test(nm)||(hsl.s>.35&&hsl.l>.12&&!NOPAINT.test(nm));
        if(isPaint&&!(NOPAINT.test(nm)&&!/carpaint|body|paint/i.test(nm))){mt.map=null;mt.color.set(0x00a859);if('metalness' in mt){mt.metalness=.7;mt.roughness=.32}}
      })});
      if(window.__carDbg)console.log('MATS '+seen.map(function(x){return x.name+(x.color?':'+x.color.getHexString():'')}).join(' | '));
      var m=g.scene;
      var box=new THREE.Box3().setFromObject(m),sz=box.getSize(new THREE.Vector3()),c=box.getCenter(new THREE.Vector3());
      var long=Math.max(sz.x,sz.z),k=CFG.length/long;
      m.position.sub(c);var pivot=new THREE.Group();pivot.add(m);pivot.scale.setScalar(k);
      if(sz.x>sz.z)pivot.rotation.y=Math.PI/2;           /* length along Z */
      pivot.rotation.y+=CFG.facing;
      body.add(pivot);
      var tris=0;
      m.traverse(function(o){
        if(o.isMesh){
          o.frustumCulled=true;
          var n=(o.name||'')+' '+(o.material&&o.material.name||'');
          
          if(/brake|tail|rear.*light|taillight/i.test(n)&&o.material){var mm=o.material.clone();mm.emissive=new THREE.Color(0xff1a1a);mm.emissiveIntensity=0;o.material=mm;brakeMats.push(mm)}
          if(o.geometry.index)tris+=o.geometry.index.count/3;
        }
      });
      /* delicate technical lines, only when the model is light enough to afford them */
      if(tris<100000){
        var lm=new THREE.LineBasicMaterial({color:0x00e676,transparent:true,opacity:.14,depthWrite:false});
        var add=[];m.traverse(function(o){if(o.isMesh&&!/glass|window|tyre|tire/i.test(o.name||''))add.push(o)});
        add.forEach(function(o){var l=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,38),lm);o.add(l)});
      }
      /* lights from the model's own proportions, so any car gets a head and tail glow */
      var half=CFG.length/2;
      [-.55,.55].forEach(function(sx){
        var t=new THREE.PointLight(0xff2020,0,2.2);t.position.set(sx*.75,.45,half*.98);car.add(t);tail.push(t);
        var h=new THREE.PointLight(0xdff7ff,.6,2.6);h.position.set(sx*.75,.45,-half*.98);car.add(h);lights.push(h);
      });
      ready=true;window.__carOn=true;var cr=document.getElementById('car-credit');if(cr)cr.hidden=false;document.documentElement.classList.add('car-on');setupAudio();
    },undefined,function(e){console.warn('car load',e&&e.message||e);cv.remove()});
    var ready=false,axle='z';

    function size(){
      var w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,mobile?1.25:1.75);
      renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
      var dist=mobile?11:9;cam.position.set(0,dist*.8,dist*.62);cam.lookAt(0,0,0);
      var halfW=Math.tan(cam.fov*Math.PI/360)*dist*cam.aspect;
      car.userData.x=mobile?halfW*.68:halfW*.74;car.scale.setScalar(mobile?.6:.82);
    }
    addEventListener('resize',size);size();

    /* scroll physics: velocity, not position */
    var lastY=scrollY,lastT=performance.now(),vel=0,sp=0,tgt=0,dir=0,steer=0,steerV=0,lastMove=0,brake=0,revs=0,rot=0,op=0,vis=0,sinceFlip=9,flipT=0,lastDrift=0,posZ=0,roll=0;
    function frame(now){
      requestAnimationFrame(frame);
      var dt=Math.min(.05,(now-lastT)/1000);lastT=now;if(dt<=0)return;
      var y=scrollY,v=(y-lastY)/dt;lastY=y;
      vel+=(v-vel)*Math.min(1,dt*9);
      tgt=Math.max(-1,Math.min(1,vel/1700));
      if(Math.abs(v)>30)lastMove=now;
      /* direction: only a sustained, clear reversal counts. Scroll jitter and trackpad noise never steer the car. */
      var nd=tgt>.12?1:tgt<-.12?-1:0;
      if(nd&&nd!==dir){flipT+=dt}else flipT=0;
      if(nd&&nd!==dir&&flipT>.16){
        if(dir&&Math.abs(sp)>.25&&now-lastDrift>1500){steerV+=nd*1.1;lastDrift=now}   /* one small drift into the new direction */
        sp*=dir?.6:1;dir=nd;flipT=0;
      }
      var acc=Math.abs(tgt)>Math.abs(sp)?3.2:1.7;sp+=(tgt-sp)*Math.min(1,dt*acc);
      steerV+=(-steer*16-steerV*6.5)*dt;steer+=steerV*dt;steer=Math.max(-.3,Math.min(.3,steer));          /* spring back to straight */
      var stopped=now-lastMove>260,braking=(Math.abs(tgt)<Math.abs(sp)*.55&&Math.abs(sp)>.06)||(stopped&&Math.abs(sp)>.015);
      var bt=braking?1:(stopped&&now-lastMove<2600?.5:0);
      brake+=(bt-brake)*Math.min(1,dt*(bt>brake?10:2.2));
      roll+=((-steer*.5)-roll)*Math.min(1,dt*6);
      rot+=sp*dt*9;
      posZ+=((-sp*1.5)-posZ)*Math.min(1,dt*3);
      revs+=(Math.abs(sp)-revs)*Math.min(1,dt*4);

      /* visibility controller */
      var mid=innerHeight*.5,t=0,id='';
      for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect();if(r.top<=mid&&r.bottom>mid){id=secs[i].id;break}}
      t=ALLOW[id]||0;
      var inHero=scrollY<innerHeight*.9;if(inHero)t=0;
      vis+=(t-vis)*Math.min(1,dt*2.2);
      if(window.__carDbg){vis=1;car.userData.x=0}
      if(ready&&vis>.01&&!document.hidden){
        cv.style.opacity=vis.toFixed(3);cv.style.visibility='visible';
        car.position.set(car.userData.x,0,posZ);
        car.rotation.y=steer*.45;body.rotation.z=roll*.12;body.rotation.x=Math.sin(now/230)*.004*sp+(-sp*.015);
        wheels.forEach(function(w){w.rotation[axle]=rot});
        var bi=.2+brake*2.4,L=Math.max(0,brake);
        brakeMats.forEach(function(m){m.emissiveIntensity=bi*L*2});tail.forEach(function(l){l.intensity=L*1.4});
        renderer.render(scene,cam);
      }else if(cv.style.visibility!=='hidden'){cv.style.visibility='hidden'}
      audioTick(dt,revs,sp,vis);
    }
    requestAnimationFrame(frame);

    /* engine audio: synthesised with Web Audio (no recordings used). Off until the visitor switches it on. */
    var ac,eng,btn,ignited=false,on=false,store={get:function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
    function setupAudio(){
      btn=document.createElement('button');btn.type='button';btn.className='snd';btn.setAttribute('aria-pressed','false');
      btn.setAttribute('aria-label','Engine sound off. Press to turn on');btn.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="w" d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/><path class="x" d="M17 9l4 6M21 9l-4 6"/></svg><span>Engine</span>';
      btn.addEventListener('click',function(){toggle()});document.body.appendChild(btn);
    }
    function build(){
      var A=window.AudioContext||window.webkitAudioContext;if(!A)return false;
      ac=new A();var master=ac.createGain();master.gain.value=0;
      var lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;lp.Q.value=.9;
      var o=[0,1,2].map(function(i){var s=ac.createOscillator();s.type=i?'sawtooth':'square';s.frequency.value=40;var g=ac.createGain();g.gain.value=[.5,.35,.22][i];s.connect(g);g.connect(lp);s.start();return {s:s,g:g,m:[1,2.01,.5][i]}});
      var wob=ac.createOscillator(),wg=ac.createGain();wob.frequency.value=9;wg.gain.value=3;wob.connect(wg);o.forEach(function(x){wg.connect(x.s.detune)});wob.start();
      var sh=ac.createDynamicsCompressor();lp.connect(master);master.connect(sh);sh.connect(ac.destination);
      eng={master:master,lp:lp,o:o};return true;
    }
    function toggle(){
      if(!on){
        try{if(!eng&&!build())return;if(ac.state==='suspended')ac.resume();}catch(e){return}
        on=true;store.set('snd','on');
        if(!ignited&&!store.get('ign')){ignited=true;store.set('ign','1');ignition()}
      }else{on=false;store.set('snd','off')}
      btn.setAttribute('aria-pressed',on);btn.classList.toggle('on',on);
      btn.setAttribute('aria-label',on?'Engine sound on. Press to mute':'Engine sound off. Press to turn on');
    }
    function ignition(){
      var t=ac.currentTime;
      eng.o.forEach(function(x){x.s.frequency.cancelScheduledValues(t);x.s.frequency.setValueAtTime(18*x.m,t);x.s.frequency.linearRampToValueAtTime(36*x.m,t+.55);x.s.frequency.exponentialRampToValueAtTime(95*x.m,t+.85);x.s.frequency.exponentialRampToValueAtTime(48*x.m,t+1.5)});
      eng.ign=performance.now()+1600;
    }
    function audioTick(dt,rv,s,v){
      if(!eng)return;
      var t=ac.currentTime,vol=on&&v>.02?(.05+Math.min(1,rv)*.07)*Math.min(1,v*3):0;
      if(eng.ign&&performance.now()<eng.ign){eng.master.gain.setTargetAtTime(on?.09:0,t,.05);return}
      eng.master.gain.setTargetAtTime(vol,t,.25);
      var f=46+rv*150;eng.o.forEach(function(x){x.s.frequency.setTargetAtTime(f*x.m,t,.12)});
      eng.lp.frequency.setTargetAtTime(420+rv*1300,t,.15);
    }
    document.addEventListener('visibilitychange',function(){if(ac){document.hidden?ac.suspend():(on&&ac.resume())}});
  }
})();
