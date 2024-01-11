function onRequest(e) {
    try {
        if (e.data.type == "_wacore_api_") {
            wacore.request.api_response(e.data)
        };

        if (e.data.type == "_wacore_api_erro_") {
            wacore.request.api_response(e.data)
        };

        if (e.data.type == "_wacore_cookie_") {
            wacore.request.cookie_response(e.data)
        };

        if (e.data.type == "_wacore_media_") {
            wacore.request.media_response(e.data)
        };

        if (e.data.type == "_wacore_socket_") {
            wacore.request.ws_response(e.data);
        }

        if (e.data.type == "_wacore_new_update_") {
            wacore.request.extension_updated();
        }

        if (e.data.type == "_wacore_wa_info_") {
            window.infoWl = {
                panelUrl: e.data.info.panelUrl,
                apiUrl: e.data.info.apiUrl,
                helpUrl: e.data.info.helpUrl,
                changelogUrl: e.data.info.changelogUrl,
                logoMenuUrl: e.data.info.urlLogo,
                contactNumber: e.data.info.number,
                version : e.data.info.version,
                name: e.data.info.name
            }
        }
    } catch (e) {
        console.log(e)
    }
}

window.addEventListener('message', onRequest);