/* A flat, continuous print. Navigation remains independent of the canvas. */
(() => {
  const page = document.querySelector('.field-page');
  const canvas = document.querySelector('.living-field');
  const control = document.querySelector('.motion-control');
  if (!page || !canvas || !control) return;
  let context;
  try { context = canvas.getContext('2d', {alpha:true}); } catch { return; }
  if (!context) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let width=0, height=0, phase=0, last=0, frame=0, manualPause=false, rendererReady=true;
  let pointerX=.68, pointerY=.5, targetX=.68, targetY=.5, pointerPower=0, targetPower=0;
  const allowed = () => rendererReady && !manualPause && !reduced.matches && !document.hidden;
  function updateControl() {
    control.hidden = !rendererReady || reduced.matches;
    control.setAttribute('aria-pressed', String(manualPause));
    control.setAttribute('aria-label', manualPause ? '播放动效' : '暂停动效');
  }
  function draw() {
    if(!rendererReady)return;
    context.clearRect(0,0,width,height);
    const mobile=width<=700;
    const count=mobile?58:86;
    context.lineWidth=mobile?.85:1;
    const steps=mobile?74:108;
    for(let line=0;line<count;line++) {
      const u=line/(count-1);
      context.strokeStyle=line>count*.87?'#f66b46':'#173cff';
      context.beginPath();
      for(let step=0;step<=steps;step++) {
        const v=step/steps;
        const x=width*(-.3+v*1.64);
        const base=height*(.12+u*.86);
        const sweep=Math.sin(v*Math.PI*1.3+u*2.15+phase*.15)*height*.22;
        const detail=Math.sin(v*7+u*1.2+phase*.16)*height*.06;
        const y=base+sweep+detail;
        const cavity=Math.exp(-Math.pow((x/width-(mobile?.35:.27))/(mobile?.6:.46),6));
        const edge=u<.52?height*(.005+u*.32):height*(.83+(u-.52)*.42);
        let py=y*(1-cavity)+edge*cavity;
        const influence=Math.exp(-((x/width-pointerX)**2/.035+(py/height-pointerY)**2/.05));
        py+=Math.sin(v*8+u*3+phase*.25)*14*influence*pointerPower;
        if(step===0)context.moveTo(x,py);else context.lineTo(x,py);
      }
      context.stroke();
    }
  }
  function tick(time) {
    frame=0;
    if(!allowed()){last=0;return;}
    if(last && time-last<1000/40){frame=requestAnimationFrame(tick);return;}
    const dt=last?Math.min((time-last)/1000,.05):0;
    last=time;
    phase+=dt;
    const follow=1-Math.exp(-dt*5);
    pointerX+=(targetX-pointerX)*follow;
    pointerY+=(targetY-pointerY)*follow;
    pointerPower+=(targetPower-pointerPower)*follow;
    draw();
    frame=requestAnimationFrame(tick);
  }
  function stop() { if(frame)cancelAnimationFrame(frame);frame=0;last=0; }
  function sync() { stop();updateControl();if(allowed())frame=requestAnimationFrame(tick); }
  function resize() {
    if(!rendererReady)return;
    width=Math.max(1,canvas.clientWidth);height=Math.max(1,canvas.clientHeight);
    const ratio=Math.min(window.devicePixelRatio||1,2,Math.sqrt(4000000/(width*height)));
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
    context.setTransform(ratio,0,0,ratio,0,0);draw();
  }
  page.addEventListener('pointermove',event=>{
    if(!allowed()||!fine.matches||event.pointerType==='touch')return;
    const bounds=page.getBoundingClientRect();
    targetX=(event.clientX-bounds.left)/width;targetY=(event.clientY-bounds.top)/height;targetPower=1;
  },{passive:true});
  page.addEventListener('pointerleave',()=>{targetPower=0;});
  page.addEventListener('pointercancel',()=>{targetPower=0;});
  control.addEventListener('click',()=>{manualPause=!manualPause;sync();});
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{targetPower=pointerPower=0;draw();sync();});
  fine.addEventListener('change',()=>{targetPower=0;});
  window.addEventListener('pagehide',stop);
  window.addEventListener('pageshow',sync);
  if('ResizeObserver' in window)new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize',resize,{passive:true});
  canvas.addEventListener('contextlost',()=>{
    rendererReady=false;stop();page.classList.remove('field-ready');updateControl();
  });
  canvas.addEventListener('contextrestored',()=>{
    rendererReady=true;resize();page.classList.add('field-ready');sync();
  });
  resize();page.classList.add('field-ready');sync();
})();
