import template from './index.html';
import {} from './css/style.css';
import {} from './load_main_map.js';

// import the HTML template and add itn to the DOM
// html-loader parses .html files and returns an HTML string
(function() {
  document.body.innerHTML = template;
});
