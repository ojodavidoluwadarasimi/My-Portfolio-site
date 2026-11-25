(function(){
  var D=window.PORTFOLIO_DATA||{},box=document.getElementById('gh-list');
  if(!box||!D.repos)return;
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function card(r,live){
    var a=el('a','repo');a.href='https://github.com/'+r.owner+'/'+r.name;a.target='_blank';a.rel='noopener noreferrer';
    a.appendChild(el('b',null,r.name));
    a.appendChild(el('p',null,(live&&live.description)||r.fallback));
    var m=el('div','m');
    if(live){
      if(live.language)m.appendChild(el('span',null,live.language));
      m.appendChild(el('span',null,'★ '+live.stargazers_count));
      if(live.pushed_at)m.appendChild(el('span',null,'Updated '+new Date(live.pushed_at).toLocaleDateString('en-GB',{month:'short',year:'numeric'})));
    }else m.appendChild(el('span',null,r.stack));
    a.appendChild(m);return a;
  }
  function get(r){
    var k='gh:'+r.name;
    try{var c=JSON.parse(sessionStorage.getItem(k));if(c&&Date.now()-c.t<6e5)return Promise.resolve(c.d)}catch(e){}
    return fetch('https://api.github.com/repos/'+r.owner+'/'+r.name).then(function(x){if(!x.ok)throw 0;return x.json()}).then(function(d){try{sessionStorage.setItem(k,JSON.stringify({t:Date.now(),d:d}))}catch(e){}return d});
  }
  D.repos.forEach(function(r){box.appendChild(card(r,null))});
  D.repos.forEach(function(r,i){get(r).then(function(d){box.replaceChild(card(r,d),box.children[i])}).catch(function(){})});
})();
