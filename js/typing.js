/* About: "Read more" expands the rest of the text and types it out like a person.
   Variable speed, pauses at punctuation, small hesitations, occasional typos that get corrected.
   Typing runs on timers, so it keeps going while the visitor scrolls. */
(function(){
  var btn=document.getElementById('more'),wrap=document.getElementById('about-more'),box=document.getElementById('typed');
  if(!btn||!wrap||!box)return;
  var paras=[].slice.call(box.querySelectorAll('p[data-type]'));
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var lbl=btn.querySelector('.lbl');
  var full=paras.map(function(p){return p.textContent});
  /* accessible copy, and hide the animated one from screen readers */
  var sr=document.createElement('div');sr.className='sr';sr.id='about-full';sr.hidden=false;
  sr.textContent=full.join(' ');box.parentNode.insertBefore(sr,box);box.setAttribute('aria-hidden','true');
  /* build layout stable paragraphs: typed text + invisible remainder keeps the final line breaks from the start */
  var parts=paras.map(function(p,i){
    p.textContent='';
    var t=document.createElement('span'),c=document.createElement('span'),r=document.createElement('span');
    t.className='t';c.className='caret';r.className='r';r.textContent=full[i];
    p.appendChild(t);p.appendChild(c);p.appendChild(r);
    return {t:t,c:c,r:r,text:full[i]};
  });
  var state='idle',timer=0,pi=0,ci=0,flow=1,flowLeft=0,wrong=0,pendingFix=0,skip=false,opened=false;
  var near={a:'sqwzs',b:'vghn',c:'xdfv',d:'serfcx',e:'wsdr',f:'drtgvc',g:'ftyhbv',h:'gyujnb',i:'ujko',j:'huikmn',k:'jiolm',l:'kop',m:'njk',n:'bhjm',o:'iklp',p:'ol',q:'wa',r:'edft',s:'awedxz',t:'rfgy',u:'yhji',v:'cfgb',w:'qase',x:'zsdc',y:'tghu',z:'asx'};
  function rnd(a,b){return a+Math.random()*(b-a)}
  function gauss(){return (Math.random()+Math.random()+Math.random())/3}
  function setCaret(i){parts.forEach(function(p,k){p.c.style.display=k===i?'inline-block':'none'})}
  function delayFor(ch,prev){
    if(--flowLeft<=0){flow=rnd(.65,1.35);flowLeft=Math.floor(rnd(8,22))}
    var d=(26+gauss()*38)*flow;
    if(ch===' ')d+=rnd(8,40);
    if(/[A-Z]/.test(ch)&&(prev===' '||prev===''))d+=rnd(40,110);
    if(prev===','||prev===';')d+=rnd(150,280);
    if(prev==='.'||prev==='!'||prev==='?')d+=rnd(380,620);
    if(Math.random()<.014)d+=rnd(260,620);       /* a thought */
    return d;
  }
  function done(){
    state='done';skip=false;setCaret(-1);
    parts.forEach(function(p){p.t.textContent=p.text;p.r.textContent=''});
    btn.classList.remove('busy');lbl.textContent='Show less';
  }
  function finishNow(){clearTimeout(timer);done()}
  function step(){
    if(skip){finishNow();return}
    var P=parts[pi];
    if(!P){done();return}
    setCaret(pi);
    /* fixing a typo: backspace */
    if(wrong>0){
      P.t.textContent=P.t.textContent.slice(0,-1);wrong--;
      P.c.classList.remove('idle');
      timer=setTimeout(step,wrong>0?rnd(60,110):rnd(140,260));return;
    }
    if(ci>=P.text.length){
      P.c.classList.add('idle');
      pi++;ci=0;
      if(!parts[pi]){timer=setTimeout(done,rnd(500,900));return}
      timer=setTimeout(function(){P.c.style.display='none';step()},rnd(700,1100));return;
    }
    var ch=P.text[ci],prev=ci?P.text[ci-1]:'';
    /* occasional typo on a lowercase letter */
    if(!pendingFix&&ci>4&&/[a-z]/.test(ch)&&Math.random()<.02&&near[ch]){
      var bad=near[ch][Math.floor(Math.random()*near[ch].length)];
      P.t.textContent+=bad;wrong=1;
      if(Math.random()<.5&&ci+1<P.text.length&&/[a-z]/.test(P.text[ci+1])){ /* keeps going for one more key, then notices */
        timer=setTimeout(function(){P.t.textContent+=P.text[ci+1];wrong=2;P.c.classList.add('idle');timer=setTimeout(step,rnd(220,420))},rnd(50,100));return;
      }
      P.c.classList.add('idle');timer=setTimeout(step,rnd(200,380));return;
    }
    P.t.textContent+=ch;ci++;P.r.textContent=P.text.slice(ci);
    P.c.classList.remove('idle');
    var d=delayFor(ch,prev);P.c.classList.toggle('idle',d>170);
    timer=setTimeout(step,d);
  }
  function start(){
    state='typing';pi=0;ci=0;flowLeft=0;wrong=0;
    parts.forEach(function(p){p.t.textContent='';p.r.textContent=p.text});
    btn.classList.add('busy');lbl.textContent='Skip typing';
    timer=setTimeout(step,520);
  }
  function setOpen(o){
    btn.setAttribute('aria-expanded',o);wrap.classList.toggle('open',o);
    wrap.inert=!o;
  }
  wrap.inert=true;
  btn.addEventListener('click',function(){
    if(state==='typing'){skip=true;finishNow();return}
    var open=btn.getAttribute('aria-expanded')==='true';
    if(open){setOpen(false);lbl.textContent='Read more';return}
    setOpen(true);
    if(!opened){
      opened=true;
      if(reduce){parts.forEach(function(p){p.t.textContent=p.text;p.r.textContent=''});state='done';setCaret(-1);lbl.textContent='Show less'}
      else start();
    }else lbl.textContent='Show less';
  });
})();
