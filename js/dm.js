/* Phone "Desktop site" mode: Chrome lays the page out at ~980px and shrinks it to fit, so text becomes tiny.
   Detect the shrink and scale the page up so it stays readable. Normal phones, tablets and PCs are untouched. */
(function(){
  try{
    var vv=window.visualViewport,s=vv?vv.scale:1;
    if(s<.7&&matchMedia('(pointer:coarse)').matches&&innerWidth>=900){
      var z=Math.min(2,.62/s);
      document.documentElement.style.setProperty('--z',z.toFixed(2));
      document.documentElement.classList.add('dm');
    }
  }catch(e){}
})();
