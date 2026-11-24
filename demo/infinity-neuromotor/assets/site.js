(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header, menu, phone dock */
  var top = document.getElementById('top'), dock = document.getElementById('dock'), hero = document.getElementById('hero');
  function onScroll(){
    var y = window.scrollY;
    top.classList.toggle('solid', y > (hero ? hero.offsetHeight - 90 : 20) || document.body.classList.contains('menu-open'));
    if(dock) dock.classList.toggle('show', y > 520);
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  var burger = document.querySelector('.burger');
  burger.addEventListener('click', function(){
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open); onScroll();
  });
  document.querySelectorAll('#menu a').forEach(function(a){ a.addEventListener('click', function(){ document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', false); onScroll(); }); });

  /* living topographic contours: Infinity's own contour motif, drawn from noise */
  var P = new Uint8Array(512);
  (function(){ var p=[],i; for(i=0;i<256;i++)p[i]=i; for(i=255;i>0;i--){var j=(Math.random()*(i+1))|0,t=p[i];p[i]=p[j];p[j]=t;} for(i=0;i<512;i++)P[i]=p[i&255]; })();
  function fade(t){return t*t*t*(t*(t*6-15)+10);}
  function lerp(a,b,t){return a+t*(b-a);}
  function grad(h,x,y,z){h&=15;var u=h<8?x:y,v=h<4?y:(h===12||h===14?x:z);return((h&1)?-u:u)+((h&2)?-v:v);}
  function noise(x,y,z){
    var X=Math.floor(x)&255,Y=Math.floor(y)&255,Z=Math.floor(z)&255;
    x-=Math.floor(x);y-=Math.floor(y);z-=Math.floor(z);
    var u=fade(x),v=fade(y),w=fade(z);
    var A=P[X]+Y,AA=P[A]+Z,AB=P[A+1]+Z,B=P[X+1]+Y,BA=P[B]+Z,BB=P[B+1]+Z;
    return lerp(lerp(lerp(grad(P[AA],x,y,z),grad(P[BA],x-1,y,z),u),lerp(grad(P[AB],x,y-1,z),grad(P[BB],x-1,y-1,z),u),v),
                lerp(lerp(grad(P[AA+1],x,y,z-1),grad(P[BA+1],x-1,y,z-1),u),lerp(grad(P[AB+1],x,y-1,z-1),grad(P[BB+1],x-1,y-1,z-1),u),v),w);
  }
  function Topo(canvas, opts){
    if(!canvas) return;
    var ctx = canvas.getContext('2d'), w, h, cols, rows, cell, field, dpr, t = Math.random()*10, visible = true;
    var mouse = {x:-9999, y:-9999, s:0, on:false};
    var levels = opts.levels || 14, alpha = opts.alpha || .14, speed = opts.speed || .00011, scale = opts.scale || .0032;
    function size(){
      dpr = Math.min(window.devicePixelRatio||1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      cell = w < 700 ? 16 : 12;
      cols = Math.ceil(w/cell)+1; rows = Math.ceil(h/cell)+1;
      field = new Float32Array(cols*rows);
    }
    function draw(){
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,w,h);
      var i,j,k;
      for(j=0;j<rows;j++) for(i=0;i<cols;i++){
        var x=i*cell, y=j*cell, v = noise(x*scale, y*scale, t);
        if(mouse.s>.01){ var dx=x-mouse.x, dy=y-mouse.y; v += .5*mouse.s*Math.exp(-(dx*dx+dy*dy)/24000); }
        field[j*cols+i] = v;
      }
      ctx.lineWidth = 1;
      for(k=0;k<levels;k++){
        var th = -0.7 + k*(1.5/levels);
        ctx.strokeStyle = 'rgba(233,238,234,' + (k%4===0 ? alpha*1.9 : alpha) + ')';
        ctx.beginPath();
        for(j=0;j<rows-1;j++) for(i=0;i<cols-1;i++){
          var a=field[j*cols+i], b=field[j*cols+i+1], c=field[(j+1)*cols+i+1], d=field[(j+1)*cols+i];
          var idx=(a>th?8:0)|(b>th?4:0)|(c>th?2:0)|(d>th?1:0);
          if(idx===0||idx===15) continue;
          var x0=i*cell, y0=j*cell;
          var T=[x0+cell*(th-a)/(b-a), y0], R=[x0+cell, y0+cell*(th-b)/(c-b)],
              B=[x0+cell*(th-d)/(c-d), y0+cell], L=[x0, y0+cell*(th-a)/(d-a)], s;
          switch(idx){
            case 1:case 14:s=[L,B];break; case 2:case 13:s=[B,R];break;
            case 3:case 12:s=[L,R];break; case 4:case 11:s=[T,R];break;
            case 6:case 9:s=[T,B];break; case 7:case 8:s=[L,T];break;
            case 5:s=[L,T,B,R];break; default:s=[L,B,T,R];
          }
          for(var q=0;q<s.length;q+=2){ ctx.moveTo(s[q][0],s[q][1]); ctx.lineTo(s[q+1][0],s[q+1][1]); }
        }
        ctx.stroke();
      }
    }
    var last = 0;
    function loop(ts){
      if(visible && ts - last > 33){
        t += speed*Math.min(ts-last, 100);
        mouse.s += ((mouse.on?1:0) - mouse.s)*.05;
        draw(); last = ts;
      }
      requestAnimationFrame(loop);
    }
    size(); draw();
    var rt; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ size(); draw(); }, 120); });
    if(!reduce){
      new IntersectionObserver(function(e){ visible = e[0].isIntersecting; }).observe(canvas);
      if(opts.interactive){
        var host = canvas.parentElement;
        host.addEventListener('pointermove', function(e){ var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true; });
        host.addEventListener('pointerleave', function(){ mouse.on = false; });
      }
      requestAnimationFrame(loop);
    }
  }
  Topo(document.getElementById('topo'), {interactive:true, alpha:.13, levels:16});
  Topo(document.getElementById('topo2'), {alpha:.11, levels:10, scale:.005});
  Topo(document.getElementById('topo3'), {interactive:true, alpha:.11, levels:14, scale:.0028});
  document.querySelectorAll('canvas[data-topo]').forEach(function(c){ Topo(c, {interactive: c.dataset.topo === 'live', alpha:.12, levels:14, scale:.0032}); });

  /* hero entrance + 3D tilt */
  if(hero){
  requestAnimationFrame(function(){ setTimeout(function(){ hero.classList.add('go'); }, 120); });
  var tilt = document.getElementById('tilt');
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove', function(e){
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
      tilt.style.transform = 'rotateY(' + (x*14).toFixed(2) + 'deg) rotateX(' + (-y*10).toFixed(2) + 'deg)';
    });
    hero.addEventListener('pointerleave', function(){ tilt.style.transform = ''; });
  }

  /* hero prisms parallax */
  var prismWraps = document.querySelectorAll('.prism-wrap');
  prismWraps.forEach(function(w){
    var pr = w.querySelector('.prism');
    var s = parseFloat(pr.style.getPropertyValue('--s')), apo = s * 0.866, html = '';
    for(var k=0;k<6;k++) html += '<span class="f" style="transform:rotateY(' + (k*60) + 'deg) translateZ(' + apo.toFixed(1) + 'px)"></span>';
    html += '<span class="cap" style="transform:rotateX(90deg) translateZ(calc(var(--h) / 2))"></span><span class="cap" style="transform:rotateX(-90deg) translateZ(calc(var(--h) / 2))"></span>';
    pr.innerHTML = html;
  });
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove', function(e){
      var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
      prismWraps.forEach(function(w){ var d = +w.dataset.depth; w.style.transform = 'translate3d(' + (-x*d).toFixed(1) + 'px,' + (-y*d).toFixed(1) + 'px,0)'; });
    });
  }

  }
  document.querySelectorAll('.page-hero').forEach(function(h){ requestAnimationFrame(function(){ setTimeout(function(){ h.classList.add('go'); }, 80); }); });

  /* 3D scroll entrances */
  if(!reduce && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }); }, {rootMargin:'0px 0px -12% 0px'});
    document.querySelectorAll('[data-rise]').forEach(function(el){ io.observe(el); });
  } else { document.querySelectorAll('[data-rise]').forEach(function(el){ el.classList.add('in'); }); }

  /* 3D tilt on cards */
  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('[data-tilt]').forEach(function(el){
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
        el.style.transform = 'perspective(900px) rotateY(' + (x*10).toFixed(2) + 'deg) rotateX(' + (-y*8).toFixed(2) + 'deg) translateZ(6px)';
      });
      el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
    });
  }

  if(document.getElementById('steps')){
  /* care path progress */
  var steps = document.getElementById('steps'), fill = document.getElementById('fill'), stepEls = steps.querySelectorAll('.step');
  function pathProgress(){
    var r = steps.getBoundingClientRect(), vh = window.innerHeight;
    var p = reduce ? 1 : Math.min(1, Math.max(0, (vh*.8 - r.top) / (vh*.55)));
    fill.style.width = 'calc((100% - 60px) * ' + p.toFixed(3) + ')';
    stepEls.forEach(function(s, i){ s.classList.toggle('on', p >= i/(stepEls.length-1) - .02); });
  }
  window.addEventListener('scroll', pathProgress, {passive:true}); pathProgress();

  /* care explorer */
  var tabs = document.querySelectorAll('.tab'), frames = document.querySelectorAll('.frame');
  tabs.forEach(function(tb){
    tb.addEventListener('click', function(){
      var i = +tb.dataset.i;
      tabs.forEach(function(x){ x.setAttribute('aria-selected', x === tb); });
      frames.forEach(function(f, k){ var was = f.classList.contains('on'); f.classList.toggle('out', was && k !== i); f.classList.toggle('on', k === i); if(k !== i && !was) f.classList.remove('out'); });
    });
  });

  /* patient story reels (Infinity's own videos) */
  var V = 'https://storage.googleapis.com/msgsndr/RvIK52c8TkPAkG6tDWzj/media/';
  var reels = [
    ['681cbcb302d020ccc4009374.mov','6822828440eb136aee7c9439.png','Intensive before and after','Patient story'],
    ['681cbc663d8df84cf505bcb6.mp4','6822828560d3335f9915e68f.png','3-week intensive','Patient story'],
    ['681cbcb302d0208a7b009373.mp4','6822828425c6ca15b8d37067.png','TMB primitive reflexes','Inside a session'],
    ['681d14171fe3224ee87afd84.mp4','68228284a20a2ad4343844e3.png','Anxiety before and after','Patient story'],
    ['6803877729d6291fa533b13d.mp4','68228284a20a2af7683844e2.png','Intensive before and after','Patient story'],
    ['681cbe97786bf129beb411b6.mp4','6822828440eb13e0517c9438.png','How Infinity is different','From our team'],
    ['681cba79786bf17245b409f7.mp4','68228284dbcf31586929bb88.png','The first thing we do','From our team'],
    ['681d1433f47ce8d93e20f9e1.mp4','6822828425c6ca0ba4d37066.png','Photobiomodulation','Inside a session'],
    ['681cbcb302d0204116009372.mp4','6822828425c6caee1ad37068.png','Intensive before and after','Patient story']
  ];
  var ring = document.getElementById('ring'), stage = document.getElementById('ringStage');
  var N = reels.length, STEP = 360 / N, cards = [], angle = 0, vel = 0, dragging = false, hover = false, target = null, frontIdx = -1;
  reels.forEach(function(r, i){
    var b = document.createElement('button');
    b.className = 'reel'; b.type = 'button';
    b.setAttribute('aria-label', 'Play video: ' + r[2]);
    b.innerHTML = '<span class="pv"><img src="' + V + r[1] + '" alt="" loading="lazy" width="240" height="427"><video muted loop playsinline preload="none" poster="' + V + r[1] + '"></video><span class="shade"></span><span class="live-tag"><i></i>Playing</span><span class="play"><svg width="15" height="15" viewBox="0 0 24 24" fill="#2a3638"><path d="M7 4l13 8-13 8z"/></svg></span><span class="cap"><b>' + r[2] + '</b><small>' + r[3] + '</small></span></span>';
    b.addEventListener('click', function(){
      if(moved > 6) return;
      if(i === frontIdx) openVideo(V + r[0], V + r[1]); else goTo(i);
    });
    ring.appendChild(b); cards.push(b);
  });
  function radius(){ var w = cards[0].offsetWidth; return Math.round((w/2) / Math.tan(Math.PI / N) + (w < 200 ? 60 : 120)); }
  var R = radius();
  window.addEventListener('resize', function(){ R = radius(); });
  function norm(a){ a = ((a % 360) + 540) % 360 - 180; return a; }
  function layout(){
    var best = 999, bi = 0;
    cards.forEach(function(c, i){
      var a = norm(i*STEP + angle), ab = Math.abs(a);
      var fade = Math.max(0, 1 - ab/150);
      c.style.transform = 'rotateY(' + (i*STEP + angle).toFixed(2) + 'deg) translateZ(' + R + 'px)';
      c.style.opacity = (0.25 + 0.75*fade).toFixed(3);
      c.style.filter = ab > 30 ? 'saturate(' + (0.4 + 0.6*fade).toFixed(2) + ') brightness(' + (0.75 + 0.25*fade).toFixed(2) + ')' : 'none';
      c.style.zIndex = Math.round(fade*100);
      c.tabIndex = ab < STEP/2 ? 0 : -1;
      if(ab < best){ best = ab; bi = i; }
    });
    if(bi !== frontIdx) setFront(bi);
  }
  function setFront(i){
    frontIdx = i;
    document.getElementById('rnow').textContent = reels[i][2];
    document.getElementById('rnum').textContent = (i+1) + ' of ' + N;
    cards.forEach(function(c, k){
      var v = c.querySelector('video');
      if(k === i && !reduce){
        if(!v.src) v.src = V + reels[k][0];
        var pr = v.play(); if(pr) pr.then(function(){ c.classList.add('live'); }).catch(function(){});
      } else { v.pause(); c.classList.remove('live'); }
    });
  }
  function goTo(i){ var cur = norm(-angle) ; var want = i*STEP; var d = norm(want - cur); target = angle - d; }
  document.getElementById('rnext').addEventListener('click', function(){ goTo((frontIdx+1)%N); });
  document.getElementById('rprev').addEventListener('click', function(){ goTo((frontIdx-1+N)%N); });
  var px = 0, moved = 0, lastX = 0, lastT = 0;
  stage.addEventListener('pointerdown', function(e){ dragging = true; moved = 0; px = lastX = e.clientX; lastT = performance.now(); target = null; stage.classList.add('drag'); });
  window.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var dx = e.clientX - lastX, now = performance.now();
    angle += dx * 0.22; moved += Math.abs(dx);
    vel = dx * 0.22 / Math.max(1, now - lastT) * 16;
    lastX = e.clientX; lastT = now;
  });
  window.addEventListener('pointerup', function(){ if(!dragging) return; dragging = false; stage.classList.remove('drag'); setTimeout(function(){ moved = 0; }, 30); });
  stage.addEventListener('pointerenter', function(){ hover = true; });
  stage.addEventListener('pointerleave', function(){ hover = false; });
  stage.addEventListener('keydown', function(e){ if(e.key === 'ArrowRight'){ goTo((frontIdx+1)%N); } if(e.key === 'ArrowLeft'){ goTo((frontIdx-1+N)%N); } });
  var ringVisible = true;
  new IntersectionObserver(function(e){ ringVisible = e[0].isIntersecting; if(!ringVisible) cards.forEach(function(c){ c.querySelector('video').pause(); c.classList.remove('live'); }); else { var f = frontIdx; frontIdx = -1; layout(); } }).observe(stage);
  function spin(){
    if(ringVisible && !player.classList.contains('open')){
      if(target !== null){ var d = target - angle; angle += d * 0.09; if(Math.abs(d) < .05){ angle = target; target = null; } }
      else if(!dragging){
        if(Math.abs(vel) > .01){ angle += vel; vel *= .94; }
        else if(!hover && !reduce){ angle -= 0.06; }
      }
      layout();
    }
    requestAnimationFrame(spin);
  }
  var player = document.getElementById('player'), pv = document.getElementById('pv'), lastFocus;
  layout(); requestAnimationFrame(spin);
  function openVideo(src, poster){ cards.forEach(function(c){ c.querySelector('video').pause(); }); lastFocus = document.activeElement; pv.poster = poster; pv.src = src; player.classList.add('open'); document.getElementById('pclose').focus(); var pr = pv.play(); if(pr) pr.catch(function(){}); }
  function closeVideo(){ pv.pause(); pv.removeAttribute('src'); pv.load(); player.classList.remove('open'); if(lastFocus) lastFocus.focus(); frontIdx = -1; layout(); }
  document.getElementById('pclose').addEventListener('click', closeVideo);
  player.addEventListener('click', function(e){ if(e.target === player) closeVideo(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && player.classList.contains('open')) closeVideo(); });

  /* parent quotes */
  var qs = document.querySelectorAll('.q'), dots = document.getElementById('qdots'), qi = 0, timer;
  qs.forEach(function(){ dots.appendChild(document.createElement('i')); });
  function showQ(n){ qi = (n + qs.length) % qs.length; qs.forEach(function(q,k){ q.classList.toggle('on', k === qi); }); dots.querySelectorAll('i').forEach(function(d,k){ d.classList.toggle('on', k === qi); }); }
  function auto(){ clearInterval(timer); if(!reduce) timer = setInterval(function(){ showQ(qi+1); }, 7000); }
  document.getElementById('qnext').addEventListener('click', function(){ showQ(qi+1); auto(); });
  document.getElementById('qprev').addEventListener('click', function(){ showQ(qi-1); auto(); });
  showQ(0); auto();

  /* locations */
  var L = {
    ia:{n:'Iowa clinic', ph:'515-264-3405', tel:'+15152643405', em:'info@iowainfinity.com', note:'Exams, intensives and ongoing care in clinic.'},
    mn:{n:'Minnesota clinic', ph:'612-444-2545', tel:'+16124442545', em:'info@minnesotainfinity.com', note:'Exams, intensives and ongoing care in clinic.'},
    co:{n:'Colorado clinic', ph:'720-303-0031', tel:'+17203030031', em:'info@coloradoinfinity.com', note:'Exams, intensives and ongoing care in clinic.'},
    vr:{n:'Virtual program', note:'Functional medicine support for families who need care from home. A Care Coordinator will explain eligibility and next steps.'}
  };
  var panel = document.getElementById('panel');
  function showLoc(k){
    var d = L[k], h = '<h3>' + d.n + '</h3><div class="line"><span>' + d.note + '</span>';
    if(d.ph) h += '<a href="tel:' + d.tel + '">' + d.ph + '</a><span>' + d.em + '</span>';
    h += '</div><div class="acts"><a class="btn btn-light" href="https://infinityneuromotor.com/discovery">Book a free discovery call</a>' + (d.ph ? '<a class="btn btn-line" href="tel:' + d.tel + '">Call now</a>' : '') + '</div>';
    panel.innerHTML = h;
  }
  var picks = document.querySelectorAll('.pick');
  picks.forEach(function(p){ p.addEventListener('click', function(){ picks.forEach(function(x){ x.setAttribute('aria-selected', x === p); }); showLoc(p.dataset.k); }); });
  showLoc('ia');
  }

  /* demo forms: show a clear preview notice instead of sending */
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var n = f.querySelector('.form-note');
      if(n){ n.hidden = false; n.focus(); }
    });
  });
})();
