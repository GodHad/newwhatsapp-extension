function coreapi(apiurl, wsurl) {
    this.api = apiurl;
    let ws_api = wsurl;
    var sock = null;
    var ws;
    var ws_alive_to;
    var ws_to = null;
    var ws_guest = false;
    let channel = null;
    let username = null;
    this.websocket = {
        wsAlive: function () {
            if (sock && (sock.readyState == 0 || sock.readyState == 1)) {
                sock.send(JSON.stringify({ ping: "Pong" }));
            } else {
                clearInterval(ws_alive_to);
                wsForceReconect();
            }
        },
        wsForceReconect: function () {
            console.log('Reconecting webscoket!');
            ws = false;
            ws_to = setTimeout(function () {
                window.coreapi.websocket.openSocket({ channel: channel, username: username });
            }, 3000);
        },
        openSocket: function (data) {
            try {
                channel = data.channel;
                username = data.username;

                if (data.username.includes("Guest")) {
                    ws_guest = true;
                }

                if (ws_to) {
                    clearTimeout(ws_to);
                }

                if (ws) {
                    sock.close();
                }

                sock = new WebSocket(ws_api + "/" + channel + "/" + username + "/");

                sock.onopen = function () {
                    ws = true;
                    ws_alive_to = setInterval(function () {
                        try {
                            window.coreapi.websocket.wsAlive();
                        } catch (error) {
                            // alert("Error on setInterval => ws_alive_to")
                        }

                    }, 10000);
                    window.coreapi.websocket.wsAlive();
                };

                sock.onmessage = function (evt) {
                    try {
                        var data = JSON.parse(evt.data);
                        window.coreapi.toCoreMsg('_wacore_socket_', data);
                    } catch (e) {
                        console.log(e)
                    }
                }

                sock.onclose = function (e) {
                    console.log('socket close, guest: ' + ws_guest)
                    ws = undefined;

                    if (!ws_guest) {
                        if (!e.wasClean) {
                            ws = false;
                            ws_to = setTimeout(function () {
                                window.coreapi.websocket.openSocket({ channel: channel, username: username });
                            }, 3000);
                        }
                    }
                }

                sock.onerror = function (e) {
                    console.log('socket error')
                    // window.location.reload();
                }

            } catch (error) {
                console.log(error)
            }
        },
    };
    window.addEventListener('message', this.onCoreMsg);
}
coreapi.prototype.toCoreMsg = function (type, msg) {
    try {
        window.postMessage({ type: type, msg: msg }, '*');
    } catch (e) {
        console.log(e)
    }
}
coreapi.prototype.onCoreMsg = function (e) {
    try {
        window.coreapi.execute(e.data);
    } catch (e) {
        console.log(e)
    }
}
coreapi.prototype.fetch = async function (title, url, post, response, cookie, noauth) {
    try {

        var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
        }

        if (noauth) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        fetch(`${this.api}/${url}`, {
            method: 'POST', 
            headers: header, 
            body: JSON.stringify(post),
            mode: 'cors',
            timeout: 0,
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Falha');
            })
            .then(function (data) {
                window.postMessage({ type: '_wacore_api_', title: title, msg: data }, '*');
            })
            .catch(function (error) {
                window.postMessage({ type: '_wacore_api_erro_', title: 'post_error', msg: '' }, '*');
            });

    } catch (e) {
        console.log(e)
    }

}
coreapi.prototype.fetch_get = async function (title, url, post, response, cookie, noauth) {

    try {

        var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
        }

        if (noauth) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        fetch(`${this.api}/${url}`, {
            method: 'GET', 
            headers: header,
            mode: 'cors',
            timeout: 0,
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Falha');
            })
            .then(function (data) {
                window.postMessage({ type: '_wacore_api_', title: title, msg: data }, '*');
            })
            .catch(function (error) {
                window.postMessage({ type: '_wacore_api_erro_', title: 'post_error', msg: '' }, '*');
            });


    } catch (e) {
        console.log(e)
    }
}
coreapi.prototype.execute = async function (e) {
    try {

        if (e.type == "req_cookie") {

            if (e.data.type == "get") {
                chrome.storage.local.get(["mwcookie"], function (items) {
                    let ck = null;
                    if (items && items['mwcookie']) {
                        ck = items['mwcookie'];
                    }
                    window.postMessage({ type: '_wacore_cookie_', msg: ck }, '*');
                });

            }

            if (e.data.type == "set") {
                chrome.storage.local.set({ "mwcookie": e.data.cookie }, function () {
                });
                window.postMessage({ type: '_wacore_cookie_', msg: e.data.cookie }, '*');
            }

        }

        if (e.type == "req_api") {
            window.coreapi.fetch(e.title, e.url, e.body, e.response, e.cookie, e.noauth);
        }

        if (e.type == "req_api_get") {
            window.coreapi.fetch_get(e.title, e.url, e.body, e.response, e.cookie, e.noauth);
        }

        if (e.type == "req_websocket") {
            this.websocket.openSocket(e.msg);
        }

        if (e.type == "req_media") {
            let chat = e.msg.chat;
            fetch(e.msg.url)
                .then(response => response.blob())
                .then(blob => {
                    var reader = new FileReader();
                    reader.onload = function () {
                        window.postMessage({ type: '_wacore_media_', chat: chat, base64: this.result }, '*');
                    };
                    reader.readAsDataURL(blob);
                });
        }
    } catch (e) {
        console.log(e)
    }
};

function appendJs(path) {
    var scriptElement = document.createElement('script');
    scriptElement.src = chrome.runtime.getURL(path);
    document.body.appendChild(scriptElement);
};

function appendCss(id, path) {
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

// editar
function initialize() {
    fetch(getProdUrl())
        .then(response => response.json())
        .then(response => {
            // update custom infos
            window.postMessage({
                type: '_wacore_wa_info_', info: {
                    number: response.contact_number,
                    panelUrl: response.panel_url,
                    helpUrl: response.help_url,
                    changelogUrl: response.changelog_url,
                    apiUrl: response.api_url,
                    urlLogo: response.url_image,
                    version: chrome.runtime.getManifest().version,
                    name: chrome.runtime.getManifest().description
                }
            }, '*');

            appendCss('styles', 'assets/css/core.css');
            appendJs("assets/js/core.js");

            // init websocket
            window.coreapi = new coreapi(response.api_url, response.ws_url);
        })
        .catch(response => {
            console.log('Failed server')
        })
    return true;
}

function getProdUrl() {
    if (chrome.runtime.getManifest()) {
        return `${chrome.runtime.getManifest().content_scripts[0].matches[0].replace('/*', '')}/lib/get`;
    }
}

function getDevUrl() {
    return 'http://localhost:8080/lib/get?dev=ok'
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'wacore_new_update') {
        window.postMessage({ type: '_wacore_new_update_' }, '*');
    }
});

initialize();