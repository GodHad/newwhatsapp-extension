function appendJs(path){
    var scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL(path);
    document.body.appendChild(scriptElement);
};

function appendCss(id, path){
    var cssId = id;
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL(path);
        link.media = 'all';
        head.appendChild(link);
    }
}

appendCss('mermaid', 'assets/css/mermaid.min.css');
appendCss('bootstrap', 'assets/css/bootstrap.min.css');
appendCss('dragulacss', 'assets/css/dragula.css');
appendCss('animate', 'assets/css/animate.min.css');
appendJs("eventListener.js");
appendJs("assets/js/gridjs.production.min.js");
appendJs("assets/js/jquery.min.js");
appendJs("assets/js/chartjs.min.js");
appendJs("assets/js/bootstrap.bundle.min.js");
appendJs("assets/js/sweetAlert.js");
appendJs("assets/js/dragula.js");
appendJs("assets/js/dom-autoscroller.js");