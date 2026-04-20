#!/usr/bin/env node
// BUILD — reads site.json + novels/ dir (optional), writes public/

const fs   = require("fs");
const path = require("path");

let mammoth;
try { mammoth = require("mammoth"); } catch(e) { mammoth = null; }

const ROOT       = __dirname;
const NOVELS_DIR = path.join(ROOT, "novels");
const PUBLIC     = path.join(ROOT, "public");
const DATA_DIR   = path.join(PUBLIC, "data");
const IMG_DIR    = path.join(PUBLIC, "images");

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function esc(s) {
  return (s||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function parseChapter(filename) {
  const base = path.basename(filename,".docx");
  const m = base.match(/^Chapter_(\d+)_(.+)$/i);
  if (!m) return null;
  return { number:parseInt(m[1],10), title:m[2].replace(/_/g," "), filename };
}
function findImage(dir, baseName) {
  for (const ext of [".jpg",".jpeg",".png",".webp",".avif"]) {
    const p = path.join(dir, baseName+ext);
    if (fs.existsSync(p)) return { path:p, ext };
  }
  return null;
}
function copyImage(srcDir, srcName, destDir, destName) {
  const found = findImage(srcDir, srcName);
  if (!found) return null;
  fs.mkdirSync(destDir,{recursive:true});
  const dest = path.join(destDir, destName+found.ext);
  fs.copyFileSync(found.path, dest);
  return "/images/"+path.basename(destDir)+"/"+destName+found.ext;
}

// ── STATIC FALLBACK DATA ───────────────────────────────────
const STATIC_NOVELS = [
  {
    id: "mutation-of-the-apocalypse",
    title: "Mutation of the Apocalypse",
    genre: "Post-Apocalyptic Dark Fantasy",
    tags: ["Apocalypse","Mutation","Survival","Horror"],
    status: "Ongoing", rating: "Mature 18+",
    description: "On the eve of his birthday, a destitute orphan finds solace in celebrating his lone glimmer of hope and happiness. However, his joy is abruptly shattered by an enigmatic mechanical voice that throws his life into a tumultuous tailspin.<br><br>The source and purpose of this pervasive voice remain a mystery, as it triggers a cataclysmic event that transforms the world into a nightmarish apocalypse. Streets once bustling with life become scenes of chaos as cars collide, spilling their occupants onto the pavement, streets painted with fresh crimson, and establishments erupt in panicked screams.<br><br>---<br>\HUMANS OF EARTH! INITIATING EARTH MUTATION PROGRAM!\"",
    theme: "red",
    images: {},
  },
  {
    id: "monarch-of-depravity",
    title: "Monarch of Depravity",
    genre: "Dark Fantasy · Psychological Thriller",
    tags: ["Cult","Villain Protagonist","Psychological"],
    status: "Ongoing", rating: "Mature 18+",
    description: "They called him a monster. They were right. Rising from the gutter of a crumbling empire, a man of unfathomable ambition carves his throne from the bones of those who dared stand in his way. With a mind sharper than any blade and a cruelty that knows no bounds, the self-proclaimed Monarch weaves a web of manipulation, betrayal, and dark power that threatens to consume entire kingdoms.",
    theme: "gold",
    images: {},
  }
];

// ── CSS ────────────────────────────────────────────────────
function getCSS() {
return `/* Tarhuala — Dark Fiction */
:root {
  --black:     #000000;
  --void:      #070709;
  --deep:      #0c0c0f;
  --surface:   #101014;
  --surface2:  #161619;
  --surface3:  #1d1d22;
  --border:    #23232c;
  --border2:   #2e2e3a;
  --text:      #e6e3dd;
  --text2:     #9e9690;
  --text3:     #555060;
  --red:       #b8341e;
  --red2:      #e0432e;
  --red-dim:   #4a160e;
  --blue:      #15406e;
  --blue2:     #2060b8;
  --blue3:     #3a80d8;
  --blue-glow: rgba(21,64,110,0.3);
  --gold:      #c4991e;
  --gold2:     #e6c040;
  --gold-dim:  #50400a;
  --white:     #ede9e2;
  --nav-h:     64px;
  --reader-font-size: 18px;
}
[data-theme="light"] {
  --black:    #f4efe6;
  --void:     #eae3d5;
  --deep:     #ddd5c5;
  --surface:  #d2c9b5;
  --surface2: #c5bba4;
  --surface3: #b8ad96;
  --border:   #9e8e72;
  --border2:  #8e7a5e;
  --text:     #160e08;
  --text2:    #382415;
  --text3:    #64503a;
  --red:      #9a1e10;
  --red2:     #c02818;
  --red-dim:  #d4a898;
  --blue:     #0a3558;
  --blue2:    #154880;
  --blue3:    #1e5898;
  --blue-glow:rgba(10,53,88,0.15);
  --gold:     #725205;
  --gold2:    #906810;
  --gold-dim: #d8c498;
  --white:    #160e08;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{
  font-family:'Crimson Text',Georgia,serif;
  background:var(--void);color:var(--text);
  min-height:100vh;overflow-x:hidden;
  transition:background .3s,color .3s;
}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{cursor:pointer;font-family:inherit;border:none;background:none}
ol,ul{list-style:none}

.noise-overlay{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
  opacity:.45;
}
[data-theme="light"] .noise-overlay{opacity:.12}

/* NAV */
.site-nav{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  height:var(--nav-h);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 48px;
  background:rgba(7,7,9,.88);
  backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
  transition:background .3s;
}
[data-theme="light"] .site-nav{background:rgba(234,227,213,.92)}
.nav-brand{
  display:flex;align-items:center;gap:12px;
  font-family:'Cinzel',serif;
  font-size:13px;letter-spacing:4px;font-weight:900;
  color:var(--text);text-transform:uppercase;
}
.nav-emblem{
  width:28px;height:28px;
  border:1.5px solid var(--red);
  border-radius:50%;
  position:relative;overflow:hidden;flex-shrink:0;
}
.nav-emblem::before{
  content:'';position:absolute;
  width:13px;height:13px;background:var(--red);
  border-radius:50%;top:50%;left:50%;
  transform:translate(-50%,-50%) translateX(-4px);
}
.nav-links{display:flex;align-items:center;gap:4px}
.nav-link{
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;
  color:var(--text3);padding:8px 16px;
  transition:color .2s;text-transform:uppercase;position:relative;
}
.nav-link::after{
  content:'';position:absolute;bottom:4px;left:16px;right:16px;
  height:1px;background:var(--red);
  transform:scaleX(0);transition:transform .25s;
}
.nav-link:hover,.nav-link.active{color:var(--text)}
.nav-link:hover::after,.nav-link.active::after{transform:scaleX(1)}
.nav-right{display:flex;align-items:center;gap:12px}
.theme-btn{
  width:34px;height:34px;
  border:1px solid var(--border2);
  border-radius:50%;color:var(--text3);
  display:flex;align-items:center;justify-content:center;
  font-size:14px;transition:all .2s;
}
.theme-btn:hover{border-color:var(--gold);color:var(--gold)}

/* BTNS */
.btn{
  display:inline-flex;align-items:center;gap:8px;
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:2.5px;
  padding:12px 24px;transition:all .2s;text-transform:uppercase;
}
.btn-primary{background:var(--red);color:#fff}
.btn-primary:hover{background:var(--red2);transform:translateY(-1px)}
.btn-ghost{border:1px solid var(--border2);color:var(--text2)}
.btn-ghost:hover{border-color:var(--text2);color:var(--text)}
.btn-gold{border:1px solid var(--gold-dim);color:var(--gold)}
.btn-gold:hover{border-color:var(--gold2);color:var(--gold2)}
.btn-outline{border:1px solid var(--blue2);color:var(--blue3)}
.btn-outline:hover{background:var(--blue);color:#fff}

.back-to-top{
  position:fixed;bottom:28px;right:28px;z-index:999;
  width:42px;height:42px;
  border:1px solid var(--border2);background:var(--surface);
  color:var(--text3);display:flex;align-items:center;justify-content:center;
  font-size:18px;transition:all .2s;opacity:.7;
}
.back-to-top:hover{border-color:var(--gold);color:var(--gold);opacity:1}

/* FOOTER */
.site-footer{
  background:var(--black);
  border-top:1px solid var(--border);
  padding:48px;
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:24px;margin-top:80px;
}
.footer-brand{font-family:'Cinzel',serif;font-size:11px;letter-spacing:3px;color:var(--text3)}
.footer-links{display:flex;gap:24px}
.footer-link{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--text3);transition:color .2s}
.footer-link:hover{color:var(--text)}
.footer-cw{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;
  color:var(--red-dim);padding:4px 8px;border:1px solid var(--red-dim);
}
.footer-copy{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--text3)}

.section-label{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:5px;
  color:var(--red);text-transform:uppercase;display:block;margin-bottom:8px;
}
.section-title{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(28px,4vw,48px);color:var(--text);line-height:1.1;
}
.section-divider{display:flex;align-items:center;gap:16px;padding:48px 0}
.div-line{flex:1;height:1px;background:var(--border)}
.div-glyph{font-size:20px;color:var(--text3);font-family:serif}

/* HOME */
.home-hero{
  position:relative;min-height:100vh;
  display:flex;align-items:flex-end;
  padding:0 80px 100px;overflow:hidden;
  padding-top:var(--nav-h);
}
.home-hero-bg{position:absolute;inset:0;z-index:0}
.home-hero-bg-img{
  width:100%;height:100%;object-fit:cover;
  opacity:.15;filter:grayscale(50%) contrast(1.3);
}
[data-theme="light"] .home-hero-bg-img{opacity:.08}
.home-hero-vignette{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 25% 60%, var(--blue-glow) 0%, transparent 60%),
    linear-gradient(to right, var(--void) 0%, rgba(7,7,9,.7) 55%, transparent 100%),
    linear-gradient(to top, var(--void) 0%, transparent 40%);
}
[data-theme="light"] .home-hero-vignette{
  background:
    linear-gradient(to right, var(--void) 0%, rgba(234,227,213,.7) 55%, transparent 100%),
    linear-gradient(to top, var(--void) 0%, transparent 40%);
}
.hero-cracks{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.07}
.hero-crack{
  position:absolute;background:linear-gradient(var(--red),transparent);
  width:1px;animation:crackGrow 2.5s ease-out forwards;transform-origin:top;
}
@keyframes crackGrow{from{height:0;opacity:0}to{height:var(--h);opacity:1}}
.home-hero-content{position:relative;z-index:2;max-width:680px}
.home-hero-kicker{
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:6px;color:var(--red);
  margin-bottom:16px;opacity:0;animation:fadeUp .8s .2s forwards;
}
.home-hero-title{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(60px,9vw,120px);line-height:.88;letter-spacing:-3px;
  color:var(--text);margin-bottom:24px;
  opacity:0;animation:fadeUp .9s .35s forwards;
}
.home-hero-title span{
  display:block;
  background:linear-gradient(135deg, var(--text) 30%, var(--text3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.home-hero-tagline{
  font-size:20px;font-style:italic;color:var(--text2);
  margin-bottom:40px;line-height:1.6;
  opacity:0;animation:fadeUp .8s .5s forwards;
}
.home-hero-cta{
  display:flex;gap:16px;flex-wrap:wrap;margin-bottom:64px;
  opacity:0;animation:fadeUp .8s .65s forwards;
}
.home-hero-stats{
  display:flex;align-items:center;
  opacity:0;animation:fadeUp .8s .8s forwards;
}
.hero-stat{display:flex;flex-direction:column;align-items:flex-start;padding:0 32px 0 0}
.hero-stat:first-child{padding-left:0}
.hero-stat-num{
  font-family:'Cinzel',serif;font-size:34px;font-weight:900;
  color:var(--gold);line-height:1;
}
.hero-stat-label{
  font-family:'Cinzel',serif;font-size:7px;letter-spacing:3px;
  color:var(--text3);margin-top:4px;
}
.hero-stat-sep{width:1px;height:40px;background:var(--border2);margin-right:32px}
.hero-scroll{
  position:absolute;bottom:40px;right:80px;z-index:2;
  display:flex;flex-direction:column;align-items:center;gap:8px;
  opacity:0;animation:fadeIn 1s 1.5s forwards;
}
@keyframes fadeIn{to{opacity:.4}}
.hero-scroll-line{
  width:1px;height:50px;
  background:linear-gradient(to bottom,var(--gold),transparent);
  animation:scrollLine 2.2s ease-in-out infinite;
}
@keyframes scrollLine{
  0%{transform:scaleY(0);transform-origin:top}
  50%{transform:scaleY(1);transform-origin:top}
  51%{transform:scaleY(1);transform-origin:bottom}
  100%{transform:scaleY(0);transform-origin:bottom}
}
.hero-scroll-label{
  font-family:'Cinzel',serif;font-size:7px;letter-spacing:3px;
  color:var(--text3);writing-mode:vertical-rl;
}
.novels-section{background:var(--deep);padding:80px 0}
.novels-inner{max-width:1280px;margin:0 auto;padding:0 48px}
.section-head{
  margin-bottom:48px;
  display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;
}
.novels-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:2px;
}
.novel-card{position:relative;overflow:hidden;background:var(--surface);transition:transform .3s}
.novel-card:hover{transform:translateY(-4px)}
.novel-card-link{display:block}
.novel-card-cover{position:relative;height:420px;overflow:hidden}
.novel-cover-img{
  width:100%;height:100%;object-fit:cover;
  transition:transform .5s,filter .3s;
  filter:brightness(.75) saturate(.85);
}
.novel-card:hover .novel-cover-img{transform:scale(1.05);filter:brightness(.9) saturate(1.1)}
.novel-card-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top, var(--surface) 0%, transparent 55%);
  transition:opacity .3s;
}
.novel-card:hover .novel-card-overlay{opacity:.75}
.novel-card-badges{
  position:absolute;top:16px;right:16px;
  display:flex;flex-direction:column;gap:6px;align-items:flex-end;
}
.status-pill{
  font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;
  background:var(--blue);color:#fff;padding:4px 8px;
}
.novel-rating-badge{
  font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;
  background:var(--red-dim);color:var(--red2);
  padding:4px 8px;border:1px solid var(--red-dim);
}
.novel-card-title-over{position:absolute;bottom:0;left:0;right:0;padding:24px}
.novel-card-title-text{
  font-family:'Cinzel',serif;font-size:20px;font-weight:900;
  color:var(--text);line-height:1.15;
  text-shadow:0 2px 16px rgba(0,0,0,.9);
}
.novel-card-body{
  padding:20px 24px 28px;
  border-top:2px solid transparent;
  transition:border-color .3s;
}
.novel-card[data-novel-theme="red"] .novel-card-body{border-color:var(--red)}
.novel-card[data-novel-theme="gold"] .novel-card-body{border-color:var(--gold)}
.novel-card[data-novel-theme="blue"] .novel-card-body{border-color:var(--blue2)}
.novel-card-genre{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;
  color:var(--text3);margin-bottom:8px;text-transform:uppercase;
}
.novel-card-desc{font-size:14px;color:var(--text3);line-height:1.6;font-style:italic;margin-bottom:16px}
.novel-card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}
.gtag{
  font-family:'Cinzel',serif;font-size:7px;letter-spacing:1.5px;
  color:var(--text3);border:1px solid var(--border2);padding:3px 8px;transition:all .2s;
}
.gtag:hover{border-color:var(--red);color:var(--red)}
.novel-card-foot{
  display:flex;align-items:center;justify-content:space-between;
  padding-top:12px;border-top:1px solid var(--border);
}
.novel-chcount{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--text3)}
.novel-read-cta{
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--red2);
  transition:letter-spacing .2s;
}
.novel-card:hover .novel-read-cta{letter-spacing:4px}

/* NOVELS LIST PAGE */
.page-hero-bar{
  padding:calc(var(--nav-h) + 60px) 48px 48px;
  background:var(--deep);border-bottom:1px solid var(--border);
  position:relative;overflow:hidden;
}
.page-hero-bar::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(to bottom,transparent,var(--red),transparent);
}
.page-hero-inner{max-width:1280px;margin:0 auto}
.page-hero-title{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(36px,6vw,72px);color:var(--text);line-height:1;letter-spacing:-1px;
}
.page-hero-sub{font-style:italic;font-size:18px;color:var(--text3);margin-top:8px}
.novels-list-page{padding:60px 48px 80px}
.novels-list-inner{max-width:1280px;margin:0 auto;display:flex;flex-direction:column;gap:1px}
.novel-list-item{background:var(--surface);transition:background .2s;overflow:hidden}
.novel-list-item:hover{background:var(--surface2)}
.novel-list-link{display:flex;gap:0;min-height:220px}
.novel-list-cover{
  width:140px;flex-shrink:0;object-fit:cover;
  filter:saturate(.75);transition:filter .3s;
}
.novel-list-item:hover .novel-list-cover{filter:saturate(1)}
.novel-list-body{
  flex:1;padding:32px 40px;
  border-left:3px solid transparent;transition:border-color .3s;
  display:flex;flex-direction:column;justify-content:center;
}
.novel-list-item:nth-child(odd) .novel-list-body{border-color:var(--red)}
.novel-list-item:nth-child(even) .novel-list-body{border-color:var(--gold)}
.novel-list-genre{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;
  color:var(--red);margin-bottom:8px;
}
.novel-list-title{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(20px,3vw,30px);color:var(--text);
  margin-bottom:12px;line-height:1.1;
}
.novel-list-desc{
  font-size:16px;font-style:italic;color:var(--text2);
  line-height:1.7;margin-bottom:20px;max-width:640px;
}
.novel-list-foot{display:flex;align-items:center;gap:20px}
.novel-status-tag{
  font-family:'Cinzel',serif;font-size:7px;letter-spacing:2px;
  color:var(--blue3);border:1px solid var(--blue);padding:4px 10px;
}
.novel-read-link{
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;
  color:var(--red2);transition:letter-spacing .2s;
}
.novel-list-item:hover .novel-read-link{letter-spacing:4px}

/* NOVEL PAGE */
.page-main{padding-top:var(--nav-h)}
.novel-hero{
  position:relative;min-height:min(90vh,700px);
  display:flex;align-items:flex-end;overflow:hidden;
}
.novel-hero-bg{position:absolute;inset:0;z-index:0}
.novel-hero-bg-layer{
  position:absolute;inset:0;
  background:
    linear-gradient(to right, var(--void) 38%, transparent 100%),
    linear-gradient(to top, var(--void) 0%, transparent 55%);
}
.novel-hero-bg-img-wrap{position:absolute;inset:0;overflow:hidden}
.novel-hero-bg-img{
  width:100%;height:100%;object-fit:cover;
  transform:scale(1.06);filter:brightness(.35) saturate(.6);
  transition:transform 8s ease;
}
.novel-hero:hover .novel-hero-bg-img{transform:scale(1.09)}
.novel-hero-inner{
  position:relative;z-index:1;
  display:flex;gap:60px;align-items:flex-end;
  padding:80px;width:100%;max-width:1280px;margin:0 auto;
}
.cover-frame{position:relative;flex-shrink:0;width:220px}
.cover-corner{
  position:absolute;width:14px;height:14px;
  border-color:var(--gold);border-style:solid;border-width:0;
}
.cover-corner.tl{top:-4px;left:-4px;border-top-width:2px;border-left-width:2px}
.cover-corner.tr{top:-4px;right:-4px;border-top-width:2px;border-right-width:2px}
.cover-corner.bl{bottom:-4px;left:-4px;border-bottom-width:2px;border-left-width:2px}
.cover-corner.br{bottom:-4px;right:-4px;border-bottom-width:2px;border-right-width:2px}
.cover-img{width:100%;aspect-ratio:2/3;object-fit:cover;box-shadow:0 32px 80px rgba(0,0,0,.8)}
.novel-hero-text{max-width:580px}
.novel-hero-title{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(26px,4vw,52px);color:var(--text);
  line-height:1.05;margin-bottom:16px;
}
.novel-hero-meta{
  display:flex;align-items:center;gap:12px;
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;
  color:var(--text3);margin-bottom:20px;
}
.meta-dot{color:var(--border2)}
.novel-hero-desc{font-size:16px;font-style:italic;color:var(--text2);line-height:1.8;margin-bottom:24px}
.novel-hero-tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}
.novel-hero-cta{display:flex;gap:16px;flex-wrap:wrap}
.novel-chapters-section{background:var(--deep);padding:64px 0}
.novel-chapters-inner{max-width:1280px;margin:0 auto;padding:0 80px}
.chapters-toolbar{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:32px;padding-bottom:20px;border-bottom:1px solid var(--border);
}
.chapters-count{font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:var(--text3)}
.chapters-sort{display:flex;gap:4px}
.sort-btn{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;
  color:var(--text3);padding:8px 16px;border:1px solid var(--border);transition:all .2s;
}
.sort-btn.active,.sort-btn:hover{border-color:var(--red);color:var(--red)}
.chapters-full-list{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
  gap:2px;
}
.ch-list-item{}
.ch-list-link{
  display:flex;align-items:center;gap:16px;
  padding:16px 20px;background:var(--surface);
  border-left:3px solid transparent;transition:all .18s;
}
.ch-list-link:hover{background:var(--surface2);border-left-color:var(--red);padding-left:24px}
.ch-num{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--gold-dim);width:60px;flex-shrink:0}
.ch-title{font-size:15px;color:var(--text2);flex:1;transition:color .2s}
.ch-list-link:hover .ch-title{color:var(--text)}
.ch-arrow{font-size:12px;color:var(--border2);transition:transform .2s,color .2s}
.ch-list-link:hover .ch-arrow{transform:translateX(4px);color:var(--red)}

/* READER */
.reader-settings-panel{
  position:fixed;top:calc(var(--nav-h) + 8px);right:16px;z-index:900;
  background:var(--surface2);border:1px solid var(--border2);
  padding:20px;min-width:180px;box-shadow:0 8px 32px rgba(0,0,0,.5);
}
.rsp-label{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--text3);display:block;margin-bottom:12px}
.rsp-size-controls{display:flex;align-items:center;gap:12px}
.rsp-btn{
  font-family:'Cinzel',serif;font-size:12px;color:var(--text2);
  border:1px solid var(--border2);width:32px;height:32px;
  display:flex;align-items:center;justify-content:center;transition:all .2s;
}
.rsp-btn:hover{border-color:var(--gold);color:var(--gold)}
.rsp-size-val{font-family:'Cinzel',serif;font-size:10px;color:var(--text3);flex:1;text-align:center}
.reader-main{max-width:740px;margin:0 auto;padding:calc(var(--nav-h)+60px) 40px 100px}
.reader-breadcrumb{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--text3);
  display:flex;align-items:center;gap:10px;margin-bottom:60px;flex-wrap:wrap;
}
.reader-breadcrumb a{transition:color .2s}
.reader-breadcrumb a:hover{color:var(--text)}
.reader-breadcrumb span{color:var(--border2)}
.chapter-header{margin-bottom:60px;text-align:center}
.chapter-num-label{
  font-family:'Cinzel',serif;font-size:8px;letter-spacing:5px;
  color:var(--red);margin-bottom:16px;
}
.chapter-title{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(22px,4vw,40px);color:var(--text);
  line-height:1.15;margin-bottom:24px;
}
.chapter-ornament{
  display:flex;align-items:center;justify-content:center;gap:12px;
  color:var(--text3);font-size:14px;letter-spacing:4px;
}
.ornament-glyph{font-size:22px;color:var(--gold);opacity:.45}
.chapter-body{font-size:var(--reader-font-size);line-height:2;color:var(--text2)}
.chapter-body p{margin-bottom:1.5em;text-align:justify;font-family:'Crimson Text',serif}
.chapter-body p:first-of-type::first-letter{
  font-family:'Cinzel',serif;font-weight:900;font-size:4em;float:left;
  line-height:.75;margin:4px 12px -4px 0;color:var(--red);
}
.sys-box{
  background:var(--surface2);border:1px solid var(--border2);
  border-left:3px solid var(--blue2);
  padding:16px 20px;margin:24px 0;
  font-family:'Cinzel',serif;font-size:11px;letter-spacing:.5px;
  color:var(--blue3);white-space:pre-line;line-height:1.9;
}
.scene-break{text-align:center;color:var(--text3);letter-spacing:12px;font-size:18px;margin:32px 0}
.chapter-loading{font-style:italic;color:var(--text3);font-size:16px}
.chapter-nav{
  display:grid;grid-template-columns:1fr auto 1fr;
  gap:8px;margin-top:80px;padding-top:40px;border-top:1px solid var(--border);
}
.chapter-nav-prev{justify-content:flex-start}
.chapter-nav-next{justify-content:flex-end}
.chapter-nav-index{justify-content:center;grid-column:2}
a.disabled{opacity:.3;pointer-events:none}

/* ABOUT */
.about-inner{max-width:1000px;margin:0 auto;padding:64px 48px 80px}
.about-author-block{display:flex;gap:64px;align-items:flex-start;margin-bottom:48px}
.author-frame{flex-shrink:0;position:relative}
.author-frame.large{width:220px}
.author-img{width:100%;aspect-ratio:3/4;object-fit:cover;filter:grayscale(25%)}
.author-frame::after{
  content:'';position:absolute;inset:0;
  border:1px solid var(--border2);transform:translate(8px,8px);z-index:-1;
}
.about-heading{
  font-family:'Cinzel',serif;font-weight:900;
  font-size:clamp(28px,5vw,60px);color:var(--text);margin-bottom:20px;line-height:1;
}
.about-bio{font-size:18px;font-style:italic;color:var(--text2);line-height:1.9;margin-bottom:32px}
.author-quote{border-left:3px solid var(--gold);padding-left:24px;margin:24px 0}
.author-quote p{font-size:20px;font-style:italic;color:var(--text2);line-height:1.7;margin-bottom:8px}
.author-quote cite{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--text3);font-style:normal}
.about-novel-row{
  display:flex;gap:40px;align-items:flex-start;
  padding:40px 0;border-bottom:1px solid var(--border);
}
.about-novel-row:last-child{border-bottom:none}
.about-novel-thumb{width:100px;flex-shrink:0;aspect-ratio:2/3;object-fit:cover}
.about-novel-title{font-family:'Cinzel',serif;font-weight:900;font-size:24px;color:var(--text);margin-bottom:6px}
.about-novel-genre{font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;color:var(--red);margin-bottom:12px}
.about-novel-desc{font-size:16px;font-style:italic;color:var(--text2);line-height:1.8}
.cw-section{margin-top:48px}
.cw-box{
  background:var(--surface);border:1px solid var(--border);
  border-top:3px solid var(--red);padding:40px 48px;
  display:flex;flex-direction:column;align-items:flex-start;gap:16px;
}
.cw-icon{font-size:24px;color:var(--red)}
.cw-title{font-family:'Cinzel',serif;font-weight:900;font-size:20px;color:var(--text)}
.cw-text{font-style:italic;color:var(--text2);font-size:16px;line-height:1.7;max-width:560px}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

/* RESPONSIVE */
@media(max-width:900px){
  .site-nav{padding:0 24px}
  .home-hero{padding:0 24px 80px}
  .novels-inner,.novels-list-page,.page-hero-bar{padding-left:24px;padding-right:24px}
  .novel-hero-inner{padding:48px 24px;flex-direction:column;gap:32px}
  .cover-frame{width:160px}
  .novel-chapters-inner{padding:0 24px}
  .chapters-full-list{grid-template-columns:1fr}
  .about-author-block{flex-direction:column;gap:32px}
  .about-inner{padding:48px 24px 60px}
  .about-novel-row{flex-direction:column;gap:20px}
  .site-footer{padding:32px 24px}
  .reader-main{padding:calc(var(--nav-h)+40px) 24px 80px}
  .novels-grid{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
  .hero-scroll{display:none}
  .novel-list-link{flex-direction:column;min-height:auto}
  .novel-list-cover{width:100%;height:200px}
}
@media(max-width:600px){
  .home-hero-title{font-size:clamp(36px,14vw,60px)}
  .chapter-nav{grid-template-columns:1fr 1fr;grid-template-rows:auto auto}
  .chapter-nav-index{grid-column:1/-1}
}
`;
}

// ── APP.JS ────────────────────────────────────────────────
function getAppJS() {
return `/* Tarhuala — app.js */
(function(){
'use strict';
var html=document.documentElement;
var THEME_KEY='tarhuala-theme';
function setTheme(t){
  html.setAttribute('data-theme',t);
  localStorage.setItem(THEME_KEY,t);
  var icon=document.querySelector('.theme-icon');
  if(icon)icon.textContent=t==='dark'?'\u25D1':'\u25D0';
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
    bnl.textContent=novelId.replace(/-/g,' ').replace(/\\b\\w/g,function(c){return c.toUpperCase();});
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
    .replace(/<h1[^>]*>.*?<\\/h1>/gi,'')
    .replace(/<br\\s*\\/?>/gi,' ')
    .replace(/\\n{3,}/g,'\\n\\n')
    .replace(/(<p>)(\\[.*?\\])(<\\/p>)/g,'<div class="sys-box">$2</div>')
    .replace(/<p>[^<]*(?:stolen|illicitly|Amazon|unauthorized|misappropriated|report)[^<]*<\\/p>/gi,'');
}
function formatParagraphs(paragraphs){
  var sysRx=[/^\\[.*\\]$/,/^Name:/,/^Age:/,/^Race:/,/^Gender:/,/^Class:/,/^Level:/,/^Stats:/,/^Agi:/,/^Str:/,/^Int:/,/^Vit:/,/^Skills:/,/^Unallocated/,/^HUMANS OF EARTH/i,/^\\[.*Killed/,/^\\[Leveling/,/^\\[Receiving/,/^\\[Allocating/,/^\\[Received/];
  var breakRx=[/^\\*+$/,/^---+$/,/^\\*\\*\\*$/];
  var out='',buf=[];
  function flush(){if(buf.length){out+='<div class="sys-box">'+buf.join('\\n')+'</div>';buf=[];}}
  for(var i=0;i<paragraphs.length;i++){
    var parts=paragraphs[i].split(/\\n\\n+/);
    for(var j=0;j<parts.length;j++){
      var s=parts[j].trim();if(!s)continue;
      if(/stolen|Amazon|unauthorized|misappropriated/i.test(s))continue;
      if(breakRx.some(function(r){return r.test(s);})){flush();out+='<p class="scene-break">&middot; &middot; &middot;</p>';continue;}
      if(sysRx.some(function(r){return r.test(s);})){buf.push(escHtml(s));continue;}
      flush();
      out+='<p>'+escHtml(s).replace(/\\[([^\\]]+)\\]/g,'<em>[$1]</em>')+'</p>';
    }
  }
  flush();
  return out;
}
})();
`;
}

// ── HTML HELPERS ──────────────────────────────────────────

function head(title, desc, url, ogImg, novelTheme) {
  const themeAttr = novelTheme ? ` data-novel-theme="${novelTheme}"` : "";
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark"${themeAttr}>
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<meta name="robots" content="index, follow"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${desc}"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${ogImg}"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Crimson+Text:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/css/style.css"/>
</head>
<body>
<div class="noise-overlay" aria-hidden="true"></div>`;
}

function navHtml(active) {
  const links = [
    {id:"home",  href:"index.html",    label:"Home"},
    {id:"novels",href:"novels.html",   label:"Novels"},
    {id:"about", href:"about.html",    label:"About"},
  ].map(l=>`<a href="${l.href}" class="nav-link${active===l.id?" active":""}">${l.label}</a>`).join("\n      ");
  return `<nav class="site-nav" id="site-nav">
  <a href="index.html" class="nav-brand">
    <div class="nav-emblem"></div>
    <span id="site-name">TARHUALA</span>
  </a>
  <div class="nav-links">
      ${links}
  </div>
  <div class="nav-right">
    <button class="theme-btn" id="theme-toggle" aria-label="Toggle theme">
      <span class="theme-icon">&#x25D1;</span>
    </button>
  </div>
</nav>`;
}

function footerHtml() {
  return `<footer class="site-footer">
  <div class="footer-brand">
    <span id="footer-name">TARHUALA</span> &middot; Dark Fiction
  </div>
  <div class="footer-links">
    <a href="index.html" class="footer-link">Home</a>
    <a href="novels.html" class="footer-link">Novels</a>
    <a href="about.html" class="footer-link">About</a>
  </div>
  <span class="footer-cw">18+ MATURE CONTENT</span>
  <div class="footer-copy">&copy; <span id="copy-year"></span> <span id="footer-copy">Tarhuala</span></div>
</footer>
<button class="back-to-top" id="back-to-top" hidden aria-label="Back to top">&#x2191;</button>
<script src="/js/app.js"></script>`;
}

// ── PAGE: HOME ─────────────────────────────────────────────
function genIndex(site, novels) {
  const a = esc(site.author||"Tarhuala");
  const totalNovels = novels.length;
  const totalChapters = novels.reduce((s,n)=>s+(n.chapterCount||0),0);
  const seo = site.seo||{};
  const heroBannerFile = findImage(path.join(IMG_DIR,"banners"),"hero-banner");
  const heroSrc = heroBannerFile ? "/images/banners/hero-banner"+heroBannerFile.ext :
    (novels[0]&&novels[0].images&&novels[0].images.cover ? novels[0].images.cover : "");

  const novelCards = novels.map((n,i) => {
    const cover = (n.images&&n.images.cover) ? n.images.cover : `/images/covers/${n.id}.jpg`;
    const tags = (n.tags||[]).map(t=>`<span class="gtag">${esc(t)}</span>`).join("");
    return `<article class="novel-card" data-novel-id="${n.id}" data-novel-theme="${n.theme||'red'}">
      <a href="novel.html?id=${n.id}" class="novel-card-link">
        <div class="novel-card-cover">
          <img src="${cover}" alt="${esc(n.title)}" class="novel-cover-img" loading="${i===0?'eager':'lazy'}" onerror="this.style.opacity='.2'"/>
          <div class="novel-card-overlay"></div>
          <div class="novel-card-badges">
            <span class="status-pill">${esc(n.status||"Ongoing")}</span>
            <span class="novel-rating-badge">${esc(n.rating||"Mature")}</span>
          </div>
          <div class="novel-card-title-over">
            <span class="novel-card-title-text">${esc(n.title)}</span>
          </div>
        </div>
        <div class="novel-card-body">
          <div class="novel-card-genre">${esc(n.genre||"")}</div>
          <p class="novel-card-desc">${esc((n.description||"").slice(0,160))}&#8230;</p>
          <div class="novel-card-tags">${tags}</div>
          <div class="novel-card-foot">
            <span class="novel-chcount" id="chcount-${n.id}">${n.chapterCount||"&#8212;"} chapters</span>
            <span class="novel-read-cta">Read &#x2192;</span>
          </div>
        </div>
      </a>
    </article>`;
  }).join("\n");

  return `${head(esc(a)+" — Dark Fiction", esc(site.tagline||"Dark Fantasy & Apocalyptic Fiction"), site.url||"/", esc(seo.ogImage||"/images/og-cover.jpg"), "")}
${navHtml("home")}

<section class="home-hero">
  <div class="home-hero-bg">
    ${heroSrc ? `<img src="${heroSrc}" alt="" class="home-hero-bg-img" loading="eager"/>` : ""}
    <div class="home-hero-vignette"></div>
  </div>
  <div class="hero-cracks" aria-hidden="true">
    <div class="hero-crack" style="left:62%;top:0;--h:220px;animation-delay:.5s"></div>
    <div class="hero-crack" style="left:63.5%;top:0;--h:160px;animation-delay:.7s"></div>
    <div class="hero-crack" style="left:74%;top:0;--h:310px;animation-delay:1.1s;width:2px;opacity:.5"></div>
  </div>
  <div class="home-hero-content">
    <div class="home-hero-kicker">Dark Fiction &middot; Apocalyptic &middot; Mature 18+</div>
    <h1 class="home-hero-title"><span>${a}</span></h1>
    <p class="home-hero-tagline">${esc(site.tagline||"Where civilizations crumble and the darkness within is laid bare.")}</p>
    <div class="home-hero-cta">
      <a href="novels.html" class="btn btn-primary">Browse Novels &#x2192;</a>
      <a href="about.html" class="btn btn-ghost">About the Author</a>
    </div>
    <div class="home-hero-stats">
      <div class="hero-stat">
        <span class="hero-stat-num">${totalNovels}</span>
        <span class="hero-stat-label">Novel${totalNovels!==1?"s":""}</span>
      </div>
      <div class="hero-stat-sep"></div>
      <div class="hero-stat">
        <span class="hero-stat-num">${totalChapters}</span>
        <span class="hero-stat-label">Chapters</span>
      </div>
      <div class="hero-stat-sep"></div>
      <div class="hero-stat">
        <span class="hero-stat-num">18+</span>
        <span class="hero-stat-label">Mature</span>
      </div>
    </div>
  </div>
  <div class="hero-scroll" aria-hidden="true">
    <div class="hero-scroll-line"></div>
    <span class="hero-scroll-label">Scroll</span>
  </div>
</section>

<section class="novels-section">
  <div class="novels-inner">
    <div class="section-head">
      <div>
        <span class="section-label">Library</span>
        <h2 class="section-title">The Works</h2>
      </div>
      <a href="novels.html" class="btn btn-ghost">All Novels &#x2192;</a>
    </div>
    <div class="novels-grid" id="novels-grid">
      ${novelCards}
    </div>
  </div>
</section>

${footerHtml()}
</body>
</html>`;
}

// ── PAGE: NOVEL DETAIL ────────────────────────────────────
function genNovelPage(site) {
  const a = esc(site.author||"Tarhuala");
  return `${head("Novel &#x2014; "+a, "Read now.", (site.url||""), "/images/og-cover.jpg", "")}
${navHtml("novels")}
<main class="page-main" id="novel-page">
  <div class="novel-hero" id="novel-hero" style="overflow:hidden">
    <div class="novel-hero-bg" id="novel-hero-bg">
      <div class="novel-hero-bg-img-wrap">
        <img id="novel-hero-bg-img" src="" alt="" class="novel-hero-bg-img" loading="lazy"/>
      </div>
      <div class="novel-hero-bg-layer"></div>
    </div>
    <div class="novel-hero-inner">
      <div class="novel-hero-cover-wrap">
        <div class="cover-frame">
          <span class="cover-corner tl"></span><span class="cover-corner tr"></span>
          <span class="cover-corner bl"></span><span class="cover-corner br"></span>
          <img id="novel-hero-cover" src="" alt="" class="cover-img"/>
        </div>
      </div>
      <div class="novel-hero-text">
        <div class="section-label" id="novel-genre">Genre</div>
        <h1 class="novel-hero-title" id="novel-title">Loading&#x2026;</h1>
        <div class="novel-hero-meta">
          <span id="novel-status"></span>
          <span class="meta-dot">&middot;</span>
          <span><strong id="novel-chcount">&#x2014;</strong> Chapters</span>
          <span class="meta-dot">&middot;</span>
          <span id="novel-rating"></span>
        </div>
        <p class="novel-hero-desc" id="novel-desc"></p>
        <div class="novel-hero-tags" id="novel-tags"></div>
        <div class="novel-hero-cta">
          <a id="novel-read-btn" href="#" class="btn btn-primary">Start Reading &#x2192;</a>
          <a id="novel-chapters-btn" href="#novel-chapters" class="btn btn-ghost">All Chapters</a>
        </div>
      </div>
    </div>
  </div>
  <div class="novel-chapters-section" id="novel-chapters">
    <div class="novel-chapters-inner">
      <div class="chapters-toolbar">
        <div class="chapters-count"><span id="visible-count">&#x2014;</span> chapters</div>
        <div class="chapters-sort">
          <button class="sort-btn active" data-order="asc">Oldest First</button>
          <button class="sort-btn" data-order="desc">Newest First</button>
        </div>
      </div>
      <ol class="chapters-full-list" id="chapters-full-list"></ol>
    </div>
  </div>
</main>
${footerHtml()}
</body>
</html>`;
}

// ── PAGE: NOVELS LIST ─────────────────────────────────────
function genNovelsPage(site, novels) {
  const a = esc(site.author||"Tarhuala");
  const novelCards = novels.map((n,i) => {
    const cover = (n.images&&n.images.cover) ? n.images.cover : `/images/covers/${n.id}.jpg`;
    return `<article class="novel-list-item">
      <a href="novel.html?id=${n.id}" class="novel-list-link">
        <img src="${cover}" alt="${esc(n.title)}" class="novel-list-cover" loading="${i===0?'eager':'lazy'}" onerror="this.style.display='none'"/>
        <div class="novel-list-body">
          <div class="novel-list-genre">${esc(n.genre||"")}</div>
          <h2 class="novel-list-title">${esc(n.title)}</h2>
          <p class="novel-list-desc">${esc((n.description||"").slice(0,200))}&#8230;</p>
          <div class="novel-list-foot">
            <span class="novel-status-tag">${esc(n.status||"")}</span>
            <span class="novel-read-link">Read &#x2192;</span>
          </div>
        </div>
      </a>
    </article>`;
  }).join("\n");

  return `${head("Novels &#x2014; "+a, "Browse all novels by "+a+".", (site.url||"")+"/novels.html", "/images/og-cover.jpg", "")}
${navHtml("novels")}
<main class="page-main">
  <div class="page-hero-bar">
    <div class="page-hero-inner">
      <span class="section-label">Library</span>
      <h1 class="page-hero-title">All Novels</h1>
      <p class="page-hero-sub">${novels.length} Novel${novels.length!==1?"s":""} &middot; ${a}</p>
    </div>
  </div>
  <div class="novels-list-page">
    <div class="novels-list-inner">
      ${novelCards}
    </div>
  </div>
</main>
${footerHtml()}
</body>
</html>`;
}

// ── PAGE: CHAPTER READER ──────────────────────────────────
function genChapterPage(site) {
  const a = esc(site.author||"Tarhuala");
  return `${head("Chapter &#x2014; "+a, "Read online.", (site.url||""), "/images/og-cover.jpg", "")}
${navHtml("chapter")}
<div class="reader-settings-panel" id="reader-settings-panel" hidden>
  <label class="rsp-label">Font Size</label>
  <div class="rsp-size-controls">
    <button class="rsp-btn" id="font-smaller">A&#x2212;</button>
    <span class="rsp-size-val" id="font-size-val">18px</span>
    <button class="rsp-btn" id="font-larger">A+</button>
  </div>
</div>
<main class="reader-main" id="reader-main">
  <nav class="reader-breadcrumb" aria-label="Breadcrumb">
    <a href="index.html">Home</a>
    <span>/</span>
    <a href="#" id="breadcrumb-novel-link">Novel</a>
    <span>/</span>
    <span id="breadcrumb-chapter">Chapter</span>
    <button id="reader-settings-btn" class="btn btn-ghost" style="margin-left:auto;padding:6px 14px">&#x2699; Settings</button>
  </nav>
  <header class="chapter-header">
    <div class="chapter-num-label" id="chapter-num-label">Chapter &#x2014;</div>
    <h1 class="chapter-title" id="chapter-title">Loading&#x2026;</h1>
    <div class="chapter-ornament" aria-hidden="true">
      <span>&#x2014;</span><span class="ornament-glyph">&#x2E38;</span><span>&#x2014;</span>
    </div>
  </header>
  <article class="chapter-body" id="chapter-body">
    <p class="chapter-loading">Loading chapter&#x2026;</p>
  </article>
  <nav class="chapter-nav" aria-label="Chapter navigation">
    <a href="#" class="btn btn-ghost chapter-nav-prev" id="nav-prev">&#x2190; Previous</a>
    <a href="#" class="btn btn-outline chapter-nav-index" id="nav-index">Chapter List</a>
    <a href="#" class="btn btn-ghost chapter-nav-next" id="nav-next">Next &#x2192;</a>
  </nav>
</main>
${footerHtml()}
</body>
</html>`;
}

// ── PAGE: ABOUT ───────────────────────────────────────────
function genAbout(site, novels) {
  const a = esc(site.author||"Tarhuala");
  const authorImgFile = findImage(path.join(IMG_DIR,"author"),"author");
  const aImgSrc = authorImgFile ? "/images/author/author"+authorImgFile.ext : "";

  const novelRows = novels.map(n => {
    const cover = (n.images&&n.images.cover) ? n.images.cover : `/images/covers/${n.id}.jpg`;
    return `<div class="about-novel-row">
      <img src="${cover}" alt="${esc(n.title)}" class="about-novel-thumb" onerror="this.style.display='none'"/>
      <div class="about-novel-info">
        <h3 class="about-novel-title">${esc(n.title)}</h3>
        <p class="about-novel-genre">${esc(n.genre||"")}</p>
        <p class="about-novel-desc">${esc(n.description||"")}</p>
        <a href="novel.html?id=${n.id}" class="btn btn-ghost" style="margin-top:.8rem">Read Now &#x2192;</a>
      </div>
    </div>`;
  }).join("\n");

  return `${head("About &#x2014; "+a, "About "+a+" and the stories.", (site.url||"")+"/about.html", "/images/og-cover.jpg", "")}
${navHtml("about")}
<main class="page-main">
  <div class="page-hero-bar">
    <div class="page-hero-inner">
      <span class="section-label">About</span>
      <h1 class="page-hero-title">The Author</h1>
    </div>
  </div>
  <div class="about-inner">
    <section class="about-author-block">
      ${aImgSrc ? `<div class="author-frame large"><img src="${aImgSrc}" alt="${a}" class="author-img"/></div>` : ""}
      <div class="about-author-text">
        <div class="section-label">Author</div>
        <h2 class="about-heading">${a}</h2>
        <p class="about-bio">${esc(site.bio||"")}</p>
        <blockquote class="author-quote">
          <p>Every chapter is a survival story &#x2014; not just for the characters, but for the writer who refuses to look away.</p>
          <cite>&#x2014; ${a}</cite>
        </blockquote>
      </div>
    </section>
    <div class="section-divider">
      <span class="div-line"></span>
      <span class="div-glyph">&#x2E38;</span>
      <span class="div-line"></span>
    </div>
    <section class="about-novels-section">
      <div class="section-label">Works</div>
      <h2 class="section-title" style="margin-bottom:2rem">The Novels</h2>
      ${novelRows}
    </section>
    <div class="section-divider">
      <span class="div-line"></span>
      <span class="div-glyph">&#x2E38;</span>
      <span class="div-line"></span>
    </div>
    <section class="cw-section">
      <div class="cw-box">
        <span class="cw-icon">&#x26A0;</span>
        <h3 class="cw-title">Content Warning</h3>
        <p class="cw-text">All works contain mature themes including graphic violence, psychological horror, moral ambiguity, cult dynamics, and apocalyptic scenarios. Intended for readers 18+.</p>
        <a href="novels.html" class="btn btn-primary">Browse Novels &#x2192;</a>
      </div>
    </section>
  </div>
</main>
${footerHtml()}
</body>
</html>`;
}

// ── MAIN ──────────────────────────────────────────────────
async function build() {
  console.log("\n  Building...\n");

  const sitePath = path.join(ROOT,"site.json");
  let site = {author:"Tarhuala",tagline:"",bio:"",url:"",seo:{}};
  if (fs.existsSync(sitePath)) {
    try { site=JSON.parse(fs.readFileSync(sitePath,"utf-8")); console.log("  ✓ site.json"); }
    catch(e) { console.log("  ✗ site.json:",e.message); }
  }

  fs.mkdirSync(path.join(PUBLIC,"css"),{recursive:true});
  fs.mkdirSync(path.join(PUBLIC,"js"),{recursive:true});
  fs.mkdirSync(IMG_DIR,{recursive:true});

  // Write CSS and JS
  fs.writeFileSync(path.join(PUBLIC,"css","style.css"), getCSS());
  fs.writeFileSync(path.join(PUBLIC,"js","app.js"), getAppJS());
  console.log("  ✓ CSS + JS written");

  // Author image
  const authorImgDir = path.join(IMG_DIR,"author");
  fs.mkdirSync(authorImgDir,{recursive:true});
  const authorFound = findImage(ROOT,"author");
  if (authorFound) {
    fs.copyFileSync(authorFound.path, path.join(authorImgDir,"author"+authorFound.ext));
    console.log("  ✓ author image");
  }

  // Cache existing data BEFORE wiping
  let cachedNovels = [];
  const existingNovelsJson = path.join(DATA_DIR,"novels.json");
  if (fs.existsSync(existingNovelsJson)) {
    try { cachedNovels = JSON.parse(fs.readFileSync(existingNovelsJson,"utf-8"))||[]; } catch(e) {}
  }
  const cachedInfo = {};
  const cachedChapters = {};
  for (const cn of cachedNovels) {
    const ip = path.join(DATA_DIR,cn.id,"info.json");
    if (fs.existsSync(ip)) { try { cachedInfo[cn.id]=JSON.parse(fs.readFileSync(ip,"utf-8")); } catch(e) {} }
    cachedChapters[cn.id] = {};
    const nd = path.join(DATA_DIR,cn.id);
    if (fs.existsSync(nd)) {
      const files = fs.readdirSync(nd).filter(f=>f.startsWith('chapter-')&&f.endsWith('.json'));
      for (const f of files) {
        try { cachedChapters[cn.id][f] = fs.readFileSync(path.join(nd,f)); } catch(e) {}
      }
    }
  }

  let novels = [];

  // Detect if we have any source docx files to process.
  // On Vercel, novels/ is excluded via .vercelignore so no docx exist —
  // in that case, keep the pre-built public/data/ intact and just regenerate HTML.
  const hasDocx = fs.existsSync(NOVELS_DIR) &&
    fs.readdirSync(NOVELS_DIR).some(f => {
      const fp = path.join(NOVELS_DIR, f);
      return fs.statSync(fp).isDirectory() &&
        fs.readdirSync(fp).some(cf => cf.toLowerCase().endsWith('.docx'));
    });

  if (!hasDocx && fs.existsSync(DATA_DIR)) {
    // No source docx available — restore novels from existing pre-built data in public/data/
    console.log("  ✓ No source docx found — using pre-built data (Vercel mode)");
    const existingNovelsJsonPath = path.join(DATA_DIR, "novels.json");
    if (fs.existsSync(existingNovelsJsonPath)) {
      try { cachedNovels = JSON.parse(fs.readFileSync(existingNovelsJsonPath, "utf-8")) || []; } catch(e) {}
      for (const cn of cachedNovels) {
        const ci = cachedInfo[cn.id] || (() => {
          const ip = path.join(DATA_DIR, cn.id, "info.json");
          try { return fs.existsSync(ip) ? JSON.parse(fs.readFileSync(ip, "utf-8")) : null; } catch(e) { return null; }
        })();
        const staticNovel = STATIC_NOVELS.find(s => s.id === cn.id) || {};
        novels.push(Object.assign({}, staticNovel, cn, {
          theme: staticNovel.theme || cn.theme || "red",
          chapterCount: ci ? (ci.chapters || []).length : cn.chapterCount || 0,
        }));
      }
    }
    if (novels.length === 0) novels = STATIC_NOVELS.map(n => Object.assign({}, n));
    // Write site.json but leave chapter data untouched
    fs.writeFileSync(path.join(DATA_DIR, "site.json"), JSON.stringify({
      author: site.author || "Tarhuala",
      tagline: site.tagline || "",
      bio: site.bio || "",
    }));
    // Resolve cover images and write novels.json, then generate HTML pages
    for (const n of novels) {
      const coversDir = path.join(IMG_DIR, "covers");
      const novelImgDir = path.join(IMG_DIR, n.id);
      const coverFound = findImage(novelImgDir, "cover") || findImage(coversDir, n.id);
      if (coverFound) {
        n.images = n.images || {};
        n.images.cover = "/images/" + path.relative(IMG_DIR, coverFound.path).replace(/\\/g, "/");
      }
    }
    fs.writeFileSync(path.join(DATA_DIR, "novels.json"), JSON.stringify(novels, null, 2));
    fs.writeFileSync(path.join(PUBLIC, "index.html"),   genIndex(site, novels));
    fs.writeFileSync(path.join(PUBLIC, "novels.html"),  genNovelsPage(site, novels));
    fs.writeFileSync(path.join(PUBLIC, "novel.html"),   genNovelPage(site));
    fs.writeFileSync(path.join(PUBLIC, "chapter.html"), genChapterPage(site));
    fs.writeFileSync(path.join(PUBLIC, "about.html"),   genAbout(site, novels));
    console.log("  ✓ HTML pages generated");
    console.log("\n  ✓ Done:", novels.length, "novel(s) (pre-built data)\n");
    return;
  }

  // Wipe and rebuild data dir (local mode — docx files present)
  if (fs.existsSync(DATA_DIR)) fs.rmSync(DATA_DIR,{recursive:true});
  fs.mkdirSync(DATA_DIR,{recursive:true});

  fs.writeFileSync(path.join(DATA_DIR,"site.json"), JSON.stringify({
    author: site.author||"Tarhuala",
    tagline: site.tagline||"",
    bio: site.bio||"",
  }));

  if (fs.existsSync(NOVELS_DIR)) {
    const folders = fs.readdirSync(NOVELS_DIR).filter(f=>fs.statSync(path.join(NOVELS_DIR,f)).isDirectory());
    for (const folder of folders) {
      const novelPath    = path.join(NOVELS_DIR,folder);
      const slug         = slugify(folder);
      const novelDataDir = path.join(DATA_DIR,slug);
      const novelImgDir  = path.join(IMG_DIR,slug);
      fs.mkdirSync(novelDataDir,{recursive:true});
      fs.mkdirSync(novelImgDir,{recursive:true});
      console.log("  Novel:",folder);
      let meta = {};
      // Accept both meta.json and info.json as source metadata (info.json takes priority)
      const mp = path.join(novelPath,"meta.json");
      const ip2 = path.join(novelPath,"info.json");
      if (fs.existsSync(mp))  { try { meta=JSON.parse(fs.readFileSync(mp,"utf-8"));  } catch(e) {} }
      if (fs.existsSync(ip2)) { try { meta=Object.assign(meta,JSON.parse(fs.readFileSync(ip2,"utf-8"))); } catch(e) {} }
      const images = {};
      for (const nm of ["cover","front","back"]) {
        const r=copyImage(novelPath,nm,novelImgDir,nm);
        if (r) images[nm]=r;
      }
      // Also check covers dir
      if (!images.cover) {
        const coversDir = path.join(IMG_DIR,"covers");
        const cf = findImage(coversDir, slug);
        if (cf) images.cover = "/images/covers/"+slug+cf.ext;
      }
      const files = fs.readdirSync(novelPath).filter(f=>f.toLowerCase().endsWith(".docx"));
      const chapters = files.map(parseChapter).filter(Boolean).sort((a,b)=>a.number-b.number);
      const chList = [];
      const cached = cachedChapters[slug]||{};

      for (const ch of chapters) {
        const chFile = `chapter-${ch.number}.json`;
        let content = null;
        if (cached[chFile]) {
          try {
            const parsed = JSON.parse(cached[chFile]);
            if (parsed.html !== undefined) content = parsed;
          } catch(e) {}
        }
        if (!content && mammoth) {
          let html = "";
          try { html=(await mammoth.convertToHtml({path:path.join(novelPath,ch.filename)})).value; }
          catch(e) { console.log("    ✗ ch",ch.number,e.message); }
          content = {number:ch.number,title:ch.title,html};
        } else if (!content) {
          content = {number:ch.number,title:ch.title,html:""};
        }
        fs.writeFileSync(path.join(novelDataDir,chFile), JSON.stringify(content));
        chList.push({number:ch.number,title:ch.title});
      }
      const info={
        id:slug, title:folder,
        genre:meta.genre||"Fiction",
        tags:meta.tags||[],
        status:meta.status||"Ongoing",
        rating:meta.rating||"Mature",
        description:meta.description||"",
        theme:meta.theme||"red",
        images, chapters:chList
      };
      fs.writeFileSync(path.join(novelDataDir,"info.json"),JSON.stringify(info,null,2));
      novels.push({id:slug,title:folder,genre:info.genre,tags:info.tags,status:info.status,rating:info.rating,description:info.description,theme:info.theme,chapterCount:chList.length,images});
    }
  } else {
    if (cachedNovels.length>0) {
      for (const cn of cachedNovels) {
        const ci = cachedInfo[cn.id];
        const nd = path.join(DATA_DIR,cn.id);
        fs.mkdirSync(nd,{recursive:true});
        if (ci) fs.writeFileSync(path.join(nd,"info.json"),JSON.stringify(ci,null,2));
        if (cachedChapters[cn.id]) {
          for (const [fname, buf] of Object.entries(cachedChapters[cn.id])) {
            fs.writeFileSync(path.join(nd,fname), buf);
          }
        }
        const staticNovel = STATIC_NOVELS.find(s=>s.id===cn.id)||{};
        novels.push(Object.assign({},staticNovel,cn,{theme:staticNovel.theme||cn.theme||"red",chapterCount:ci?(ci.chapters||[]).length:cn.chapterCount||0}));
      }
      console.log("  ✓ Restored",novels.length,"novel(s) from cache");
    } else {
      for (const sn of STATIC_NOVELS) {
        const nd = path.join(DATA_DIR,sn.id);
        fs.mkdirSync(nd,{recursive:true});
      }
      novels = STATIC_NOVELS.map(n=>Object.assign({},n));
      console.log("  ✓ Using static fallback for",novels.length,"novel(s)");
    }
  }

  // Resolve images
  for (const n of novels) {
    const coversDir = path.join(IMG_DIR,"covers");
    const novelImgDir = path.join(IMG_DIR,n.id);
    const coverFound = findImage(novelImgDir,"cover") || findImage(coversDir, n.id);
    if (coverFound) {
      n.images = n.images||{};
      n.images.cover = "/images/"+path.relative(IMG_DIR,coverFound.path).replace(/\\/g,"/");
    }
  }

  fs.writeFileSync(path.join(DATA_DIR,"novels.json"), JSON.stringify(novels,null,2));

  fs.writeFileSync(path.join(PUBLIC,"index.html"),   genIndex(site,novels));
  fs.writeFileSync(path.join(PUBLIC,"novels.html"),  genNovelsPage(site,novels));
  fs.writeFileSync(path.join(PUBLIC,"novel.html"),   genNovelPage(site));
  fs.writeFileSync(path.join(PUBLIC,"chapter.html"), genChapterPage(site));
  fs.writeFileSync(path.join(PUBLIC,"about.html"),   genAbout(site,novels));
  console.log("  ✓ HTML pages generated");
  console.log("\n  ✓ Done:",novels.length,"novel(s)\n");
}

build().catch(err=>{ console.error("Build failed:",err); process.exit(1); });