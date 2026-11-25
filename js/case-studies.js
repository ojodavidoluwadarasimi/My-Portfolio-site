(function(){
  document.querySelectorAll('.cs-toggle').forEach(function(btn){
    var panel=document.getElementById(btn.getAttribute('aria-controls'));
    if(!panel)return;
    var label=btn.querySelector('.lbl');
    panel.inert=true;
    function set(open){
      btn.setAttribute('aria-expanded',open);
      panel.classList.toggle('open',open);
      panel.inert=!open;
      if(label)label.textContent=open?'Close case study':'Read case study';
    }
    btn.addEventListener('click',function(){
      var open=btn.getAttribute('aria-expanded')!=='true';
      set(open);
      if(open){setTimeout(function(){panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'})},420)}
    });
    panel.addEventListener('keydown',function(e){if(e.key==='Escape'){set(false);btn.focus()}});
  });
})();
