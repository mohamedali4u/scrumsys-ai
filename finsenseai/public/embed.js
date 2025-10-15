(function() {
  // Create and inject CSS
  var css = `
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css');
    
    .ai-widget-container * {
      box-sizing: border-box;
    }
  `;
  
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Widget loader
  function loadWidget() {
    var script = document.createElement('script');
    script.src = './dist/widget.js'; // Replace with your CDN URL
    script.onload = function() {
      var config = {};
      
      // Parse current script attributes
      var currentScript = document.currentScript || 
        document.querySelector('script[data-ai-widget]');
      
      if (currentScript) {
        if (currentScript.getAttribute('data-api-key')) {
          config.apiKey = currentScript.getAttribute('data-api-key');
        }
        if (currentScript.getAttribute('data-theme')) {
          config.theme = currentScript.getAttribute('data-theme');
        }
        if (currentScript.getAttribute('data-position')) {
          config.position = currentScript.getAttribute('data-position');
        }
        if (currentScript.getAttribute('data-welcome-message')) {
          config.welcomeMessage = currentScript.getAttribute('data-welcome-message');
        }
        if (currentScript.getAttribute('data-company-name')) {
          config.companyName = currentScript.getAttribute('data-company-name');
        }
      }

      if (window.AIAgentWidget) {
        window.AIAgentWidget.init(config);
      }
    };
    document.head.appendChild(script);
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();