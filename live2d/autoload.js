/**
 * Live2D Widget Autoloader for StudyGotchi
 * Adapted from https://github.com/stevenjoezhang/live2d-widget
 */

(function() {
  const live2d_path = chrome.runtime.getURL('live2d/');
  
  function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
      let tag;
      if (type === 'css') {
        tag = document.createElement('link');
        tag.rel = 'stylesheet';
        tag.href = url;
      } else if (type === 'js') {
        tag = document.createElement('script');
        tag.src = url;
      }
      if (tag) {
        tag.onload = () => resolve(url);
        tag.onerror = () => reject(url);
        document.head.appendChild(tag);
      }
    });
  }

  function initWidget(config) {
    if (typeof window.loadlive2d === 'function') {
      window.loadlive2d('live2d-widget', config);
    } else {
      setTimeout(() => initWidget(config), 100);
    }
  }

  // Load CSS
  loadExternalResource(live2d_path + 'waifu.css', 'css').catch(console.error);

  // Load Live2D library
  loadExternalResource(live2d_path + 'live2d.min.js', 'js')
    .then(() => {
      // Load tips configuration
      fetch(live2d_path + 'waifu-tips.json')
        .then(response => response.json())
        .then(tips => {
          initWidget({
            waifuPath: live2d_path + 'waifu-tips.json',
            cdnPath: live2d_path,
            apiPath: live2d_path,
            tools: ['hitokoto', 'asteroids', 'switch-model', 'switch-texture', 'photo', 'info', 'quit'],
            modelId: 1,
            modelTexturesId: 1
          });
        })
        .catch(console.error);
    })
    .catch(console.error);
})();

