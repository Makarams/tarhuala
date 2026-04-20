var Router={
  routes:[],
  add:function(p,h){
    this.routes.push({parts:p.split("/"),handler:h});
    return this;
  },
  go:function(h){window.location.hash=h},
  _match:function(hash){
    var path=(hash.replace(/^#\/?/,"")||"home");
    var seg=path.split("/");
    for(var i=0;i<this.routes.length;i++){
      var r=this.routes[i];
      if(r.parts.length!==seg.length)continue;
      var params={},ok=true;
      for(var j=0;j<r.parts.length;j++){
        if(r.parts[j][0]===":") params[r.parts[j].slice(1)]=decodeURIComponent(seg[j]);
        else if(r.parts[j]!==seg[j]){ok=false;break}
      }
      if(ok)return{handler:r.handler,params:params};
    }
    return null;
  },
  _run:function(){
    var app=document.getElementById("app");
    var m=this._match(window.location.hash);
    if(!m)return;
    app.style.opacity="0";app.style.transform="translateY(10px)";
    setTimeout(function(){
      window.scrollTo({top:0});
      m.handler(app,m.params);
      requestAnimationFrame(function(){
        app.style.transition="opacity .3s,transform .3s";
        app.style.opacity="1";app.style.transform="translateY(0)";
      });
    },180);
  },
  start:function(){
    var self=this;
    var app=document.getElementById("app");
    app.style.transition="opacity .3s,transform .3s";
    window.addEventListener("hashchange",function(){self._run()});
    this._run();
  }
};
