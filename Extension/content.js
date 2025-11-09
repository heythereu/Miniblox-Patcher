new Promise(resolve => {
  if (document.head) return resolve();
  new MutationObserver((_, o) => {
    if (document.head) o.disconnect(), resolve();
  }).observe(document.documentElement, { childList: true });
}).then(() => setTimeout(() => {
  const script = [...document.querySelectorAll('script[src]')]
    .find(s => /assets\/index-.*\.js$/.test(new URL(s.src).pathname));
  
  if (script) {
    fetch(script.src).then(r => r.text()).then(code => {
      code = code.replace(/(["'`])\/assets/g, '$1https://miniblox.io/assets'); // Asset fix because of blob, don't remove
	  
      code = code.replace(',2,8,3', ',2,32,3'); // Example replacement, replaces the max Render Distance from 8 to 32
	  
      code += ';setTimeout(startGame,100)'; // This is to make sure the game initializes
      document.head.appendChild(Object.assign(document.createElement('script'), { 
        type: 'module', 
        src: URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))
      }));
      
      console.log('Patched');
    });
  }
}, 250));