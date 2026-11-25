(function(){
  var D=window.PORTFOLIO_DATA||{};
  var nb=document.getElementById('nb-list'),lab=document.getElementById('lab-list');
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  if(nb){
    var a=D.articles||[];
    if(a.length){
      nb.className='arts';
      a.forEach(function(r){
        var d=el('details','art'),s=el('summary');
        s.appendChild(el('span','meta',[r.category,r.date,r.readingTime].filter(Boolean).join('  ·  ')));
        s.appendChild(el('h3',null,r.title));s.appendChild(el('p',null,r.description));
        var b=el('div','body');b.innerHTML=r.body||'';d.appendChild(s);d.appendChild(b);nb.appendChild(d);
      });
    }else{
      nb.className='empty';
      nb.appendChild(el('b',null,'The first notes are still being written.'));
      nb.appendChild(el('p',null,'No articles are published yet. This space is for what I learn as I study C++, systems and AI. Topics I plan to write about:'));
      var c=el('div','chips');(D.plannedTopics||[]).forEach(function(t){c.appendChild(el('span','chip',t))});nb.appendChild(c);
    }
  }
  if(lab){
    lab.className='labs';
    (D.experiments||[]).forEach(function(x){
      var c=el('div','lab');
      c.appendChild(el('span','pill'+(x.status!=='Planned'?' on':''),x.status));
      c.appendChild(el('h3',null,x.title));c.appendChild(el('p',null,x.objective));
      if(x.github){var l=el('a','btn g','GitHub');l.href=x.github;l.target='_blank';l.rel='noopener noreferrer';c.appendChild(l)}
      lab.appendChild(c);
    });
  }
})();
