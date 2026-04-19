(function(){
  var s = localStorage.getItem('tarhuala-theme');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var t = s || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
})();
