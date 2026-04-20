/* Tarhuala — app.js */
(function(){
'use strict';
var html=document.documentElement;
var THEME_KEY='tarhuala-theme';
function setTheme(t){
  html.setAttribute('data-theme',t);
  localStorage.setItem(THEME_KEY,t);
  var icon=document.querySelector('.theme-icon');
  if(icon)icon.textContent=t==='dark'?'◑':'◐';
}
var saved=localStorage.getItem(THEME_KEY);
var prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
setTheme(saved||(prefersDark?'dark':'light'));
var themeBtn=document.getElementById('theme-toggle');
if(themeBtn)themeBtn.addEventListener('click',function(){setTheme(html.getAttribute('data-theme')==='dark'?'light':'dark');});

fetch('/data/site.json').then(function(r){return r.json();}).then(function(d){
  var name=d.author||'Tarhuala';
  document.querySelectorAll('#site-name,#footer-name').forEach(function(el){el.textContent=name;});
  var fc=document.getElementById('footer-copy');if(fc)fc.textContent=name;
  var yr=document.getElementById('copy-year');if(yr)yr.textContent=new Date().getFullYear();
}).catch(function(){
  var yr=document.getElementById('copy-year');if(yr)yr.textContent=new Date().getFullYear();
});

var btt=document.getElementById('back-to-top');
if(btt){
  window.addEventListener('scroll',function(){btt.hidden=window.scrollY<400;},{passive:true});
  btt.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
}

function qs(id){return document.getElementById(id);}
function escHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function getParam(k){return new URLSearchParams(location.search).get(k)||'';}

if(document.getElementById('novels-grid')){
  fetch('/data/novels.json').then(function(r){return r.json();}).then(function(novels){
    novels.forEach(function(n){
      fetch('/data/'+n.id+'/info.json').then(function(r){return r.json();}).then(function(info){
        var el=document.getElementById('chcount-'+n.id);
        var count=(info.chapters&&info.chapters.length)||n.chapterCount||0;
        if(el)el.textContent=count+' chapter'+(count!==1?'s':'');
      }).catch(function(){
        var el=document.getElementById('chcount-'+n.id);
        if(el&&n.chapterCount)el.textContent=n.chapterCount+' chapters';
      });
    });
  }).catch(function(){});
}

var novelHero=qs('novel-hero');
if(novelHero){
  var novelId=getParam('id');
  if(!novelId){if(qs('novel-title'))qs('novel-title').textContent='Novel not found';}
  else{
    fetch('/data/'+novelId+'/info.json').then(function(r){return r.json();}).then(function(info){
      html.setAttribute('data-novel-theme',info.theme||'red');
      function setT(id,val){var el=qs(id);if(el)el.textContent=val||'';}
      setT('novel-title',info.title);setT('novel-genre',info.genre);
      setT('novel-desc',info.description);setT('novel-status',info.status);
      setT('novel-rating',info.rating);
      var chapters=info.chapters||[];
      setT('novel-chcount',chapters.length);setT('visible-count',chapters.length);
      var tagsEl=qs('novel-tags');
      if(tagsEl&&info.tags)tagsEl.innerHTML=(info.tags).map(function(t){return'<span class="gtag">'+escHtml(t)+'</span>';}).join('');
      var coverEl=qs('novel-hero-cover');
      if(coverEl){coverEl.src=(info.images&&info.images.cover)||'/images/covers/'+novelId+'.jpg';coverEl.alt=info.title||'';}
      var bgEl=qs('novel-hero-bg-img');
      if(bgEl){bgEl.src=(info.images&&info.images.cover)||'/images/covers/'+novelId+'.jpg';bgEl.alt='';}
      var readBtn=qs('novel-read-btn');
      if(readBtn&&chapters.length>0)readBtn.href='chapter.html?id='+novelId+'&ch='+chapters[0].number;
      document.title=(info.title||'Novel')+' — Tarhuala';
      renderChapterList(chapters,'asc',novelId);
      document.querySelectorAll('.sort-btn').forEach(function(btn){
        btn.addEventListener('click',function(){
          document.querySelectorAll('.sort-btn').forEach(function(b){b.classList.toggle('active',b===btn);});
          renderChapterList(chapters,btn.dataset.order,novelId);
        });
      });
    }).catch(function(){var t=qs('novel-title');if(t)t.textContent='Novel not found';});
  }
}

function renderChapterList(chapters,order,novelId){
  var list=qs('chapters-full-list');if(!list)return;
  var sorted=[].concat(chapters).sort(function(a,b){return order==='desc'?b.number-a.number:a.number-b.number;});
  var vis=qs('visible-count');if(vis)vis.textContent=sorted.length;
  list.innerHTML=sorted.map(function(ch){
    return'<li class="ch-list-item"><a href="chapter.html?id='+novelId+'&ch='+ch.number+'" class="ch-list-link">'+
      '<span class="ch-num">Ch. '+ch.number+'</span>'+
      '<span class="ch-title">'+escHtml(ch.title)+'</span>'+
      '<span class="ch-arrow">&#x2192;</span></a></li>';
  }).join('');
}

var chapterBody=qs('chapter-body');
if(chapterBody){
  var novelId=getParam('id');
  var chNum=parseInt(getParam('ch')||'1',10);
  var bnl=qs('breadcrumb-novel-link');
  if(bnl&&novelId){
    bnl.href='novel.html?id='+novelId;
    bnl.textContent=novelId.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
  }
  var ni=qs('nav-index');if(ni&&novelId)ni.href='novel.html?id='+novelId+'#novel-chapters';
  if(!novelId){chapterBody.innerHTML='<p>No novel specified.</p>';}
  else{
    fetch('/data/'+novelId+'/info.json').then(function(r){return r.json();}).then(function(info){
      html.setAttribute('data-novel-theme',info.theme||'red');
      var chapters=info.chapters||[];
      var idx=chapters.findIndex(function(c){return c.number===chNum;});
      if(bnl)bnl.textContent=info.title||novelId;
      var prevBtn=qs('nav-prev'),nextBtn=qs('nav-next');
      if(prevBtn){if(idx>0)prevBtn.href='chapter.html?id='+novelId+'&ch='+chapters[idx-1].number;else prevBtn.classList.add('disabled');}
      if(nextBtn){if(idx<chapters.length-1)nextBtn.href='chapter.html?id='+novelId+'&ch='+chapters[idx+1].number;else nextBtn.classList.add('disabled');}
      return fetch('/data/'+novelId+'/chapter-'+chNum+'.json');
    }).then(function(r){return r.json();}).then(function(ch){
      document.title='Chapter '+ch.number+': '+ch.title+' — Tarhuala';
      var nl=qs('chapter-num-label');if(nl)nl.textContent='Chapter '+ch.number;
      var tl=qs('chapter-title');if(tl)tl.textContent=ch.title||'';
      var bc=qs('breadcrumb-chapter');if(bc)bc.textContent='Chapter '+ch.number;
      if(ch.html){chapterBody.innerHTML=sanitizeChapterHtml(ch.html);}
      else if(ch.paragraphs){chapterBody.innerHTML=formatParagraphs(ch.paragraphs);}
      else{chapterBody.innerHTML='<p>Chapter content unavailable.</p>';}
    }).catch(function(){chapterBody.innerHTML='<p>Failed to load chapter.</p>';});
  }
  var FONT_KEY='tarhuala-font-size';
  var fontSize=parseInt(localStorage.getItem(FONT_KEY)||'18',10);
  function applyFontSize(){
    html.style.setProperty('--reader-font-size',fontSize+'px');
    var v=qs('font-size-val');if(v)v.textContent=fontSize+'px';
    localStorage.setItem(FONT_KEY,fontSize);
  }
  applyFontSize();
  var sb=qs('reader-settings-btn'),sp=qs('reader-settings-panel');
  if(sb&&sp){
    sb.addEventListener('click',function(e){e.stopPropagation();sp.hidden=!sp.hidden;});
    document.addEventListener('click',function(e){if(!sp.contains(e.target)&&e.target!==sb)sp.hidden=true;});
  }
  var fs_=qs('font-smaller'),fl=qs('font-larger');
  if(fs_)fs_.addEventListener('click',function(){fontSize=Math.max(14,fontSize-1);applyFontSize();});
  if(fl)fl.addEventListener('click',function(){fontSize=Math.min(26,fontSize+1);applyFontSize();});
}

function sanitizeChapterHtml(html){
  return html
    .replace(/<h1[^>]*>.*?<\/h1>/gi,'')
    .replace(/<br\s*\/?>/gi,' ')
    .replace(/\n{3,}/g,'\n\n')
    .replace(/(<p>)(\[.*?\])(<\/p>)/g,'<div class="sys-box">$2</div>')
    .replace(/<p>[^<]*(?:stolen|illicitly|Amazon|unauthorized|misappropriated|report)[^<]*<\/p>/gi,'');
}
function formatParagraphs(paragraphs){
  var sysRx=[/^\[.*\]$/,/^Name:/,/^Age:/,/^Race:/,/^Gender:/,/^Class:/,/^Level:/,/^Stats:/,/^Agi:/,/^Str:/,/^Int:/,/^Vit:/,/^Skills:/,/^Unallocated/,/^HUMANS OF EARTH/i,/^\[.*Killed/,/^\[Leveling/,/^\[Receiving/,/^\[Allocating/,/^\[Received/];
  var breakRx=[/^\*+$/,/^---+$/,/^\*\*\*$/];
  var out='',buf=[];
  function flush(){if(buf.length){out+='<div class="sys-box">'+buf.join('\n')+'</div>';buf=[];}}
  for(var i=0;i<paragraphs.length;i++){
    var parts=paragraphs[i].split(/\n\n+/);
    for(var j=0;j<parts.length;j++){
      var s=parts[j].trim();if(!s)continue;
      if(/stolen|Amazon|unauthorized|misappropriated/i.test(s))continue;
      if(breakRx.some(function(r){return r.test(s);})){flush();out+='<p class="scene-break">&middot; &middot; &middot;</p>';continue;}
      if(sysRx.some(function(r){return r.test(s);})){buf.push(escHtml(s));continue;}
      flush();
      out+='<p>'+escHtml(s).replace(/\[([^\]]+)\]/g,'<em>[$1]</em>')+'</p>';
    }
  }
  flush();
  return out;
}
})();
