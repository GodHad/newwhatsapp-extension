(()=>{
    var e = {
        467: ()=>{
            window.wacore.api = {},
            window.wacore.api.variables = {
                tokenApi: "",
                options: {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                },
                gridLogs: null,
                unprocessedLogs: [],
                gridDataLogs: [],
                gridLogColluns: [{
                    id: "id",
                    name: "Id",
                    hidden: !0,
                    key: "id"
                }, {
                    id: "dt",
                    name: "Dt. evento",
                    key: "eventDate",
                    formatter: e=>`${new Date(e).toLocaleDateString("pt-BR", window.wacore.api.variables.options)}`
                }, {
                    id: "method",
                    name: "Método",
                    key: "method",
                    formatter: e=>gridjs.html(`<span class="cell-method-${e.toLowerCase()}">${e}</span>`)
                }, {
                    id: "path",
                    name: "Recurso"
                }, {
                    id: "number",
                    name: "Número",
                    key: "number",
                    formatter: e=>`${window.wacore.function.setMask("+" + e)}`
                }, {
                    id: "processed",
                    name: "Processado?",
                    key: "processed",
                    attributes: e=>{
                        if (e)
                            return {
                                "data-cell-content": e,
                                style: "color: " + ("SIM" == e ? "green" : "red")
                            }
                    }
                }, {
                    id: "success",
                    name: "Sucesso?",
                    key: "success",
                    attributes: e=>{
                        if (e)
                            return {
                                "data-cell-content": e,
                                style: "color: " + ("SIM" == e ? "green" : "red")
                            }
                    }
                }, {
                    id: "result",
                    name: "Resultado obs.",
                    key: "resultObservation",
                    hidden: !0
                }, {
                    id: "message",
                    name: "message",
                    key: "message",
                    hidden: !0
                }, {
                    id: "media",
                    name: "media",
                    key: "average",
                    hidden: !0
                }, {
                    name: "Ações",
                    key: "actions",
                    formatter: (e,t)=>gridjs.html(`<button class="btn btn-primary text-white bg-blue-600" onClick="window.wacore.api.modals.showDetailsLog('${t.cells[0].data}')">${window.wacore.svgs.eye(24, 24, "")}</button>`)
                }]
            },
            window.wacore.api.requests = {
                postResultSentApi: function(e, t, a, n) {
                    wacore.request.api_post("result_sent_api", "channel/result-sent-api", {
                        id: e,
                        success: t,
                        resultMsg: a,
                        responsePayload: n
                    }, !0, wacore.user.variables.cookie)
                },
                getLogsApi: function() {
                    const e = document.getElementById("input_sit_log_api")?.value ?? "all"
                      , t = document.getElementById("input_type_log_api")?.value ?? "all";
                    wacore.request.api_post("get_api_logs", "channel/get-api-logs", {
                        channel: wacore.sitechannel,
                        filter_situation: e,
                        filter_type: t
                    }, !0, wacore.user.variables.cookie)
                },
                getQtdeLogsErrorApi: function() {
                    wacore.request.api_post("get_api_unprocessed_logs", "channel/get-unprocessed-logs", {
                        channel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                }
            },
            window.wacore.api.callbacks = {
                getLogsApiResult: function(e) {
                    window.wacore.api.functions.filterGridLogs(e)
                },
                getQtdeLogsErrorApiResult: function(e) {
                    window.wacore.api.variables.unprocessedLogs = e,
                    $("#unprocessed-count").text(e.length),
                    e.length > 0 ? ($("#btn-api-logs-actions").prop("disabled", !1),
                    $("#unprocessed-count").addClass("badge-alert-api-rounded"),
                    $("#unprocessed-count").show()) : ($("#btn-api-logs-actions").prop("disabled", !0),
                    $("#unprocessed-count").hide())
                }
            },
            window.wacore.api.modals = {
                showDetailsLog: function(e) {
                    var t = window.wacore.api.variables.gridDataLogs.filter((t=>t.id == e))[0];
                    if (t) {
                        var a = ""
                          , n = "NÃO" == t.processed && (t.path.includes("send-text") || t.path.includes("send-media"));
                        t.number && (a += `<li>\n                            <div class="hoverable ">\n                                <span class="property token string">"number"</span>: <span class="token string">"${t.number}"</span><span class="token punctuation">,</span>\n                            </div>\n                        </li>`),
                        t.message && (a += `<li>\n                            <div class="hoverable ">\n                                <span class="property token string">"message"</span>: <span class="token string">"${t.message}"</span><span class="token punctuation">,</span>\n                            </div>\n                        </li>`),
                        t.media && (t.media.caption && (a += `\n                    <li>\n                        <div class="hoverable ">\n                            <span class="property token string">"caption"</span>: <span class="token string">"${t.media.caption}"</span><span class="token punctuation">,</span>\n                        </div>\n                    </li>`),
                        t.media.linkUrl && (a += `\n                    <li>\n                        <div class="hoverable ">\n                            <span class="property token string">"linkUrl"</span>: <span class="token string">"${t.media.linkUrl}"</span><span class="token punctuation">,</span>\n                        </div>\n                    </li>`),
                        t.media.filename && (a += `\n                    <li>\n                        <div class="hoverable ">\n                            <span class="property token string">"filename"</span>: <span class="token string">"${t.media.filename}"</span><span class="token punctuation">,</span>\n                        </div>\n                    </li>`),
                        t.media.extension && (a += `\n                    <li>\n                        <div class="hoverable ">\n                            <span class="property token string">"extension"</span>: <span class="token string">"${t.media.extension}"</span><span class="token punctuation">,</span>\n                        </div>\n                    </li>`),
                        t.media.base64 && (a += `\n                    <li>\n                        <div class="hoverable ">\n                            <span class="property token string">"base64"</span>: <span class="token string">"${t.media.base64.substr(0, 20) + "..."}"</span><span class="token punctuation">,</span>\n                        </div>\n                    </li>`));
                        var o = `<div class="code-area"><code>\n                                <span class="token punctuation">{</span>\n                                    <ul class="obj collapsible">\n                                        ${a}\n                                    </ul>\n                                <span class="token punctuation">}</span>\n                            </code></div>`;
                        "GET" == t.method && (o = ""),
                        "WEBHOOK_NOTIFICATION" != t.type && "GET_CHATS" != t.type && "GET_MESSAGES" != t.type && "GET_CHAT" != t.type && "DECRIPT_MEDIA" != t.type || (o = `<br><textarea class="text-area" disabled="" type="text" rows="4" cols="40" style="width: 100%;">${t.payload}</textarea>`,
                        o += `<span id="btn-copy-json" class="input-group-addon btn btn-secondary" style="display:inline-flex;" onClick="window.wacore.api.functions.copyLogJson('${e}')">${window.wacore.svgs.copy(20, 20, "")} <span data-translate-key="copyJson"></span></span>`),
                        Swal.fire({
                            title: '<strong data-translate-key="callDetails"></strong>',
                            html: `<div style="text-align: left; display:flex;">\n                        <div style="width: 230px;margin-bottom: 8px;">\n                            <span data-translate-key="executionDate"></span>\n                            <input class="form-control k-input text-box" type="text" disabled="" value="${new Date(t.dt).toLocaleDateString("pt-BR", window.wacore.api.variables.options)}">\n                        </div>\n                        <div style="margin-left: 7px;">              \n                            <span data-translate-key="processed"></span>\n                            <input class="form-control k-input text-box" type="text" disabled="" value="${t.processed}">\n                        </div>\n                        <div style="margin-left: 7px;">              \n                            <span data-translate-key="success"></span>\n                            <input class="form-control k-input text-box" type="text" disabled="" value="${t.success}">\n                        </div>\n                    </div>\n                    <div style="text-align: left; display:flex;">\n                        <div style="width: 100%;margin-bottom: 10px;">\n                            <span data-translate-key="result"></span>\n                            <input class="form-control k-input text-box" type="text" disabled="" value="${t.result}">\n                        </div>\n                    </div>\n                    <div class="input-group">\n                        <span class="cell-method-${t.method.toLowerCase()}" style="padding-top: 10px;">${t.method}</span>\n                        <input class="form-control k-input text-box single-line" type="text" disabled="" value="${t.path}">\n                    </div>\n                    ${o}\n                <br>`,
                            showCloseButton: !0,
                            showCancelButton: n,
                            showConfirmButton: n,
                            confirmButtonText: '<span data-translate-key="processAgain"></span>',
                            cancelButtonText: '<span data-translate-key="toDiscard"></span>',
                            focusConfirm: !1,
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        }).then((t=>{
                            t.isConfirmed ? window.wacore.api.functions.resentLogApi(e) : t.dismiss && t.dismiss === Swal.DismissReason.cancel && window.wacore.api.functions.discartEvent(e)
                        }
                        ))
                    }
                },
                showActions: function() {
                    var e = window.wacore.api.variables.unprocessedLogs.filter((e=>"/public/send-text" == e.reqPath))
                      , t = window.wacore.api.variables.unprocessedLogs.filter((e=>"/public/send-media" == e.reqPath));
                    const a = e=>new Promise((t=>setTimeout(t, e)));
                    Swal.fire({
                        title: '<strong data-translate-key="bulkActions"></strong>',
                        html: `<span data-translate-key="textSubmissionsAwaitingProcessing"></span> <b>${e.length}</b><br>\n                 <span data-translate-key="mediaSubmissionsAwaitingProcessing"></span> <b>${t.length}</b><br>\n                 <br>\n                 <div class="alert alert-warning mb-3" role="alert">\n                    <p class="pb-0 mb-0" style="font-size: 0.8rem;" data-translate-key="bulkActionsConfirmationMessage"></p>\n                 </div>`,
                        showCloseButton: !0,
                        showCancelButton: !0,
                        showConfirmButton: !0,
                        confirmButtonText: '<span data-translate-key="processEverything"></span>',
                        cancelButtonText: '<span data-translate-key="discardEverything"></span>',
                        focusConfirm: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((e=>{
                        e.isConfirmed ? (async()=>{
                            for (const e of window.wacore.api.variables.unprocessedLogs)
                                window.wacore.api.functions.resentLogApi(e._id),
                                await a(2e3)
                        }
                        )().then((()=>{
                            window.wacore.api.requests.getLogsApi(),
                            window.wacore.api.requests.getQtdeLogsErrorApi()
                        }
                        )) : e.dismiss && e.dismiss === Swal.DismissReason.cancel && (async()=>{
                            for (const e of window.wacore.api.variables.unprocessedLogs)
                                window.wacore.api.functions.discartEvent(e._id),
                                await a(500)
                        }
                        )().then((()=>{
                            window.wacore.api.requests.getLogsApi(),
                            window.wacore.api.requests.getQtdeLogsErrorApi()
                        }
                        ))
                    }
                    ))
                },
                showApiConfig: function() {
                    Swal.fire({
                        title: '<strong data-translate-key="accessAndDocumentation"></strong>',
                        html: `<b data-translate-key="yourTokenForAcessingApiResources"></b><br><br><div class="input-group">\n                <input class="form-control k-input text-box single-line" type="text" disabled="" value="${window.wacore.api.variables.tokenApi}">\n                <span id="btn-copy-token" class="input-group-addon btn btn-secondary" onClick="window.wacore.api.functions.copyToken()">${window.wacore.svgs.copy(20, 20, "")}</span>\n                </div>\n                <br>\n                <b data-translate-key="resourcesNowAvailable"></b><br>\n                <div class="resources-api"a data-translate-key="apiResourceTextsChecks"></div>\n                <br>\n                <br>\n                <a class="btn" style="border-color: #127a12;border-width: 2px;background: #a6ffae3b;" href="${window.infoWl.apiUrl}/doc" target="_blank" data-translate-key="seeDocumentation"></a>\n                <br>`,
                        showCloseButton: !0,
                        showCancelButton: !1,
                        showConfirmButton: !1,
                        focusConfirm: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    })
                }
            },
            window.wacore.api.functions = {
                resentLogApi: async function(e) {
                    var t = window.wacore.api.variables.gridDataLogs.filter((t=>t.id == e))[0];
                    if (t) {
                        if (t.path.includes("send-text"))
                            (a = await window.wacore.api.functions.sendText(t.number, t.message)) ? window.wacore.api.requests.postResultSentApi(e, !1, a, "") : window.wacore.api.requests.postResultSentApi(e, !0, "Mensagem enviada com sucesso!", "");
                        else if (t.path.includes("send-media")) {
                            var a;
                            (a = await window.wacore.api.functions.sendMedia(t.number, t.media.base64, t.media.caption, t.media.filename)) ? window.wacore.api.requests.postResultSentApi(e, !1, a, "") : window.wacore.api.requests.postResultSentApi(e, !0, "Mensagem enviada com sucesso!", "")
                        }
                        setTimeout((()=>{
                            window.wacore.api.requests.getLogsApi(),
                            window.wacore.api.requests.getQtdeLogsErrorApi()
                        }
                        ), 1e3)
                    }
                },
                discartEvent: async function(e) {
                    window.wacore.api.requests.postResultSentApi(e, !1, "Evento descartado manualmente", ""),
                    setTimeout((()=>{
                        window.wacore.api.requests.getLogsApi(),
                        window.wacore.api.requests.getQtdeLogsErrorApi()
                    }
                    ), 1e3)
                },
                initGridLogs: async function() {
                    try {
                        const e = $("#grid-logs-api");
                        $("#btn-token-api").val(window.wacore.api.variables.tokenApi),
                        window.wacore.format_translation.updateTextColumnNames(window.wacore.api.variables.gridLogColluns),
                        window.wacore.api.variables.gridLogs && window.wacore.api.variables.gridLogs.destroy(),
                        window.wacore.api.variables.gridDataLogs = [],
                        window.wacore.api.variables.gridLogs = new gridjs.Grid({
                            columns: window.wacore.api.variables.gridLogColluns,
                            style: {
                                table: {
                                    "white-space": "nowrap"
                                }
                            },
                            data: []
                        }).render(e.get(0)),
                        window.wacore.api.requests.getLogsApi()
                    } catch (e) {
                        console.log(e)
                    }
                },
                filterGridLogs: async function(e) {
                    try {
                        if (!window.wacore.api.variables.gridLogs)
                            return;
                        window.wacore.api.variables.gridDataLogs = [];
                        for (const t of e)
                            window.wacore.api.variables.gridDataLogs.push({
                                id: t._id,
                                dt: t.createdAt,
                                method: t.reqMethod,
                                path: t.reqPath,
                                number: t.number,
                                processed: t.processed ? "SIM" : "NÃO",
                                success: t.success ? "SIM" : "NÃO",
                                result: t.resultMsg,
                                message: t.message,
                                media: t.media,
                                type: t.type,
                                payload: t.payload
                            });
                        window.wacore.api.variables.gridLogs.updateConfig({
                            pagination: !0,
                            resizable: !0,
                            pagination: {
                                limit: 7
                            },
                            data: window.wacore.api.variables.gridDataLogs
                        }).forceRender()
                    } catch (e) {
                        console.log(e)
                    }
                },
                checkNumber: async function(e) {
                    try {
                        var t = e.length >= 14 ? e.replace("+", "") : e.replace(/[^0-9]/g, "");
                        return await window.wacore.whatsapp.getNumberId(t) ? "VALID" : "INVALID"
                    } catch (e) {
                        return console.log(e),
                        "Erro no processamento da mensagem"
                    }
                },
                copyToken: function() {
                    navigator.clipboard.writeText(window.wacore.api.variables.tokenApi),
                    document.getElementById("btn-copy-token") && (document.getElementById("btn-copy-token").innerHTML = window.wacore.svgs.copy_success(20, 20, ""),
                    setTimeout((()=>{
                        document.getElementById("btn-copy-token").innerHTML = window.wacore.svgs.copy(20, 20, "")
                    }
                    ), 500))
                },
                copyLogJson: function(e) {
                    var t = window.wacore.api.variables.gridDataLogs.filter((t=>t.id == e))[0];
                    t && t.payload && (navigator.clipboard.writeText(t.payload),
                    document.getElementById("btn-copy-json") && (document.getElementById("btn-copy-json").innerHTML = `${window.wacore.svgs.copy_success(20, 20, "margin-top: 3px;margin-right: 5px;")} copiado`,
                    setTimeout((()=>{
                        document.getElementById("btn-copy-json").innerHTML = `${window.wacore.svgs.copy(20, 20, "margin-top: 3px;margin-right: 5px;")} copiar json`
                    }
                    ), 500)))
                },
                sendMedia: async function(e, t, a, n) {
                    try {
                        var o = e.length >= 14 ? e.replace("+", "") : e.replace(/[^0-9]/g, "");
                        let r = await window.wacore.whatsapp.getNumberId(o);
                        if (r) {
                            var s = wacore.whatsapp.getNotifyName(r._serialized);
                            return window.wacore.whatsapp.upsertChat(r._serialized, (async function(e) {
                                var o = n || (t.includes("audio/ogg") ? "audio" : "file")
                                  , r = window.wacore.whatsapp.base64ImageToFile(t, o)
                                  , i = (await window.wacore.whatsapp.procFiles(e, [{
                                    file: r
                                }]))._models[0];
                                a && s && a.includes("@nome") && (a = a.replace(/@nome/gi, s)),
                                t.includes("audio/ogg") && (i.mediaPrep._mediaData.type = "ptt"),
                                await i.sendToChat(e, {
                                    caption: a
                                })
                            }
                            )),
                            ""
                        }
                        return "Número do contato inválido"
                    } catch (e) {
                        return console.log(e),
                        "Erro no processamento da mensagem"
                    }
                },
                sendText: async function(e, t) {
                    try {
                        var a = e.length >= 14 ? e.replace("+", "") : e.replace(/[^0-9]/g, "");
                        let o = await window.wacore.whatsapp.getNumberId(a);
                        if (o) {
                            var n = wacore.whatsapp.getNotifyName(o._serialized);
                            return t && n && t.includes("@nome") && (t = t.replace(/@nome/gi, n)),
                            o._serialized.includes("@g.us") ? (await window.wacore.whatsapp.getChat(o._serialized)).sendMessage(t) : window.wacore.whatsapp.upsertChat(o._serialized, (function(e) {
                                e.sendMessage(t)
                            }
                            )),
                            ""
                        }
                        return "Número do contato inválido"
                    } catch (e) {
                        return console.log(e),
                        "Erro no processamento da mensagem"
                    }
                },
                getChatList: function(e, t, a) {
                    try {
                        var n = Store.Chat._models.map((e=>window.wacore.whatsapp.serializeChatObj(e, t)));
                        return t || (n = n.filter((e=>!e.isGroup))),
                        a || (n = n.filter((e=>!e.isArchived))),
                        n = n.sort((function(e, t) {
                            return t.lastUpdate - e.lastUpdate
                        }
                        )),
                        {
                            curPage: e,
                            totalPages: Math.ceil(n.length / 200),
                            chats: n.slice(200 * (e - 1), 200 * e)
                        }
                    } catch (e) {
                        return console.log(e),
                        null
                    }
                },
                getMessagesFromChat: async function(e, t) {
                    try {
                        var a = window.wacore.whatsapp.getChatById(t);
                        if (a) {
                            await window.wacore.whatsapp.syncEarlyMessagesFromChat(t);
                            var n = a.msgs._models.filter((e=>"remove" !== e)).map((e=>window.wacore.whatsapp.serializeMessageObj(e)));
                            return n = n.sort((function(e, t) {
                                return t.timestamp - e.timestamp
                            }
                            )),
                            {
                                curPage: e,
                                totalPages: Math.ceil(n.length / 500),
                                messages: n.slice(500 * (e - 1), 500 * e)
                            }
                        }
                        return []
                    } catch (e) {
                        return console.log(e),
                        null
                    }
                },
                getChatById: function(e) {
                    try {
                        var t = window.wacore.whatsapp.getChatById(e);
                        return t ? window.wacore.whatsapp.serializeChatObj(t, !0) : {}
                    } catch (e) {
                        return console.log(e),
                        null
                    }
                }
            },
            setTimeout((()=>{
                window.wacore.api.requests.getQtdeLogsErrorApi()
            }
            ), 1e4),
            setInterval((()=>{
                window.wacore.api.requests.getQtdeLogsErrorApi()
            }
            ), 3e4)
        }
        ,
        22: ()=>{
            var e;
            EvoCalendar = (e = 0,
            function(t, a) {
                var n = this;
                if (n.defaults = {
                    theme: null,
                    format: "mm/dd/yyyy",
                    titleFormat: "MM yyyy",
                    eventHeaderFormat: "MM d, yyyy",
                    firstDayOfWeek: 0,
                    language: "en",
                    todayHighlight: !1,
                    sidebarDisplayDefault: !0,
                    sidebarToggler: !0,
                    eventDisplayDefault: !0,
                    eventListToggler: !0,
                    calendarEvents: null
                },
                n.options = $.extend({}, n.defaults, a),
                n.initials = {
                    default_class: $(t)[0].classList.value,
                    validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
                    dates: {
                        en: {
                            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                            noEventForToday: "No event for today.. so take a rest! :)",
                            noEventForThisDay: "No event for this day.. so take a rest! :)",
                            previousYearText: "Previous year",
                            nextYearText: "Next year",
                            closeSidebarText: "Close sidebar",
                            closeEventListText: "Close event list"
                        },
                        es: {
                            days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                            daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                            daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
                            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                            monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                            noEventForToday: "No hay evento para hoy.. ¡así que descanse! :)",
                            noEventForThisDay: "Ningún evento para este día.. ¡así que descanse! :)",
                            previousYearText: "Año anterior",
                            nextYearText: "El próximo año",
                            closeSidebarText: "Cerrar la barra lateral",
                            closeEventListText: "Cerrar la lista de eventos"
                        },
                        de: {
                            days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                            daysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                            daysMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                            months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                            monthsShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
                            noEventForToday: "Keine Veranstaltung für heute.. also ruhen Sie sich aus! :)",
                            noEventForThisDay: "Keine Veranstaltung für diesen Tag.. also ruhen Sie sich aus! :)",
                            previousYearText: "Vorheriges Jahr",
                            nextYearText: "Nächstes Jahr",
                            closeSidebarText: "Schließen Sie die Seitenleiste",
                            closeEventListText: "Schließen Sie die Ereignisliste"
                        },
                        pt: {
                            days: ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"],
                            daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
                            daysMin: ["Do", "2a", "3a", "4a", "5a", "6a", "Sa"],
                            months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                            monthsShort: ["Jan", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                            noEventForToday: "Nenhum lembrete para hoje!",
                            noEventForThisDay: "Nenhum lembrete para este dia!",
                            previousYearText: "Ano anterior",
                            nextYearText: "Próximo ano",
                            closeSidebarText: "Feche a barra lateral",
                            closeEventListText: "Feche a lista de eventos"
                        },
                        fr: {
                            days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
                            daysShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
                            daysMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
                            months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                            monthsShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
                            noEventForToday: "Rien pour aujourd'hui... Belle journée :)",
                            noEventForThisDay: "Rien pour ce jour-ci... Profite de te réposer :)",
                            previousYearText: "Année précédente",
                            nextYearText: "L'année prochaine",
                            closeSidebarText: "Fermez la barre latérale",
                            closeEventListText: "Fermer la liste des événements"
                        },
                        nl: {
                            days: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
                            daysShort: ["Zon", "Maan", "Din", "Woe", "Don", "Vrij", "Zat"],
                            daysMin: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
                            months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
                            monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
                            noEventForToday: "Geen event voor vandaag.. dus rust even uit! :)",
                            noEventForThisDay: "Geen event voor deze dag.. dus rust even uit! :)",
                            previousYearText: "Vorig jaar",
                            nextYearText: "Volgend jaar",
                            closeSidebarText: "Sluit de zijbalk",
                            closeEventListText: "Sluit de event lijst"
                        }
                    }
                },
                n.initials.weekends = {
                    sun: n.initials.dates[window.wacore.translation.language].daysShort[0],
                    sat: n.initials.dates[window.wacore.translation.language].daysShort[6]
                },
                null != n.options.calendarEvents)
                    for (var o = 0; o < n.options.calendarEvents.length; o++)
                        n.options.calendarEvents[o].id,
                        n.isValidDate(n.options.calendarEvents[o].date) && (n.options.calendarEvents[o].date = n.formatDate(n.options.calendarEvents[o].date, n.options.format));
                n.startingDay = null,
                n.monthLength = null,
                n.windowW = $(window).width(),
                n.$current = {
                    month: isNaN(this.month) || null == this.month ? (new Date).getMonth() : this.month,
                    year: isNaN(this.year) || null == this.year ? (new Date).getFullYear() : this.year,
                    date: n.formatDate(n.initials.dates[n.defaults.language].months[(new Date).getMonth()] + " " + (new Date).getDate() + " " + (new Date).getFullYear(), n.options.format)
                },
                n.$active = {
                    month: n.$current.month,
                    year: n.$current.year,
                    date: n.$current.date,
                    event_date: n.$current.date,
                    events: []
                },
                n.$label = {
                    days: [],
                    months: n.initials.dates[n.defaults.language].months,
                    days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                },
                n.$markups = {
                    calendarHTML: "",
                    mainHTML: "",
                    sidebarHTML: "",
                    eventHTML: ""
                },
                n.$elements = {
                    calendarEl: $(t),
                    innerEl: null,
                    sidebarEl: null,
                    eventEl: null,
                    sidebarToggler: null,
                    eventListToggler: null,
                    activeDayEl: null,
                    activeMonthEl: null,
                    activeYearEl: null
                },
                n.$breakpoints = {
                    tablet: 768,
                    mobile: 425
                },
                n.$UI = {
                    hasSidebar: !0,
                    hasEvent: !0
                },
                n.formatDate = $.proxy(n.formatDate, n),
                n.selectDate = $.proxy(n.selectDate, n),
                n.selectMonth = $.proxy(n.selectMonth, n),
                n.selectYear = $.proxy(n.selectYear, n),
                n.selectEvent = $.proxy(n.selectEvent, n),
                n.toggleSidebar = $.proxy(n.toggleSidebar, n),
                n.toggleEventList = $.proxy(n.toggleEventList, n),
                n.instanceUid = e++,
                n.init(!0)
            }
            ),
            EvoCalendar.prototype.init = function(e) {
                var t = this;
                $(t.$elements.calendarEl).hasClass("calendar-initialized") || ($(t.$elements.calendarEl).addClass("evo-calendar calendar-initialized"),
                t.windowW <= t.$breakpoints.tablet ? (t.toggleSidebar(!1),
                t.toggleEventList(!1)) : (t.options.sidebarDisplayDefault ? t.toggleSidebar(!0) : t.toggleSidebar(!1),
                t.options.eventDisplayDefault ? t.toggleEventList(!0) : t.toggleEventList(!1)),
                t.options.theme && t.setTheme(t.options.theme),
                t.buildTheBones())
            }
            ,
            EvoCalendar.prototype.destroy = function() {
                var e = this;
                e.destroyEventListener(),
                e.$elements.calendarEl && (e.$elements.calendarEl.removeClass("calendar-initialized"),
                e.$elements.calendarEl.removeClass("evo-calendar"),
                e.$elements.calendarEl.removeClass("sidebar-hide"),
                e.$elements.calendarEl.removeClass("event-hide")),
                e.$elements.calendarEl.empty(),
                e.$elements.calendarEl.attr("class", e.initials.default_class),
                $(e.$elements.calendarEl).trigger("destroy", [e])
            }
            ,
            EvoCalendar.prototype.limitTitle = function(e, t) {
                if (!e || 0 == e.length)
                    return "";
                var a = [];
                if (t = void 0 === t ? 18 : t,
                e.split(" ").join("").length > t) {
                    for (var n = e.split(" "), o = 0; o < n.length; o++)
                        n[o].length + a.join("").length <= t && a.push(n[o]);
                    return a.join(" ") + "..."
                }
                return e
            }
            ,
            EvoCalendar.prototype.stringCheck = function(e) {
                return e.replace(/[^\w]/g, "\\$&")
            }
            ,
            EvoCalendar.prototype.parseFormat = function(e) {
                if ("function" == typeof e.toValue && "function" == typeof e.toDisplay)
                    return e;
                var t = e.replace(this.initials.validParts, "\0").split("\0")
                  , a = e.match(this.initials.validParts);
                return !t || !t.length || !a || a.length,
                {
                    separators: t,
                    parts: a
                }
            }
            ,
            EvoCalendar.prototype.formatDate = function(e, t, a) {
                var n = this;
                if (!e)
                    return "";
                if (a = a || n.defaults.language,
                "string" == typeof t && (t = n.parseFormat(t)),
                t.toDisplay)
                    return t.toDisplay(e, t, a);
                var o = new Date(e)
                  , s = {
                    d: o.getDate(),
                    D: n.initials.dates[a].daysShort[o.getDay()],
                    DD: n.initials.dates[a].days[o.getDay()],
                    m: o.getMonth() + 1,
                    M: n.initials.dates[a].monthsShort[o.getMonth()],
                    MM: n.initials.dates[a].months[o.getMonth()],
                    yy: o.getFullYear().toString().substring(2),
                    yyyy: o.getFullYear()
                };
                s.dd = (s.d < 10 ? "0" : "") + s.d,
                s.mm = (s.m < 10 ? "0" : "") + s.m,
                e = [];
                for (var r = $.extend([], t.separators), i = 0, l = t.parts.length; i <= l; i++)
                    r.length && e.push(r.shift()),
                    e.push(s[t.parts[i]]);
                return e.join("")
            }
            ,
            EvoCalendar.prototype.getBetweenDates = function(e) {
                for (var t = this, a = [], n = 0; n < t.monthLength; n++) {
                    var o = t.formatDate(t.$label.months[t.$active.month] + " " + (n + 1) + " " + t.$active.year, t.options.format);
                    t.isBetweenDates(o, e) && a.push(o)
                }
                return a
            }
            ,
            EvoCalendar.prototype.isBetweenDates = function(e, t) {
                var a, n;
                return t instanceof Array ? (a = new Date(t[0]),
                n = new Date(t[1])) : (a = new Date(t),
                n = new Date(t)),
                a <= new Date(e) && n >= new Date(e)
            }
            ,
            EvoCalendar.prototype.hasSameDayEventType = function(e, t) {
                for (var a = this, n = 0, o = 0; o < a.options.calendarEvents.length; o++)
                    if (a.options.calendarEvents[o].date instanceof Array)
                        for (var s = a.getBetweenDates(a.options.calendarEvents[o].date), r = 0; r < s.length; r++)
                            e === s[r] && t === a.options.calendarEvents[o].type && n++;
                    else
                        e === a.options.calendarEvents[o].date && t === a.options.calendarEvents[o].type && n++;
                return n > 0
            }
            ,
            EvoCalendar.prototype.setTheme = function(e) {
                var t = this
                  , a = t.options.theme;
                t.options.theme = e.toLowerCase().split(" ").join("-"),
                t.options.theme && $(t.$elements.calendarEl).removeClass(a),
                "default" !== t.options.theme && $(t.$elements.calendarEl).addClass(t.options.theme)
            }
            ,
            EvoCalendar.prototype.resize = function() {
                var e = this;
                e.windowW = $(window).width(),
                e.windowW <= e.$breakpoints.tablet ? (e.toggleSidebar(!1),
                e.toggleEventList(!1),
                e.windowW <= e.$breakpoints.mobile ? $(window).off("click.evocalendar.evo-" + e.instanceUid) : $(window).on("click.evocalendar.evo-" + e.instanceUid, $.proxy(e.toggleOutside, e))) : (e.options.sidebarDisplayDefault ? e.toggleSidebar(!0) : e.toggleSidebar(!1),
                e.options.eventDisplayDefault ? e.toggleEventList(!0) : e.toggleEventList(!1),
                $(window).off("click.evocalendar.evo-" + e.instanceUid))
            }
            ,
            EvoCalendar.prototype.initEventListener = function() {
                var e = this;
                $(window).off("resize.evocalendar.evo-" + e.instanceUid).on("resize.evocalendar.evo-" + e.instanceUid, $.proxy(e.resize, e)),
                e.options.sidebarToggler && e.$elements.sidebarToggler.off("click.evocalendar").on("click.evocalendar", e.toggleSidebar),
                e.options.eventListToggler && e.$elements.eventListToggler.off("click.evocalendar").on("click.evocalendar", e.toggleEventList),
                e.$elements.sidebarEl.find("[data-month-val]").off("click.evocalendar").on("click.evocalendar", e.selectMonth),
                e.$elements.sidebarEl.find("[data-year-val]").off("click.evocalendar").on("click.evocalendar", e.selectYear),
                e.$elements.eventEl.find("[data-event-index]").off("click.evocalendar").on("click.evocalendar", e.selectEvent)
            }
            ,
            EvoCalendar.prototype.destroyEventListener = function() {
                var e = this;
                $(window).off("resize.evocalendar.evo-" + e.instanceUid),
                $(window).off("click.evocalendar.evo-" + e.instanceUid),
                e.options.sidebarToggler && e.$elements.sidebarToggler.off("click.evocalendar"),
                e.options.eventListToggler && e.$elements.eventListToggler.off("click.evocalendar"),
                e.$elements.innerEl.find(".calendar-day").children().off("click.evocalendar"),
                e.$elements.sidebarEl.find("[data-month-val]").off("click.evocalendar"),
                e.$elements.sidebarEl.find("[data-year-val]").off("click.evocalendar"),
                e.$elements.eventEl.find("[data-event-index]").off("click.evocalendar")
            }
            ,
            EvoCalendar.prototype.calculateDays = function() {
                var e, t, a, n = this;
                for (n.monthLength = n.$label.days_in_month[n.$active.month],
                1 == n.$active.month && (n.$active.year % 4 == 0 && n.$active.year % 100 != 0 || n.$active.year % 400 == 0) && (n.monthLength = 29),
                e = n.initials.dates[window.wacore.translation.language].daysShort,
                t = n.options.firstDayOfWeek; n.$label.days.length < e.length; )
                    t == e.length && (t = 0),
                    n.$label.days.push(e[t]),
                    t++;
                a = new Date(n.$active.year,n.$active.month).getDay() - t,
                n.startingDay = a < 0 ? n.$label.days.length + a : a
            }
            ,
            EvoCalendar.prototype.buildTheBones = function() {
                var e = this;
                if (e.calculateDays(),
                !e.$elements.calendarEl.html()) {
                    var t;
                    t = '<div class="calendar-sidebar"><div class="calendar-year"><button class="icon-button" role="button" data-year-val="prev" title="' + e.initials.dates[window.wacore.translation.language].previousYearText + '"><span class="chevron-arrow-left"></span></button>&nbsp;<p></p>&nbsp;<button class="icon-button" role="button" data-year-val="next" title="' + e.initials.dates[window.wacore.translation.language].nextYearText + '"><span class="chevron-arrow-right"></span></button></div><div class="month-list"><ul class="calendar-months">';
                    for (var a = 0; a < e.$label.months.length; a++)
                        t += '<li class="month" role="button" data-month-val="' + a + '">' + e.initials.dates[window.wacore.translation.language].months[a] + "</li>";
                    for (t += "</ul>",
                    t += "</div></div>",
                    t += '<div class="calendar-inner"><table class="calendar-table"><tr><th colspan="7"></th></tr><tr class="calendar-header">',
                    a = 0; a < e.$label.days.length; a++) {
                        var n = "calendar-header-day";
                        e.$label.days[a] !== e.initials.weekends.sat && e.$label.days[a] !== e.initials.weekends.sun || (n += " --weekend"),
                        t += '<td class="' + n + '">' + e.$label.days[a] + "</td>"
                    }
                    t += "</tr></table></div>",
                    t += '<div class="calendar-events"><div class="event-header"><p></p></div><div class="event-list"></div></div>',
                    e.$elements.calendarEl.html(t),
                    e.$elements.sidebarEl || (e.$elements.sidebarEl = $(e.$elements.calendarEl).find(".calendar-sidebar")),
                    e.$elements.innerEl || (e.$elements.innerEl = $(e.$elements.calendarEl).find(".calendar-inner")),
                    e.$elements.eventEl || (e.$elements.eventEl = $(e.$elements.calendarEl).find(".calendar-events")),
                    e.options.sidebarToggler && ($(e.$elements.sidebarEl).append('<span id="sidebarToggler" role="button" aria-pressed title="' + e.initials.dates[window.wacore.translation.language].closeSidebarText + '"><button class="icon-button"><span class="bars"></span></button></span>'),
                    e.$elements.sidebarToggler || (e.$elements.sidebarToggler = $(e.$elements.sidebarEl).find("span#sidebarToggler"))),
                    e.options.eventListToggler && ($(e.$elements.calendarEl).append('<span id="eventListToggler" role="button" aria-pressed title="' + e.initials.dates[window.wacore.translation.language].closeEventListText + '"><button class="icon-button"><span class="chevron-arrow-right"></span></button></span>'),
                    e.$elements.eventListToggler || (e.$elements.eventListToggler = $(e.$elements.calendarEl).find("span#eventListToggler")))
                }
                e.buildSidebarYear(),
                e.buildSidebarMonths(),
                e.buildCalendar(),
                e.buildEventList(),
                e.initEventListener(),
                e.resize()
            }
            ,
            EvoCalendar.prototype.buildEventList = function() {
                var e, t = this, a = !1;
                t.$active.events = [];
                var n = t.formatDate(t.$active.date, t.options.eventHeaderFormat, window.wacore.translation.language);
                t.$elements.eventEl.find(".event-header > p").text(n);
                var o = t.$elements.eventEl.find(".event-list");
                if (o.children().length > 0 && o.empty(),
                t.options.calendarEvents)
                    for (var s = 0; s < t.options.calendarEvents.length; s++)
                        (t.isBetweenDates(t.$active.date, t.options.calendarEvents[s].date) || t.options.calendarEvents[s].everyYear && new Date(t.$active.date).getMonth() + 1 + " " + new Date(t.$active.date).getDate() == new Date(t.options.calendarEvents[s].date).getMonth() + 1 + " " + new Date(t.options.calendarEvents[s].date).getDate()) && r(t.options.calendarEvents[s]);
                function r(e) {
                    a = !0,
                    t.addEventList(e)
                }
                a || (e = '<div class="event-empty">',
                t.$active.date === t.$current.date ? e += "<p>" + t.initials.dates[window.wacore.translation.language].noEventForToday + "</p>" : e += "<p>" + t.initials.dates[window.wacore.translation.language].noEventForThisDay + "</p>",
                e += "</div>"),
                o.append(e)
            }
            ,
            EvoCalendar.prototype.addEventList = function(e) {
                var t, a = this, n = a.$elements.eventEl.find(".event-list");
                0 === n.find("[data-event-index]").length && n.empty(),
                a.$active.events.push(e);
                var o = ""
                  , s = "SEND_TEXT" == e.type ? window.wacore.svgs.new_chat(22, 22, "margin-top: 7px;margin-right: 5px;") : window.wacore.svgs.note(22, 22, "margin-top: 7px;margin-right: 5px;");
                switch (e.status) {
                case "WAITING":
                    o = "Aguardando pra ser enviado";
                    break;
                case "ERROR":
                    o = "Erro ao tentar enviar";
                    break;
                case "SUCCESS":
                    o = "Agendamento enviado com sucesso";
                    break;
                case "CANCELED":
                    o = "Agendamento Cancelado"
                }
                t = `<div class="event-container" role="button" data-event-index="${e.id}" title="${o}">`,
                t += '<div class="event-icon"><div class="event-bullet-' + e.status + '"',
                e.color && (t += 'style="background-color:' + e.color + '"'),
                t += '></div></div><div class="event-info"><p class="event-title" style="display:flex;">' + s + a.limitTitle(e.name),
                e.badge && (t += "<span>" + e.badge + "</span>"),
                t += "</p>",
                e.description && (t += '<p class="event-desc">' + e.description + "</p>"),
                t += "</div>",
                t += "</div>",
                n.append(t),
                a.$elements.eventEl.find('[data-event-index="' + e.id + '"]').off("click.evocalendar").on("click.evocalendar", a.selectEvent)
            }
            ,
            EvoCalendar.prototype.removeEventList = function(e) {
                var t, a = this, n = a.$elements.eventEl.find(".event-list");
                0 !== n.find('[data-event-index="' + e + '"]').length && (n.find('[data-event-index="' + e + '"]').remove(),
                0 === n.find("[data-event-index]").length && (n.empty(),
                a.$active.date === a.$current.date ? t += "<p>" + a.initials.dates[window.wacore.translation.language].noEventForToday + "</p>" : t += "<p>" + a.initials.dates[window.wacore.translation.language].noEventForThisDay + "</p>",
                n.append(t)))
            }
            ,
            EvoCalendar.prototype.buildSidebarYear = function() {
                this.$elements.sidebarEl.find(".calendar-year > p").text(this.$active.year)
            }
            ,
            EvoCalendar.prototype.buildSidebarMonths = function() {
                var e = this;
                e.$elements.sidebarEl.find(".calendar-months > [data-month-val]").removeClass("active-month"),
                e.$elements.sidebarEl.find('.calendar-months > [data-month-val="' + e.$active.month + '"]').addClass("active-month")
            }
            ,
            EvoCalendar.prototype.buildCalendar = function() {
                var e, t, a = this;
                a.calculateDays(),
                t = a.formatDate(new Date(a.$label.months[a.$active.month] + " 1 " + a.$active.year), a.options.titleFormat, window.wacore.translation.language),
                a.$elements.innerEl.find(".calendar-table th").text(t),
                a.$elements.innerEl.find(".calendar-body").remove(),
                e += '<tr class="calendar-body">';
                for (var n = 1, o = 0; o < 9; o++) {
                    for (var s = 0; s < a.$label.days.length; s++) {
                        if (n <= a.monthLength && (o > 0 || s >= a.startingDay)) {
                            var r = "calendar-day";
                            a.$label.days[s] !== a.initials.weekends.sat && a.$label.days[s] !== a.initials.weekends.sun || (r += " --weekend"),
                            e += '<td class="' + r + '">',
                            e += '<div class="day" role="button" data-date-val="' + a.formatDate(a.$label.months[a.$active.month] + " " + n + " " + a.$active.year, a.options.format) + '">' + n + "</div>",
                            n++
                        } else
                            e += "<td>";
                        e += "</td>"
                    }
                    if (n > a.monthLength)
                        break;
                    e += '</tr><tr class="calendar-body">'
                }
                e += "</tr>",
                a.$elements.innerEl.find(".calendar-table").append(e),
                a.options.todayHighlight && a.$elements.innerEl.find("[data-date-val='" + a.$current.date + "']").addClass("calendar-today"),
                a.$elements.innerEl.find(".calendar-day").children().off("click.evocalendar").on("click.evocalendar", a.selectDate);
                var i = a.$elements.innerEl.find("[data-date-val='" + a.$active.date + "']");
                i && (a.$elements.innerEl.children().removeClass("calendar-active"),
                i.addClass("calendar-active")),
                null != a.options.calendarEvents && a.buildEventIndicator()
            }
            ,
            EvoCalendar.prototype.addEventIndicator = function(e) {
                var t, a, n = this, o = e.date, s = n.stringCheck(e.type);
                if (o instanceof Array) {
                    if (e.everyYear)
                        for (var r = 0; r < o.length; r++)
                            o[r] = n.formatDate(new Date(o[r]).setFullYear(n.$active.year), n.options.format);
                    for (var i = n.getBetweenDates(o), l = 0; l < i.length; l++)
                        c(i[l])
                } else
                    e.everyYear && (o = n.formatDate(new Date(o).setFullYear(n.$active.year), n.options.format)),
                    c(o);
                function c(o) {
                    0 === (a = n.$elements.innerEl.find('[data-date-val="' + o + '"]')).find("span.event-indicator").length && a.append('<span class="event-indicator"></span>'),
                    0 === a.find("span.event-indicator > .type-bullet > .type-" + s).length && (t = '<div class="type-bullet"><div ',
                    t += 'class="type-' + e.type + '"',
                    e.color && (t += 'style="background-color:' + e.color + '"'),
                    t += "></div></div>",
                    a.find(".event-indicator").append(t))
                }
            }
            ,
            EvoCalendar.prototype.removeEventIndicator = function(e) {
                var t = this
                  , a = e.date
                  , n = t.stringCheck(e.type);
                if (a instanceof Array)
                    for (var o = t.getBetweenDates(a), s = 0; s < o.length; s++)
                        r(o[s]);
                else
                    r(a);
                function r(e) {
                    0 !== t.$elements.innerEl.find('[data-date-val="' + e + '"] span.event-indicator').length && (t.hasSameDayEventType(e, n) || t.$elements.innerEl.find('[data-date-val="' + e + '"] span.event-indicator > .type-bullet > .type-' + n).parent().remove())
                }
            }
            ,
            EvoCalendar.prototype.buildEventIndicator = function() {
                var e = this;
                e.$elements.innerEl.find(".calendar-day > day > .event-indicator").empty();
                for (var t = 0; t < e.options.calendarEvents.length; t++)
                    e.addEventIndicator(e.options.calendarEvents[t])
            }
            ,
            EvoCalendar.prototype.selectEvent = function(e) {
                var t = this
                  , a = $(e.target).closest(".event-container")
                  , n = $(a).data("eventIndex").toString()
                  , o = t.options.calendarEvents.map((function(e) {
                    return e.id.toString()
                }
                )).indexOf(n)
                  , s = t.options.calendarEvents[o];
                s.date instanceof Array && (s.dates_range = t.getBetweenDates(s.date)),
                $(t.$elements.calendarEl).trigger("selectEvent", [t.options.calendarEvents[o]])
            }
            ,
            EvoCalendar.prototype.selectYear = function(e) {
                var t, a, n = this;
                "string" == typeof e || "number" == typeof e ? 4 === parseInt(e).toString().length && (a = parseInt(e)) : (t = $(e.target).closest("[data-year-val]"),
                a = $(t).data("yearVal")),
                "prev" == a ? --n.$active.year : "next" == a ? ++n.$active.year : "number" == typeof a && (n.$active.year = a),
                n.windowW <= n.$breakpoints.mobile && n.$UI.hasSidebar && n.toggleSidebar(!1),
                $(n.$elements.calendarEl).trigger("selectYear", [n.$active.year]),
                n.buildSidebarYear(),
                n.buildCalendar()
            }
            ,
            EvoCalendar.prototype.selectMonth = function(e) {
                var t = this;
                "string" == typeof e || "number" == typeof e ? e >= 0 && e <= t.$label.months.length && (t.$active.month = e.toString()) : t.$active.month = $(e.currentTarget).data("monthVal"),
                t.buildSidebarMonths(),
                t.buildCalendar(),
                t.windowW <= t.$breakpoints.tablet && t.$UI.hasSidebar && t.toggleSidebar(!1),
                $(t.$elements.calendarEl).trigger("selectMonth", [t.initials.dates[window.wacore.translation.language].months[t.$active.month], t.$active.month])
            }
            ,
            EvoCalendar.prototype.selectDate = function(e) {
                var t, a, n, o, s, r = this, i = r.$active.date;
                "string" == typeof e || "number" == typeof e || e instanceof Date ? (t = r.formatDate(new Date(e), r.options.format),
                a = new Date(t).getFullYear(),
                n = new Date(t).getMonth(),
                r.$active.year !== a && r.selectYear(a),
                r.$active.month !== n && r.selectMonth(n),
                o = r.$elements.innerEl.find("[data-date-val='" + t + "']")) : t = (o = $(e.currentTarget)).data("dateVal"),
                s = r.$active.date === t,
                r.$active.date = t,
                r.$active.event_date = t,
                r.$elements.innerEl.find("[data-date-val]").removeClass("calendar-active"),
                o.addClass("calendar-active"),
                s || r.buildEventList(),
                $(r.$elements.calendarEl).trigger("selectDate", [r.$active.date, i])
            }
            ,
            EvoCalendar.prototype.getActiveDate = function() {
                return this.$active.date
            }
            ,
            EvoCalendar.prototype.getActiveEvents = function() {
                return this.$active.events
            }
            ,
            EvoCalendar.prototype.toggleOutside = function(e) {
                var t, a = this;
                t = e.target === a.$elements.innerEl[0],
                a.$UI.hasSidebar && t && a.toggleSidebar(!1),
                a.$UI.hasEvent && t && a.toggleEventList(!1)
            }
            ,
            EvoCalendar.prototype.toggleSidebar = function(e) {
                var t = this;
                void 0 === e || e.originalEvent ? ($(t.$elements.calendarEl).toggleClass("sidebar-hide"),
                t.$UI.hasSidebar = !t.$UI.hasSidebar) : e ? ($(t.$elements.calendarEl).removeClass("sidebar-hide"),
                t.$UI.hasSidebar = !0) : ($(t.$elements.calendarEl).addClass("sidebar-hide"),
                t.$UI.hasSidebar = !1),
                t.windowW <= t.$breakpoints.tablet && t.$UI.hasSidebar && t.$UI.hasEvent && t.toggleEventList()
            }
            ,
            EvoCalendar.prototype.toggleEventList = function(e) {
                var t = this;
                void 0 === e || e.originalEvent ? ($(t.$elements.calendarEl).toggleClass("event-hide"),
                t.$UI.hasEvent = !t.$UI.hasEvent) : e ? ($(t.$elements.calendarEl).removeClass("event-hide"),
                t.$UI.hasEvent = !0) : ($(t.$elements.calendarEl).addClass("event-hide"),
                t.$UI.hasEvent = !1),
                t.windowW <= t.$breakpoints.tablet && t.$UI.hasEvent && t.$UI.hasSidebar && t.toggleSidebar()
            }
            ,
            EvoCalendar.prototype.addCalendarEvent = function(e) {
                var t = this;
                function a(e) {
                    if (e.id,
                    e.date instanceof Array)
                        for (var a = 0; a < e.date.length; a++)
                            n(e.date[a]) && (e.date[a] = t.formatDate(new Date(e.date[a]), t.options.format));
                    else
                        n(e.date) && (e.date = t.formatDate(new Date(e.date), t.options.format));
                    function n(e) {
                        return !!t.isValidDate(e)
                    }
                    t.options.calendarEvents || (t.options.calendarEvents = []),
                    t.options.calendarEvents.push(e),
                    t.addEventIndicator(e),
                    t.$active.event_date === e.date && t.addEventList(e)
                }
                if (e instanceof Array)
                    for (var n = 0; n < e.length; n++)
                        a(e[n]);
                else
                    "object" == typeof e && a(e)
            }
            ,
            EvoCalendar.prototype.removeCalendarEvent = function(e) {
                var t = this;
                function a(e) {
                    var a = t.options.calendarEvents.map((function(e) {
                        return e.id
                    }
                    )).indexOf(e);
                    if (a >= 0) {
                        var n = t.options.calendarEvents[a];
                        t.options.calendarEvents.splice(a, 1),
                        t.removeEventList(e),
                        t.removeEventIndicator(n)
                    }
                }
                if (e instanceof Array)
                    for (var n = 0; n < e.length; n++)
                        a(e[n]);
                else
                    a(e)
            }
            ,
            EvoCalendar.prototype.isValidDate = function(e) {
                return new Date(e) && !isNaN(new Date(e).getTime())
            }
        }
        ,
        18: ()=>{
            window.wacore.function = {
                chat_interno: !1,
                exportList: [],
                notificacoesLista: [],
                updateUnreadCountChats: function() {
                    try {
                        setTimeout((()=>{
                            $("#chat-unread-count").text(window.wacore.whatsapp.getFilteredUnreadCount()),
                            window.wacore.whatsapp.getFilteredUnreadCount() > 0 ? ($("#chat-unread-count").addClass("badge-alert-unreadcount-rounded"),
                            $("#chat-unread-count").show()) : $("#chat-unread-count").hide()
                        }
                        ), 1e3)
                    } catch {}
                },
                doUpdatesCurFilter: async function() {
                    await window.wacore.whatsapp.renderFilter(wacore.curFilter.action, wacore.curFilter.type, wacore.curFilter.filterValue, wacore.curFilter.name),
                    document.querySelector(`[data-namelist=${wacore.curFilter.type}]`) ? document.querySelector(`[data-namelist=${wacore.curFilter.type}][data-namevalue=${wacore.curFilter.filterValue}]`).className += " chats-filter--active" : document.querySelector("[data-namelist=tab_all]").className += " chats-filter--active"
                },
                forceCloseFocusedChat: function() {
                    window.Store && window.Store.Chat.getActive() && (window.Store.Cmd.closeChat(window.Store.Chat.getActive()),
                    wacore.activeChat = null)
                },
                forceUpdateChat: async function(e, t) {
                    if (wacore.status && "broadcast" != e.id.server) {
                        window.wacore.function.updateUnreadCountChats();
                        var a = e.msgs.last()
                          , n = await window.wacore.whatsapp.getChat(e.id._serialized);
                        wacore.function.checkShouldAppearInList(n, a) || !t && window.wacore.activeChat == e.id._serialized ? (n.archive && !n.mute?.__x_isMuted && n.setArchive(!1),
                        wacore.whatsapp.manipulate_chatlist("number", e.id._serialized)) : setTimeout((()=>{
                            window.Store.Chat._models.filter((function(t) {
                                return t.id._serialized === e.id._serialized
                            }
                            )).forEach((function(e) {
                                return e.__x_shouldAppearInList = !1
                            }
                            )),
                            wacore.whatsapp.forceSortListChat()
                        }
                        ), 200),
                        await wacore.crm.syncCardsContent(e.id._serialized),
                        wacore.crm.syncAvatar(e.id._serialized),
                        window.wacore.whatsapp.countAll(),
                        wacore.crm.hashtags.status && e && e.id && a && a.id && wacore.whatsapp.searchTag(e.id._serialized, a?.body)
                    }
                },
                checkShouldAppearInList: function(e, t) {
                    var a = !0;
                    if (wacore.curFilter && wacore.curFilter.filterValue && "tab_all" != wacore.curFilter.filterValue && !e.archive)
                        if ("tab_groups" !== wacore.curFilter.filterValue || e.isGroup) {
                            if ("tab_1_1" === wacore.curFilter.filterValue && e.isGroup)
                                a = !1;
                            else if ("tab_unread" === wacore.curFilter.filterValue)
                                a = e.unreadCount && e.unreadCount > 0;
                            else if ("tab_client_awaiting_reply" === wacore.curFilter.filterValue)
                                a = t.id.fromMe;
                            else if ("tab_needs_user_reply" === wacore.curFilter.filterValue)
                                a = !t.id.fromMe;
                            else if ("renderTagsTab" === wacore.curFilter.action && wacore.curFilter.filterValue)
                                a = (o = wacore.crm.getChatIdsFromTag(wacore.curFilter.filterValue)).includes(e.id._serialized);
                            else if ("renderOperatorTab" === wacore.curFilter.action && wacore.curFilter.filterValue)
                                a = (o = wacore.crm.getChatIdsByUser(wacore.curFilter.filterValue)).includes(e.id._serialized);
                            else if ("renderListTab" === wacore.curFilter.action && wacore.curFilter.filterValue) {
                                var n = wacore.crm.cards.filter((e=>e.crmlist === wacore.curFilter.filterValue))
                                  , o = [];
                                n.map((e=>o.push(e.id))),
                                a = o.includes(e.id._serialized)
                            }
                        } else
                            a = !1;
                    return a
                },
                hookEventsFocusedChat: async function(e) {
                    wacore.activeChat = e,
                    await wacore.function.openChatButtons(e),
                    setTimeout((function() {
                        wacore.crm.syncAvatar(e)
                    }
                    ), 2e3),
                    window.wacore.format_translation.translateText();
                    var t = window.selectors.getChatImputText();
                    if (t) {
                        var a = t.getEventListeners().find((e=>"keydown" === e.type)).listener;
                        t.removeEventListener("keydown", a),
                        t.addEventListener("keydown", (async e=>{
                            "Enter" === e.key && !e.shiftKey && !e.ctrlKey && t.innerText.replaceAll("\n", "").trim().length > 0 && (e.preventDefault(),
                            await wacore.function.sendMsg(e)),
                            a(e)
                        }
                        ))
                    }
                },
                getCurUserName: function(e) {
                    return wacore.users.length > 0 && wacore.users.find((t=>t.username == e)) ? wacore.users.find((t=>t.username == e)).name : e
                },
                forceScrollBotton: function() {
                    const e = window.selectors.getScreenOfChat();
                    e && (e.scrollTop = e.scrollHeight - e.offsetHeight)
                },
                checkNotificacoes: function() {
                    var e = window.wacore.function.notificacoesLista;
                    if (e.length > window.localStorage.getItem("wapp:versionnews")) {
                        $("#notificacoes-count").addClass("notificacoes-div");
                        var t = parseInt(e.length) - parseInt(window.localStorage.getItem("wapp:versionnews"));
                        $("#notificacoes-count").text(t)
                    } else
                        localStorage.getItem("wapp:versionnews") > 0 && window.localStorage.setItem("wapp:versionnews", e.length)
                },
                btnDownloadList: function() {
                    "free" != currentPlan ? window.open("data:text/csv;charset=utf-8," + window.wacore.function.generateCSV()) : window.wacore.function.modal_plan("Recurso disponível apenas para plano Basic ou Premium")
                },
                generateCSV: function() {
                    let e = window.wacore.function.exportList
                      , t = (e,t)=>t || ""
                      , a = ["number", "name"];
                    return [a.join(","), ...e.map((e=>a.map((a=>JSON.stringify(e[a], t))).join(",")))].join("\r\n")
                },
                modal_plan: function(e) {
                    Swal.fire({
                        icon: "warning",
                        title: '<strong data-translate-key="planLimitation"></strong>',
                        text: e,
                        confirmButtonText: '<span data-translate-key="viewPlans"></span>',
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((e=>{
                        e.isConfirmed && window.wacore.function.planos()
                    }
                    ))
                },
                limitado: function(e, t) {
                    $(".closedPopup").remove(),
                    e == currentPlan ? "listar_usuarios" == t && wacore.html.tpl_users() : "listar_usuarios" == t && $(".tab-pane.withMenusIcons.active.show").append(wacore.html.closedPoup("Cadastro de usuários (Atendentes)", 'Este recurso está disponível apenas para assinante do plano Premium. <div class="btn btn-primary mt-1" role="button" onclick="wacore.function.planos()">Contratar</div> '))
                },
                languages: function() {
                    alert("Disponível apenas em Português(BR)")
                },
                listarusuarios: function() {
                    window.wacore.function.limitado("premium", "listar_usuarios")
                },
                planos: function() {
                    var e = document.getElementById("plans");
                    new bootstrap.Modal(e).show()
                },
                enviarimagem: function(e, t) {
                    window.open(`${window.infoWl.panelUrl}/enviarimagem/?sc=${window.wacore.user.variables.cookie}&sitechannel=${window.wacore.sitechannel}&channel=${window.wacore.channel}&title=${e}&username=${window.wacore.user.variables.username}&favoritar=${t}`, "_blank")
                },
                gravaraudio: function(e, t) {
                    window.open(`${window.infoWl.panelUrl}/gravaraudio/?sc=${window.wacore.user.variables.cookie}&sitechannel=${window.wacore.sitechannel}&channel=${window.wacore.channel}&title=${e}&username=${window.wacore.user.variables.username}&favoritar=${t}`, "_blank")
                },
                faleconosco: async function(e) {
                    try {
                        const t = window.infoWl.contactNumber || window.wacore.channel;
                        if (!t)
                            return !1;
                        const a = /(\d{11,15})$/
                          , n = t.match(a);
                        if (!n)
                            return !1;
                        const o = n[1];
                        return e ? (await wacore.function.newChat(`${o}@c.us`, !0),
                        await window.wacore.crm.openChatBTN(o)) : await wacore.function.newChat(`${o}@c.us`),
                        !0
                    } catch (e) {}
                },
                assinar: function() {
                    let e = `${window.infoWl.panelUrl}/assinar/?channel=${wacore.sitechannel}&language=${localStorage.getItem("ChatLabelLangPref") || "en"}`;
                    window.open(e, "blank")
                },
                openHelp: function() {
                    window.infoWl.helpUrl && window.open(window.infoWl.helpUrl, "blank")
                },
                openChangelog: function() {
                    window.infoWl.changelogUrl && window.open(window.infoWl.changelogUrl, "blank")
                },
                openPanelADM: function() {
                    if (window.infoWl.panelUrl) {
                        let e = `${window.infoWl.panelUrl}/login?language=${localStorage.getItem("ChatLabelLangPref") || "en"}`;
                        window.open(e, "blank")
                    }
                },
                voltarLogin: function() {
                    $("#pills-wacore-tab").click()
                },
                opendmlist: async function(e, t) {
                    "crmlist" == e && ($("#v-pills-disparomassa-tab").click(),
                    setTimeout((async function() {
                        $("#btn-voltar-fontes").attr("disabled", !1),
                        $("#lista_fontes").css("display", "none"),
                        $("#dm_selectform").html(""),
                        $("#dm_selecionarcontatos").html("");
                        var e = wacore.crm.cards.filter((e=>e.crmlist === t))
                          , a = [];
                        for (let t in e)
                            if (e[t].id) {
                                let n = await window.wacore.whatsapp.getChat(e[t].id);
                                n && a.push({
                                    id: n.id._serialized,
                                    name: n.contact?.pushname || n.name || n.id._serialized,
                                    avatar: n.contact?.profilePicThumb?.eurl
                                })
                            }
                        window.wacore.disparomassa.listarcontatos("listascrm", a),
                        setTimeout((function() {
                            document.getElementById("selecionar_todos").click()
                        }
                        ), 50)
                    }
                    ), 500))
                },
                notifications: function() {
                    var e = document.getElementById("modulo_page");
                    new bootstrap.Offcanvas(e).show(),
                    $("#modulo_titulo").text(""),
                    $("#modulo_titulo").attr("data-translate-key", "notifications"),
                    $("#modulo_body").html("");
                    let t = '<div class="list-group">';
                    var a = window.wacore.function.notificacoesLista;
                    for (let e in a)
                        a[e].title && (t += `<div class="list-group-item list-group-item-action">\n\n                <div class="d-flex w-100 justify-content-between">\n                \n                <p class="text-bold mb-0">${a[e].title}</p>\n                <small>${new Date(a[e].createdAt).toLocaleString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }).replace(/\//g, "/")}</small>\n                </div>\n                <p class="mb-1">${a[e].message}</p>\n                </div>`);
                    t += "</div>",
                    $("#modulo_footer").html(""),
                    $("#modulo_body").html(t),
                    a.length > window.localStorage.getItem("wapp:versionnews") && (window.localStorage.setItem("wapp:versionnews", a.length),
                    $("#notificacoes-count").html(""),
                    $("#notificacoes-count").removeClass("notificacoes-div"))
                },
                masknumber: async function(e) {
                    let t = e;
                    return e.includes("@") && (t = e.split("@")[0]),
                    await window.wacore.function.setMask("+" + t)
                },
                setMask: function(e) {
                    let t = "+###############";
                    wacore.maskList.forEach((a=>{
                        let n = a.code.replace(/[\s#]/g, "");
                        e.replace(/[\s#-)(]/g, "").includes(n) && (t = a.code)
                    }
                    ));
                    let a = 0
                      , n = e.replace(/\D/g, "");
                    return e = t.replace(/(?!\+)./g, (function(e) {
                        return /[#\d]/.test(e) && a < n.length ? n.charAt(a++) : a >= n.length ? "" : e
                    }
                    ))
                },
                mask: async function(e) {
                    return await window.wacore.function.setMask("+" + e)
                },
                hashtag: async function(e) {
                    var t = document.getElementById(e)
                      , a = t.value.replace(/\s/g, "");
                    a = a.replace("#", ""),
                    t.value = "#" + a
                },
                moeda: async function(e) {
                    var t = document.getElementById(e)
                      , a = t.value.replace(/\D/g, "");
                    a = (a = (a = (a = (a / 100).toFixed(2) + "").replace(".", ",")).replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,")).replace(/(\d)(\d{3}),/g, "$1.$2,"),
                    t.value = "R$ " + a
                },
                sendQrCodeWpp: async function() {
                    try {
                        await Swal.fire({
                            icon: "info",
                            title: '<strong data-translate-key="multiAttendant"></strong>',
                            html: '<p data-translate-key="messageSendQrCodeWpp"></p>',
                            confirmButtonText: '<span data-translate-key="iUnderstood"></span>',
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        })
                    } catch (e) {}
                },
                sendQrCodeEvent: async function() {
                    try {
                        document.querySelectorAll(".sendqrcode").forEach((e=>{
                            e.addEventListener("click", (async()=>{
                                await wacore.function.sendQrCodeWpp()
                            }
                            ))
                        }
                        ))
                    } catch (e) {}
                },
                getRandomInt: function(e, t) {
                    return e = Math.ceil(e),
                    t = Math.floor(t),
                    Math.floor(Math.random() * (t - e)) + e
                },
                generateId: function(e=10) {
                    return (new Date).getTime() * wacore.function.getRandomInt(5, 30) * e
                },
                mongoObjectId: function() {
                    return ((new Date).getTime() / 1e3 | 0).toString(16) + "xxxxxxxxxxxxxxxx".replace(/[x]/g, (function() {
                        return (16 * Math.random() | 0).toString(16)
                    }
                    )).toLowerCase()
                },
                returnServerInNumber: function(e) {
                    if (!e)
                        return null;
                    if (e.includes("@c.us") || e.includes("@g.us"))
                        return e;
                    let t = "@c.us"
                      , a = e.replace(/[\n\r]/g, "");
                    return (a.split("-").length > 1 || a.length >= 14) && (t = "@g.us"),
                    `${a}${t}`
                },
                chatInterno: function() {
                    if ("premium" == currentPlan) {
                        var e = document.getElementById("chatinterno");
                        new bootstrap.Offcanvas(e).show()
                    } else
                        window.wacore.function.modal_plan("Recurso disponível apenas para plano Premium")
                },
                startNewChat: async function() {
                    try {
                        const {value: t} = await Swal.fire({
                            title: '<strong data-translate-key="startConversation"></strong>',
                            html: '<p data-translate-key="startNewChatMessage"></p>',
                            input: "text",
                            inputPlaceholder: "(00) 00000000",
                            confirmButtonText: '<span data-translate-key="startConversation"></span>',
                            inputAttributes: {
                                id: "phoneStart"
                            },
                            didOpen: function(e) {
                                window.wacore.format_translation.translateText(),
                                document.getElementById("phoneStart").addEventListener("input", (function(e) {
                                    let t = "+###############";
                                    [{
                                        code: "+55 ## #########"
                                    }, {
                                        code: "+55 ## ##########"
                                    }].forEach((a=>{
                                        let n = a.code.replace(/[\s#]/g, "");
                                        e.target.value.replace(/[\s#-)(]/g, "").includes(n) && (t = a.code)
                                    }
                                    ));
                                    let a = 0
                                      , n = e.target.value.replace(/\D/g, "");
                                    e.target.value = t.replace(/(?!\+)./g, (function(e) {
                                        return /[#\d]/.test(e) && a < n.length ? n.charAt(a++) : a >= n.length ? "" : e
                                    }
                                    ))
                                }
                                )),
                                setTimeout((function() {
                                    document.getElementById("phoneStart").value = "+55 "
                                }
                                ), 200)
                            }
                        });
                        if (t) {
                            var e = t.replace(/[^0-9]/g, "");
                            await window.wacore.whatsapp.getNumberId(e) ? window.wacore.whatsapp.newUrlChat(e, "") : Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: '<p data-translate-key="invalidNumber"></p>',
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                        }
                    } catch (e) {}
                },
                cb: async function(e) {
                    try {
                        await wacore.function.forceCloseFocusedChat(),
                        window.Store.Cmd.openChatAt(e).then((e=>{}
                        ))
                    } catch (e) {}
                },
                newChat: async function(e, t) {
                    try {
                        t || (window.wacore.crm.fecharChat(),
                        $(".btn-close").click(),
                        $("#v-pills-whatsapp-button").click());
                        var a = await window.wacore.whatsapp.getNumberId(e);
                        return new Promise(((e,t)=>{
                            window.Store.Chat.find(a._serialized).then((function(t) {
                                wacore.function.cb(t),
                                e(!0)
                            }
                            ), (function(t) {
                                window.Store.QueryExist(window.Store.WidFactory.createWid(a._serialized)).then((async t=>{
                                    if (t && "object" == typeof t) {
                                        var a = new window.Store.UserConstructor(t.wid._serialized,{
                                            intentionallyUsePrivateConstructor: !0
                                        });
                                        await Store.FindChat.findChat(a).then((t=>{
                                            wacore.function.cb(t),
                                            e(!0)
                                        }
                                        ))
                                    }
                                }
                                ))
                            }
                            ))
                        }
                        ))
                    } catch (e) {}
                },
                assignCard: function(e) {
                    try {
                        wacore.crm.cards.filter((t=>t.id === e))[0],
                        wacore.fetch.requestAssignCard({
                            card: e,
                            user: wacore.user.variables.username,
                            name: wacore.user.variables.name
                        })
                    } catch (e) {}
                },
                sendMsg: async function(e) {
                    var t, a, n = window.selectors.getChatImputText();
                    if (window.getSelection && document.createRange ? ((a = document.createRange()).selectNodeContents(n),
                    (t = window.getSelection()).removeAllRanges(),
                    t.addRange(a)) : document.body.createTextRange && ((a = document.body.createTextRange()).moveToElementText(n),
                    a.select()),
                    "ativa" == window.localStorage.getItem("wapp:assinatura") && wacore.user.variables.name) {
                        let e = "*" + wacore.user.variables.name + ":*"
                          , t = n.innerText;
                        if (!t.includes(e)) {
                            var o = new RegExp("\\n\\n","g");
                            t = t.replace(o, "\n"),
                            o = new RegExp("\\n\\n\\n","g"),
                            t = t.replace(o, "\n\n"),
                            o = new RegExp("\\n\\n\\n\\n","g"),
                            t = t.replace(o, "\n\n\n");
                            var s = `${e}\n${t}`
                              , r = n.childNodes[0].childNodes;
                            if (r && r[0].outerHTML.includes("data-app-text-template"))
                                for (let e = 0; e < r.length; e++)
                                    r[e].textContent && r[e].dataset.appTextTemplate && (s = s.replace(r[e].textContent, r[e].dataset.appTextTemplate));
                            await n.dispatchEvent(new InputEvent("beforeinput",{
                                inputType: "insertText",
                                data: s,
                                bubbles: !0,
                                cancelable: !0
                            }))
                        }
                    }
                    wacore.user.variables.status && wacore.function.assignCard(wacore.activeChat)
                },
                addCardUser: function(e) {
                    try {
                        let n = wacore.crm.getCard(e.card)
                          , o = wacore.crm.cards
                          , s = {
                            id: e.card,
                            chat: e.card,
                            crmlist: null,
                            user: e.user
                        };
                        n ? n.user = e.user : (o ? o.push(s) : o = [s],
                        wacore.crm.cards = o);
                        var t = "";
                        e.user && (t = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg> ' + e.user.name);
                        var a = e.card.split("@")[0];
                        document.querySelectorAll(`.userchat_${a}`).forEach((e=>{
                            e.innerHTML = t
                        }
                        )),
                        wacore.activeChat == e.card && document.getElementById("chat-open-operator") && (e.user && e.user.name ? document.getElementById("chat-open-operator").innerHTML = `${e.user.name} <svg xmlns="http://www.w3.org/2000/svg"  width="10" height="10" viewBox="0 0 24 24" style="display: inline-block;"><path fill="currentColor" d="M12 21l-12-18h24z"/></svg>` : document.getElementById("chat-open-operator").innerHTML = 'Sem atendente <svg xmlns="http://www.w3.org/2000/svg"  width="10" height="10" viewBox="0 0 24 24" style="display: inline-block;"><path fill="currentColor" d="M12 21l-12-18h24z"/></svg>'),
                        wacore.whatsapp.manipulate_chatlist("number", e.card)
                    } catch (e) {}
                },
                updateSelectedList: async function() {
                    try {
                        let n = document.querySelector("#move-list-kamban");
                        if (n && wacore.activeChat) {
                            let o = ""
                              , s = wacore.activeChat;
                            var e = wacore.crm.getList()
                              , t = {
                                title: "Recentes"
                            }
                              , a = wacore.crm.getCard(s);
                            if (a && a.crmlist) {
                                let e = wacore.crm.getOneList(a.crmlist);
                                e && (t = e)
                            }
                            let r = t.title;
                            "Recentes" == t.title && (r = "Mover para uma lista"),
                            e && ("Mover para uma lista" != r && (o += `<li role="button" class="dropdown-item my-dropdown-item" style="display: flex;font-weight: 800;color: rgb(207 81 61) !important;" onclick="window.wacore.crm.removerCardDOM('${s.split("@")[0]}')">${window.wacore.svgs.circle_minus(18, 18, "margin-top: 4px;margin-right: 5px;")}</li>`,
                            o += '<li><hr class="dropdown-divider"></li>'),
                            e.map((e=>{
                                if ("default-chats" !== e.id) {
                                    var t = r == e.title ? window.wacore.svgs.circle_check(18, 18, "margin-top: 4px;margin-right: 5px;") : window.wacore.svgs.circle_option(18, 18, "margin-top: 4px;margin-right: 5px;");
                                    o += ` <li role="button" class="dropdown-item my-dropdown-item ${r == e.title ? "selected" : ""}" style="display: flex;" onclick="window.wacore.fetch.requestChangeCardList('${s.split("@")[0]}','${e.id}')">${t} ${e.title}</li>`
                                }
                            }
                            ))),
                            n.innerHTML = `<div class="p-2 text-center my-drop-down-header"><b data-translate-key="moveListConversation"></b></div>\n                    <li><hr class="dropdown-divider"></li> \n                    ${o}`
                        }
                    } catch (e) {
                        console.log(e)
                    }
                },
                openChatButtons: async function(e) {
                    try {
                        await new Promise((e=>setTimeout(e, 1)));
                        let c = document.querySelector("#main");
                        if (c) {
                            let d = c.getElementsByTagName("header")[0];
                            if (c && d) {
                                window.wacore.function.insertButtonsLeft(),
                                document.querySelectorAll("#topo-buttons").forEach((e=>{
                                    e.remove()
                                }
                                )),
                                document.getElementById("card_tags_chat") && document.getElementById("card_tags_chat").remove(),
                                document.querySelectorAll(".btncheckassinatura").forEach((e=>{
                                    e.remove()
                                }
                                )),
                                document.querySelectorAll(".msgsProntas").forEach((e=>{
                                    e.remove()
                                }
                                )),
                                document.querySelectorAll(".btncheckgpt").forEach((e=>{
                                    e.remove()
                                }
                                ));
                                let d = wacore.crm.getCard(e)
                                  , m = "";
                                d && d.tags && d.tags.map(((e,t)=>{
                                    let a = wacore.crm.tags.filter((t=>t.id == e))[0];
                                    m += ` <div class="cor_base_header cor_${e}" >${a?.label}</div>`
                                }
                                ));
                                var t = {
                                    title: "Recentes"
                                }
                                  , a = wacore.crm.getCard(e);
                                if (a && a.crmlist) {
                                    let e = wacore.crm.getOneList(a.crmlist);
                                    e && (t = e)
                                }
                                let u = t.title;
                                "Recentes" == t.title && (u = "Mover para uma lista");
                                let w = "";
                                var n = wacore.crm.getList();
                                n && ("Mover para uma lista" != u && (w += `<li role="button" class="dropdown-item my-dropdown-item" style="display: flex;font-weight: 800;color: rgb(207 81 61) !important;" onclick="window.wacore.crm.removerCardDOM('${e.split("@")[0]}')">${window.wacore.svgs.circle_minus(18, 18, "margin-top: 4px;margin-right: 5px;")}</li>`,
                                w += '<li><hr class="dropdown-divider"></li>'),
                                n.map((t=>{
                                    if ("default-chats" !== t.id) {
                                        var a = u == t.title ? window.wacore.svgs.circle_check(18, 18, "margin-top: 4px;margin-right: 5px;") : window.wacore.svgs.circle_option(18, 18, "margin-top: 4px;margin-right: 5px;");
                                        w += ` <li role="button" class="dropdown-item my-dropdown-item ${u == t.title ? "selected" : ""}" style="display: flex;" onclick="window.wacore.fetch.requestChangeCardList('${e.split("@")[0]}','${t.id}')">${a} ${t.title}</li>`
                                    }
                                }
                                )));
                                var o = wacore.crm.getCard(wacore.activeChat);
                                o && o.user && o.user.name;
                                let p = document.createElement("div");
                                if (p.id = "topo-buttons",
                                p.innerHTML = `\n                    <div style="display: flex">\n\n                        <div class="btn-header-newchatbtn dropdown">\n                            <button data-bs-toggle="dropdown" type="button" id="chat-list-name" class="btn-newchatbtn" style="display: flex;" onclick="window.wacore.crm.openCustonDropdown(this, 'move')" aria-expanded="false">${window.wacore.svgs.kanban(17, 17, "")} ${u}</button>\n                            <ul class="dropdown-menu my-drop-down" style="min-width:250px" id="move-list-kamban"> \n                                <div class="p-2 text-center my-drop-down-header"><b data-translate-key="moveListConversation"></b></div>\n                                <li><hr class="dropdown-divider"></li> \n                                ${w}\n                            </ul>\n                        </div>\n\n                        <div id="btn-open-tags-list" class="btn-header-newchatbtn dropdown" title="" data-translate-key="hangTags">\n                            <button data-bs-toggle="dropdown" type="button" class="btn-newchatbtn" onclick="window.wacore.crm.openCustonDropdown(this)" aria-expanded="false" style="display: flex; padding-left: 8px;">\n                                ${window.wacore.svgs.tag(23, 23, "margin-right: 3px; margin-top: auto")}\n                            </button>\n                            <ul class="custom-dropdown-content tag_header" style="margin-left:5px" id="drop-down-tags" data="${e.split("@")[0]}"></ul>\n                        </div>\n\n                        <div class="dropdown btn-header-newchatbtn">\n                            <button title="" type="button" data-translate-key="transferFromAttendant" class="btn-newchatbtn" data-bs-toggle="dropdown" aria-expanded="false">${window.wacore.svgs.transfer(21, 21, "")}</button>\n                            <ul class="dropdown-menu my-drop-down" style="min-width:320px;"> \n                                <div class="p-2 text-center my-drop-down-header"><b data-translate-key="transferToAnotherAttendant"></b></div>\n                                <li><hr class="dropdown-divider"></li> \n                                <div id="transferir_userlist"></div>\n                            </ul>\n                        </div>\n                        \n                        <div class="btn-header-newchatbtn">\n                            <button title="" data-translate-key="finish" type="button" class="btn-newchatbtn" onclick="wacore.function.finalizar_atendimento(); window.wacore.format_translation.translateText()">${window.wacore.svgs.power_off(23, 23, "")}</button>\n                        </div>\n                    </div>`,
                                window.selectors.getHeaderButtonsChat()) {
                                    var s = window.selectors.getHeaderButtonsChat()
                                      , r = s.childNodes[0];
                                    if (s && r) {
                                        let t = document.createElement("div");
                                        t.id = "card_tags_chat",
                                        t.innerHTML = `\n                            <div class="card_cores_chat_${e.split("@")[0]}" style="display: flex">\n                                ${m}\n                            </div>`,
                                        s.insertBefore(t, r),
                                        s.insertBefore(p, r)
                                    }
                                    wacore.staff.renderUsers()
                                }
                                wacore.function.addAssinatura(),
                                $("#quick-chat-panel").remove();
                                let g = c.getElementsByTagName("footer")[0].children[0];
                                var i = g.parentNode;
                                let h = document.createElement("div");
                                if (h.id = "quick-chat-panel",
                                h.innerHTML = '<span class="add-message-tag"/>',
                                i.insertBefore(h, g),
                                window.wacore.crm.fav_msgs)
                                    for (var l = 0; l < window.wacore.crm.fav_msgs.length; l++)
                                        window.wacore.crm.fav_msgs[l].username == wacore.user.variables.username && window.wacore.modules.favoriteAdd(window.wacore.crm.fav_msgs[l]);
                                window.wacore.gpt.functions.managePanelGPT("ativa" == window.localStorage.getItem("wapp:gpt")),
                                await new Promise((e=>setTimeout(e, 5))),
                                window.wacore.function.forceScrollBotton()
                            }
                        }
                    } catch (e) {}
                },
                addAssinatura: function() {
                    try {
                        if (window.selectors.getFooterPanelChat()) {
                            let t = window.selectors.getFooterPanelChat().children[0].children[0]
                              , a = document.createElement("div");
                            a.className = "msgsProntas",
                            a.style.cssText = "margin-left: 10px; margin-right: 8px;",
                            a.innerHTML = `\n                <div class="dropdown" title="" data-translate-key="messagesAndScripts"> \n                    <div role="button" id="dropdown_msgpronta" data-bs-toggle="dropdown" aria-expanded="false" onclick="window.wacore.modules.msgpronta_lista()" data-bs-auto-close="outside">\n                        ${window.wacore.svgs.fav_messages(20, 20, "")}\n                    </div>\n                    <div class="dropdown-menu dropdown-mwhats p-3" style="width:500px !important; overflow-x: hidden;overflow-y: scroll;height: 400px;">\n                        <h5 class="d-flex justify-content-between align-items-center mb-3">\n                            <span class="text-mutted" data-translate-keys="clickToSend"></span>\n                            <span class="badge btn-primary rounded-pill" role="button" onclick="window.wacore.modules.openMessages()" data-translate-key="toAdd"></span>\n                        </h5>\n                        <div class="list-group w-auto" id="list-msgsprontas"></div>\n                    </div>\n                </div>\n                `,
                            t.appendChild(a);
                            let n = document.createElement("div");
                            n.className = "msgsProntas",
                            n.style.cssText = "margin-left: 10px; margin-right: 8px;",
                            n.innerHTML = ` \n                <div title="" data-translate-key="editDisplayName" role="button" class="" onclick="window.wacore.user.functions.changeUserName()">\n                    ${window.wacore.svgs.edit_name(20, 20, "")}\n                </div>\n                `,
                            t.appendChild(n);
                            let o = document.createElement("div");
                            o.className = "assinaturaBtn",
                            window.localStorage.getItem("wapp:assinatura") ? "ativa" == window.localStorage.getItem("wapp:assinatura") ? o.innerHTML = `\n                        <div title="" data-translate-key="displayMessageName(Active)" class="btncheckassinatura" data-status="ativa" aria-label="Retirar assinatura">\n                            ${window.wacore.svgs.togle_on(24, 24, "color: var(--button-primary-background)")}\n                        </div>` : o.innerHTML = `\n                        <div title="" data-translate-key="displayMessageName(Inactive)" class="btncheckassinatura" data-status="inativa" aria-label="Incluir assinatura">\n                            ${window.wacore.svgs.togle_off(24, 24, "")}\n                        </div>` : (window.localStorage.setItem("wapp:assinatura", "ativa"),
                            o.innerHTML = `\n                    <div title="" data-translate-key="displayMessageName(Active)" class="btncheckassinatura" data-status="ativa" aria-label="Retirar assinatura">\n                        ${window.wacore.svgs.togle_on(24, 24, "color: var(--button-primary-background)")}\n                    </div>`),
                            t.appendChild(o),
                            document.querySelector(".btncheckassinatura").addEventListener("click", (()=>{
                                let e = event.target.getAttribute("data-status");
                                e && ("ativa" == e && (window.localStorage.setItem("wapp:assinatura", "inativa"),
                                event.target.innerHTML = window.wacore.svgs.togle_off(24, 24, ""),
                                event.target.setAttribute("data-status", "inativa")),
                                "inativa" == e && (window.localStorage.setItem("wapp:assinatura", "ativa"),
                                event.target.innerHTML = window.wacore.svgs.togle_on(24, 24, "color: var(--button-primary-background)"),
                                event.target.setAttribute("data-status", "ativa")))
                            }
                            ));
                            var e = document.createElement("div");
                            e.className = "iaBtn",
                            window.localStorage.getItem("wapp:gpt") ? "ativa" == window.localStorage.getItem("wapp:gpt") ? e.innerHTML = `\n                        <div title="" data-translate-key="copilot(Active)"  class="btncheckgpt" data-status="ativa" aria-label="Desativar ${window.infoWl.name} Copilot">\n                            ${window.wacore.svgs.openIa(24, 24, "color: var(--button-primary-background)")}\n                        </div>` : e.innerHTML = `\n                        <div title="" data-translate-key="copilot(Inactve)" class="btncheckgpt" data-status="inativa" aria-label="Ativar ${window.infoWl.name} Copilot">\n                            ${window.wacore.svgs.openIa(24, 24, "")}\n                        </div>` : (window.localStorage.setItem("wapp:gpt", "ativa"),
                            e.innerHTML = `\n                    <div title="" data-translate-key="copilot(Active)"  class="btncheckgpt" data-status="ativa" aria-label="Desativar ${window.infoWl.name} Copilot">\n                        ${window.wacore.svgs.openIa(24, 24, "color: var(--button-primary-background)")}\n                    </div>`),
                            t.appendChild(e),
                            document.querySelector(".btncheckgpt").addEventListener("click", (()=>{
                                let e = event.target.getAttribute("data-status");
                                e && ("ativa" == e && (window.localStorage.setItem("wapp:gpt", "inativa"),
                                event.target.innerHTML = window.wacore.svgs.openIa(24, 24, ""),
                                event.target.setAttribute("data-status", "inativa"),
                                event.target.setAttribute("data-translate-key", "copilot(Inactive)"),
                                window.wacore.gpt.functions.managePanelGPT(!1)),
                                "inativa" == e && (window.localStorage.setItem("wapp:gpt", "ativa"),
                                event.target.innerHTML = window.wacore.svgs.openIa(24, 24, "color: var(--button-primary-background)"),
                                event.target.setAttribute("data-translate-key", "copilot(Active)"),
                                event.target.setAttribute("data-status", "ativa"),
                                window.wacore.gpt.functions.managePanelGPT(!0)),
                                window.wacore.format_translation.translateText())
                            }
                            )),
                            [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip-buttons"]')).forEach((function(e) {
                                new bootstrap.Tooltip(e)
                            }
                            ))
                        }
                    } catch (e) {}
                },
                insertButtonsLeft: function() {
                    var e = window.selectors.getConversationPanel();
                    let t = document.createElement("div");
                    t.classList.add("btns_msgs_container");
                    var a = Object.values(window.wacore.scheduller.variables.jobs).filter((function(e) {
                        return e.chatId === window.wacore.activeChat && ("WAITING" == e.status || "ERROR" == e.status)
                    }
                    ));
                    let n = `<span title="" data-translate-key="appointmentsWaitingOrWithError"  class="badge-scheduller-rounded">${a.length}</span>`
                      , o = `\n        <div class="fab-container">\n            <div title="" data-translate-key="messageScheduling"  class="fab shadow"">\n                <div class="fab-content">\n                    <span>${window.wacore.svgs.schedulled_message(24, 24, "")}</span>\n                    ${n}\n                </div>\n            </div>\n            <div title="" data-translate-key="createSchedule" class="sub-button" onClick="wacore.scheduller.modals.newSchedduller('chat'); window.wacore.format_translation.translateText()">\n                <span >${window.wacore.svgs.plus(30, 30, "color:var(--panel-header-icon)")}</span>\n            </div>\n            <div title="" data-translate-key="openAppointmentCenter"  class="sub-button" onclick="wacore.scheduller.modals.showGridSchedullers()">\n                <span>${window.wacore.svgs.calendar_search(30, 30, "color:var(--panel-header-icon)")}</span>\n                ${n}\n            </div>\n        </div>`;
                    t.innerHTML = o,
                    e.appendChild(t),
                    window.wacore.format_translation.translateText(),
                    0 == a.length ? $(".badge-scheduller-rounded").hide() : $(".badge-scheduller-rounded").show(),
                    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip-msgs"]')).forEach((function(e) {
                        new bootstrap.Tooltip(e)
                    }
                    ))
                },
                receber_transferencia: async function(e) {
                    const t = await Swal.fire({
                        title: '<strong data-translate-key="receiveCare"></strong>',
                        html: `<p> <span data-translate-key="service"></span>  + ${window.wacore.function.setMask("+" + e.number.split("@")[0])} + <span data-translate-key="transferredBy"></span> + ${e.usuariosend}   </p>`,
                        icon: "warning",
                        showCancelButton: !0,
                        showDenyButton: !0,
                        denyButtonText: '<span data-translate-key="accepted"></span>',
                        denyButtonColor: "#1fb796",
                        confirmButtonText: '<span data-translate-key="acceptedAndOpen"></span>',
                        cancelButtonText: '<span data-translate-key="refuse"></span>',
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    });
                    t.isConfirmed && (Swal.fire({
                        title: '<strong data-translate-key="transferredService"></strong>',
                        html: '<span data-translate-key="messageServiceTransferred"></span>',
                        icon: "success",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    wacore.fetch.requestAssignCard({
                        card: e.number,
                        user: wacore.user.variables.username,
                        name: wacore.user.variables.name
                    }),
                    wacore.function.newChat(e.number)),
                    t.isDenied && (Swal.fire({
                        title: '<strong data-translate-key="transferredService"></strong>',
                        html: '<span data-translate-key="messageServiceTransferred"></span>',
                        icon: "success",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    wacore.fetch.requestAssignCard({
                        card: e.number,
                        user: wacore.user.variables.username,
                        name: wacore.user.variables.name
                    })),
                    t.dismiss && (t.dismiss,
                    Swal.DismissReason.cancel,
                    Swal.fire({
                        title: '<strong data-translate-key="canceled"></strong>',
                        html: '<span data-translate-key="serviceRefused"></span>',
                        icon: "error",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }))
                },
                transferir_atendimento: async function(e, t) {
                    if ((await Swal.fire({
                        icon: "warning",
                        title: '<strong data-translate-key="transferService"></strong>',
                        text: `<p> <span data-translate-key="messageTransferService"></span> <span>${t}</span> </p>`,
                        confirmButtonText: '<span data-translate-key="transfer"</span>',
                        showCancelButton: !0,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    })).isConfirmed) {
                        let a = wacore.activeChat;
                        wacore.fetch.requestTransferir({
                            card: a,
                            user: e,
                            name: t,
                            usuariosend: wacore.user.variables.name
                        }),
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: '<strong data-translate-key="messageAcceptService"></strong>',
                            showConfirmButton: !1,
                            timer: 2e3,
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        })
                    }
                },
                finalizar_atendimento: async function() {
                    let e = wacore.activeChat
                      , t = !1;
                    var a = wacore.crm.getCard(e);
                    a && a.crmlist && (t = !0);
                    const {value: n} = await Swal.fire({
                        icon: "question",
                        html: `<h2 class="text-align: center" data-translate-key="endService"></h2>\n            <div style="border: 1px solid #d7d7d7;padding: 15px 8px; border-radius: 15px; background-color: #f5f5f5;">\n                <div style="float: left; text-align: left; width: 365px; padding-top: 5px;padding-bottom: 13px;padding-left: 39px; ">  \n                    <div class="form-check mb-1">\n                        <input class="form-check-input" type="checkbox" value="" id="finalizar-arquivar" checked>\n                        <label class="form-check-label" for="finalizar-arquivar" data-translate-key="archiveConversationAfterFinishingTheService">\n                        </label>\n                    </div>\n                    ${t ? ' \n                    <div class="form-check">\n                        <input class="form-check-input" type="checkbox" value="" id="finalizar-encerrar">\n                        <label class="form-check-label" for="finalizar-encerrar" data-translate-key="closeCardAfterCompletingTheService">\n                        </label>\n                    </div>\n                    ' : ""}\n                    <div class="form-check mb-1">\n                        <input class="form-check-input" type="checkbox" value="" id="finalizar-enviarmsg" >\n                        <label class="form-check-label" for="finalizar-enviarmsg" data-translate-key="sendMessageInforming">\n                        </label>\n                    </div>\n                </div>\n            <div>\n            <textarea aria-label="Digite uma mensagem de finalização..." class="swal2-textarea" placeholder="" data-translate-key="enderAClosingMessage"  id="finalizar-mensagem" style="display: block;width: 365px;background-color: #FFF;" ></textarea>\n            </div>\n            </div>`,
                        footer: '<center data-translate-key="messageInformingFooter"></center>',
                        focusConfirm: !1,
                        confirmButtonText: '<span data-translate-key="finish"></span>',
                        showCancelButton: !0,
                        preConfirm: ()=>({
                            enviarmsg: document.getElementById("finalizar-enviarmsg")?.checked,
                            arquivar: document.getElementById("finalizar-arquivar")?.checked,
                            encerrar: document.getElementById("finalizar-encerrar")?.checked,
                            mensagem: document.getElementById("finalizar-mensagem")?.value
                        })
                    });
                    if (n) {
                        if (wacore.user.variables.status && n.mensagem && n.mensagem.length > 1 && n.enviarmsg && wacore.user.variables.status && (await window.wacore.whatsapp.getChat(e)).sendMessage("*Atendimento concluido*\n" + n.mensagem + "\n\nPor " + wacore.user.variables.name),
                        n.encerrar && wacore.user.variables.status && wacore.fetch.requestRemoveCardList({
                            number: e.split("@")[0]
                        }),
                        n.arquivar && wacore.user.variables.status) {
                            let t = await window.wacore.whatsapp.getChat(e);
                            t.archive || t.setArchive(!0)
                        }
                        setTimeout((function() {
                            wacore.fetch.requestFinalizarAtendimento({
                                card: e
                            })
                        }
                        ), 500)
                    }
                },
                c_url: function(e) {
                    return e.replace(/(((https?:\/\/)|(www\.))[^\s]+)/g, (function(e, t, a) {
                        return '<a href="' + ("www." == a ? "http://" + e : e) + '" target="_blank" style="color:blue;">' + e + "</a>"
                    }
                    ))
                },
                timeStampToTime: function(e) {
                    var t = new Date(1e3 * e);
                    return t.getHours() + ":" + ("0" + t.getMinutes()).substr(-2)
                },
                removeBlockMenu: function() {
                    try {
                        document.querySelectorAll(".blocked-item").forEach((e=>{
                            e.classList.remove("blocked-item")
                        }
                        ))
                    } catch (e) {}
                }
            },
            window.wacore.errors = function(e, t) {
                "positionCards" == e && window.location.reload()
            }
        }
        ,
        872: ()=>{
            window.wacore.gpt = {},
            window.wacore.gpt.reactiveGpt = null,
            window.wacore.gpt.reactiveGptSugestion = null,
            window.wacore.gpt.variables = {
                processing: !1,
                processingSugestion: !1,
                processingTranscrition: !1,
                messagesProcesseds: [],
                keyOpenAi: "",
                keyOpenAiActive: !1
            },
            window.wacore.gpt.callbacks = {
                respInsufficientFunds: function(e) {
                    e.error && "user" === e.currentUser && "insufficient_quota" === e.type && (Swal.fire({
                        title: '<strong data-translate-key="insufficientFunds"></strong>',
                        html: '<p data-translate-key="messageInsufficientFunds"></p>',
                        icon: "error",
                        footer: '<a href="https://openai.com/" target="_blank" style="text-decoration: none;">Open Ai</a>',
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    window.wacore.gpt.functions.setGptLoading(!1),
                    window.wacore.gpt.variables.processingTranscrition = !1),
                    e.error && "revenda" === e.currentUser && "insufficient_quota" === e.type && (Swal.fire({
                        title: '<strong data-translate-key="titleRequestFailed"></strong>',
                        html: '<p data-translate-key="unableProcessYourRequest"></p>',
                        icon: "error",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    window.wacore.gpt.functions.setGptLoading(!1),
                    window.wacore.gpt.variables.processingTranscrition = !1),
                    e.error && "user" === e.currentUser && "invalid_api_key" === e.code && (Swal.fire({
                        title: '<strong data-translate-key="invalidKeyApi"></strong>',
                        html: '<p data-translate-key="messageInvalidKeyApi"></p>',
                        icon: "error",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    window.wacore.gpt.functions.setGptLoading(!1),
                    window.wacore.gpt.variables.processingTranscrition = !1),
                    e.error && "revenda" === e.currentUser && "invalid_api_key" === e.code && (Swal.fire({
                        title: '<strong data-translate-key="titleRequestFailed"></strong>',
                        html: '<p data-translate-key="unableProcessYourRequest"></p>',
                        icon: "error",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    window.wacore.gpt.functions.setGptLoading(!1),
                    window.wacore.gpt.variables.processingTranscrition = !1)
                },
                respAudioTranscription: function(e) {
                    var t = document.getElementById(`audio-id-${e.msgId}`);
                    if (this.respInsufficientFunds(e),
                    e.audioText && !e.error) {
                        var a;
                        if (a = e.chatId.includes("@g.us") && e.msgId.includes("false_") ? document.querySelector(`[data-id="${e.msgId}"] > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3)`) : document.querySelector(`[data-id="${e.msgId}"] > div > div > div > div > div:nth-child(2)`)) {
                            var n = a.parentNode
                              , o = document.createElement("div");
                            o.innerHTML = `\n                <div class="transcription-msg">\n                    <div>\n                        <div class="transcription-msg-header">\n                            <span style="display: inline-flex;">${window.wacore.svgs.audioTranscription(16, 16, "margin-top: 3px;margin-right: 5px;")} <span data-translate-key="transcription"></span></span>\n                        </div>\n                    <div class="transcription-msg-text selectable-text copyable-text"><span>${e.audioText}</span></div>\n                </div>`,
                            n.insertBefore(o, a),
                            window.wacore.format_translation.translateText()
                        }
                        t && (t.hidden = !0)
                    } else
                        t && t.remove();
                    window.wacore.gpt.variables.processingTranscrition = !1
                },
                respSimpleAskFromImput: function(e) {
                    this.respInsufficientFunds(e),
                    e.finalImput && !e.error && (window.wacore.gpt.functions.changeImputText(e.finalImput),
                    window.wacore.gpt.functions.setGptLoading(!1)),
                    null != window.wacore.gpt.reactiveGpt && clearTimeout(window.wacore.gpt.reactiveGpt),
                    window.wacore.gpt.variables.processing = !1,
                    window.wacore.gpt.reactiveGpt = null
                },
                respGptSugestion: function(e) {
                    this.respInsufficientFunds(e),
                    "ativa" == window.localStorage.getItem("wapp:gpt") && "ativa" == window.localStorage.getItem("wapp:gptsugest") && (e.sugestion && wacore.activeChat && e.chatId == wacore.activeChat && !e.error ? (document.querySelector(".area-sugestions-gpt").innerHTML = `\n            <div style="margin: 5px;">\n                <span style="display: flex;position: relative;font-size: x-small;left: -6px;border-radius: 4px;padding: 0px 4px 0px 10px;color: var(--primary);margin-bottom: 5px;">${window.wacore.svgs.openIa(16, 16, "margin-right: 5px;")} Sugestão ${window.infoWl.name} Copilot</span>\n                <div\n                class="alert alert-primary d-flex align-items-center"  role="alert" style="padding: 5px;cursor: pointer;" onClick="window.wacore.gpt.functions.setSugestionToImput()">\n                    <div id="text-sugestion" style="font-size: small;">\n                        ${e.sugestion}\n                    </div>\n                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" style="margin-left: auto;" onClick="window.wacore.gpt.functions.hideGptSugestion()"></button>\n                </div>\n            </div>`,
                    $("#gpt-sugestions").show(),
                    window.wacore.function.forceScrollBotton()) : window.wacore.gpt.functions.hideGptSugestion(),
                    null != window.wacore.gpt.reactiveGptSugestion && clearTimeout(window.wacore.gpt.reactiveGptSugestion),
                    window.wacore.gpt.variables.processingSugestion = !1,
                    window.wacore.gpt.reactiveGptSugestion = null)
                }
            },
            window.wacore.gpt.requests = {
                setKeyApiOpenAi: function() {
                    if ("" !== document.getElementById("input-key-api").value) {
                        const e = {
                            sitechannel: wacore.sitechannel,
                            key: document.getElementById("input-key-api").value
                        };
                        wacore.request.api_post("setKeyApiOpenAi", "gpt/set-key-openai", e, !0, wacore.user.variables.cookie)
                    }
                },
                requestGptAudioTranscription: function(e) {
                    if (!window.wacore.gpt.variables.processingTranscrition) {
                        var t = {
                            msg: {
                                mediaKey: e.mediaKey,
                                filehash: e.filehash,
                                mimetype: e.mimetype,
                                type: e.type,
                                size: e.size,
                                deprecatedMms3Url: e.deprecatedMms3Url,
                                clientUrl: e.clientUrl,
                                msgId: e.id._serialized,
                                sitechannel: wacore.sitechannel
                            },
                            chatId: wacore.activeChat
                        };
                        window.wacore.gpt.variables.processingTranscrition = !0,
                        wacore.request.api_post("audioTranscription", "gpt/audio-transcription", t, !0, wacore.user.variables.cookie)
                    }
                },
                requestGptSugestion: function(e) {
                    if (!window.wacore.gpt.variables.processingSugestion) {
                        var t = Store.Chat._models.filter((e=>e.id._serialized == wacore.activeChat))[0].msgs._models.filter((e=>"chat" == e.__x_type && e.body && e.body.length > 5)).map((e=>({
                            role: e.id.fromMe ? "assistant" : "user",
                            content: e.body
                        })));
                        window.wacore.gpt.variables.processingSugestion = !0,
                        window.wacore.gpt.functions.setGptThinking();
                        var a = {
                            sitechannel: wacore.sitechannel,
                            chatId: wacore.activeChat,
                            historic: t
                        };
                        wacore.request.api_post("getGptSugestion", "gpt/sugestion", a, !0, wacore.user.variables.cookie),
                        e && window.wacore.gpt.variables.messagesProcesseds.push(e),
                        window.wacore.gpt.reactiveGptSugestion = setTimeout((()=>{
                            window.wacore.gpt.variables.processingSugestion = !1
                        }
                        ), 4e4)
                    }
                },
                requestGptSimpleAskImput: function(e) {
                    if (document.querySelector("#btnmaketraslate").setAttribute("aria-expanded", "false"),
                    !window.wacore.gpt.variables.processing) {
                        var t = window.selectors.getChatImputText()?.innerText ?? ""
                          , a = window.getSelection().toString().trim()
                          , n = ""
                          , o = "";
                        if (0 != t.trim().length) {
                            window.wacore.gpt.variables.processing = !0,
                            a.length > 0 && t.includes(a) ? (n = a,
                            o = t.replace(a, "(val-to-replace)")) : (n = t,
                            o = "");
                            var s = {
                                sitechannel: wacore.sitechannel,
                                type: e,
                                prompt: n,
                                imputval: o
                            };
                            wacore.request.api_post("simpleAskFromImput", "gpt/simple-ask", s, !0, wacore.user.variables.cookie),
                            window.wacore.gpt.functions.setGptLoading(!0),
                            window.wacore.gpt.reactiveGpt = setTimeout((()=>{
                                Swal.fire({
                                    position: "top-end",
                                    icon: "error",
                                    title: '<strong data-translate-key="copilotTimeout"></strong>',
                                    showConfirmButton: !1,
                                    timer: 2e3,
                                    didOpen: ()=>{
                                        window.wacore.format_translation.translateText()
                                    }
                                }),
                                window.wacore.gpt.variables.processing = !1,
                                window.wacore.gpt.functions.setGptLoading(!1)
                            }
                            ), 4e4)
                        }
                    }
                }
            },
            window.wacore.gpt.modals = {
                showInsertApiKeyOpenAi: function() {
                    Swal.fire({
                        title: '<strong data-translate-key="apiKeyOpenAiConfiguration"></strong>',
                        html: `<b data-translate-key="enterYouurOpenAiApiKey"></b>\n            <input type="text" id="input-key-api" class="swal2-input" placeholder="" data-translate-key="pasteYourKeyHere" style="width:80%" value=${window.wacore.gpt.variables.keyOpenAi}>\n            <br>`,
                        showCloseButton: !0,
                        showCancelButton: !1,
                        showConfirmButton: !0,
                        confirmButtonText: '<span data-translate-key="toRecord"></span>',
                        focusConfirm: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((e=>{
                        e.isConfirmed && window.wacore.gpt.requests.setKeyApiOpenAi()
                    }
                    ))
                },
                showHelp: function() {
                    Swal.fire({
                        title: `<strong> ${window.infoWl.name} Copilot</strong>`,
                        html: '<h5 data-translate-key="howCanThisHelpMeTitle"></h5>\n                <span data-translate-key="helpMeMessage"></span><br><br>\n                <h5 data-translate-key="howToUseTitle"></h5>\n                <span data-translate-key="howToUseSubtitle"><br>\n                </span><br>\n                <p data-translate-key="messageHowToUseOne"></p>.\n                <p data-translate-key="messageHowToUseTwo"></p> <br>\n                <h5 data-translate-key="whatEachOfTheTitleFeaturesIsForTitle"></h5>\n                <span style="display: grid;text-align: start;margin-left: 50px;">\n                    <ul>\n                        <li data-translate-key="messageSuggest"></li>\n                        <li data-translate-key="messageSearch"></li>\n                        <li data-translate-key="spellingMessage"></li>\n                        <li data-translate-key="messageTranslatePt"></li>\n                        <li data-translate-key="messageTranslateEn"></li>\n                        <li data-translate-key="messageTranslateEs"></li>\n                        <li data-translate-key="messageSummarize"></li>\n                        <li data-translate-key="messageEnlarge"></li>\n                        <li data-translate-key="clearMessage"></li>\n                        <li data-translate-key="friendlyMessage"></li>\n                        <li data-translate-key="formalMessage"></li>\n                        <li data-translate-key="directMessage"></li>\n                    </ul>\n                </span>',
                        showCloseButton: !0,
                        showCancelButton: !1,
                        showConfirmButton: !1,
                        width: 800
                    })
                }
            },
            window.wacore.gpt.functions = {
                audioTranscription: function(e) {
                    var t = Store.Msg._models.find((t=>t.id._serialized == e))
                      , a = document.getElementById(`audio-id-${e}`);
                    t && a && (a.childNodes[0].childNodes[0].innerHTML = window.wacore.svgs.loading(20, 20),
                    window.wacore.gpt.requests.requestGptAudioTranscription(t))
                },
                setGptThinking: function() {
                    document.querySelector(".area-sugestions-gpt") && (document.querySelector(".area-sugestions-gpt").innerHTML = ` <div style="margin: 5px;">\n            <span style="display: flex;position: relative;font-size: x-small;left: -6px;border-radius: 4px;padding: 0px 4px 0px 10px;color: var(--primary);margin-bottom: 5px;">${window.wacore.svgs.openIa(16, 16, "margin-right: 5px;")} Pensando ${window.wacore.svgs.loading(20, 20, "margin-left: 5px;")}</span>\n            </div>`),
                    $("#gpt-sugestions").show(),
                    window.wacore.function.forceScrollBotton()
                },
                setSugestionToImput: function(e) {
                    var t = document.getElementById("text-sugestion").innerText;
                    window.wacore.gpt.functions.hideGptSugestion(),
                    t && window.wacore.gpt.functions.changeImputText(t)
                },
                hideGptSugestion: function() {
                    $("#gpt-sugestions").hide(),
                    document.querySelector(".area-sugestions-gpt") && (document.querySelector(".area-sugestions-gpt").innerHTML = ""),
                    window.wacore.gpt.variables.processingSugestion = !1
                },
                tryShowGptSugestion: function() {
                    if (wacore.activeChat && Store.Chat._models && 0 != Store.Chat._models.length && !window.wacore.gpt.variables.processingSugestion && "ativa" == window.localStorage.getItem("wapp:gpt") && "ativa" == window.localStorage.getItem("wapp:gptsugest") && !document.getElementById("text-sugestion")) {
                        var e = Store.Chat._models.filter((e=>e.id._serialized == wacore.activeChat))[0].msgs._models.length
                          , t = Store.Chat._models.filter((e=>e.id._serialized == wacore.activeChat))[0].msgs._models[e - 1];
                        !t || t.id.fromMe || "chat" != t.type || !t.body || t.body.length < 5 || window.wacore.gpt.variables.messagesProcesseds.includes(t.id._serialized) || window.wacore.gpt.requests.requestGptSugestion(t.id._serialized)
                    }
                },
                setGptLoading: function(e) {
                    var t = window.selectors.getChatImputText()
                      , a = document.querySelectorAll(".btn-gpt");
                    if (0 == e) {
                        t.style.opacity = "1",
                        t.setAttribute("contenteditable", "true"),
                        $("#gpt-sugestions").hide();
                        for (var n = 0; n < a.length; n++)
                            a[n].style.cursor = "pointer",
                            a[n].style.opacity = "1"
                    } else
                        for (t.style.opacity = "0.5",
                        t.setAttribute("contenteditable", "false"),
                        window.wacore.gpt.functions.setGptThinking(),
                        n = 0; n < a.length; n++)
                            a[n].style.cursor = "default",
                            a[n].style.opacity = "0.5"
                },
                changeImputText: async function(e) {
                    var t, a, n = window.selectors.getChatImputText();
                    window.getSelection && document.createRange ? ((a = document.createRange()).selectNodeContents(n),
                    (t = window.getSelection()).removeAllRanges(),
                    t.addRange(a)) : document.body.createTextRange && ((a = document.body.createTextRange()).moveToElementText(n),
                    a.select()),
                    await n.dispatchEvent(new InputEvent("beforeinput",{
                        inputType: "insertText",
                        data: e,
                        bubbles: !0,
                        cancelable: !0
                    }))
                },
                makeTranslate: async function() {
                    document.getElementById("btnmakeTranslate")
                },
                managePanelGPT: async function(e) {
                    if ($("#gpt-panel").remove(),
                    $("#gpt-sugestions").remove(),
                    window.wacore.gpt.variables.processing = !1,
                    window.wacore.gpt.variables.processingSugestion = !1,
                    window.wacore.gpt.reactiveGpt = null,
                    e && window.wacore.config.hasConfiguredTokenOpenAI) {
                        let e = main.getElementsByTagName("footer")[0].children[1];
                        var t = e.parentNode;
                        let g = document.createElement("div")
                          , h = document.createElement("div");
                        g.id = "gpt-panel",
                        h.id = "gpt-sugestions",
                        g.innerHTML = '<span class="btns-gpt"></span>',
                        h.innerHTML = '<span class="area-sugestions-gpt"></span>',
                        t.insertBefore(g, e),
                        t.insertBefore(h, e),
                        $("#gpt-sugestions").hide();
                        var a = document.querySelector(".btns-gpt")
                          , n = document.createElement("label")
                          , o = document.createElement("label")
                          , s = document.createElement("label")
                          , r = document.createElement("label")
                          , i = document.createElement("label")
                          , l = document.createElement("label")
                          , c = document.createElement("label")
                          , d = document.createElement("label")
                          , m = document.createElement("label")
                          , u = document.createElement("label")
                          , w = document.createElement("label");
                        n.className = "btn-gpt-help",
                        o.className = "btn-gpt-sugest",
                        s.className = "btn-gpt",
                        r.className = "btn-gpt",
                        i.className = "btn-gpt",
                        l.className = "btn-gpt",
                        c.className = "btn-gpt",
                        d.className = "btn-gpt",
                        m.className = "btn-gpt",
                        u.className = "btn-gpt",
                        w.className = "btn-gpt",
                        window.localStorage.getItem("wapp:gptsugest") || window.localStorage.setItem("wapp:gptsugest", "false");
                        var p = "autoSuggestAnswers(Inactive)";
                        "ativa" == window.localStorage.getItem("wapp:gptsugest") && (p = "autoSuggestAnswers(Active)"),
                        n.innerHTML = `<span title="" data-translate-key="help" onclick="window.wacore.gpt.modals.showHelp(); window.wacore.format_translation.translateText();">${window.wacore.svgs.help(15, 15, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-help")}</span>`,
                        o.innerHTML = `\n            <span title="" data-translate-key=${p} class="container" id="toggleSuggestion">\n            <input checked="checked" type="checkbox" id="check-sugestion">\n            <div class="checkmark"></div>\n            <span data-translate-key="suggest"></span></span>`,
                        s.innerHTML = `<span title="" data-translate-key="freeSearch" onclick="wacore.gpt.requests.requestGptSimpleAskImput('search')">${window.wacore.svgs.search(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-search")} <span data-translate-key="toLookFor"></span></span>`,
                        r.innerHTML = `<span class="dropdown">\n            <span id="btnmaketraslate" title="" data-translate-key="textTranslation" data-bs-toggle="dropdown" type="button" aria-expanded="false">${window.wacore.svgs.translate(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-translate")} <span data-translate-key="translate"></span></span>\n                <ul class="dropdown-menu my-drop-down"> \n                    <li title="" data-translate-key="translateThisTextIntoPortuguese" role="button" class="dropdown-item my-dropdown-item" onclick="wacore.gpt.requests.requestGptSimpleAskImput('translate-ptbr')">Português (Brasil)</li>\n                    <li title="" data-translate-key="translateThisTextIntoEnglish" role="button" class="dropdown-item my-dropdown-item" onclick="wacore.gpt.requests.requestGptSimpleAskImput('translate-en')">Inglês</li>\n                    <li title="" data-translate-key="translateThisTextIntoSpanish" role="button" class="dropdown-item my-dropdown-item" onclick="wacore.gpt.requests.requestGptSimpleAskImput('translate-es')">Espanhol</li>\n                </ul>\n            </span>`,
                        i.innerHTML = `<span title="" data-translate-key="makeYourTextMoreSummarized" onclick="wacore.gpt.requests.requestGptSimpleAskImput('small')">${window.wacore.svgs.reduzir(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-small")} <span data-translate-key="sumUp"></span></span>`,
                        l.innerHTML = `<span title="" data-translate-key="makeYourTextBigger" onclick="wacore.gpt.requests.requestGptSimpleAskImput('bigger')">${window.wacore.svgs.ampliar(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-bigger")} <span data-translate-key="enlarge"></span></span>`,
                        c.innerHTML = `<span title="" data-translate-key="makeYourTextClearer" onclick="wacore.gpt.requests.requestGptSimpleAskImput('clarify')">${window.wacore.svgs.lampada(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-clarify")} <span data-translate-key="ofCourse"></span></span>`,
                        d.innerHTML = `<span title="" data-translate-key="makeYourTextMoreUserFriendly" onclick="wacore.gpt.requests.requestGptSimpleAskImput('friendly')">${window.wacore.svgs.heart(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-friendly")}<span data-translate-key="friendly"></span></span>`,
                        m.innerHTML = `<span title="" data-translate-key="makeYourTextMoreFormal" onclick="wacore.gpt.requests.requestGptSimpleAskImput('formal')">${window.wacore.svgs.formal(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-formal")} <span data-translate-key="formal"></span></span>`,
                        u.innerHTML = `<span title="" data-translate-key="makeYourTextMoreDirect" onclick="wacore.gpt.requests.requestGptSimpleAskImput('direct')">${window.wacore.svgs.target(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-direct")} <span data-translate-key="direct"></span></span>`,
                        w.innerHTML = `<span title="" data-translate-key="correctSpellingError" onclick="wacore.gpt.requests.requestGptSimpleAskImput('ortografy')">${window.wacore.svgs.magic_pencil(20, 20, "display: inline;margin-top: -3px;margin-right: 3px;", "btn-gpt-ortografy")}<span data-translate-key="orthography"></span></span>`,
                        a.parentNode.insertBefore(n, a),
                        a.parentNode.insertBefore(o, a),
                        a.parentNode.insertBefore(s, a),
                        a.parentNode.insertBefore(w, a),
                        a.parentNode.insertBefore(r, a),
                        a.parentNode.insertBefore(i, a),
                        a.parentNode.insertBefore(l, a),
                        a.parentNode.insertBefore(c, a),
                        a.parentNode.insertBefore(d, a),
                        a.parentNode.insertBefore(m, a),
                        a.parentNode.insertBefore(u, a),
                        document.getElementById("check-sugestion").checked = "ativa" == window.localStorage.getItem("wapp:gptsugest"),
                        document.getElementById("toggleSuggestion").addEventListener("click", (()=>{
                            const e = document.getElementById("check-sugestion");
                            e && (e.checked ? (window.localStorage.setItem("wapp:gptsugest", "inativa"),
                            this.title = "",
                            e.checked = !1) : (window.localStorage.setItem("wapp:gptsugest", "ativa"),
                            this.title = "",
                            e.checked = !0,
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: '<strong data-translate-key="copilotAutoSuggestModeActived"></strong>',
                                showConfirmButton: !1,
                                timer: 2e3
                            }))),
                            window.wacore.format_translation.translateText(),
                            window.wacore.gpt.functions.hideGptSugestion()
                        }
                        ))
                    }
                }
            }
        }
        ,
        811: ()=>{
            window.wacore.html = {
                oldHtmlEditUser: function() {
                    return '\n    <div class="modal fade" id="editaruser" tabindex="-1" aria-labelledby="editaruser" aria-hidden="true">\n      <div class="modal-dialog modal-dialog-centered">\n        <div class="modal-content">\n          <div class="modal-header">\n            <h5 class="modal-title" id="editaruser">Editar usuário</h5>\n            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n          </div>\n          <div class="modal-body">\n            <div>\n              <form action="" pg="form_editaruser" method="POST" style="border-radius: 15px;">\n                <input type="hidden" class="form-control" id="useredit_channel">\n                <div class="p-2">\n                  <div class="form-floating mb-1">\n                    <input type="text" class="form-control" id="useredit_username" placeholder="email@email.com" required=""  disabled>\n                    <label for="floatingInput">Email</label>\n                  </div>\n                </div>\n                <div class="p-2">\n                  <div class="form-floating mb-1">\n                    <input type="text" class="form-control" id="useredit_name"  required="" value="">\n                    <label for="floatingInput">Nome do usuário</label>\n                  </div>\n                </div>\n                <div class="p-2">\n                  <select class="form-select"  id="useredit_admin">\n                    <option value="true">Administrador</option>\n                    <option value="false">Apenas usuário do CRM</option>\n                  </select>\n                </div>\n                <div class="d-grid gap-2 list-buttons mt-2">\n                  <button class="btn btn-primary btn-lg" type="submit" id="bt-submit-login">Salvar <i class=\'bx bx-save\' ></i></button>\n                </div>\n              </form>\n              <div class="mt-3"> \n                <div class="alert alert-info d-flex align-items-center" role="alert">\n                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">\n                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>\n                  </svg>\n                <div>\n                <span>O usuário <b>Administrador</b>, terá acesso as informações de dashboard e edição de outros usuários.<span>\n              </div>\n            </div>\n            <div>\n              <hr>\n              <div id="removeUser">\n                <div class="btn btn-danger" style="">\n                  <i class="bx bx-trash"></i> Remover usuário\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>'
                },
                getHtmlMenuLeft: function() {
                    return `\n    <div class="main-todo" id="canva-referencia-tela"> \n    <div class="flex-column flex-shrink-0 text-white bg-mw-sidebar sidebar-top-detail" id="menu-l01"><div class="d-flex align-items-center"><div class="fs-4 text-center action-expand logo-mw-recolhe" style="background-image: url('${window.infoWl.logoMenuUrl}')"></div></div><div style="        display: flex;        align-items: center;        justify-content: center;        padding-left: 10px;        padding-right: 10px;        padding-top: 5px;        padding-bottom: 5px;        margin-bottom: 5px;        margin-top: 3px;      "><div class="bandeira" style="              width: 30px;              height: 16px;              background-size: cover;              cursor: pointer;              border-radius: 6px;            " onclick="window.wacore.format_translation.showFlags()"></div></div><div class="opcoes-bandeira"style="        display: none;        width: 140px;        margin-left: 10px;        background-color: #ccc;        z-index: 999;        position: absolute;        top: 56px;        left: 50px;        background: rgba( 12, 19, 24, 0.35 );        backdrop-filter: blur( 20px );        -webkit-backdrop-filter: blur( 20px );        border-radius: 2px;        border: 1px solid rgba( 255, 255, 255, 0.18 );"><div class="nav nav-pills flex-column mb-auto scrollarea" id="v-pills-tab-list" role="tablist" aria-orientation="vertical" style=""><div class="utrak-link menu-tooltip activeTab active" id="v-pills-whatsapp-button" data-translate-key="conversations" title="" data-bs-toggle="pill" data-bs-target="#v-pills-connect" type="button" role="tab" aria-controls="v-pills-connect" aria-selected="false" onclick="window.wacore.crm.openwhatsapp(); window.wacore.crm.updateListFilter()" data-title="whatsappweb"><div class="server invite invite-active">${window.wacore.svgs.chat(30, 30, "")} </div> <span id="chat-unread-count" style="margin-top: 42px;" data-translate-key="unreadMessageExceptArchive" title=""></span></div><div class="utrak-link menu-tooltip btnattr" id="v-pills-crm-tab" data-translate-key="crmMode" title="" onclick="window.wacore.crm.opencrm()" data-title="crm"> <button class="server invite" id="btn-crm" disabled>${window.wacore.svgs.kanban(25, 25, "margin-bottom:6px")} </button></div></div>
</div>`
                },
                getHtmlFormWhatsapp: function() {
                    return '\n      <div class="tab-pane withMenusIcons fade show active" id="v-pills-connect" role="tabpanel" aria-labelledby="v-pills-whatsapp-button" style="padding-top:0px;height: 100vh;overflow-x: hidden;overflow-y: hidden; z-index: 0;"></div>\n    '
                },
                getHtmlSheduller: function() {
                    return `\n    <div class="tab-pane withMenusIcons" id="v-pills-agendamento" role="tabpanel" aria-labelledby="v-pills-agendamento-tab" style="padding-top:0px;height: 100vh;overflow-x: hidden;overflow-y: hidden;">\n      <div class="container mt-4">\n        <div id="calendar"></div>\n      </div>\n      <div class="fabs" role="button" onclick="wacore.scheduller.modals.newSchedduller('calendar')" style="z-index: 1;"> \n        <div class="action"> \n          <i class="fas fa-plus" id="add">${window.wacore.svgs.plus(35, 35, "")}</i>\n        </div>\n      </div>\n    </div>`
                },
                getHtmlBot: function() {
                    return '\n    <div class="tab-pane withMenusIcons" id="v-pills-bot" role="tabpanel" aria-labelledby="v-pills-bot-tab" style="padding-top:0px;height: 100vh;overflow-x: hidden;overflow-y: hidden;">\n      <div class="container mt-3">\n        <div class="row">\n          <div class="col-md-12">\n            <div class="card">\n              <div class="card-header" style="margin-top: auto;">\n                <h3 class="gray">Olá mundo</h3>\n              </div>\n              <div class="card-body">\n                <div id="chatbot-flow"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    '
                },
                getHtmlApi: function() {
                    return `\n    <div class="tab-pane withMenusIcons" id="v-pills-api" role="tabpanel" aria-labelledby="v-pills-api-tab" style="padding-top:0px;height: 100vh;overflow-x: hidden;overflow-y: hidden;">\n      <div class="container mt-3">\n        <div class="row">\n          <div class="col-md-12">\n            <div class="card">\n              <div class="card-header" style="margin-top: auto;">\n                <div class="input-group mb-3">\n                  <div class="api-detail-header" style="padding: 5px;">\n                    <div>\n                      <b class="gray" data-translate-key="apiResources"></b>\n                      <a class="btn" style="border-color: #127a12;border-width: 2px;background: #a6ffae3b;margin-left: 63px;" href="${window.infoWl.apiUrl}/doc" target="_blank"><span data-translate-key="seeDocumentation"></span></a>\n                      <a title="" data-translate-key="configWebhook" class="btn" style="border-color: #127a12;border-width: 2px;background: #a6ffae3b;" onClick="window.wacore.webhook.modals.showWebHookConfig()">${window.wacore.svgs.webhook(20, 20, "", "")}</a>\n                      <br>\n                      <div class="resources-api" data-translate-key="apiResourceTextsChecks">\n                      </div>\n                      <div style="width: 100%;padding-top:5px">\n                        <b class="gray"a data-translate-key="yourTokenForAcessingApiResources"></b>\n                        <div class="input-group" style="margin-top:5px;">\n                          <input class="form-control k-input text-box single-line" type="text" disabled id="btn-token-api" style="height:50px" value="${window.wacore.api.variables.tokenApi}">\n                          <span id="btn-copy-token" class="input-group-addon btn btn-primary" style="min-width:50px;display: flex;justify-content: center; align-items: center;" onClick="window.wacore.api.functions.copyToken()">${window.wacore.svgs.copy(24, 24, "")}</span>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div class="form-floating" style="margin-right: 10px;margin-top: auto;margin-left: 10px;margin-bottom:5px">\n                    <b class="gray" data-translate-key="filterBySituation"></b>\n                    <select class="form-select mt-2 form-modify" id="input_sit_log_api" style="max-height:50px;">\n                      <option value="all" data-translate-key="all">\n                      </option>\n                      <option selected value="unprocessed" data-translate-key="unprocessed">\n                      </option>\n                      <option value="error" data-translate-key="processedWithError">\n                      </option>\n                      <option value="success" data-translate-key="successfullyProcessed">\n                      </option>\n                    </select>\n                  </div>\n                  <div class="form-floating" style="margin-right: 6px;margin-top: auto;margin-bottom:5px;">\n                    <b class="gray" data-translate-key="filterBytype"></b>\n                    <select class="form-select mt-2 form-modify" id="input_type_log_api" style="max-height:50px;">\n                      <option selected value="all" data-translate-key="allTypes"></option>\n                      <option value="TEXT" data-translate-key="texting"></option>\n                      <option value="MEDIA" data-translate-key="mediaUpload"></option>\n                      <option value="CHECK_NUMBER" data-translate-key="checkNumber"></option>\n                      <option value="CHECK_CHANNEL" data-translate-key="checkChannel"></option>\n                      <option value="DECRIPT_MEDIA" data-translate-key="mediaDecryption"></option>\n                      <option value="GET_CHATS" data-translate-key="searchChatList"></option>\n                      <option value="GET_CHAT" data-translate-key="searchChatData"></option>\n                      <option value="GET_MESSAGES" data-translate-key="searchChatMessages"></option>\n                      <option value="WEBHOOK_NOTIFICATION" data-translate-key="webhookNotification"></option>\n                    </select>\n                  </div>\n                  <div style="display: grid;">\n                    <button title="" data-translate-key="bulkActions" class="input-group-addon btn btn-primary" id="btn-api-logs-actions" disabled onClick="window.wacore.api.modals.showActions()" style="min-width: 100px;height: calc(3.5rem + 2px);line-height: 1.25;max-height:50px;margin-bottom:5px;display:flex;padding-top: 13px;background-color: #ffb744 !important;color:black;font-weight: 600;">&#160;&#160;\n                    <span data-translate-key="actions"></span>\n                    ${window.wacore.svgs.flash(30, 30, "margin-left: 5px;margin-top: -3px;")}</button>\n                    <span title="" data-translate-key="title-filter" class="input-group-addon btn btn-primary" onClick="window.wacore.api.requests.getLogsApi()" style="min-width: 100px;margin-top: auto;height: calc(3.5rem + 2px);line-height: 1.25;max-height:50px;margin-bottom:5px;display:flex;padding-top: 13px;">&#160;&#160;<span data-translate-key="filter";></span>${window.wacore.svgs.search(30, 30, "margin-left: 5px;margin-top: -3px;")}</span>\n                  </div>\n                </div>\n              </div>\n              <div class="card-body">\n                <div id="grid-logs-api"></div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>`
                },
                getFormModules: function() {
                    return '\n    <div class="tab-pane withMenusIcons" id="v-pills-modulos" role="tabpanel" aria-labelledby="v-pills-modulos" style="padding-top:0px;height: 100vh;overflow-x: hidden;overflow: auto;">\n      <div class="container mt-4">\n        <div class="row" id="lista_modulos"></div>   \n      </div>\n    </div>'
                },
                getHtmlMetrics: function() {
                    return '\n    <div class="tab-pane withMenusIcons" id="v-pills-metrics" role="tabpanel" aria-labelledby="v-pills-metrics-tab" style="padding-top:0px;height: 100vh;overflow-x: hidden;overflow-y: hidden;">\n      \x3c!-- metricas --\x3e\n      <div class="card container mt-5" style="max-width: 75%;">\n        <div class="card-body p-3">\n          <div class="ms-2 mb-4 mt-1 h5"><i class="bx bxs-bar-chart-alt-2"></i> <span data-translate-key="metricsOfTheMonth"></span> \n            <div class="imput" style="display: inline-block;" id="changeMetricis"></div>\n          </div>\n\n          <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">\n            <li class="nav-item" role="presentation">\n              <button class="nav-link active" id="dash-atendimentos-tab" data-bs-toggle="pill" data-bs-target="#dash-atendimentos" type="button" role="tab" aria-controls="dash-atendimentos" aria-selected="true">\n              <div class="icon icon-shape-metrics icon-xxs shadow border-radius-sm bg-gradient-metrics text-center"><i class=\'bx bx-chat\'></i>\n              </div> <span data-translate-key="attendances"></span> </button>\n            </li>\n            <li class="nav-item" role="presentation">\n              <button class="nav-link" id="dash-crm-tab" data-bs-toggle="pill" data-bs-target="#dash-crm" type="button" role="tab" aria-controls="dash-crm" aria-selected="false"><div class="icon icon-shape-metrics icon-xxs shadow border-radius-sm bg-gradient-metrics text-center"> <i class=\'bx bx-desktop\'></i></div> <span data-translate-key="crmBusinessFlow"></span></button>\n            </li>\n          </ul>\n\n          <div class="tab-content" id="pills-tabContent">\n            \x3c!-- atendimentos --\x3e\n            <div class="tab-pane fade show active" id="dash-atendimentos" role="tabpanel" aria-labelledby="dash-atendimentos-tab" tabindex="0">\n              \x3c!-- metricas atendimentos --\x3e\n              <div>\n                <div class="border-radius-lg py-3 pe-1 mb-3">\n                  <div class="chart chart-atm">\n                    <canvas id="chart-bars-atm" class="chart-canvas chart-style" height="170"></canvas>\n                  </div>\n                </div>\n                <div class="container border-radius-lg">\n                  <div class="row">\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-primary text-center me-2 d-flex align-items-center justify-content-center chart-legend"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="attendances"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_atm_atendimentos chart-legend">0</h4>\n                    </div>\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-info text-center me-2 d-flex align-items-center justify-content-center chart-legend"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="finalized">Finalizados</p>\n                      </div>\n                      <h4 class="font-weight-bolder count_atm_finalizados chart-legend">0</h4>\n                    </div>\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-warning text-center me-2 d-flex align-items-center justify-content-center chart-legend"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="opened"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_atm_emaberto chart-legend">0</h4>\n                    </div>\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-danger text-center me-2 d-flex align-items-center justify-content-center chart-legend"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="averageTimePerService"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_atm_tempomedio chart-legend">00:00:00</h4>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          \n            \x3c!-- crm --\x3e\n            <div class="tab-pane fade" id="dash-crm" role="tabpanel" aria-labelledby="dash-crm-tab" tabindex="0">\n              \x3c!-- metricas crm --\x3e\n              <div>\n                <div class="border-radius-lg py-3 pe-1 mb-3">\n                  <div class="chart chat-crm">\n                    <canvas id="chart-bars-crm" class="chart-canvas chart-style" height="212" width="569" style="display: block; box-sizing: border-box; height: 169.6px; width: 455.2px;"></canvas>\n                  </div>\n                </div>\n                <div class="container border-radius-lg">\n                  <div class="row">\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-warning text-center me-2 d-flex align-items-center justify-content-center chart-legend"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="businessStarted"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_crm_negociosiniciados chart-legend">0</h4>\n                    </div>\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-primary text-center me-2 d-flex align-items-center justify-content-center"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="earnings"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_crm_ganhosqtd chart-legend">0 </h4>\n                    </div>\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-info text-center me-2 d-flex align-items-center justify-content-center"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="lost"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_crm_percasqtd chart-legend">0</h4>\n                    </div>\n                    <div class="col-3 py-3 ps-0">\n                      <div class="d-flex mb-2">\n                        <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-danger text-center me-2 d-flex align-items-center justify-content-center"></div>\n                        <p class="text-xs mt-1 mb-0 font-weight-bold chart-legend" data-translate-key="averageDurationPerDeal"></p>\n                      </div>\n                      <h4 class="font-weight-bolder count_crm_tempomedio chart-legend">00:00:00</h4>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          \n            <div class="tab-pane fade" id="dash-conversas" role="tabpanel" aria-labelledby="dash-conversas-tab" tabindex="0">\n              \x3c!-- metricas usuários --\x3e\n              usuários\n            </div>\n          </div>\n        </div>\n      </div>\n      \x3c!-- fim métricas --\x3e\n    </div>'
                },
                getHtmlFormCampaign: function() {
                    return '\n    <div class="tab-pane withMenusIcons" id="v-pills-disparomassa" role="tabpanel" aria-labelledby="v-pills-disparomassa-tab" style="padding-top:0px;height: 100vh;">\n      <div class="container mt-3">\n        <div class="row">\n          <div class="col-md-12">\n            <div class="card">\n              <div class="card-body p-0">\n                <div>\n                  <div class="row">\n                    <div class="col-md-4 p-4" style="background-color: #f1f1f1;border-right: 10px solid #e7e7e7; border-top-left-radius: var(--bs-card-border-radius);border-bottom-left-radius: var(--bs-card-border-radius);">\n                      <div class="mb-2">\n                        <button class="btn btn-primary btn-lg" type="button" id="btn-voltar-fontes" onclick="window.wacore.disparomassa.verfontes();" disabled="true" style="float: right;display: inline-block;margin-top: -2px;padding: 2px 8px;font-size: 1.1rem;"><span data-translate-key="toGoBack"></span></button> \n                        <h5 class="pb-2" style="display: inline-block;" ><span data-translate-key="selectContacts"></span></h5>\n                      </div>\n                      <div id="lista_fontes">\n                        <div class="list-group">\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'contatos\')" data-translate-key="selectByContacts"></a>    \n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'grupos\')" data-translate-key="selectContactsFromGroups"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'listascrm\')" data-translate-key="selectByListCrm"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'tags\')" data-translate-key="selectByTags"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'atendentes\')" data-translate-key="selectByAttendants"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'naolidas\')" data-translate-key="selectForUnread"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'paragrupos\')" data-translate-key="selectForGroups"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'csv\'); window.wacore.format_translation.translateText();" data-translate-key="importFromCsv"></a>\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'avulso\');  window.wacore.format_translation.translateText();" data-translate-key="typeSingle"></a>\n                        </div>\n                        <h5 class="pt-4 pb-2" data-translate-key="historic"></h5>\n                        <div class="list-group">\n                          <a href="#" class="list-group-item list-group-item-action" onclick="window.wacore.disparomassa.fontesdecontatos(\'listas-banco\')" data-translate-key="listOfCreatedShots"></a> \n                        </div>  \n                      </div>\n                      <div id="lista_resultado_fontes">\n                        <div id="dm_selectform"></div>\n                        <div id="dm_selecionarcontatos" class="mt-2"></div>\n                      </div>\n                    </div>\n                \n                    <div class="col-md-4 p-4">\n                      <h5 class="pb-2"><span data-translate-key="selectedContacts"></span> (<span class="count_cttSelecionados">0</span>)</h5>\n                      <ul class="list-group dm_contatos" style="overflow: scroll;height: 80vh;position: relative;">\n                        <div id="info_select_dm" style="position: absolute;top: 35%;left: 35%;">\n                          <center><svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="m10.978 14.999v3.251c0 .412-.335.75-.752.75-.188 0-.375-.071-.518-.206-1.775-1.685-4.945-4.692-6.396-6.069-.2-.189-.312-.452-.312-.725 0-.274.112-.536.312-.725 1.451-1.377 4.621-4.385 6.396-6.068.143-.136.33-.207.518-.207.417 0 .752.337.752.75v3.251h9.02c.531 0 1.002.47 1.002 1v3.998c0 .53-.471 1-1.002 1z" fill-rule="nonzero"></path></svg> <p data-translate-key="selectTheContacts"></p></center>    \n                        </div>\n                      </ul>\n                    </div>\n                \n                    <div class="col-md-4 p-4">\n                      <h5 class="pb-2" data-translate-key="prepareTransmission"></h5>\n                      <div class="alert alert-warning mb-3" role="alert">\n                        <p class="pb-0 mb-0" style="font-size: 0.8rem;" data-translate-key="informativeMessageTransmission"></p>\n                        <div class="form-check pt-3">\n                          <input class="form-check-input" type="checkbox" value="" id="input_dm_termosdeuso">\n                          <label class="form-check-label" for="input_dm_termosdeuso" data-translate-key="accept"></label>\n                        </div>\n                      </div>\n                      <div class="input-group mb-3">\n                        <div class="form-floating">\n                          <select class="form-select" id="input_dm_intervalo">\n                            <option selected data-translate-key="select"></option>\n                            <option value="5a10" data-translate-key="fiveToTen"></option>\n                            <option value="10a15" data-translate-key="tenToFifteen"></option>\n                            <option value="15a20" data-translate-key="fifteenToTwenty"></option>\n                            <option value="1a5" data-translate-key="oneToFive"></option>\n                          </select>\n                          <label for="floatingSelect" data-translate-key="secondIntervalPerMessageSent"></label>\n                        </div>\n                      </div>\n                      <div class="input-group mb-3">\n                        <div class="form-floating">\n                          <select class="form-select" id="input_dm_pausarenvio">\n                            <option selected data-translate-key="select"></option>\n                            <option value="5" data-translate-key="fiveMessageSend"></option>\n                            <option value="10" data-translate-key="tenMessageSend"></option>\n                            <option value="20" data-translate-key="twentyMessageSend"></option>\n                            <option value="40" data-translate-key="fortyMessageSend"></option>\n                            <option value="80" data-translate-key="eightyMessageSend"></option>\n                          </select>\n                          <label for="floatingSelect" data-translate-key="pauseSendEvery"></label>\n                        </div>\n                      </div>\n                      <div class="input-group mb-3">\n                        <div class="form-floating">\n                          <select class="form-select" id="input_dm_voltaraenviar">\n                            <option selected data-translate-key="select"></option>\n                            <option value="60" data-translate-key="oneMinute"></option>\n                            <option value="300" data-translate-key="fiveMinutes"></option>\n                            <option value="900" data-translate-key="fifteenMinutes"></option>\n                            <option value="1500" data-translate-key="twentyFiveMinutes"></option>\n                            <option value="30" data-translate-key="thirtySeconds"></option>\n                          </select>\n                          <label for="floatingSelect" data-translate-key="resendWith"></label>\n                        </div>\n                      </div>\n                      <div class="input-group mb-3">\n                        <div class="form-floating">\n                          <select class="form-select" id="input_dm_selecionarmensagem" onchange="window.wacore.disparomassa.parametros(\'input_dm_selecionarmensagem\')">\n                            <option selected data-translate-key="select"></option>\n                            <optgroup label="" data-translate-key="readyMessages" id="dm_lista_msgsprontas"></optgroup>\n                            <optgroup label="" data-translate-key="scripts" id="dm_lista_scripts"></optgroup>\n                            <optgroup label="" data-translate-key="create">\n                              <option value="Selecione" data-translate-key="createMessageOrScript"></option>\n                            </optgroup>\n                          </select>\n                          <label for="floatingSelect" data-translate-key="message"></label>\n                        </div>\n                      </div>\n                      <div class="mt-4">\n                        <div class="d-grid gap-2">\n                          <button class="btn btn-primary btn-lg" type="button" id="dm_btn_prosseguir" onclick="window.wacore.disparomassa.painel(\'start\');" data-translate-key="proceed"></button>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>'
                },
                getHtmlModalCampaign: function() {
                    return '\n    <div class="modal fade" id="modal_disparomassa" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">\n      <div class="modal-dialog modal-dialog-centered">\n        <div class="modal-content">\n          <div class="modal-header">\n            <h5 class="modal-title" data-translate-key="createBroadcast"></h5>\n            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n          </div>\n          <div class="modal-body">\n            <div class="row">\n              <div class="col-12">\n                <form action="" pg="form_criartransmissao" method="POST">\n                  <div class="mb-3">\n                      <label for="dm_criar_titulo" class="form-label" data-translate-key="titleForReference"></label>\n                      <input type="text" class="form-control" id="dm_criar_titulo" required>\n                      <div class="form-text" data-translate-key="titleToSearchAdnRetrieveTheBroadcastLater"></div>\n                  </div>\n                  <div class="mb-3 form-check">\n                      <input type="checkbox" class="form-check-input" id="naospam">\n                      <label class="form-check-label" for="naospam" data-translate-key="iWillNotSpam"></label>\n                  </div>\n                  <div class="mb-3 form-check">\n                    <input type="checkbox" class="form-check-input" id="salvarlista" checked>\n                    <label class="form-check-label" for="salvarlista" data-translate-key="saveList"></label>\n                  </div>\n                  <div class="d-grid gap-2 border-top mt-3">\n                    <button class="btn btn-primary btn-lg" type="submit" id="btn_criareiniciardm" data-translate-key="createAndStartStreaming"></button>\n                  </div>\n                </form>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>'
                },
                getHtmlModalPlans: function() {
                    return `\n  <div class="modal fade" id="plans" tabindex="-1" aria-labelledby="plans-channel" aria-hidden="true">\n    <div class="modal-dialog  modal-xl modal-dialog-scrollable">\n      <div class="modal-content" style="width: 100%; height:100%; font-size: 0.85rem;overflow:overlay" >\n        <div class="modal-body">\n          <div class="container" style="margin-top: 20px;">\n            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="float:right"></button>\n            <div class="row">\n              \n              <div class="col-md-4" style="padding-left: 0px;"> \n                <div class="alert alert-success mb-3" role="alert">\n                  <h4 class="alert-heading" data-translate-key="planBasic"></h4>\n                  <p data-translate-key="contentForWhomPlans"></p>\n                  <p data-translate-key="contentMessagePlanBasic"></p>\n                </div>\n                <div class="alert alert-success mb-3" role="alert">\n                  <h4 class="alert-heading" data-translate-key="premiumPlan"></h4>\n                  <p data-translate-key="contentForWhomPlans"></p>\n                  <p data-translate-key="contentMessagePlanPremium"></p>\n                </div>\n              </div>\n                  \n              <div class="col-md-4"> \n                <div class="card mb-4">\n                  <div class="card-header" style="background-color: #137862;">\n                    <h4 class="my-0 font-weight-normal" style="color: white;display:flex;letter-spacing: 1.5px;">${window.wacore.svgs.module_basic(24, 24, "margin-right: 5px;margin-top: 4px;")} <span data-translate-key="basic"></span></h4>\n                  </div>\n                  <div class="card-body" style="padding-left: 13px;">\n                    <ol class="list-group mt-3 mb-4" style="overflow-x: hidden;overflow-y: scroll;height: 38rem; width: 19.5rem;">\n                      <li class="list-group-item"><span data-translate-key="chatGptIntegration" class="text-price-block"></span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="api" class="text-price-block"></span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="webhook" class="text-price-block"></span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="multipleUsers" class="text-price-block"></span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="loginWithPassword" class="text-price-block"> </span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="transferBetweenAttendants" class="text-price-block"> </span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="chatBetweenAttendants" class="text-price-block"></span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span data-translate-key="showHiddenMessages" class="text-price-block"></span> ${window.wacore.svgs.red_block}</li>\n                      <li class="list-group-item"><span  data-translate-key="massShooting" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="modeCrm" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="unlimitedTabsAndList" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="cannedMessagesAndScripts" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="scheduleMessageAndReminders" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="metrics" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="hashtagTransfer" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="unlimitedFilters" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                    </ol>\n                    <div class="alert alert-info mt-2 mb-2" role="alert" data-translate-key="planBasicInformationMessage">\n                    </div>\n                    <div class="d-grid gap-2">\n                      <button class="btn btn-primary" type="button" onclick="window.wacore.function.assinar()" data-translate-key="toSign"></button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n  \n              <div class="col-md-4">\n                <div class="card mb-4">\n                  <div class="card-header" style="background-color: #137862;">\n                    <h4 class="my-0 font-weight-normal" style="color: white;display:flex;letter-spacing: 1.5px;">${window.wacore.svgs.module_premium(24, 24, "margin-right: 5px;margin-top: 4px;")} Premium</h4>\n                  </div>\n                  <div class="card-body" style="padding-left: 13px;">\n                    <ol class="list-group mt-3 mb-4" style="overflow-x: hidden;overflow-y: scroll;height: 38rem; width: 19.5rem;">\n                      <li class="list-group-item"><span  data-translate-key="chatGptIntegration" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span  data-translate-key="api" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="webhook" class="text-price-allow"> </span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="multipleUsers" class="text-price-allow"> </span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="loginWithPassword" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="transferBetweenAttendants" class="text-price-allow"> </span>${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="chatBetweenAttendants" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="showHiddenMessages" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="massShooting" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="modeCrm" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span  data-translate-key="unlimitedTabsAndList" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="cannedMessagesAndScripts" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="scheduleMessageAndReminders" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="metrics" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="hashtagTransfer" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                      <li class="list-group-item"><span data-translate-key="unlimitedFilters" class="text-price-allow"></span> ${window.wacore.svgs.green_check}</li>\n                    </ol>\n                    <div class="alert alert-info mt-2 mb-2" role="alert" data-translate-key="planPremiumInformationMessage"> </div>\n                    <div class="d-grid gap-2">\n                      <button class="btn btn-primary" type="button" onclick="window.wacore.function.assinar()" data-translate-key="toSign"></button>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>`
                },
                getHtmlModalInternalChat: function() {
                    return '\n  <div class="offcanvas offcanvas-end chat-body" tabindex="-1" id="chatinterno" aria-labelledby="users-list">\n    <div class="offcanvas-header  bg-mw-sidebar-right">\n      <div id="users-list"></div>\n      <div class="close-panel-editar" role="button"  data-bs-dismiss="offcanvas" aria-label="Close">\n        <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" fill-rule="nonzero"/></svg>\n      </div>\n    </div>\n    <div class="offcanvas-body bg-chat-top chat-content" id="scroll-body">\n      <div class="p-2">\n        <div class="messages-container" tabindex="0" id="panel-messages-container" style="user-select: text;"></div>\n        <div class="chat-finished" id="chat-finished"></div>\n      </div>\n    </div>\n    <div class="offcanvas-footer">\n      <div class="chat-footer">\n        <textarea class="form-control input-staff" id="input-staff-text" rows="1" data-translate-key="talkToYourTeam" placeholder="" style="display: block;"></textarea>\n        <div class="btn btn-secondary btn-icon send-icon rounded-circle text-light mb-1 input-staff-btn" role="button">\n            <svg class="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>\n        </div>\n      </div>\n    </div>\n  </div>'
                },
                getHtmlModalModule: function() {
                    return '\n    <div class="offcanvas offcanvas-end" tabindex="-1" id="modulo_page" aria-labelledby="modulo_titulo" style="min-width: 800px;">\n      <div class="offcanvas-header bg-mw-sidebar-right">\n        <div id="modulo_titulo"></div>\n        <div class="close-panel-editar" role="button"  data-bs-dismiss="offcanvas" aria-label="Close">\n          <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" fill-rule="nonzero"/></svg>\n        </div>\n      </div>\n      <div class="offcanvas-body" id="modulo_body"></div>\n      <div class="offcanvas-footer" id="modulo_footer"></div>\n    </div>'
                },
                getHtmlModalScheduller: function() {
                    return `\n    <div class="modal fade" id="viewdate" aria-labelledby="viewdate-channel" aria-hidden="true">\n      <div class="modal-dialog modal-dialog-centered modal-xl">\n        <div class="modal-content">\n          <div class="modal-header">\n            <h5 class="modal-title" id="viewdate-titulo" data-translate-key="schedulingCenter"></h5>\n            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>\n          </div>\n        <div style="padding: 5px;padding-right: 17px;display:inline-flex;">\n          <div style="margin-right: 10px;margin-top: auto;margin-left: auto;margin-bottom:5px;width:250px">\n            <b class="gray" data-translate-key="filterBySituation"></b>\n            <select class="form-select mt-2 form-modify" id="input_sit_scheduller" style="max-height:50px;">\n              <option value="ALL" data-translate-key="all"></option>\n              <option value="WAITING" data-translate-key="scheduled"></option>\n              <option selected value="WAITING_ERROR" data-translate-key="scheduledOrInError"></option>\n              <option value="SUCCESS" data-translate-key="successfullyExecuted"></option>\n              <option value="ERROR" data-translate-key="executedWithError"></option>\n              <option value="CANCELED" data-translate-key="canceled"></option>\n            </select>\n          </div>\n          <div style="margin-right: 6px;margin-top: auto;margin-bottom:5px;width:200px;">\n            <b class="gray" data-translate-key="filterBytype"></b>\n            <select class="form-select mt-2 form-modify" id="input_type_scheduller" style="max-height:50px;">\n              <option selected value="ALL" data-translate-key="all"></option>\n              <option value="SEND_TEXT" data-translate-key="MESSAGE"></option>\n              <option value="REMINDER" data-translate-key="REMINDER"></option>\n            </select>\n          </div>\n          <span title="" data-translate-key="filter"  class="input-group-addon btn btn-primary" onClick="wacore.scheduller.modals.refreshGridSheduller()" style="min-width: 100px;margin-top: auto;height: calc(3.5rem + 2px);line-height: 1.25;max-height:50px;margin-bottom:5px;display:flex;padding-top: 13px;">&#160;&#160; <span data-translate-key="filter"></span> ${window.wacore.svgs.search(30, 30, "margin-left: 5px;margin-top: -3px;")}</span>\n          </div>\n        <div class="modal-body" id="body_agendamento">\n      </div>\n    </div>`
                },
                template: function() {
                    var e = document.createElement("body");
                    e.setAttribute("class", "insert"),
                    e.innerHTML = `\n\n${window.wacore.html.getHtmlMenuLeft()}\n\n<div\n  class="flex-column flex-shrink-0 bg-light tab-content  widthMenus"   id="menu-leftContent"\n  style="display: flex">\n\n  \x3c!-- FORM WHATSAPP --\x3e\n  ${window.wacore.html.getHtmlFormWhatsapp()}    \n\n  \x3c!-- FORM CAMPAIGN --\x3e\n  ${window.wacore.html.getHtmlFormCampaign()}\n\n  \x3c!-- FORM METRICS --\x3e\n  ${window.wacore.html.getHtmlMetrics()}\n\n  \x3c!-- FORM SCHEDULLER --\x3e\n  ${window.wacore.html.getHtmlSheduller()}\n\n  \x3c!-- MODAL API --\x3e\n  ${window.wacore.html.getHtmlApi()}\n\n  \x3c!-- FORM MODULES --\x3e\n  ${window.wacore.html.getFormModules()}\n</div>\n\n\${window.wacore.html.getHtmlModalScheduller()}\n\n`;
                    var t = document.getElementById("app");
                    t.style.maxWidth = "100%",
                    t.style.left = "inherit",
                    document.body.insertBefore(e, document.body.lastChild),
                    document.getElementById("v-pills-connect").appendChild(document.querySelector("#app")),
                    window.wacore.html.changeDimension(),
                    window.wacore.html.activeTabEvent()
                },
                contacts: function() {
                    return '\n      <div style="overflow-y: scroll; \tmax-width: 1500px; margin: 0;">\n      <div>\n      <header>\n          <div class="container">\n              <div class="header-container mt-4 mb-3">\n                  <h1 class="h4">jQuery contacts list</h1>\n                  <div class="extra-buttons text-right">\n                      <button id="reset-sort" class="btn btn-sm btn-ligth" style="display: none;"><span class="fas fa-sync fa-sm mr-2"></span>Reset sort order</button>\n                  </div>\n                  <div class="relative text-right">\n                      <input name="search" id="search" class="" type="search" placeholder="Search a contact ...">\n                      <span id="search-reset" class="fas fa-times inactive" style="display: none;"></span>\n                  </div>\n              </div>\n          </div>\n      </header>\n      <main>\n          <section class="container">\n              <div class="table">\n                  <div class="table-header table-row relative bg-primary text-light mb-1">\n                      <div class="text-center table-cell">\n                          <h3 id="id-header" class="h6 sort-by"><span class="d-none mr-1 fas fa-caret-up fa-sm"></span>ID</h3>\n                      </div>\n                      <div class=" table-cell">\n                          <h3 id="firstname-header" class="h6 sort-by"><span class="d-none mr-1 fas fa-caret-up fa-sm"></span>First name</h3>\n                      </div>\n                      <div class=" table-cell">\n                          <h3 id="lastname-header" class="h6 sort-by"><span class="d-none mr-1 fas fa-caret-up fa-sm"></span>Last name</h3>\n                      </div>\n                      <div class=" table-cell">\n                          <h3 id="email-header" class="h6 sort-by"><span class="d-none mr-1 fas fa-caret-up fa-sm"></span>Email</h3>\n                      </div>\n                      <div class=" table-cell">\n                          <h3 id="phone-header" class="h6 sort-by"><span class="d-none mr-1 fas fa-caret-up fa-sm"></span>Phone</h3>\n                      </div>\n                      <div class=" table-cell">\n                          <h3 id="address-header" class="h6 sort-by"><span class="d-none mr-1 fas fa-caret-up fa-sm"></span>Address</h3>\n                      </div>\n                      <div class="text-right table-cell contact-actions">\n                          <button id="csv-show" class="btn btn-sm btn-default"><i class="fas fa-download mr-2"></i>CSV</button>\n                      </div>\n                  </div>\n                  <div id="contacts-list" class="">\n\n                  </div>\n              </div>\n              <section id="overlay" style="display: none;">\n                  <div class="container">\n                      <div id="csv-container" style="display: none;">\n                          <h2>Export csv</h2>\n                          <p>This is the CSV version of the contacts database. It syncs with your contacts database every time you open the popup.</p>\n                          <textarea id="csv-output"></textarea>\n                          <div class="mt-3">\n                              <button id="csv-cancel" class="btn btn-dark">Back to contacts list</button>\n                              <button id="csv-copy" class="btn btn-success">Copy CSV to clipboard</button>\n                          </div>\n                      </div>\n                  </div>\n              </section>\n          </section>\n\n      </main>\n  </div>\n  <section id="form-wrapper" class="">\n      <div class="container relative">\n          <form id="form-new-contact" action="" method="" class="table-row mt-3 mb-3">\n              <div class="text-center"><span class="fas fa-user-plus fa-sm mb-2"></span></div>\n              <div class="">\n                  <label for="first-name">First name: *</label>\n                  <input name="first-name" id="first-name" class="form-control form-control" type="text" value="John" placeholder="First name" required>\n              </div>\n              <div class="">\n                  <label for="last-name">Last name: *</label>\n                  <input name="last-name" id="last-name" class="form-control form-control" type="text" value="Doe" placeholder="Last name" required>\n              </div>\n              <div class="">\n                  <label for="email">Email: *</label>\n                  <input name="email" id="email" class="form-control form-control" type="email" value="john@doe.com" placeholder="Email" required>\n              </div>\n              <div class="">\n                  <label for="phone">Phone: *</label>\n                  <input name="phone" id="phone" class="form-control form-control" type="tel" value="111-555-8989" placeholder="Phone" required>\n              </div>\n              <div class="">\n                  <label for="address">Address: <small>(optional)</small></label>\n                  <input name="address" id="address" class="form-control form-control" type="text" value="" placeholder="Address">\n              </div>\n              <div class="">\n                  <button id="add-contact" type="" class="btn btn btn-danger fas fa-plus-circle"></button>\n              </div>\n          </form>\n      </div>\n  </section>\n  </div>'
                },
                navtop: function() {
                    let e = document.createElement("div");
                    if (e.id = "nova-conversa",
                    e.innerHTML = `\n    <div style="display: flex; justify-content:space-between; width: auto">\n    <button title="" data-translate-key="messagesAndScriptsReady" type="button" class="btn-newchatbtn" onclick="window.wacore.modules.openMessages()" style="display: inline-block">${window.wacore.svgs.fav_messages(22, 22, "")}</button>\n    <button title="" data-translate-key="startConversation" type="button" class="btn-newchatbtn" onclick="window.wacore.function.startNewChat()" style="display: inline-block">${window.wacore.svgs.new_chat(22, 22, "")}</button>\n    <div>`,
                    window.selectors.getHeaderButtonsLeftMain()) {
                        var t = window.selectors.getHeaderButtonsLeftMain().childNodes[0]
                          , a = t.childNodes[0];
                        t.insertBefore(e, a)
                    }
                    var n = document.createElement("div");
                    n.className = "top-nav",
                    n.innerHTML = `\n      <div style="border-radius: 10px;padding: 3px 5px;right:5px; display:flex;position:absolute;"> \n        <button title="" data-translate-key="chatBetweenAttendants" role="button" onclick="window.wacore.function.chatInterno()" style="display: inline-block; color: var(--primary);">\n          ${window.wacore.svgs.users_chat(20, 20, "")}  \n          <span id="chat-interno-count"></span>\n        </button>   \n\n        <button title="" data-translate-key="notifications" role="button" onclick="window.wacore.function.notifications(); window.wacore.format_translation.translateText()" style="display: flex; margin-left: 15px;color: var(--primary); align-items: inherit; justify-content: inherit;">\n          ${window.wacore.svgs.notification(20, 20, "margin-top: 5px;")} \n          <span id="notificacoes-count" ></span>\n        </button>\n\n        ${window.infoWl.helpUrl ? `<button title="" role="button" data-translate-key="knowledgeBase" onclick="window.wacore.function.openHelp()" style="display: flex; margin-left: 15px;color: var(--button-primary-background); align-items: inherit; justify-content: inherit;">\n          ${window.wacore.svgs.bookSquare(20, 20, "margin-top: 5px;")}\n        </button>` : ""}\n\n        ${window.infoWl.changelogUrl ? `<button title="" data-translate-key="changeLogs" role="button" onclick="window.wacore.function.openChangelog()" style="display: flex; margin-left: 15px;color: var(--button-primary-background); align-items: inherit; justify-content: inherit;">\n          ${window.wacore.svgs.tasksSquare(20, 20, "margin-top: 5px;")}\n        </button>` : ""}\n\n        ${window.infoWl.panelUrl ? `<button title="" data-translate-key="administrativePanel" role="button" id="btn-admin-access" onclick="window.wacore.function.openPanelADM()" style="display: flex; margin-left: 15px;color: var(--button-primary-background); align-items: inherit; justify-content: inherit;">\n          ${window.wacore.svgs.adminAccess(20, 20, "margin-top: 5px;")}\n        </button>` : ""}\n\n        <div title="" data-translate-key="yourCurrentPlan" id="btn-plan">\n        </div>\n      </div>\n\n      <button  class="btn-download-csv" onclick="window.wacore.function.btnDownloadList()" style="display: flex;margin-left: 10px;">\n      <span class="text-container" data-translate-key="downloadContacts"></span> \n        <span>\n          ${window.wacore.svgs.download_file(20, 20, "margin-right: 5px;", "icon-download-csv")}\n        </span>\n      </button>\n      <div class=" dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"  style="display:flex;margin-left: 10px;" onclick="window.wacore.crm.updateListFilter()">\n        <div style="display: inline-block;" id="filtrosdropdown" class="filterchange-title chats-filter chats-filter--active" data-namelist="tab_all"> <span class="mb-3 my-drop-down-header" data-translate-key="allsFilters"></span> <i class="count_tab_all">0</i></div> \n        <div class="dropdown-menu dropdown-filtros dropdown-filterw my-drop-down">\n          <div class="row px-3 py-2">\n            <div class="col-md-4">\n              <h5 class="mb-3 my-drop-down-header" data-translate-key="generalFilter"></h5>\n              <ul class="systemFiltro">\n              </ul> \n            </div>\n            <div class="col-md-4">\n              <h5 class="mb-3 my-drop-down-header" data-translate-key="filterByUser"></h5>\n              <ul class="usersFiltro" style="overflow: overlay;height: 209px;"></ul> \n            </div>\n\n            <div class="col-md-4">\n              <h5 class="mb-3 my-drop-down-header" data-translate-key="tagFilter"></h5>\n              <ul class="tagsFiltro" style="overflow: overlay;height: 209px;"></ul> \n            </div>\n          </div> \n        </div>\n      </div>\n      <button title="" data-translate-key="registerNewConversation"  class="button-add-list" onclick="window.wacore.crm.btnAddColumnCrm(); window.wacore.format_translation.translateText()"> ${window.wacore.svgs.plus(24, 24, "")} </button>\n    </div>\n\n    <nav class="top-nav__filters listasFiltro"></nav>`;
                    let o = document.querySelector(".two");
                    o.parentNode.insertBefore(n, o),
                    [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip-menu"]')).forEach((function(e) {
                        new bootstrap.Tooltip(e)
                    }
                    ));
                    var s = document.createElement("div");
                    s.style.display = "none",
                    s.id = "screen",
                    s.innerHTML = `\n     <div class="board_container" id="screen-container">\n            <div class="board_container_detail"></div>\n            <div class="kanban_board_container">\n
                    <div id="closeBtn" style="display: flex; justify-content: flex-end;cursor: point"><span style="color: black;font-size: 25px;" onclick="document.getElementById('screen').style.display='none'">&times;</span></div>                <div class="kanban_board"></div>\n            </div>\n        </div>\n      </div>\n      <div class="fabs-filter">\n        <div class="action" role="button">\n          <div class="dropdown" style="position: inherit !important;">\n          <i style="top: 55% !important;" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="false"  onclick="window.wacore.crm.drawtags()">${window.wacore.svgs.filter(35, 35, "")}</i>\n          <ul class="dropdown-menu tag-container" aria-labelledby="dropdownMenuButton1" id="tags"></ul>\n          </div>\n        </div>\n      </div>\n      <div class="fabs"> \n        <div class="action">\n          <i class="fas fa-plus" id="add" onclick="window.wacore.crm.btnAddColumn(); window.wacore.format_translation.translateText()">${window.wacore.svgs.plus(35, 35, "")}</i>\n        </div>\n      </div>`,
                    document.querySelector(".app-wrapper-web").parentNode.appendChild(s)
                },
                closedPoup: function(e, t) {
                    return ""
                },
                tpl_users: function() {
                    wacore.fetch.requestDataChannel()
                },
                tpl_metrics: function() {
                    wacore.fetch.requestMetrics()
                },
                changeDimension: function() {
                    document.getElementById("menu-l01").offsetWidth,
                    document.getElementById("menu-leftContent").style.width = "calc(100% - 65px)"
                },
                createMenuActive: async function(e) {},
                activeTabEvent: function() {
                    for (var e = document.getElementById("v-pills-tab-list").getElementsByClassName("utrak-link"), t = 0; t < e.length; t++)
                        e[t].addEventListener("click", (function() {
                            var e = document.getElementsByClassName("activeTab");
                            e[0].className = e[0].className.replace(" activeTab", ""),
                            this.className += " activeTab",
                            document.querySelectorAll(".invite-active").forEach((function(e) {
                                e.classList.remove("invite-active")
                            }
                            ));
                            let t = e[0].children[0].className;
                            e[0].children[0].className = t + " invite-active"
                        }
                        ))
                },
                board: function() {
                    var e = document.createElement("body");
                    e.setAttribute("class", "insert-kanban"),
                    e.innerHTML = `\n      <div id="screen" style="display: none;"> \n        <div class="header"></div>\n        <div class="board_container" id="screen-container">\n          <div class="board_container_detail"></div>\n          <div class="kanban_board_container">\n            <div class="kanban_board"></div>   \n          </div>\n        </div>\n      </div>\n      <div class="fabs-filter">\n        <div class="action" role="button">\n          <div class="dropdown" style="position: inherit !important;">\n            <i style="top: 55% !important;" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="false" onclick="window.wacore.crm.drawtags()">${window.wacore.svgs.filter(35, 35, "")}</i>\n            <ul class="dropdown-menu tag-container" aria-labelledby="dropdownMenuButton1" id="tags"></ul>\n          </div>\n        </div>\n      </div>\n      <div class="fabs"> \n        <div class="action">\n          <i class="fas fa-plus" id="add" onclick="window.wacore.crm.btnAddColumn(); window.wacore.format_translation.translateText()">${window.wacore.svgs.plus(35, 35, "")}</i>\n        </div>\n      </div>\n  `,
                    document.body.insertBefore(e, document.body.lastChild)
                }
            },
            window.wacore.menu_users = {
                render: function(e) {
                    $(".usuarios-count").html(e.users.length);
                    var t = "";
                    for (let n in e.users)
                        if (e.users[n].username) {
                            var a = '<i class="text-mutted">Usuário não editou o nome</i>';
                            e.users[n].name && (a = e.users[n].name),
                            t += `<div class="d-flex text-muted pt-3  border-bottom" role="button" onclick="window.wacore.menu_users.edit('${e.users[n].username}', '${e.users[n].name}', '${e.users[n].admin}', '${wacore.sitechannel}');">\n\n\n              <svg viewBox="0 0 212 212" style="width: 60px;height: 35px;"><path fill="#DFE5E7" class="background" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path><g fill="#FFF"><path class="primary" d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path></g></svg>\n\n              \n                    <p class="pb-3 mb-0 small lh-sm ">\n                      <strong class="d-block text-gray-dark"> ${a} </strong>\n                   ${e.users[n].username}\n                    </p>\n                  </div>`
                        }
                    $(".usuarios-list").html(t)
                },
                edit: function(e, t, a, n) {
                    $("#useredit_name").val(""),
                    $("#useredit_username").val(""),
                    $("#useredit_channel").val(""),
                    $("#useredit_admin").val("");
                    var o = document.getElementById("editaruser");
                    new bootstrap.Modal(o).show(),
                    $("#useredit_username").val(e),
                    $("#useredit_channel").val(n),
                    "undefined" != t && $("#useredit_name").val(t),
                    $("#useredit_admin").val(a)
                }
            },
            window.wacore.menu_metrics = {
                graphAtm: null,
                graphCrm: null,
                graphCreateAtm: function(e) {
                    window.wacore.menu_metrics.graphAtm instanceof Chart && window.wacore.menu_metrics.graphAtm.destroy();
                    var t = document.getElementById("chart-bars-atm").getContext("2d");
                    document.querySelector(".count_atm_atendimentos").innerHTML = e.atm_atendimentos,
                    document.querySelector(".count_atm_finalizados").innerHTML = e.atm_finalizados,
                    document.querySelector(".count_atm_emaberto").innerHTML = e.atm_emaberto,
                    "NaN:NaN:NaN" != e.atm_tempomedio && (document.querySelector(".count_atm_tempomedio").innerHTML = e.atm_tempomedio),
                    window.wacore.menu_metrics.graphAtm = new Chart(t,{
                        type: "bar",
                        data: {
                            labels: e.atm_users.map((e=>e.username)),
                            datasets: [{
                                tension: .4,
                                label: window.wacore.format_translation.getTranslation("attendances"),
                                borderWidth: 0,
                                borderRadius: 4,
                                borderSkipped: !1,
                                backgroundColor: "#1bc465",
                                data: e.atm_users.map((e=>e.atm_atendimentos))
                            }, {
                                label: window.wacore.format_translation.getTranslation("finalized"),
                                tension: .4,
                                borderWidth: 0,
                                borderRadius: 4,
                                borderSkipped: !1,
                                backgroundColor: "#74f9a1",
                                data: e.atm_users.map((e=>e.atm_finalizados))
                            }]
                        },
                        options: {
                            responsive: !0,
                            maintainAspectRatio: !1,
                            plugins: {
                                legend: {
                                    display: !0,
                                    color: "Dark"
                                }
                            },
                            interaction: {
                                intersect: !1,
                                mode: "index"
                            },
                            scales: {
                                y: {
                                    grid: {
                                        drawBorder: !1,
                                        display: !1,
                                        drawOnChartArea: !1,
                                        drawTicks: !1
                                    }
                                },
                                x: {
                                    grid: {
                                        drawBorder: !1,
                                        display: !1,
                                        drawOnChartArea: !1,
                                        drawTicks: !1
                                    },
                                    ticks: {
                                        display: !0,
                                        font: {
                                            size: 12,
                                            style: "normal",
                                            lineHeight: 2
                                        },
                                        color: "Dark"
                                    }
                                }
                            }
                        }
                    }),
                    setTimeout((function() {
                        document.getElementById("chart-bars-atm").style.height = "190px"
                    }
                    ), 50)
                },
                graphCreateCrm: function(e) {
                    window.wacore.menu_metrics.graphCrm instanceof Chart && window.wacore.menu_metrics.graphCrm.destroy();
                    var t = document.getElementById("chart-bars-crm").getContext("2d");
                    document.querySelector(".count_crm_negociosiniciados").innerHTML = e.crm_negocios_iniciados,
                    document.querySelector(".count_crm_ganhosqtd").innerHTML = e.crm_ganhos_qtd + ' <span class="text-success font-weight-bold count_crm_ganhosvlr" style="font-size: 1rem;">(' + e.crm_ganhos_vlr + ")</span>",
                    document.querySelector(".count_crm_percasqtd").innerHTML = e.crm_percas_qtd,
                    "NaN:NaN:NaN" != e.crm_tempomedio && (document.querySelector(".count_crm_tempomedio").innerHTML = e.crm_tempomedio),
                    window.wacore.menu_metrics.graphCrm = new Chart(t,{
                        type: "bar",
                        data: {
                            labels: e.crm_users.map((e=>e.username)),
                            datasets: [{
                                tension: .4,
                                label: window.wacore.format_translation.getTranslation("businessStarted"),
                                borderWidth: 0,
                                borderRadius: 4,
                                borderSkipped: !1,
                                backgroundColor: "#1bc465",
                                data: e.crm_users.map((e=>e.crm_negocios_iniciados))
                            }, {
                                label: window.wacore.format_translation.getTranslation("earnings"),
                                tension: .4,
                                borderWidth: 0,
                                borderRadius: 4,
                                borderSkipped: !1,
                                backgroundColor: "#74f9a1",
                                data: e.crm_users.map((e=>e.crm_ganhos_qtd))
                            }, {
                                label: window.wacore.format_translation.getTranslation("lost"),
                                tension: .4,
                                borderWidth: 0,
                                borderRadius: 4,
                                borderSkipped: !1,
                                backgroundColor: "#00ff32",
                                data: e.crm_users.map((e=>e.crm_percas_qtd))
                            }]
                        },
                        options: {
                            responsive: !0,
                            maintainAspectRatio: !1,
                            plugins: {
                                legend: {
                                    display: !0,
                                    color: "Dark"
                                }
                            },
                            interaction: {
                                intersect: !1,
                                mode: "index"
                            },
                            scales: {
                                y: {
                                    grid: {
                                        drawBorder: !1,
                                        display: !1,
                                        drawOnChartArea: !1,
                                        drawTicks: !1
                                    }
                                },
                                x: {
                                    grid: {
                                        drawBorder: !1,
                                        display: !1,
                                        drawOnChartArea: !1,
                                        drawTicks: !1
                                    },
                                    ticks: {
                                        display: !0,
                                        font: {
                                            size: 12,
                                            style: "normal",
                                            lineHeight: 2
                                        },
                                        color: "Dark"
                                    }
                                }
                            }
                        }
                    }),
                    setTimeout((function() {
                        document.getElementById("chart-bars-crm").style.height = "190px"
                    }
                    ), 50)
                },
                graph: async function(e) {
                    !function(e) {
                        var t = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        function a(t, a) {
                            var n;
                            return this instanceof e ? n = this.getMonth() : void 0 !== t && (n = parseInt(t, 10) - 1),
                            a[n]
                        }
                        e.prototype.getLongMonth = e.getLongMonth = function(e) {
                            return a.call(this, e, t)
                        }
                    }(Date),
                    await wacore.menu_metrics.graphCreateAtm(e),
                    await wacore.menu_metrics.graphCreateCrm(e);
                    for (let t in e.anteriores)
                        listaMeeses = '  <li><a class="dropdown-item">' + Date.getLongMonth(e.anteriores[t]) + "</a></li>";
                    document.getElementById("changeMetricis").innerHTML = `<span class="" style="border-color: #000 !important;">${window.wacore.translation[window.wacore.translation.language].arrayOfMonths[Date.getLongMonth(e.month)]}</span>`
                }
            }
        }
        ,
        754: ()=>{
            let e, t;
            (new function() {
                var e = []
                  , t = []
                  , a = [];
                this.init = function() {
                    this.listen(Element, window)
                }
                ,
                this.listen = function() {
                    for (var t = 0; t < arguments.length; t++)
                        -1 === e.indexOf(arguments[t]) && (e.push(arguments[t]),
                        o(arguments[t]))
                }
                ;
                var n = function(e) {
                    return -1 == t.indexOf(e) && (t.push(e),
                    a.push([{}, {}])),
                    a[t.indexOf(e)]
                }
                  , o = function(e) {
                    var t = e;
                    if (e.prototype && (t = e.prototype),
                    !t.getEventListeners) {
                        if ("function" != typeof t.addEventListener || "function" != typeof t.removeEventListener)
                            throw "\nListenerTracker Error:\nUnwrappable target.";
                        var a = {
                            addEventListener: t.addEventListener,
                            removeEventListener: t.removeEventListener
                        };
                        t.addEventListener = function(e, t, o) {
                            var s = n(this);
                            a.addEventListener.apply(this, arguments);
                            var r = ("object" == typeof o ? o.useCapture : o) ? 1 : 0;
                            s[r][e] || (s[r][e] = []),
                            s[r][e].push({
                                cb: t,
                                args: arguments
                            })
                        }
                        ,
                        t.removeEventListener = function(e, t, o) {
                            var s = n(this);
                            if (a.removeEventListener.apply(this, arguments),
                            s[o = ("object" == typeof o ? o.useCapture : o) ? 1 : 0][e]) {
                                var r = s[o][e].findIndex((e=>e.cb === t));
                                r > -1 && s[o][e].splice(r, 1)
                            }
                        }
                        ,
                        t.getEventListeners = function(e) {
                            for (var t, a = n(this), o = [], s = 0; t = a[s]; s++)
                                if ("string" == typeof e) {
                                    if (t[e])
                                        for (var r in t[e])
                                            o.push({
                                                type: e,
                                                listener: t[e][r].cb,
                                                args: t[e][r].args,
                                                useCapture: !!s
                                            })
                                } else
                                    for (var i in t)
                                        for (var r in t[i])
                                            o.push({
                                                type: i,
                                                listener: t[i][r].cb,
                                                args: t[i][r].args,
                                                useCapture: !!s
                                            });
                            return o
                        }
                    }
                }
            }
            ).init(),
            window.laodDragula = function() {
                try {
                    e.destroy(),
                    t.destroy()
                } catch (e) {}
                wacore.crm.kanbanBoard && wacore.crm.kanbanBoard.boardInitialized() && (e = dragula([].slice.call(document.querySelectorAll(".coringa")), {
                    copy: function(e, t) {
                        return t === document.getElementById("default-chats")
                    },
                    removeOnSpill: (e,t)=>{
                        document.getElementById("default-chats")
                    }
                    ,
                    accepts: function(e, t) {
                        if (!wacore.crm.blockmove)
                            return !0
                    }
                }).on("drop", (async function(t, a) {
                    try {
                        if ("default-chats" == a?.id)
                            return Swal.fire({
                                position: "top-end",
                                icon: "error",
                                title: '<strong data-translate-key="titleInvalidOperation"></strong>',
                                showConfirmButton: !1,
                                timer: 1500,
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            void e.cancel(!0);
                        var n = !1;
                        let r = t.getElementsByClassName("card_chat")[0]
                          , i = document.querySelectorAll(`.${r.classList[1]}`).length
                          , l = document.querySelectorAll(`.${r.classList[1]}`);
                        if (i > 3 && (n = !0),
                        n) {
                            let e = t.classList[0].split("_")[1];
                            var o = wacore.crm.getCard(wacore.function.returnServerInNumber(e))
                              , s = wacore.crm.getOneList(o.crmlist);
                            s ? (await Swal.fire({
                                icon: "warning",
                                title: '<strong data-translate-key="thisCardAlreadyBelongsToAList"></strong>',
                                html: `<span data-translate-key="thisCardBelongsToTheList"></span> ${s.title} <span data-translate-key="thisCardBelongsToTheListMessage"></span>`,
                                confirmButtonText: '<span data-translate-key="moveCard"></span>',
                                showCancelButton: !0,
                                cancelButtonText: '<span data-translate-key="cancel"></span>',
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })).isConfirmed ? n = !1 : (t.getElementsByClassName("card_chat")[0].parentElement.parentElement.remove(),
                            n = !0) : n = !1
                        } else
                            n = !1;
                        n ? n = !1 : (i > 3 && (n = !0,
                        l[i - 2] === r ? l[i - 3].parentElement.parentElement.remove() : l[i - 2].parentElement.parentElement.remove()),
                        wacore.crm.blockmove || (wacore.crm.blockmove = !0,
                        await wacore.crm.positionCards(t, a)))
                    } catch (e) {
                        console.log(e)
                    }
                }
                )).on("remove", ((e,t)=>{
                    let a = t.getAttribute("id")
                      , n = e.classList[0].split("_")[1]
                      , o = wacore.function.returnServerInNumber(n);
                    wacore.function.removerCardInList(o, a)
                }
                )),
                t = dragula([].slice.call(document.querySelectorAll(".kabank_colum_main")), {
                    accepts: function(e, t) {
                        return t !== document.getElementById("kabank_colum_main_default")
                    },
                    moves: function(e, t, a) {
                        return a.classList.contains("kanban_column_header")
                    }
                }).on("drop", (function(e, t) {
                    try {
                        let t = e.querySelector(".coringa");
                        setTimeout((function() {
                            wacore.crm.positionList(t.id)
                        }
                        ), 500)
                    } catch (e) {
                        console.log(e)
                    }
                }
                )),
                autoScroll([window, document.querySelector("#default-chats"), document.querySelector(".kanban_board_container")], {
                    margin: 20,
                    maxSpeed: 20,
                    syncMove: !0,
                    autoScroll: function() {
                        return this.down && e.dragging
                    }
                }))
            }
            ,
            window.Board = class {
                async initBoard() {
                    this.showPromiseLoading(this.initializeAllCollums())
                }
                async initializeAllCollums() {
                    return new Promise((async(e,t)=>{
                        try {
                            var a = wacore.crm.list;
                            for (let e of a) {
                                "default-chats" == e.id && (e.cards = window.Store.Chat._models.map((e=>({
                                    chat: e.id._serialized,
                                    server: e.id.server
                                }))).filter((function(e) {
                                    return "broadcast" !== e.server
                                }
                                )),
                                e.cards && e.cards.length > 51 && (e.cards = e.cards.slice(0, 50)),
                                e.title = "Recentes",
                                e.key = "recents"),
                                this.addColumn(e.id, e.title, e.key);
                                for (let t of e.cards)
                                    e.cards && await window.wacore.whatsapp.getChat(t.chat) && (this.addCard(e.id, t),
                                    wacore.crm.syncCardsContent(t.chat, "first"));
                                await this.delay(400)
                            }
                            window.wacore.format_translation.translateText(),
                            wacore.crm.countListCards(),
                            window.laodDragula(),
                            e(!0)
                        } catch (t) {
                            console.log(t),
                            e(!1)
                        }
                    }
                    ))
                }
                boardInitialized() {
                    const e = document.querySelector(".kanban_board");
                    return e && e.childNodes.length > 0
                }
                async showPromiseLoading(e) {
                    return Swal.fire({
                        title: '<strong data-translate-key="loadingKanbamTitle"></strong>',
                        allowOutsideClick: !1,
                        showConfirmButton: !1,
                        html: `<div>\n                        <span style="display: inline-flex;position: relative;">\n                            <span style="margin-top: 10px;" data-translate-key="loadingKanbamText"></span> \n                            ${window.wacore.svgs.loading(50, 50, "margin-left: 10px")}\n                        </span>\n                    </div>`,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    e.then((e=>(Swal.close(),
                    e))).catch((e=>{
                        throw Swal.close(),
                        e
                    }
                    ))
                }
                async delay(e) {
                    return new Promise((t=>{
                        setTimeout(t, e)
                    }
                    ))
                }
                async resetBoard() {
                    const e = document.querySelector(".kanban_board");
                    if (this.boardInitialized())
                        for (var t = e.childNodes.length - 1; t >= 0; t--)
                            e.removeChild(e.childNodes[t])
                }
                addCard(e, t, a) {
                    let n = ""
                      , o = wacore.crm.getCard(t.chat);
                    o && o.tags && o.tags.map((e=>{
                        n += `<div class="cor_base cor_${e}" ></div>`
                    }
                    ));
                    let s = "";
                    o && o.user && o.user.name && (s = '<span style="white-space: nowrap;overflow: hidden; text-overflow: ellipsis;"><svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg> ' + wacore.function.getCurUserName(o.user.username) + "</span>");
                    let r = `\n          <div class="card_container">\n            <div class="card_chat card_${t.chat.split("@")[0]}" onclick="window.wacore.crm.openChatBTN('${t.chat.split("@")[0]}')">\n            <div class="card_chat_profilepic avatar_pic"></div>  <div class="card_chat_content">   <div class="card_chat_content_title"> <div class="text-truncate name_user text-bold"> </div>  <span class="timestamp">23:12</span>   </div>   <div class="card_chat_content_description">     <p class="last_message" ></p>    <span class="unreadCount">1</span>    </div>   </div> \n             </div>\n             <div class="card_header">\n                <div class="card_cores card_cores_${t.chat.split("@")[0]}" >\n                  ${n}  \n                </div>\n            \x3c!--\n                <div class="card_calendario">\n                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M17 3v-2c0-.552.447-1 1-1s1 .448 1 1v2c0 .552-.447 1-1 1s-1-.448-1-1zm-12 1c.553 0 1-.448 1-1v-2c0-.552-.447-1-1-1-.553 0-1 .448-1 1v2c0 .552.447 1 1 1zm13 13v-3h-1v4h3v-1h-2zm-5 .5c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5-4.5 2.019-4.5 4.5zm11 0c0 3.59-2.91 6.5-6.5 6.5s-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5zm-14.237 3.5h-7.763v-13h19v1.763c.727.33 1.399.757 2 1.268v-9.031h-3v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-9v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-3v21h11.031c-.511-.601-.938-1.273-1.268-2z"/></svg>\n                </div>\n                <div class="card_divider"></div>\n                <div class="card_notes">\n                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M2 0v24h20v-24h-20zm18 22h-16v-15h16v15zm-3-4h-10v-1h10v1zm0-3h-10v-1h10v1zm0-3h-10v-1h10v1z"/></svg>\n                </div>\n\n                <div class="card_divider"> \n                </div> \n \n               --\x3e\n              \n                <div class="card_tags"> \n                <div  onclick="window.wacore.crm.openDropDownTagsMenu(this)" class="dropdown-toggle " data-bs-auto-close="outside" role="button" data-bs-toggle="dropdown" aria-expanded="false">\n                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 24 24" style="display: inline-block;"><path fill="currentColor" d="M12.434 22.586l7.859-7.858.707.707-8.565 8.565-.001-.001v.001l-12.434-12.434.707-.707 11.727 11.727zm-.033-1.7l-12.401-12.405v-8.481h8.441l12.445 12.401-8.485 8.485zm-4.373-19.886h-7.028v7.067l11.401 11.405 7.07-7.07s-7.534-7.506-11.443-11.402zm-1.598 2.594c.78.78.78 2.048 0 2.828-.781.781-2.048.781-2.829 0-.78-.78-.78-2.048 0-2.828.781-.781 2.048-.781 2.829 0zm-.707.707c.39.39.39 1.024 0 1.414-.391.39-1.024.39-1.414 0-.391-.39-.391-1.024 0-1.414.39-.39 1.023-.39 1.414 0z"/></svg>\n                  </div>\n\n                  <ul class="dropdown-menu tag-container">\n                  </ul>\n           \n          \n\n              \n                </div>\n                <div class="card_divider">  </div> \n                ${o && o.user && o.user.name ? ` \n              \n\n                <div class="card_user userchat_${t.chat.split("@")[0]}" style="max-width: 108px;"> \n                ${s}\n                </div>\n\n                <div class="card_divider">  </div> \n                ` : ""}  \n                \n                \n\n                <div class="card_options"> \n                <div class="dropdown card_chat_morebtn"> \n                <div  role="button"  data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">\n                <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="m16.5 11.995c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25z"/></svg>\n                </div>\n                <ul class="dropdown-menu dropdown-mwhats" aria-labelledby="dropdownMenuButton1">\n                <li><a class="dropdown-item" href="#" onclick="window.wacore.crm.openChatBTN('${t.chat.split("@")[0]}')" data-translate-key="openConversation"></a></li>\n                <hr  />\n                \n                <li><a class="dropdown-item" href="#" onclick="window.wacore.crm.removerCardDOM('${t.chat.split("@")[0]}')" data-translate-key="closeCard"></a></li> \n                </ul>\n                </div>\n                </div>\n            </div>\n        </div>\n        `;
                    if (a) {
                        let a = document.createElement("div")
                          , n = document.querySelector(`.kabank_colum #${e}`);
                        n && (a.setAttribute("class", `container_${t.chat.split("@")[0]} animate__animated`),
                        a.innerHTML = r,
                        n.insertBefore(a, n.firstChild))
                    } else {
                        let a = document.createElement("div");
                        a.setAttribute("class", `container_${t.chat.split("@")[0]} animate__animated`),
                        a.innerHTML = r,
                        document.querySelector(`.kabank_colum #${e}`).appendChild(a)
                    }
                    window.wacore.whatsapp.getavatar(t.chat)
                }
                addColumn(e="new", t, a) {
                    let n = document.createElement("div");
                    n.setAttribute("class", "default-chats" !== e ? "kabank_colum_main" : "kabank_colum_main_default"),
                    n.innerHTML = `\n          <div class="kabank_colum" id="kabank_colum-${e}">\n            <div>\n              <div class="kanban_column_header">\n\n              ${"default-chats" == e ? ' \n              <div class="fixa" data-translate-key="fixed"></div>\n              ' : ""}  \n              <div id="kabank_colum_qtd-${e}" class="qtdCards clmcountcards-${e}">0</div>\n                <span> ${t} </span>\n                <div class="buttonsActions">\n                 <button class="colorBtnsActions" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">\n                <svg viewBox="0 0 24 24" width="30" height="30" class=""><path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path></svg> <span id="changeSearch${e}"></span>\n                </button>\n                <div class="dropdown-menu dropdown-mwhats"> \n                <div class="kanban_column_search">\n                <span> <svg viewBox="0 0 24 24" width="24" height="24" class=""><path fill="currentColor" d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"></path></svg></span>\n                <input type="text" name="" placeholder="" data-translate-key="toLookFor" id="input-${e}" onkeyup="window.wacore.crm.seachColumnInput('${e}', this)" />\n                </div>\n            </div>\n\n                ${"default-chats" !== e ? ` \n                <div data-bs-toggle="dropdown" aria-expanded="false">\n                    <button  class="colorBtnsActions" data-bs-toggle="dropdown" aria-expanded="false">\n                        <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="m16.5 11.995c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25z"/></svg>\n                    </button> \n\n                    <ul class="dropdown-menu  dropdown-mwhats">\n                        <li><a class="dropdown-item" href="#" onclick="window.wacore.crm.renomear(this)" data-translate-key="editTitle"></a></li> \n                        <li><a class="dropdown-item" href="#" onclick="window.wacore.function.opendmlist('crmlist', '${e}')" data-translate-key="fireMessageToList"></a></li> \n                        <li><a class="dropdown-item" href="#" onclick="window.wacore.crm.btnRemoveColum(this); window.wacore.format_translation.translateText();" data-translate-key="removeList"></a></li>\n                    </ul>\n                </div>\n                ` : ""}\n                \n            </div>\n            </div>\n\n            <div  class="tasks card_height coringa" id="${e}">\n            </div>\n        </div>\n        </div>\n        `,
                    document.querySelector(".kanban_board").appendChild(n),
                    n = n.className += " kanban_scroller"
                }
            }
        }
        ,
        547: ()=>{
            window.wacore.message = {};
            let e = {}
              , t = {};
            window.wacore.message.variables = {
                msgsCopy: [],
                msgsDeleted: [],
                msgsViewOnce: []
            };
            const a = e=>`<div class="deleted-msg-text selectable-text copyable-text"><span>${e}</span></div>`
              , n = (e,t,n)=>{
                let o = `<div><video controls="" name="media" class="deleted-msg-video"><source src="${e}" type="${t}"></video></div>`;
                return n && (o += a(n)),
                o
            }
              , o = (e,t)=>{
                let n = `<div class="deleted-msg-card">\n                    <div class="deleted-msg-image" onclick="window.wacore.message.functions.showPreviewImage('temp-url-${e}', 1000, 800)">\n                        <img src="temp-url-${e}" style="width: 100%;">\n                    </div>\n                </div>`;
                return t && (n += a(t)),
                n
            }
              , s = (e,t,n,o)=>{
                let s = "0"
                  , r = ""
                  , i = t
                  , l = n;
                try {
                    l > 0 && l < 1e3 ? s = `${l} B` : l > 1e3 && l < 1e6 ? s = `${Math.round(l / 1e3, 2)} KB` : l > 1e6 && (s = `${Math.round(l / 1e3 / 1e3, 2)} MB`),
                    i && i.includes(".") && i.length > 0 && (r = i.split(".")[i.split(".").length - 1].toUpperCase())
                } catch (e) {
                    console.log(e)
                }
                let c = `<div class="doc-card-body">\n        <div class="doc-card-top">\n            <div class="doc-card-icon-file">\n                <div class="doc-icon-file ${"PDF" == r ? "icon-doc-pdf" : "icon-doc-generic"}"></div>\n            </div>\n            <div class="doc-card-top-title" style="flex-grow: 1;">\n                <div class="doc-card-top-title-div">\n                    <span dir="auto" aria-label="">${i}</span>\n                </div>\n                <div class="doc-ext-info-top">\n                    <span data-meta-key="type" data-testid="type" class="doc-ext-info-inside" title="${r}">${r}</span>\n                    <span class="doc-ext-info-inside doc-ext-info-inside-2">•</span>\n                    <span class="doc-ext-info-inside" title="${s}">${s}</span>\n                </div>\n            </div>\n            <div class="doc-button-donwload-head">\n                <div class="doc-button-donwload">\n                    <a href="temp-url-${e}" target="_blank" data-testid="audio-download" data-icon="audio-download" class="">\n                        <svg viewBox="0 0 34 34" height="34" width="34" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 34 34" xml:space="preserve"style="color: rgba(var(--icon-strong-rgb),.5);"><path fill="currentColor" d="M17,2c8.3,0,15,6.7,15,15s-6.7,15-15,15S2,25.3,2,17S8.7,2,17,2 M17,1C8.2,1,1,8.2,1,17 s7.2,16,16,16s16-7.2,16-16S25.8,1,17,1L17,1z"></path><path fill="currentColor" d="M22.4,17.5h-3.2v-6.8c0-0.4-0.3-0.7-0.7-0.7h-3.2c-0.4,0-0.7,0.3-0.7,0.7v6.8h-3.2 c-0.6,0-0.8,0.4-0.4,0.8l5,5.3c0.5,0.7,1,0.5,1.5,0l5-5.3C23.2,17.8,23,17.5,22.4,17.5z"></path>\n                        </svg>\n                    </a>\n                </div>\n            </div>\n        </div>\n    </div>`;
                return o && o != i && (c += a(o)),
                c
            }
              , r = e=>{
                try {
                    var t = document.querySelectorAll(`[data-id="${e}"] > div > div > div > span`);
                    if (t && t.length > 0)
                        for (const e of t)
                            "<span></span>" === e.outerHTML && e.remove()
                } catch (e) {
                    console.log(e)
                }
            }
            ;
            window.wacore.message.callbacks = {
                newMsgDeleted: function(e) {
                    window.wacore.message.functions.tryAddDeletedMessage(e.msg)
                },
                newViewOnceMsg: function(e) {
                    window.wacore.message.functions.tryAddViewOnceMessage(e.msg)
                },
                respGetDeletedMessages: function(e) {
                    window.wacore.config.msgDeleted && e.msg.messages.length > 0 && (window.wacore.message.functions.setDeletedMessagesInChat(e.msg.chatId, e.msg.messages),
                    window.wacore.message.functions.tryShowDeletedMessage(!0))
                },
                respGetViewOnceMessages: function(e) {
                    window.wacore.config.msgDeleted && e.msg.messages.length > 0 && (window.wacore.message.functions.setViewOnceMessagesInChat(e.msg.chatId, e.msg.messages),
                    window.wacore.message.functions.tryShowDeletedMessage(!0))
                }
            },
            window.wacore.message.requests = {
                requestNewMessageDeleted: function(e) {
                    wacore.request.api_post("new_msg_deleted", "channel/new-message-deleted", {
                        oldKey: e.oldKey,
                        newKey: e.newKey,
                        oldMsg: e.oldMsg,
                        chatId: e.chatId,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                },
                requestNewViewonceMessage: function(e) {
                    wacore.request.api_post("new_view_once_msg", "channel/new-view-once-msg", {
                        msgKey: e.msgKey,
                        msg: e.msg,
                        chatId: e.chatId,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                },
                reqGetDeletedMessages: function(e) {
                    wacore.request.api_post("get_messages_deleted", "channel/get-deleted-messages", {
                        chatId: e,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                },
                reqGetViewonceMessages: function(e) {
                    wacore.request.api_post("get_viewonce_messages", "channel/get-view-once-messages", {
                        chatId: e,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                }
            },
            window.wacore.message.events = {
                changeMsgkey: async function(e) {
                    try {
                        if ("free" == currentPlan)
                            return;
                        var t = 0
                          , a = window.wacore.message.variables.msgsCopy.filter((t=>t.id._serialized == e.oldKey._serialized))[0];
                        a || (t = 3e3),
                        setTimeout((()=>{
                            if (a || (a = window.wacore.message.variables.msgsCopy.filter((t=>t.id._serialized == e.oldKey._serialized))[0]),
                            a) {
                                var t = {
                                    oldKey: e.oldKey._serialized,
                                    newKey: e.newKey._serialized,
                                    oldMsg: a,
                                    chatId: a.chatId
                                };
                                "chat" === a.type && window.wacore.message.functions.tryAddDeletedMessage(t),
                                window.wacore.message.requests.requestNewMessageDeleted(t)
                            } else
                                console.log("msg nao encontrado na lista copia, ID " + e.oldKey._serialized)
                        }
                        ), t)
                    } catch (e) {}
                },
                msgAdd: async function(e) {
                    if (!e.broadcast) {
                        let t = 1;
                        const a = ["audio", "ptt", "image", "video", "sticker", "document"];
                        e.id.fromMe && a.includes(e.type) && !e.mediaKey && (t = 3e3),
                        !e.id.fromMe && e.isNewMsg && "chat" == e.type && e.id.remote._serialized == wacore.activeChat && e.body && e.body.length > 5 ? setTimeout((()=>{
                            window.wacore.gpt.functions.tryShowGptSugestion()
                        }
                        ), 500) : e.id.fromMe && e.isNewMsg && e.id.remote._serialized == wacore.activeChat && window.wacore.gpt.functions.hideGptSugestion(),
                        setTimeout((async()=>{
                            if (0 == window.wacore.message.variables.msgsCopy.filter((t=>t.id._serialized == e.id._serialized)).length && window.wacore.message.functions.pushNewMessageCopy(e),
                            e.isNewMsg && await window.wacore.webhook.functions.newMessageNotification(e),
                            e.isViewOnce && !window.wacore.message.functions.getViewOnceMessageById(e.id.remote._serialized, e.id._serialized)) {
                                var t = window.wacore.message.variables.msgsCopy.filter((t=>t.id._serialized == e.id._serialized))[0];
                                if (t) {
                                    var a = {
                                        msgKey: e.id._serialized,
                                        msg: t,
                                        chatId: e.id.remote._serialized
                                    };
                                    window.wacore.message.requests.requestNewViewonceMessage(a)
                                }
                            }
                        }
                        ), t)
                    }
                }
            },
            window.wacore.message.modals = {},
            window.wacore.message.functions = {
                setDeletedMessagesInChat: function(e, t) {
                    window.wacore.message.variables.msgsDeleted[e] || (window.wacore.message.variables.msgsDeleted[e] = []);
                    for (const a of t)
                        window.wacore.message.variables.msgsDeleted[e].push({
                            oldKey: a.oldKey,
                            newKey: a.newKey,
                            oldMsg: a.oldMsg,
                            chatId: a.chatId,
                            mediaData: a.mediaData
                        })
                },
                setViewOnceMessagesInChat: function(e, t) {
                    window.wacore.message.variables.msgsViewOnce[e] || (window.wacore.message.variables.msgsViewOnce[e] = []);
                    for (const a of t)
                        window.wacore.message.variables.msgsViewOnce[e].push({
                            id: a.id,
                            chatId: a.chatId,
                            mediaData: a.mediaData,
                            msg: a.msg
                        })
                },
                getDeletedMessagesFromChat: function(e) {
                    return window.wacore.message.variables.msgsDeleted[e] || (window.wacore.message.variables.msgsDeleted[e] = []),
                    window.wacore.message.variables.msgsDeleted[e]
                },
                getViewOnceMessagesFromChat: function(e) {
                    return window.wacore.message.variables.msgsViewOnce[e] || (window.wacore.message.variables.msgsViewOnce[e] = []),
                    window.wacore.message.variables.msgsViewOnce[e]
                },
                getDeletedMessageById: function(e, t) {
                    return window.wacore.message.functions.getDeletedMessagesFromChat(e).filter((e=>e.newKey == t))[0]
                },
                getViewOnceMessageById: function(e, t) {
                    return window.wacore.message.functions.getViewOnceMessagesFromChat(e).filter((e=>e.id == t))[0]
                },
                tryAddDeletedMessage: function(e) {
                    var t = window.wacore.message.functions.getDeletedMessageById(e.chatId, e.newKey);
                    return t || (t = {
                        oldKey: e.oldKey,
                        newKey: e.newKey,
                        oldMsg: e.oldMsg,
                        chatId: e.chatId,
                        mediaData: e.mediaData
                    },
                    window.wacore.message.variables.msgsDeleted[e.chatId].push(t)),
                    t
                },
                tryAddViewOnceMessage: function(e) {
                    var t = window.wacore.message.functions.getViewOnceMessageById(e.chatId, e.id);
                    return t || (t = {
                        id: e.id,
                        chatId: e.chatId,
                        mediaData: e.mediaData,
                        msg: e.msg
                    },
                    window.wacore.message.variables.msgsViewOnce[e.chatId].push(t)),
                    t
                },
                showPreviewImage: function(e, t, a) {
                    e && Swal.fire({
                        imageUrl: e,
                        heightAuto: !1,
                        width: t,
                        heigth: a
                    })
                },
                pushNewMessageCopy: function(e) {
                    window.wacore.message.variables.msgsCopy.push({
                        chatId: e.id.remote._serialized,
                        id: e.id,
                        from: e.from,
                        to: e.to,
                        type: e.type,
                        body: e.body,
                        notifyName: e.notifyName,
                        t: e.t,
                        mimetype: e.mimetype,
                        caption: e.caption,
                        filename: e.filename,
                        height: e.height,
                        width: e.width,
                        size: e.size,
                        mediaKey: e.mediaKey,
                        deprecatedMms3Url: e.deprecatedMms3Url,
                        clientUrl: e.ClientUrl,
                        directPath: e.directPath,
                        encFilehash: e.encFilehash,
                        filehash: e.filehash,
                        viewOnce: e.isViewOnce
                    })
                },
                tryAddCustomButtons: function() {
                    if (window.wacore.config.transcription) {
                        var e = Store.Chat._models.filter((e=>e.id._serialized == wacore.activeChat))[0].msgs._models.filter((e=>"ptt" == e.type || "audio" == e.type));
                        if (e)
                            for (const n of e) {
                                let e = document.querySelector(`[data-id="${n.id._serialized}"] > div > div > div > div > div > div > div > div`);
                                if (e) {
                                    if (e.innerHTML.includes("window.wacore.gpt.functions.audioTranscription"))
                                        continue;
                                    var t = e.parentNode
                                      , a = document.createElement("div");
                                    a.id = `audio-id-${n.id._serialized}`,
                                    a.style = "margin-right: -10px;",
                                    a.innerHTML = `<button class="_1m3jD _3Wjko _3sMyo" title="" data-translate-key="transcribeAudioToText" onClick="window.wacore.gpt.functions.audioTranscription('${n.id._serialized}')"><span>${window.wacore.svgs.audioTranscription(24, 24)}</span></button>`,
                                    t.insertBefore(a, e),
                                    window.wacore.format_translation.translateText()
                                }
                            }
                    }
                },
                tryShowDeletedMessage: function(i) {
                    if (!window.wacore.config.msgDeleted)
                        return;
                    if (!e[wacore.activeChat])
                        return e[wacore.activeChat] = !0,
                        void window.wacore.message.requests.reqGetDeletedMessages(wacore.activeChat);
                    if (!t[wacore.activeChat])
                        return t[wacore.activeChat] = !0,
                        void window.wacore.message.requests.reqGetViewonceMessages(wacore.activeChat);
                    let l = !1
                      , c = window.wacore.message.functions.getDeletedMessagesFromChat(wacore.activeChat).filter((e=>e.oldMsg && e.chatId == wacore.activeChat))
                      , d = window.wacore.message.functions.getViewOnceMessagesFromChat(wacore.activeChat).filter((e=>e.msg && e.chatId == wacore.activeChat));
                    if (c.length > 0)
                        for (const e of c) {
                            let t = document.querySelector(`[data-id="${e.newKey}"] > div > div`)
                              , i = null
                              , c = 0;
                            if (t && (i = t.childNodes[t.childNodes.length - 2].querySelector("div")),
                            i && (c = 3 == i.childNodes.length ? 1 : 0),
                            i && i.childNodes[c] && !i.childNodes[c]?.childNodes[1]?.id) {
                                l = !0;
                                let t = "";
                                switch (e.oldMsg.type) {
                                case "chat":
                                    t = a(e.oldMsg.body);
                                    break;
                                case "audio":
                                case "ptt":
                                    e.mediaData && (t = `<div><audio controls="" name="media"><source src="${e.mediaData.base64}" type="${e.mediaData.mimetype}"></audio></div>`);
                                    break;
                                case "video":
                                    e.mediaData && (t = n(e.mediaData.base64, e.mediaData.mimetype, e.mediaData.caption));
                                    break;
                                case "image":
                                    e.mediaData && (t = o(e.oldMsg.id._serialized, e.mediaData.caption));
                                    break;
                                case "sticker":
                                    e.mediaData && (t = `<div class="deleted-msg-card" style="-webkit-box-orient: horizontal;">\n                    <div class="deleted-msg-sticker" onclick="window.wacore.message.functions.showPreviewImage('temp-url-${m = e.oldMsg.id._serialized}', 400, 400)">\n                        <img src="temp-url-${m}" style="width: 100%;">\n                    </div>\n                </div>`);
                                    break;
                                case "document":
                                    e.mediaData && (t = s(e.oldMsg.id._serialized, e.mediaData.filename, e.oldMsg.size, e.mediaData.caption))
                                }
                                if (t.includes(`temp-url-${e.oldMsg.id._serialized}`)) {
                                    const a = new RegExp(`temp-url-${e.oldMsg.id._serialized}`,"gi");
                                    t = t.replace(a, e.mediaData.url)
                                }
                                i.childNodes[c].childNodes[0].hidden = !0,
                                i.childNodes[c].childNodes[1].id = `msg-orign-${e.oldMsg.id._serialized}`,
                                i.childNodes[c].childNodes[1].innerHTML = `\n                        <div class="deleted-msg">\n                            <div><div class="deleted-msg-header"><span>🚫 Mensagem apagada:</span></div>\n                            ${t}\n                        </div>`,
                                r(e.newKey)
                            }
                        }
                    var m;
                    if (d.length > 0)
                        for (const e of d) {
                            let t = document.querySelector(`[data-id="${e.id}"] > div > div > div > div`);
                            var u = 0;
                            if (t && (u = t.childNodes[0].childNodes.length - 2),
                            t && t.childNodes[0] && t.childNodes[0].childNodes[u] && !t.childNodes[0].childNodes[u].id) {
                                let a = "";
                                switch (e.msg.type) {
                                case "video":
                                    e.mediaData && (a = n(e.mediaData.base64, e.mediaData.mimetype, e.mediaData.caption));
                                    break;
                                case "image":
                                    e.mediaData && (a = o(e.id, e.mediaData.caption))
                                }
                                if (a.includes(`temp-url-${e.id}`)) {
                                    const t = new RegExp(`temp-url-${e.id}`,"gi");
                                    a = a.replace(t, e.mediaData.url)
                                }
                                var w = "⭐ Visualização única:";
                                e.id.startsWith("true_") || ("view-once-complete" === t.childNodes[0].childNodes[u]?.dataset?.testid ? w += " (sit. aberta)" : w += " (sit. pendente)"),
                                t.childNodes[0].childNodes[u].id = `msg-orign-${e.id}`,
                                t.childNodes[0].childNodes[u].innerHTML = `\n                        <div class="deleted-msg">\n                            <div><div class="deleted-msg-header"><span>${w}</span></div>\n                            ${a}\n                        </div>`
                            }
                        }
                    l && i && setTimeout((()=>{
                        window.wacore.function.forceScrollBotton()
                    }
                    ), 2e3)
                }
            }
        }
        ,
        583: ()=>{
            window.wacore.crm = {
                kanbanBoard: null,
                blockfilter: {
                    type: null,
                    tag: null
                },
                kanban: !1,
                blockmove: !1,
                list: null,
                cards: null,
                tags: null,
                hashtags: {
                    status: null,
                    lista: null
                },
                msgprontas: {
                    lista: null
                },
                fav_msgs: null,
                seachColumnInputDebounce: null,
                returnElementCard: function(e) {
                    let t, a = [];
                    return document.querySelectorAll(".coringa").forEach((e=>{
                        "default-chats" !== e.getAttribute("id") && a.push(...[].slice.call(e.children))
                    }
                    )),
                    a.map((a=>{
                        let n = a.classList[0].split("_")[1];
                        window.wacore.function.returnServerInNumber(n),
                        n === e && (t = a)
                    }
                    )),
                    t
                },
                openwhatsapp: async function() {
                    try {
                        window.Store && (window.wacore.crm.fecharChat(),
                        $("#screen").css("display", "none"),
                        wacore.crm.kanbanBoard.boardInitialized() && wacore.crm.kanbanBoard.resetBoard(),
                        await window.wacore.function.doUpdatesCurFilter())
                    } catch (e) {}
                },
                opencrm: async function() {
                    $("#v-pills-whatsapp-button").click(),
                    window.wacore.crm.fecharChat(),
                    $("#screen").css("display", "flex"),
                    wacore.crm.kanbanBoard.initBoard(),
                    await window.wacore.function.doUpdatesCurFilter()
                },
                startChat: function(e) {
                    window.wacore.crm.staff_chat && e && (setTimeout((function() {
                        document.querySelector(".chat-finished").scrollIntoView({
                            block: "end",
                            behavior: "auto"
                        })
                    }
                    ), 200),
                    wacore.staff.inputChatStaff(),
                    wacore.staff.loadPanel(!0, window.wacore.crm.staff_chat),
                    window.wacore.crm.staff_chat = !1)
                },
                startKanban: function(e) {
                    if (!window.wacore.crm.kanban) {
                        window.wacore.crm.kanban = !0;
                        let a = e.channel.kanban.lista
                          , n = e.channel.cards
                          , o = e.channel.tags.lista;
                        wacore.crm.list = a,
                        wacore.crm.cards = n,
                        wacore.crm.tags = o,
                        wacore.users = e.channel.users,
                        wacore.crm.hashtags.status = e.channel.hashtags.status,
                        wacore.crm.hashtags.lista = e.channel.hashtags.lista;
                        var t = e.channel.msgsprontas.lista;
                        t && (wacore.crm.msgprontas.lista = t.reverse()),
                        window.wacore.crm.fav_msgs = e.channel.msgsprontas.favoritas,
                        document.getElementById("lista_modulos").innerHTML = window.wacore.modules.list(),
                        document.querySelectorAll(".checkbox_modules").forEach((function(e) {
                            e.addEventListener("click", (function(t) {
                                "modulo_transf_hashtag" == e.id && wacore.fetch.requestStatusHashtag({
                                    status: e.checked
                                }),
                                "modulo_msg_apagada" == e.id && wacore.fetch.requestStatusMsgDeleted({
                                    status: e.checked
                                }),
                                "modulo_webhook" == e.id && window.wacore.webhook.requests.setStatusWebhook(e.checked)
                            }
                            ))
                        }
                        )),
                        wacore.whatsapp.manipulate_chatlist("all"),
                        document.addEventListener("attributeChange", (function(e) {
                            if (e.detail.target.matches(".lhggkp7q.ln8gz9je.rx9719la")) {
                                var t = e.detail.target.children[0].querySelector("[title][dir=auto]");
                                t.title && wacore.whatsapp.manipulate_chatlist("name", t.title)
                            }
                        }
                        )),
                        document.addEventListener("click", (function(e) {
                            try {
                                if (!document.querySelector("#drop-down-tags") || !document.querySelector("#drop-down-tags").classList.contains("show"))
                                    return;
                                document.querySelector("#drop-down-tags") && document.querySelector("#drop-down-tags").contains(e.target) || document.querySelector("#btn-open-tags-list") && document.querySelector("#btn-open-tags-list").contains(e.target) || "btn-save-tag-name" == e.target?.className || "edit-tag-item" === e.target?.className || document.querySelector("#drop-down-tags").classList.toggle("show")
                            } catch (e) {
                                console.log(e)
                            }
                        }
                        )),
                        function(e, t) {
                            const a = document || document
                              , n = {
                                attributes: !0,
                                childList: !0,
                                subtree: !0,
                                attributesFilter: [""]
                            };
                            new MutationObserver((function(e, t) {
                                for (let t of e)
                                    "childList" === t.type ? a.dispatchEvent(new CustomEvent("newChild",{
                                        detail: t
                                    })) : "attributes" === t.type && a.dispatchEvent(new CustomEvent("attributeChange",{
                                        detail: t
                                    }))
                            }
                            )).observe(a, n)
                        }(),
                        wacore.crm.list && (wacore.crm.kanbanBoard || (wacore.crm.kanbanBoard = new Board),
                        wacore.crm.drawtags()),
                        document.querySelector("#screen").addEventListener("wheel", (e=>{
                            var t = !1;
                            for (let s in e.path)
                                if (e.path[s] && e.path[s].className && (e.path[s].className.includes("dropdown-menu") && (t = !0),
                                e.path[s].className.includes("kanban_scroller") && document.querySelector(".kanban_board_container") && e.path[s] && e.path[s].querySelector(".kanban_column_header") && e.path[s].querySelector(".coringa"))) {
                                    var a = document.querySelector(".kanban_board_container").scrollHeight
                                      , n = e.path[s].querySelector(".kanban_column_header").clientHeight
                                      , o = parseInt(a) - parseInt(n);
                                    e.path[s].querySelector(".coringa").scrollHeight > o && (t = !0)
                                }
                            t ? t = !1 : document.querySelector(".kanban_board_container").scrollLeft += e.deltaY
                        }
                        )),
                        window.wacore.crm.updateListFilter()
                    }
                },
                openKanban: function() {
                    "none" == document.getElementById("screen").style.display && (document.getElementById("screen").style.display = "flex",
                    wacore.function.forceCloseFocusedChat())
                },
                closeKanban: function() {
                    if (wacore.function.forceCloseFocusedChat(),
                    document.getElementById("screen").style.display = "none",
                    document.getElementsByClassName("two")) {
                        var e = document.getElementsByClassName("two")[0];
                        e && (e.style.width = "100%",
                        e.style.height = "100%",
                        e.style.top = "0")
                    }
                },
                countListCards: function() {
                    try {
                        var e = wacore.crm.list;
                        for (let t of e)
                            document.querySelectorAll(`.clmcountcards-${t.id}`).forEach((function(e) {
                                e.innerText = t.cards.length
                            }
                            ))
                    } catch (e) {}
                },
                openChatBTN: async function(e) {
                    try {
                        await wacore.function.forceCloseFocusedChat();
                        var t = "@c.us";
                        e.length >= 14 && (t = "@g.us");
                        let a = `${e}${t}`;
                        return new Promise(((e,t)=>{
                            window.Store.Chat.find(a).then((t=>{
                                window.Store.Cmd.openChatAt(t).then((t=>{
                                    wacore.crm.mountChatStyle(),
                                    e(!0)
                                }
                                ))
                            }
                            ))
                        }
                        ))
                    } catch (e) {}
                },
                openCustonDropdown: function(e, t) {
                    "move" === t ? e.getElementsByClassName("custom-dropdown-content")[0].classList.toggle("show") : (wacore.crm.drawtags("tag"),
                    document.querySelector(".custom-dropdown-content").classList.toggle("show"))
                },
                openDropDownTagsMenu: function(e) {
                    let t = e.parentElement.getElementsByTagName("ul")[0];
                    wacore.crm.drawtags("menu", t)
                },
                syncAvatar: function(e) {
                    try {
                        let t = document.querySelectorAll(`.card_${e.split("@")[0]}`);
                        if (t.length)
                            for (let a of t)
                                window.Store.Contact.get(e).getProfilePicThumb().eurl && (a.getElementsByClassName("avatar_pic")[0].innerHTML = ` \n                        <img class="card_chat_profilepic" src="${window.Store.Contact.get(e).getProfilePicThumb().eurl}"  />`)
                    } catch (e) {}
                },
                syncUnreadcount: async function(e) {
                    try {
                        let t, a = document.querySelectorAll(`.card_${e.split("@")[0]}`);
                        if (t = await wacore.whatsapp.findChat(e),
                        a.length)
                            for (let e of a)
                                t.unreadcount > 0 ? (e.getElementsByClassName("unreadCount")[0].textContent = `${t.unreadcount}`,
                                e.getElementsByClassName("unreadCount")[0].style.opacity = 1) : e.getElementsByClassName("unreadCount")[0].style.opacity = 0
                    } catch (e) {}
                },
                syncCardsContent: async function(e, t) {
                    if ("first" !== t) {
                        try {
                            document.querySelector(`#default-chats > .container_${e.split("@")[0]}`).remove()
                        } catch (e) {}
                        wacore.crm.kanbanBoard && wacore.crm.kanbanBoard.addCard("default-chats", {
                            chat: e
                        }, !0)
                    }
                    let a = document.querySelectorAll(`.card_${e.split("@")[0]}`);
                    if (a.length) {
                        let t = await wacore.whatsapp.findChat(e);
                        for (let e of a) {
                            let a = new Date(1e3 * t.timestamp)
                              , n = (new Date).toLocaleDateString("pt-BR").slice(0, 19).replace("T", " ").split("/")[0] + "/" + (new Date).toLocaleDateString("pt-BR").slice(0, 19).replace("T", " ").split("/")[1]
                              , o = " " + a.getHours() + ":" + a.getMinutes()
                              , s = new Date
                              , r = a.getDate() === s.getDate();
                            t.avatar ? e.getElementsByClassName("avatar_pic")[0].innerHTML = ` \n                <img class="card_chat_profilepic" src="${t.avatar}"  />\n              ` : e.getElementsByClassName("avatar_pic")[0].innerHTML = '<svg class="card_chat_profilepic"  viewBox="0 0 212 212" width="212" height="212" class=""><path fill="#DFE5E7" class="background" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path><g fill="#FFF"><path class="primary" d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path></g></svg>',
                            e.getElementsByClassName("last_message")[0].textContent = `${t.lastmessage}`,
                            t.unreadcount > 0 ? (e.getElementsByClassName("unreadCount")[0].textContent = `${t.unreadcount}`,
                            e.getElementsByClassName("unreadCount")[0].style.opacity = 1) : e.getElementsByClassName("unreadCount")[0].style.opacity = 0,
                            e.getElementsByClassName("name_user")[0].textContent = `${t.name}`,
                            e.getElementsByClassName("timestamp")[0].textContent = r ? `${o}` : `${n}`
                        }
                    }
                },
                seachColumnInput: function(e, t) {
                    try {
                        setTimeout((function() {
                            var t = document.getElementById("input-" + e);
                            t.value = document.getElementById("input-" + e).value,
                            setTimeout((function() {
                                t.focus()
                            }
                            ), 0)
                        }
                        ), 200);
                        let a = t.value.toLowerCase()
                          , n = t.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("tasks")[0].childNodes
                          , o = [].slice.call(n);
                        clearTimeout(wacore.crm.seachColumnInputDebounce),
                        wacore.crm.seachColumnInputDebounce = setTimeout((()=>{
                            o.map((async t=>{
                                if (t.classList) {
                                    let n = [].slice.call(t.classList)[0].split("_")[1]
                                      , o = t.getElementsByClassName("last_message")[0].textContent
                                      , s = t.getElementsByClassName("name_user")[0].textContent;
                                    document.getElementById("input-" + e).addEventListener("keyup", (t=>{
                                        document.getElementById("input-" + e).value.length > 0 ? document.getElementById("changeSearch" + e).innerHTML = document.getElementById("input-" + e).value : (document.getElementById(e).click(),
                                        document.getElementById("changeSearch" + e).innerHTML = "")
                                    }
                                    )),
                                    n.toLowerCase().includes(a) || o.toLowerCase().includes(a) || s.toLowerCase().includes(a) || "" === a ? (document.getElementById("changeSearch" + e).innerHTML = document.getElementById("input-" + e).value,
                                    t.style.display = "block",
                                    document.getElementById("buttonFilter" + e) && (document.getElementById("buttonFilter" + e).style.display = "block"),
                                    document.getElementById(e).click()) : (await new Promise((e=>setTimeout(e, 500))),
                                    document.getElementById("input-" + e).value.length > 0 && (document.getElementById("changeSearch" + e).innerHTML = document.getElementById("input-" + e).value),
                                    document.getElementById("buttonFilter" + e) && (document.getElementById("buttonFilter" + e).style.display = "none"),
                                    t.style.display = "none")
                                }
                            }
                            ))
                        }
                        ), 1e3)
                    } catch (e) {}
                },
                renomear: function(e) {
                    try {
                        if ("premium" == currentPlan || "basic" == currentPlan) {
                            let t = e.closest(".kabank_colum").getElementsByTagName("div")[7].getAttribute("id")
                              , a = e.closest(".kanban_column_header").getElementsByTagName("span")[0]
                              , n = document.createElement("input");
                            n.style.cssText = "width: 110px;";
                            let o = document.createElement("div")
                              , s = document.createElement("div");
                            s.style.cssText = "margin-left: 10px; display: inline-block",
                            s.setAttribute("role", "button"),
                            s.innerHTML = '<span style="position:absolute; top:7px"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z"/></svg></span>';
                            let r = a.innerText;
                            n.value = r,
                            a.innerText = "",
                            o.append(n),
                            a.append(o),
                            o.append(s),
                            n.select(),
                            s.addEventListener("click", (e=>{
                                wacore.fetch.requestChangeListTitle({
                                    id: t,
                                    title: n.value
                                })
                            }
                            ))
                        } else
                            window.wacore.function.modal_plan("Recurso disponível apenas para os planos: Basic ou Premium")
                    } catch (e) {}
                },
                btnRemoveColum: function(e) {
                    try {
                        if ("premium" == currentPlan || "basic" == currentPlan) {
                            let t = e.closest(".kabank_colum").getAttribute("id");
                            Swal.fire({
                                icon: "warning",
                                title: '<strong data-translate-key="areYouSureYouWantToDeleteThisList"></strong>',
                                html: '<p data-translate-key="messageDeleteList"></p>',
                                showDenyButton: !0,
                                confirmButtonText: '<span data-translate-key="yes"></span>',
                                denyButtonText: '<span data-translate-key="no"></span>',
                                allowOutsideClick: !1
                            }).then((e=>{
                                e.isConfirmed && wacore.fetch.requestRemoveList({
                                    id: t.split("-")[1]
                                })
                            }
                            ))
                        } else
                            window.wacore.function.modal_plan("Recurso disponível apenas para os planos: Basic ou Premium")
                    } catch (e) {}
                },
                createOrUpdateCard: function(e) {
                    try {
                        let t = wacore.crm.getCard(e.id)
                          , a = wacore.crm.cards;
                        if (t) {
                            if (e.idNewList) {
                                t.crmlist = e.idNewList;
                                let a = wacore.crm.getOneList(e.idNewList);
                                a && a.cards.push(t)
                            }
                            if (e.idOldList) {
                                let t = wacore.crm.getOneList(e.idOldList);
                                t && (t.cards = t.cards.filter((t=>t.id != e.id)))
                            }
                            e.user && (t.user = e.user),
                            e.tags && (t.tags = e.tags)
                        } else {
                            let t = {
                                id: e.id,
                                chat: e.id,
                                tags: [],
                                crmlist: e.idNewList,
                                user: e.user
                            };
                            a ? a.push(t) : a = [t],
                            wacore.crm.cards = a
                        }
                    } catch (e) {}
                },
                findListByCard: function(e) {
                    let t, a = wacore.crm.getList();
                    return a.map(((n,o)=>{
                        "default-chats" !== n.id && n.cards.map((n=>{
                            n.id === e && (t = a[o])
                        }
                        ))
                    }
                    )),
                    t
                },
                hoverBtnMoreCard: function(e) {
                    try {
                        "default-chats" !== e.parentNode.parentNode.parentNode.getAttribute("id") && e.getElementsByClassName("card_chat_morebtn")[0].getElementsByTagName("button")[0].setAttribute("style", "display: flex; ")
                    } catch (e) {}
                },
                outBtnMoreCard: function(e) {
                    try {
                        "default-chats" !== e.parentNode.parentNode.parentNode.getAttribute("id") && e.getElementsByClassName("card_chat_morebtn")[0].getElementsByTagName("button")[0].setAttribute("style", " display: none;")
                    } catch (e) {}
                },
                getChatIdsByUser: function(e) {
                    try {
                        let t = wacore.crm.cards
                          , a = [];
                        return t && t.length > 0 && t.filter((e=>e.user)).filter((t=>t.user.username === e)).map((e=>{
                            a.push(e.id)
                        }
                        )),
                        a
                    } catch (e) {}
                },
                getCard: function(e) {
                    try {
                        let t = wacore.crm.cards;
                        return t ? t.filter((t=>t.id === e))[0] : null
                    } catch (e) {}
                },
                removeList: function(e) {
                    try {
                        let t = wacore.crm.getList();
                        t.map(((a,n)=>{
                            a.id === e && t.splice(n, 1)
                        }
                        ))
                    } catch (e) {}
                },
                changeCardList: async function(e, t, a, n=0) {
                    try {
                        var o = e.split("@")[0]
                          , s = await window.wacore.whatsapp.getChat(e);
                        let i = wacore.crm.getOneList(t)
                          , l = document.querySelector("#chat-list-name");
                        if (wacore.crm.kanbanBoard && wacore.crm.kanbanBoard.boardInitialized()) {
                            let e = document.querySelectorAll(`.container_${o}`)
                              , t = document.querySelector(`#${i.id}`);
                            if (e[1])
                                t.children[0] ? (t.children[0].insertAdjacentElement("beforebegin", e[1]),
                                0 === n ? t.children[n].insertAdjacentElement("beforebegin", e[1]) : t.children[n].insertAdjacentElement("afterend", e[1])) : t.appendChild(e[1]);
                            else {
                                if (!e[0] && s && (await wacore.crm.syncCardsContent(s.id._serialized),
                                e = document.querySelectorAll(`.container_${o}`)),
                                !e[0])
                                    return;
                                var r = r = e[0].cloneNode(!0);
                                t.children[n] ? 0 === n ? t.children[n].insertAdjacentElement("beforebegin", r) : t.children[n].insertAdjacentElement("afterend", r) : t.appendChild(r)
                            }
                        }
                        wacore.crm.createOrUpdateCard({
                            id: e,
                            idNewList: t,
                            idOldList: a
                        }),
                        l && (l.innerHTML = `${window.wacore.svgs.kanban(17, 17, "")} ${i.title}`),
                        window.wacore.crm.countListCards(),
                        window.wacore.function.updateSelectedList(),
                        s && await window.wacore.function.forceUpdateChat(s, !0)
                    } catch (e) {
                        Swal.fire({
                            title: '<strong data-translate-key="oops"></strong>',
                            html: '<p data-translate-key="unableToMoveToList"></p>',
                            icon: "error",
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        })
                    }
                },
                removerCardDOM: async function(e) {
                    try {
                        const t = await Swal.fire({
                            icon: "warning",
                            title: '<strong data-translate-key="closeThisCard"></strong>',
                            html: '<p data-translate-key="messageCloseThisCard"></p>',
                            input: "text",
                            inputPlaceholder: "R$",
                            inputAttributes: {
                                id: "closecard"
                            },
                            confirmButtonText: '<span data-translate-key="closeCard"></span>',
                            showCancelButton: !0,
                            cancelButtonText: '<span data-translate-key="cancel"></span>',
                            didOpen: function(e) {
                                window.wacore.format_translation.translateText(),
                                document.getElementById("closecard").addEventListener("keyup", (function(e) {
                                    window.wacore.function.moeda("closecard")
                                }
                                ))
                            }
                        });
                        t.isConfirmed && wacore.fetch.requestRemoveCardList({
                            number: e,
                            ganho: t.value
                        })
                    } catch (e) {}
                },
                positionCards: async function(e, t) {
                    try {
                        let a = e.parentNode.getAttribute("id")
                          , n = e.classList[0].split("_")[1]
                          , o = [].slice.call(t.getElementsByClassName("card_chat")).map((e=>e.classList[1].split("_")[1])).findIndex((e=>e === n));
                        await wacore.fetch.requestChangeCardList(n, a, o)
                    } catch (e) {
                        window.wacore.errors("positionCards", e)
                    }
                },
                positionList: function(e) {
                    try {
                        let a = [].slice.call(document.querySelectorAll(".coringa"))
                          , n = []
                          , o = wacore.crm.getList();
                        a.map((e=>{
                            if ("gu-mirror" === e.parentElement.parentElement.classList[1])
                                return;
                            let t = o.filter((t=>t.id === e.getAttribute("id")))[0];
                            n.push(t)
                        }
                        ));
                        var t = n.reduce((function(t, a, n) {
                            return a.id == e && t.push(n),
                            t
                        }
                        ), []);
                        wacore.fetch.requestMoveList({
                            id: e,
                            position: t
                        }),
                        wacore.crm.setList(n)
                    } catch (e) {}
                },
                getList: function() {
                    return wacore.crm.list
                },
                getOneList: function(e) {
                    try {
                        return wacore.crm.getList().filter((t=>t.id === e))[0]
                    } catch (e) {
                        return null
                    }
                },
                setList: function(e) {
                    wacore.crm.list = e
                },
                updateListFilter: function() {
                    try {
                        if (document.querySelector(".systemFiltro") && (document.querySelector(".systemFiltro").innerHTML = '\n            <li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="tab_all" onclick="window.wacore.whatsapp.renderFilter(\'renderSystemTab\', \'system\', \'tab_all\', \'allsFilters\')"> <span class="mb-3 my-drop-down-header" data-translate-key="allsFilters"></span> <i class="count_tab_all" style="float:right">0</i></div> </li> \n            <li><hr class="dropdown-divider"></li> \n            <li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="tab_needs_user_reply" onclick="window.wacore.whatsapp.renderFilter(\'renderSystemTab\', \'system\', \'tab_needs_user_reply\', \'noResponseFromAttendant\')"><span data-translate-key="noResponseFromAttendant"></span> <i class="count_tab_needs_user_reply" style="float:right">0</i></div></li>\n            <li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="tab_client_awaiting_reply" onclick="window.wacore.whatsapp.renderFilter(\'renderSystemTab\', \'system\', \'tab_client_awaiting_reply\', \'noResponseFromClient\')"><span data-translate-key="noResponseFromClient"></span> <i class="count_tab_client_awaiting_reply" style="float:right">0</i></a></div> \n            <li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="tab_groups" onclick="window.wacore.whatsapp.renderFilter(\'renderSystemTab\', \'system\', \'tab_groups\', \'groupChats\')"><span data-translate-key="groupChats"></span><i class="count_tab_groups" style="float:right">0</i></div></li>\n            <li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="count_tab_1_1" onclick="window.wacore.whatsapp.renderFilter(\'renderSystemTab\', \'system\', \'tab_1_1\', \'directChats\')"><span data-translate-key="directChats"></span><i class="count_tab_1_1" style="float:right">0</i></div></li>\n            <li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="tab_unread" onclick="window.wacore.whatsapp.renderFilter(\'renderSystemTab\', \'system\', \'tab_unread\', \'unread\')"><span data-translate-key="unread"></span><i class="count_tab_unread" style="float:right">0</i></div> </li> \n            ',
                        window.wacore.format_translation.translateText()),
                        document.querySelector(".tagsFiltro")) {
                            var e = "";
                            for (let t in wacore.crm.tags)
                                if (wacore.crm.tags[t].id) {
                                    let a = `changecolor_${wacore.crm.tags[t].id}`;
                                    wacore.crm.tags[t].label && (a = wacore.crm.tags[t].label),
                                    e += `<li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="tags" style="display: flex;" data-namevalue="${wacore.crm.tags[t].id}" onclick="window.wacore.whatsapp.renderFilter('renderTagsTab', 'tags', '${wacore.crm.tags[t].id}', '${a}')">\n            <div class="cor_base_header cor_${wacore.crm.tags[t].id}" >${wacore.crm.tags[t].label}</div></div></li>`
                                }
                            document.querySelector(".tagsFiltro").innerHTML = e
                        }
                        if (document.querySelector(".usersFiltro")) {
                            var t = "";
                            for (let e in wacore.users)
                                wacore.users[e].name && (t += `<li><div class="dropdown-item filterchange my-dropdown-item" data-namelist="users" style="display: flex;" data-namevalue="${wacore.users[e].username}" onclick="window.wacore.whatsapp.renderFilter('renderOperatorTab', 'users', '${wacore.users[e].username}', '${wacore.users[e].name}')"><span style="display: inline-block; margin-left: 5px; margin-right:5px; margin-top:3px">${window.wacore.svgs.person(20, 20, "")} </span> <span style="display: inline-block;">${wacore.users[e].name}</span></div></li> `);
                            document.querySelector(".usersFiltro").innerHTML = t
                        }
                        var a = wacore.crm.getList()
                          , n = "";
                        for (let e in a)
                            "default-chats" != a[e].id && a[e].id && (n += `\n                    <button class="chats-filter filterchange" data-namelist="list" style="display: flex;" data-namevalue="${a[e].id}" onclick="window.wacore.whatsapp.renderFilter('renderListTab', 'list', '${a[e].id}','${a[e].title}')"> \n                        <span>${a[e].title}</span> <i class="clmcountcards-${a[e].id}">0</i> \n                    </button> `);
                        document.querySelector(".listasFiltro") && (document.querySelector(".listasFiltro").innerHTML = n),
                        document.querySelectorAll(".filterchange").forEach((e=>{
                            e.addEventListener("click", (async t=>{
                                if ("dropdown-item filterchange my-dropdown-item" == e.className) {
                                    let e = document.getElementById("filtrosdropdown").className;
                                    document.getElementById("filtrosdropdown").className = e + " chats-filter--active"
                                }
                                if ("chats-filter filterchange" == e.className) {
                                    let t = e.className;
                                    e.className = t + " chats-filter--active"
                                }
                            }
                            ))
                        }
                        )),
                        wacore.crm.countListCards(),
                        window.wacore.whatsapp.countAll()
                    } catch (e) {}
                },
                updateList: function(e) {
                    let t = wacore.crm.getList();
                    t.map(((a,n)=>{
                        a.id === e.id && (t[n] = e)
                    }
                    )),
                    wacore.crm.setList(t)
                },
                removerCardInList: function(e, t, a) {
                    let n = wacore.function.returnServerInNumber(e)
                      , o = wacore.crm.returnElementCard(`${e}`);
                    if (o && t === o.parentElement.getAttribute("id") && o.remove(),
                    a && (wacore.crm.getCard(n).crmlist = null,
                    wacore.activeChat == n)) {
                        let e = document.querySelector("#chat-list-name");
                        e && (e.textContent = "Recentes")
                    }
                },
                btnAddColumnCrm: function() {
                    window.wacore.crm.btnAddColumn()
                },
                btnAddColumn: async function() {
                    try {
                        let e = 50;
                        "free" == currentPlan && (e = 4);
                        let t = e - 1;
                        const {value: a} = await Swal.fire({
                            title: '<strong data-translate-key="addListToCrm"></strong>',
                            icon: "warning",
                            confirmButtonText: '<span data-translate-key="toAdd"></span>',
                            showCancelButton: !0,
                            cancelButtonText: '<span data-translate-key="cancel"></span>',
                            html: '<p data-translate-key="enterANameForTheList"></p>\n        <input type="text" class="swal2-input w-100 m-auto" data-translate-key="enterAName" style="display: flex;" placeholder=""></input>',
                            preConfirm: ()=>[document.querySelector(".swal2-input").value]
                        });
                        if (a)
                            if (a)
                                if (e <= window.wacore.crm.list.length)
                                    window.wacore.function.modal_plan("Você atingiu o limite de " + t + " listas");
                                else {
                                    let e = `C${wacore.function.mongoObjectId()}`;
                                    wacore.fetch.requestCreateList({
                                        id: e,
                                        title: a
                                    })
                                }
                            else
                                alert("Digite um nome")
                    } catch (e) {}
                },
                getTags: function() {
                    return wacore.crm.tags
                },
                getChatIdsFromTag: function(e) {
                    try {
                        let t = []
                          , a = wacore.crm.cards;
                        if (a)
                            a.filter((e=>e.tags && e.tags.length > 0)).map((a=>{
                                a.tags.filter((t=>t == e)).length > 0 && t.push(a.id)
                            }
                            ));
                        return t
                    } catch (e) {}
                },
                setTags: function(e) {
                    wacore.crm.tags = e
                },
                drawtags: function(e="filter", t) {
                    try {
                        let a, n, o = wacore.crm.getTags(), s = "";
                        o ? a = o : alert("Nenhuma TAG cadastrada"),
                        a && (a.sort(((e,t)=>t.label.localeCompare(e.label))),
                        a.map((a=>{
                            let n = !1;
                            if ("tag" === e) {
                                let e = document.querySelector("#drop-down-tags").getAttribute("data")
                                  , t = wacore.function.returnServerInNumber(e)
                                  , o = wacore.crm.getCard(t);
                                if (o) {
                                    let e = o.tags;
                                    e && (n = e.includes(a.id))
                                }
                            } else if ("menu" === e) {
                                let e = t.parentElement.parentElement.parentElement.parentElement.classList[0].split("_")[1]
                                  , o = wacore.function.returnServerInNumber(e)
                                  , s = wacore.crm.getCard(o);
                                if (s) {
                                    let e = s.tags;
                                    e && (n = e.includes(a.id))
                                }
                            }
                            s += `\n        <div class="tag-cell">\n            <a>\n                <label class="custom-control overflow-checkbox">\n                    <input type="checkbox" class="overflow-control-input" id="${a.id}-${e}-checkbox" onclick="window.wacore.crm.checkboxTag(this)" ${n && "checked"}>\n            <span class="overflow-control-indicator"></span>  \n          </label>\n            </a>\n            <li class="item-tag"> \n                <div class="item-tag-cores cor_${a.id}">\n                    <div>${a.label}</div>\n                    <span class="edit-tag-item" title="Editar" onclick="window.wacore.crm.changeLabelTag(this, '${a.id}', '${e}')" id="${a.id}-${e}">\n                        ${window.wacore.svgs.edit_name(15, 15, "")}\n                    </span>\n                </div>\n            </li>\n          </div>`
                        }
                        ))),
                        "tag" === e ? n = document.querySelector("#drop-down-tags") : "filter" === e ? n = document.querySelector("#tags") : "menu" === e && (n = t),
                        n.innerHTML = s
                    } catch (e) {}
                },
                drawtagsChip: function(e) {
                    try {
                        let t = wacore.function.returnServerInNumber(e)
                          , a = wacore.crm.getCard(t)
                          , n = ""
                          , o = "";
                        a && a.tags && a.tags.map((e=>{
                            n += `<div class="cor_base cor_${e}" ></div>`
                        }
                        )),
                        a && a.tags && a.tags.map(((e,t)=>{
                            let a = wacore.crm.tags.filter((t=>t.id == e))[0];
                            o += ` <div class="cor_base_header cor_${e}" >${a?.label}</div>`
                        }
                        ));
                        let s = document.querySelectorAll(`.card_cores_${e}`)[0]
                          , r = document.querySelectorAll(`.card_cores_${e}`)[1]
                          , i = document.querySelector(`.card_cores_chat_${e}`);
                        s && (s.innerHTML = n),
                        r && (r.innerHTML = n),
                        i && (i.innerHTML = o)
                    } catch (e) {}
                },
                hasTagInCard: function(e, t) {
                    try {
                        let a = wacore.crm.getCard(e).tags;
                        return !!a && a.includes(t)
                    } catch (e) {}
                },
                checkboxTag: function(e) {
                    try {
                        let t = e.getAttribute("id")
                          , a = e.checked
                          , [n,o] = t.split("-");
                        if ("filter" === o) {
                            let e = [].slice.call(document.querySelectorAll(".coringa:not(#default-chats)"));
                            a ? filterTags.push(n) : filterTags = filterTags.filter((e=>e !== n)),
                            0 === filterTags.length ? e.map((e=>{
                                itemCards = [].slice.call(e.childNodes),
                                itemCards.map((e=>{
                                    e.childNodes.length && (e.style.display = "block")
                                }
                                ))
                            }
                            )) : filterTags.map((t=>{
                                e.map((e=>{
                                    itemCards = [].slice.call(e.childNodes),
                                    itemCards.map((e=>{
                                        if (e.childNodes.length) {
                                            let t = e.classList[0].split("_")[1]
                                              , a = wacore.function.returnServerInNumber(t)
                                              , n = filterTags.filter((e=>!0 === wacore.crm.hasTagInCard(a, e)))[0];
                                            e.style.display = n ? "block" : "none"
                                        }
                                    }
                                    ))
                                }
                                ))
                            }
                            ))
                        }
                        if ("tag" === o) {
                            let t = e.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByTagName("ul")[0].getAttribute("data")
                              , o = wacore.function.returnServerInNumber(t);
                            wacore.fetch.requestAddTag({
                                id: n,
                                card: o,
                                value: a
                            })
                        }
                        if ("menu" === o) {
                            let t = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.classList[0].split("_")[1]
                              , o = wacore.function.returnServerInNumber(t);
                            wacore.fetch.requestAddTag({
                                id: n,
                                card: o,
                                value: a
                            })
                        }
                    } catch (e) {}
                },
                changeLabelTag: function(e, t, a) {
                    try {
                        let n = e.parentElement.parentElement
                          , o = document.createElement("input");
                        o.setAttribute("style", "width: 78%");
                        let s = document.createElement("div")
                          , r = document.createElement("div");
                        r.style.cssText = "margin-left: 10px; display: inline-block",
                        r.setAttribute("role", "button"),
                        r.innerHTML = `<span class="btn-save-tag-name" style="color: var(--panel-header-icon);">${window.wacore.svgs.save(25, 25, "")}</span>`;
                        let i = n.innerText;
                        o.value = i,
                        n.innerText = "",
                        s.append(o),
                        n.append(s),
                        s.append(r),
                        o.select(),
                        r.addEventListener("click", (e=>{
                            try {
                                wacore.fetch.requestChangeTagTitle({
                                    id: t,
                                    title: o.value
                                });
                                let e = wacore.crm.getTags();
                                e.map(((a,n)=>{
                                    a.id === t && (e[n].label = o.value)
                                }
                                )),
                                wacore.crm.setTags(e),
                                "tag" === a ? wacore.crm.drawtags("tag") : "filter" === a ? wacore.crm.drawtags("filter") : wacore.crm.drawtags("menu", n.parentElement.parentElement)
                            } catch (e) {}
                        }
                        ))
                    } catch (e) {}
                },
                mountChatStyle: function() {
                    try {
                        document.querySelector("#app");
                        let e = document.querySelector(".two")
                          , t = document.querySelector("#main")
                          , a = t.getElementsByTagName("header")[0]
                          , n = t.getElementsByTagName("footer")[0]
                          , o = n.getElementsByTagName("div")[0];
                        a.setAttribute("style", "border-top-left-radius: 20px; border-top-right-radius: 20px"),
                        n.setAttribute("style", "border-radius: 20px; "),
                        o.setAttribute("style", "border-bottom-right-radius: 20px;border-bottom-left-radius: 20px"),
                        e.setAttribute("style", "background: rgb(64 64 64 / 78%); backdrop-filter: blur(2px);  position: absolute; height: 100vh !important; border-top-left-radius: 15px !important;"),
                        t.getElementsByTagName("div")[0].setAttribute("style", " background: transparent;");
                        let s = e.getElementsByTagName("div")[0].getElementsByTagName("div")[1];
                        s && s.setAttribute("style", " background: transparent;"),
                        e.getElementsByTagName("div")[0].setAttribute("style", "background: transparent;box-shadow: none !important;"),
                        document.querySelector("#side").parentNode.setAttribute("style", " display: none;");
                        const r = document.querySelector("#main");
                        r.parentNode.setAttribute("style", "display: flex; justify-content: center;   align-items: center;  background: transparent;"),
                        r.setAttribute("style", "display: flex; height: 90vh;   width: 70vw;  border-radius: 20px;"),
                        a.lastChild.setAttribute("style", "display: flex;");
                        let i = wacore.crm.insertButtonFecharChat();
                        t.parentNode.parentNode.appendChild(i),
                        document.getElementById("screen").setAttribute("style", " display: flex;  z-index: 99;")
                    } catch (e) {}
                },
                insertButtonFecharChat: function() {
                    try {
                        let e = document.createElement("div");
                        return e.setAttribute("id", "fechar-chat"),
                        e.innerHTML = ' <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px;" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg>',
                        e.addEventListener("click", (()=>{
                            wacore.crm.fecharChat()
                        }
                        )),
                        e
                    } catch (e) {}
                },
                fecharChat: function() {
                    try {
                        if (document.querySelector("#fechar-chat")) {
                            let e = document.querySelector("#app")
                              , t = document.querySelector("#main")
                              , a = document.querySelector(".two");
                            if (e && t) {
                                a.setAttribute("style", " "),
                                t.getElementsByTagName("div")[0].setAttribute("style", "   ");
                                let e = a.getElementsByTagName("div")[0].getElementsByTagName("div")[1];
                                e && e.setAttribute("style", "   "),
                                a.getElementsByTagName("div")[0].setAttribute("style", "  "),
                                document.querySelector("#side").parentNode.setAttribute("style", " ");
                                const n = document.querySelector("#main");
                                n.parentNode.setAttribute("style", "background: transparent;"),
                                n.setAttribute("style", "  "),
                                document.getElementById("screen").setAttribute("style", " display: flex; "),
                                document.querySelector("#fechar-chat").remove()
                            }
                        }
                        wacore.function.forceCloseFocusedChat()
                    } catch (e) {}
                }
            },
            window.wacore.staff = {
                chat_count: 0,
                loadPanel: function(e, t) {
                    if (t) {
                        var a = null
                          , n = t;
                        if (n.length > 0) {
                            for (let e in n)
                                if (n[e].date) {
                                    var o = new Date(1e3 * n[e].date).toLocaleDateString("pt-BR");
                                    if (o != a) {
                                        var s = document.getElementById("panel-messages-container");
                                        let e = document.createElement("div");
                                        e.className = "message-day",
                                        e.id = "msg-" + o,
                                        s.appendChild(e);
                                        let a = document.createElement("div");
                                        a.className = "message-divider sticky-top pb-2",
                                        a.setAttribute("data-label", o);
                                        var r = document.getElementById("msg-" + o);
                                        if (r) {
                                            r.appendChild(a);
                                            for (let e in t)
                                                o == new Date(1e3 * t[e].date).toLocaleDateString("pt-BR") && t[e].id && wacore.staff.addMessageChatStaff(o, t[e])
                                        }
                                    }
                                    a = o
                                }
                            document.querySelector(".chat-finished").scrollIntoView({
                                block: "end",
                                behavior: "auto"
                            })
                        }
                    }
                    document.querySelectorAll(".offcanvas-end").forEach((function(e, t) {
                        e.addEventListener("hidden.bs.offcanvas", (function(e) {
                            wacore.staff.chat_count = 0,
                            document.getElementById("chat-interno-count").innerHTML = ""
                        }
                        )),
                        e.addEventListener("show.bs.offcanvas", (function(e) {
                            wacore.staff.chat_count = 0,
                            document.getElementById("chat-interno-count").innerHTML = "";
                            var t = document.getElementById("input-staff-text");
                            setTimeout((function() {
                                t.focus()
                            }
                            ), 0)
                        }
                        ))
                    }
                    ))
                },
                addMessageChatStaff: function(e, t) {
                    try {
                        if (e) {
                            var a = document.getElementById("panel-messages-container");
                            let o = wacore.staff.getViewElement(t);
                            if (n = document.getElementById("msg-" + e))
                                n.appendChild(o);
                            else {
                                let t = document.createElement("div");
                                t.className = "message-day",
                                t.id = "msg-" + e,
                                a.appendChild(t);
                                let s = document.createElement("div");
                                var n;
                                s.className = "message-divider sticky-top pb-2",
                                s.setAttribute("data-label", e),
                                (n = document.getElementById("msg-" + e)) && (n.appendChild(s),
                                n.appendChild(o))
                            }
                        }
                    } catch (e) {}
                },
                getViewElement: function(e) {
                    let t = document.createElement("div");
                    t.id = `_${e.id}`;
                    let a = String(e.username)
                      , n = String(wacore.user.variables.username);
                    return t.className = a == n ? "message self" : "message",
                    t.innerHTML = `\n  <div class="message-wrapper">\n      <div class="message-content"><b>${e.name}</b><br>\n        <span style="position: relative;  overflow-wrap: break-word;  white-space: pre-wrap;">${wacore.function.c_url(e.message)}\n        </span>\n        <div class="message-options">  \n          <span class="message-date">${wacore.function.timeStampToTime(e.date)}\n          </span>\n        </div>\n      </div>\n  </div>\n    `,
                    t.firstElementChild.classList.add("message-in"),
                    t
                },
                renderLenghtDevices: function(e) {
                    let t = window.Store.getMeUser().user
                      , a = "+###############";
                    [{
                        code: "55 ## #########"
                    }].forEach((e=>{
                        let n = e.code.replace(/[\s#]/g, "");
                        t.replace(/[\s#-)(]/g, "").includes(n) && (a = e.code)
                    }
                    ));
                    let n = 0
                      , o = t.replace(/\D/g, "");
                    t = a.replace(/(?!\+)./g, (function(e) {
                        return /[#\d]/.test(e) && n < o.length ? o.charAt(n++) : n >= o.length ? "" : e
                    }
                    ));
                    let s = e.map((e=>e.name)).join(", ");
                    document.getElementById("users-list").innerHTML = "<b>( " + e.length + ' Online )</b>  - <small style="color: rgb(255 255 255 / 70%);">' + s + "</small>",
                    document.querySelectorAll(".qtdonline").forEach((t=>{
                        t.innerHTML = e.length + " ONLINE"
                    }
                    ))
                },
                renderUsers: function() {
                    let e = wacore.users;
                    var t = ""
                      , a = "";
                    let n = "";
                    window.Store.Contact.get(window.Store.getMeUser()._serialized).profilePicThumb.eurl && (n = '<img src="' + window.Store.Contact.get(window.Store.getMeUser()._serialized).profilePicThumb.eurl + '" class="avatar-sm rounded-circle" alt="">');
                    for (let o in e)
                        e[o].username && (wacore.activeChat && (a += ` <li><div class="dropdown-item my-dropdown-item" style="display:flex;" role="button" onclick="window.wacore.function.transferir_atendimento('${e[o].username}','${e[o].name}')"><span style="display: inline-block; margin-right: 5px;">${window.wacore.svgs.person(24, 24, "")}</span> <span>${e[o].name}</span></div></li>`),
                        t += ` <li class="activity-list activity-border"> \n                <div class="activity-icon avatar-sm">\n                  ${n}\n                </div>\n                <div class="media">\n                    <div class="me-3">\n                        <h5 class="font-size-15 mb-1">${e[o].name}</h5>\n                        <p class="text-muted font-size-14 mb-0">${e[o].username}</p>\n                    </div>\n                </div>\n            </li>`);
                    document.getElementById("transferir_userlist") && (document.getElementById("transferir_userlist").innerHTML = a),
                    document.getElementById("devices-usersregister") && (document.getElementById("devices-usersregister").innerHTML = t)
                },
                sendMessageChatStaff: function() {
                    var e = document.getElementById("input-staff-text");
                    e.value && (wacore.fetch.sendChatStaff({
                        text: e.value
                    }),
                    e.value = "",
                    setTimeout((function() {
                        e.focus()
                    }
                    ), 100))
                },
                inputChatStaff: function() {
                    try {
                        document.querySelectorAll(".input-staff-btn").forEach((e=>{
                            e.addEventListener("click", (async e=>{
                                wacore.staff.sendMessageChatStaff()
                            }
                            ))
                        }
                        )),
                        document.querySelectorAll(".input-staff").forEach((e=>{
                            e.addEventListener("keypress", (async e=>{
                                13 != e.keyCode || e.shiftKey || (e.preventDefault(),
                                wacore.staff.sendMessageChatStaff())
                            }
                            ))
                        }
                        ))
                    } catch (e) {}
                }
            },
            window.wacore.disparomassa = {
                configs: {
                    listasBanco: [],
                    status: !1,
                    count: 0,
                    timeout: null,
                    timeout_ve: null,
                    internval_segs: 0,
                    originalButtonHTML: "",
                    dm: {
                        id: null,
                        title: null
                    }
                },
                sendmessage: async function(e, t) {
                    let a = window.wacore.crm.msgprontas.lista.filter((e=>e.id === t))[0];
                    if (a) {
                        let t = a.messages[0];
                        switch (a.type) {
                        case "texto":
                            return await window.wacore.api.functions.sendText(e, t),
                            "texto_new";
                        case "imagem":
                            return wacore.toRequest("req_media", {
                                chat: e,
                                url: t
                            }),
                            "imagem";
                        case "voz":
                            return wacore.toRequest("req_media", {
                                chat: e,
                                url: t
                            }),
                            "voz";
                        case "script":
                            return await window.wacore.modules.script_request(e, a.messages),
                            "script"
                        }
                    }
                },
                dm_envio: function(e) {
                    function t(e, t) {
                        var a, n, o = e;
                        window.wacore.disparomassa.configs.internval_segs = setInterval((function() {
                            a = parseInt(o / 60, 10),
                            n = parseInt(o % 60, 10),
                            a = a < 10 ? "0" + a : a,
                            n = n < 10 ? "0" + n : n,
                            t.textContent = a + ":" + n,
                            --o < 0 && (o = e)
                        }
                        ), 1e3)
                    }
                    if ("send" == e) {
                        if (window.wacore.disparomassa.configs.status = !0,
                        $("#input_dm_selecionarmensagem").attr("disabled", !0),
                        $("#input_dm_voltaraenviar").attr("disabled", !0),
                        $("#input_dm_pausarenvio").attr("disabled", !0),
                        $("#input_dm_intervalo").attr("disabled", !0),
                        $("#dm_btn_prosseguir").attr("disabled", !0),
                        $("#dm_btn_send").attr("disabled", !0),
                        $("#dm_btn_pause").attr("disabled", !1),
                        $("#dm_btn_stop").attr("disabled", !0),
                        !document.querySelectorAll(".lista-ctt-selecionado")[0])
                            return void window.wacore.disparomassa.dm_envio("stop");
                        let e = document.getElementById("input_dm_intervalo")?.value.split("a")
                          , n = Math.floor(Math.random() * (parseInt(e[1]) - parseInt(e[0]) + 1)) + parseInt(e[0]);
                        $("#draggable_status").text("Enviando"),
                        $("#draggable_proximo").text(document.querySelectorAll(".lista-ctt-selecionado")[0].getAttribute("data-id"));
                        var a = 1 * parseInt(n);
                        display = document.querySelector("#draggable_segundos"),
                        clearInterval(window.wacore.disparomassa.configs.internval_segs),
                        t(a, display);
                        let o = parseInt(n) + "000";
                        window.wacore.disparomassa.configs.timeout = setTimeout((async function() {
                            let e = document.querySelectorAll(".lista-ctt-selecionado")[0].getAttribute("data-id")
                              , a = document.getElementById("input_dm_selecionarmensagem").value;
                            if (await window.wacore.disparomassa.sendmessage(e, a))
                                if (window.wacore.disparomassa.configs.count += 1,
                                document.querySelectorAll(".lista-ctt-selecionado")[0].children[1].children[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="green" d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/></svg>',
                                document.querySelectorAll(".lista-ctt-selecionado")[0].className = document.querySelectorAll(".lista-ctt-selecionado")[0].className.replace(" lista-ctt-selecionado", ""),
                                document.querySelectorAll(".lista-ctt-selecionado").length,
                                $("#draggable_qtd").text("Faltam: " + document.querySelectorAll(".lista-ctt-selecionado").length),
                                window.wacore.disparomassa.configs.count >= parseInt(document.getElementById("input_dm_pausarenvio").value)) {
                                    $("#draggable_status").text("Pausado automaticamente"),
                                    clearTimeout(window.wacore.disparomassa.configs.timeout);
                                    let e = document.getElementById("input_dm_voltaraenviar").value;
                                    var n = 1 * parseInt(e)
                                      , o = document.querySelector("#draggable_segundos");
                                    clearInterval(window.wacore.disparomassa.configs.internval_segs),
                                    t(n, o);
                                    let a = parseInt(document.getElementById("input_dm_voltaraenviar").value) + "000";
                                    window.wacore.disparomassa.configs.timeout_ve = setTimeout((function() {
                                        window.wacore.disparomassa.configs.count = 0,
                                        window.wacore.disparomassa.dm_envio("send")
                                    }
                                    ), parseInt(a))
                                } else
                                    window.wacore.disparomassa.dm_envio("send")
                        }
                        ), parseInt(o))
                    }
                    "pause" == e && (window.wacore.disparomassa.configs.status = !1,
                    $("#dm_btn_prosseguir").attr("disabled", !0),
                    $("#dm_btn_send").attr("disabled", !1),
                    $("#dm_btn_pause").attr("disabled", !0),
                    $("#dm_btn_stop").attr("disabled", !1),
                    $("#input_dm_selecionarmensagem").attr("disabled", !1),
                    $("#input_dm_voltaraenviar").attr("disabled", !1),
                    $("#input_dm_pausarenvio").attr("disabled", !1),
                    $("#input_dm_intervalo").attr("disabled", !1),
                    window.wacore.disparomassa.configs.count = 0,
                    clearTimeout(window.wacore.disparomassa.configs.timeout),
                    clearTimeout(window.wacore.disparomassa.configs.timeout_ve),
                    clearInterval(window.wacore.disparomassa.configs.internval_segs),
                    $("#draggable_status").text("Pausado"),
                    $("#draggable_segundos").text("0")),
                    "stop" == e && (window.wacore.disparomassa.configs.status = !1,
                    window.wacore.disparomassa.configs.dm.id = null,
                    window.wacore.disparomassa.configs.dm.title = null,
                    $("#dm_btn_prosseguir").attr("disabled", !1),
                    $("#dm_btn_send").attr("disabled", !0),
                    $("#dm_btn_pause").attr("disabled", !0),
                    $("#dm_btn_stop").attr("disabled", !0),
                    $("#input_dm_selecionarmensagem").attr("disabled", !1),
                    $("#input_dm_voltaraenviar").attr("disabled", !1),
                    $("#input_dm_pausarenvio").attr("disabled", !1),
                    $("#input_dm_intervalo").attr("disabled", !1),
                    $(".count_cttSelecionados").text("0"),
                    $(".dm_contatos").html(""),
                    $("#popup_send_dm").remove(),
                    clearTimeout(window.wacore.disparomassa.configs.timeout),
                    clearTimeout(window.wacore.disparomassa.configs.timeout_ve),
                    clearInterval(window.wacore.disparomassa.configs.internval_segs),
                    setTimeout((function() {
                        Swal.fire({
                            title: '<strong data-translate-key="end"></strong>',
                            html: '<p data-translate-key="transmissionEnded"></p>',
                            icon: "success",
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        })
                    }
                    ), 1e3))
                },
                removerContato: function(e) {
                    window.wacore.disparomassa.configs.status || (e.parentNode.parentNode.remove(),
                    $(".count_cttSelecionados").text(document.querySelectorAll(".lista-ctt-selecionado").length))
                },
                makeDraggable: function(e) {
                    var t, a, n = [0, 0], o = !1;
                    (a = document.createElement("div")).id = "popup_send_dm",
                    a.style.position = "absolute",
                    a.style.cursor = "move",
                    a.style.top = "50%",
                    a.style.left = "50%",
                    a.style.width = "325px",
                    a.style.transform = "translate(-50%, -50%)",
                    a.style.padding = "40px",
                    a.style.borderRadius = "10px",
                    a.style.border = "2px solid rgb(163 161 161)",
                    a.style.background = "linear-gradient(rgb(255, 255, 255) 0px, rgb(221, 220, 220) 100%)",
                    a.style.boxShadow = "rgb(0 0 0 / 15%) 1px 1px 20px 8px",
                    a.innerHTML = '\n    <div class="row"> \n      <div class="col-md-12 pb-3 text-center">\n        <p><span id="draggable_qtd">--</span></p>\n        <p><b id="draggable_status">Aguardando início</b></p>\n        <p class="mb-0">Próximo:<br><b id="draggable_proximo">--</b></p>\n        <p><span id="draggable_segundos">0</span> segundos</p>\n      </div>\n      <div class="col p-1">\n        <button type="button" class="btn btn-success p-3 menu-tooltip" id="dm_btn_send" onclick="window.wacore.disparomassa.dm_envio(\'send\');">\n        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3 17v-10l9 5.146-9 4.854z"></path></svg>\n        <span class="tooltiptext">Iniciar</span>\n        </button>\n      </div>\n      <div class="col p-1">\n        <button type="button" disabled="true" class="btn btn-warning p-3 menu-tooltip" id="dm_btn_pause" onclick="window.wacore.disparomassa.dm_envio(\'pause\');">\n        <svg width="34" height="34" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd"><path fill="currentColor" d="M10 24h-6v-24h6v24zm10 0h-6v-24h6v24zm-11-23h-4v22h4v-22zm10 0h-4v22h4v-22z"></path></svg>\n        <span class="tooltiptext">Parar</span>\n        </button>\n      </div>\n      <div class="col p-1">\n        <button type="button" disabled="false" class="btn btn-danger p-3 menu-tooltip" id="dm_btn_stop" onclick="window.wacore.disparomassa.dm_envio(\'stop\');">\n        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="currentColor" d="M2 2h20v20h-20z"></path></svg>\n        <span class="tooltiptext">Finalizar</span>\n        </button>\n      </div>\n    </div>',
                    document.body.appendChild(a),
                    a.addEventListener("mousedown", (function(e) {
                        o = !0,
                        n = [a.offsetLeft - e.clientX, a.offsetTop - e.clientY]
                    }
                    ), !0),
                    document.addEventListener("mouseup", (function() {
                        o = !1
                    }
                    ), !0),
                    document.addEventListener("mousemove", (function(e) {
                        e.preventDefault(),
                        o && (t = {
                            x: e.clientX,
                            y: e.clientY
                        },
                        a.style.left = t.x + n[0] + "px",
                        a.style.top = t.y + n[1] + "px")
                    }
                    ), !0),
                    $("#draggable_qtd").text("Faltam: " + document.querySelectorAll(".lista-ctt-selecionado").length)
                },
                dm_start: function(e) {
                    window.wacore.disparomassa.configs.status || (e ? (window.wacore.disparomassa.configs.status = !0,
                    window.wacore.disparomassa.configs.dm.id = e.id,
                    window.wacore.disparomassa.configs.dm.title = e.title) : window.wacore.disparomassa.configs.status = !0,
                    $("#dm_btn_prosseguir").attr("disabled", !1),
                    window.wacore.disparomassa.makeDraggable())
                },
                painel: function(e) {
                    if ("start" == e)
                        if (document.querySelectorAll(".lista-ctt-selecionado").length > 1) {
                            if (!window.wacore.disparomassa.configs.dm.id)
                                if (document.getElementById("input_dm_termosdeuso").checked)
                                    if ("Selecione" != document.getElementById("input_dm_intervalo").value && "Selecione" != document.getElementById("input_dm_pausarenvio").value && "Selecione" != document.getElementById("input_dm_voltaraenviar").value && "Selecione" != document.getElementById("input_dm_selecionarmensagem").value) {
                                        var t = document.getElementById("modal_disparomassa");
                                        new bootstrap.Modal(t).show(),
                                        document.getElementById("dm_criar_titulo").value = "",
                                        document.getElementById("naospam").checked = !1
                                    } else
                                        Swal.fire({
                                            title: '<strong data-translate-key="oops"></strong>',
                                            html: '<p data-translate-key="configureAllShippingParameters"></p>',
                                            icon: "error",
                                            didOpen: ()=>{
                                                window.wacore.format_translation.translateText()
                                            }
                                        });
                                else
                                    Swal.fire({
                                        title: '<strong data-translate-key="oops"></strong>',
                                        html: '<p data-translate-key="agreeToTermsOfUse"></p>',
                                        icon: "error",
                                        didOpen: ()=>{
                                            window.wacore.format_translation.translateText()
                                        }
                                    })
                        } else
                            Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: '<p data-translate-key="selectMoreThanOneContact"></p>',
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                },
                parametros: function(e) {
                    if ("input_dm_selecionarmensagem" == e) {
                        let e = document.getElementById("input_dm_selecionarmensagem").value;
                        window.wacore.disparomassa.configs.status ? alert("Impossível com disparo em massa em andamento") : "Selecione" == e && window.wacore.modules.openMessages()
                    }
                },
                selecionarcontatos: async function(e) {
                    if ("listasbanco" == e && document.getElementById("select-type-dm").value) {
                        var t = [];
                        let e = window.wacore.disparomassa.configs.listasBanco.filter((e=>e._id === document.getElementById("select-type-dm").value))[0].list;
                        for (let a in e)
                            if (e[a]) {
                                let n = await window.wacore.whatsapp.getNumberId(e[a]);
                                n && t.push({
                                    id: n._serialized,
                                    name: n.user,
                                    avatar: null
                                })
                            }
                        wacore.disparomassa.listarcontatos("listasbanco", t)
                    }
                    if ("grupos" == e && document.getElementById("select-type-dm").value) {
                        let e = await window.wacore.whatsapp.getChat(document.getElementById("select-type-dm").value)
                          , t = [];
                        window.Store.Chat._models.find((t=>t.id._serialized == e.id._serialized)).groupMetadata.participants._models.forEach((e=>{
                            let a = {
                                id: e.id._serialized,
                                name: e.contact?.pushname || e.name || e.id._serialized,
                                avatar: e.contact?.profilePicThumb?.eurl
                            };
                            t.push(a)
                        }
                        )),
                        wacore.disparomassa.listarcontatos("grupo", t)
                    }
                    if ("listascrm" == e && document.getElementById("select-type-dm").value) {
                        var a = wacore.crm.cards.filter((e=>e.crmlist === document.getElementById("select-type-dm").value));
                        t = [];
                        for (let e in a)
                            if (a[e].id) {
                                let n = await window.wacore.whatsapp.getChat(a[e].id);
                                n && t.push({
                                    id: n.id._serialized,
                                    name: n.contact?.pushname || n.name || n.id._serialized,
                                    avatar: n.contact?.profilePicThumb?.eurl
                                })
                            }
                        wacore.disparomassa.listarcontatos("listascrm", t)
                    }
                    if ("tags" == e && document.getElementById("select-type-dm").value) {
                        let e = document.getElementById("select-type-dm").value;
                        a = wacore.crm.getChatIdsFromTag(e),
                        t = [];
                        for (let e in a)
                            if (a[e]) {
                                let n = await window.wacore.whatsapp.getChat(a[e]);
                                n && t.push({
                                    id: n.id._serialized,
                                    name: n.contact?.pushname || n.name || n.id._serialized,
                                    avatar: n.contact?.profilePicThumb?.eurl
                                })
                            }
                        wacore.disparomassa.listarcontatos("tags", t)
                    }
                    if ("atendentes" == e && document.getElementById("select-type-dm").value) {
                        let e = document.getElementById("select-type-dm").value;
                        a = wacore.crm.getChatIdsByUser(e),
                        t = [];
                        for (const e of a)
                            if (e) {
                                let a = await window.wacore.whatsapp.getChat(e);
                                a && t.push({
                                    id: a.id._serialized,
                                    name: a.contact?.pushname || a.name || a.id._serialized,
                                    avatar: a.contact?.profilePicThumb?.eurl
                                })
                            }
                        wacore.disparomassa.listarcontatos("atendentes", t)
                    }
                },
                filter: function() {
                    let e = document.querySelector(".searchbar").value;
                    e = e.toLowerCase(),
                    document.querySelectorAll(".usuario-dm-slista").forEach((t=>{
                        let a = t.getAttribute("data-title").toLowerCase();
                        t.style.display = a.includes(e) ? "list-item" : "none"
                    }
                    ))
                },
                listarcontatos: function(e, t) {
                    let a = ""
                      , n = t;
                    for (let e in n) {
                        let t = n[e].name;
                        if (t.endsWith("@c.us") && (t = t.replace("@c.us", "")),
                        n[e].id) {
                            let o = '<svg viewBox="0 0 212 212" width="35" height="35" class="" style="display: inline-block"><path fill="#DFE5E7" class="background" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path><g fill="#FFF"><path class="primary" d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path></g></svg>';
                            n[e].avatar && (o = `<img class="avatar_senddm" src="${n[e].avatar}">`),
                            a += `\n          <label class="form-check-label list-group-item usuario-dm-slista" data-title="${t} - ${n[e].id}" style="padding-top: 11px;"> <input class="form-check-input me-1 selecionarnumero" type="checkbox"  data-id="${n[e].id}" data-avatar="${n[e].avatar}" data-name="${t}"> ${o} ${t}</label>\n        `
                        }
                    }
                    let o = `\n    <div class="input-group mb-3">\n      <input type="text" class="form-control searchbar" placeholder="" data-translate-key="searchByNameOrNumber" onkeyup="window.wacore.disparomassa.filter()">\n      <span class="input-group-text" id="basic-addon2"> <label class="form-check-label">\n      <input class="form-check-input" type="checkbox" id="selecionar_todos">\n      <span data-translate-key="selectAll"></span>\n      </label></span>\n    </div>\n\n    <div style="clear: both;" class="mt-2">\n      <ul class="list-group filtrocontatos">\n      ${a}\n      </ul>\n    </div>`;
                    $("#dm_selecionarcontatos").html(o),
                    window.wacore.format_translation.translateText(),
                    "avulso" == e && ($(".alert-info").remove(),
                    $(".filtrocontatos").css("height", "44vh"),
                    $(".filtrocontatos").css("overflow", "scroll")),
                    "csv" == e && ($(".filtrocontatos").css("height", "44vh"),
                    $(".filtrocontatos").css("overflow", "scroll")),
                    "contatos" != e && "naolidas" != e || ($(".filtrocontatos").css("height", "71vh"),
                    $(".filtrocontatos").css("overflow", "scroll")),
                    "grupo" != e && "listascrm" != e && "tags" != e && "atendentes" != e && "listasbanco" != e || ($(".filtrocontatos").css("height", "65vh"),
                    $(".filtrocontatos").css("overflow", "scroll")),
                    document.querySelectorAll(".selecionarnumero").forEach((function(e) {
                        e.addEventListener("change", (function(e) {
                            if (e.currentTarget.getAttribute("data-id")) {
                                let t = e.currentTarget.getAttribute("data-id").split("@")[0];
                                if (e.currentTarget.checked) {
                                    let a = '<svg viewBox="0 0 212 212" width="35" height="35" class="" style="display: inline-block"><path fill="#DFE5E7" class="background" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path><g fill="#FFF"><path class="primary" d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path></g></svg>';
                                    "undefined" != e.currentTarget.getAttribute("data-avatar") && (a = `<img class="avatar_senddm" src="${e.currentTarget.getAttribute("data-avatar")}">`),
                                    document.querySelector(`.ctt_${t}`) || (document.getElementById("info_select_dm") && document.getElementById("info_select_dm").remove(),
                                    $(".dm_contatos").append(`<li class="list-group-item d-flex justify-content-between align-items-start lista-ctt-selecionado ctt_${t}" data-id="${e.currentTarget.getAttribute("data-id")}">\n                <div class="ms-2 me-auto">\n                    <div class="fw-bold" title="${e.currentTarget.getAttribute("data-id")}">${a} ${e.currentTarget.getAttribute("data-name")}\n                    </div>\n                </div>\n                  <span class="badge">\n                  <small title="" data-translate-key="shippingStatus" style="display: inline-block; margin-right: 10px;">\n                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#CCCCCC"  d="M0 12l11 3.1 7-8.1-8.156 5.672-4.312-1.202 15.362-7.68-3.974 14.57-3.75-3.339-2.17 2.925v-.769l-2-.56v7.383l4.473-6.031 4.527 4.031 6-22z"/></svg>\n                  </small> \n                  <small title="" data-translate-key="toRemove" role="button" style="display: inline-block;" class="remover-envio-user">\n                    <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="#ff000073" d="M19 24h-14c-1.104 0-2-.896-2-2v-16h18v16c0 1.104-.896 2-2 2zm-7-10.414l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm10-8.586h-20v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2zm-8-3h-4v1h4v-1z"></path>\n                    </svg>\n                  </small>\n                  \n                  </span>\n                </li>`),
                                    document.querySelectorAll(".remover-envio-user").forEach((function(e) {
                                        e.addEventListener("click", (function(t) {
                                            window.wacore.disparomassa.removerContato(e)
                                        }
                                        ))
                                    }
                                    )))
                                } else
                                    document.querySelectorAll(`.ctt_${t}`).forEach((function(e) {
                                        e.remove()
                                    }
                                    ));
                                $(".count_cttSelecionados").text(document.querySelectorAll(".lista-ctt-selecionado").length)
                            }
                        }
                        ))
                    }
                    )),
                    document.getElementById("selecionar_todos").addEventListener("change", (function(e) {
                        e.target.checked ? document.querySelectorAll(".selecionarnumero").forEach((function(e) {
                            e.getAttribute("data-id") && (e.checked || (e.click(),
                            e.checked = !0))
                        }
                        )) : document.querySelectorAll(".selecionarnumero").forEach((function(e) {
                            e.getAttribute("data-id") && (e.click(),
                            e.checked = !1)
                        }
                        ))
                    }
                    ))
                },
                CSVToJSON: function(e) {
                    var t = e.split(/\r?\n/g)
                      , a = [];
                    return t.forEach((e=>{
                        if ("" == e.trim())
                            return;
                        let t = {
                            Name: e.trim(),
                            Number: e.trim()
                        };
                        a.push(t)
                    }
                    )),
                    a
                },
                renderOtherList: async function(e, t, a=!1) {
                    let n, o = [], s = [], r = !1, i = document.querySelector("#loadingElement").innerText;
                    for (let a in e)
                        if (e[a].name) {
                            "csv" === t && (n = e[a].name.replace(/[^0-9]/g, "")),
                            "avulso" === t && (n = e[a].id);
                            let l = window.wacore.function.returnServerInNumber(n)
                              , c = n
                              , d = `${i} [${parseInt(a) + 1} ... ${e.length}]`;
                            document.querySelector("#loadingElement").innerText = d;
                            let m = await window.wacore.whatsapp.getNumberId(l);
                            if (m) {
                                l = m._serialized,
                                c = m.user;
                                let e = {
                                    id: l,
                                    name: c,
                                    avatar: void 0
                                };
                                o.push(e)
                            } else
                                r = !0,
                                s.push(n)
                        }
                    document.querySelector("#btn-upload-and-loading").innerHTML = window.wacore.disparomassa.originalButtonHTML,
                    r && Swal.fire({
                        icon: "error",
                        title: '<strong data-translate-key="titleFlaws"></strong>',
                        footer: '<p data-translate-key="messageFailures"></p>',
                        html: s.join(","),
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }),
                    window.wacore.disparomassa.listarcontatos(t, o)
                },
                loadCSVData: function(e) {
                    document.querySelector("#btn-upload-and-loading").innerHTML = '<div data-translate-key="loading" id="loadingElement" class="btn btn-primary btn-lg">\n    </div>',
                    window.wacore.format_translation.translateText();
                    let t = window.wacore.disparomassa.CSVToJSON(e)
                      , a = [];
                    t.forEach((e=>{
                        if ("undefined" == e.Number || a.find((t=>t.id == e.Number)))
                            return;
                        let t;
                        if (e.Number = e.Number.split(";"),
                        e.Name = e.Name.split(";"),
                        null == e.Number[1] ? (t = e.Number[0],
                        phone = e.Number[0],
                        e.Name[0] = "Numero") : (t = e.Number[1],
                        phone = e.Number[1]),
                        "11" === (t = t.substr(2, 2)) || "12" === t || "13" === t || "14" === t || "15" === t || "16" === t || "17" === t || "18" === t || "19" === t || "21" === t || "22" === t || "24" === t || "27" === t || "28" === t || "96" === t || "98" === t || "93" === t || "94" === t || "95" === t) {
                            if (12 === phone.length) {
                                let e = phone
                                  , t = phone;
                                phone = `${e = e.substr(0, 4)}9${t = t.substr(4, 8)}`
                            }
                        } else
                            13 === phone.length && (phone = phone.replace(9, ""));
                        let n = {
                            id: phone,
                            name: e.Name[0]
                        };
                        a.push(n)
                    }
                    )),
                    window.wacore.disparomassa.renderOtherList(a, "csv", !0)
                },
                carregarcsv: function() {
                    this.originalButtonHTML = document.querySelector("#btn-upload-and-loading").innerHTML;
                    let e = document.createElement("input");
                    e.setAttribute("type", "file"),
                    e.setAttribute("accept", ".csv"),
                    e.addEventListener("change", (()=>{
                        var t = new FileReader;
                        t.onload = function(e) {
                            try {
                                let t = e.target.result;
                                t.includes(";\r\n") || (t = t.replace(/\r\n/g, ";\r\n")),
                                t.endsWith(";") || (t += ";"),
                                window.wacore.disparomassa.loadCSVData(t)
                            } catch (e) {
                                console.error(e, "error catch")
                            }
                        }
                        ,
                        t.readAsBinaryString(e.files[0])
                    }
                    )),
                    e.click()
                },
                carregaravulso: function() {
                    this.originalButtonHTML = document.querySelector("#btn-upload-and-loading").innerHTML,
                    document.querySelector("#btn-upload-and-loading").innerHTML = '<div data-translate-key="loading" id="loadingElement" class="btn btn-primary btn-lg">\n    </div>',
                    window.wacore.format_translation.translateText();
                    let e = document.getElementById("copy_avulso_numeros").value.split(",")
                      , t = [];
                    for (var a = 0; a < e.length; a++)
                        if (e[a]) {
                            let n = {
                                id: e[a],
                                name: "Número"
                            };
                            t.push(n)
                        }
                    window.wacore.disparomassa.renderOtherList(t, "avulso", !0)
                },
                verfontes: function() {
                    window.wacore.disparomassa.configs.status ? alert("Transmissão em andamento!") : ($("#btn-voltar-fontes").attr("disabled", !0),
                    $("#lista_fontes").css("display", "block"),
                    $("#dm_selectform").html(""),
                    $("#dm_selecionarcontatos").html(""))
                },
                fontesdecontatos: function(e) {
                    try {
                        if (window.wacore.disparomassa.configs.status)
                            alert("Transmissão em andamento!");
                        else {
                            if ($("#btn-voltar-fontes").attr("disabled", !1),
                            $("#lista_fontes").css("display", "none"),
                            $("#dm_selectform").html(""),
                            $("#dm_selecionarcontatos").html(""),
                            "avulso" == e && $("#dm_selectform").html('\n              <div class="form-floating mb-2 mt-2" id="div_avulso_numeros">\n                <textarea class="form-control" placeholder="" data-translate-key="typeOrPasteTheNumbers" id="copy_avulso_numeros" style="height: 100px"></textarea>\n                <label for="copy_avulso_numeros" data-translate-key="typeOrPasteTheNumbers"></label>\n              </div>\n              <div class="alert alert-info d-flex align-items-center" role="alert">\n                <div data-translate-key="separateInformationMessage">\n                </div>\n              </div>\n              <div class="d-grid gap-2 border-top mt-3" id="btn-upload-and-loading">\n                <button class="btn btn-primary btn-lg" type="button" data-translate-key="toLoad" onclick="window.wacore.disparomassa.carregaravulso()">\n                </button>\n              </div>'),
                            "csv" == e && $("#dm_selectform").html('\n            <div class="alert alert-info d-flex align-items-center" role="alert">\n              <div data-translate-key="csvInformationalMessageUpload">\n              </div>\n            </div>\n            <div class="d-grid gap-2 border-top mt-3" id="btn-upload-and-loading">\n              <button class="btn btn-primary btn-lg" type="button" onclick="window.wacore.disparomassa.carregarcsv()" data-translate-key="uploadCsvFile"></button>\n            </div>'),
                            "paragrupos" == e) {
                                let e = [];
                                window.Store.Contact.getGroupContacts().forEach((t=>{
                                    let a = {
                                        id: t.id._serialized,
                                        name: t.contact?.pushname || t.name || t.id._serialized,
                                        avatar: t.contact?.profilePicThumb?.eurl
                                    };
                                    e.push(a)
                                }
                                )),
                                wacore.disparomassa.listarcontatos("paragrupos", e)
                            }
                            if ("contatos" == e) {
                                let e = []
                                  , t = []
                                  , a = window.Store.Chat._models.filter((e=>!e.contact.x_name))
                                  , n = window.wacore.whatsapp.getFilteredContacts();
                                (t = [...a, ...n]).forEach((t=>{
                                    let a = {
                                        id: t.id._serialized,
                                        name: t.contact?.name || t.contact?.pushname || t.name || t.id._serialized,
                                        avatar: t.profilePicThumb?.eurl ?? t.contact?.profilePicThumb?.eurl
                                    };
                                    e.push(a)
                                }
                                )),
                                wacore.disparomassa.listarcontatos("contatos", e)
                            }
                            if ("naolidas" == e) {
                                let e = []
                                  , t = [];
                                (t = [...window.Store.Chat._models.filter((function(e) {
                                    return e.unreadCount && !e.archive
                                }
                                ))]).forEach((t=>{
                                    let a = {
                                        id: t.id._serialized,
                                        name: t.contact?.pushname || t.name || t.id._serialized,
                                        avatar: t.contact?.profilePicThumb?.eurl
                                    };
                                    e.push(a)
                                }
                                )),
                                wacore.disparomassa.listarcontatos("naolidas", e)
                            }
                            if ("grupos" == e) {
                                let e = [];
                                window.Store.Contact.getGroupContacts().forEach((t=>{
                                    let a = {
                                        id: t.id._serialized,
                                        name: t.contact?.pushname || t.name || t.id._serialized,
                                        participants: []
                                    };
                                    window.Store.Chat._models.find((e=>e.id._serialized == t.id._serialized))?.groupMetadata?.participants?._models.forEach((e=>{
                                        a.participants.push({
                                            id: e.id._serialized,
                                            name: e.contact?.pushname || e.name || e.id._serialized
                                        })
                                    }
                                    )),
                                    e.push(a)
                                }
                                ));
                                let t = '<select class="form-select mb-2" aria-label=".form-select-sm example" id="select-type-dm" onchange="window.wacore.disparomassa.selecionarcontatos(\'grupos\')">';
                                t += '<option selected data-translate-key="selectTheGroup"></option>';
                                for (let a in e)
                                    e[a].name && (t += ` <option value="${e[a].id}">${e[a].name} (${e[a].participants.length})</option>`);
                                t += "</select>\n          ",
                                $("#dm_selectform").html(t),
                                window.wacore.format_translation.translateText()
                            }
                            if ("listascrm" == e) {
                                let e = window.wacore.crm.list
                                  , t = '<select class="form-select mb-2" aria-label=".form-select-sm example" id="select-type-dm" onchange="window.wacore.disparomassa.selecionarcontatos(\'listascrm\')">';
                                t += ' <option selected data-translate-key="selectTheList"></option>';
                                for (let a in e)
                                    if ("default-chats" != e[a].id && e[a].title) {
                                        let n = wacore.crm.cards.filter((t=>t.crmlist === e[a].id));
                                        t += ` <option value="${e[a].id}">${e[a].title} (${n.length})</option>`
                                    }
                                t += "</select>\n        ",
                                $("#dm_selectform").html(t),
                                window.wacore.format_translation.translateText()
                            }
                            if ("tags" == e) {
                                let e = window.wacore.crm.tags
                                  , t = '<select class="form-select mb-2" aria-label=".form-select-sm example" id="select-type-dm" onchange="window.wacore.disparomassa.selecionarcontatos(\'tags\')">';
                                t += ' <option selected data-translate-key="selectTheTag"></option>';
                                for (let a in e)
                                    if (e[a].id) {
                                        let n = wacore.crm.getChatIdsFromTag(e[a].id)
                                          , o = e[a].id;
                                        e[a].label && (o = e[a].label + "- " + e[a].id),
                                        t += ` <option value="${e[a].id}">${o} (${n.length})</option>`
                                    }
                                t += "</select>",
                                $("#dm_selectform").html(t),
                                window.wacore.format_translation.translateText()
                            }
                            if ("atendentes" == e) {
                                let e = window.wacore.users
                                  , t = '<select class="form-select mb-2" aria-label=".form-select-sm example" id="select-type-dm" onchange="window.wacore.disparomassa.selecionarcontatos(\'atendentes\')">';
                                t += ' <option selected data-translate-key="selectAttendant"></option>';
                                for (let a in e)
                                    if (e[a].username) {
                                        let n = wacore.crm.getChatIdsByUser(e[a].username)
                                          , o = e[a].username;
                                        e[a].name && (o = e[a].name + " - " + e[a].username),
                                        t += ` <option value="${e[a].username}">${o} (${n.length})</option>`
                                    }
                                t += "</select>",
                                $("#dm_selectform").html(t),
                                window.wacore.format_translation.translateText()
                            }
                            "listas-banco" == e && wacore.fetch.requestListasDm()
                        }
                    } catch (e) {}
                }
            },
            window.wacore.modules = {
                var_configs: {
                    audio: {
                        counter: 1,
                        chunks: null,
                        base64: [],
                        media: null,
                        recorder: null,
                        stream: null
                    }
                },
                preSendMsgPronta: async function(e, t) {
                    let a = window.wacore.crm.msgprontas.lista.filter((t=>t.id === e))[0];
                    a && Swal.fire({
                        title: `<strong data-translate-key="titlePreSendMsgReady"></strong> <strong>${a.title}?</strong>`,
                        showDenyButton: !0,
                        confirmButtonText: '<span data-translate-key="yes"></span>',
                        denyButtonText: '<span data-translate-key="no"></span>',
                        allowOutsideClick: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((a=>{
                        a.isConfirmed && window.wacore.modules.enviarMsgpronta(e, t)
                    }
                    ))
                },
                enviarMsgpronta: async function(e, t) {
                    if (document.getElementById("dropdown_msgpronta")) {
                        var a = document.getElementById("dropdown_msgpronta");
                        new bootstrap.Dropdown(a).hide()
                    }
                    let n = wacore.activeChat;
                    t && (n = t);
                    let o = window.wacore.crm.msgprontas.lista.filter((t=>t.id === e))[0]
                      , s = "";
                    if ("texto" == o.type && (t ? ((await window.wacore.whatsapp.getChat(n)).sendMessage(o.messages[0]),
                    wacore.user.variables.status && wacore.function.assignCard(n)) : (s = "" + o.messages[0],
                    window.wacore.gpt.functions.changeImputText(s))),
                    "voz" == o.type)
                        for (let e = 0; e <= o.messages.length; e++)
                            o.messages[e] && wacore.toRequest("req_media", {
                                chat: n,
                                url: o.messages[e]
                            });
                    if ("imagem" == o.type)
                        for (let e = 0; e <= o.messages.length; e++)
                            o.messages[e] && wacore.toRequest("req_media", {
                                chat: n,
                                url: o.messages[e]
                            });
                    "script" == o.type && await window.wacore.modules.script_request(wacore.activeChat, o.messages)
                },
                favoritar: function(e) {
                    wacore.fetch.requestFavoriteAdd({
                        id: e
                    })
                },
                favoriteAdd: function(e) {
                    try {
                        let r = window.wacore.crm.msgprontas.lista.filter((t=>t.id === e.id))[0];
                        if (r) {
                            var t = document.querySelector(".add-message-tag");
                            if (t) {
                                var a = t.parentNode
                                  , n = document.createElement("label");
                                n.className = "quick-chat-msg";
                                var o = ""
                                  , s = "";
                                switch (r.type) {
                                case "texto":
                                    o = window.wacore.svgs.item_text(20, 20, "margin-right:3px"),
                                    s = "Texto";
                                    break;
                                case "imagem":
                                    o = window.wacore.svgs.item_image(20, 20, "margin-right:3px"),
                                    s = "Imagem";
                                    break;
                                case "script":
                                    s = "Script de mensagens",
                                    o = window.wacore.svgs.script_file(20, 20, "margin-right:3px");
                                    break;
                                case "voz":
                                    s = "Áudio",
                                    o = window.wacore.svgs.audio_file(20, 20, "margin-right:3px")
                                }
                                n.innerHTML = `<span title="${s}" class="quick-chat-msg-text" onclick="window.wacore.modules.preSendMsgPronta('${r.id}')">${o} ${r.title}</span>`,
                                a.insertBefore(n, t)
                            }
                        }
                    } catch (e) {}
                },
                script_request: async function(e, t) {
                    for (let a = 0; a <= t.length; a++)
                        t[a] && setTimeout((function() {
                            window.wacore.modules.enviarMsgpronta(t[a], e)
                        }
                        ), 1e3 + 4e3 * a)
                },
                mensagem_request: function() {
                    let e = document.getElementById("modulo_mensagens_tipo").value;
                    "selecioneotipo" == e && $("#createFormAddMsg").html(""),
                    "voz" == e && (document.getElementById("modulo_mensagens_tipo").value = "voz",
                    $("#createFormAddMsg").html('\n      <div class="mb-3">\n        <span style="font-weight:500"a data-translate-key="titleForReference"></span>\n          <input type="text" class="form-control mt-2 form-modify" id="modulo_mensagens_titulo" placeholder="" data-translate-key="typeTheTitle" required>\n        \n        <div class="mb-3 pt-3 form-check">\n          <input type="checkbox" class="form-check-input" id="modulo_mensagens_favoritar">\n          <label class="form-check-label" for="modulo_mensagens_favoritar" data-translate-key="favoriteForMyUser"></label>\n          <br>\n          <span data-translate-key="informationalMessageTitle"></span>\n        </div>\n        <div class="d-grid gap-2 border-top mt-3">\n          <button class="btn btn-primary btn-lg" type="button" onclick="window.wacore.modules.audio_tab(); window.wacore.format_translation.translateText();" data-translate-key="clickToRecordTheAudio"></button>\n        </div>\n      </div>\n    '),
                    window.wacore.format_translation.translateText()),
                    "imagem" == e && (document.getElementById("modulo_mensagens_tipo").value = "imagem",
                    $("#createFormAddMsg").html('\n    <div class="mb-3">\n      <span style="font-weight:500" data-translate-key="titleForReference"></span>\n      <input type="text" class="form-control mt-2 form-modify" id="modulo_mensagens_titulo" placeholder="" data-translate-key="typeTheTitle" required>\n      <div class="mb-3 pt-3 form-check">\n        <input type="checkbox" class="form-check-input" id="modulo_mensagens_favoritar">\n        <label class="form-check-label" for="modulo_mensagens_favoritar" data-translate-key="favoriteForMyUser"></label>\n        <br>\n        <span data-translate-key="informationalMessageTitle">\n        </span>\n      </div>\n      <div class="d-grid gap-2 border-top mt-3">\n        <button class="btn btn-primary btn-lg" type="button" onclick="window.wacore.modules.imagem_tab(); window.wacore.format_translation.translateText();" data-translate-key="clickToSendTheImage"></button>\n      </div>\n    </div>'),
                    window.wacore.format_translation.translateText()),
                    "midia" == e && (document.getElementById("modulo_mensagens_tipo").value = "texto",
                    alert("Desabilitado no momento")),
                    "texto" == e && ($("#createFormAddMsg").html('\n      <div class="mb-3">\n      <span style="font-weight:500" data-translate-key="titleForReference"></span>\n      <input type="text" class="form-control mt-2 form-modify" id="modulo_mensagens_titulo" placeholder="" data-translate-key="typeTheTitle" required>\n      </div>\n      <div class="mb-3  pt-2">\n        <span style="font-weight:500" data-translate-key="typeTheMessage"></span>\n        <textarea class="form-control mt-2" row="2" id="modulo_mensagens_texto" ></textarea>\n        <div class="mb-3 pt-3 form-check">\n            <input type="checkbox" class="form-check-input" id="modulo_mensagens_favoritar">\n            <label class="form-check-label" for="modulo_mensagens_favoritar" data-translate-key="favoriteForMyUser"></label>\n            <br>\n            <span data-translate-key="informationalMessageTitle">\n            </span>\n        </div>\n\n        <div class="d-grid gap-2 border-top mt-3">\n          <button class="btn btn-primary btn-lg" type="submit" id="msgsprontas-button" data-translate-key="addMessage"></button>\n        </div>\n      </div>'),
                    window.wacore.format_translation.translateText())
                },
                imagem_tab: function() {
                    let e = 1e3;
                    if ("free" == currentPlan && (e = 3),
                    e <= window.wacore.crm.msgprontas.lista.length)
                        window.wacore.function.modal_plan("Você atingiu o limite de " + e + " mensagens");
                    else {
                        let e = document.getElementById("modulo_mensagens_titulo").value
                          , t = document.getElementById("modulo_mensagens_favoritar").checked;
                        e.length > 1 ? window.wacore.function.enviarimagem(e, t) : Swal.fire({
                            title: '<strong data-translate-key="oops"></strong>',
                            html: '<p data-translate-key="typeATitleForTheImage"></p>',
                            icon: "error"
                        })
                    }
                },
                audio_tab: function() {
                    let e = 1e3;
                    if ("free" == currentPlan && (e = 3),
                    e <= window.wacore.crm.msgprontas.lista.length)
                        window.wacore.function.modal_plan("Você atingiu o limite de " + e + " mensagens");
                    else {
                        let e = document.getElementById("modulo_mensagens_titulo").value
                          , t = document.getElementById("modulo_mensagens_favoritar").checked;
                        e.length > 1 ? window.wacore.function.gravaraudio(e, t) : Swal.fire({
                            title: '<strong data-translate-key="oops"></strong>',
                            html: '<p data-translate-key="typeATitleForTheAudio"></p>',
                            icon: "error"
                        })
                    }
                },
                hashtag_excluir: function(e) {
                    document.getElementById("hashtag_id_" + e).remove(),
                    wacore.fetch.requestRemoveHashtag({
                        id: e
                    })
                },
                msgpronta_excluir: function(e) {
                    Swal.fire({
                        icon: "warning",
                        title: '<strong data-translate-key="areYouSureYouWantToRemoveThisMessage"></strong>',
                        showDenyButton: !0,
                        confirmButtonText: '<span data-translate-key="yes"></span>',
                        denyButtonText: '<span data-translate-key="no"></span>',
                        allowOutsideClick: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((t=>{
                        t.isConfirmed && (document.getElementById("msgpronta_id_" + e).remove(),
                        wacore.fetch.requestRemoveMsgpronta({
                            id: e
                        }))
                    }
                    ))
                },
                msgpronta_lista: function(e) {
                    let t = ""
                      , a = ""
                      , n = wacore.crm.msgprontas.lista;
                    for (let o in n) {
                        let s = "";
                        if ("texto" == n[o].type && (s = n[o].messages[0]),
                        "script" == n[o].type && (s = n[o].messages.length + " mensagens"),
                        "imagem" == n[o].type && (s = "1 imagem"),
                        "voz" == n[o].type && (s = "1 gravação por voz"),
                        "disparomassa" == e)
                            n[o].title && ("script" != n[o].type ? t += `<option value="${n[o].id}">(${n[o].type}) ${n[o].title}</option>` : "script" == n[o].type && (a += `<option value="${n[o].id}">(${n[o].type}) ${n[o].title}</option>`));
                        else if (n[o].title) {
                            let e = '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44zm.678 2.033-2.361 4.792-5.246.719 3.848 3.643-.948 5.255 4.707-2.505 4.707 2.505-.951-5.236 3.851-3.662-5.314-.756z" fill-rule="nonzero" fill="currentColor"></path></svg>';
                            window.wacore.crm.fav_msgs && window.wacore.crm.fav_msgs.filter((function(e) {
                                return e.id == n[o].id && e.username == wacore.user.variables.username
                            }
                            ))[0] && (e = '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="orange" d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z" fill-rule="nonzero"/></svg>'),
                            t += `\n                    <div class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">\n                        <div class="d-flex gap-2 w-100 justify-content-between" onclick="window.wacore.modules.preSendMsgPronta('${n[o].id}')" role="button">\n                          <div> \n                            <h6 class="mb-0">${n[o].title}</h6>\n                            <p class="mb-0 opacity-75 limit-text">${s}</p>\n                          </div>\n                        </div>\n                        <small class="text-center">\n                            <span class="opacity-50">${n[o].type}</span>\n                            <span onclick="window.wacore.modules.favoritar('${n[o].id}')" title="favoritar" role="button">${e}</span>\n                        </small>\n                    </div>`
                        }
                    }
                    $("#list-msgsprontas").html(t),
                    window.wacore.disparomassa.configs.status || ($("#dm_lista_msgsprontas").html(t),
                    $("#dm_lista_scripts").html(a))
                },
                listaMsgsProntas: function() {
                    if (document.querySelectorAll(".quick-chat-msg") && (document.querySelectorAll(".quick-chat-msg").forEach((function(e) {
                        e.remove()
                    }
                    )),
                    window.wacore.crm.fav_msgs))
                        for (var e = 0; e < window.wacore.crm.fav_msgs.length; e++)
                            window.wacore.crm.fav_msgs[e].username == wacore.user.variables.username && window.wacore.modules.favoriteAdd(window.wacore.crm.fav_msgs[e]);
                    let t = '<div class="list-group">'
                      , a = wacore.crm.msgprontas.lista;
                    for (let e in a)
                        if (a[e].title) {
                            let n = '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44zm.678 2.033-2.361 4.792-5.246.719 3.848 3.643-.948 5.255 4.707-2.505 4.707 2.505-.951-5.236 3.851-3.662-5.314-.756z" fill-rule="nonzero" fill="currentColor"></path></svg>';
                            window.wacore.crm.fav_msgs && window.wacore.crm.fav_msgs.filter((function(t) {
                                return t.id == a[e].id && t.username == wacore.user.variables.username
                            }
                            ))[0] && (n = '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="orange" d="m11.322 2.923c.126-.259.39-.423.678-.423.289 0 .552.164.678.423.974 1.998 2.65 5.44 2.65 5.44s3.811.524 6.022.829c.403.055.65.396.65.747 0 .19-.072.383-.231.536-1.61 1.538-4.382 4.191-4.382 4.191s.677 3.767 1.069 5.952c.083.462-.275.882-.742.882-.122 0-.244-.029-.355-.089-1.968-1.048-5.359-2.851-5.359-2.851s-3.391 1.803-5.359 2.851c-.111.06-.234.089-.356.089-.465 0-.825-.421-.741-.882.393-2.185 1.07-5.952 1.07-5.952s-2.773-2.653-4.382-4.191c-.16-.153-.232-.346-.232-.535 0-.352.249-.694.651-.748 2.211-.305 6.021-.829 6.021-.829s1.677-3.442 2.65-5.44z" fill-rule="nonzero"/></svg>'),
                            t += `\n                        <div class="list-group-item list-group-item-action" id="msgpronta_id_${a[e].id}" style="padding: 4px 20px;">\n                          <div class="d-flex w-100 justify-content-between">\n                            <p class="text-bold mb-0">${a[e].title}</p>\n                            <small>\n\n                            <span style="display: inline-block; margin-right:10px" onclick="window.wacore.modules.favoritar('${a[e].id}')" title="favoritar" role="button">${n}</span> \n                            \n                            <span style="display: inline-block;" role="button" onclick="window.wacore.modules.msgpronta_excluir('${a[e].id}')"><svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="#ff000073" d="M19 24h-14c-1.104 0-2-.896-2-2v-16h18v16c0 1.104-.896 2-2 2zm-7-10.414l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm10-8.586h-20v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2zm-8-3h-4v1h4v-1z"/></svg></span>\n                            </small>\n                          </div>\n                          <p class="mb-1">${a[e].type}</p>\n                        </div>\n                      `
                        }
                    t += "</div>",
                    document.getElementById("lista_msgsprontas") && (document.getElementById("lista_msgsprontas").innerHTML = t)
                },
                openMessages: function() {
                    var e = document.getElementById("modulo_page");
                    new bootstrap.Offcanvas(e).show(),
                    $("#modulo_titulo").text(""),
                    $("#modulo_titulo").attr("data-translate-key", "messagesAndScriptsReady"),
                    $("#modulo_body").html('\n    <nav>\n        <div class="nav nav-tabs" id="nav-tab" role="tablist">\n            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><span data-translate-key="messages"></span></button>\n            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><span data-translate-key="readyScripts"></span></button>\n        </div>\n    </nav>\n\n    <div class="tab-content mt-3" id="nav-tabContent">\n      <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">\n        <div class="alert alert-primary d-flex align-items-center" role="alert">\n            <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Warning:">\n            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>\n            </svg>\n            <div data-translate-key="informativeMessageCreate"> \n            </div>\n        </div>\n\n        <form action="" pg="form_addmsgsprontas" method="POST" style="padding: 15px;background-color: #efefef; border-radius:15px;margin-bottom: 20px;">\n          <h5 data-translate-key="addMessage"></h5>\n          <div class="mb-3 mt-3">\n            <select class="form-select mt-2 form-modify" id="modulo_mensagens_tipo" required onchange="window.wacore.modules.mensagem_request();">\n            <option value="selecioneotipo" selected data-translate-key="selectMessageType"></option>\n            <option value="texto" data-translate-key="textMessage"></option>\n            <option value="voz" data-translate-key="voiceMessage"></option>\n            <option value="imagem" data-translate-key="imageMessage"></option>\n            </select>\n          </div>\n          <div id="createFormAddMsg"></div>\n        </form>\n        <h4 class="mt-2 mb-2" data-translate="list"></h3>\n        <div id="lista_msgsprontas"></div>\n    </div>\n    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">\n      <div class="alert alert-primary d-flex align-items-center" role="alert">\n        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Warning:">\n            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>\n        </svg>\n        <div data-translate-key="scriptInformationalMessage"> \n      </div>\n    </div>\n    <form action="" pg="form_addscript" method="POST" style="padding: 15px;background-color: #efefef; border-radius:15px;margin-bottom: 20px;">\n    <div class="row">\n        <div class="col-6"> \n        <div class="mb-3">\n        <span style="font-weight:500" data-translate-key="titleForReference"></span>\n        <input type="text" class="form-control form-modify mt-2" id="modulo_script_titulo" placeholder="" data-translate-key="typeTheTitle" required>\n    </div>\n    <div class="dropdown">\n        <button class="form-select form-modify dropdown-toggle" type="button" id="script_mgsSelect" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" data-translate-key="selectInOrderOfSubmission">\n        </button>\n        <ul class="dropdown-menu mt-2 " id="list_scriptprontomsg" aria-labelledby="script_mgsSelect" style="width:100%">\n        </ul>\n        <div class="mb-3 pt-3 form-check">\n        <input type="checkbox" class="form-check-input" id="modulo_script_favoritar">\n        <label class="form-check-label" for="modulo_script_favoritar" data-translate-key="favoriteForMyUser"></label>\n        <br><span data-translate-key="informationalMessageTitle"></span>\n    </div>\n      <div class="mt-3">\n        <span data-translate-key="informationalMessageInterval"></span>\n        </div>\n          <div class="mt-3">\n              <div class="d-grid gap-2 border-top mt-3">\n                  <button class="btn btn-primary btn-lg" type="submit" data-translate-key="toAdd"></button>\n              </div>\n          </div>\n        </div>\n      </div>\n          <div class="col-6">\n            <span style="font-weight:500" data-translate-key="messageSequence"></span>\n            <div id="script_pront_selected" class="mt-2">\n            </div>\n          </div>\n      </div>\n\n    </form>\n    </div>\n'),
                    $("#modulo_footer").html(""),
                    window.wacore.format_translation.translateText(),
                    window.wacore.modules.listaMsgsProntas(),
                    $("#nav-profile-tab").click((function(e) {
                        let t = ""
                          , a = wacore.crm.msgprontas.lista;
                        for (let e in a)
                            a[e].title && "script" != a[e].type && (t += `\n            <label class="dropdown-item"> <input name="selectSP" type="checkbox"  data-id="${a[e].id}" data-type="${a[e].type}" data-title="${a[e].title}">  (${a[e].type}) ${a[e].title} </label>\n            `);
                        document.getElementById("list_scriptprontomsg").innerHTML = t,
                        document.getElementById("script_pront_selected").innerHTML = '<ol class="list-group list-group-numbered lista-selected-msgs"> </ol>',
                        document.querySelectorAll("input[name=selectSP]").forEach((function(e) {
                            e.addEventListener("change", (function(e) {
                                e.currentTarget.checked ? $(".lista-selected-msgs").append(`<li class="list-group-item d-flex justify-content-between align-items-start lista-sp-msgs msg_sp_${e.currentTarget.getAttribute("data-id")}" data-id="${e.currentTarget.getAttribute("data-id")}">\n                <div class="ms-2 me-auto">\n                  <div class="fw-bold">${e.currentTarget.getAttribute("data-title")}</div>\n                </div>\n                <span class="badge bg-primary rounded-pill">${e.currentTarget.getAttribute("data-type")}</span>\n              </li>`) : document.querySelectorAll(`.msg_sp_${e.currentTarget.getAttribute("data-id")}`).forEach((function(e) {
                                    e.remove()
                                }
                                ))
                            }
                            ))
                        }
                        ))
                    }
                    )),
                    $("form[pg=form_addmsgsprontas]").submit((async function(e) {
                        e.preventDefault();
                        let t = 1e3;
                        if ("free" == currentPlan && (t = 3),
                        t <= window.wacore.crm.msgprontas.lista.length)
                            window.wacore.function.modal_plan("Você atingiu o limite de " + t + " mensagens");
                        else {
                            let e = "";
                            "texto" == document.getElementById("modulo_mensagens_tipo").value && (e = document.getElementById("modulo_mensagens_texto").value),
                            document.getElementById("modulo_mensagens_texto").value.length > 1 ? (wacore.fetch.requestAddMsgpronta({
                                title: document.getElementById("modulo_mensagens_titulo").value,
                                favoritar: document.getElementById("modulo_mensagens_favoritar").checked,
                                type: document.getElementById("modulo_mensagens_tipo").value,
                                messages: e
                            }),
                            Swal.fire({
                                title: '<strong data-translate-key="readyMessageAdded"></strong>',
                                html: '<p data-translate-key="sendItToYourCustomerWithJustOneClick"></p>',
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })) : Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: '<p data-translate-key="typeTheText"></p>',
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                        }
                    }
                    )),
                    $("form[pg=form_addscript]").submit((async function(e) {
                        if (e.preventDefault(),
                        document.getElementById("modulo_script_titulo").value.length > 1) {
                            let e = [];
                            document.querySelectorAll(".lista-sp-msgs").forEach((function(t) {
                                t.getAttribute("data-id") && e.push(t.getAttribute("data-id"))
                            }
                            )),
                            e.length > 1 ? (wacore.fetch.requestAddMsgpronta({
                                title: document.getElementById("modulo_script_titulo").value,
                                favoritar: document.getElementById("modulo_script_favoritar").checked,
                                type: "script",
                                messages: e
                            }),
                            Swal.fire({
                                title: '<strong data-translate-key="createdScript"></strong>',
                                html: '<p data-translate-key="sendItToYourCustomerWithJustOneClick"></p>',
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })) : Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: '<p data-translate-key="selectMoreThaOneMessage"></p>',
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                        } else
                            Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: '<p data-translate-key="typeTheTitleReference"></p>',
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                    }
                    ))
                },
                openHashtagTransfer: function() {
                    var e = document.getElementById("modulo_page");
                    new bootstrap.Offcanvas(e).show();
                    let t = wacore.crm.getList()
                      , a = "";
                    for (let e in t)
                        "default-chats" != t[e].id && t[e].title && (a += `<option value="${t[e].id}">${t[e].title}</option>`);
                    let n = `\n                <nav>\n  <div class="nav nav-tabs" id="nav-tab" role="tablist">\n    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Lista</button>\n    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Adicionar</button>\n  </div>\n</nav>\n\n<div class="tab-content mt-3" id="nav-tabContent">\n  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">\n    <div id="lista_hashtags"></div>\n    </div>\n    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">\n      <form action="" pg="form_addhashtag" method="POST">\n        <div class="mb-3 border-top pt-3">\n          <span style="font-weight:500">Quando conter na mensagem a hashtag:</span>\n\n          <input type="text" class="form-control mt-2" id="hashtag-addname" placeholder="Digite uma #hashtag" value="#" required>\n          <small>Exemplo: #facebook #promoçãodiadospais</small>\n        </div>\n          <div class="mb-3">\n          <span style="font-weight:500">A conversa será movida para a lista:</span>\n            <select class="form-select mt-2" id="hashtag-addlist" required>\n              ${a}\n            </select>\n          </div>\n        <div class="d-grid gap-2 p-3">\n        <button class="btn btn-primary btn-lg" type="button" id="hashtag-button">Adicionar</button>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>\n`;
                    $("#modulo_titulo").text("Transferência por #hashtag"),
                    $("#modulo_body").html(n),
                    $("#modulo_footer").html("");
                    let o = '<div class="list-group">';
                    for (let e in wacore.crm.hashtags.lista)
                        if (wacore.crm.hashtags.lista[e].hashtag) {
                            var s = wacore.crm.hashtags.lista[e].lista
                              , r = wacore.crm.getList().filter((t=>t.id === wacore.crm.hashtags.lista[e].lista));
                            r && r[0] && (s = r[0]?.title),
                            o += `\n                        <div class="list-group-item list-group-item-action" id="hashtag_id_${wacore.crm.hashtags.lista[e].id}">\n                          <div class="d-flex w-100 justify-content-between">\n                            <h5 class="mb-1">${wacore.crm.hashtags.lista[e].hashtag}</h5>\n                            <small role="button" onclick="window.wacore.modules.hashtag_excluir('${wacore.crm.hashtags.lista[e].id}', '${wacore.crm.hashtags.lista[e].hashtag}')"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="currentColor" d="M19 24h-14c-1.104 0-2-.896-2-2v-16h18v16c0 1.104-.896 2-2 2zm-7-10.414l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm10-8.586h-20v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2zm-8-3h-4v1h4v-1z"/></svg></small>\n                          </div>\n                          <p class="mb-1">Mover para: <B>${s}</b></p>\n                        </div>\n                      \n                      `
                        }
                    o += "</div>",
                    document.getElementById("lista_hashtags").innerHTML = o,
                    document.getElementById("hashtag-button").addEventListener("click", (function(e) {
                        if (document.getElementById("hashtag-addname").value && document.getElementById("hashtag-addlist").value) {
                            const e = {
                                hashtag: document.getElementById("hashtag-addname").value,
                                lista: document.getElementById("hashtag-addlist").value
                            };
                            window.wacore.fetch.requestAddHashtag(e),
                            Swal.fire({
                                title: '<strong data-translate-key="hashtagAdded"></strong>',
                                html: '<p data-translate-key="messageHashtagAdded"></p>',
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                        }
                    }
                    )),
                    document.getElementById("hashtag-addname").addEventListener("keyup", (function(e) {
                        window.wacore.function.hashtag("hashtag-addname")
                    }
                    ))
                },
                list: function() {
                    let e = [{
                        icon: window.wacore.svgs.openIa(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_gpt",
                        keyTitle: "gtpChatIntegrationTitle",
                        keyMessage: "gtpChatIntegrationMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !0,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.audioTranscription(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_audio_transcription",
                        keyTitle: "audioTranscriptionTitle",
                        keyMessage: "audioTranscriptionMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !0,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.magic_pencil(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_msg_apagada",
                        keyTitle: "showHiddenMessages",
                        keyMessage: "showHiddenMessagesMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !1,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.api(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_api",
                        keyTitle: "integrationViaApi",
                        keyMessage: "integrationViaApiMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !1,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.webhook(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_webhook",
                        keyTitle: "integrationViaWebhook",
                        keyMessage: "integrationViaWebhookMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !1,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.users_chat(40, 40, "color:var(--button-primary-background)"),
                        referencia: "",
                        keyTitle: "multipleAttendants",
                        keyMessage: "multipleAttendantsMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !0,
                        open_type: "modal",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.kanban(40, 40, "color:var(--button-primary-background)"),
                        referencia: "",
                        keyTitle: "crmModuleTitle",
                        keyMessage: "crmModuleMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !0,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.fav_messages(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_mensagens",
                        keyTitle: "promptMessagesTitle",
                        keyMessage: "promptMessagesMessage",
                        titulo: "",
                        descricao: "",
                        status: !0,
                        force: !0,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.magic_pencil(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_transf_novoatendimento",
                        keyTitle: "transferNewServiceTitle",
                        keyMessage: "transferNewServiceMessage",
                        titulo: "Transferência (Novo atendimento)",
                        descricao: "Toda vez que um atendimento for iniciado (A marcação de atendente for adicionada a conversa), o card será movido automaticamente para uma determinada lista.",
                        status: !1,
                        force: !1,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.magic_pencil(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_transf_porhorario",
                        keyTitle: "transferByTimeTitle",
                        keyMessage: "transferByTimeMessage",
                        titulo: "Transferência (Por horário)",
                        descricao: "Sempre que chegar no horário determinado, o sistema moverá todos os cards de uma lista para outra lista.",
                        status: !1,
                        force: !1,
                        open_type: "tab",
                        valor: 0
                    }, {
                        icon: window.wacore.svgs.hashtag(40, 40, "color:var(--button-primary-background)"),
                        referencia: "modulo_transf_hashtag",
                        keyTitle: "transferByHashtagTitle",
                        keyMessage: "transferByHashtagMessage",
                        titulo: "Transferência (Por hashtag)",
                        descricao: "Configure hashtags padrões que se mencionadas em uma conversa, o sistema moverá o card automaticamente para uma determinada lista.",
                        status: !0,
                        force: !1,
                        open_type: "tab",
                        valor: 0
                    }]
                      , t = "";
                    for (let a in e)
                        if (e[a].status) {
                            let n = ""
                              , o = ""
                              , s = "";
                            e[a].force && (o = "disabled",
                            s = "checked"),
                            "modulo_gpt" == e[a].referencia && (s = window.wacore.config.gpt ? "checked" : ""),
                            "modulo_audio_transcription" == e[a].referencia && (s = window.wacore.config.transcription ? "checked" : ""),
                            "modulo_msg_apagada" == e[a].referencia && (window.wacore.config.msgDeleted ? s = "checked" : (s = "",
                            "free" == currentPlan && (o = "disabled"))),
                            "modulo_api" == e[a].referencia && ("premium" == currentPlan ? (o = "disabled",
                            s = "checked",
                            n = '<div class="btn btn-primary" onclick="window.wacore.api.modals.showApiConfig()"><span data-translate-key="toSetUp"></span></div>') : o = "disabled"),
                            "modulo_webhook" == e[a].referencia && ("premium" == currentPlan ? (s = window.wacore.webhook.config.active ? "checked" : "",
                            n = '<div class="btn btn-primary" onclick="window.wacore.webhook.modals.showWebHookConfig()"><span data-translate-key="toSetUp"></span></div>') : o = "disabled"),
                            "modulo_transf_hashtag" == e[a].referencia && (n = '<div class="btn btn-primary" onclick="window.wacore.modules.openHashtagTransfer()"><span data-translate-key="toSetUp"></span></div>',
                            s = wacore.crm.hashtags.status ? "checked" : ""),
                            "modulo_mensagens" == e[a].referencia && (n = '<div class="btn btn-primary" onclick="window.wacore.modules.openMessages()"><span data-translate-key="toSetUp"></span></div>'),
                            t += `<div class="col-md-4 mb-4">\n                <div class="card shadow-lg">\n                <div class="card-body p-3" style="min-height: 200px;">\n                <div class="row">\n                <div class="col-auto">\n                <div class="">\n                    ${e[a].icon}\n                </div>\n                </div>\n                <div class="col-md-10 my-auto">\n                <div class="h-100">\n                <h5 class="mb-1" data-translate-key=${e[a].keyTitle}>${e[a].titulo}  </h5>\n                <p\n                class="mb-0 font-weight-bold text-sm" \n                style="color:black;font-weight=400" data-translate-key=${e[a].keyMessage}>${e[a].descricao}</p>\n                </div>\n                </div>\n                </div>\n                </div>\n                <div class="card-footer">\n\n                <div style="display:inline-block">   \n                    <label class="switch">\n                    <input id="${e[a].referencia}" type="checkbox" class="checkbox_modules" ${s} ${o}>\n                    <span class="slider round"></span>\n                  </label>\n                  </div>\n\n                  <div style="display:inline-block; float:right;">${n}\n                </div>\n              </div>\n            </div>\n          </div>`
                        }
                    return t
                }
            }
        }
        ,
        295: ()=>{
            window.wacore.toRequest = function(e, t) {
                try {
                    window.postMessage({
                        type: e,
                        msg: t
                    }, "*")
                } catch (e) {}
            }
            ,
            window.wacore.request = {
                storageCookie: function(e, t) {
                    try {
                        "get" == e && window.postMessage({
                            type: "req_cookie",
                            data: {
                                type: "get"
                            }
                        }, "*"),
                        "set" == e && window.postMessage({
                            type: "req_cookie",
                            data: {
                                type: "set",
                                cookie: t
                            }
                        }, "*")
                    } catch (e) {}
                },
                cookie_response: function(e) {
                    try {
                        e.msg ? window.wacore.user.variables.cookie = e.msg : window.wacore.user.variables.cookie = null,
                        window.wacore.user.functions.checkAccountStatus()
                    } catch (e) {}
                },
                extension_updated: async function() {
                    setTimeout((()=>{
                        Swal.fire({
                            position: "top-end",
                            title: '<strong data-translate-key="titleExtensionUpdated"></strong>',
                            showConfirmButton: !1,
                            timer: 2e3,
                            icon: "success",
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        })
                    }
                    ), 1e4)
                },
                media_response: async function(e) {
                    try {
                        window.wacore.whatsapp.upsertChat(e.chat, (async function(t) {
                            var a = e.base64.includes("audio/ogg") ? "audio" : "file"
                              , n = window.wacore.whatsapp.base64ImageToFile(e.base64, a)
                              , o = (await window.wacore.whatsapp.procFiles(t, [{
                                file: n
                            }]))._models[0];
                            e.base64.includes("audio/ogg") && (o.mediaPrep._mediaData.type = "ptt"),
                            await o.sendToChat(t, {
                                caption: ""
                            })
                        }
                        )),
                        wacore.user.variables.status && wacore.function.assignCard(e.chat)
                    } catch (e) {}
                },
                api_post: function(e, t, a, n, o, s, r="") {
                    try {
                        window.postMessage({
                            type: "req_api",
                            title: e,
                            url: t,
                            body: a,
                            response: n,
                            cookie: o,
                            noauth: s,
                            keyApiOpenAi: r
                        }, "*")
                    } catch (e) {}
                },
                api_get: function(e, t, a, n, o, s) {
                    try {
                        window.postMessage({
                            type: "req_api_get",
                            title: e,
                            url: t,
                            body: a,
                            response: n,
                            cookie: o,
                            noauth: s
                        }, "*")
                    } catch (e) {}
                },
                api_response: async function(e) {
                    try {
                        switch (e.title) {
                        case "setKeyApiOpenAi":
                            e.msg.error ? Swal.fire({
                                title: '<strong data-translate-key="titleRequestFailed"></strong>',
                                html: '<p data-translate-key="messageRequestFailedKeyApi"></p>',
                                icon: "error",
                                footer: '<p data-translate-key="messageRequestFailedFooter"></p>',
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }) : Swal.fire({
                                title: '<strong data-translate-key="titleRequestSentKeyPApi"></strong>',
                                html: '<p data-translate-key="messageRequestSentKeyApi"></p>',
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            });
                        case "scheduller_list":
                            window.wacore.scheduller.functions.start(e.msg.jobs);
                            break;
                        case "get_messages_deleted":
                            window.wacore.message.callbacks.respGetDeletedMessages(e);
                            break;
                        case "get_viewonce_messages":
                            window.wacore.message.callbacks.respGetViewOnceMessages(e);
                            break;
                        case "set_webhook":
                            e.msg.error || Swal.fire({
                                position: "top-end",
                                title: '<strong data-translate-key="titleSettingsWebhook"></strong>',
                                showConfirmButton: !1,
                                timer: 1500,
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            });
                            break;
                        case "get_api_unprocessed_logs":
                            e.msg.error || window.wacore.api.callbacks.getQtdeLogsErrorApiResult(e.msg.unprocessedLogs);
                            break;
                        case "get_api_logs":
                            e.msg.logs && window.wacore.api.callbacks.getLogsApiResult(e.msg.logs);
                            break;
                        case "sendQR":
                            0 == wacore.whatsapp.solicitarqrcode.count && (e.msg.error ? (Swal.fire({
                                title: '<strong data-translate-key="titleRequestFailed"></strong>',
                                html: '<p data-translate-key="messageRequestFailed"></p>',
                                icon: "error",
                                footer: '<p data-translate-key="messageRequestFailedFooter"></p>',
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            wacore.whatsapp.solicitarqrcode.status = !1) : (wacore.whatsapp.solicitarqrcode.count = 1,
                            wacore.whatsapp.solicitarqrcode.status = !0,
                            wacore.whatsapp.getQRCode(),
                            Swal.fire({
                                title: '<strong data-translate-key="titleRequestSent"></strong>',
                                html: '<p data-translate-key="messageRequestSent"></p>',
                                icon: "success",
                                footer: '<p data-translate-key="messageRequestSentFooter"></p>',
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })));
                            break;
                        case "getPlan_result":
                            if (usersCount = e.msg.channel.usersCount,
                            currentPlan = e.msg.plan,
                            window.wacore.api.variables.tokenApi = e.msg.channel.token_api,
                            window.wacore.config.msgDeleted = (e.msg.channel.msgDeleted?.active ?? !1) && "premium" == currentPlan,
                            window.wacore.config.hasConfiguredTokenOpenAI = e.msg.channel.gpt.hasConfiguredTokenOpenAI,
                            window.wacore.config.gpt = "premium" == currentPlan && e.msg.channel.gpt.hasConfiguredTokenOpenAI,
                            window.wacore.config.transcription = "premium" == currentPlan && e.msg.channel.gpt.hasConfiguredTokenOpenAI,
                            window.wacore.webhook.config = e.msg.channel.webhook,
                            document.getElementById("btn-admin-access").hidden = "premium" != currentPlan,
                            window.wacore.crm.datahoje = e.msg.datahoje,
                            window.wacore.crm.staff_chat = e.msg.chat_staff,
                            wacore.crm.startKanban(e.msg, !0),
                            Store.Msg && Store.Msg._models)
                                for (const e of Store.Msg._models)
                                    window.wacore.message.functions.pushNewMessageCopy(e);
                            if (wacore.scheduller.functions.start(e.msg.channel.schedulledMessages),
                            wacore.whatsapp.renderTabAll(),
                            wacore.request.storageCookie("get"),
                            window.localStorage.getItem("wapp:versionnews") || window.localStorage.setItem("wapp:versionnews", 0),
                            window.wacore.function.notificacoesLista = e.msg.notifications,
                            wacore.function.checkNotificacoes(),
                            window.wacore.serverApi = "wapremium",
                            "free" == currentPlan && ($("#btn-plan").html(`\n                        <button class="plan-title" title="" data-translate-key="FREEplan" role="button" onclick="window.wacore.function.assinar()">\n                            ${window.wacore.svgs.module_free(20, 20, "margin-right: 6px;display: inline-block;margin-top: -4px;")}${currentPlan}\n                        </button>`),
                            e.msg?.planActive?.freeStatus && ($("#side").before(`\n                            <div class="alert alert-warning mx-2  mb-0 mt-1 chat-list-info-header" role="alert" onclick="window.wacore.function.planos()"> \n                                <div>\n                                    <span>${window.wacore.svgs.warning(40, 40, "margin-right: 10px;")}</span>\n                                    <small data-translate-key="youAreInThePlan"></small> <b data-translate-key="FREE"></b> <span data-translate-key="withLimitedResources"> </span> <br> <span data-translate-key="signUpForAPlanRightNow"></span> <b data-translate-key="SUBSCRIBETOPLAN"></b>\n                                </div>\n                            </div>`),
                            window.wacore.format_translation.translateText())),
                            "basic" == currentPlan && ($("#btn-plan").html(`\n                        <button class="plan-title" title="" data-translate-key="BASICplan" role="button" onclick="window.wacore.function.assinar()">\n                            ${window.wacore.svgs.module_basic(20, 20, "margin-right: 6px;display: inline-block;margin-top: -4px;")}${currentPlan}\n                        </button>`),
                            e.msg?.planActive?.freeStatus && ($("#side").before(`\n                            <div class="alert alert-warning mx-2 mb-0 mt-1 chat-list-info-header" role="alert" onclick="window.wacore.function.planos()"> \n                                <div>\n                                    <span>${window.wacore.svgs.warning(40, 40, "margin-right: 10px;")}</span>\n                                    <small data-translate-key="youAreInThePlan"> </small> <b data-translate-key="BASIC"></b> <span data-translate-key="howereInAPeriodOf"> </span> <b data-translate-key="TEST"></b><br> <span data-translate-key="signUpForAPlanRightNow"> </span> <b data-translate-key="SUBSCRIBETOPLAN"></b>\n                                </div>\n                            </div>`),
                            window.wacore.format_translation.translateText())),
                            "premium" == currentPlan && ($("#btn-plan").html(`\n                        <button class="plan-title premium" title="" data-translate-key="PREMIUMplan" role="button" onclick="window.wacore.function.assinar()">\n                            ${window.wacore.svgs.module_premium(20, 20, "margin-right: 6px;display: inline-block;margin-top: -4px;")}${currentPlan}\n                        </button>`),
                            e.msg?.planActive?.freeStatus && ($("#side").before(`\n                            <div class="alert alert-warning mx-2 mb-0 mt-1 chat-list-info-header" role="alert" onclick="window.wacore.function.planos()"> \n                                <span>${window.wacore.svgs.warning(40, 40, "margin-right: 10px;")}</span>\n                                <div><small data-translate-key="youAreInThePlan"></small> <b data-translate-key="PREMIUM"></b> <span data-translate-key="howereInAPeriodOf"> </span> <b data-translate-key="TEST"></b><br> <span data-translate-key="signUpForAPlanRightNow"> </span> <b data-translate-key="SUBSCRIBETOPLAN"></b></div>\n                            </div>`),
                            window.wacore.format_translation.translateText())),
                            e.msg?.planActive?.endDaysTest && Swal.fire({
                                icon: "warning",
                                title: '<strong data-translate-key="titleNotice"></strong>',
                                html: e.msg.planActive.message,
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            !e.msg?.planActive?.status)
                                try {
                                    await window.wacore.function.faleconosco("crm"),
                                    setTimeout((async function() {
                                        $(".ldL67._2i3T7").remove(),
                                        $("#menu-l01").remove(),
                                        $(".top-nav").remove(),
                                        $("#fechar-chat").remove(),
                                        $("#topo-buttons").remove(),
                                        $(".btns_msgs_container").remove(),
                                        $("#quick-chat-panel").remove(),
                                        $("#dropdown_msgpronta").remove(),
                                        $(".msgsProntas").remove(),
                                        $("#app").css("width", "100%"),
                                        $("#main").css("width", "70%"),
                                        (await Swal.fire({
                                            title: '<strong data-translate-key="titleRestrictedAccess"></strong>',
                                            text: e.msg.planActive.message,
                                            icon: "warning",
                                            showCancelButton: !0,
                                            cancelButtonText: '<span data-translate-key="buttonCheckSignature"></span>',
                                            confirmButtonText: '<span data-translate-key="contactUs"></span>',
                                            allowEscapeKey: !1,
                                            allowOutsideClick: !1,
                                            didOpen: ()=>{
                                                window.wacore.format_translation.translateText()
                                            }
                                        })).isConfirmed || window.wacore.function.assinar()
                                    }
                                    ), 1e3)
                                } catch (e) {}
                            break;
                        case "login_basic":
                        case "login_premium":
                            window.wacore.user.callbacks.login(e);
                            break;
                        case "accountStatus":
                            e.msg.newlogin ? (window.localStorage.setItem("wapp:username", ""),
                            Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: `<span data-translate-key=${e.msg.keyTranslate}></span>`,
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            window.wacore.user.functions.changeCookie(!1),
                            window.wacore.user.functions.changeStatus(!1),
                            setTimeout((function() {
                                window.location.reload()
                            }
                            ), 3500)) : e.msg.success ? window.wacore.user.functions.changeStatus(!0, e.msg) : window.wacore.user.functions.changeStatus(!1),
                            e.msg.error ? window.wacore.user.functions.changeStatus(!1) : window.wacore.user.functions.changeStatus(!0, e.msg);
                            break;
                        case "simpleAskFromImput":
                            window.wacore.gpt.callbacks.respSimpleAskFromImput(e.msg);
                            break;
                        case "getGptSugestion":
                            window.wacore.gpt.callbacks.respGptSugestion(e.msg);
                            break;
                        case "audioTranscription":
                            window.wacore.gpt.callbacks.respAudioTranscription(e.msg);
                            break;
                        case "changeName":
                            document.querySelectorAll(".user_name_span").forEach((t=>{
                                t.innerHTML = e.msg.name
                            }
                            ));
                            break;
                        case "editaruser":
                            e.msg.success ? (Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: e.msg.message,
                                showConfirmButton: !1,
                                timer: 1500
                            }),
                            wacore.html.tpl_users(),
                            $(".btn-close").click()) : Swal.fire({
                                position: "top-end",
                                icon: "error",
                                title: e.msg.message,
                                showConfirmButton: !1,
                                timer: 1500
                            });
                            break;
                        case "removeruser":
                            $(".btn-close").click(),
                            wacore.html.tpl_users();
                            break;
                        case "dataChannel":
                            wacore.menu_users.render(e.msg.data);
                            break;
                        case "transmissaoAdd":
                            window.wacore.disparomassa.dm_start({
                                id: e.msg.id,
                                title: e.msg.title
                            }),
                            $(".btn-close").click(),
                            $("#btn_criareiniciardm").attr("disabled", !1);
                            break;
                        case "msgProntaAdd":
                            e.msg.favorite && (window.wacore.crm.fav_msgs && (window.wacore.crm.fav_msgs.filter((function(t) {
                                return t.id == e.msg.id && t.username == wacore.user.variables.username
                            }
                            ))[0] || window.wacore.crm.fav_msgs.push({
                                id: e.msg.id,
                                username: wacore.user.variables.username
                            })),
                            window.wacore.modules.listaMsgsProntas(),
                            window.wacore.modules.msgpronta_lista());
                            break;
                        case "favoriteAdd":
                            if (e.msg.add)
                                window.wacore.crm.fav_msgs && (window.wacore.crm.fav_msgs.filter((function(t) {
                                    return t.id == e.msg.id && t.username == wacore.user.variables.username
                                }
                                ))[0] || window.wacore.crm.fav_msgs.push({
                                    id: e.msg.id,
                                    username: wacore.user.variables.username
                                }));
                            else if (window.wacore.crm.fav_msgs) {
                                let t = window.wacore.crm.fav_msgs.filter((function(t) {
                                    return t.id !== e.msg.id && t.username == wacore.user.variables.username
                                }
                                ));
                                window.wacore.crm.fav_msgs = t
                            }
                            window.wacore.modules.listaMsgsProntas(),
                            window.wacore.modules.msgpronta_lista();
                            break;
                        case "listasDm":
                            window.wacore.disparomassa.configs.listasBanco = e.msg.lista;
                            let t = window.wacore.disparomassa.configs.listasBanco
                              , a = '<select class="form-select mb-2" aria-label=".form-select-sm example" id="select-type-dm" onchange="window.wacore.disparomassa.selecionarcontatos(\'listasbanco\')">';
                            a += ' <option selected data-translate-key="selectTheList"></option>';
                            for (let e in t)
                                t[e].title && (a += ` <option value="${t[e]._id}">${t[e].title} - por: ${t[e].username} (${t[e].list.length}) </option>`);
                            a += "</select>\n                        ",
                            $("#dm_selectform").html(a),
                            window.wacore.format_translation.translateText();
                            break;
                        case "metricsList":
                            wacore.menu_metrics.graph(e.msg.data);
                            break;
                        case "finalizarAtendimento":
                            Swal.fire({
                                title: '<strong data-translate-key="titleServiceCompleted"></strong>',
                                html: '<p data-translate-key="messageServiceCompleted"></p>',
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            wacore.crm.fecharChat();
                            break;
                        case "moveCardForNewList":
                            window.wacore.crm.blockmove = !1;
                            break;
                        case "removeCardList":
                            Swal.fire({
                                title: '<strong data-translate-key="titleCardClosed"></strong>',
                                icon: "success",
                                showConfirmButton: !1,
                                timer: 1e3,
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            e.msg.number && wacore.activeChat && wacore.activeChat.includes(e.msg.number) && wacore.function.openChatButtons(wacore.activeChat)
                        }
                    } catch (e) {}
                },
                ws_response: async function(e) {
                    try {
                        switch (e.msg.type) {
                        case "schedulle_add":
                            wacore.scheduller.callbacks.jobAdded(e);
                            break;
                        case "schedulle_status":
                            wacore.scheduller.callbacks.jobStatus(e);
                            break;
                        case "schedulle_start":
                            (t = await window.wacore.scheduller.functions.sendById(e.msg.chatId, e.msg.name, e.msg.message, e.msg.typeSchedule, e.msg.id)) ? wacore.scheduller.requests.postResultSent(e.msg.id, !0, "Agendamento executado com sucesso!") : wacore.scheduller.requests.postResultSent(e.msg.id, !1, "Ocorreu um problema na execução");
                            break;
                        case "api_get_chat":
                            (t = await window.wacore.api.functions.getChatById(e.msg.chatId)) ? window.wacore.api.requests.postResultSentApi(e.msg.id, !0, `Busca ref chatId: ${e.msg.chatId}`, JSON.stringify(t)) : window.wacore.api.requests.postResultSentApi(e.msg.id, !1, `Busca ref chatId: ${e.msg.chatId}`, "");
                            break;
                        case "api_get_chat_messages":
                            (t = await window.wacore.api.functions.getMessagesFromChat(e.msg.pageNumber, e.msg.chatId)) ? window.wacore.api.requests.postResultSentApi(e.msg.id, !0, `Busca ref chatId: ${e.msg.chatId}, página: ${e.msg.pageNumber}`, JSON.stringify(t)) : window.wacore.api.requests.postResultSentApi(e.msg.id, !1, `Busca ref chatId: ${e.msg.chatId}, página: ${e.msg.pageNumber}`, "");
                            break;
                        case "api_get_all_chats":
                            (t = window.wacore.api.functions.getChatList(e.msg.pageNumber, e.msg.includeGroups, e.msg.includeArchiveds)) ? window.wacore.api.requests.postResultSentApi(e.msg.id, !0, `Busca ref página: ${e.msg.pageNumber}`, JSON.stringify(t)) : window.wacore.api.requests.postResultSentApi(e.msg.id, !1, `Busca ref página: ${e.msg.pageNumber}`, "");
                            break;
                        case "api_check_number":
                            "VALID" == (t = await window.wacore.api.functions.checkNumber(e.msg.number)) || "INVALID" == t ? window.wacore.api.requests.postResultSentApi(e.msg.id, !0, t, "") : window.wacore.api.requests.postResultSentApi(e.msg.id, !1, t, "");
                            break;
                        case "api_send_text":
                            (t = await window.wacore.api.functions.sendText(e.msg.number, e.msg.message)) ? window.wacore.api.requests.postResultSentApi(e.msg.id, !1, t, "") : window.wacore.api.requests.postResultSentApi(e.msg.id, !0, "Mensagem enviada com sucesso!", "");
                            break;
                        case "api_send_media":
                            var t;
                            (t = await window.wacore.api.functions.sendMedia(e.msg.number, e.msg.base64, e.msg.caption, e.msg.filename)) ? window.wacore.api.requests.postResultSentApi(e.msg.id, !1, t, "") : window.wacore.api.requests.postResultSentApi(e.msg.id, !0, "Mensagem enviada com sucesso!", "");
                            break;
                        case "module_add_msgsprontas":
                            $(".close-panel-editar").click();
                            var a = e.msg.lista;
                            wacore.crm.msgprontas.lista = a.reverse(),
                            e.msg.username == window.wacore.user.variables.username && Swal.fire({
                                title: '<strong data-translate-key="readyMessageAdded"></strong>',
                                html: '<p data-translate-key="sendItToYourCustomerWithJustOneClick"></p>',
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            window.wacore.modules.msgpronta_lista(),
                            window.wacore.modules.msgpronta_lista("disparomassa");
                            break;
                        case "module_remove_msgpronta":
                            a = e.msg.lista,
                            wacore.crm.msgprontas.lista = a.reverse(),
                            window.wacore.modules.listaMsgsProntas();
                            break;
                        case "module_add_hashtag":
                            wacore.crm.hashtags.lista = e.msg.lista,
                            $(".close-panel-editar").click();
                            break;
                        case "module_remove_hashtag":
                            wacore.crm.hashtags.lista = e.msg.lista;
                            break;
                        case "modulo_msg_apagada":
                            document.getElementById("modulo_msg_apagada").checked = e.msg.status,
                            window.wacore.config.msgDeleted = e.msg.status && ("basic" == currentPlan || "premium" == currentPlan),
                            window.wacore.config.msgDeleted && Swal.fire({
                                position: "top-end",
                                title: '<strong data-translate-key="titleDisplayOfHiddenMessagesActivated"></strong>',
                                showConfirmButton: !1,
                                timer: 2500,
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            });
                            break;
                        case "modulo_webhook":
                            document.getElementById("modulo_webhook").checked = e.msg.status,
                            window.wacore.webhook.config.active = e.msg.status && "premium" == currentPlan,
                            window.wacore.webhook.config.active && Swal.fire({
                                position: "top-end",
                                title: '<strong data-translate-key="titleWebhookActivated"></strong>',
                                showConfirmButton: !1,
                                timer: 2500,
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            });
                            break;
                        case "module_status_hashtag":
                            document.getElementById("modulo_transf_hashtag").checked = e.msg.status,
                            wacore.crm.hashtags.status = e.msg.status,
                            wacore.crm.hashtags.status = e.msg.status,
                            e.msg.status && Swal.fire({
                                position: "top-end",
                                title: '<strong data-translate-key="titleHashtagTransferActivated"></strong>',
                                showConfirmButton: !1,
                                timer: 2500,
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            });
                            break;
                        case "users_list":
                            window.wacore.staff.renderLenghtDevices(e.msg.msg),
                            wacore.users = e.msg.msg;
                            break;
                        case "request_transferir":
                            window.wacore.function.receber_transferencia(e.msg);
                            break;
                        case "devices":
                            window.wacore.staff.renderLenghtDevices(e.msg.msg);
                            break;
                        case "chat_staff":
                            window.wacore.staff.addMessageChatStaff(new Date(1e3 * e.msg.messages.date).toLocaleDateString("pt-BR"), e.msg.messages),
                            document.querySelector(".chat-finished").scrollIntoView({
                                block: "end",
                                behavior: "auto"
                            }),
                            window.wacore.staff.chat_count = parseInt(window.wacore.staff.chat_count) + 1,
                            window.wacore.staff.chat_count > 0 && (document.getElementById("chat-interno-count").innerHTML = `<i class="countChatInterno">${window.wacore.staff.chat_count}</i></span>`);
                            break;
                        case "assign_card":
                            window.wacore.function.addCardUser(e.msg);
                            break;
                        case "move_card":
                            await window.wacore.crm.changeCardList(e.msg.card, e.msg.newList, e.msg.oldList, e.msg.position);
                            break;
                        case "new_msg_deleted":
                            window.wacore.message.callbacks.newMsgDeleted(e);
                            break;
                        case "new_once_msg":
                            window.wacore.message.callbacks.newViewOnceMsg(e);
                            break;
                        case "remove_card":
                            window.wacore.crm.removerCardInList(e.msg.card, e.msg.idList, !0);
                            break;
                        case "create_list":
                            wacore.crm.kanbanBoard && (wacore.crm.kanbanBoard.addColumn(e.msg.id, e.msg.title),
                            wacore.crm.list.push({
                                id: e.msg.id,
                                title: e.msg.title,
                                cards: [],
                                key: e.msg.key
                            }),
                            document.querySelector(".kanban_board_container").scrollTo(1e9, 0),
                            window.wacore.crm.updateListFilter(),
                            window.laodDragula());
                            break;
                        case "change_list_title":
                            document.querySelector(`#kabank_colum-${e.msg.id}`) && (document.querySelector(`#kabank_colum-${e.msg.id}`).querySelector(".kanban_column_header > span").innerText = e.msg.title),
                            wacore.crm.getOneList(e.msg.id).title = e.msg.title,
                            window.wacore.crm.updateListFilter();
                            break;
                        case "change_tag_list":
                            (o = wacore.crm.getTags()).map(((t,a)=>{
                                t.id === e.msg.id && (o[a].label = e.msg.title)
                            }
                            )),
                            wacore.crm.setTags(o),
                            wacore.activeChat && wacore.crm.drawtagsChip(wacore.activeChat.split("@")[0]);
                            var n = wacore.crm.getChatIdsFromTag(e.msg.id);
                            for (const e of n)
                                wacore.whatsapp.manipulate_chatlist("number", e);
                            break;
                        case "tags_addcard":
                            wacore.crm.createOrUpdateCard({
                                id: e.msg.card
                            });
                            let s = wacore.crm.getCard(e.msg.card);
                            var o;
                            s && ((o = s.tags) ? e.msg.value ? o.push(e.msg.id) : o = o.filter((t=>t !== e.msg.id)) : o = [e.msg.id],
                            s.tags = o,
                            wacore.crm.drawtagsChip(e.msg.card.split("@")[0]),
                            wacore.whatsapp.manipulate_chatlist("number", e.msg.card));
                            break;
                        case "move_list":
                            window.wacore.crm.updateListFilter();
                            break;
                        case "remove_list":
                            document.querySelector(`#kabank_colum-${e.msg.id}`) && document.querySelector(`#kabank_colum-${e.msg.id}`).parentNode.remove(),
                            wacore.crm.removeList(e.msg.id),
                            Swal.fire({
                                position: "top-end",
                                title: `<strong data-translate-key="titleList"></strong> ${e.msg.title} <strong data-translate-key="removedBy"></strong> ${e.msg.user} `,
                                showConfirmButton: !1,
                                timer: 3e3,
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            window.wacore.crm.updateListFilter()
                        }
                    } catch (e) {}
                }
            },
            window.wacore.fetch = {
                requestSendQR: function(e) {
                    wacore.request.api_post("sendQR", "user/send/qrcode/", {
                        codigo: e.codigo,
                        session: window.localStorage.getItem("wapp:sessionId"),
                        qrcode: e.qrcode
                    }, !0, null, !0)
                },
                getPlan: function() {
                    function e(e) {
                        return e.charCodeAt(0)
                    }
                    var t = null;
                    window.Store.Contact.get(window.Store.getMeUser()?._serialized)?.profilePicThumb.eurl && (t = window.Store.Contact.get(window.Store.getMeUser()?._serialized)?.profilePicThumb.eurl);
                    let a = window.Store.Contact.get(window.Store.getMeUser()?._serialized)?.pushname;
                    wacore.request.api_post("getPlan_result", "channel/get_plan/", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        avatar: t,
                        name: a,
                        code: function(t) {
                            var a, n, o, s = "", r = 0;
                            for (n = 0; n < t.length; n++)
                                r++,
                                a = e(t.substr(n, 1)) + e("assbdFbdpdPdpfPdAAdpeoseslsQQEcDDldiVVkadiedkdkLLnm".substr(r, 1)),
                                50 == r && (r = 1),
                                a > 255 && (a -= 256),
                                s += (o = a,
                                String.fromCharCode(o));
                            return s
                        }(wacore.sitechannel)
                    }, !0, wacore.user.variables.cookie)
                },
                requestAccountStatus: function() {
                    wacore.request.api_get("accountStatus", "auth/account/status/?sitechannel=" + wacore.sitechannel + "&channel=" + wacore.channel, null, !0, wacore.user.variables.cookie)
                },
                requestChangeName: function(e) {
                    wacore.request.api_post("changeName", "user/change/name/", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        username: wacore.user.variables.username,
                        name: e.name
                    }, !0, wacore.user.variables.cookie)
                },
                requestEditarUser: function(e) {
                    wacore.request.api_post("editaruser", "channel/user/editar", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        username: e.username,
                        name: e.name,
                        admin: e.admin
                    }, !0, null, !0)
                },
                requestRemoverUser: function(e) {
                    wacore.request.api_post("removeruser", "channel/user/remover", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        username: e.username
                    }, !0, null, !0)
                },
                requestDataChannel: function() {
                    wacore.request.api_get("dataChannel", "channel/getusers/?sitechannel=" + wacore.sitechannel + "&channel=" + wacore.channel, null, !0, wacore.user.variables.cookie)
                },
                requestmovehashtag: function(e) {
                    wacore.request.api_post("moveHashtag", "channel/card/move_hashtag/", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        card: e.card,
                        newlist: e.newlist,
                        hashtag: e.hashtag
                    }, !1, wacore.user.variables.cookie)
                },
                requestAddHashtag: function(e) {
                    wacore.request.api_post("hashtagStatus", "channel/modules/transf_hashtag_add", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        hashtag: e.hashtag,
                        lista: e.lista
                    }, !0, wacore.user.variables.cookie)
                },
                requestRemoveHashtag: function(e) {
                    wacore.request.api_post("hashtagRemove", "channel/modules/transf_hashtag_remove", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        id: e.id
                    }, !0, wacore.user.variables.cookie)
                },
                requestStatusHashtag: function(e) {
                    wacore.request.api_post("hashtagAdd", "channel/modules/transf_hashtag_status", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        status: e.status
                    }, !0, wacore.user.variables.cookie)
                },
                requestStatusMsgDeleted: function(e) {
                    wacore.request.api_post("msgDeleteStatus", "channel/modules/message_deleted_status", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        status: e.status
                    }, !0, wacore.user.variables.cookie)
                },
                requestAddTransmissao: function(e) {
                    wacore.request.api_post("transmissaoAdd", "channel/modules/transmissao_add", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        salvar: e.salvar,
                        title: e.title,
                        list: e.list,
                        username: wacore.user.variables.username
                    }, !0, wacore.user.variables.cookie)
                },
                requestListasDm: function() {
                    wacore.request.api_get("listasDm", "channel/modules/listas_dm/?sitechannel=" + wacore.sitechannel, null, !0, wacore.user.variables.cookie)
                },
                requestAddMsgpronta: function(e) {
                    wacore.request.api_post("msgProntaAdd", "channel/modules/msgsprontas_add", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        favoritar: e.favoritar,
                        title: e.title,
                        type: e.type,
                        msg: e.messages,
                        username: wacore.user.variables.username
                    }, !0, wacore.user.variables.cookie)
                },
                requestFavoriteAdd: function(e) {
                    wacore.request.api_post("favoriteAdd", "channel/modules/msgsprontas_favorite", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        id: e.id,
                        username: wacore.user.variables.username
                    }, !0, wacore.user.variables.cookie)
                },
                requestRemoveMsgpronta: function(e) {
                    wacore.request.api_post("msgprontaRemove", "channel/modules/msgsprontas_remove", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        id: e.id
                    }, !0, wacore.user.variables.cookie)
                },
                requestMetrics: function() {
                    wacore.request.api_get("metricsList", "channel/metrics/" + wacore.sitechannel + "/", null, !0, wacore.user.variables.cookie)
                },
                requestTransferir: function(e) {
                    wacore.request.api_post("assignCard", "channel/card/transferir/", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        card: e.card,
                        usuariosend: e.usuariosend,
                        user: e.user,
                        name: e.name
                    }, !1, wacore.user.variables.cookie)
                },
                requestAssignCard: function(e) {
                    wacore.request.api_post("assignCard", "channel/card/assign/", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        card: e.card,
                        user: e.user,
                        name: e.name
                    }, !1, wacore.user.variables.cookie)
                },
                requestFinalizarAtendimento: function(e) {
                    wacore.request.api_post("finalizarAtendimento", "channel/card/endchat/", {
                        card: e.card,
                        user: wacore.user.variables.username,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                },
                sendChatStaff: function(e) {
                    wacore.request.api_post("sendChatStaff", "staff/chat/send/", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        username: wacore.user.variables.username,
                        name: wacore.user.variables.name,
                        text: e.text
                    }, !1, wacore.user.variables.cookie)
                },
                requestChangeCardList: async function(e, t, a=0) {
                    let n = ""
                      , o = await window.wacore.whatsapp.getNumberId(e);
                    if (o && o._serialized) {
                        let e = wacore.crm.getCard(o._serialized);
                        n = e?.crmlist
                    }
                    wacore.request.api_post("moveCardForNewList", "channel/card/move/", {
                        card: e,
                        newList: t,
                        oldList: n,
                        position: a,
                        user: wacore.user.variables.username,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                },
                requestRemoveCardList: function(e) {
                    var t = "" + e.number
                      , a = ("" + e.ganho).replace("R$ ", "")
                      , n = null;
                    a && (n = a),
                    wacore.request.api_post("removeCardList", "channel/card/remove/", {
                        card: t,
                        ganho: n,
                        user: wacore.user.variables.username,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !0, wacore.user.variables.cookie)
                },
                requestCreateList: function(e) {
                    wacore.request.api_post("createList", "channel/list/create/", {
                        id: e.id,
                        title: e.title,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !1, wacore.user.variables.cookie)
                },
                requestMoveList: function(e) {
                    wacore.request.api_post("moveList", "channel/list/move/", {
                        id: e.id,
                        position: e.position[0],
                        user: wacore.user.variables.username,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !1, wacore.user.variables.cookie)
                },
                requestChangeListTitle: function(e) {
                    wacore.request.api_post("changeListTitle", "channel/list/title/", {
                        id: e.id,
                        title: e.title,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !1, wacore.user.variables.cookie)
                },
                requestRemoveList: function(e) {
                    wacore.request.api_post("removeList", "channel/list/remove/", {
                        id: e.id,
                        name: wacore.user.variables.name,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !1, wacore.user.variables.cookie)
                },
                requestChangeTagTitle: function(e) {
                    wacore.request.api_post("changeTagTitle", "channel/tags/title/", {
                        id: e.id,
                        title: e.title,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !1, wacore.user.variables.cookie)
                },
                requestAddTag: function(e) {
                    wacore.request.api_post("addTag", "channel/tags/addcard/", {
                        id: e.id,
                        card: e.card,
                        value: e.value,
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel
                    }, !1, wacore.user.variables.cookie)
                }
            }
        }
        ,
        796: ()=>{
            window.wacore.scheduller = {},
            window.wacore.scheduller.variables = {
                jobs: [],
                grid: null,
                options: {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                },
                gridLogColluns: [{
                    id: "_id",
                    name: "Id",
                    hidden: !0
                }, {
                    id: "dateSchedulled",
                    name: "Dt. agendado",
                    key: "scheduledDate",
                    width: "170px",
                    formatter: e=>`${new Date(e).toLocaleDateString("pt-BR", window.wacore.api.variables.options)}`
                }, {
                    id: "type",
                    name: "Tipo",
                    key: "type",
                    width: "150px",
                    formatter: e=>{
                        var t = "";
                        if (e) {
                            switch (e) {
                            case "REMINDER":
                                t = "Lembrete";
                                break;
                            case "SEND_TEXT":
                                t = "Mensagem"
                            }
                            return t
                        }
                    }
                }, {
                    id: "message",
                    name: "Mensagem",
                    key: "message",
                    formatter: e=>{
                        var t = e;
                        return t.length > 41 && (t = t.substring(0, 40) + "..."),
                        t
                    }
                }, {
                    id: "status",
                    name: "Situação",
                    key: "situation",
                    width: "120px",
                    attributes: e=>{
                        var t = "";
                        if (e) {
                            switch (e) {
                            case "WAITING":
                                t = "rgb(2, 106, 167)";
                                break;
                            case "ERROR":
                                t = "rgb(207, 81, 61)";
                                break;
                            case "SUCCESS":
                                t = "rgb(90, 172, 68)";
                                break;
                            case "CANCELED":
                                t = "rgb(80, 95, 121)"
                            }
                            return {
                                "data-cell-content": e,
                                style: `color: ${t}`
                            }
                        }
                    }
                    ,
                    formatter: e=>{
                        var t = "";
                        if (e) {
                            switch (e) {
                            case "WAITING":
                                t = "Agendado";
                                break;
                            case "ERROR":
                                t = "Falha";
                                break;
                            case "SUCCESS":
                                t = "Sucesso";
                                break;
                            case "CANCELED":
                                t = "Cancelado"
                            }
                            return t
                        }
                    }
                }, {
                    name: "Ações",
                    width: "100px",
                    key: "actions",
                    formatter: (e,t)=>gridjs.html(`<button class="btn btn-primary text-white bg-blue-600" onClick="window.wacore.scheduller.functions.showDetails('${t.cells[0].data}', 'manual')">${window.wacore.svgs.eye(24, 24, "")}</button>`)
                }]
            },
            wacore.scheduller.callbacks = {
                jobStatus: function(e) {
                    if ($("#calendar").evoCalendar("removeCalendarEvent", [e.msg.id]),
                    window.wacore.scheduller.variables.jobs[e.msg.id]) {
                        window.wacore.scheduller.variables.jobs[e.msg.id].status = e.msg.status,
                        window.wacore.scheduller.variables.jobs[e.msg.id].resultMsg = e.msg.resultMsg;
                        var t = window.wacore.scheduller.variables.jobs[e.msg.id];
                        $("#calendar").evoCalendar("addCalendarEvent", [{
                            id: t._id,
                            name: t.name,
                            chatId: t.chatId,
                            date: new Date(t.dateSchedulled),
                            fuso: t.fuso,
                            type: t.type,
                            status: e.msg.status,
                            resultMsg: e.msg.resultMsg,
                            message: t.message
                        }])
                    }
                    setTimeout((()=>{
                        wacore.scheduller.functions.updateBadge()
                    }
                    ), 1e3)
                },
                jobAdded: async function(e) {
                    try {
                        if (!e.msg || !e.msg.job)
                            return;
                        window.wacore.scheduller.variables.jobs[e.msg.job._id] = e.msg.job,
                        $("#calendar").evoCalendar("addCalendarEvent", [{
                            id: e.msg.job._id,
                            name: e.msg.job.name,
                            chatId: e.msg.job.chatId,
                            date: new Date(e.msg.job.dateSchedulled),
                            fuso: e.msg.job.fuso,
                            type: e.msg.job.type,
                            status: e.msg.job.status,
                            message: e.msg.job.message
                        }])
                    } catch (e) {
                        Swal.fire({
                            title: '<strong data-translate-key="oops"></strong>',
                            html: '<p data-translate-key="typeTheTitleReference"></p>',
                            icon: "error",
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        })
                    }
                    setTimeout((()=>{
                        wacore.scheduller.functions.updateBadge()
                    }
                    ), 1e3)
                }
            },
            wacore.scheduller.requests = {
                postResultSent: function(e, t, a) {
                    wacore.request.api_post("result_schedullement", "scheduller/result", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        id: e,
                        success: t,
                        resultMsg: a
                    }, !0, wacore.user.variables.cookie)
                },
                addNewJob: function(e) {
                    wacore.request.api_post("scheduller_new", "scheduller/new", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        date: e.date,
                        fuso: e.fuso,
                        chatId: e.chatId,
                        name: e.name,
                        type: e.type,
                        message: e.message
                    }, !0, wacore.user.variables.cookie)
                },
                removeJob: function(e) {
                    wacore.request.api_post("scheduller_remove", "scheduller/remove", {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        id: e
                    }, !0, wacore.user.variables.cookie)
                },
                getAllJobs: function() {}
            },
            wacore.scheduller.modals = {
                newSchedduller: async function(e) {
                    let t = 1e3;
                    if ("free" == currentPlan && (t = 3),
                    window.wacore.scheduller.variables.jobs.length > 0 && window.wacore.scheduller.variables.jobs.filter((e=>"WAITING" == e.status)).length > t)
                        return void window.wacore.function.modal_plan("Você atingiu o limite de " + t + " agendamentos simultâneos");
                    var a = new Date;
                    window.wacore.crm.evoCalendarSelect && "calendar" === e && (a = new Date(window.wacore.crm.evoCalendarSelect)),
                    a.setMinutes(a.getMinutes() - a.getTimezoneOffset());
                    var n = a.toISOString().slice(0, 16)
                      , o = "+55 ";
                    "chat" == e && window.wacore.activeChat && (o = window.wacore.activeChat.split("@")[0]);
                    let s = `\n            <h1 data-translate-key="createNewSchedule"></h1>\n            <div id="alertaAgenda">\n                <div class="alert alert-primary d-flex align-items-center" role="alert">\n                    <div style="font-size: small;"  data-translate-key="informativeMessageScheduling">\n                    </div>\n                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n                </div>\n            </div>    \n          \n            <div class="row">\n                <div class="col-md-6">\n                    <div class="mb-3">\n                        <span style="font-weight:500" data-translate-key="selectADate"></span>\n                        <input type="datetime-local"  class="form-control mt-2" id="modulo_agendamento_data" value="${n}">\n                    </div>\n                </div>\n                <div class="col-md-6">\n                    <div class="mb-3">\n                        <span style="font-weight:500" data-translate-key="number"></span>\n                        <input type="text" class="form-control mt-2" id="modulo_agendamento_chat"  value="${o}">\n                    </div>\n                </div>\n                <div class="col-md-12">\n                    <div class="mb-3">\n                        <span style="font-weight:500" data-translate-key="typeOfSchedule"></span>\n                        <select class="form-select mt-2" id="modulo_agendamento_tipo">\n                            <option value="SEND_TEXT" data-translate-key="sendingMessage"></option>\n                            <option value="REMINDER" data-translate-key="reminder"></option>\n                        </select>\n                    </div>\n                </div>\n                <div class="col-md-12">\n                    <div class="mb-3  pt-2" id="btns-text">\n                        <span style="font-weight:500" data-translate-key="messageOrNote"></span>\n                        <textarea class="form-control mt-2" row="2" id="modulo_agendamento_mensagem"></textarea>\n                    </div>\n                </div>\n            </div>\n            `;
                    Swal.fire({
                        confirmButtonText: '<span data-translate-key="toRecord"></span>',
                        html: s,
                        focusConfirm: !1,
                        showCancelButton: !0,
                        cancelButtonText: '<span data-translate-key="cancel"></span>',
                        icon: "success",
                        customClass: {
                            container: "v-dialog__content--active"
                        },
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                        ,
                        preConfirm: async()=>{
                            let e = document.getElementById("modulo_agendamento_mensagem").value
                              , t = document.getElementById("modulo_agendamento_chat").value
                              , a = document.getElementById("modulo_agendamento_data").value
                              , n = document.getElementById("modulo_agendamento_tipo").value;
                            var o = Intl.DateTimeFormat().resolvedOptions().timeZone;
                            if (!e)
                                return Swal.showValidationMessage('<b data-translate-key="completeTheMessage"></b>'),
                                window.wacore.format_translation.translateText(),
                                !1;
                            if (!t)
                                return Swal.showValidationMessage('<b data-translate-key="fillInTheNumber"></b>'),
                                window.wacore.format_translation.translateText(),
                                !1;
                            if (!a)
                                return Swal.showValidationMessage('<b data-translate-key="fillInTheAppointmentDate"></b>'),
                                window.wacore.format_translation.translateText(),
                                !1;
                            let s = t.length >= 14 ? t.replace("+", "") : t.replace(/[^0-9]/g, "")
                              , r = await window.wacore.whatsapp.getNumberId(s);
                            return r && r._serialized ? {
                                dateSchedulled: new Date(a),
                                fuso: o,
                                chatId: r._serialized,
                                type: n,
                                message: e,
                                name: wacore.whatsapp.getNotifyName(r._serialized)
                            } : (Swal.showValidationMessage('<b data-translate-key="addAValidWhatsappNumber"> </b>'),
                            window.wacore.format_translation.translateText(),
                            !1)
                        }
                    }).then((e=>{
                        e.isConfirmed && (wacore.scheduller.requests.addNewJob({
                            date: e.value.dateSchedulled,
                            fuso: e.value.fuso,
                            chatId: e.value.chatId,
                            name: e.value.name,
                            type: e.value.type,
                            message: e.value.message
                        }),
                        Swal.fire({
                            position: "top-end",
                            title: '<strong data-translate-key="titleScheduledCreatedSuccessfully"></strong>',
                            showConfirmButton: !1,
                            timer: 2500,
                            icon: "success",
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        }))
                    }
                    )),
                    "chat" == e && wacore.scheduller.modals.refreshGridSheduller()
                },
                showGridSchedullers: function() {
                    var e = document.getElementById("viewdate");
                    new bootstrap.Modal(e).show(),
                    $("#body_agendamento").html('<div id="grid-scheduller"></div>');
                    const t = $("#grid-scheduller");
                    var a = Object.values(window.wacore.scheduller.variables.jobs).filter((function(e) {
                        return e.chatId === window.wacore.activeChat
                    }
                    ));
                    const n = document.getElementById("input_sit_scheduller")?.value ?? "ALL"
                      , o = document.getElementById("input_type_scheduller")?.value ?? "ALL";
                    a.length > 0 && ("ALL" != n && (a = "WAITING_ERROR" == n ? a.filter((e=>"WAITING" == e.status || "ERROR" == e.status)) : a.filter((e=>e.status == n))),
                    "ALL" != o && (a = a.filter((e=>e.type == o))),
                    a = a.sort((function(e, t) {
                        return new Date(t.dateSchedulled) - new Date(e.dateSchedulled)
                    }
                    ))),
                    window.wacore.format_translation.updateTextColumnNames(window.wacore.scheduller.variables.gridLogColluns),
                    window.wacore.scheduller.variables.grid && window.wacore.scheduller.variables.grid.destroy(),
                    window.wacore.scheduller.variables.grid = new gridjs.Grid({
                        columns: window.wacore.scheduller.variables.gridLogColluns,
                        style: {
                            table: {
                                "white-space": "nowrap"
                            }
                        },
                        pagination: !0,
                        resizable: !0,
                        pagination: {
                            limit: 7
                        },
                        data: []
                    }).render(t.get(0)),
                    setTimeout((()=>{
                        window.wacore.scheduller.variables.grid.updateConfig({
                            data: a
                        }).forceRender()
                    }
                    ), 1e3)
                },
                refreshGridSheduller() {
                    if (!window.wacore.scheduller.variables.grid)
                        return;
                    var e = Object.values(window.wacore.scheduller.variables.jobs).filter((function(e) {
                        return e.chatId === window.wacore.activeChat
                    }
                    ));
                    const t = document.getElementById("input_sit_scheduller")?.value ?? "ALL"
                      , a = document.getElementById("input_type_scheduller")?.value ?? "ALL";
                    e.length > 0 && ("ALL" != t && (e = "WAITING_ERROR" == t ? e.filter((e=>"WAITING" == e.status || "ERROR" == e.status)) : e.filter((e=>e.status == t))),
                    "ALL" != a && (e = e.filter((e=>e.type == a))),
                    e = e.sort((function(e, t) {
                        return new Date(t.dateSchedulled) - new Date(e.dateSchedulled)
                    }
                    ))),
                    window.wacore.scheduller.variables.grid.updateConfig({
                        pagination: !0,
                        resizable: !0,
                        pagination: {
                            limit: 7
                        },
                        data: e
                    }).forceRender()
                }
            },
            wacore.scheduller.functions = {
                updateBadge: function() {
                    var e = Object.values(window.wacore.scheduller.variables.jobs).filter((function(e) {
                        return e.chatId === window.wacore.activeChat && ("WAITING" == e.status || "ERROR" == e.status)
                    }
                    ));
                    $(".badge-scheduller-rounded").text(e.length),
                    0 == e.length ? $(".badge-scheduller-rounded").hide() : $(".badge-scheduller-rounded").show()
                },
                removeById: function(e) {
                    Swal.fire({
                        icon: "warning",
                        title: '<strong data-translate-key="titleRemoveSchedule"></strong>',
                        html: '<p data-translate-key="messageRemoveSchedule"></p>',
                        showDenyButton: !0,
                        confirmButtonText: '<span data-translate-key="yes"></span>',
                        denyButtonText: '<span data-translate-key="no"></span>',
                        allowOutsideClick: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((t=>{
                        t.isConfirmed && (wacore.scheduller.requests.removeJob(e),
                        setTimeout((()=>{
                            wacore.scheduller.modals.refreshGridSheduller()
                        }
                        ), 1e3))
                    }
                    ))
                },
                getById: function(e) {
                    return window.wacore.scheduller.variables.jobs[e]
                },
                sendManual: async function(e) {
                    var t = window.wacore.scheduller.functions.getById(e);
                    if (t)
                        try {
                            t.chatId.includes("@g.us") ? (await window.wacore.whatsapp.getChat(t.chatId)).sendMessage(t.message) : window.wacore.whatsapp.upsertChat(t.chatId, (function(e) {
                                e.sendMessage(t.message)
                            }
                            )),
                            wacore.scheduller.requests.postResultSent(e, !0, "Agendamento executado manualmente!"),
                            Swal.fire({
                                position: "top-end",
                                title: `<strong data-translate-key="messageSendTo"></strong> ${t.name}`,
                                showConfirmButton: !1,
                                timer: 2500,
                                icon: "success",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            }),
                            setTimeout((()=>{
                                wacore.scheduller.modals.refreshGridSheduller()
                            }
                            ), 1e3)
                        } catch (a) {
                            wacore.scheduller.requests.postResultSent(e, !1, "Ocorreu um problema na execução"),
                            Swal.fire({
                                position: "top-end",
                                icon: "error",
                                title: `<strong data-translate-key="messageFailedSendTo"></strong> ${t.name}`,
                                icon: "error",
                                showConfirmButton: !1,
                                timer: 2500,
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                        }
                },
                sendById: async function(e, t, a, n, o) {
                    try {
                        switch (await new Promise((e=>setTimeout(e, 1e3))),
                        n) {
                        case "REMINDER":
                            window.wacore.scheduller.functions.showDetails(o, "reminder");
                            break;
                        case "SEND_TEXT":
                            e.includes("@g.us") ? (await window.wacore.whatsapp.getChat(e)).sendMessage(a) : window.wacore.whatsapp.upsertChat(e, (function(e) {
                                e.sendMessage(a)
                            }
                            ))
                        }
                        return !0
                    } catch (e) {
                        return console.log(e),
                        Swal.fire({
                            position: "top-end",
                            icon: "error",
                            title: `<strong data-translate-key="messageFailedSendTo"></strong> ${t}`,
                            icon: "error",
                            showConfirmButton: !1,
                            timer: 2500,
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        }),
                        !1
                    }
                },
                showDetails: function(e, t) {
                    let a = window.wacore.scheduller.functions.getById(e);
                    if (!a)
                        return;
                    var n, o = a.chatId.split("@")[0], s = "", r = "";
                    let i = ""
                      , l = "";
                    switch ("REMINDER" == a.type && (i = window.wacore.format_translation.getTranslation(a.type),
                    typeTitle = "Lembrete"),
                    "SEND_TEXT" == a.type && (i = window.wacore.format_translation.getTranslation(a.type),
                    typeTitle = "Mensagem"),
                    n = "reminder" == t ? window.wacore.format_translation.getTranslation("dismissReminder") : "ERROR" == a.status ? window.wacore.format_translation.getTranslation("toDiscard") : window.wacore.format_translation.getTranslation("cancelAppointment"),
                    "Agendamento executado com sucesso!" === a.resultMsg && (l = window.wacore.format_translation.getTranslation("schedulingCompletedSuccessfully")),
                    "Agendamento executado manualmente!" === a.resultMsg && (l = window.wacore.format_translation.getTranslation("schedulingExecutedManually")),
                    "Ocorreu um problema na execução" === a.resultMsg && (l = window.wacore.format_translation.getTranslation("thereWasAproblemExecuting")),
                    a.status) {
                    case "WAITING":
                        r = "rgb(2, 106, 167)",
                        s = window.wacore.format_translation.getTranslation("scheduled");
                        break;
                    case "ERROR":
                        r = "rgb(207, 81, 61)",
                        s = window.wacore.format_translation.getTranslation("failure");
                        break;
                    case "SUCCESS":
                        r = "rgb(90, 172, 68)",
                        s = window.wacore.format_translation.getTranslation("success");
                        break;
                    case "CANCELED":
                        r = "rgb(80, 95, 121)",
                        s = window.wacore.format_translation.getTranslation("canceled")
                    }
                    Swal.fire({
                        title: '<strong data-translate-key="appoitmentDetails"></strong>',
                        html: `<div style="display: flex; flex-direction: column; gap: 8px;">\n                    <h5><span data-translate-key="name"></span> <b>${a.name}</b> \n                    <h6><span data-translate-key="number"></span> ${o}</h6>\n                    <div style="text-align: left; display:flex;">\n                        \n                        <div class="col-md-5">\n                            <label for="scheduller-date" class="form-label" data-translate-key="schedulingDate"></label>\n                            <input id="scheduller-date" class="form-control" placeholder="name@example.com" value="${new Date(a.dateSchedulled).toLocaleDateString("pt-BR", window.wacore.api.variables.options)}" disabled>\n                        </div>\n\n                        <div class="col-md-7" style="padding-left:10px">              \n                            <label for="scheduller-type" class="form-label" data-translate-key="schedulingType"></label>\n                            <input id="scheduller-type" class="form-control k-input text-box" type="text" disabled value="${i}">\n                        </div>\n                    </div>\n                    <div style="text-align: left; display:flex;">\n                        <div class="col-md-3">           \n                            <label for="scheduller-situation" class="form-label" data-translate-key="situation"></label>\n                            <input id="scheduller-situation" class="form-control k-input text-box " style="color:${r}; font-weight: bold;" type="text" disabled value="${s}">\n                        </div>\n\n                        <div class="col-md-9" style="padding-left:10px">           \n                            <label for="scheduller-result" class="form-label" data-translate-key="result"></label>\n                            <input id="scheduller-result" class="form-control k-input text-box" type="text" disabled value="${l ?? ""}">\n                        </div>\n                    </div>\n                    <div class="col-md-12" style="text-align: left;">              \n                        <label for="scheduller-message" class="form-label" data-translate-key="message"></label>\n                        <textarea id="scheduller-message" class="form-control" rows="3" disabled>${a.message}</textarea>\n                    </div>\n                </div>`,
                        showCloseButton: !0,
                        showCancelButton: "WAITING" == a.status || "ERROR" == a.status,
                        showConfirmButton: "WAITING" == a.status || "ERROR" == a.status,
                        confirmButtonText: "ERROR" == a.status ? '<span data-translate-key="tryAgain"></span>' : '<span data-translate-key="sendNow"></span>',
                        cancelButtonText: n,
                        focusConfirm: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((async t=>{
                        t.isConfirmed ? await wacore.scheduller.functions.sendManual(e) : t.dismiss && t.dismiss === Swal.DismissReason.cancel && wacore.scheduller.functions.removeById(e)
                    }
                    ))
                },
                start: async function(e) {
                    if ($.fn.evoCalendar = function() {
                        var e, t, a = this, n = arguments[0], o = Array.prototype.slice.call(arguments, 1), s = a.length;
                        for (e = 0; e < s; e++)
                            if ("object" == typeof n || void 0 === n ? a[e].evoCalendar = new EvoCalendar(a[e],n) : t = a[e].evoCalendar[n].apply(a[e].evoCalendar, o),
                            void 0 !== t)
                                return t;
                        return a
                    }
                    ,
                    $("#calendar").evoCalendar({
                        theme: "Royal Navy",
                        language: "en",
                        todayHighlight: !0,
                        sidebarToggler: !0,
                        eventListToggler: !0,
                        canAddEvent: !0,
                        calendarEvents: []
                    }),
                    $("#calendar").on("selectDate", (function(e, t) {
                        var a = new Date(t);
                        a.setHours((new Date).getHours()),
                        a.setMinutes((new Date).getMinutes() - a.getTimezoneOffset()),
                        window.wacore.crm.evoCalendarSelect = a.toISOString().slice(0, 16)
                    }
                    )),
                    $("#calendar").on("selectEvent", (function(e, t) {
                        window.wacore.scheduller.functions.showDetails(t.id, "manual")
                    }
                    )),
                    e && e.length > 0)
                        for (const t of e)
                            window.wacore.scheduller.variables.jobs[t._id] = t,
                            $("#calendar").evoCalendar("addCalendarEvent", [{
                                id: t._id,
                                name: t.name,
                                chatId: t.chatId,
                                date: new Date(t.dateSchedulled),
                                resultMsg: t.resultMsg,
                                type: t.type,
                                status: t.status,
                                message: t.message
                            }])
                }
            }
        }
        ,
        643: ()=>{
            window.selectors = {
                getScreenOfChat: function() {
                    return document.querySelector("._5kRIK")
                },
                getImputFilterChatList: function() {
                    return document.querySelector("#side > div._3gYev > div > div > div._2vDPL > div") ? document.querySelector("#side > div._3gYev > div > div > div._2vDPL > div") : null
                },
                getButtonFilterChatList: function() {
                    return document.querySelector("#side > div._3gYev > div > div > button") ? document.querySelector("#side > div._3gYev > div > div > button") : null
                },
                getChatImputText: function() {
                    return document.getElementsByClassName("to2l77zo gfz4du6o ag5g9lrv bze30y65 kao4egtt").length > 0 ? document.getElementsByClassName("to2l77zo gfz4du6o ag5g9lrv bze30y65 kao4egtt")[1] : null
                },
                getHeaderButtonsChat: function() {
                    return document.getElementsByClassName("_1sPvB _2XdMx").length > 0 ? document.getElementsByClassName("_1sPvB _2XdMx")[1] : null
                },
                getHeaderButtonsLeftMain: function() {
                    return document.getElementsByClassName("_1sPvB _2XdMx").length > 0 ? document.getElementsByClassName("_1sPvB _2XdMx")[0] : null
                },
                getChatButtonSendMessage: function() {
                    return document.getElementsByClassName("tvf2evcx oq44ahr5 lb5m6g5c svlsagor p2rjqpw5 epia9gcq").length > 0 ? document.getElementsByClassName("tvf2evcx oq44ahr5 lb5m6g5c svlsagor p2rjqpw5 epia9gcq")[0] : null
                },
                getConversationPanel: function() {
                    return document.getElementsByClassName("_3B19s") ? document.getElementsByClassName("_3B19s")[0] : null
                },
                getFooterPanelChat: function() {
                    return document.querySelector("#main") ? document.querySelector("#main").getElementsByTagName("footer")[0].children[0].children[0].children[1] ? document.querySelector("#main").getElementsByTagName("footer")[0].children[0].children[0].children[1] : document.querySelector("#main").getElementsByTagName("footer")[0].children[1].children[0].children[1] ? document.querySelector("#main").getElementsByTagName("footer")[0].children[1].children[0].children[1] : document.querySelector("#main").getElementsByTagName("footer")[0].children[3].children[0].children[1] ? document.querySelector("#main").getElementsByTagName("footer")[0].children[3].children[0].children[1] : null : null
                }
            }
        }
        ,
        195: ()=>{
            window.wacore.html.template(),
            window.wacore.user.functions.changeStatus(!1),
            window.wacore.whatsapp.start()
        }
        ,
        863: ()=>{
            window.wacore.svgs = {
                orange_warning: '<svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" title="Limitado"><path fill="#FFA500" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zM12 8c.552 0 1 .448 1 1v5c0 .552-.448 1-1 1s-1-.448-1-1v-5c0-.552.448-1 1-1zM12 16c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/></svg>',
                red_block: '<svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" title="Bloqueado"><path fill="red" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm9 12c0 1.94-.624 3.735-1.672 5.207l-12.535-12.535c1.472-1.048 3.267-1.672 5.207-1.672 4.962 0 9 4.038 9 9zm-18 0c0-1.94.624-3.735 1.672-5.207l12.534 12.534c-1.471 1.049-3.266 1.673-5.206 1.673-4.962 0-9-4.038-9-9z"/></svg>',
                green_check: '<svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" title="Ativo"><path fill="green" d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.393 7.5l-5.643 5.784-2.644-2.506-1.856 1.858 4.5 4.364 7.5-7.643-1.857-1.857z"/></svg>',
                power_off: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V3ZM8.6092 5.8744C9.09211 5.60643 9.26636 4.99771 8.99839 4.5148C8.73042 4.03188 8.12171 3.85763 7.63879 4.1256C4.87453 5.65948 3 8.61014 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 8.66747 19.1882 5.75928 16.5007 4.20465C16.0227 3.92811 15.4109 4.09147 15.1344 4.56953C14.8579 5.04759 15.0212 5.65932 15.4993 5.93586C17.5942 7.14771 19 9.41027 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 9.3658 6.45462 7.06997 8.6092 5.8744Z"/>\n        </svg>`
                },
                kanban: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n        <path d="M2.5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-11zm5 2h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm-5 1a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3zm9-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/>\n      </svg>`
                },
                kanban_new: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M10.5 19.9V4.1C10.5 2.6 9.86 2 8.27 2H4.23C2.64 2 2 2.6 2 4.1V19.9C2 21.4 2.64 22 4.23 22H8.27C9.86 22 10.5 21.4 10.5 19.9Z" fill="#currentColor"/>\n        <path d="M22 12.9V4.1C22 2.6 21.36 2 19.77 2H15.73C14.14 2 13.5 2.6 13.5 4.1V12.9C13.5 14.4 14.14 15 15.73 15H19.77C21.36 15 22 14.4 22 12.9Z" fill="#currentColor"/>\n        </svg>`
                },
                tag: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n        viewBox="0 0 486.982 486.982" xml:space="preserve">\n   <g>\n       <path d="M131.35,422.969c14.6,14.6,38.3,14.6,52.9,0l181.1-181.1c5.2-5.2,9.2-11.4,11.8-18c18.2,5.1,35.9,7.8,51.5,7.7\n           c38.6-0.2,51.4-17.1,55.6-27.2c4.2-10,7.2-31-19.9-58.6c-0.3-0.3-0.6-0.6-0.9-0.9c-16.8-16.8-41.2-32.3-68.9-43.8\n           c-5.1-2.1-10.2-4-15.2-5.8v-0.3c-0.3-22.2-18.2-40.1-40.4-40.4l-108.5-1.5c-14.4-0.2-28.2,5.4-38.3,15.6l-181.2,181.1\n           c-14.6,14.6-14.6,38.3,0,52.9L131.35,422.969z M270.95,117.869c12.1-12.1,31.7-12.1,43.8,0c7.2,7.2,10.1,17.1,8.7,26.4\n           c11.9,8.4,26.1,16.2,41.3,22.5c5.4,2.2,10.6,4.2,15.6,5.9l-0.6-43.6c0.9,0.4,1.7,0.7,2.6,1.1c23.7,9.9,45,23.3,58.7,37\n           c0.2,0.2,0.4,0.4,0.6,0.6c13,13.3,14.4,21.8,13.3,24.4c-3.4,8.1-39.9,15.3-95.3-7.8c-16.2-6.8-31.4-15.2-43.7-24.3\n           c-0.4,0.5-0.9,1-1.3,1.5c-12.1,12.1-31.7,12.1-43.8,0C258.85,149.569,258.85,129.969,270.95,117.869z"/>\n   </g>\n   </svg>`
                },
                transfer: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n        viewBox="0 0 297 297" xml:space="preserve">\n   <g>\n       <path d="M110.194,199.303c-7.897-8.085-18.455-13.49-30.515-15.797c17.042-5.709,29.361-21.814,29.361-40.753\n           c0-23.696-19.279-42.976-42.976-42.976S23.09,119.057,23.09,142.753c0,18.939,12.319,35.044,29.36,40.753\n           c-12.059,2.307-22.616,7.711-30.514,15.795C11.504,209.98,6.201,224.721,6.602,241.93c0.126,5.428,4.563,9.762,9.992,9.762h98.943\n           c5.429,0,9.865-4.334,9.991-9.762C125.93,224.721,120.627,209.98,110.194,199.303z"/>\n       <path d="M275.064,139.336c-7.897-8.084-18.455-13.489-30.515-15.797c17.042-5.708,29.361-21.813,29.361-40.752\n           c0-23.696-19.279-42.976-42.976-42.976s-42.976,19.279-42.976,42.976c0,18.938,12.319,35.044,29.36,40.752\n           c-12.059,2.308-22.616,7.712-30.514,15.796c-10.433,10.679-15.735,25.42-15.334,42.629c0.126,5.427,4.563,9.762,9.991,9.762h98.943\n           c5.429,0,9.866-4.335,9.992-9.762C290.799,164.755,285.496,150.014,275.064,139.336z"/>\n       <path d="M48.472,90.278c1.754,1.241,3.771,1.839,5.768,1.839c3.132,0,6.217-1.469,8.165-4.22\n           c19.613-27.695,51.442-44.31,85.276-44.574l-6.248,6.247c-3.903,3.903-3.903,10.231,0,14.135c1.952,1.951,4.51,2.927,7.067,2.927\n           s5.115-0.976,7.067-2.927l23.321-23.321c3.903-3.903,3.903-10.231,0-14.135L155.568,2.926c-3.904-3.901-10.23-3.901-14.135,0\n           c-3.903,3.903-3.903,10.232,0,14.135l6.271,6.273C107.39,23.59,69.45,43.36,46.091,76.345\n           C42.902,80.849,43.968,87.087,48.472,90.278z"/>\n       <path d="M248.94,206.516c-4.528-3.158-10.758-2.048-13.915,2.479c-18.145,26.01-46.938,42.375-78.213,44.855l6.418-6.418\n           c3.903-3.903,3.903-10.232,0-14.135c-3.903-3.902-10.23-3.902-14.134,0l-23.321,23.32c-3.902,3.903-3.902,10.231,0,14.135\n           l23.321,23.32c1.952,1.951,4.509,2.928,7.067,2.928c2.558,0,5.115-0.977,7.066-2.928c3.903-3.902,3.903-10.231,0-14.134\n           l-6.07-6.071c37.679-2.613,72.444-22.165,94.258-53.437C254.575,215.904,253.466,209.673,248.94,206.516z"/>\n   </g>\n   </svg>`
                },
                person: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="currentColor"/>\n        <path d="M17.0809 14.1489C14.2909 12.2889 9.74094 12.2889 6.93094 14.1489C5.66094 14.9989 4.96094 16.1489 4.96094 17.3789C4.96094 18.6089 5.66094 19.7489 6.92094 20.5889C8.32094 21.5289 10.1609 21.9989 12.0009 21.9989C13.8409 21.9989 15.6809 21.5289 17.0809 20.5889C18.3409 19.7389 19.0409 18.5989 19.0409 17.3589C19.0309 16.1289 18.3409 14.9889 17.0809 14.1489Z" fill="currentColor"/>\n        </svg>`
                },
                schedulled_message: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n        viewBox="0 0 32 32" xml:space="preserve">\n   <path d="M28.7,17.3c-3.1-3.1-8.2-3.1-11.3,0s-3.1,8.2,0,11.3s8.2,3.1,11.3,0S31.8,20.5,28.7,17.3z M26,24h-3c-0.6,0-1-0.4-1-1v-4\n       c0-0.6,0.4-1,1-1s1,0.4,1,1v3h2c0.6,0,1,0.4,1,1S26.6,24,26,24z"/>\n   <path d="M13.1,24.1c-0.1-0.7-0.1-1.5,0-2.2c0,0,0,0,0,0c0-0.3,0.1-0.7,0.2-1c0-0.1,0-0.1,0.1-0.2c0.1-0.3,0.1-0.5,0.2-0.8\n       c0-0.1,0.1-0.2,0.1-0.3c0.1-0.2,0.2-0.5,0.3-0.7c0-0.1,0.1-0.2,0.2-0.3c0.1-0.2,0.2-0.4,0.3-0.6c0.1-0.1,0.1-0.2,0.2-0.3\n       c0.1-0.2,0.3-0.4,0.4-0.6c0.1-0.1,0.1-0.2,0.2-0.3c0.2-0.3,0.5-0.6,0.7-0.8c0.2-0.2,0.5-0.5,0.7-0.7c0.1-0.1,0.2-0.1,0.3-0.2\n       c0.2-0.1,0.3-0.3,0.5-0.4c0.1-0.1,0.2-0.1,0.3-0.2c0.2-0.1,0.3-0.2,0.5-0.3c0.1-0.1,0.3-0.1,0.4-0.2c0.1-0.1,0.3-0.1,0.4-0.2\n       c0.1-0.1,0.3-0.1,0.4-0.2c0.1-0.1,0.3-0.1,0.4-0.1c0.2-0.1,0.3-0.1,0.5-0.1c0.1,0,0.3-0.1,0.4-0.1c0.2,0,0.4-0.1,0.5-0.1\n       c0.1,0,0.2,0,0.3,0c0.2,0,0.4-0.1,0.6-0.1c0.1,0,0.2,0,0.2,0c0.2,0,0.5,0,0.7,0c0,0,0.1,0,0.1,0c2,0.1,4,0.7,5.7,2c0,0,0,0,0,0V9\n       c0-2.8-2.2-5-5-5H8C5.2,4,3,6.2,3,9v19c0,0.4,0.2,0.7,0.6,0.9C3.7,29,3.9,29,4,29c0.2,0,0.5-0.1,0.7-0.2C7.1,26.6,10,25.1,13.1,24.1\n       L13.1,24.1z M11,11h6c0.6,0,1,0.4,1,1s-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1S10.4,11,11,11z M10,16c0-0.6,0.4-1,1-1h3c0.6,0,1,0.4,1,1\n       s-0.4,1-1,1h-3C10.4,17,10,16.6,10,16z"/>\n   </svg>`
                },
                new_chat: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.1391 2.95907L7.10914 5.95907C1.03914 7.98907 1.03914 11.2991 7.10914 13.3191L9.78914 14.2091L10.6791 16.8891C12.6991 22.9591 16.0191 22.9591 18.0391 16.8891L21.0491 7.86907C22.3891 3.81907 20.1891 1.60907 16.1391 2.95907ZM16.4591 8.33907L12.6591 12.1591C12.5091 12.3091 12.3191 12.3791 12.1291 12.3791C11.9391 12.3791 11.7491 12.3091 11.5991 12.1591C11.3091 11.8691 11.3091 11.3891 11.5991 11.0991L15.3991 7.27907C15.6891 6.98907 16.1691 6.98907 16.4591 7.27907C16.7491 7.56907 16.7491 8.04907 16.4591 8.33907Z" fill="currentColor"/>\n        </svg>`
                },
                fav_messages: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M14.9303 2.5V8.4C14.9303 8.84 14.4103 9.06 14.0903 8.77L12.3403 7.16C12.1503 6.98 11.8503 6.98 11.6603 7.16L9.91031 8.76C9.59031 9.06 9.07031 8.83 9.07031 8.4V2.5C9.07031 2.22 9.29031 2 9.57031 2H14.4303C14.7103 2 14.9303 2.22 14.9303 2.5Z" fill="currentColor"/>\n        <path d="M16.98 2.05891C16.69 2.01891 16.43 2.26891 16.43 2.55891V8.57891C16.43 9.33891 15.98 10.0289 15.28 10.3389C14.58 10.6389 13.77 10.5089 13.21 9.98891L12.34 9.18891C12.15 9.00891 11.86 9.00891 11.66 9.18891L10.79 9.98891C10.43 10.3289 9.96 10.4989 9.49 10.4989C9.23 10.4989 8.97 10.4489 8.72 10.3389C8.02 10.0289 7.57 9.33891 7.57 8.57891V2.55891C7.57 2.26891 7.31 2.01891 7.02 2.05891C4.22 2.40891 3 4.29891 3 6.99891V16.9989C3 19.9989 4.5 21.9989 8 21.9989H16C19.5 21.9989 21 19.9989 21 16.9989V6.99891C21 4.29891 19.78 2.40891 16.98 2.05891ZM17.5 18.7489H9C8.59 18.7489 8.25 18.4089 8.25 17.9989C8.25 17.5889 8.59 17.2489 9 17.2489H17.5C17.91 17.2489 18.25 17.5889 18.25 17.9989C18.25 18.4089 17.91 18.7489 17.5 18.7489ZM17.5 14.7489H13.25C12.84 14.7489 12.5 14.4089 12.5 13.9989C12.5 13.5889 12.84 13.2489 13.25 13.2489H17.5C17.91 13.2489 18.25 13.5889 18.25 13.9989C18.25 14.4089 17.91 14.7489 17.5 14.7489Z" fill="currentColor"/>\n        </svg>`
                },
                calendar: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.7502 3.56V2C16.7502 1.59 16.4102 1.25 16.0002 1.25C15.5902 1.25 15.2502 1.59 15.2502 2V3.5H8.75023V2C8.75023 1.59 8.41023 1.25 8.00023 1.25C7.59023 1.25 7.25023 1.59 7.25023 2V3.56C4.55023 3.81 3.24023 5.42 3.04023 7.81C3.02023 8.1 3.26023 8.34 3.54023 8.34H20.4602C20.7502 8.34 20.9902 8.09 20.9602 7.81C20.7602 5.42 19.4502 3.81 16.7502 3.56Z" fill="currentColor"/>\n        <path d="M19 15C16.79 15 15 16.79 15 19C15 19.75 15.21 20.46 15.58 21.06C16.27 22.22 17.54 23 19 23C20.46 23 21.73 22.22 22.42 21.06C22.79 20.46 23 19.75 23 19C23 16.79 21.21 15 19 15ZM21.07 18.57L18.94 20.54C18.8 20.67 18.61 20.74 18.43 20.74C18.24 20.74 18.05 20.67 17.9 20.52L16.91 19.53C16.62 19.24 16.62 18.76 16.91 18.47C17.2 18.18 17.68 18.18 17.97 18.47L18.45 18.95L20.05 17.47C20.35 17.19 20.83 17.21 21.11 17.51C21.39 17.81 21.37 18.28 21.07 18.57Z" fill="currentColor"/>\n        <path d="M20 9.83984H4C3.45 9.83984 3 10.2898 3 10.8398V16.9998C3 19.9998 4.5 21.9998 8 21.9998H12.93C13.62 21.9998 14.1 21.3298 13.88 20.6798C13.68 20.0998 13.51 19.4598 13.51 18.9998C13.51 15.9698 15.98 13.4998 19.01 13.4998C19.3 13.4998 19.59 13.5198 19.87 13.5698C20.47 13.6598 21.01 13.1898 21.01 12.5898V10.8498C21 10.2898 20.55 9.83984 20 9.83984ZM9.21 18.2098C9.02 18.3898 8.76 18.4998 8.5 18.4998C8.24 18.4998 7.98 18.3898 7.79 18.2098C7.61 18.0198 7.5 17.7598 7.5 17.4998C7.5 17.2398 7.61 16.9798 7.79 16.7898C7.89 16.6998 7.99 16.6298 8.12 16.5798C8.49 16.4198 8.93 16.5098 9.21 16.7898C9.39 16.9798 9.5 17.2398 9.5 17.4998C9.5 17.7598 9.39 18.0198 9.21 18.2098ZM9.21 14.7098C9.16 14.7498 9.11 14.7898 9.06 14.8298C9 14.8698 8.94 14.8998 8.88 14.9198C8.82 14.9498 8.76 14.9698 8.7 14.9798C8.63 14.9898 8.56 14.9998 8.5 14.9998C8.24 14.9998 7.98 14.8898 7.79 14.7098C7.61 14.5198 7.5 14.2598 7.5 13.9998C7.5 13.7398 7.61 13.4798 7.79 13.2898C8.02 13.0598 8.37 12.9498 8.7 13.0198C8.76 13.0298 8.82 13.0498 8.88 13.0798C8.94 13.0998 9 13.1298 9.06 13.1698C9.11 13.2098 9.16 13.2498 9.21 13.2898C9.39 13.4798 9.5 13.7398 9.5 13.9998C9.5 14.2598 9.39 14.5198 9.21 14.7098ZM12.71 14.7098C12.52 14.8898 12.26 14.9998 12 14.9998C11.74 14.9998 11.48 14.8898 11.29 14.7098C11.11 14.5198 11 14.2598 11 13.9998C11 13.7398 11.11 13.4798 11.29 13.2898C11.67 12.9198 12.34 12.9198 12.71 13.2898C12.89 13.4798 13 13.7398 13 13.9998C13 14.2598 12.89 14.5198 12.71 14.7098Z" fill="currentColor"/>\n        </svg>`
                },
                campaign: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 6.3500002 6.3500002" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg">\n        <defs id="defs1970"/>\n        <g id="layer1" style="display:inline">\n        <path d="M 3.7952208,0.0066805 C 3.6382726,0.0165918 3.4856556,0.05861054 3.3446009,0.14000564 2.9684613,0.35705367 2.7902036,0.78519635 2.7740931,1.2407136 2.75798,1.6962396 2.8922296,2.2034334 3.1704522,2.6850698 3.4486721,3.1667065 3.8218908,3.5383657 4.2246501,3.7521884 4.6274068,3.9660022 5.0866785,4.0240134 5.4628181,3.8069654 5.8389657,3.589912 6.0166995,3.1643583 6.03281,2.7088411 6.0489231,2.2533151 5.9151895,1.7435373 5.6369669,1.2619009 5.3587469,0.78026451 4.9850124,0.41118901 4.582253,0.19736651 4.3305311,0.06373261 4.0567984,-0.00983637 3.7952208,0.0066805 Z m 0.5038434,1.2485026 c 0.053951,0.00398 0.106336,0.012933 0.1570963,0.026872 0.2030413,0.05575 0.3755417,0.1863508 0.4728396,0.3576007 0.194601,0.3425003 0.1026345,0.8572334 -0.3343461,1.1110434 A 0.26458299,0.26458299 0 0 1 4.2334369,2.6550976 0.26458299,0.26458299 0 0 1 4.3290388,2.2938794 C 4.5555274,2.1623293 4.5373347,2.0194284 4.4701147,1.9011385 4.4029052,1.7828385 4.298871,1.6970556 4.063421,1.8329255 A 0.26458299,0.26458299 0 0 1 3.7022012,1.7352572 0.26458299,0.26458299 0 0 1 3.7978031,1.3740387 C 3.9636281,1.2783464 4.1372132,1.2432539 4.2990642,1.2551831 Z" id="ellipse790" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="M 2.4573181,1.1554474 1.2434388,2.6571648 c -0.068794,0.085165 -0.078039,0.203903 -0.023257,0.2986897 l 0.7420716,1.2831257 c 0.054549,0.094429 0.1614435,0.1457209 0.2692347,0.129191 L 4.1398988,4.0689648 C 3.6781029,3.8097766 3.2513829,3.3787653 2.9306709,2.8235628 2.6098107,2.2681317 2.4507934,1.6848062 2.4573154,1.1554474 Z" id="path792" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="m 1.3800524,2.5613588 a 0.26460945,0.26460945 0 0 0 -0.10742,0.0352 l -0.33008,0.18945 c -0.62403,0.3601 -0.76385,1.02592 -0.5,1.47461 0.26385,0.44869 0.90874,0.65633 1.52539,0.30274 a 0.26460945,0.26460945 0 0 0 0.002,0 l 0.33008,-0.19141 a 0.26460945,0.26460945 0 0 0 0.0957,-0.36133 l -0.76171,-1.31836 a 0.26460945,0.26460945 0 0 0 -0.25391,-0.13086 z" id="path794" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="M 2.6655743,4.4317334 A 0.33343293,0.33343293 0 0 1 2.5415508,4.5593742 L 2.1255544,4.8007031 a 0.33343293,0.33343293 0 0 1 -0.0031,0 C 1.753402,5.0123182 1.3779609,5.0602559 1.0481049,4.9960399 l 0.5389853,0.9348267 a 0.26460945,0.26460945 0 0 0 0.00413,0.00568 c 0.2121985,0.34299 0.7000082,0.545024 1.1404997,0.3028239 a 0.26460945,0.26460945 0 0 0 0.00619,-0.00206 C 3.13762,6.0066499 3.2751901,5.4886796 3.0443518,5.0890595 Z" id="path796" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        </g>`
                },
                modules: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 36 36"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n        <title>plugin-solid-badged</title>\n        <path d="M29.81,16H29V13.43a7.5,7.5,0,0,1-6.45-6.59H21A5.14,5.14,0,0,0,16.51,2,5,5,0,0,0,11,6.83H4a2,2,0,0,0-2,2V17H4.81A3.13,3.13,0,0,1,8,19.69,3,3,0,0,1,7.22,22,3,3,0,0,1,5,23H2v8.83a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V26h1a5,5,0,0,0,5-5.51A5.15,5.15,0,0,0,29.81,16Z" class="clr-i-solid--badged clr-i-solid-path-1--badged"></path><circle cx="30" cy="6" r="5" class="clr-i-solid--badged clr-i-solid-path-2--badged clr-i-badge"></circle>\n        <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>\n    </svg>`
                },
                graphics: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 6.3500002 6.3500002" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:svg="http://www.w3.org/2000/svg">\n        <defs id="defs1970"/>\n        <g id="layer1" style="display:inline">\n        <path d="m 0.26485,5.8204456 a 0.2645835,0.2645835 0 0 0 -0.26563,0.26563 0.2645835,0.2645835 0 0 0 0.26563,0.26367 h 5.82031 a 0.2645835,0.2645835 0 0 0 0.26562,-0.26367 0.2645835,0.2645835 0 0 0 -0.26562,-0.26563 z" id="path726" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="m 1.16328,3.9688856 c -0.34722,0 -0.63476,0.28754 -0.63476,0.63477 v 1.48242 a 0.26460996,0.26460996 0 0 0 0.26562,0.26367 h 1.0586 a 0.26460996,0.26460996 0 0 0 0.26367,-0.26367 v -1.48242 c 0,-0.34723 -0.28755,-0.63477 -0.63477,-0.63477 z" id="path728" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="m 3.0168,3.0684956 c -0.34722,0 -0.63477,0.28753 -0.63477,0.63477 v 2.38281 a 0.26460996,0.26460996 0 0 0 0.26367,0.26367 h 1.0586 a 0.26460996,0.26460996 0 0 0 0.26367,-0.26367 v -2.38281 c 0,-0.34724 -0.28755,-0.63477 -0.63477,-0.63477 z" id="path730" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="m 4.86836,2.2755256 c -0.34722,0 -0.63477,0.28754 -0.63477,0.63477 v 3.17578 a 0.26460996,0.26460996 0 0 0 0.26368,0.26367 h 1.05859 a 0.26460996,0.26460996 0 0 0 0.26563,-0.26367 v -3.17578 c 0,-0.34723 -0.2895,-0.63477 -0.63672,-0.63477 z" id="path732" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        <path d="M 4.6205208,2.5237e-4 A 0.2645835,0.2645835 0 0 0 4.3564534,0.26380219 0.2645835,0.2645835 0 0 0 4.6205208,0.52941905 H 4.8938883 C 3.3974791,1.8159538 1.8306324,2.6151331 0.2161369,2.9142865 A 0.2645835,0.2645835 0 0 0 0.0052984,3.2227949 0.2645835,0.2645835 0 0 0 0.3117388,3.4357016 C 2.050091,3.1136013 3.722697,2.2498105 5.2923138,0.88753671 V 1.1991456 A 0.2645835,0.2645835 0 0 0 5.5558626,1.4647625 0.2645835,0.2645835 0 0 0 5.8214805,1.1991456 V 0.41986501 C 5.8215308,0.19150501 5.62816,2.0237e-4 5.3998008,2.5237e-4 Z" id="path734" style="color:currentColor;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:currentColor;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:currentColor;solid-opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.529167;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate;stop-color:currentColor"/>\n        </g>\n        </svg>`
                },
                wallet: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M11.9392 2.21178L9.52922 7.82178H7.11922C6.71922 7.82178 6.32922 7.85178 5.94922 7.93178L6.94922 5.53178L6.98922 5.44178L7.04922 5.28178C7.07922 5.21178 7.09922 5.15178 7.12922 5.10178C8.28922 2.41178 9.58922 1.57178 11.9392 2.21178Z" fill="#currentColor"/>\n        <path d="M18.7311 8.08953L18.7111 8.07953C18.1111 7.90953 17.5011 7.81953 16.8811 7.81953H10.6211L12.8711 2.58953L12.9011 2.51953C13.0411 2.56953 13.1911 2.63953 13.3411 2.68953L15.5511 3.61953C16.7811 4.12953 17.6411 4.65953 18.1711 5.29953C18.2611 5.41953 18.3411 5.52953 18.4211 5.65953C18.5111 5.79953 18.5811 5.93953 18.6211 6.08953C18.6611 6.17953 18.6911 6.25953 18.7111 6.34953C18.8611 6.85953 18.8711 7.43953 18.7311 8.08953Z" fill="#currentColor"/>\n        <path d="M12.5195 17.6581H12.7695C13.0695 17.6581 13.3195 17.3881 13.3195 17.0581C13.3195 16.6381 13.1995 16.5781 12.9395 16.4781L12.5195 16.3281V17.6581Z" fill="#currentColor"/>\n        <path d="M18.2883 9.52031C17.8383 9.39031 17.3683 9.32031 16.8783 9.32031H7.11828C6.43828 9.32031 5.79828 9.45031 5.19828 9.71031C3.45828 10.4603 2.23828 12.1903 2.23828 14.2003V16.1503C2.23828 16.3903 2.25828 16.6203 2.28828 16.8603C2.50828 20.0403 4.20828 21.7403 7.38828 21.9503C7.61828 21.9803 7.84828 22.0003 8.09828 22.0003H15.8983C19.5983 22.0003 21.5483 20.2403 21.7383 16.7403C21.7483 16.5503 21.7583 16.3503 21.7583 16.1503V14.2003C21.7583 11.9903 20.2883 10.1303 18.2883 9.52031ZM13.2783 15.5003C13.7383 15.6603 14.3583 16.0003 14.3583 17.0603C14.3583 17.9703 13.6483 18.7003 12.7683 18.7003H12.5183V18.9203C12.5183 19.2103 12.2883 19.4403 11.9983 19.4403C11.7083 19.4403 11.4783 19.2103 11.4783 18.9203V18.7003H11.3883C10.4283 18.7003 9.63828 17.8903 9.63828 16.8903C9.63828 16.6003 9.86828 16.3703 10.1583 16.3703C10.4483 16.3703 10.6783 16.6003 10.6783 16.8903C10.6783 17.3103 10.9983 17.6603 11.3883 17.6603H11.4783V15.9703L10.7183 15.7003C10.2583 15.5403 9.63828 15.2003 9.63828 14.1403C9.63828 13.2303 10.3483 12.5003 11.2283 12.5003H11.4783V12.2803C11.4783 11.9903 11.7083 11.7603 11.9983 11.7603C12.2883 11.7603 12.5183 11.9903 12.5183 12.2803V12.5003H12.6083C13.5683 12.5003 14.3583 13.3103 14.3583 14.3103C14.3583 14.6003 14.1283 14.8303 13.8383 14.8303C13.5483 14.8303 13.3183 14.6003 13.3183 14.3103C13.3183 13.8903 12.9983 13.5403 12.6083 13.5403H12.5183V15.2303L13.2783 15.5003Z" fill="#currentColor"/>\n        <path d="M10.6797 14.1391C10.6797 14.5591 10.7997 14.6191 11.0597 14.7191L11.4797 14.8691V13.5391H11.2297C10.9197 13.5391 10.6797 13.8091 10.6797 14.1391Z" fill="#currentColor"/>\n        </svg>`
                },
                filter: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.7206 18.24L19.7806 17.3C20.2706 16.56 20.5606 15.67 20.5606 14.71C20.5606 12.11 18.4506 10 15.8506 10C13.2506 10 11.1406 12.11 11.1406 14.71C11.1406 17.31 13.2506 19.42 15.8506 19.42C16.8106 19.42 17.6906 19.13 18.4406 18.64L19.3806 19.58C19.5706 19.77 19.8106 19.86 20.0606 19.86C20.3106 19.86 20.5506 19.77 20.7406 19.58C21.0906 19.22 21.0906 18.62 20.7206 18.24Z" fill="#currentColor"/>\n        <path d="M19.5799 4.02V6.24C19.5799 7.05 19.0799 8.06 18.5799 8.57L18.3999 8.73C18.2599 8.86 18.0499 8.89 17.8699 8.83C17.6699 8.76 17.4699 8.71 17.2699 8.66C16.8299 8.55 16.3599 8.5 15.8799 8.5C12.4299 8.5 9.62992 11.3 9.62992 14.75C9.62992 15.89 9.93992 17.01 10.5299 17.97C11.0299 18.81 11.7299 19.51 12.4899 19.98C12.7199 20.13 12.8099 20.45 12.6099 20.63C12.5399 20.69 12.4699 20.74 12.3999 20.79L10.9999 21.7C9.69992 22.51 7.90992 21.6 7.90992 19.98V14.63C7.90992 13.92 7.50992 13.01 7.10992 12.51L3.31992 8.47C2.81992 7.96 2.41992 7.05 2.41992 6.45V4.12C2.41992 2.91 3.31992 2 4.40992 2H17.5899C18.6799 2 19.5799 2.91 19.5799 4.02Z" fill="#currentColor"/>\n        </svg>`
                },
                plus: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" fill="currentColor"/>\n        </svg>`
                },
                chat: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M18.4704 16.83L18.8604 19.99C18.9604 20.82 18.0704 21.4 17.3604 20.97L13.9004 18.91C13.6604 18.77 13.6004 18.47 13.7304 18.23C14.2304 17.31 14.5004 16.27 14.5004 15.23C14.5004 11.57 11.3604 8.59 7.50038 8.59C6.71038 8.59 5.94038 8.71 5.22038 8.95C4.85038 9.07 4.49038 8.73 4.58038 8.35C5.49038 4.71 8.99038 2 13.1704 2C18.0504 2 22.0004 5.69 22.0004 10.24C22.0004 12.94 20.6104 15.33 18.4704 16.83Z" fill="currentColor"/>\n        <path d="M13 15.2298C13 16.4198 12.56 17.5198 11.82 18.3898C10.83 19.5898 9.26 20.3598 7.5 20.3598L4.89 21.9098C4.45 22.1798 3.89 21.8098 3.95 21.2998L4.2 19.3298C2.86 18.3998 2 16.9098 2 15.2298C2 13.4698 2.94 11.9198 4.38 10.9998C5.27 10.4198 6.34 10.0898 7.5 10.0898C10.54 10.0898 13 12.3898 13 15.2298Z" fill="currentColor"/>\n        </svg>`
                },
                notification: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.1892 14.0608L19.0592 12.1808C18.8092 11.7708 18.5892 10.9808 18.5892 10.5008V8.63078C18.5892 5.00078 15.6392 2.05078 12.0192 2.05078C8.38923 2.06078 5.43923 5.00078 5.43923 8.63078V10.4908C5.43923 10.9708 5.21923 11.7608 4.97923 12.1708L3.84923 14.0508C3.41923 14.7808 3.31923 15.6108 3.58923 16.3308C3.85923 17.0608 4.46923 17.6408 5.26923 17.9008C6.34923 18.2608 7.43923 18.5208 8.54923 18.7108C8.65923 18.7308 8.76923 18.7408 8.87923 18.7608C9.01923 18.7808 9.16923 18.8008 9.31923 18.8208C9.57923 18.8608 9.83923 18.8908 10.1092 18.9108C10.7392 18.9708 11.3792 19.0008 12.0192 19.0008C12.6492 19.0008 13.2792 18.9708 13.8992 18.9108C14.1292 18.8908 14.3592 18.8708 14.5792 18.8408C14.7592 18.8208 14.9392 18.8008 15.1192 18.7708C15.2292 18.7608 15.3392 18.7408 15.4492 18.7208C16.5692 18.5408 17.6792 18.2608 18.7592 17.9008C19.5292 17.6408 20.1192 17.0608 20.3992 16.3208C20.6792 15.5708 20.5992 14.7508 20.1892 14.0608ZM12.7492 10.0008C12.7492 10.4208 12.4092 10.7608 11.9892 10.7608C11.5692 10.7608 11.2292 10.4208 11.2292 10.0008V6.90078C11.2292 6.48078 11.5692 6.14078 11.9892 6.14078C12.4092 6.14078 12.7492 6.48078 12.7492 6.90078V10.0008Z" fill="currentColor"/>\n        <path d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z" fill="currentColor"/>\n        </svg>`
                },
                users_chat: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M9 2C6.38 2 4.25 4.13 4.25 6.75C4.25 9.32 6.26 11.4 8.88 11.49C8.96 11.48 9.04 11.48 9.1 11.49C9.12 11.49 9.13 11.49 9.15 11.49C9.16 11.49 9.16 11.49 9.17 11.49C11.73 11.4 13.74 9.32 13.75 6.75C13.75 4.13 11.62 2 9 2Z" fill="currentColor"/>\n        <path d="M14.0809 14.1489C11.2909 12.2889 6.74094 12.2889 3.93094 14.1489C2.66094 14.9989 1.96094 16.1489 1.96094 17.3789C1.96094 18.6089 2.66094 19.7489 3.92094 20.5889C5.32094 21.5289 7.16094 21.9989 9.00094 21.9989C10.8409 21.9989 12.6809 21.5289 14.0809 20.5889C15.3409 19.7389 16.0409 18.5989 16.0409 17.3589C16.0309 16.1289 15.3409 14.9889 14.0809 14.1489Z" fill="currentColor"/>\n        <path d="M19.9894 7.33815C20.1494 9.27815 18.7694 10.9781 16.8594 11.2081C16.8494 11.2081 16.8494 11.2081 16.8394 11.2081H16.8094C16.7494 11.2081 16.6894 11.2081 16.6394 11.2281C15.6694 11.2781 14.7794 10.9681 14.1094 10.3981C15.1394 9.47815 15.7294 8.09815 15.6094 6.59815C15.5394 5.78815 15.2594 5.04815 14.8394 4.41815C15.2194 4.22815 15.6594 4.10815 16.1094 4.06815C18.0694 3.89815 19.8194 5.35815 19.9894 7.33815Z" fill="currentColor"/>\n        <path d="M21.9883 16.5904C21.9083 17.5604 21.2883 18.4004 20.2483 18.9704C19.2483 19.5204 17.9883 19.7804 16.7383 19.7504C17.4583 19.1004 17.8783 18.2904 17.9583 17.4304C18.0583 16.1904 17.4683 15.0004 16.2883 14.0504C15.6183 13.5204 14.8383 13.1004 13.9883 12.7904C16.1983 12.1504 18.9783 12.5804 20.6883 13.9604C21.6083 14.7004 22.0783 15.6304 21.9883 16.5904Z" fill="currentColor"/>\n        </svg>`
                },
                menu_config: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.1 9.2214C18.29 9.2214 17.55 7.9414 18.45 6.3714C18.97 5.4614 18.66 4.3014 17.75 3.7814L16.02 2.7914C15.23 2.3214 14.21 2.6014 13.74 3.3914L13.63 3.5814C12.73 5.1514 11.25 5.1514 10.34 3.5814L10.23 3.3914C9.78 2.6014 8.76 2.3214 7.97 2.7914L6.24 3.7814C5.33 4.3014 5.02 5.4714 5.54 6.3814C6.45 7.9414 5.71 9.2214 3.9 9.2214C2.86 9.2214 2 10.0714 2 11.1214V12.8814C2 13.9214 2.85 14.7814 3.9 14.7814C5.71 14.7814 6.45 16.0614 5.54 17.6314C5.02 18.5414 5.33 19.7014 6.24 20.2214L7.97 21.2114C8.76 21.6814 9.78 21.4014 10.25 20.6114L10.36 20.4214C11.26 18.8514 12.74 18.8514 13.65 20.4214L13.76 20.6114C14.23 21.4014 15.25 21.6814 16.04 21.2114L17.77 20.2214C18.68 19.7014 18.99 18.5314 18.47 17.6314C17.56 16.0614 18.3 14.7814 20.11 14.7814C21.15 14.7814 22.01 13.9314 22.01 12.8814V11.1214C22 10.0814 21.15 9.2214 20.1 9.2214ZM12 15.2514C10.21 15.2514 8.75 13.7914 8.75 12.0014C8.75 10.2114 10.21 8.7514 12 8.7514C13.79 8.7514 15.25 10.2114 15.25 12.0014C15.25 13.7914 13.79 15.2514 12 15.2514Z" fill="currentColor"/>\n        </svg>`
                },
                edit_name: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M21 22H3C2.59 22 2.25 21.66 2.25 21.25C2.25 20.84 2.59 20.5 3 20.5H21C21.41 20.5 21.75 20.84 21.75 21.25C21.75 21.66 21.41 22 21 22Z" fill="currentColor"/>\n        <path d="M19.0206 3.48162C17.0806 1.54162 15.1806 1.49162 13.1906 3.48162L11.9806 4.69162C11.8806 4.79162 11.8406 4.95162 11.8806 5.09162C12.6406 7.74162 14.7606 9.86162 17.4106 10.6216C17.4506 10.6316 17.4906 10.6416 17.5306 10.6416C17.6406 10.6416 17.7406 10.6016 17.8206 10.5216L19.0206 9.31162C20.0106 8.33162 20.4906 7.38162 20.4906 6.42162C20.5006 5.43162 20.0206 4.47162 19.0206 3.48162Z" fill="currentColor"/>\n        <path d="M15.6103 11.5308C15.3203 11.3908 15.0403 11.2508 14.7703 11.0908C14.5503 10.9608 14.3403 10.8208 14.1303 10.6708C13.9603 10.5608 13.7603 10.4008 13.5703 10.2408C13.5503 10.2308 13.4803 10.1708 13.4003 10.0908C13.0703 9.81078 12.7003 9.45078 12.3703 9.05078C12.3403 9.03078 12.2903 8.96078 12.2203 8.87078C12.1203 8.75078 11.9503 8.55078 11.8003 8.32078C11.6803 8.17078 11.5403 7.95078 11.4103 7.73078C11.2503 7.46078 11.1103 7.19078 10.9703 6.91078C10.9491 6.86539 10.9286 6.82022 10.9088 6.77532C10.7612 6.442 10.3265 6.34455 10.0688 6.60231L4.34032 12.3308C4.21032 12.4608 4.09032 12.7108 4.06032 12.8808L3.52032 16.7108C3.42032 17.3908 3.61032 18.0308 4.03032 18.4608C4.39032 18.8108 4.89032 19.0008 5.43032 19.0008C5.55032 19.0008 5.67032 18.9908 5.79032 18.9708L9.63032 18.4308C9.81032 18.4008 10.0603 18.2808 10.1803 18.1508L15.9016 12.4295C16.1612 12.1699 16.0633 11.7245 15.7257 11.5804C15.6877 11.5642 15.6492 11.5476 15.6103 11.5308Z" fill="currentColor"/>\n        </svg>`
                },
                togle_on: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M13.86 3.85938H10.14C5.65 3.85938 2 7.50938 2 11.9994C2 16.4894 5.65 20.1394 10.14 20.1394H13.86C18.35 20.1394 22 16.4894 22 11.9994C22 7.50938 18.35 3.85938 13.86 3.85938ZM13.86 16.4194C11.42 16.4194 9.44 14.4394 9.44 11.9994C9.44 9.55938 11.42 7.57938 13.86 7.57938C16.3 7.57938 18.28 9.55938 18.28 11.9994C18.28 14.4394 16.3 16.4194 13.86 16.4194Z"/>\n        </svg>`
                },
                togle_off: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M13.86 3.85938H10.14C5.65 3.85938 2 7.50938 2 11.9994C2 16.4894 5.65 20.1394 10.14 20.1394H13.86C18.35 20.1394 22 16.4894 22 11.9994C22 7.50938 18.35 3.85938 13.86 3.85938ZM10.14 16.4194C7.7 16.4194 5.72 14.4394 5.72 11.9994C5.72 9.55938 7.7 7.57938 10.14 7.57938C12.58 7.57938 14.56 9.55938 14.56 11.9994C14.56 14.4394 12.58 16.4194 10.14 16.4194Z"/>\n        </svg>`
                },
                item_text: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M15.7997 2.21048C15.3897 1.80048 14.6797 2.08048 14.6797 2.65048V6.14048C14.6797 7.60048 15.9197 8.81048 17.4297 8.81048C18.3797 8.82048 19.6997 8.82048 20.8297 8.82048C21.3997 8.82048 21.6997 8.15048 21.2997 7.75048C19.8597 6.30048 17.2797 3.69048 15.7997 2.21048Z" fill="currentColor"/>\n        <path d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19ZM11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75ZM13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" fill="currentColor"/>\n        </svg>`
                },
                item_image: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M2.58078 19.0112L2.56078 19.0312C2.29078 18.4413 2.12078 17.7713 2.05078 17.0312C2.12078 17.7613 2.31078 18.4212 2.58078 19.0112Z" fill="currentColor"/>\n        <path d="M9.00109 10.3811C10.3155 10.3811 11.3811 9.31553 11.3811 8.00109C11.3811 6.68666 10.3155 5.62109 9.00109 5.62109C7.68666 5.62109 6.62109 6.68666 6.62109 8.00109C6.62109 9.31553 7.68666 10.3811 9.00109 10.3811Z" fill="currentColor"/>\n        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 17.28 2.19 18.23 2.56 19.03C3.42 20.93 5.26 22 7.81 22H16.19C19.83 22 22 19.83 22 16.19V13.9V7.81C22 4.17 19.83 2 16.19 2ZM20.37 12.5C19.59 11.83 18.33 11.83 17.55 12.5L13.39 16.07C12.61 16.74 11.35 16.74 10.57 16.07L10.23 15.79C9.52 15.17 8.39 15.11 7.59 15.65L3.85 18.16C3.63 17.6 3.5 16.95 3.5 16.19V7.81C3.5 4.99 4.99 3.5 7.81 3.5H16.19C19.01 3.5 20.5 4.99 20.5 7.81V12.61L20.37 12.5Z" fill="currentColor"/>\n        </svg>`
                },
                magic_pencil: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M19.4998 7.49891L18.0098 8.98891L15.0098 5.98891L16.4998 4.49891C16.9198 4.07891 17.4598 3.87891 17.9998 3.87891C18.5398 3.87891 19.0798 4.07891 19.4998 4.49891C20.3298 5.32891 20.3298 6.66891 19.4998 7.49891Z" fill="currentColor"/>\n        <path d="M17.3095 9.69922L6.49945 20.4992C5.66945 21.3292 4.32945 21.3292 3.49945 20.4992C2.66945 19.6692 2.66945 18.3292 3.49945 17.4992L14.3095 6.69922L17.3095 9.69922Z" fill="currentColor"/>\n        <path d="M9.95051 3.50051L10.3605 2.11051C10.4005 1.98051 10.3605 1.84051 10.2705 1.74051C10.1805 1.64051 10.0205 1.60051 9.89051 1.64051L8.50051 2.05051L7.11051 1.64051C6.98051 1.60051 6.84051 1.64051 6.74051 1.73051C6.64051 1.83051 6.61051 1.97051 6.65051 2.10051L7.05051 3.50051L6.64051 4.89051C6.60051 5.0205 6.64051 5.16051 6.73051 5.26051C6.83051 5.36051 6.97051 5.39051 7.10051 5.35051L8.50051 4.95051L9.89051 5.36051C9.93051 5.37051 9.96051 5.38051 10.0005 5.38051C10.1005 5.38051 10.1905 5.34051 10.2705 5.27051C10.3705 5.17051 10.4005 5.03051 10.3605 4.90051L9.95051 3.50051Z" fill="currentColor"/>\n        <path d="M5.95051 9.50051L6.36051 8.1105C6.40051 7.9805 6.36051 7.84051 6.27051 7.74051C6.17051 7.64051 6.03051 7.61051 5.90051 7.65051L4.50051 8.05051L3.1105 7.64051C2.9805 7.60051 2.84051 7.64051 2.74051 7.73051C2.64051 7.83051 2.61051 7.97051 2.65051 8.10051L3.05051 9.50051L2.64051 10.8905C2.60051 11.0205 2.64051 11.1605 2.73051 11.2605C2.83051 11.3605 2.9705 11.3905 3.1005 11.3505L4.4905 10.9405L5.88051 11.3505C5.91051 11.3605 5.95051 11.3605 5.9905 11.3605C6.0905 11.3605 6.18051 11.3205 6.26051 11.2505C6.36051 11.1505 6.39051 11.0105 6.35051 10.8805L5.95051 9.50051Z" fill="currentColor"/>\n        <path d="M20.9497 14.5L21.3597 13.11C21.3997 12.98 21.3597 12.84 21.2697 12.74C21.1697 12.64 21.0297 12.61 20.8997 12.65L19.5097 13.06L18.1197 12.65C17.9897 12.61 17.8497 12.65 17.7497 12.74C17.6497 12.84 17.6197 12.98 17.6597 13.11L18.0697 14.5L17.6597 15.89C17.6197 16.02 17.6597 16.16 17.7497 16.26C17.8497 16.36 17.9897 16.39 18.1197 16.35L19.5097 15.94L20.8997 16.35C20.9297 16.36 20.9697 16.36 21.0097 16.36C21.1097 16.36 21.1997 16.32 21.2797 16.25C21.3797 16.15 21.4097 16.01 21.3697 15.88L20.9497 14.5Z" fill="currentColor"/>\n        </svg>`
                },
                hashtag: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M10.4199 13.4181H13.2599L13.5799 10.5781H10.7399L10.4199 13.4181Z" fill="currentColor"/>\n        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM18.82 10.58H15.05L14.73 13.43H18.1C18.5 13.43 18.83 13.76 18.83 14.16C18.83 14.56 18.5 14.89 18.1 14.89H14.57L14.16 18.55C14.12 18.92 13.8 19.2 13.43 19.2C13.4 19.2 13.38 19.2 13.35 19.2C12.95 19.16 12.66 18.79 12.7 18.39L13.09 14.89H10.25L9.84 18.55C9.8 18.92 9.48 19.2 9.11 19.2C9.08 19.2 9.06 19.2 9.03 19.2C8.63 19.16 8.34 18.79 8.38 18.39L8.77 14.89H5.18C4.78 14.89 4.45 14.56 4.45 14.16C4.45 13.76 4.78 13.43 5.18 13.43H8.95L9.27 10.58H5.9C5.5 10.58 5.17 10.25 5.17 9.85C5.17 9.45 5.5 9.12 5.9 9.12H9.43L9.84 5.46C9.88 5.06 10.25 4.77 10.65 4.81C11.05 4.85 11.34 5.22 11.3 5.62L10.91 9.12H13.75L14.16 5.46C14.21 5.06 14.57 4.77 14.97 4.81C15.37 4.85 15.66 5.22 15.62 5.62L15.23 9.12H18.84C19.24 9.12 19.57 9.45 19.57 9.85C19.57 10.25 19.22 10.58 18.82 10.58Z" fill="currentColor"/>\n        </svg>`
                },
                save: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 9C3 6.17157 3 4.75736 3.87868 3.87868C4.75736 3 6.17157 3 9 3H15.3431C16.1606 3 16.5694 3 16.9369 3.15224C17.3045 3.30448 17.5935 3.59351 18.1716 4.17157L19.8284 5.82843C20.4065 6.40649 20.6955 6.69552 20.8478 7.06306C21 7.4306 21 7.83935 21 8.65685V15C21 17.8284 21 19.2426 20.1213 20.1213C19.48 20.7626 18.5534 20.9359 17 20.9827V18L17 17.9384C17.0001 17.2843 17.0001 16.6965 16.9362 16.2208C16.8663 15.7015 16.7042 15.1687 16.2678 14.7322C15.8313 14.2958 15.2985 14.1337 14.7792 14.0638C14.3034 13.9999 13.7157 13.9999 13.0616 14L13 14H10L9.93839 14C9.28427 13.9999 8.69655 13.9999 8.22084 14.0638C7.70149 14.1337 7.16867 14.2958 6.73223 14.7322C6.29579 15.1687 6.13366 15.7015 6.06383 16.2208C5.99988 16.6965 5.99993 17.2843 6 17.9384L6 18V20.9239C5.02491 20.828 4.36857 20.6112 3.87868 20.1213C3 19.2426 3 17.8284 3 15V9ZM15 18V21H9C8.64496 21 8.31221 21 8 20.9983V18C8 17.2646 8.00212 16.8137 8.046 16.4873C8.08457 16.2005 8.13942 16.1526 8.14592 16.1469L8.14645 16.1464L8.14692 16.1459C8.1526 16.1394 8.20049 16.0846 8.48734 16.046C8.81369 16.0021 9.26462 16 10 16H13C13.7354 16 14.1863 16.0021 14.5127 16.046C14.7995 16.0846 14.8474 16.1394 14.8531 16.1459L14.8536 16.1464L14.8541 16.1469C14.8606 16.1526 14.9154 16.2005 14.954 16.4873C14.9979 16.8137 15 17.2646 15 18ZM7 7C6.44772 7 6 7.44772 6 8C6 8.55228 6.44772 9 7 9H12C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7H7Z" fill="currentColor"/>\n        </svg>`
                },
                api: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8.53 13.47C8.82 13.76 8.82 14.24 8.53 14.53C8.38 14.68 8.19 14.75 8 14.75C7.81 14.75 7.62 14.68 7.47 14.53L5.47 12.53C5.18 12.24 5.18 11.76 5.47 11.47L7.47 9.47C7.76 9.18 8.24 9.18 8.53 9.47C8.82 9.76 8.82 10.24 8.53 10.53L7.06 12L8.53 13.47ZM13.69 9.96L11.69 14.63C11.57 14.91 11.29 15.08 11 15.08C10.9 15.08 10.8 15.06 10.71 15.02C10.33 14.86 10.15 14.42 10.32 14.03L12.32 9.36C12.48 8.98 12.92 8.8 13.3 8.97C13.68 9.14 13.85 9.58 13.69 9.96ZM18.53 12.53L16.53 14.53C16.38 14.68 16.19 14.75 16 14.75C15.81 14.75 15.62 14.68 15.47 14.53C15.18 14.24 15.18 13.76 15.47 13.47L16.94 12L15.47 10.53C15.18 10.24 15.18 9.76 15.47 9.47C15.76 9.18 16.24 9.18 16.53 9.47L18.53 11.47C18.82 11.76 18.82 12.24 18.53 12.53Z" fill="currentColor"/>\n        </svg>`
                },
                copy: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M14.3498 2H9.64977C8.60977 2 7.75977 2.84 7.75977 3.88V4.82C7.75977 5.86 8.59977 6.7 9.63977 6.7H14.3498C15.3898 6.7 16.2298 5.86 16.2298 4.82V3.88C16.2398 2.84 15.3898 2 14.3498 2Z" fill="currentColor"/>\n        <path d="M17.2391 4.81949C17.2391 6.40949 15.9391 7.70949 14.3491 7.70949H9.64906C8.05906 7.70949 6.75906 6.40949 6.75906 4.81949C6.75906 4.25949 6.15906 3.90949 5.65906 4.16949C4.24906 4.91949 3.28906 6.40949 3.28906 8.11949V17.5295C3.28906 19.9895 5.29906 21.9995 7.75906 21.9995H16.2391C18.6991 21.9995 20.7091 19.9895 20.7091 17.5295V8.11949C20.7091 6.40949 19.7491 4.91949 18.3391 4.16949C17.8391 3.90949 17.2391 4.25949 17.2391 4.81949ZM12.3791 16.9495H7.99906C7.58906 16.9495 7.24906 16.6095 7.24906 16.1995C7.24906 15.7895 7.58906 15.4495 7.99906 15.4495H12.3791C12.7891 15.4495 13.1291 15.7895 13.1291 16.1995C13.1291 16.6095 12.7891 16.9495 12.3791 16.9495ZM14.9991 12.9495H7.99906C7.58906 12.9495 7.24906 12.6095 7.24906 12.1995C7.24906 11.7895 7.58906 11.4495 7.99906 11.4495H14.9991C15.4091 11.4495 15.7491 11.7895 15.7491 12.1995C15.7491 12.6095 15.4091 12.9495 14.9991 12.9495Z" fill="currentColor"/>\n        </svg>`
                },
                copy_success: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M17.0998 2H12.8998C9.81668 2 8.37074 3.09409 8.06951 5.73901C8.00649 6.29235 8.46476 6.75 9.02167 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V14.9781C17.2498 15.535 17.7074 15.9933 18.2608 15.9303C20.9057 15.629 21.9998 14.1831 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z" fill="currentColor"/>\n        <path d="M11.1 8H6.9C3.4 8 2 9.4 2 12.9V17.1C2 20.6 3.4 22 6.9 22H11.1C14.6 22 16 20.6 16 17.1V12.9C16 9.4 14.6 8 11.1 8ZM12.29 13.65L8.58 17.36C8.44 17.5 8.26 17.57 8.07 17.57C7.88 17.57 7.7 17.5 7.56 17.36L5.7 15.5C5.42 15.22 5.42 14.77 5.7 14.49C5.98 14.21 6.43 14.21 6.71 14.49L8.06 15.84L11.27 12.63C11.55 12.35 12 12.35 12.28 12.63C12.56 12.91 12.57 13.37 12.29 13.65Z" fill="currentColor"/>\n        </svg>`
                },
                eye: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" xmlns="http://www.w3.org/2000/svg">\n        <path d="M21.25 9.14969C18.94 5.51969 15.56 3.42969 12 3.42969C10.22 3.42969 8.49 3.94969 6.91 4.91969C5.33 5.89969 3.91 7.32969 2.75 9.14969C1.75 10.7197 1.75 13.2697 2.75 14.8397C5.06 18.4797 8.44 20.5597 12 20.5597C13.78 20.5597 15.51 20.0397 17.09 19.0697C18.67 18.0897 20.09 16.6597 21.25 14.8397C22.25 13.2797 22.25 10.7197 21.25 9.14969ZM12 16.0397C9.76 16.0397 7.96 14.2297 7.96 11.9997C7.96 9.76969 9.76 7.95969 12 7.95969C14.24 7.95969 16.04 9.76969 16.04 11.9997C16.04 14.2297 14.24 16.0397 12 16.0397Z" fill="currentColor"/>\n        <path d="M11.9984 9.14062C10.4284 9.14062 9.14844 10.4206 9.14844 12.0006C9.14844 13.5706 10.4284 14.8506 11.9984 14.8506C13.5684 14.8506 14.8584 13.5706 14.8584 12.0006C14.8584 10.4306 13.5684 9.14062 11.9984 9.14062Z" fill="currentColor"/>\n        </svg>`
                },
                flash: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM15.53 13.23L10.35 16.82C9.59 17.35 9.15 17.04 9.37 16.15L10.32 12.31L8.67 11.9C7.92 11.72 7.83 11.2 8.46 10.76L13.64 7.17C14.4 6.64 14.84 6.95 14.62 7.84L13.67 11.68L15.32 12.09C16.07 12.28 16.16 12.79 15.53 13.23Z" fill="currentColor"/>\n        </svg>`
                },
                search: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" fill="currentColor"/>\n        <path d="M21.3005 21.9986C21.1205 21.9986 20.9405 21.9286 20.8105 21.7986L18.9505 19.9386C18.6805 19.6686 18.6805 19.2286 18.9505 18.9486C19.2205 18.6786 19.6605 18.6786 19.9405 18.9486L21.8005 20.8086C22.0705 21.0786 22.0705 21.5186 21.8005 21.7986C21.6605 21.9286 21.4805 21.9986 21.3005 21.9986Z" fill="currentColor"/>\n        </svg>`
                },
                script_file: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16 2H8C4.5 2 3 4 3 7V17C3 20 4.5 22 8 22H16C19.5 22 21 20 21 17V7C21 4 19.5 2 16 2ZM10.53 16.47C10.82 16.76 10.82 17.24 10.53 17.53C10.38 17.68 10.19 17.75 10 17.75C9.81 17.75 9.62 17.68 9.47 17.53L7.47 15.53C7.18 15.24 7.18 14.76 7.47 14.47L9.47 12.47C9.76 12.18 10.24 12.18 10.53 12.47C10.82 12.76 10.82 13.24 10.53 13.53L9.06 15L10.53 16.47ZM16.53 15.53L14.53 17.53C14.38 17.68 14.19 17.75 14 17.75C13.81 17.75 13.62 17.68 13.47 17.53C13.18 17.24 13.18 16.76 13.47 16.47L14.94 15L13.47 13.53C13.18 13.24 13.18 12.76 13.47 12.47C13.76 12.18 14.24 12.18 14.53 12.47L16.53 14.47C16.82 14.76 16.82 15.24 16.53 15.53ZM18.5 9.25H16.5C14.98 9.25 13.75 8.02 13.75 6.5V4.5C13.75 4.09 14.09 3.75 14.5 3.75C14.91 3.75 15.25 4.09 15.25 4.5V6.5C15.25 7.19 15.81 7.75 16.5 7.75H18.5C18.91 7.75 19.25 8.09 19.25 8.5C19.25 8.91 18.91 9.25 18.5 9.25Z" fill="currentColor"/>\n        </svg>`
                },
                audio_file: function(e, t, a) {
                    return `<svg  fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12.0016 21.9292C6.96156 21.9292 2.85156 17.8292 2.85156 12.7792V10.8992C2.85156 10.5092 3.17156 10.1992 3.55156 10.1992C3.93156 10.1992 4.25156 10.5192 4.25156 10.8992V12.7792C4.25156 17.0492 7.72156 20.5192 11.9916 20.5192C16.2616 20.5192 19.7316 17.0492 19.7316 12.7792V10.8992C19.7316 10.5092 20.0516 10.1992 20.4316 10.1992C20.8116 10.1992 21.1316 10.5192 21.1316 10.8992V12.7792C21.1516 17.8292 17.0416 21.9292 12.0016 21.9292Z" fill="currentColor"/>\n        <path d="M11.9984 2C8.63844 2 5.89844 4.74 5.89844 8.1V12.79C5.89844 16.15 8.63844 18.89 11.9984 18.89C15.3584 18.89 18.0984 16.15 18.0984 12.79V8.1C18.0984 4.74 15.3584 2 11.9984 2ZM14.1784 10.59C14.1084 10.86 13.8584 11.04 13.5884 11.04C13.5384 11.04 13.4784 11.03 13.4284 11.02C12.4084 10.74 11.3284 10.74 10.3084 11.02C9.97844 11.11 9.64844 10.92 9.55844 10.59C9.46844 10.27 9.65844 9.93 9.98844 9.84C11.2184 9.5 12.5184 9.5 13.7484 9.84C14.0784 9.93 14.2684 10.26 14.1784 10.59ZM15.0284 7.82C14.9384 8.07 14.7084 8.22 14.4584 8.22C14.3884 8.22 14.3184 8.21 14.2484 8.18C12.7184 7.62 11.0384 7.62 9.50844 8.18C9.18844 8.3 8.83844 8.14 8.71844 7.82C8.60844 7.51 8.76844 7.16 9.08844 7.04C10.8884 6.39 12.8684 6.39 14.6584 7.04C14.9784 7.16 15.1384 7.51 15.0284 7.82Z" fill="currentColor"/>\n        </svg>`
                },
                module_premium: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M22.0003 5.70951V15.2895C22.0003 18.0495 19.7603 20.2895 17.0003 20.2895H7.00031C6.54031 20.2895 6.10031 20.2295 5.67031 20.1095C5.05031 19.9395 4.85031 19.1495 5.31031 18.6895L15.9403 8.05951C16.1603 7.83951 16.4903 7.78951 16.8003 7.84951C17.1203 7.90951 17.4703 7.81951 17.7203 7.57951L20.2903 4.99951C21.2303 4.05951 22.0003 4.36951 22.0003 5.70951Z" fill="gold"/>\n        <path d="M14.64 7.35953L4.17 17.8295C3.69 18.3095 2.89 18.1895 2.57 17.5895C2.2 16.9095 2 16.1195 2 15.2895V5.70953C2 4.36953 2.77 4.05953 3.71 4.99953L6.29 7.58953C6.68 7.96953 7.32 7.96953 7.71 7.58953L11.29 3.99953C11.68 3.60953 12.32 3.60953 12.71 3.99953L14.65 5.93953C15.03 6.32953 15.03 6.96953 14.64 7.35953Z" fill="currentColor"/>\n        </svg>`
                },
                module_basic: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.4098 6.96141V8.79141C20.4098 9.43141 20.1098 10.0314 19.5898 10.4014L8.58984 18.4614C7.87984 18.9814 6.90984 18.9814 6.20984 18.4514L4.76984 17.3714C4.11984 16.8814 3.58984 15.8214 3.58984 15.0114V6.96141C3.58984 5.84141 4.44984 4.60141 5.49984 4.21141L10.9698 2.16141C11.5398 1.95141 12.4598 1.95141 13.0298 2.16141L18.4998 4.21141C19.5498 4.60141 20.4098 5.84141 20.4098 6.96141Z" fill="currentColor"/>\n        <path d="M18.8216 12.3414C19.4816 11.8614 20.4116 12.3314 20.4116 13.1514V15.0314C20.4116 15.8414 19.8816 16.8914 19.2316 17.3814L13.7616 21.4714C13.2816 21.8214 12.6416 22.0014 12.0016 22.0014C11.3616 22.0014 10.7216 21.8214 10.2416 21.4614L9.41157 20.8414C8.87157 20.4414 8.87157 19.6314 9.42157 19.2314L18.8216 12.3414Z" fill="gold"/>\n        </svg>`
                },
                module_free: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M17.8796 6.12156L3.9196 20.0816C3.4896 20.5116 2.7696 20.4716 2.4196 19.9816C1.9196 19.2916 1.8196 18.3316 2.3396 17.5016L5.0996 13.0716C5.4696 12.4816 5.4696 11.5216 5.0996 10.9316L2.3396 6.50156C1.4096 5.02156 2.4796 3.10156 4.2196 3.10156H15.6696C16.3496 3.10156 17.1896 3.57156 17.5496 4.14156L18.0196 4.88156C18.2596 5.28156 18.2096 5.79156 17.8796 6.12156Z" fill="currentColor"/>\n        <path d="M21.6299 13.1119L16.4499 20.0119C16.0899 20.5019 15.2899 20.9019 14.6699 20.9019H7.50987C6.61987 20.9019 6.16987 19.8219 6.79987 19.1919L18.3199 7.68195C18.7699 7.23195 19.5399 7.31195 19.8799 7.86195L21.7299 10.8319C22.1299 11.4719 22.0899 12.5019 21.6299 13.1119Z" fill="gold"/>\n        </svg>`
                },
                warning: function(e, t, a) {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M19.5099 5.85L13.5699 2.42C12.5999 1.86 11.3999 1.86 10.4199 2.42L4.48992 5.85C3.51992 6.41 2.91992 7.45 2.91992 8.58V15.42C2.91992 16.54 3.51992 17.58 4.48992 18.15L10.4299 21.58C11.3999 22.14 12.5999 22.14 13.5799 21.58L19.5199 18.15C20.4899 17.59 21.0899 16.55 21.0899 15.42V8.58C21.0799 7.45 20.4799 6.42 19.5099 5.85ZM11.2499 7.75C11.2499 7.34 11.5899 7 11.9999 7C12.4099 7 12.7499 7.34 12.7499 7.75V13C12.7499 13.41 12.4099 13.75 11.9999 13.75C11.5899 13.75 11.2499 13.41 11.2499 13V7.75ZM12.9199 16.63C12.8699 16.75 12.7999 16.86 12.7099 16.96C12.5199 17.15 12.2699 17.25 11.9999 17.25C11.8699 17.25 11.7399 17.22 11.6199 17.17C11.4899 17.12 11.3899 17.05 11.2899 16.96C11.1999 16.86 11.1299 16.75 11.0699 16.63C11.0199 16.51 10.9999 16.38 10.9999 16.25C10.9999 15.99 11.0999 15.73 11.2899 15.54C11.3899 15.45 11.4899 15.38 11.6199 15.33C11.9899 15.17 12.4299 15.26 12.7099 15.54C12.7999 15.64 12.8699 15.74 12.9199 15.87C12.9699 15.99 12.9999 16.12 12.9999 16.25C12.9999 16.38 12.9699 16.51 12.9199 16.63Z" fill="currentColor"/>\n        </svg>`
                },
                circle_check: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor"/>\n        </svg>`
                },
                circle_minus: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM15.92 12.75H7.92C7.51 12.75 7.17 12.41 7.17 12C7.17 11.59 7.51 11.25 7.92 11.25H15.92C16.33 11.25 16.67 11.59 16.67 12C16.67 12.41 16.34 12.75 15.92 12.75Z" fill="currentColor"/>\n        </svg>`
                },
                circle_option: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M11.9688 2C6.44875 2 1.96875 6.48 1.96875 12C1.96875 17.52 6.44875 22 11.9688 22C17.4888 22 21.9688 17.52 21.9688 12C21.9688 6.48 17.4988 2 11.9688 2ZM11.9987 16.23C9.65875 16.23 7.76875 14.34 7.76875 12C7.76875 9.66 9.65875 7.77 11.9987 7.77C14.3387 7.77 16.2287 9.66 16.2287 12C16.2287 14.34 14.3387 16.23 11.9987 16.23Z" fill="currentColor"/>\n        </svg>`
                },
                webhook: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">\n        <g fill="currentColor">\n        <path d="M6.032 4.132c0-1.039.843-1.882 1.886-1.882.709 0 1.328.39 1.65.97a.75.75 0 101.311-.728A3.385 3.385 0 007.918.75a3.383 3.383 0 00-3.386 3.382c0 .94.385 1.79 1.003 2.402l-2.054 3.594a1.25 1.25 0 00.151 2.49h.007a1.25 1.25 0 001.146-1.75l2.369-4.144a.75.75 0 00-.249-1.005 1.879 1.879 0 01-.873-1.587z"/>\n        <path d="M7.793 5.375a1.25 1.25 0 01.125-2.494h.006a1.25 1.25 0 011.157 1.725l2.159 3.572a3.383 3.383 0 014.51 3.19 3.383 3.383 0 01-4.23 3.275.75.75 0 11.373-1.452 1.883 1.883 0 002.357-1.822 1.883 1.883 0 00-2.897-1.588.75.75 0 01-1.045-.245l-2.515-4.16z"/>\n        <path d="M2.002 10.429a.75.75 0 00-1.298-.752 3.383 3.383 0 002.932 5.073c1.61 0 2.96-1.124 3.301-2.632h4.42c.229.304.592.5 1.001.5h.007a1.25 1.25 0 000-2.5h-.007c-.409 0-.772.197-1 .5H6.271a.75.75 0 00-.75.75 1.883 1.883 0 01-1.886 1.882 1.883 1.883 0 01-1.633-2.821z"/>\n        </g>\n        </svg>`
                },
                note: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.9009 9.85L21.4909 19.74C21.5109 20.01 21.3809 20.19 21.3109 20.27C21.2309 20.36 21.0609 20.5 20.7809 20.5H18.0509L20.2109 9.85H20.9009ZM22.0009 6L21.9909 6.02C22.0109 6.26 21.9909 6.51 21.9309 6.76L14.5609 20.29C14.3209 21.3 13.4209 22 12.3809 22H20.7809C22.0709 22 23.0909 20.91 22.9909 19.62L22.0009 6Z" fill="currentColor"/>\n        <path d="M11.4502 2.24136C11.5502 1.84136 11.3002 1.43136 10.9002 1.33136C10.5002 1.24136 10.0902 1.48136 9.99023 1.88136L9.49023 3.95136H11.0302L11.4502 2.24136Z" fill="currentColor"/>\n        <path d="M18.0509 2.20859C18.1409 1.79859 17.8809 1.40859 17.4709 1.31859C17.0709 1.22859 16.6709 1.48859 16.5809 1.89859L16.1309 3.96859H17.6709L18.0509 2.20859Z" fill="currentColor"/>\n        <path d="M21.8198 5.33141C21.4898 4.53141 20.7098 3.96141 19.7498 3.96141H17.6698L17.1098 6.55141C17.0298 6.90141 16.7198 7.14141 16.3798 7.14141C16.3298 7.14141 16.2698 7.14141 16.2198 7.12141C15.8198 7.03141 15.5598 6.63141 15.6398 6.23141L16.1298 3.95141H11.0298L10.3998 6.55141C10.3198 6.89141 10.0098 7.12141 9.66975 7.12141C9.60975 7.12141 9.54976 7.11141 9.48975 7.10141C9.08976 7.00141 8.83975 6.60141 8.93975 6.19141L9.47975 3.94141H7.44975C6.46975 3.94141 5.59975 4.58141 5.30975 5.52141L1.09975 19.0714C0.659754 20.5214 1.72975 22.0014 3.23975 22.0014H16.3798C17.4198 22.0014 18.3198 21.3014 18.5598 20.2914L21.9298 6.76141C21.9898 6.51141 22.0098 6.26141 21.9898 6.02141C21.9698 5.78141 21.9198 5.54141 21.8198 5.33141ZM14.6998 16.7514H6.69975C6.28975 16.7514 5.94975 16.4114 5.94975 16.0014C5.94975 15.5914 6.28975 15.2514 6.69975 15.2514H14.6998C15.1098 15.2514 15.4498 15.5914 15.4498 16.0014C15.4498 16.4114 15.1098 16.7514 14.6998 16.7514ZM15.6998 12.7514H7.69975C7.28975 12.7514 6.94975 12.4114 6.94975 12.0014C6.94975 11.5914 7.28975 11.2514 7.69975 11.2514H15.6998C16.1098 11.2514 16.4498 11.5914 16.4498 12.0014C16.4498 12.4114 16.1098 12.7514 15.6998 12.7514Z" fill="currentColor"/>\n        </svg>`
                },
                refresh: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM5.25 11.89C5.28 10.13 5.98 8.47 7.22 7.23C8.5 5.95 10.2 5.25 12 5.25C13.8 5.25 15.5 5.95 16.77 7.23C16.8 7.26 16.83 7.3 16.86 7.34V6.48C16.86 6.07 17.2 5.73 17.61 5.73C18.02 5.73 18.36 6.07 18.36 6.48V9.13C18.36 9.54 18.02 9.88 17.61 9.88H14.96C14.55 9.88 14.21 9.54 14.21 9.13C14.21 8.72 14.55 8.38 14.96 8.38H15.79C15.76 8.35 15.74 8.32 15.71 8.29C14.72 7.3 13.4 6.75 12 6.75C10.6 6.75 9.28 7.3 8.29 8.29C7.32 9.26 6.78 10.55 6.76 11.92C6.75 12.32 6.41 12.65 6 12.65H5.99C5.58 12.65 5.25 12.3 5.25 11.89ZM16.77 16.77C15.5 18.04 13.8 18.75 12 18.75C10.2 18.75 8.5 18.05 7.23 16.77C7.2 16.74 7.17 16.7 7.14 16.66V17.51C7.14 17.92 6.8 18.26 6.39 18.26C5.98 18.26 5.64 17.92 5.64 17.51V14.86C5.64 14.45 5.98 14.11 6.39 14.11H9.04C9.45 14.11 9.79 14.45 9.79 14.86C9.79 15.27 9.45 15.61 9.04 15.61H8.21C8.24 15.64 8.26 15.67 8.29 15.7C9.28 16.69 10.6 17.24 12 17.24C13.4 17.24 14.72 16.69 15.71 15.7C16.69 14.72 17.24 13.41 17.24 12.01C17.24 11.6 17.58 11.26 17.99 11.26C18.4 11.26 18.74 11.6 18.74 12.01C18.74 13.82 18.04 15.51 16.77 16.77Z" fill="currentColor"/>\n        </svg>`
                },
                calendar_search: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.7502 3.56V2C16.7502 1.59 16.4102 1.25 16.0002 1.25C15.5902 1.25 15.2502 1.59 15.2502 2V3.5H8.75023V2C8.75023 1.59 8.41023 1.25 8.00023 1.25C7.59023 1.25 7.25023 1.59 7.25023 2V3.56C4.55023 3.81 3.24023 5.42 3.04023 7.81C3.02023 8.1 3.26023 8.34 3.54023 8.34H20.4602C20.7502 8.34 20.9902 8.09 20.9602 7.81C20.7602 5.42 19.4502 3.81 16.7502 3.56Z" fill="currentColor"/>\n        <path d="M20 9.83984H4C3.45 9.83984 3 10.2898 3 10.8398V16.9998C3 19.9998 4.5 21.9998 8 21.9998H16C19.5 21.9998 21 19.9998 21 16.9998V10.8398C21 10.2898 20.55 9.83984 20 9.83984ZM15.66 19.5298C15.51 19.6798 15.32 19.7498 15.13 19.7498C14.94 19.7498 14.75 19.6798 14.6 19.5298L13.86 18.7898C13.28 19.1698 12.58 19.3998 11.83 19.3998C9.79 19.3998 8.13 17.7398 8.13 15.6998C8.13 13.6598 9.79 11.9998 11.83 11.9998C13.87 11.9998 15.53 13.6598 15.53 15.6998C15.53 16.4498 15.3 17.1498 14.92 17.7298L15.66 18.4698C15.95 18.7598 15.95 19.2398 15.66 19.5298Z" fill="currentColor"/>\n        </svg>`
                },
                download_file: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19ZM12.28 15.78L10.28 17.78C10.21 17.85 10.12 17.91 10.03 17.94C9.94 17.98 9.85 18 9.75 18C9.65 18 9.56 17.98 9.47 17.94C9.39 17.91 9.31 17.85 9.25 17.79C9.24 17.78 9.23 17.78 9.23 17.77L7.23 15.77C6.94 15.48 6.94 15 7.23 14.71C7.52 14.42 8 14.42 8.29 14.71L9 15.44V11.25C9 10.84 9.34 10.5 9.75 10.5C10.16 10.5 10.5 10.84 10.5 11.25V15.44L11.22 14.72C11.51 14.43 11.99 14.43 12.28 14.72C12.57 15.01 12.57 15.49 12.28 15.78Z" fill="currentColor"/>\n        <path d="M17.4297 8.81048C18.3797 8.82048 19.6997 8.82048 20.8297 8.82048C21.3997 8.82048 21.6997 8.15048 21.2997 7.75048C19.8597 6.30048 17.2797 3.69048 15.7997 2.21048C15.3897 1.80048 14.6797 2.08048 14.6797 2.65048V6.14048C14.6797 7.60048 15.9197 8.81048 17.4297 8.81048Z" fill="currentColor"/>\n        </svg>`
                },
                brain: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n        viewBox="0 0 512 512" xml:space="preserve">\n   <g>\n       <g>\n           <rect x="225.514" y="225.514" width="60.969" height="60.969"/>\n       </g>\n   </g>\n   <g>\n       <g>\n           <path d="M239.304,192.124V21.076C223.419,7.922,203.056,0,180.867,0c-50.635,0-91.828,41.194-91.828,91.828\n               c0,2.794,0.145,5.565,0.397,8.313c-18.359,4.808-35.075,14.719-48.274,28.848c-17.578,18.819-27.257,43.37-27.257,69.132\n               c0,21.486,6.731,41.427,18.185,57.837c-11.804,16.895-18.185,37.001-18.185,57.919c0,46.95,32.11,86.538,75.522,97.967\n               c-0.249,2.761-0.39,5.537-0.39,8.327c0,50.635,41.194,91.828,91.828,91.828c22.19,0,42.553-7.922,58.437-21.076V343.088h0.001\n               v-23.211h-13.79v23.211h-33.391v-23.211h-23.211v-33.391h23.211v-13.789h-23.211v-33.391h23.211v-13.79h-23.211v-33.391h23.211\n               v-23.211h33.391v23.211H239.304z"/>\n       </g>\n   </g>\n   <g>\n       <g>\n           <path d="M498.095,198.122c0-25.763-9.68-50.313-27.257-69.131c-13.197-14.129-29.915-24.039-48.274-28.848\n               c0.253-2.749,0.397-5.521,0.397-8.313C422.962,41.194,381.768,0,331.133,0c-22.189,0-42.552,7.922-58.437,21.076v171.048h13.789\n               v-23.211h33.391v23.211h23.211v33.391h-23.211v13.79h23.211v33.391h-23.211v13.789h23.211v33.391h-23.211v23.211h-33.391v-23.211\n               h-13.789v171.048C288.581,504.078,308.944,512,331.133,512c50.635,0,91.828-41.194,91.828-91.828c0-2.788-0.14-5.565-0.39-8.327\n               c43.412-11.429,75.522-51.016,75.522-97.967c0-20.919-6.382-41.025-18.185-57.919\n               C491.365,239.549,498.095,219.608,498.095,198.122z"/>\n       </g>\n   </g>\n   </svg>`
                },
                loading: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n        viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">\n        <circle fill="currentColor" stroke="none" cx="6" cy="50" r="6">\n          <animate\n            attributeName="opacity"\n            dur="1s"\n            values="0;1;0"\n            repeatCount="indefinite"\n            begin="0.1"/>    \n        </circle>\n        <circle fill="currentColor" stroke="none" cx="26" cy="50" r="6">\n          <animate\n            attributeName="opacity"\n            dur="1s"\n            values="0;1;0"\n            repeatCount="indefinite" \n            begin="0.2"/>       \n        </circle>\n        <circle fill="currentColor" stroke="none" cx="46" cy="50" r="6">\n          <animate\n            attributeName="opacity"\n            dur="1s"\n            values="0;1;0"\n            repeatCount="indefinite" \n            begin="0.3"/>     \n        </circle>\n      </svg>`
                },
                formal: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M21.091 6.97953C20.241 6.03953 18.821 5.56953 16.761 5.56953H16.521V5.52953C16.521 3.84953 16.521 1.76953 12.761 1.76953H11.241C7.48101 1.76953 7.48101 3.85953 7.48101 5.52953V5.57953H7.24101C5.17101 5.57953 3.76101 6.04953 2.91101 6.98953C1.92101 8.08953 1.95101 9.56953 2.05101 10.5795L2.06101 10.6495L2.13847 11.4628C2.15273 11.6126 2.2334 11.7479 2.35929 11.8303C2.59909 11.9872 3.00044 12.2459 3.24101 12.3795C3.38101 12.4695 3.53101 12.5495 3.68101 12.6295C5.39101 13.5695 7.27101 14.1995 9.18101 14.5095C9.27101 15.4495 9.68101 16.5495 11.871 16.5495C14.061 16.5495 14.491 15.4595 14.561 14.4895C16.601 14.1595 18.571 13.4495 20.351 12.4095C20.411 12.3795 20.451 12.3495 20.501 12.3195C20.8977 12.0953 21.3093 11.819 21.6845 11.5484C21.7975 11.4668 21.8698 11.3408 21.8852 11.2023L21.901 11.0595L21.951 10.5895C21.961 10.5295 21.961 10.4795 21.971 10.4095C22.051 9.39953 22.031 8.01953 21.091 6.97953ZM13.091 13.8295C13.091 14.8895 13.091 15.0495 11.861 15.0495C10.631 15.0495 10.631 14.8595 10.631 13.8395V12.5795H13.091V13.8295ZM8.91101 5.56953V5.52953C8.91101 3.82953 8.91101 3.19953 11.241 3.19953H12.761C15.091 3.19953 15.091 3.83953 15.091 5.52953V5.57953H8.91101V5.56953Z"/>\n        <path d="M20.8733 13.7349C21.2269 13.5666 21.6342 13.8469 21.5988 14.2369L21.2398 18.1907C21.0298 20.1907 20.2098 22.2307 15.8098 22.2307H8.18984C3.78984 22.2307 2.96984 20.1907 2.75984 18.2007L2.41913 14.4529C2.38409 14.0674 2.78205 13.7874 3.13468 13.947C4.2741 14.4625 6.37724 15.3771 7.67641 15.7174C7.84072 15.7604 7.97361 15.878 8.04556 16.0319C8.65253 17.33 9.96896 18.0207 11.8698 18.0207C13.752 18.0207 15.085 17.3034 15.694 16.0021C15.766 15.8481 15.8991 15.7305 16.0635 15.6873C17.443 15.3243 19.6816 14.3019 20.8733 13.7349Z" />\n        </svg>`
                },
                target: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M22 11.25H19.96C19.6 7.44 16.56 4.39 12.75 4.04V2C12.75 1.59 12.41 1.25 12 1.25C11.59 1.25 11.25 1.59 11.25 2V4.04C7.44 4.4 4.39 7.44 4.04 11.25H2C1.59 11.25 1.25 11.59 1.25 12C1.25 12.41 1.59 12.75 2 12.75H4.04C4.4 16.56 7.44 19.61 11.25 19.96V22C11.25 22.41 11.59 22.75 12 22.75C12.41 22.75 12.75 22.41 12.75 22V19.96C16.56 19.6 19.61 16.56 19.96 12.75H22C22.41 12.75 22.75 12.41 22.75 12C22.75 11.59 22.41 11.25 22 11.25ZM12 15.12C10.28 15.12 8.88 13.72 8.88 12C8.88 10.28 10.28 8.88 12 8.88C13.72 8.88 15.12 10.28 15.12 12C15.12 13.72 13.72 15.12 12 15.12Z" />\n        </svg>`
                },
                heart: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.44 3.10156C14.63 3.10156 13.01 3.98156 12 5.33156C10.99 3.98156 9.37 3.10156 7.56 3.10156C4.49 3.10156 2 5.60156 2 8.69156C2 9.88156 2.19 10.9816 2.52 12.0016C4.1 17.0016 8.97 19.9916 11.38 20.8116C11.72 20.9316 12.28 20.9316 12.62 20.8116C15.03 19.9916 19.9 17.0016 21.48 12.0016C21.81 10.9816 22 9.88156 22 8.69156C22 5.60156 19.51 3.10156 16.44 3.10156Z" />\n        </svg>`
                },
                lampada: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M15.2592 21.9984C15.1992 21.9984 15.1292 21.9884 15.0692 21.9684C13.0592 21.3984 10.9492 21.3984 8.93918 21.9684C8.56918 22.0684 8.17918 21.8584 8.07918 21.4884C7.96918 21.1184 8.18918 20.7284 8.55918 20.6284C10.8192 19.9884 13.1992 19.9884 15.4592 20.6284C15.8292 20.7384 16.0492 21.1184 15.9392 21.4884C15.8392 21.7984 15.5592 21.9984 15.2592 21.9984Z"/>\n        <path d="M19.2107 6.36148C18.1707 4.26148 16.1607 2.71148 13.8307 2.20148C11.3907 1.66148 8.8907 2.24148 6.9807 3.78148C5.0607 5.31148 3.9707 7.60148 3.9707 10.0515C3.9707 12.6415 5.5207 15.3515 7.8607 16.9215V17.7515C7.8507 18.0315 7.8407 18.4615 8.1807 18.8115C8.5307 19.1715 9.0507 19.2115 9.4607 19.2115H14.5907C15.1307 19.2115 15.5407 19.0615 15.8207 18.7815C16.2007 18.3915 16.1907 17.8915 16.1807 17.6215V16.9215C19.2807 14.8315 21.2307 10.4215 19.2107 6.36148ZM13.7207 11.6215L12.6507 13.4815C12.5107 13.7215 12.2607 13.8615 12.0007 13.8615C11.8707 13.8615 11.7407 13.8315 11.6307 13.7615C11.2707 13.5515 11.1507 13.0915 11.3507 12.7415L12.2007 11.2615H11.3607C10.8607 11.2615 10.4507 11.0415 10.2307 10.6715C10.0107 10.2915 10.0307 9.83148 10.2807 9.39148L11.3507 7.53148C11.5607 7.17148 12.0207 7.05148 12.3707 7.25148C12.7307 7.46148 12.8507 7.92148 12.6507 8.27148L11.8007 9.75148H12.6407C13.1407 9.75148 13.5507 9.97148 13.7707 10.3415C13.9907 10.7215 13.9707 11.1915 13.7207 11.6215Z"/>\n        </svg>`
                },
                translate: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M8.93 2H5.02C3 2 2 3 2 5.02V8.94C2 11 3 12 5.02 11.95H8.94C11 12 12 11 11.95 8.93V5.02C12 3 11 2 8.93 2ZM9.01 9.76C8.33 9.76 7.67 9.5 7.12 9.04C6.5 9.49 5.75 9.76 4.94 9.76C4.53 9.76 4.19 9.42 4.19 9.01C4.19 8.6 4.53 8.26 4.94 8.26C5.96 8.26 6.81 7.56 7.12 6.6H4.94C4.53 6.6 4.19 6.26 4.19 5.85C4.19 5.44 4.53 5.1 4.94 5.1H6.23C6.27 4.72 6.58 4.42 6.97 4.42C7.36 4.42 7.67 4.72 7.71 5.1H7.97C7.98 5.1 7.99 5.1 7.99 5.1H8.01H9C9.41 5.1 9.75 5.44 9.75 5.85C9.75 6.26 9.42 6.6 9 6.6H8.67C8.58 7.08 8.39 7.53 8.14 7.94C8.41 8.14 8.7 8.26 9.01 8.26C9.42 8.26 9.76 8.6 9.76 9.01C9.76 9.42 9.42 9.76 9.01 9.76Z" />\n        <path d="M9 22.75C4.73 22.75 1.25 19.27 1.25 15C1.25 14.59 1.59 14.25 2 14.25C2.41 14.25 2.75 14.59 2.75 15C2.75 17.96 4.81 20.44 7.58 21.09L7.31 20.64C7.1 20.28 7.21 19.82 7.57 19.61C7.92 19.4 8.39 19.51 8.6 19.87L9.65 21.62C9.79 21.85 9.79 22.14 9.66 22.37C9.52 22.6 9.27 22.75 9 22.75Z"/>\n        <path d="M21.9985 9.75C21.5885 9.75 21.2485 9.41 21.2485 9C21.2485 6.04 19.1885 3.56 16.4185 2.91L16.6885 3.36C16.8985 3.72 16.7885 4.18 16.4285 4.39C16.0785 4.6 15.6085 4.49 15.3985 4.13L14.3485 2.38C14.2085 2.15 14.2085 1.86 14.3385 1.63C14.4785 1.4 14.7285 1.25 14.9985 1.25C19.2685 1.25 22.7485 4.73 22.7485 9C22.7485 9.41 22.4085 9.75 21.9985 9.75Z" />\n        <path d="M16.9198 11.8516C14.1198 11.8516 11.8398 14.1216 11.8398 16.9316C11.8398 19.7316 14.1098 22.0116 16.9198 22.0116C19.7198 22.0116 21.9998 19.7416 21.9998 16.9316C21.9998 14.1216 19.7298 11.8516 16.9198 11.8516ZM19.3998 19.3416C19.0298 19.5216 18.5798 19.3816 18.3898 19.0016L18.2198 18.6616H15.6298L15.4598 19.0016C15.3298 19.2616 15.0598 19.4116 14.7898 19.4116C14.6798 19.4116 14.5598 19.3816 14.4598 19.3316C14.0898 19.1416 13.9398 18.6916 14.1198 18.3216L16.2598 14.0516C16.3898 13.8016 16.6498 13.6416 16.9298 13.6416C17.2098 13.6416 17.4698 13.8016 17.5998 14.0616L19.7398 18.3316C19.9198 18.7016 19.7698 19.1516 19.3998 19.3416Z" />\n        <path d="M16.3789 17.1603H17.4689L16.9189 16.0703L16.3789 17.1603Z" />\n        </svg>`
                },
                ampliar: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">\n            <path d="M140,40V216a12,12,0,0,1-24,0V40a12,12,0,0,1,24,0ZM88,116H40.9707l11.51465-11.51465a12.0001,12.0001,0,0,0-16.9707-16.9707l-32,32c-.02979.02954-.0542.06225-.083.092-.24707.25195-.48584.51221-.71.78491-.12354.15064-.23145.30908-.34668.46411-.11816.15869-.24121.31324-.35156.47779-.12012.17993-.2251.3667-.335.55151-.08985.15161-.18555.29956-.269.45557-.10009.18676-.185.37841-.27392.56909-.07764.16455-.16016.32617-.23.49463-.07666.18554-.13916.37524-.20606.56372-.06494.18115-.13476.35962-.19092.54492-.05712.18945-.0996.38184-.14746.57324-.04687.18848-.10009.374-.13818.56592-.044.22144-.07031.44482-.10156.66772-.02344.165-.05518.32691-.07129.49366a12.042,12.042,0,0,0,0,2.373c.01611.16675.04785.32862.07129.49366.03125.2229.05761.44628.10156.66772.03809.19189.09131.37744.13818.56592.04786.1914.09034.38379.14746.57324.05616.1853.126.36377.19092.54517.0669.18847.1294.37793.20606.56323.06982.1687.15234.33008.22949.49463.08936.19067.17432.38257.27441.56933.0835.156.1792.304.26905.45557.10986.18481.21484.37158.335.55151.11035.16455.2334.3191.35156.47779.11523.155.22314.31347.34668.46411.22412.2727.46289.533.71.78491.02881.02979.05322.0625.083.092l32,32a12.0001,12.0001,0,0,0,16.9707-16.9707L40.9707,140H88a12,12,0,0,0,0-24Zm165.27832,19.6084c.12354-.15064.23145-.30908.34668-.46411.11816-.15869.24121-.31324.35156-.47779.12012-.17993.2251-.3667.335-.55151.08985-.15161.18555-.29956.269-.45557.09961-.186.18408-.37719.27343-.56713.07764-.16553.16016-.32789.23047-.49732.07666-.18481.13867-.37353.20557-.56128.06494-.18164.13476-.36084.19141-.54663.05712-.18945.0996-.38184.14746-.57324.04687-.18848.10009-.374.13818-.56592.04395-.22144.07031-.44482.10156-.66772.02344-.165.05518-.32691.07129-.49366a12.042,12.042,0,0,0,0-2.373c-.01611-.16675-.04785-.32862-.07129-.49366-.03125-.2229-.05761-.44628-.10156-.66772-.03809-.19189-.09131-.37744-.13818-.56592-.04786-.1914-.09034-.38379-.14746-.57324-.05665-.18579-.12647-.365-.19141-.54663-.0669-.1875-.12891-.37647-.20557-.56128-.07031-.16968-.15283-.332-.231-.49756-.08887-.1897-.17334-.38086-.273-.56689-.0835-.156-.1792-.304-.269-.45557-.10986-.18481-.21484-.37158-.335-.55151-.11035-.16455-.2334-.3191-.35156-.47779-.11523-.155-.22314-.31347-.34668-.46411-.22412-.2727-.46289-.533-.71-.78491-.02881-.02979-.05322-.0625-.083-.092l-32-32a12.0001,12.0001,0,0,0-16.9707,16.9707L215.0293,116H168a12,12,0,0,0,0,24h47.0293l-11.51465,11.51465a12.0001,12.0001,0,0,0,16.9707,16.9707l32-32c.02979-.02954.0542-.06225.083-.092C252.81543,136.14136,253.0542,135.8811,253.27832,135.6084Z"/>\n        </svg>`
                },
                reduzir: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">\n        <path d="M140,40V216a12,12,0,0,1-24,0V40a12,12,0,0,1,24,0ZM97.625,135.14429c.11816-.15869.24121-.31324.35156-.47779.12012-.17993.2251-.3667.335-.55151.08985-.15173.18555-.29968.269-.45557.09961-.186.18408-.37719.27343-.56713.07764-.16553.16016-.32789.23047-.49732.07666-.18481.13867-.37353.20557-.56128.06494-.18176.13476-.361.19141-.54663.05712-.18945.0996-.38184.14746-.57324.04687-.18848.10009-.374.13818-.56592.044-.22131.07031-.44482.10156-.66772.02344-.16492.05518-.32691.07129-.49378a12.03958,12.03958,0,0,0,0-2.3728c-.01611-.16687-.04785-.32886-.07129-.49378-.03125-.2229-.05761-.44641-.10156-.66772-.03809-.19189-.09131-.37744-.13818-.56592-.04786-.1914-.09034-.38379-.14746-.57324-.05665-.18567-.12647-.36487-.19141-.54663-.0669-.18762-.12891-.37647-.20557-.56128-.07031-.16956-.15283-.332-.23095-.49756-.08887-.18982-.17334-.38086-.273-.56689-.0835-.15589-.1792-.30384-.269-.45557-.10986-.18481-.21484-.37158-.335-.55151-.11035-.16455-.2334-.3191-.35156-.47779-.11523-.155-.22314-.31347-.34668-.464-.22412-.27282-.46289-.53308-.71-.785-.02881-.02979-.05322-.0625-.083-.092l-32-32a12.0001,12.0001,0,0,0-16.9707,16.9707L59.0293,116H12a12,12,0,0,0,0,24H59.0293L47.51465,151.51465a12.0001,12.0001,0,0,0,16.9707,16.9707l32-32c.02979-.02954.0542-.06225.083-.092.24707-.252.48584-.51221.71-.785C97.40186,135.45776,97.50977,135.29932,97.625,135.14429ZM244,116H196.9707l11.51465-11.51465a12.0001,12.0001,0,0,0-16.9707-16.9707l-32,32c-.02979.02954-.0542.06225-.083.092-.24707.25195-.48584.51221-.71.785-.12354.15052-.23145.309-.34668.464-.11816.15869-.24121.31324-.35156.47779-.12012.17993-.2251.3667-.335.55151-.08985.15173-.18555.29968-.269.45557-.10009.18664-.18505.37841-.27392.56909-.07764.16455-.16016.32617-.23.49475-.07666.18555-.13916.37512-.20606.5636-.06494.18115-.13476.35974-.19092.54492-.05712.18945-.0996.38184-.14746.57324-.04687.18848-.10009.374-.13818.56592-.04395.22131-.07031.44482-.10156.66772-.02344.16492-.05518.32691-.07129.49378a12.03958,12.03958,0,0,0,0,2.3728c.01611.16687.04785.32886.07129.49378.03125.2229.05761.44641.10156.66772.03809.19189.09131.37744.13818.56592.04786.1914.09034.38379.14746.57324.05616.18518.126.36377.19092.54517.0669.18835.1294.3778.20606.56323.06982.16858.15234.33008.22949.49463.08936.19067.17432.38257.27441.56933.0835.15589.1792.30384.269.45557.10986.18481.21484.37158.335.55151.11035.16455.2334.3191.35156.47779.11523.155.22314.31347.34668.464.22412.27282.46289.53308.71.785.02881.02979.05322.0625.083.092l32,32a12.0001,12.0001,0,0,0,16.9707-16.9707L196.9707,140H244a12,12,0,0,0,0-24Z"/>\n      </svg>`
                },
                robot: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.342 45.342" xml:space="preserve">\n   <g>\n       <path d="M40.462,19.193H39.13v-1.872c0-3.021-2.476-5.458-5.496-5.458h-8.975v-4.49c1.18-0.683,1.973-1.959,1.973-3.423\n           c0-2.182-1.771-3.95-3.951-3.95c-2.183,0-3.963,1.769-3.963,3.95c0,1.464,0.785,2.74,1.965,3.423v4.49h-8.961\n           c-3.021,0-5.448,2.437-5.448,5.458v1.872H4.893c-1.701,0-3.091,1.407-3.091,3.108v6.653c0,1.7,1.39,3.095,3.091,3.095h1.381v1.887\n           c0,3.021,2.427,5.442,5.448,5.442h2.564v2.884c0,1.701,1.393,3.08,3.094,3.08h10.596c1.701,0,3.08-1.379,3.08-3.08v-2.883h2.578\n           c3.021,0,5.496-2.422,5.496-5.443V32.05h1.332c1.701,0,3.078-1.394,3.078-3.095v-6.653C43.54,20.601,42.165,19.193,40.462,19.193z\n            M10.681,21.271c0-1.999,1.621-3.618,3.619-3.618c1.998,0,3.617,1.619,3.617,3.618c0,1.999-1.619,3.618-3.617,3.618\n           C12.302,24.889,10.681,23.27,10.681,21.271z M27.606,34.473H17.75c-1.633,0-2.957-1.316-2.957-2.951\n           c0-1.633,1.324-2.949,2.957-2.949h9.857c1.633,0,2.957,1.316,2.957,2.949S29.239,34.473,27.606,34.473z M31.056,24.889\n           c-1.998,0-3.618-1.619-3.618-3.618c0-1.999,1.62-3.618,3.618-3.618c1.999,0,3.619,1.619,3.619,3.618\n           C34.675,23.27,33.055,24.889,31.056,24.889z"/>\n   </g>\n   </svg>`
                },
                openIa: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>OpenAI icon</title><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`
                },
                help: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 -0.5 17 17" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="si-glyph si-glyph-circle-help">\n            \n        <g stroke="none" stroke-width="1" fill="currentColor" fill-rule="evenodd">\n            <path d="M9,0 C4.582,0 1,3.581 1,8 C1,12.419 4.582,16 9,16 C13.418,16 17,12.419 17,8 C17,3.581 13.418,0 9,0 L9,0 Z M9,14 C8.44769231,14 8,13.5523077 8,13 C8,12.4469231 8.44769231,12 9,12 C9.55230769,12 10,12.4469231 10,13 C10,13.5523077 9.55230769,14 9,14 L9,14 Z M10.647,8.243 C10.174,8.608 9.913,8.809 9.913,9.39 L9.913,10.204 C9.913,10.663 9.507,11.038 9.006,11.038 C8.504,11.038 8.097,10.663 8.097,10.204 L8.097,9.39 C8.097,8.033 8.928,7.392 9.477,6.968 C9.951,6.602 10.211,6.402 10.211,5.822 C10.211,5.168 9.67,4.634 9.006,4.634 C8.341,4.634 7.801,5.167 7.801,5.822 C7.801,6.283 7.393,6.655 6.892,6.655 C6.392,6.655 5.983,6.283 5.983,5.822 C5.983,4.248 7.34,2.968 9.006,2.968 C10.671,2.968 12.027,4.247 12.027,5.822 C12.027,7.178 11.197,7.818 10.647,8.243 L10.647,8.243 Z" class="si-glyph-fill">\n    </path>\n        </g>\n    </svg>`
                },
                radar: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12.0011 14.3811C13.3155 14.3811 14.3811 13.3155 14.3811 12.0011C14.3811 10.6867 13.3155 9.62109 12.0011 9.62109C10.6867 9.62109 9.62109 10.6867 9.62109 12.0011C9.62109 13.3155 10.6867 14.3811 12.0011 14.3811Z"/>\n        <path d="M20.0003 18.7503C19.8403 18.7503 19.6903 18.7003 19.5503 18.6003C19.2203 18.3503 19.1503 17.8803 19.4003 17.5503C20.6103 15.9403 21.2503 14.0203 21.2503 12.0003C21.2503 9.98027 20.6103 8.06027 19.4003 6.45027C19.1503 6.12027 19.2203 5.65027 19.5503 5.40027C19.8803 5.15027 20.3503 5.22027 20.6003 5.55027C22.0103 7.42027 22.7503 9.65027 22.7503 12.0003C22.7503 14.3503 22.0103 16.5803 20.6003 18.4503C20.4503 18.6503 20.2303 18.7503 20.0003 18.7503Z"/>\n        <path d="M4 18.7503C3.77 18.7503 3.55 18.6503 3.4 18.4503C1.99 16.5803 1.25 14.3503 1.25 12.0003C1.25 9.65027 1.99 7.42027 3.4 5.55027C3.65 5.22027 4.12 5.15027 4.45 5.40027C4.78 5.65027 4.85 6.12027 4.6 6.45027C3.39 8.06027 2.75 9.98027 2.75 12.0003C2.75 14.0203 3.39 15.9403 4.6 17.5503C4.85 17.8803 4.78 18.3503 4.45 18.6003C4.32 18.7003 4.16 18.7503 4 18.7503Z" />\n        <path d="M16.8011 16.3487C16.6411 16.3487 16.4911 16.2987 16.3511 16.1987C16.0211 15.9487 15.9511 15.4787 16.2011 15.1487C16.8911 14.2387 17.2511 13.1487 17.2511 11.9987C17.2511 10.8487 16.8911 9.75871 16.2011 8.84871C15.9511 8.51871 16.0211 8.04871 16.3511 7.79871C16.6811 7.54871 17.1511 7.61871 17.4011 7.94871C18.2811 9.12871 18.7511 10.5287 18.7511 11.9987C18.7511 13.4687 18.2811 14.8787 17.4011 16.0487C17.2511 16.2487 17.0311 16.3487 16.8011 16.3487Z"/>\n        <path d="M7.2 16.3487C6.97 16.3487 6.75 16.2487 6.6 16.0487C5.72 14.8787 5.25 13.4687 5.25 11.9987C5.25 10.5287 5.72 9.11871 6.6 7.94871C6.85 7.61871 7.32 7.54871 7.65 7.79871C7.98 8.04871 8.05 8.51871 7.8 8.84871C7.11 9.75871 6.75 10.8487 6.75 11.9987C6.75 13.1487 7.11 14.2387 7.8 15.1487C8.05 15.4787 7.98 15.9487 7.65 16.1987C7.52 16.2987 7.36 16.3487 7.2 16.3487Z" />\n        </svg>`
                },
                audioTranscription: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M20.95 4.13C20.66 3.71 20.29 3.34 19.87 3.05C18.92 2.36 17.68 2 16.19 2H7.81C7.61 2 7.41 2.01 7.22 2.03C3.94 2.24 2 4.37 2 7.81V16.19C2 17.68 2.36 18.92 3.05 19.87C3.34 20.29 3.71 20.66 4.13 20.95C4.95 21.55 5.99 21.9 7.22 21.98C7.41 21.99 7.61 22 7.81 22H16.19C19.83 22 22 19.83 22 16.19V7.81C22 6.32 21.64 5.08 20.95 4.13ZM18.75 8.9C18.75 9.31 18.41 9.65 18 9.65C17.59 9.65 17.25 9.31 17.25 8.9V7.72C17.25 7.4 16.99 7.14 16.67 7.14H12.75V16.86H14.53C14.94 16.86 15.28 17.2 15.28 17.61C15.28 18.02 14.94 18.36 14.53 18.36H9.47C9.06 18.36 8.72 18.02 8.72 17.61C8.72 17.2 9.06 16.86 9.47 16.86H11.25V7.14H7.33C7.01 7.14 6.75 7.4 6.75 7.72V8.9C6.75 9.31 6.41 9.65 6 9.65C5.59 9.65 5.25 9.31 5.25 8.9V7.72C5.25 6.57 6.18 5.64 7.33 5.64H16.66C17.81 5.64 18.74 6.57 18.74 7.72V8.9H18.75Z"/>\n        </svg>`
                },
                tasksSquare: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.19C2 19.83 4.17 22 7.81 22H16.19C19.83 22 22 19.83 22 16.19V7.81C22 4.17 19.83 2 16.19 2ZM9.97 14.9L7.72 17.15C7.57 17.3 7.38 17.37 7.19 17.37C7 17.37 6.8 17.3 6.66 17.15L5.91 16.4C5.61 16.11 5.61 15.63 5.91 15.34C6.2 15.05 6.67 15.05 6.97 15.34L7.19 15.56L8.91 13.84C9.2 13.55 9.67 13.55 9.97 13.84C10.26 14.13 10.26 14.61 9.97 14.9ZM9.97 7.9L7.72 10.15C7.57 10.3 7.38 10.37 7.19 10.37C7 10.37 6.8 10.3 6.66 10.15L5.91 9.4C5.61 9.11 5.61 8.63 5.91 8.34C6.2 8.05 6.67 8.05 6.97 8.34L7.19 8.56L8.91 6.84C9.2 6.55 9.67 6.55 9.97 6.84C10.26 7.13 10.26 7.61 9.97 7.9ZM17.56 16.62H12.31C11.9 16.62 11.56 16.28 11.56 15.87C11.56 15.46 11.9 15.12 12.31 15.12H17.56C17.98 15.12 18.31 15.46 18.31 15.87C18.31 16.28 17.98 16.62 17.56 16.62ZM17.56 9.62H12.31C11.9 9.62 11.56 9.28 11.56 8.87C11.56 8.46 11.9 8.12 12.31 8.12H17.56C17.98 8.12 18.31 8.46 18.31 8.87C18.31 9.28 17.98 9.62 17.56 9.62Z"/>\n        </svg>`
                },
                bookSquare: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM11.5 17.25C11.5 17.61 11.14 17.85 10.81 17.71C9.6 17.19 8.02 16.71 6.92 16.57L6.73 16.55C6.12 16.47 5.62 15.9 5.62 15.28V7.58C5.62 6.81 6.24 6.24 7 6.3C8.25 6.4 10.1 7 11.26 7.66C11.42 7.75 11.5 7.92 11.5 8.09V17.25ZM18.38 15.27C18.38 15.89 17.88 16.46 17.27 16.54L17.06 16.56C15.97 16.71 14.4 17.18 13.19 17.69C12.86 17.83 12.5 17.59 12.5 17.23V8.08C12.5 7.9 12.59 7.73 12.75 7.64C13.91 6.99 15.72 6.41 16.95 6.3H16.99C17.76 6.3 18.38 6.92 18.38 7.69V15.27Z"/>\n        </svg>`
                },
                adminAccess: function(e, t, a, n="") {
                    return `<svg fill="currentColor" width="${e}" height="${t}" style="${a}" class="${n}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">\n        <path d="M18.5408 4.17063L13.0408 2.11062C12.4708 1.90063 11.5408 1.90063 10.9708 2.11062L5.47078 4.17063C4.41078 4.57063 3.55078 5.81063 3.55078 6.94063V15.0406C3.55078 15.8506 4.08078 16.9206 4.73078 17.4006L10.2308 21.5106C11.2008 22.2406 12.7908 22.2406 13.7608 21.5106L19.2608 17.4006C19.9108 16.9106 20.4408 15.8506 20.4408 15.0406V6.94063C20.4508 5.81063 19.5908 4.57063 18.5408 4.17063ZM12.7508 12.8706V15.5006C12.7508 15.9106 12.4108 16.2506 12.0008 16.2506C11.5908 16.2506 11.2508 15.9106 11.2508 15.5006V12.8706C10.2408 12.5506 9.50078 11.6106 9.50078 10.5006C9.50078 9.12062 10.6208 8.00063 12.0008 8.00063C13.3808 8.00063 14.5008 9.12062 14.5008 10.5006C14.5008 11.6206 13.7608 12.5506 12.7508 12.8706Z"/>\n        </svg>`
                }
            }
        }
        ,
        787: ()=>{
            window.wacore.format_translation = {
                flagSelecionada: !0,
                flags: {
                    pt: "https://static.todamateria.com.br/upload/ba/nd/bandeira-do-brasil-og.jpg",
                    en: "https://static.mundoeducacao.uol.com.br/mundoeducacao/2022/05/bandeira-estados-unidos.jpg"
                },
                getTranslation: e=>window.wacore.translation[window.wacore.translation.language][e] || e,
                translationMap: {
                    '[data-translate-key="conversations"]': ()=>window.wacore.format_translation.getTranslation("conversations"),
                    '[data-translate-key="unreadMessageExceptArchive"]': ()=>window.wacore.format_translation.getTranslation("unreadMessageExceptArchive"),
                    '[data-translate-key="crmMode"]': ()=>window.wacore.format_translation.getTranslation("crmMode"),
                    '[data-translate-key="metrics"]': ()=>window.wacore.format_translation.getTranslation("metrics"),
                    '[data-translate-key="schedulingCenter"]': ()=>window.wacore.format_translation.getTranslation("schedulingCenter"),
                    '[data-translate-key="transmissionsShots"]': ()=>window.wacore.format_translation.getTranslation("transmissionsShots"),
                    '[data-translate-key="messagesAndScripts"]': ()=>window.wacore.format_translation.getTranslation("messagesAndScripts"),
                    '[data-translate-key="apiAndWebhooksModule"]': ()=>window.wacore.format_translation.getTranslation("apiAndWebhooksModule"),
                    '[data-translate-key="modulesExtraResources"]': ()=>window.wacore.format_translation.getTranslation("modulesExtraResources"),
                    '[data-translate-key="signature"]': ()=>window.wacore.format_translation.getTranslation("signature"),
                    '[data-translate-key="settings"]': ()=>window.wacore.format_translation.getTranslation("settings"),
                    '[data-translate-key="messagesAndScriptsReady"]': ()=>window.wacore.format_translation.getTranslation("messagesAndScriptsReady"),
                    '[data-translate-key="startConversation"]': ()=>window.wacore.format_translation.getTranslation("startConversation"),
                    '[data-translate-key="connectedAs"]': ()=>window.wacore.format_translation.getTranslation("connectedAs"),
                    '[data-translate-key="changeDisplayName"]': ()=>window.wacore.format_translation.getTranslation("changeDisplayName"),
                    '[data-translate-key="plansAndPrices"]': ()=>window.wacore.format_translation.getTranslation("plansAndPrices"),
                    '[data-translate-key="contactUs"]': ()=>window.wacore.format_translation.getTranslation("contactUs"),
                    '[data-translate-key="disconnectFromThisUser"]': ()=>window.wacore.format_translation.getTranslation("disconnectFromThisUser"),
                    '[data-translate-key="version"]': ()=>window.wacore.format_translation.getTranslation("version"),
                    '[data-translate-key="toSave"]': ()=>window.wacore.format_translation.getTranslation("toSave"),
                    '[data-translate-key="enterANewName"]': ()=>window.wacore.format_translation.getTranslation("enterANewName"),
                    '[data-translate-key="messageFooter"]': ()=>window.wacore.format_translation.getTranslation("messageFooter"),
                    '[data-translate-key="invalidNumber"]': ()=>window.wacore.format_translation.getTranslation("invalidNumber"),
                    '[data-translate-key="planBasic"]': ()=>window.wacore.format_translation.getTranslation("planBasic"),
                    '[data-translate-key="contentForWhomPlans"]': ()=>window.wacore.format_translation.getTranslation("contentForWhomPlans"),
                    '[data-translate-key="contentMessagePlanBasic"]': ()=>window.wacore.format_translation.getTranslation("contentMessagePlanBasic"),
                    '[data-translate-key="premiumPlan"]': ()=>window.wacore.format_translation.getTranslation("premiumPlan"),
                    '[data-translate-key="contentMessagePlanPremium"]': ()=>window.wacore.format_translation.getTranslation("contentMessagePlanPremium"),
                    '[data-translate-key="basic"]': ()=>window.wacore.format_translation.getTranslation("basic"),
                    '[data-translate-key="chatGptIntegration"]': ()=>window.wacore.format_translation.getTranslation("chatGptIntegration"),
                    '[data-translate-key="audioTranscription"]': ()=>window.wacore.format_translation.getTranslation("audioTranscription"),
                    '[data-translate-key="api"]': ()=>window.wacore.format_translation.getTranslation("api"),
                    '[data-translate-key="webhook"]': ()=>window.wacore.format_translation.getTranslation("webhook"),
                    '[data-translate-key="multipleUsers"]': ()=>window.wacore.format_translation.getTranslation("multipleUsers"),
                    '[data-translate-key="loginWithPassword"]': ()=>window.wacore.format_translation.getTranslation("loginWithPassword"),
                    '[data-translate-key="transferBetweenAttendants"]': ()=>window.wacore.format_translation.getTranslation("transferBetweenAttendants"),
                    '[data-translate-key="chatBetweenAttendants"]': ()=>window.wacore.format_translation.getTranslation("chatBetweenAttendants"),
                    '[data-translate-key="showHiddenMessages"]': ()=>window.wacore.format_translation.getTranslation("showHiddenMessages"),
                    '[data-translate-key="massShooting"]': ()=>window.wacore.format_translation.getTranslation("massShooting"),
                    '[data-translate-key="modeCrm"]': ()=>window.wacore.format_translation.getTranslation("modeCrm"),
                    '[data-translate-key="unlimitedTabsAndList"]': ()=>window.wacore.format_translation.getTranslation("unlimitedTabsAndList"),
                    '[data-translate-key="cannedMessagesAndScripts"]': ()=>window.wacore.format_translation.getTranslation("cannedMessagesAndScripts"),
                    '[data-translate-key="scheduleMessageAndReminders"]': ()=>window.wacore.format_translation.getTranslation("scheduleMessageAndReminders"),
                    '[data-translate-key="hashtagTransfer"]': ()=>window.wacore.format_translation.getTranslation("hashtagTransfer"),
                    '[data-translate-key="unlimitedFilters"]': ()=>window.wacore.format_translation.getTranslation("unlimitedFilters"),
                    '[data-translate-key="planBasicInformationMessage"]': ()=>window.wacore.format_translation.getTranslation("planBasicInformationMessage"),
                    '[data-translate-key="planPremiumInformationMessage"]': ()=>window.wacore.format_translation.getTranslation("planPremiumInformationMessage"),
                    '[data-translate-key="toSign"]': ()=>window.wacore.format_translation.getTranslation("toSign"),
                    '[data-translate-key="FREEplan"]': ()=>window.wacore.format_translation.getTranslation("FREEplan"),
                    '[data-translate-key="PREMIUMplan"]': ()=>window.wacore.format_translation.getTranslation("PREMIUMplan"),
                    '[data-translate-key="youAreInThePlan"]': ()=>window.wacore.format_translation.getTranslation("youAreInThePlan"),
                    '[data-translate-key="FREE"]': ()=>window.wacore.format_translation.getTranslation("FREE"),
                    '[data-translate-key="BASIC"]': ()=>window.wacore.format_translation.getTranslation("BASIC"),
                    '[data-translate-key="TESTE"]': ()=>window.wacore.format_translation.getTranslation("TESTE"),
                    '[data-translate-key="PREMIUM"]': ()=>window.wacore.format_translation.getTranslation("PREMIUM"),
                    '[data-translate-key="withLimitedResources"]': ()=>window.wacore.format_translation.getTranslation("withLimitedResources"),
                    '[data-translate-key="howereInAPeriodOf"]': ()=>window.wacore.format_translation.getTranslation("howereInAPeriodOf"),
                    '[data-translate-key="signUpForAPlanRightNow"]': ()=>window.wacore.format_translation.getTranslation("signUpForAPlanRightNow"),
                    '[data-translate-key="SUBSCRIBETOPLAN"]': ()=>window.wacore.format_translation.getTranslation("SUBSCRIBETOPLAN"),
                    '[data-translate-key="talkToYourTeam"]': ()=>window.wacore.format_translation.getTranslation("talkToYourTeam"),
                    '[data-translate-key="generalFilter"]': ()=>window.wacore.format_translation.getTranslation("generalFilter"),
                    '[data-translate-key="filterByUser"]': ()=>window.wacore.format_translation.getTranslation("filterByUser"),
                    '[data-translate-key="tagFilter"]': ()=>window.wacore.format_translation.getTranslation("tagFilter"),
                    '[data-translate-key="registerNewConversation"]': ()=>window.wacore.format_translation.getTranslation("registerNewConversation"),
                    '[data-translate-key="allsFilters"]': ()=>window.wacore.format_translation.getTranslation("allsFilters"),
                    '[data-translate-key="noResponseFromAttendant"]': ()=>window.wacore.format_translation.getTranslation("noResponseFromAttendant"),
                    '[data-translate-key="noResponseFromClient"]': ()=>window.wacore.format_translation.getTranslation("noResponseFromClient"),
                    '[data-translate-key="groupChats"]': ()=>window.wacore.format_translation.getTranslation("groupChats"),
                    '[data-translate-key="directChats"]': ()=>window.wacore.format_translation.getTranslation("directChats"),
                    '[data-translate-key="unread"]': ()=>window.wacore.format_translation.getTranslation("unread"),
                    '[data-translate-key="chatBetweenAttendants"]': ()=>window.wacore.format_translation.getTranslation("chatBetweenAttendants"),
                    '[data-translate-key="notifications"]': ()=>window.wacore.format_translation.getTranslation("notifications"),
                    '[data-translate-key="knowledgeBase"]': ()=>window.wacore.format_translation.getTranslation("knowledgeBase"),
                    '[data-translate-key="changeLogs"]': ()=>window.wacore.format_translation.getTranslation("changeLogs"),
                    '[data-translate-key="administrativePanel"]': ()=>window.wacore.format_translation.getTranslation("administrativePanel"),
                    '[data-translate-key="yourCurrentPlan"]': ()=>window.wacore.format_translation.getTranslation("yourCurrentPlan"),
                    '[data-translate-key="downloadContacts"]': ()=>window.wacore.format_translation.getTranslation("downloadContacts"),
                    '[data-translate-key="alls"]': ()=>window.wacore.format_translation.getTranslation("alls"),
                    '[data-translate-key="metricsOfTheMonth"]': ()=>window.wacore.format_translation.getTranslation("metricsOfTheMonth"),
                    '[data-translate-key="attendances"]': ()=>window.wacore.format_translation.getTranslation("attendances"),
                    '[data-translate-key="crmBusinessFlow"]': ()=>window.wacore.format_translation.getTranslation("crmBusinessFlow"),
                    '[data-translate-key="finalized"]': ()=>window.wacore.format_translation.getTranslation("finalized"),
                    '[data-translate-key="opened"]': ()=>window.wacore.format_translation.getTranslation("opened"),
                    '[data-translate-key="averageTimePerService"]': ()=>window.wacore.format_translation.getTranslation("averageTimePerService"),
                    '[data-translate-key="businessStarted"]': ()=>window.wacore.format_translation.getTranslation("businessStarted"),
                    '[data-translate-key="earnings"]': ()=>window.wacore.format_translation.getTranslation("earnings"),
                    '[data-translate-key="lost"]': ()=>window.wacore.format_translation.getTranslation("lost"),
                    '[data-translate-key="averageDurationPerDeal"]': ()=>window.wacore.format_translation.getTranslation("averageDurationPerDeal"),
                    '[data-translate-key="searchByNameOrNumber"]': ()=>window.wacore.format_translation.getTranslation("searchByNameOrNumber"),
                    '[data-translate-key="selectAll"]': ()=>window.wacore.format_translation.getTranslation("selectAll"),
                    '[data-translate-key="shippingStatus"]': ()=>window.wacore.format_translation.getTranslation("shippingStatus"),
                    '[data-translate-key="toRemove"]': ()=>window.wacore.format_translation.getTranslation("toRemove"),
                    '[data-translate-key="typeOrPasteTheNumbers"]': ()=>window.wacore.format_translation.getTranslation("typeOrPasteTheNumbers"),
                    '[data-translate-key="separateInformationMessage"]': ()=>window.wacore.format_translation.getTranslation("separateInformationMessage"),
                    '[data-translate-key="toLoad"]': ()=>window.wacore.format_translation.getTranslation("toLoad"),
                    '[data-translate-key="csvInformationalMessageUpload"]': ()=>window.wacore.format_translation.getTranslation("csvInformationalMessageUpload"),
                    '[data-translate-key="uploadCsvFile"]': ()=>window.wacore.format_translation.getTranslation("uploadCsvFile"),
                    '[data-translate-key="loading"]': ()=>window.wacore.format_translation.getTranslation("loading"),
                    '[data-translate-key="titleFlaws"]': ()=>window.wacore.format_translation.getTranslation("titleFlaws"),
                    '[data-translate-key="messageFailures"]': ()=>window.wacore.format_translation.getTranslation("messageFailures"),
                    '[data-translate-key="selectTheGroup"]': ()=>window.wacore.format_translation.getTranslation("selectTheGroup"),
                    '[data-translate-key="selectTheList"]': ()=>window.wacore.format_translation.getTranslation("selectTheList"),
                    '[data-translate-key="selectTheTag"]': ()=>window.wacore.format_translation.getTranslation("selectTheTag"),
                    '[data-translate-key="selectAttendant"]': ()=>window.wacore.format_translation.getTranslation("selectAttendant"),
                    '[data-translate-key="selectContacts"]': ()=>window.wacore.format_translation.getTranslation("selectContacts"),
                    '[data-translate-key="toGoBack"]': ()=>window.wacore.format_translation.getTranslation("toGoBack"),
                    '[data-translate-key="selectByContacts"]': ()=>window.wacore.format_translation.getTranslation("selectByContacts"),
                    '[data-translate-key="selectContactsFromGroups"]': ()=>window.wacore.format_translation.getTranslation("selectContactsFromGroups"),
                    '[data-translate-key="selectByListCrm"]': ()=>window.wacore.format_translation.getTranslation("selectByListCrm"),
                    '[data-translate-key="selectTheList"]': ()=>window.wacore.format_translation.getTranslation("selectTheList"),
                    '[data-translate-key="selectByTags"]': ()=>window.wacore.format_translation.getTranslation("selectByTags"),
                    '[data-translate-key="selectByAttendants"]': ()=>window.wacore.format_translation.getTranslation("selectByAttendants"),
                    '[data-translate-key="selectForUnread"]': ()=>window.wacore.format_translation.getTranslation("selectForUnread"),
                    '[data-translate-key="selectForGroups"]': ()=>window.wacore.format_translation.getTranslation("selectForGroups"),
                    '[data-translate-key="importFromCsv"]': ()=>window.wacore.format_translation.getTranslation("importFromCsv"),
                    '[data-translate-key="typeSingle"]': ()=>window.wacore.format_translation.getTranslation("typeSingle"),
                    '[data-translate-key="historic"]': ()=>window.wacore.format_translation.getTranslation("historic"),
                    '[data-translate-key="listOfCreatedShots"]': ()=>window.wacore.format_translation.getTranslation("listOfCreatedShots"),
                    '[data-translate-key="selectedContacts"]': ()=>window.wacore.format_translation.getTranslation("selectedContacts"),
                    '[data-translate-key="selectTheContacts"]': ()=>window.wacore.format_translation.getTranslation("selectTheContacts"),
                    '[data-translate-key="prepareTransmission"]': ()=>window.wacore.format_translation.getTranslation("prepareTransmission"),
                    '[data-translate-key="informativeMessageTransmission"]': ()=>window.wacore.format_translation.getTranslation("informativeMessageTransmission"),
                    '[data-translate-key="accept"]': ()=>window.wacore.format_translation.getTranslation("accept"),
                    '[data-translate-key="select"]': ()=>window.wacore.format_translation.getTranslation("select"),
                    '[data-translate-key="secondIntervalPerMessageSent"]': ()=>window.wacore.format_translation.getTranslation("secondIntervalPerMessageSent"),
                    '[data-translate-key="fiveToTen"]': ()=>window.wacore.format_translation.getTranslation("fiveToTen"),
                    '[data-translate-key="tenToFifteen"]': ()=>window.wacore.format_translation.getTranslation("tenToFifteen"),
                    '[data-translate-key="fifteenToTwenty"]': ()=>window.wacore.format_translation.getTranslation("fifteenToTwenty"),
                    '[data-translate-key="oneToFive"]': ()=>window.wacore.format_translation.getTranslation("oneToFive"),
                    '[data-translate-key="pauseSendEvery"]': ()=>window.wacore.format_translation.getTranslation("pauseSendEvery"),
                    '[data-translate-key="fiveMessageSend"]': ()=>window.wacore.format_translation.getTranslation("fiveMessageSend"),
                    '[data-translate-key="tenMessageSend"]': ()=>window.wacore.format_translation.getTranslation("tenMessageSend"),
                    '[data-translate-key="twentyMessageSend"]': ()=>window.wacore.format_translation.getTranslation("twentyMessageSend"),
                    '[data-translate-key="fortyMessageSend"]': ()=>window.wacore.format_translation.getTranslation("fortyMessageSend"),
                    '[data-translate-key="eightyMessageSend"]': ()=>window.wacore.format_translation.getTranslation("eightyMessageSend"),
                    '[data-translate-key="resendWith"]': ()=>window.wacore.format_translation.getTranslation("resendWith"),
                    '[data-translate-key="oneMinute"]': ()=>window.wacore.format_translation.getTranslation("oneMinute"),
                    '[data-translate-key="fiveMinutes"]': ()=>window.wacore.format_translation.getTranslation("fiveMinutes"),
                    '[data-translate-key="fifteenMinutes"]': ()=>window.wacore.format_translation.getTranslation("fifteenMinutes"),
                    '[data-translate-key="twentyFiveMinutes"]': ()=>window.wacore.format_translation.getTranslation("twentyFiveMinutes"),
                    '[data-translate-key="thirtySeconds"]': ()=>window.wacore.format_translation.getTranslation("thirtySeconds"),
                    '[data-translate-key="readyMessages"]': ()=>window.wacore.format_translation.getTranslation("readyMessages"),
                    '[data-translate-key="scripts"]': ()=>window.wacore.format_translation.getTranslation("scripts"),
                    '[data-translate-key="create"]': ()=>window.wacore.format_translation.getTranslation("create"),
                    '[data-translate-key="createMessageOrScript"]': ()=>window.wacore.format_translation.getTranslation("createMessageOrScript"),
                    '[data-translate-key="message"]': ()=>window.wacore.format_translation.getTranslation("message"),
                    '[data-translate-key="proceed"]': ()=>window.wacore.format_translation.getTranslation("proceed"),
                    '[data-translate-key="createBroadcast"]': ()=>window.wacore.format_translation.getTranslation("createBroadcast"),
                    '[data-translate-key="titleToSearchAdnRetrieveTheBroadcastLater"]': ()=>window.wacore.format_translation.getTranslation("titleToSearchAdnRetrieveTheBroadcastLater"),
                    '[data-translate-key="iWillNotSpam"]': ()=>window.wacore.format_translation.getTranslation("iWillNotSpam"),
                    '[data-translate-key="saveList"]': ()=>window.wacore.format_translation.getTranslation("saveList"),
                    '[data-translate-key="createAndStartStreaming"]': ()=>window.wacore.format_translation.getTranslation("createAndStartStreaming"),
                    '[data-translate-key="messages"]': ()=>window.wacore.format_translation.getTranslation("messages"),
                    '[data-translate-key="readyScripts"]': ()=>window.wacore.format_translation.getTranslation("readyScripts"),
                    '[data-translate-key="messagesAndScriptsReady"]': ()=>window.wacore.format_translation.getTranslation("messagesAndScriptsReady"),
                    '[data-translate-key="informativeMessageCreate"]': ()=>window.wacore.format_translation.getTranslation("informativeMessageCreate"),
                    '[data-translate-key="addMessage"]': ()=>window.wacore.format_translation.getTranslation("addMessage"),
                    '[data-translate-key="selectMessageType"]': ()=>window.wacore.format_translation.getTranslation("selectMessageType"),
                    '[data-translate-key="textMessage"]': ()=>window.wacore.format_translation.getTranslation("textMessage"),
                    '[data-translate-key="voiceMessage"]': ()=>window.wacore.format_translation.getTranslation("voiceMessage"),
                    '[data-translate-key="imageMessage"]': ()=>window.wacore.format_translation.getTranslation("imageMessage"),
                    '[data-translate-key="list"]': ()=>window.wacore.format_translation.getTranslation("list"),
                    '[data-translate-key="scriptInformationalMessage"]': ()=>window.wacore.format_translation.getTranslation("scriptInformationalMessage"),
                    '[data-translate-key="titleForReference"]': ()=>window.wacore.format_translation.getTranslation("titleForReference"),
                    '[data-translate-key="typeTheTitle"]': ()=>window.wacore.format_translation.getTranslation("typeTheTitle"),
                    '[data-translate-key="typeTheMessage"]': ()=>window.wacore.format_translation.getTranslation("typeTheMessage"),
                    '[data-translate-key="selectInOrderOfSubmission"]': ()=>window.wacore.format_translation.getTranslation("selectInOrderOfSubmission"),
                    '[data-translate-key="favoriteForMyUser"]': ()=>window.wacore.format_translation.getTranslation("favoriteForMyUser"),
                    '[data-translate-key="informationalMessageTitle"]': ()=>window.wacore.format_translation.getTranslation("informationalMessageTitle"),
                    '[data-translate-key="informationalMessageInterval"]': ()=>window.wacore.format_translation.getTranslation("informationalMessageInterval"),
                    '[data-translate-key="toAdd"]': ()=>window.wacore.format_translation.getTranslation("toAdd"),
                    '[data-translate-key="messageSequence"]': ()=>window.wacore.format_translation.getTranslation("messageSequence"),
                    '[data-translate-key="clickToRecordTheAudio"]': ()=>window.wacore.format_translation.getTranslation("clickToRecordTheAudio"),
                    '[data-translate-key="clickToSendTheImage"]': ()=>window.wacore.format_translation.getTranslation("clickToSendTheImage"),
                    '[data-translate-key="addMessage"]': ()=>window.wacore.format_translation.getTranslation("addMessage"),
                    '[data-translate-key="oops"]': ()=>window.wacore.format_translation.getTranslation("oops"),
                    '[data-translate-key="typeATitleForTheAudio"]': ()=>window.wacore.format_translation.getTranslation("typeATitleForTheAudio"),
                    '[data-translate-key="typeATitleForTheImage"]': ()=>window.wacore.format_translation.getTranslation("typeATitleForTheImage"),
                    '[data-translate-key="typeTheText"]': ()=>window.wacore.format_translation.getTranslation("typeTheText"),
                    '[data-translate-key="typeTheTitleReference"]': ()=>window.wacore.format_translation.getTranslation("typeTheTitleReference"),
                    '[data-translate-key="selectMoreThaOneMessage"]': ()=>window.wacore.format_translation.getTranslation("selectMoreThaOneMessage"),
                    '[data-translate-key="createdScript"]': ()=>window.wacore.format_translation.getTranslation("createdScript"),
                    '[data-translate-key="sendItToYourCustomerWithJustOneClick"]': ()=>window.wacore.format_translation.getTranslation("sendItToYourCustomerWithJustOneClick"),
                    '[data-translate-key="readyMessageAdded"]': ()=>window.wacore.format_translation.getTranslation("readyMessageAdded"),
                    '[data-translate-key="areYouSureYouWantToRemoveThisMessage"]': ()=>window.wacore.format_translation.getTranslation("areYouSureYouWantToRemoveThisMessage"),
                    '[data-translate-key="fixed"]': ()=>window.wacore.format_translation.getTranslation("fixed"),
                    '[data-translate-key="recents"]': ()=>window.wacore.format_translation.getTranslation("recents"),
                    '[data-translate-key="progress"]': ()=>window.wacore.format_translation.getTranslation("progress"),
                    '[data-translate-key="pending"]': ()=>window.wacore.format_translation.getTranslation("pending"),
                    '[data-translate-key="completed"]': ()=>window.wacore.format_translation.getTranslation("completed"),
                    '[data-translate-key="openConversation"]': ()=>window.wacore.format_translation.getTranslation("openConversation"),
                    '[data-translate-key="closeCard"]': ()=>window.wacore.format_translation.getTranslation("closeCard"),
                    '[data-translate-key="toLookFor"]': ()=>window.wacore.format_translation.getTranslation("toLookFor"),
                    '[data-translate-key="loadingKanbamTitle"]': ()=>window.wacore.format_translation.getTranslation("loadingKanbamTitle"),
                    '[data-translate-key="loadingKanbamText"]': ()=>window.wacore.format_translation.getTranslation("loadingKanbamText"),
                    '[data-translate-key="editTitle"]': ()=>window.wacore.format_translation.getTranslation("editTitle"),
                    '[data-translate-key="fireMessageToList"]': ()=>window.wacore.format_translation.getTranslation("fireMessageToList"),
                    '[data-translate-key="removeList"]': ()=>window.wacore.format_translation.getTranslation("removeList"),
                    '[data-translate-key="areYouSureYouWantToDeleteThisList"]': ()=>window.wacore.format_translation.getTranslation("areYouSureYouWantToDeleteThisList"),
                    '[data-translate-key="messageDeleteList"]': ()=>window.wacore.format_translation.getTranslation("messageDeleteList"),
                    '[data-translate-key="yes"]': ()=>window.wacore.format_translation.getTranslation("yes"),
                    '[data-translate-key="no"]': ()=>window.wacore.format_translation.getTranslation("no"),
                    '[data-translate-key="thisCardAlreadyBelongsToAList"]': ()=>window.wacore.format_translation.getTranslation("thisCardAlreadyBelongsToAList"),
                    '[data-translate-key="moveCard"]': ()=>window.wacore.format_translation.getTranslation("moveCard"),
                    '[data-translate-key="moveFromList"]': ()=>window.wacore.format_translation.getTranslation("moveFromList"),
                    '[data-translate-key="moveListConversation"]': ()=>window.wacore.format_translation.getTranslation("moveListConversation"),
                    '[data-translate-key="close"]': ()=>window.wacore.format_translation.getTranslation("close"),
                    '[data-translate-key="hangTags"]': ()=>window.wacore.format_translation.getTranslation("hangTags"),
                    '[data-translate-key="transferFromAttendant"]': ()=>window.wacore.format_translation.getTranslation("transferFromAttendant"),
                    '[data-translate-key="transferToAnotherAttendant"]': ()=>window.wacore.format_translation.getTranslation("transferToAnotherAttendant"),
                    '[data-translate-key="finish"]': ()=>window.wacore.format_translation.getTranslation("finish"),
                    '[data-translate-key="toClose"]': ()=>window.wacore.format_translation.getTranslation("toClose"),
                    '[data-translate-key="clickToSend"]': ()=>window.wacore.format_translation.getTranslation("clickToSend"),
                    '[data-translate-key="toAdd"]': ()=>window.wacore.format_translation.getTranslation("toAdd"),
                    '[data-translate-key="editDisplayName"]': ()=>window.wacore.format_translation.getTranslation("editDisplayName"),
                    '[data-translate-key="displayMessageName(Active)"]': ()=>window.wacore.format_translation.getTranslation("displayMessageName(Active)"),
                    '[data-translate-key="displayMessageName(Inactive)"]': ()=>window.wacore.format_translation.getTranslation("displayMessageName(Inactive)"),
                    '[data-translate-key="copilot(Active)"]': ()=>window.wacore.format_translation.getTranslation("copilot(Active)"),
                    '[data-translate-key="copilot(Inactive)"]': ()=>window.wacore.format_translation.getTranslation("copilot(Inactive)"),
                    '[data-translate-key="endService"]': ()=>window.wacore.format_translation.getTranslation("endService"),
                    '[data-translate-key="archiveConversationAfterFinishingTheService"]': ()=>window.wacore.format_translation.getTranslation("archiveConversationAfterFinishingTheService"),
                    '[data-translate-key="closeCardAfterCompletingTheService"]': ()=>window.wacore.format_translation.getTranslation("closeCardAfterCompletingTheService"),
                    '[data-translate-key="sendMessageInforming"]': ()=>window.wacore.format_translation.getTranslation("sendMessageInforming"),
                    '[data-translate-key="enderAClosingMessage"]': ()=>window.wacore.format_translation.getTranslation("enderAClosingMessage"),
                    '[data-translate-key="messageInformingFooter"]': ()=>window.wacore.format_translation.getTranslation("messageInformingFooter"),
                    '[data-translate-key="appointmentsWaitingOrWithError"]': ()=>window.wacore.format_translation.getTranslation("appointmentsWaitingOrWithError"),
                    '[data-translate-key="messageScheduling"]': ()=>window.wacore.format_translation.getTranslation("messageScheduling"),
                    '[data-translate-key="createSchedule"]': ()=>window.wacore.format_translation.getTranslation("createSchedule"),
                    '[data-translate-key="openAppointmentCenter"]': ()=>window.wacore.format_translation.getTranslation("openAppointmentCenter"),
                    '[data-translate-key="createNewSchedule"]': ()=>window.wacore.format_translation.getTranslation("createNewSchedule"),
                    '[data-translate-key="informativeMessageScheduling"]': ()=>window.wacore.format_translation.getTranslation("informativeMessageScheduling"),
                    '[data-translate-key="selectADate"]': ()=>window.wacore.format_translation.getTranslation("selectADate"),
                    '[data-translate-key="number"]': ()=>window.wacore.format_translation.getTranslation("number"),
                    '[data-translate-key="typeOfSchedule"]': ()=>window.wacore.format_translation.getTranslation("typeOfSchedule"),
                    '[data-translate-key="sendingMessage"]': ()=>window.wacore.format_translation.getTranslation("sendingMessage"),
                    '[data-translate-key="reminder"]': ()=>window.wacore.format_translation.getTranslation("reminder"),
                    '[data-translate-key="messageOrNote"]': ()=>window.wacore.format_translation.getTranslation("messageOrNote"),
                    '[data-translate-key="completeTheMessage"]': ()=>window.wacore.format_translation.getTranslation("completeTheMessage"),
                    '[data-translate-key="fillInTheNumber"]': ()=>window.wacore.format_translation.getTranslation("fillInTheNumber"),
                    '[data-translate-key="fillInTheAppointmentDate"]': ()=>window.wacore.format_translation.getTranslation("fillInTheAppointmentDate"),
                    '[data-translate-key="addAValidWhatsappNumber"]': ()=>window.wacore.format_translation.getTranslation("addAValidWhatsappNumber"),
                    '[data-translate-key="dismissReminder"]': ()=>window.wacore.format_translation.getTranslation("dismissReminder"),
                    '[data-translate-key="schedulingCompletedSuccessfully"]': ()=>window.wacore.format_translation.getTranslation("schedulingCompletedSuccessfully"),
                    '[data-translate-key="schedulingExecutedManually"]': ()=>window.wacore.format_translation.getTranslation("schedulingExecutedManually"),
                    '[data-translate-key="thereWasAproblemExecuting"]': ()=>window.wacore.format_translation.getTranslation("thereWasAproblemExecuting"),
                    '[data-translate-key="scheduled"]': ()=>window.wacore.format_translation.getTranslation("scheduled"),
                    '[data-translate-key="scheduledOrInError"]': ()=>window.wacore.format_translation.getTranslation("scheduledOrInError"),
                    '[data-translate-key="successfullyExecuted"]': ()=>window.wacore.format_translation.getTranslation("successfullyExecuted"),
                    '[data-translate-key="executedWithError"]': ()=>window.wacore.format_translation.getTranslation("executedWithError"),
                    '[data-translate-key="canceled"]': ()=>window.wacore.format_translation.getTranslation("canceled"),
                    '[data-translate-key="MESSAGE"]': ()=>window.wacore.format_translation.getTranslation("MESSAGE"),
                    '[data-translate-key="REMINDER"]': ()=>window.wacore.format_translation.getTranslation("REMINDER"),
                    '[data-translate-key="addListToCrm"]': ()=>window.wacore.format_translation.getTranslation("addListToCrm"),
                    '[data-translate-key="toAdd"]': ()=>window.wacore.format_translation.getTranslation("toAdd"),
                    '[data-translate-key="enterANameForTheList"]': ()=>window.wacore.format_translation.getTranslation("enterANameForTheList"),
                    '[data-translate-key="cancel"]': ()=>window.wacore.format_translation.getTranslation("cancel"),
                    '[data-translate-key="enterAName"]': ()=>window.wacore.format_translation.getTranslation("enterAName"),
                    '[data-translate-key="suggest"]': ()=>window.wacore.format_translation.getTranslation("suggest"),
                    '[data-translate-key="autoSuggestAnswers(Active)"]': ()=>window.wacore.format_translation.getTranslation("autoSuggestAnswers(Active)"),
                    '[data-translate-key="autoSuggestAnswers(Inactive)"]': ()=>window.wacore.format_translation.getTranslation("autoSuggestAnswers(Inactive)"),
                    '[data-translate-key="copilotAutoSuggestModeActived"]': ()=>window.wacore.format_translation.getTranslation("copilotAutoSuggestModeActived"),
                    '[data-translate-key="freeSearch"]': ()=>window.wacore.format_translation.getTranslation("freeSearch"),
                    '[data-translate-key="textTranslation"]': ()=>window.wacore.format_translation.getTranslation("textTranslation"),
                    '[data-translate-key="translate"]': ()=>window.wacore.format_translation.getTranslation("translate"),
                    '[data-translate-key="translateThisTextIntoPortuguese"]': ()=>window.wacore.format_translation.getTranslation("translateThisTextIntoPortuguese"),
                    '[data-translate-key="translateThisTextIntoEnglish"]': ()=>window.wacore.format_translation.getTranslation("translateThisTextIntoEnglish"),
                    '[data-translate-key="translateThisTextIntoSpanish"]': ()=>window.wacore.format_translation.getTranslation("translateThisTextIntoSpanish"),
                    '[data-translate-key="makeYourTextMoreSummarized"]': ()=>window.wacore.format_translation.getTranslation("makeYourTextMoreSummarized"),
                    '[data-translate-key="makeYourTextBigger"]': ()=>window.wacore.format_translation.getTranslation("makeYourTextBigger"),
                    '[data-translate-key="makeYourTextClearer"]': ()=>window.wacore.format_translation.getTranslation("makeYourTextClearer"),
                    '[data-translate-key="sumUp"]': ()=>window.wacore.format_translation.getTranslation("sumUp"),
                    '[data-translate-key="enlarge"]': ()=>window.wacore.format_translation.getTranslation("enlarge"),
                    '[data-translate-key="ofCourse"]': ()=>window.wacore.format_translation.getTranslation("ofCourse"),
                    '[data-translate-key="makeYourTextMoreUserFriendly"]': ()=>window.wacore.format_translation.getTranslation("makeYourTextMoreUserFriendly"),
                    '[data-translate-key="friendly"]': ()=>window.wacore.format_translation.getTranslation("friendly"),
                    '[data-translate-key="makeYourTextMoreFormal"]': ()=>window.wacore.format_translation.getTranslation("makeYourTextMoreFormal"),
                    '[data-translate-key="formal"]': ()=>window.wacore.format_translation.getTranslation("formal"),
                    '[data-translate-key="makeYourTextMoreDirect"]': ()=>window.wacore.format_translation.getTranslation("makeYourTextMoreDirect"),
                    '[data-translate-key="direct"]': ()=>window.wacore.format_translation.getTranslation("direct"),
                    '[data-translate-key="correctSpellingError"]': ()=>window.wacore.format_translation.getTranslation("correctSpellingError"),
                    '[data-translate-key="orthography"]': ()=>window.wacore.format_translation.getTranslation("orthography"),
                    '[data-translate-key="help"]': ()=>window.wacore.format_translation.getTranslation("help"),
                    '[data-translate-key="howCanThisHelpMeTitle"]': ()=>window.wacore.format_translation.getTranslation("howCanThisHelpMeTitle"),
                    '[data-translate-key="helpMeMessage"]': ()=>window.wacore.format_translation.getTranslation("helpMeMessage"),
                    '[data-translate-key="howToUseTitle"]': ()=>window.wacore.format_translation.getTranslation("howToUseTitle"),
                    '[data-translate-key="howToUseSubtitle"]': ()=>window.wacore.format_translation.getTranslation("howToUseSubtitle"),
                    '[data-translate-key="messageHowToUseOne"]': ()=>window.wacore.format_translation.getTranslation("messageHowToUseOne"),
                    '[data-translate-key="messageHowToUseTwo"]': ()=>window.wacore.format_translation.getTranslation("messageHowToUseTwo"),
                    '[data-translate-key="whatEachOfTheTitleFeaturesIsForTitle"]': ()=>window.wacore.format_translation.getTranslation("whatEachOfTheTitleFeaturesIsForTitle"),
                    '[data-translate-key="messageSuggest"]': ()=>window.wacore.format_translation.getTranslation("messageSuggest"),
                    '[data-translate-key="messageSearch"]': ()=>window.wacore.format_translation.getTranslation("messageSearch"),
                    '[data-translate-key="spellingMessage"]': ()=>window.wacore.format_translation.getTranslation("spellingMessage"),
                    '[data-translate-key="messageTranslatePt"]': ()=>window.wacore.format_translation.getTranslation("messageTranslatePt"),
                    '[data-translate-key="messageTranslateEn"]': ()=>window.wacore.format_translation.getTranslation("messageTranslateEn"),
                    '[data-translate-key="messageTranslateEs"]': ()=>window.wacore.format_translation.getTranslation("messageTranslateEs"),
                    '[data-translate-key="messageSummarize"]': ()=>window.wacore.format_translation.getTranslation("messageSummarize"),
                    '[data-translate-key="messageEnlarge"]': ()=>window.wacore.format_translation.getTranslation("messageEnlarge"),
                    '[data-translate-key="clearMessage"]': ()=>window.wacore.format_translation.getTranslation("clearMessage"),
                    '[data-translate-key="friendlyMessage"]': ()=>window.wacore.format_translation.getTranslation("friendlyMessage"),
                    '[data-translate-key="formalMessage"]': ()=>window.wacore.format_translation.getTranslation("formalMessage"),
                    '[data-translate-key="directMessage"]': ()=>window.wacore.format_translation.getTranslation("directMessage"),
                    '[data-translate-key="filterBySituation"]': ()=>window.wacore.format_translation.getTranslation("filterBySituation"),
                    '[data-translate-key="all"]': ()=>window.wacore.format_translation.getTranslation("all"),
                    '[ data-translate-key="unprocessed"]': ()=>window.wacore.format_translation.getTranslation("unprocessed"),
                    '[data-translate-key="processedWithError"]': ()=>window.wacore.format_translation.getTranslation("processedWithError"),
                    '[data-translate-key="successfullyProcessed"]': ()=>window.wacore.format_translation.getTranslation("successfullyProcessed"),
                    '[data-translate-key="filterBytype"]': ()=>window.wacore.format_translation.getTranslation("filterBytype"),
                    '[data-translate-key="allTypes"]': ()=>window.wacore.format_translation.getTranslation("allTypes"),
                    '[data-translate-key="texting"]': ()=>window.wacore.format_translation.getTranslation("texting"),
                    '[data-translate-key="mediaUpload"]': ()=>window.wacore.format_translation.getTranslation("mediaUpload"),
                    '[data-translate-key="checkNumber"]': ()=>window.wacore.format_translation.getTranslation("checkNumber"),
                    '[data-translate-key="checkChannel"]': ()=>window.wacore.format_translation.getTranslation("checkChannel"),
                    '[data-translate-key="mediaDecryption"]': ()=>window.wacore.format_translation.getTranslation("mediaDecryption"),
                    '[data-translate-key="searchChatList"]': ()=>window.wacore.format_translation.getTranslation("searchChatList"),
                    '[data-translate-key="searchChatData"]': ()=>window.wacore.format_translation.getTranslation("searchChatData"),
                    '[data-translate-key="searchChatMessages"]': ()=>window.wacore.format_translation.getTranslation("searchChatMessages"),
                    '[data-translate-key="webhookNotification"]': ()=>window.wacore.format_translation.getTranslation("webhookNotification"),
                    '[data-translate-key="bulkActions"]': ()=>window.wacore.format_translation.getTranslation("bulkActions"),
                    '[data-translate-key="actions"]': ()=>window.wacore.format_translation.getTranslation("actions"),
                    '[data-translate-key="title-filter"]': ()=>window.wacore.format_translation.getTranslation("titleFilter"),
                    '[data-translate-key="filter"]': ()=>window.wacore.format_translation.getTranslation("filter"),
                    '[data-translate-key="apiResources"]': ()=>window.wacore.format_translation.getTranslation("apiResources"),
                    '[data-translate-key="seeDocumentation"]': ()=>window.wacore.format_translation.getTranslation("seeDocumentation"),
                    '[data-translate-key="configWebhook"]': ()=>window.wacore.format_translation.getTranslation("configWebhook"),
                    '[data-translate-key="apiResourceTextsChecks"]': ()=>window.wacore.format_translation.getTranslation("apiResourceTextsChecks"),
                    '[data-translate-key="yourTokenForAcessingApiResources"]': ()=>window.wacore.format_translation.getTranslation("yourTokenForAcessingApiResources"),
                    '[data-translate-key="gtpChatIntegrationTitle"]': ()=>window.wacore.format_translation.getTranslation("gtpChatIntegrationTitle"),
                    '[data-translate-key="gtpChatIntegrationMessage"]': ()=>window.wacore.format_translation.getTranslation("gtpChatIntegrationMessage"),
                    '[data-translate-key="audioTranscriptionTitle"]': ()=>window.wacore.format_translation.getTranslation("audioTranscriptionTitle"),
                    '[data-translate-key="audioTranscriptionMessage"]': ()=>window.wacore.format_translation.getTranslation("audioTranscriptionMessage"),
                    '[data-translate-key="showHiddenMessages"]': ()=>window.wacore.format_translation.getTranslation("showHiddenMessages"),
                    '[data-translate-key="showHiddenMessagesMessage"]': ()=>window.wacore.format_translation.getTranslation("showHiddenMessagesMessage"),
                    '[data-translate-key="integrationViaApi"]': ()=>window.wacore.format_translation.getTranslation("integrationViaApi"),
                    '[data-translate-key="integrationViaApiMessage"]': ()=>window.wacore.format_translation.getTranslation("integrationViaApiMessage"),
                    '[data-translate-key="integrationViaWebhook"]': ()=>window.wacore.format_translation.getTranslation("integrationViaWebhook"),
                    '[data-translate-key="integrationViaWebhookMessage"]': ()=>window.wacore.format_translation.getTranslation("integrationViaWebhookMessage"),
                    '[data-translate-key="multipleAttendants"]': ()=>window.wacore.format_translation.getTranslation("multipleAttendants"),
                    '[data-translate-key="multipleAttendantsMessage"]': ()=>window.wacore.format_translation.getTranslation("multipleAttendantsMessage"),
                    '[data-translate-key="crmModuleTitle"]': ()=>window.wacore.format_translation.getTranslation("crmModuleTitle"),
                    '[data-translate-key="crmModuleMessage"]': ()=>window.wacore.format_translation.getTranslation("crmModuleMessage"),
                    '[data-translate-key="promptMessagesTitle"]': ()=>window.wacore.format_translation.getTranslation("promptMessagesTitle"),
                    '[data-translate-key="promptMessagesMessage"]': ()=>window.wacore.format_translation.getTranslation("promptMessagesMessage"),
                    '[data-translate-key="transferByHashtagTitle"]': ()=>window.wacore.format_translation.getTranslation("transferByHashtagTitle"),
                    '[data-translate-key="transferByHashtagMessage"]': ()=>window.wacore.format_translation.getTranslation("transferByHashtagMessage"),
                    '[data-translate-key="toSetUp"]': ()=>window.wacore.format_translation.getTranslation("toSetUp"),
                    '[data-translate-key="copyJson"]': ()=>window.wacore.format_translation.getTranslation("copyJson"),
                    '[data-translate-key="callDetails"]': ()=>window.wacore.format_translation.getTranslation("callDetails"),
                    '[data-translate-key="executionDate"]': ()=>window.wacore.format_translation.getTranslation("executionDate"),
                    '[data-translate-key="processed"]': ()=>window.wacore.format_translation.getTranslation("processed"),
                    '[data-translate-key="success"]': ()=>window.wacore.format_translation.getTranslation("success"),
                    '[data-translate-key="result"]': ()=>window.wacore.format_translation.getTranslation("result"),
                    '[data-translate-key="processAgain"]': ()=>window.wacore.format_translation.getTranslation("processAgain"),
                    '[data-translate-key="toDiscard"]': ()=>window.wacore.format_translation.getTranslation("toDiscard"),
                    '[data-translate-key="SEND_TEXT"]': ()=>window.wacore.format_translation.getTranslation("SEND_TEXT"),
                    '[data-translate-key="dismissReminder"]': ()=>window.wacore.format_translation.getTranslation("dismissReminder"),
                    '[data-translate-key="cancelAppointment"]': ()=>window.wacore.format_translation.getTranslation("cancelAppointment"),
                    '[data-translate-key="textSubmissionsAwaitingProcessing"]': ()=>window.wacore.format_translation.getTranslation("textSubmissionsAwaitingProcessing"),
                    '[data-translate-key="mediaSubmissionsAwaitingProcessing"]': ()=>window.wacore.format_translation.getTranslation("mediaSubmissionsAwaitingProcessing"),
                    '[data-translate-key="bulkActionsConfirmationMessage"]': ()=>window.wacore.format_translation.getTranslation("bulkActionsConfirmationMessage"),
                    '[data-translate-key="processEverything"]': ()=>window.wacore.format_translation.getTranslation("processEverything"),
                    '[data-translate-key="discardEverything"]': ()=>window.wacore.format_translation.getTranslation("discardEverything"),
                    '[data-translate-key="accessAndDocumentation"]': ()=>window.wacore.format_translation.getTranslation("accessAndDocumentation"),
                    '[data-translate-key="resourcesNowAvailable"]': ()=>window.wacore.format_translation.getTranslation("resourcesNowAvailable"),
                    '[data-translate-key="planLimitation"]': ()=>window.wacore.format_translation.getTranslation("planLimitation"),
                    '[data-translate-key="viewPlans"]': ()=>window.wacore.format_translation.getTranslation("viewPlans"),
                    '[data-translate-key="multiAttendant"]': ()=>window.wacore.format_translation.getTranslation("multiAttendant"),
                    '[data-translate-key="messageSendQrCodeWpp"]': ()=>window.wacore.format_translation.getTranslation("messageSendQrCodeWpp"),
                    '[data-translate-key="iUnderstood"]': ()=>window.wacore.format_translation.getTranslation("iUnderstood"),
                    '[data-translate-key="startNewChatMessage"]': ()=>window.wacore.format_translation.getTranslation("startNewChatMessage"),
                    '[data-translate-key="receiveCare"]': ()=>window.wacore.format_translation.getTranslation("receiveCare"),
                    '[data-translate-key="service"]': ()=>window.wacore.format_translation.getTranslation("service"),
                    '[data-translate-key="transferredBy"]': ()=>window.wacore.format_translation.getTranslation("transferredBy"),
                    '[data-translate-key="accepted"]': ()=>window.wacore.format_translation.getTranslation("accepted"),
                    '[data-translate-key="acceptedAndOpen"]': ()=>window.wacore.format_translation.getTranslation("acceptedAndOpen"),
                    '[data-translate-key="refuse"]': ()=>window.wacore.format_translation.getTranslation("refuse"),
                    '[data-translate-key="transferredService"]': ()=>window.wacore.format_translation.getTranslation("transferredService"),
                    '[data-translate-key="messageServiceTransferred"]': ()=>window.wacore.format_translation.getTranslation("messageServiceTransferred"),
                    '[data-translate-key="canceled"]': ()=>window.wacore.format_translation.getTranslation("canceled"),
                    '[data-translate-key="serviceRefused"]': ()=>window.wacore.format_translation.getTranslation("serviceRefused"),
                    '[data-translate-key="transferService"]': ()=>window.wacore.format_translation.getTranslation("transferService"),
                    '[data-translate-key="messageTransferService"]': ()=>window.wacore.format_translation.getTranslation("messageTransferService"),
                    '[data-translate-key="transfer"]': ()=>window.wacore.format_translation.getTranslation("transfer"),
                    '[data-translate-key="messageAcceptService"]': ()=>window.wacore.format_translation.getTranslation("messageAcceptService"),
                    '[data-translate-key="copilotTimeout"]': ()=>window.wacore.format_translation.getTranslation("copilotTimeout"),
                    '[data-translate-key="titleInvalidOperation"]': ()=>window.wacore.format_translation.getTranslation("titleInvalidOperation"),
                    '[data-translate-key="thisCardBelongsToTheList"]': ()=>window.wacore.format_translation.getTranslation("thisCardBelongsToTheList"),
                    '[data-translate-key="thisCardBelongsToTheListMessage"]': ()=>window.wacore.format_translation.getTranslation("thisCardBelongsToTheListMessage"),
                    '[data-translate-key="moveCard"]': ()=>window.wacore.format_translation.getTranslation("moveCard"),
                    '[data-translate-key="unableToMoveToList"]': ()=>window.wacore.format_translation.getTranslation("unableToMoveToList"),
                    '[data-translate-key="closeThisCard"]': ()=>window.wacore.format_translation.getTranslation("closeThisCard"),
                    '[data-translate-key="messageCloseThisCard"]': ()=>window.wacore.format_translation.getTranslation("messageCloseThisCard"),
                    '[data-translate-key="end"]': ()=>window.wacore.format_translation.getTranslation("end"),
                    '[data-translate-key="transmissionEnded"]': ()=>window.wacore.format_translation.getTranslation("transmissionEnded"),
                    '[data-translate-key="configureAllShippingParameters"]': ()=>window.wacore.format_translation.getTranslation("configureAllShippingParameters"),
                    '[data-translate-key="agreeToTermsOfUse"]': ()=>window.wacore.format_translation.getTranslation("agreeToTermsOfUse"),
                    '[data-translate-key="selectMoreThanOneContact"]': ()=>window.wacore.format_translation.getTranslation("selectMoreThanOneContact"),
                    '[data-translate-key="titlePreSendMsgReady"]': ()=>window.wacore.format_translation.getTranslation("titlePreSendMsgReady"),
                    '[data-translate-key="hashtagAdded"]': ()=>window.wacore.format_translation.getTranslation("hashtagAdded"),
                    '[data-translate-key="messageHashtagAdded"]': ()=>window.wacore.format_translation.getTranslation("messageHashtagAdded"),
                    '[data-translate-key="titleExtensionUpdated"]': ()=>window.wacore.format_translation.getTranslation("titleExtensionUpdated"),
                    '[data-translate-key="titleSettingsWebhook"]': ()=>window.wacore.format_translation.getTranslation("titleSettingsWebhook"),
                    '[data-translate-key="titleRequestFailed"]': ()=>window.wacore.format_translation.getTranslation("titleRequestFailed"),
                    '[data-translate-key="messageRequestFailed"]': ()=>window.wacore.format_translation.getTranslation("messageRequestFailed"),
                    '[data-translate-key="messageRequestFailedFooter"]': ()=>window.wacore.format_translation.getTranslation("messageRequestFailedFooter"),
                    '[data-translate-key="titleRequestSent"]': ()=>window.wacore.format_translation.getTranslation("titleRequestSent"),
                    '[data-translate-key="messageRequestSent"]': ()=>window.wacore.format_translation.getTranslation("messageRequestSent"),
                    '[data-translate-key="messageRequestSentFooter"]': ()=>window.wacore.format_translation.getTranslation("messageRequestSentFooter"),
                    '[data-translate-key="titleNotice"]': ()=>window.wacore.format_translation.getTranslation("titleNotice"),
                    '[data-translate-key="titleRestrictedAccess"]': ()=>window.wacore.format_translation.getTranslation("titleRestrictedAccess"),
                    '[data-translate-key="buttonCheckSignature"]': ()=>window.wacore.format_translation.getTranslation("buttonCheckSignature"),
                    '[data-translate-key="titleServiceCompleted"]': ()=>window.wacore.format_translation.getTranslation("titleServiceCompleted"),
                    '[data-translate-key="messageServiceCompleted"]': ()=>window.wacore.format_translation.getTranslation("messageServiceCompleted"),
                    '[data-translate-key="titleCardClosed"]': ()=>window.wacore.format_translation.getTranslation("titleCardClosed"),
                    '[data-translate-key="titleDisplayOfHiddenMessagesActivated"]': ()=>window.wacore.format_translation.getTranslation("titleDisplayOfHiddenMessagesActivated"),
                    '[data-translate-key="titleWebhookActivated"]': ()=>window.wacore.format_translation.getTranslation("titleWebhookActivated"),
                    '[data-translate-key="titleHashtagTransferActivated"]': ()=>window.wacore.format_translation.getTranslation("titleHashtagTransferActivated"),
                    '[data-translate-key="titleList"]': ()=>window.wacore.format_translation.getTranslation("titleList"),
                    '[data-translate-key="removedBy"]': ()=>window.wacore.format_translation.getTranslation("removedBy"),
                    '[data-translate-key="titleFailedToCreateSchedule"]': ()=>window.wacore.format_translation.getTranslation("titleFailedToCreateSchedule"),
                    '[data-translate-key="toRecord"]': ()=>window.wacore.format_translation.getTranslation("toRecord"),
                    '[data-translate-key="titleScheduledCreatedSuccessfully"]': ()=>window.wacore.format_translation.getTranslation("titleScheduledCreatedSuccessfully"),
                    '[data-translate-key="titleRemoveSchedule"]': ()=>window.wacore.format_translation.getTranslation("titleRemoveSchedule"),
                    '[data-translate-key="messageRemoveSchedule"]': ()=>window.wacore.format_translation.getTranslation("messageRemoveSchedule"),
                    '[data-translate-key="messageSendTo"]': ()=>window.wacore.format_translation.getTranslation("messageSendTo"),
                    '[data-translate-key="messageFailedSendTo"]': ()=>window.wacore.format_translation.getTranslation("messageFailedSendTo"),
                    '[data-translate-key="appoitmentDetails"]': ()=>window.wacore.format_translation.getTranslation("appoitmentDetails"),
                    '[data-translate-key="name"]': ()=>window.wacore.format_translation.getTranslation("name"),
                    '[data-translate-key="schedulingDate"]': ()=>window.wacore.format_translation.getTranslation("schedulingDate"),
                    '[data-translate-key="schedulingType"]': ()=>window.wacore.format_translation.getTranslation("schedulingType"),
                    '[data-translate-key="situation"]': ()=>window.wacore.format_translation.getTranslation("situation"),
                    '[data-translate-key="tryAgain"]': ()=>window.wacore.format_translation.getTranslation("tryAgain"),
                    '[data-translate-key="sendNow"]': ()=>window.wacore.format_translation.getTranslation("sendNow"),
                    '[data-translate-key="premiumAccountLogin"]': ()=>window.wacore.format_translation.getTranslation("premiumAccountLogin"),
                    '[data-translate-key="enterYourLoginDetails"]': ()=>window.wacore.format_translation.getTranslation("enterYourLoginDetails"),
                    '[data-translate-key="iDontHaveALogin"]': ()=>window.wacore.format_translation.getTranslation("iDontHaveALogin"),
                    '[data-translate-key="user"]': ()=>window.wacore.format_translation.getTranslation("user"),
                    '[data-translate-key="password"]': ()=>window.wacore.format_translation.getTranslation("password"),
                    '[data-translate-key="toEnter"]': ()=>window.wacore.format_translation.getTranslation("toEnter"),
                    '[data-translate-key="createUser"]': ()=>window.wacore.format_translation.getTranslation("createUser"),
                    '[data-translate-key="createLogin"]': ()=>window.wacore.format_translation.getTranslation("createLogin"),
                    '[data-translate-key="messageCreateUser"]': ()=>window.wacore.format_translation.getTranslation("messageCreateUser"),
                    '[data-translate-key="messageCreateUserFooter"]': ()=>window.wacore.format_translation.getTranslation("messageCreateUserFooter"),
                    '[data-translate-key="titleDisconnectUser"]': ()=>window.wacore.format_translation.getTranslation("titleDisconnectUser"),
                    '[data-translate-key="disconnect"]': ()=>window.wacore.format_translation.getTranslation("disconnect"),
                    '[data-translate-key="apiKeyOpenAiConfiguration"]': ()=>window.wacore.format_translation.getTranslation("apiKeyOpenAiConfiguration"),
                    '[data-translate-key="enterYouurOpenAiApiKey"]': ()=>window.wacore.format_translation.getTranslation("enterYouurOpenAiApiKey"),
                    '[data-translate-key="pasteYourKeyHere"]': ()=>window.wacore.format_translation.getTranslation("pasteYourKeyHere"),
                    '[data-translate-key="messageRequestFailedKeyApi"]': ()=>window.wacore.format_translation.getTranslation("messageRequestFailedKeyApi"),
                    '[data-translate-key="titleRequestSentKeyApi"]': ()=>window.wacore.format_translation.getTranslation("titleRequestSentKeyApi"),
                    '[data-translate-key="messageRequestSentKeyApi"]': ()=>window.wacore.format_translation.getTranslation("messageRequestSentKeyApi"),
                    '[data-translate-key="chatGptModuleNotConfigured"]': ()=>window.wacore.format_translation.getTranslation("chatGptModuleNotConfigured"),
                    '[data-translate-key="pleaseConfigureYourOpenAiApiKey"]': ()=>window.wacore.format_translation.getTranslation("pleaseConfigureYourOpenAiApiKey"),
                    '[data-translate-key="insufficientFunds"]': ()=>window.wacore.format_translation.getTranslation("insufficientFunds"),
                    '[data-translate-key="messageInsufficientFunds"]': ()=>window.wacore.format_translation.getTranslation("messageInsufficientFunds"),
                    '[data-translate-key="unableProcessYourRequest"]': ()=>window.wacore.format_translation.getTranslation("unableProcessYourRequest"),
                    '[data-translate-key="invalidKeyApi"]': ()=>window.wacore.format_translation.getTranslation("invalidKeyApi"),
                    '[data-translate-key="messageInvalidKeyApi"]': ()=>window.wacore.format_translation.getTranslation("messageInvalidKeyApi"),
                    '[data-translate-key="transcription"]': ()=>window.wacore.format_translation.getTranslation("transcription"),
                    '[data-translate-key="transcribeAudioToText"]': ()=>window.wacore.format_translation.getTranslation("transcribeAudioToText"),
                    '[data-translate-key="webhooksConfiguration"]': ()=>window.wacore.format_translation.getTranslation("webhooksConfiguration"),
                    '[data-translate-key="messagesNotification"]': ()=>window.wacore.format_translation.getTranslation("messagesNotification"),
                    '[data-translate-key="pasteYourUrlHere"]': ()=>window.wacore.format_translation.getTranslation("pasteYourUrlHere"),
                    '[data-translate-key="notificationConfiguration"]': ()=>window.wacore.format_translation.getTranslation("notificationConfiguration"),
                    '[data-translate-key="notifyReceivedMessages"]': ()=>window.wacore.format_translation.getTranslation("notifyReceivedMessages"),
                    '[data-translate-key="receivedMessages"]': ()=>window.wacore.format_translation.getTranslation("receivedMessages"),
                    '[data-translate-key="notifySentMessages"]': ()=>window.wacore.format_translation.getTranslation("notifySentMessages"),
                    '[data-translate-key="sentMessages"]': ()=>window.wacore.format_translation.getTranslation("sentMessages"),
                    '[data-translate-key="notifyDirectChatMessages"]': ()=>window.wacore.format_translation.getTranslation("notifyDirectChatMessages"),
                    '[data-translate-key="directChatMessages"]': ()=>window.wacore.format_translation.getTranslation("directChatMessages"),
                    '[data-translate-key="notifyGroupMessages"]': ()=>window.wacore.format_translation.getTranslation("notifyGroupMessages"),
                    '[data-translate-key="groupChat"]': ()=>window.wacore.format_translation.getTranslation("groupChat"),
                    '[data-translate-key="titleRemoveUser"]': ()=>window.wacore.format_translation.getTranslation("titleRemoveUser"),
                    '[data-translate-key="agreeThatYouWillNotSpam"]': ()=>window.wacore.format_translation.getTranslation("agreeThatYouWillNotSpam"),
                    '[data-translate-key="timeIsOver"]': ()=>window.wacore.format_translation.getTranslation("timeIsOver"),
                    '[data-translate-key="messageGenerateNewRequestCode"]': ()=>window.wacore.format_translation.getTranslation("messageGenerateNewRequestCode"),
                    '[data-translate-key="serviceWillRestart"]': ()=>window.wacore.format_translation.getTranslation("serviceWillRestart"),
                    '[data-translate-key="userNotFound"]': ()=>window.wacore.format_translation.getTranslation("userNotFound"),
                    '[data-translate-key="serviceCarriedOutSuccessfully"]': ()=>window.wacore.format_translation.getTranslation("serviceCarriedOutSuccessfully"),
                    '[data-translate-key="channelNotFound"]': ()=>window.wacore.format_translation.getTranslation("channelNotFound"),
                    '[data-translate-key="expiredCredential"]': ()=>window.wacore.format_translation.getTranslation("expiredCredential"),
                    '[data-translate-key="failedToDisplay"]': ()=>window.wacore.format_translation.getTranslation("failedToDisplay"),
                    '[data-translate-key="typeThePassword"]': ()=>window.wacore.format_translation.getTranslation("typeThePassword"),
                    '[data-translate-key="incorrectPassword"]': ()=>window.wacore.format_translation.getTranslation("incorrectPassword"),
                    '[data-translate-key="unregisteredUser"]': ()=>window.wacore.format_translation.getTranslation("unregisteredUser"),
                    '[data-translate-key="whatsappChannelNotRegistered"]': ()=>window.wacore.format_translation.getTranslation("whatsappChannelNotRegistered"),
                    '[data-translate-key="failedToRegister"]': ()=>window.wacore.format_translation.getTranslation("failedToRegister")
                },
                translateText() {
                    for (const e in window.wacore.format_translation.translationMap)
                        if (window.wacore.format_translation.translationMap.hasOwnProperty(e)) {
                            const t = window.wacore.format_translation.translationMap[e];
                            document.querySelectorAll(e).forEach((e=>{
                                e.hasAttribute("title") ? e.setAttribute("title", t()) : e.hasAttribute("placeholder") ? e.setAttribute("placeholder", t()) : e.hasAttribute("label") ? e.setAttribute("label", t()) : e.innerHTML = t()
                            }
                            ))
                        }
                },
                handleLanguageChange(e) {
                    window.wacore.translation.language = e,
                    localStorage.setItem("ChatLabelLangPref", e),
                    this.translateText(),
                    this.showFlags()
                },
                showFlags() {
                    const e = document.querySelector(".opcoes-bandeira");
                    this.flagSelecionada ? e.style.display = "none" : e.style.display = "block",
                    this.flagSelecionada = !this.flagSelecionada
                },
                selectFlag(e, t) {
                    const a = document.querySelector(".bandeira");
                    a.style.background = `url('${e}') no-repeat`,
                    a.style.backgroundSize = "cover",
                    this.handleLanguageChange("en"),
                    window.wacore.html.tpl_metrics(),
                    window.wacore.crm.updateListFilter(),
                    window.wacore.api.functions.initGridLogs()
                },
                loadingFlag() {
                    this.selectFlag(window.wacore.format_translation.flags[window.wacore.translation.language], window.wacore.translation.language)
                },
                updateTextColumnNames(e) {
                    e.forEach((e=>{
                        e.key && (e.name = window.wacore.format_translation.getTranslation(e.key))
                    }
                    ))
                }
            },
            window.wacore.format_translation.loadingFlag(),
            window.wacore.format_translation.translateText()
        }
        ,
        778: ()=>{
            window.wacore.translation = {
                language: localStorage.getItem("ChatLabelLangPref") || "en",
                pt: {
                    conversations: "Conversations",
                    unreadMessageExceptArchive: "Unread messages except archived",
                    crmMode: "CRM Mode",
                    metrics: "Metrics",
                    transmissionsShots: "Transmissions (Shots)",
                    messagesAndScripts: "Messages & Scripts",
                    apiAndWebhooksModule: "API & Webhooks Module",
                    modulesExtraResources: "Modules (Extra Resources)",
                    signature: "Signature",
                    settings: "Settings",
                    alls: "All",
                    fixed: "FIXED",
                    recents: "Recents",
                    progress: "Progress",
                    pending: "Pending",
                    completed: "Completed",
                    toLookFor: "Search",
                    loadingKanbamTitle: "Loading frames",
                    loadingKanbamText: "Wait a minute",
                    editTitle: "Edit title",
                    fireMessageToList: "Fire message to list",
                    removeList: "Remove list",
                    openConversation: "Open conversation",
                    closeCard: "Close card",
                    moveToAList: "Move to a list",
                    moveFromList: "Move from list",
                    moveListConversation: "Move list conversation",
                    close: "Close",
                    toClose: "Close",
                    hangTags: "Tags",
                    transferFromAttendant: "Transfer from attendant",
                    transferToAnotherAttendant: "Transfer to another attendant",
                    finish: "Finish",
                    endService: "End service",
                    archiveConversationAfterFinishingTheService: "Archive conversation after end of service",
                    closeCardAfterCompletingTheService: "Close card after completion of service",
                    sendMessageInforming: "Send message informing",
                    enderAClosingMessage: "Enter a closing message...",
                    cancel: "Cancel",
                    messageInformingFooter: "The call with the attendant's name will be removed from the conversation list at the end of this service!",
                    appointmentsWaitingOrWithError: "Appointments waiting or with error",
                    messageScheduling: "Message scheduling",
                    createSchedule: "Create schedule",
                    openAppointmentCenter: "Open Appointment Center",
                    createNewSchedule: "Create new schedule",
                    informativeMessageScheduling: "Remember that the successful execution of the schedule depends on there being at least one user connected to your WhatsappWeb at the defined time.",
                    selectADate: "Select a date",
                    number: "Number: ",
                    typeOfSchedule: "Type of schedule",
                    sendingMessage: "Sending message",
                    reminder: "Reminder",
                    messageOrNote: "Message or note",
                    toRecord: "Record",
                    completeTheMessage: "Complete the message!",
                    fillInTheNumber: "Fill in the number!",
                    fillInTheAppointmentDate: "Fill in the appointment date!",
                    addAValidWhatsappNumber: "Add a valid WhatsApp number!",
                    SEND_TEXT: "SEND TEXT",
                    dismissReminder: "Dismiss reminder",
                    cancelAppointment: "Cancel appointment",
                    schedulingCompletedSuccessfully: "Scheduling completed successfully!",
                    schedulingExecutedManually: "Schedule executed manually!",
                    thereWasAproblemExecuting: "There was a problem executing the schedule!",
                    schedulingCenter: "Scheduling center",
                    all: "ALL",
                    allTypes: "ALL",
                    scheduled: "SCHEDULED",
                    scheduledOrInError: "SCHEDULED OR IN ERROR",
                    successfullyExecuted: "EXECUTED SUCCESSFULLY",
                    executedWithError: "EXECUTED WITH ERROR",
                    canceled: "CANCELED",
                    MESSAGE: "MESSAGE",
                    REMINDER: "REMINDER",
                    filter: "Filter",
                    messagesAndScripts: "Messages & Scripts",
                    editDisplayName: "Edit display name",
                    "displayMessageName(Active)": "Display name in message(Active)",
                    "displayMessageName(Inactive)": "Display name in message(Inactive)",
                    "copilot(Active)": "Copilot (Active)",
                    "copilot(Inactive)": "Copilot (Inactive)",
                    clickToSend: "Click to send",
                    addListToCrm: "Add list to CRM",
                    enterANameForTheList: "Enter a name for the list",
                    enterAName: "Enter a name",
                    youHaveReachedTheLimitOF: "You have reached the limit of ",
                    lists: " lists",
                    noRegisteredTag: "No TAG registered",
                    metricsOfTheMonth: "Metrics month of ",
                    attendances: "Attendances",
                    crmBusinessFlow: "CRM (Business Flow)",
                    finalized: "Finalized",
                    opened: "Open",
                    averageTimePerService: "Average time per service",
                    businessStarted: "Business started",
                    earnings: "Earnings",
                    lost: "Lost",
                    averageDurationPerDeal: "Average duration per deal",
                    arrayOfMonths: {
                        January: "January",
                        February: "February",
                        March: "March",
                        April: "April",
                        May: "May",
                        June: "June",
                        July: "July",
                        August: "August",
                        September: "September",
                        October: "October",
                        November: "November",
                        December: "December"
                    },
                    selectContacts: "Select contacts",
                    toGoBack: "Back",
                    selectByContacts: "Select by contacts",
                    selectContactsFromGroups: "Select contacts from groups",
                    selectByListCrm: "Select by list (CRM)",
                    selectByTags: "Select by tags",
                    selectByAttendants: "Select by attendants",
                    selectForUnread: "Select for unread",
                    selectForGroups: "Select by groups",
                    importFromCsv: "Import from CSV",
                    typeSingle: "Single type",
                    historic: "History",
                    listOfCreatedShots: "List of created shots",
                    selectTheList: "Select the list",
                    searchByNameOrNumber: "Search by name or number",
                    selectAll: "Select all",
                    selectTheGroup: "Select the group",
                    selectTheList: "Select the list",
                    selectTheTag: "Select the tag",
                    selectAttendant: "Select the attendant",
                    csvInformationalMessageUpload: "The .csv file must contain a single column with numbers (one per line).<br>The numbers must contain the country code.<br>Example: 5511900000000",
                    uploadCsvFile: "Upload .csv file",
                    loading: "Loading",
                    typeOrPasteTheNumbers: "Type or paste the numbers",
                    separateInformationMessage: "Enter the numbers separated by commas.<br>The numbers must contain the country code.<br>Example: 5511900000000,5531900000000",
                    toLoad: "Load",
                    shippingStatus: "Shipping status",
                    toRemove: "Remove",
                    selectedContacts: "Selected contacts",
                    selectTheContacts: "Select the contacts",
                    prepareTransmission: "Prepare transmission",
                    informativeMessageTransmission: "The parameters are necessary so that messages can be sent progressively. In view of WhatsApp policy: We do not recommend sending to more than 100 contacts per broadcast. <b>Don't SPAM.</b>",
                    accept: "I read and agree",
                    select: "Select",
                    secondIntervalPerMessageSent: "Interval of seconds per message sent",
                    fiveToTen: "5 to 10 seconds",
                    tenToFifteen: "10 to 15 seconds",
                    fifteenToTwenty: "15 to 20 seconds",
                    oneToFive: "1 to 5 seconds (not recommended)",
                    pauseSendEvery: "Pause sending every",
                    fiveMessageSend: "5 messages sent",
                    tenMessageSend: "10 messages sent",
                    twentyMessageSend: "20 messages sent",
                    fortyMessageSend: "40 messages sent",
                    eightyMessageSend: "80 messages sent",
                    resendWith: "Resend with",
                    oneMinute: "1 minute",
                    fiveMinutes: "5 minutes",
                    fifteenMinutes: "15 minutes",
                    twentyFiveMinutes: "25 minutes",
                    thirtySeconds: "30 seconds",
                    message: "Message",
                    readyMessages: "Ready messages",
                    scripts: "Scripts",
                    create: "Create",
                    createMessageOrScript: "Create message/Script",
                    proceed: "Continue",
                    messagesAndScriptsReady: "Messages & Scripts Ready",
                    messages: "Messages",
                    informativeMessageCreate: "Create text, voice or other media messages and send them to your customers with just one click!",
                    addMessage: "Add message",
                    selectMessageType: "Select message type",
                    textMessage: "Text message",
                    voiceMessage: "Voice message",
                    imageMessage: "Image message",
                    titleForReference: "Title for reference",
                    typeTheTitle: "Enter the title",
                    typeTheMessage: "Type the message",
                    selectInOrderOfSubmission: "Select from submission sequence",
                    favoriteForMyUser: "Favorite for my user",
                    informationalMessageTitle: "<small>The title will appear above the text field within the conversation</small>",
                    informationalMessageInterval: "<small>Messages will be sent at intervals of 5 to 10 seconds according to the list sequence.</small>",
                    list: "List",
                    addMessage: "Add message",
                    clickToRecordTheAudio: "Click to record audio",
                    clickToSendTheImage: "Click to send the image",
                    readyScripts: "Ready scripts",
                    scriptInformationalMessage: "A script is a set of grouped messages that are sent in sequence to your customer with just one click!",
                    selectOrderSubmission: "Select from submission sequence",
                    toAdd: "Add",
                    messageSequence: "Message sequence",
                    apiResources: "API Resources",
                    seeDocumentation: "See Documentation 🚀",
                    configWebhook: "Configure Webhook",
                    bulkActions: "Bulk Actions",
                    apiResourceTextsChecks: "\n     ✅ Send Texts and Media <br>\n     ✅ Search Chat List <br>\n     ✅ Search Chat Messages <br>\n     ✅ Decrypt Message Media <br>\n     ✅ Check channel status <br>\n     ✅ Check if the number has WhatsApp <br>\n     ",
                    yourTokenForAcessingApiResources: "Your token to access API resources",
                    filterBySituation: "Filter by situation",
                    unprocessed: "UNPROCESSED",
                    processedWithError: "PROCESSED WITH ERROR",
                    successfullyProcessed: "PROCESSED SUCCESSFULLY",
                    filterBytype: "Filter by type",
                    texting: "TEXT SEND",
                    mediaUpload: "MEDIA UPLOAD",
                    checkNumber: "CHECK NUMBER",
                    checkChannel: "CHECK CHANNEL",
                    mediaDecryption: "MEDIA DECRYPTION",
                    searchChatList: "SEARCH CHATS LIST",
                    searchChatData: "SEARCH CHAT DATA",
                    searchChatMessages: "SEARCH CHAT MESSAGES",
                    webhookNotification: "WEBHOOK NOTIFICATION",
                    titleFilter: "Filter",
                    eventData: "Dt. event",
                    method: "Method",
                    resource: "Resource",
                    number: "Number",
                    processed: "Processed",
                    success: "Success",
                    resultObservation: "Observation result",
                    message: "Message",
                    average: "Average",
                    actions: "Actions",
                    gtpChatIntegrationTitle: "Integration with Chat-GPT",
                    gtpChatIntegrationMessage: "Enhance your WhatsApp with the powerful Chat-GPT ally! Gain useful features for tasks such as searches, translations, corrections or text formatting and even automatic answer suggestions.",
                    audioTranscriptionTitle: "Audio transcription",
                    audioTranscriptionMessage: "With this functionality it will be possible to transcribe audios into text in just 1 click, thus speeding up the customer service process.",
                    showHiddenMessages: "Show hidden messages",
                    showHiddenMessagesMessage: "With this option, all your WhatsApp messages will remain visible for audit purposes, this way it is possible to have access to single-view messages as well as those deleted by both the operator and the customer.",
                    integrationViaApi: "Integration via API",
                    integrationViaApiMessage: "Access resources via API to enable automation and integrations with other systems.",
                    integrationViaWebhook: "Integration via Webhook",
                    integrationViaWebhookMessage: "Receive real-time notifications about your system events via webhook and synchronize data with other platforms easily and securely.",
                    multipleAttendants: "Multiple attendants",
                    multipleAttendantsMessage: "Identify calls with each user's name.",
                    crmModuleTitle: "CRM Module",
                    crmModuleMessage: "Create a Kanban-style funnel and move cards (conversations) between lists.",
                    promptMessagesTitle: "Ready messages",
                    promptMessagesMessage: "Add personalized messages with (Voice, text and media) and send to your customer with just one click!",
                    transferByHashtagTitle: "Transfer (By hashtag)",
                    transferByHashtagMessage: "Set up default hashtags that, if mentioned in a conversation, the system will automatically move the card to a certain list.",
                    toSetUp: "SetUp",
                    transferNewServiceTitle: "Transfer (New service)",
                    transferNewServiceMessage: "Every time a service is started (The attendant appointment is added to the conversation), the card will be automatically moved to a certain list.",
                    transferByTimeTitle: "Transfer (By time)",
                    transferByTimeMessage: "Whenever the specified time arrives, the system will move all cards from one list to another list.",
                    eventDate: "Dt. event",
                    method: "Method",
                    resource: "Resource",
                    number: "Number",
                    processed: "Processed",
                    success: "Success",
                    resultObservation: "Observation result",
                    message: "Message",
                    average: "Average",
                    actions: "Actions",
                    scheduledDate: "Dt. scheduled",
                    type: "Type",
                    scheduled: "Scheduled",
                    failure: "Failed",
                    whatsapp: "WhatsApp",
                    toSign: "Sign",
                    performSignature: "Perform signature",
                    enterWhatsApp: "Enter the WhatsApp number you want to subscribe to",
                    next: "NEXT",
                    flat: "Flat",
                    selectAPlan: "Select a plan",
                    monthly: "Monthly",
                    basicPlan: "Basic plan BRL 99.90 month",
                    premiumPlan: "Premium plan BRL 199.90 month",
                    yearly: "Yearly",
                    connectedAs: "Connected as:",
                    changeDisplayName: "Change display name",
                    plansAndPrices: "Plans and prices",
                    selectTheLanguage: "Select the language",
                    contactUs: "Contact us",
                    disconnectFromThisUser: "Disconnect from this user",
                    version: "Version: ",
                    planBasic: "Basic Plan",
                    contentForWhomPlans: "For whom?",
                    contentMessagePlanBasic: "Ideal for a <b>single user</b> with unlimited access to CRM list creation, mass triggering, scheduled messages, metrics, tags and more.",
                    premiumPlan: "Premium Plan",
                    contentMessagePlanPremium: "Perfect for companies with <b>multiple employees</b> using the same WhatsApp.<br><br> And with access to <b>all the tool's features without any limitations</b>, all with real-time synchronization between collaborators.",
                    basic: "Basic",
                    premium: "Premium",
                    chatGptIntegration: "Integration with Chat-GPT",
                    audioTranscription: "Audio transcription",
                    api: "API",
                    webhook: "Webhook",
                    multipleUsers: "Multiple users",
                    loginWithPassword: "Login with password",
                    transferBetweenAttendants: "Transfer between attendants",
                    chatBetweenAttendants: "Chat between attendants",
                    showHiddenMessages: "Show hidden messages",
                    massShooting: "Mass shooting",
                    modeCrm: "CRM mode",
                    unlimitedTabsAndList: "Unlimited tabs and lists",
                    cannedMessagesAndScripts: "Canned messages and scripts",
                    scheduleMessageAndReminders: "Schedule messages and reminders",
                    hashtagTransfer: "Transfer by hashtag",
                    unlimitedFilters: "Unlimited filters",
                    planBasicInformationMessage: "Plan available for individual use of WhatsApp Web",
                    planPremiumInformationMessage: "Plan available for shared use of WhatsApp Web",
                    toSign: "Sign",
                    FREEplan: "FREE plan",
                    PREMIUMplan: "PREMIUM plan",
                    BASICplan: "BASIC plan",
                    youAreInThePlan: "You are in the plan",
                    FREE: "FREE",
                    BASIC: "BASIC",
                    TEST: "TEST",
                    PREMIUM: "PREMIUM",
                    withLimitedResources: "with limited resources",
                    howereInAPeriodOf: "however in a period of",
                    signUpForAPlanRightNow: "Sign up for a plan right now!",
                    SUBSCRIBETOPLAN: "» SUBSCRIBE TO PLAN",
                    talkToYourTeam: "Talk to your team",
                    serviceWillRestart: "Service will restart due to plan change! Wait...",
                    userNotFound: "User not found!",
                    serviceCarriedOutSuccessfully: "Service carried out successfully!",
                    channelNotFound: "Channel not found!",
                    expiredCredential: "Expired credential!",
                    failedToDisplay: "Failed to display!",
                    typeThePassword: "Type the password",
                    incorrectPassword: "Incorrect password!",
                    unregisteredUser: "Unregistered user!",
                    whatsappChannelNotRegistered: "WhatsApp channel not registered!",
                    failedToRegister: "Failed to register!",
                    startConversation: "Start conversation",
                    translate: "Translate",
                    notifications: "Notifications",
                    knowledgeBase: "Knowledge base",
                    changeLogs: "Change logs",
                    administrativePanel: "Administrative Panel",
                    yourCurrentPlan: "Your current plan",
                    exportContactsFromListSelectedCsv: "Export contacts from selected list (CSV)",
                    downloadContacts: "Download Contacts",
                    createBroadcast: "Create broadcast",
                    titleToSearchAdnRetrieveTheBroadcastLater: "Title to search and retrieve the broadcast later",
                    iWillNotSpam: "I will not SPAM",
                    saveList: "Save list",
                    createAndStartStreaming: "Create and start streaming",
                    jQueryContactsList: "jQuery Contacts List",
                    resetSortOrder: "Reset sort order",
                    searchAContact: "Search for a contact...",
                    id: "ID",
                    firstName: "Name",
                    lastName: "Last name",
                    email: "Email",
                    phone: "Phone",
                    address: "Address",
                    csv: "CSV",
                    exportCsv: "Export CSV",
                    csvInformationalMessage: "This is the CSV version of the contact database. It syncs with your contact database every time you open the popup.",
                    backToContactList: "Back to contact list",
                    copyCsvToClipboard: "Copy CSV to clipboard",
                    generalFilter: "General Filter",
                    filterByUser: "Filter by User",
                    tagFilter: "Filter by Tag",
                    registerNewConversation: "Register new conversation",
                    allsFilters: "All",
                    noResponseFromAttendant: "No response attendant",
                    noResponseFromClient: "No response client",
                    groupChats: "Group chats",
                    directChats: "Direct Chats",
                    unread: "Unread",
                    registerNewList: "New list",
                    suggest: "Suggest?",
                    "autoSuggestAnswers(Active)": "Auto suggest answers (Active)",
                    "autoSuggestAnswers(Inactive)": "Auto suggest answers (Inactive)",
                    freeSearch: "Free search",
                    textTranslation: "Text translation",
                    translate: "Translate",
                    translateThisTextIntoPortuguese: "Translate this text into Portuguese",
                    translateThisTextIntoEnglish: "Translate this text into English",
                    translateThisTextIntoSpanish: "Translate this text into Spanish",
                    makeYourTextMoreSummarized: "Make your text more summarized",
                    sumUp: "Summarize",
                    makeYourTextBigger: "Make your text bigger",
                    enlarge: "Enlarge",
                    makeYourTextClearer: "Make your text clearer",
                    ofCourse: "Of course",
                    makeYourTextMoreUserFriendly: "Make your text more friendly",
                    friendly: "Friendly",
                    makeYourTextMoreFormal: "Make your text more formal",
                    formal: "Formal",
                    correctSpellingError: "Correct spelling errors (pt-BR)",
                    orthography: "Spelling",
                    makeYourTextMoreDirect: "Make your text more direct",
                    direct: "Direct",
                    copilotAutoSuggestModeActived: "Copilot auto-suggest mode activated.",
                    help: "Help",
                    howCanThisHelpMeTitle: "How can this help me?",
                    helpMeMessage: "It allows you to <b>review, translate, search or even change the tone of a text</b> before sending it, thus making it easier to maintain <b>more effective communication</b> with your contacts.",
                    howToUseTitle: "How to use?",
                    howToUseSubtitle: "<b>There are 2 ways to use Copilot in your text box:</b>",
                    messageHowToUseOne: "<b>1st</b> Selecting a <b>part of the text</b> entered and clicking on one of the action buttons, when doing this Copilot will only process and replace this selected text <b>not affecting the rest of the content</b>",
                    messageHowToUseTwo: "<b>2nd</b> Just by clicking some of the options after writing something, when none of the text is selected, the <b>complete content</b> is processed and replaced according to the selected option.",
                    whatEachOfTheTitleFeaturesIsForTitle: "What is each of the features for?",
                    messageSuggest: "<b>- Suggest:</b> When activated, Copilot will suggest messages according to the context of the conversation.",
                    messageSearch: "<b>- Search:</b> This function does a free search and replaces with the result.",
                    spellingMessage: "<b>- Spelling:</b> This function corrects possible spelling errors (pt-BR exclusive).",
                    messageTranslatePt: "<b>- Translate:Portuguese:</b> Translates the text into Portuguese.",
                    messageTranslateEn: "<b>- Translate:English:</b> Translates the text into English.",
                    messageTranslateEs: "<b>- Translate:Spanish:</b> Translates the text into Spanish.",
                    messageSummarize: "<b>- Summarize:</b> Summarizes the text making it as short as possible, maintaining the same context.",
                    messageEnlarge: "<b>- Enlarge:</b> Makes the text larger, maintaining the same context.",
                    clearMessage: "<b>- Clear:</b> Makes the text as clear as possible.",
                    friendlyMessage: "<b>- Friendly:</b> Makes the text a little more friendly, changing some terms.",
                    formalMessage: "<b>- Formal:</b> Makes the text a little more formal, changing some terms.",
                    directMessage: "<b>- Direct:</b> Makes the text as direct as possible.",
                    areYouSureYouWantToDeleteThisList: "Are you sure you want to remove this list?",
                    messageDeleteList: "All cards that belong to this list will be finalized.",
                    yes: "Yes",
                    no: "No",
                    thisCardAlreadyBelongsToAList: "This card already belongs to a list",
                    moveCard: "Move card",
                    messageCardBelongsToAList: "",
                    toSave: "Save",
                    enterANewName: "Enter a new name",
                    messageFooter: "The name will be visible in all messages sent.",
                    invalidNumber: "Invalid number",
                    oops: "Oops!",
                    typeATitleForTheAudio: "Enter a title for the audio",
                    typeATitleForTheImage: "Enter a title for the image",
                    typeTheText: "Enter a text",
                    typeTheTitleReference: "Enter a reference title",
                    selectMoreThaOneMessage: "Select more than one message",
                    createdScript: "Created script",
                    sendItToYourCustomerWithJustOneClick: "Send to your customer with just one click!",
                    readyMessageAdded: "Ready message added",
                    areYouSureYouWantToRemoveThisMessage: "Are you sure you want to remove this message?",
                    copyJson: "copy json",
                    callDetails: "Call details",
                    executionDate: "Execution date",
                    processed: "Processed?",
                    success: "Success",
                    result: "Result: ",
                    processAgain: "Process again",
                    toDiscard: "Discard",
                    textSubmissionsAwaitingProcessing: "Text submissions awaiting processing:",
                    mediaSubmissionsAwaitingProcessing: "Media uploads awaiting processing:",
                    bulkActionsConfirmationMessage: 'This action will be applied to all "stuck" events.<br> When confirming it cannot be undone, as it is a <b>one-way operation!</b>',
                    processEverything: "Process everything",
                    discardEverything: "Discard everything",
                    accessAndDocumentation: "Access and Documentation",
                    resourcesNowAvailable: "Resources Now Available",
                    planLimitation: "Plan limitation",
                    informativeMessagePlans: "You have reached the 3 message limit",
                    viewPlans: "View plans",
                    multiAttendant: "Multi-Attendant",
                    messageSendQrCodeWpp: "Connect multiple agents to a single number with the Premium plan!",
                    iUnderstood: "Got it",
                    startNewChatMessage: "You can start a conversation with someone whose phone number is not saved in your contact list.",
                    receiveCare: "Receive care",
                    service: "Service: ",
                    transferredBy: "Transferred by",
                    accepted: "Accept",
                    acceptedAndOpen: "Accept and open",
                    refuse: "Refuse",
                    transferredService: "Service transferred",
                    messageServiceTransferred: "From now on, you are the new person responsible for this service!",
                    canceled: "Canceled",
                    serviceRefused: "Service refused",
                    transferService: "Transfer service",
                    messageTransferService: "The marking with the attendant's name will be changed to: ",
                    transfer: "Transfer",
                    messageAcceptService: "The user needs to accept this service!",
                    copilotTimeout: "Processing attempt failed, try again.",
                    titleInvalidOperation: "Invalid operation",
                    thisCardBelongsToTheList: "This card belongs to the list: ",
                    thisCardBelongsToTheListMessage: ". When moving, the flow of automations from the current list to this conversation will end.",
                    moveCard: "Move card",
                    unableToMoveToList: "Unable to move to list",
                    closeThisCard: "Close this card?",
                    messageCloseThisCard: "When closing this card, if you enter the value of the gain, it will be added to the dashboard metrics and linked to the user who started the flow of this card.",
                    end: "End!",
                    transmissionEnded: "Transmission ended! :)",
                    configureAllShippingParameters: "Configure all shipping parameters",
                    agreeToTermsOfUse: "Agree to terms of use",
                    selectMoreThanOneContact: "Select more than 1 contact!",
                    titleFlaws: "Problem number(s): ",
                    messageFailures: "Failed to add one or more numbers!",
                    titlePreSendMsgReady: "Confirm sending message: ",
                    hashtagAdded: "Hashtag added",
                    messageHashtagAdded: "Make sure to activate the module.",
                    titleExtensionUpdated: "Your extension has been <b>updated</b>",
                    titleSettingsWebhook: "Webhook configuration updated!",
                    titleRequestFailed: "Request failed",
                    messageRequestFailed: "This WhatsApp number is not registered!",
                    messageRequestFailedFooter: "Try again.",
                    titleRequestSent: "Request sent",
                    messageRequestSent: "Request that the person responsible for the cell phone (Manager) enter the panel and accept your request!",
                    messageRequestSentFooter: "You will automatically connect when your request is accepted by the person who has the cell phone in hand.",
                    titleNotice: "Notice",
                    titleRestrictedAccess: "Restricted access",
                    buttonCheckSignature: "Check signature",
                    titleServiceCompleted: "Service completed!",
                    messageServiceCompleted: "You have completed the service.",
                    titleCardClosed: "Card closed",
                    titleDisplayOfHiddenMessagesActivated: "Display of hidden messages activated!",
                    titleWebhookActivated: "Webhook module activated!",
                    titleHashtagTransferActivated: "Auto #hashtag transfer enabled!",
                    titleList: "List: ",
                    removedBy: "removed by ",
                    titleFailedToCreateSchedule: "Failed to create the schedule (cronAgendamento)",
                    titleScheduledCreatedSuccessfully: "Scheduling created successfully!",
                    titleRemoveSchedule: "Are you sure you want to remove this schedule?",
                    messageRemoveSchedule: "The flow will be terminated",
                    messageSendTo: "Message sent to: ",
                    messageFailedSendTo: "Failed to send the schedule to: ",
                    appoitmentDetails: "Appointment details",
                    name: "Name: ",
                    Date: "Date scheduling scheduling",
                    schedulingDate: "Scheduling date: ",
                    schedulingType: "Scheduling type: ",
                    situation: "Situation: ",
                    tryAgain: "Try again",
                    sendNow: "Send now",
                    premiumAccountLogin: "Premium account login",
                    enterYourLoginDetails: "Enter your login details",
                    iDontHaveALogin: "I don't have a login",
                    user: "User",
                    password: "Password",
                    toEnter: "Enter",
                    createUser: "Create user",
                    createLogin: "Create login",
                    messageCreateUser: "Request the administrator of this WhatsApp account to create your registration",
                    messageCreateUserFooter: "If you are the administrator just click: ",
                    titleDisconnectUser: "Do you want to disconnect from this user?",
                    disconnect: "Disconnect",
                    apiKeyOpenAiConfiguration: "API Key OpenAI",
                    enterYouurOpenAiApiKey: "Enter your OpenAI API key",
                    pasteYourKeyHere: "Paste your key here",
                    messageRequestFailedKeyApi: "This key is not valid!",
                    titleRequestSentKeyPApi: "Key added successfully!!",
                    messageRequestSentKeyApi: "You can now use the Chat-GPT module in your conversations.",
                    chatGptModuleNotConfigured: "Chat-GPT module not configured",
                    pleaseConfigureYourOpenAiApiKey: "Please configure your OpenAI API key",
                    insufficientFunds: "Insufficient funds",
                    messageInsufficientFunds: "Please access your account dashboard on the Open Ai website and add balance to continue...",
                    unableProcessYourRequest: "We are currently unable to process your request. Try again later...",
                    invalidKeyApi: "Invalid key API",
                    messageInvalidKeyApi: "The key you entered is invalid. Please check and try again.",
                    transcription: "Transcription",
                    transcribeAudioToText: "Transcribe audio to text",
                    webhooksConfiguration: "Webhooks Configuration",
                    messagesNotification: "Message notification",
                    pasteYourUrlHere: "Paste your URL here",
                    notificationConfiguration: "Notification configuration",
                    notifyReceivedMessages: "Notify received messages",
                    receivedMessages: "Messages received",
                    notifySentMessages: "Notify sent messages",
                    sentMessages: "Messages sent",
                    notifyDirectChatMessages: "Notify direct chat messages",
                    directChatMessages: "Direct chat messages",
                    notifyGroupMessages: "Notify group messages",
                    groupChat: "Group chat",
                    titleRemoveUser: "Are you sure you want to remove this user?",
                    agreeThatYouWillNotSpam: "I agree that I will not SPAM",
                    timeIsOver: "Time over",
                    messageGenerateNewRequestCode: "Click to generate new request code"
                },
                en: {
                    conversations: "Conversations",
                    unreadMessageExceptArchive: "Unread messages except archived",
                    crmMode: "CRM Mode",
                    metrics: "Metrics",
                    transmissionsShots: "Transmissions (Shots)",
                    messagesAndScripts: "Messages & Scripts",
                    apiAndWebhooksModule: "API & Webhooks Module",
                    modulesExtraResources: "Modules (Extra Resources)",
                    signature: "Signature",
                    settings: "Settings",
                    alls: "All",
                    fixed: "FIXED",
                    recents: "Recents",
                    progress: "Progress",
                    pending: "Pending",
                    completed: "Completed",
                    toLookFor: "Search",
                    loadingKanbamTitle: "Loading frames",
                    loadingKanbamText: "Wait a minute",
                    editTitle: "Edit title",
                    fireMessageToList: "Fire message to list",
                    removeList: "Remove list",
                    openConversation: "Open conversation",
                    closeCard: "Close card",
                    moveToAList: "Move to a list",
                    moveFromList: "Move from list",
                    moveListConversation: "Move list conversation",
                    close: "Close",
                    toClose: "Close",
                    hangTags: "Tags",
                    transferFromAttendant: "Transfer from attendant",
                    transferToAnotherAttendant: "Transfer to another attendant",
                    finish: "Finish",
                    endService: "End service",
                    archiveConversationAfterFinishingTheService: "Archive conversation after end of service",
                    closeCardAfterCompletingTheService: "Close card after completion of service",
                    sendMessageInforming: "Send message informing",
                    enderAClosingMessage: "Enter a closing message...",
                    cancel: "Cancel",
                    messageInformingFooter: "The call with the attendant's name will be removed from the conversation list at the end of this service!",
                    appointmentsWaitingOrWithError: "Appointments waiting or with error",
                    messageScheduling: "Message scheduling",
                    createSchedule: "Create schedule",
                    openAppointmentCenter: "Open Appointment Center",
                    createNewSchedule: "Create new schedule",
                    informativeMessageScheduling: "Remember that the successful execution of the schedule depends on there being at least one user connected to your WhatsappWeb at the defined time.",
                    selectADate: "Select a date",
                    number: "Number: ",
                    typeOfSchedule: "Type of schedule",
                    sendingMessage: "Sending message",
                    reminder: "Reminder",
                    messageOrNote: "Message or note",
                    toRecord: "Record",
                    completeTheMessage: "Complete the message!",
                    fillInTheNumber: "Fill in the number!",
                    fillInTheAppointmentDate: "Fill in the appointment date!",
                    addAValidWhatsappNumber: "Add a valid WhatsApp number!",
                    SEND_TEXT: "SEND TEXT",
                    dismissReminder: "Dismiss reminder",
                    cancelAppointment: "Cancel appointment",
                    schedulingCompletedSuccessfully: "Scheduling completed successfully!",
                    schedulingExecutedManually: "Schedule executed manually!",
                    thereWasAproblemExecuting: "There was a problem executing the schedule!",
                    schedulingCenter: "Scheduling center",
                    all: "ALL",
                    allTypes: "ALL",
                    scheduled: "SCHEDULED",
                    scheduledOrInError: "SCHEDULED OR IN ERROR",
                    successfullyExecuted: "EXECUTED SUCCESSFULLY",
                    executedWithError: "EXECUTED WITH ERROR",
                    canceled: "CANCELED",
                    MESSAGE: "MESSAGE",
                    REMINDER: "REMINDER",
                    filter: "Filter",
                    messagesAndScripts: "Messages & Scripts",
                    editDisplayName: "Edit display name",
                    "displayMessageName(Active)": "Display name in message(Active)",
                    "displayMessageName(Inactive)": "Display name in message(Inactive)",
                    "copilot(Active)": "Copilot (Active)",
                    "copilot(Inactive)": "Copilot (Inactive)",
                    clickToSend: "Click to send",
                    addListToCrm: "Add list to CRM",
                    enterANameForTheList: "Enter a name for the list",
                    enterAName: "Enter a name",
                    youHaveReachedTheLimitOF: "You have reached the limit of ",
                    lists: " lists",
                    noRegisteredTag: "No TAG registered",
                    metricsOfTheMonth: "Metrics month of ",
                    attendances: "Attendances",
                    crmBusinessFlow: "CRM (Business Flow)",
                    finalized: "Finalized",
                    opened: "Open",
                    averageTimePerService: "Average time per service",
                    businessStarted: "Business started",
                    earnings: "Earnings",
                    lost: "Lost",
                    averageDurationPerDeal: "Average duration per deal",
                    arrayOfMonths: {
                        January: "January",
                        February: "February",
                        March: "March",
                        April: "April",
                        May: "May",
                        June: "June",
                        July: "July",
                        August: "August",
                        September: "September",
                        October: "October",
                        November: "November",
                        December: "December"
                    },
                    selectContacts: "Select contacts",
                    toGoBack: "Back",
                    selectByContacts: "Select by contacts",
                    selectContactsFromGroups: "Select contacts from groups",
                    selectByListCrm: "Select by list (CRM)",
                    selectByTags: "Select by tags",
                    selectByAttendants: "Select by attendants",
                    selectForUnread: "Select for unread",
                    selectForGroups: "Select by groups",
                    importFromCsv: "Import from CSV",
                    typeSingle: "Single type",
                    historic: "History",
                    listOfCreatedShots: "List of created shots",
                    selectTheList: "Select the list",
                    searchByNameOrNumber: "Search by name or number",
                    selectAll: "Select all",
                    selectTheGroup: "Select the group",
                    selectTheList: "Select the list",
                    selectTheTag: "Select the tag",
                    selectAttendant: "Select the attendant",
                    csvInformationalMessageUpload: "The .csv file must contain a single column with numbers (one per line).<br>The numbers must contain the country code.<br>Example: 5511900000000",
                    uploadCsvFile: "Upload .csv file",
                    loading: "Loading",
                    typeOrPasteTheNumbers: "Type or paste the numbers",
                    separateInformationMessage: "Enter the numbers separated by commas.<br>The numbers must contain the country code.<br>Example: 5511900000000,5531900000000",
                    toLoad: "Load",
                    shippingStatus: "Shipping status",
                    toRemove: "Remove",
                    selectedContacts: "Selected contacts",
                    selectTheContacts: "Select the contacts",
                    prepareTransmission: "Prepare transmission",
                    informativeMessageTransmission: "The parameters are necessary so that messages can be sent progressively. In view of WhatsApp policy: We do not recommend sending to more than 100 contacts per broadcast. <b>Don't SPAM.</b>",
                    accept: "I read and agree",
                    select: "Select",
                    secondIntervalPerMessageSent: "Interval of seconds per message sent",
                    fiveToTen: "5 to 10 seconds",
                    tenToFifteen: "10 to 15 seconds",
                    fifteenToTwenty: "15 to 20 seconds",
                    oneToFive: "1 to 5 seconds (not recommended)",
                    pauseSendEvery: "Pause sending every",
                    fiveMessageSend: "5 messages sent",
                    tenMessageSend: "10 messages sent",
                    twentyMessageSend: "20 messages sent",
                    fortyMessageSend: "40 messages sent",
                    eightyMessageSend: "80 messages sent",
                    resendWith: "Resend with",
                    oneMinute: "1 minute",
                    fiveMinutes: "5 minutes",
                    fifteenMinutes: "15 minutes",
                    twentyFiveMinutes: "25 minutes",
                    thirtySeconds: "30 seconds",
                    message: "Message",
                    readyMessages: "Ready messages",
                    scripts: "Scripts",
                    create: "Create",
                    createMessageOrScript: "Create message/Script",
                    proceed: "Continue",
                    messagesAndScriptsReady: "Messages & Scripts Ready",
                    messages: "Messages",
                    informativeMessageCreate: "Create text, voice or other media messages and send them to your customers with just one click!",
                    addMessage: "Add message",
                    selectMessageType: "Select message type",
                    textMessage: "Text message",
                    voiceMessage: "Voice message",
                    imageMessage: "Image message",
                    titleForReference: "Title for reference",
                    typeTheTitle: "Enter the title",
                    typeTheMessage: "Type the message",
                    selectInOrderOfSubmission: "Select from submission sequence",
                    favoriteForMyUser: "Favorite for my user",
                    informationalMessageTitle: "<small>The title will appear above the text field within the conversation</small>",
                    informationalMessageInterval: "<small>Messages will be sent at intervals of 5 to 10 seconds according to the list sequence.</small>",
                    list: "List",
                    addMessage: "Add message",
                    clickToRecordTheAudio: "Click to record audio",
                    clickToSendTheImage: "Click to send the image",
                    readyScripts: "Ready scripts",
                    scriptInformationalMessage: "A script is a set of grouped messages that are sent in sequence to your customer with just one click!",
                    selectOrderSubmission: "Select from submission sequence",
                    toAdd: "Add",
                    messageSequence: "Message sequence",
                    apiResources: "API Resources",
                    seeDocumentation: "See Documentation 🚀",
                    configWebhook: "Configure Webhook",
                    bulkActions: "Bulk Actions",
                    apiResourceTextsChecks: "\n     ✅ Send Texts and Media <br>\n     ✅ Search Chat List <br>\n     ✅ Search Chat Messages <br>\n     ✅ Decrypt Message Media <br>\n     ✅ Check channel status <br>\n     ✅ Check if the number has WhatsApp <br>\n     ",
                    yourTokenForAcessingApiResources: "Your token to access API resources",
                    filterBySituation: "Filter by situation",
                    unprocessed: "UNPROCESSED",
                    processedWithError: "PROCESSED WITH ERROR",
                    successfullyProcessed: "PROCESSED SUCCESSFULLY",
                    filterBytype: "Filter by type",
                    texting: "TEXT SEND",
                    mediaUpload: "MEDIA UPLOAD",
                    checkNumber: "CHECK NUMBER",
                    checkChannel: "CHECK CHANNEL",
                    mediaDecryption: "MEDIA DECRYPTION",
                    searchChatList: "SEARCH CHATS LIST",
                    searchChatData: "SEARCH CHAT DATA",
                    searchChatMessages: "SEARCH CHAT MESSAGES",
                    webhookNotification: "WEBHOOK NOTIFICATION",
                    titleFilter: "Filter",
                    eventData: "Dt. event",
                    method: "Method",
                    resource: "Resource",
                    number: "Number",
                    processed: "Processed",
                    success: "Success",
                    resultObservation: "Observation result",
                    message: "Message",
                    average: "Average",
                    actions: "Actions",
                    gtpChatIntegrationTitle: "Integration with Chat-GPT",
                    gtpChatIntegrationMessage: "Enhance your WhatsApp with the powerful Chat-GPT ally! Gain useful features for tasks such as searches, translations, corrections or text formatting and even automatic answer suggestions.",
                    audioTranscriptionTitle: "Audio transcription",
                    audioTranscriptionMessage: "With this functionality it will be possible to transcribe audios into text in just 1 click, thus speeding up the customer service process.",
                    showHiddenMessages: "Show hidden messages",
                    showHiddenMessagesMessage: "With this option, all your WhatsApp messages will remain visible for audit purposes, this way it is possible to have access to single-view messages as well as those deleted by both the operator and the customer.",
                    integrationViaApi: "Integration via API",
                    integrationViaApiMessage: "Access resources via API to enable automation and integrations with other systems.",
                    integrationViaWebhook: "Integration via Webhook",
                    integrationViaWebhookMessage: "Receive real-time notifications about your system events via webhook and synchronize data with other platforms easily and securely.",
                    multipleAttendants: "Multiple attendants",
                    multipleAttendantsMessage: "Identify calls with each user's name.",
                    crmModuleTitle: "CRM Module",
                    crmModuleMessage: "Create a Kanban-style funnel and move cards (conversations) between lists.",
                    promptMessagesTitle: "Ready messages",
                    promptMessagesMessage: "Add personalized messages with (Voice, text and media) and send to your customer with just one click!",
                    transferByHashtagTitle: "Transfer (By hashtag)",
                    transferByHashtagMessage: "Set up default hashtags that, if mentioned in a conversation, the system will automatically move the card to a certain list.",
                    toSetUp: "SetUp",
                    transferNewServiceTitle: "Transfer (New service)",
                    transferNewServiceMessage: "Every time a service is started (The attendant appointment is added to the conversation), the card will be automatically moved to a certain list.",
                    transferByTimeTitle: "Transfer (By time)",
                    transferByTimeMessage: "Whenever the specified time arrives, the system will move all cards from one list to another list.",
                    eventDate: "Dt. event",
                    method: "Method",
                    resource: "Resource",
                    number: "Number",
                    processed: "Processed",
                    success: "Success",
                    resultObservation: "Observation result",
                    message: "Message",
                    average: "Average",
                    actions: "Actions",
                    scheduledDate: "Dt. scheduled",
                    type: "Type",
                    scheduled: "Scheduled",
                    failure: "Failed",
                    whatsapp: "WhatsApp",
                    toSign: "Sign",
                    performSignature: "Perform signature",
                    enterWhatsApp: "Enter the WhatsApp number you want to subscribe to",
                    next: "NEXT",
                    flat: "Flat",
                    selectAPlan: "Select a plan",
                    monthly: "Monthly",
                    basicPlan: "Basic plan BRL 99.90 month",
                    premiumPlan: "Premium plan BRL 199.90 month",
                    yearly: "Yearly",
                    connectedAs: "Connected as:",
                    changeDisplayName: "Change display name",
                    plansAndPrices: "Plans and prices",
                    selectTheLanguage: "Select the language",
                    contactUs: "Contact us",
                    disconnectFromThisUser: "Disconnect from this user",
                    version: "Version: ",
                    planBasic: "Basic Plan",
                    contentForWhomPlans: "For whom?",
                    contentMessagePlanBasic: "Ideal for a <b>single user</b> with unlimited access to CRM list creation, mass triggering, scheduled messages, metrics, tags and more.",
                    premiumPlan: "Premium Plan",
                    contentMessagePlanPremium: "Perfect for companies with <b>multiple employees</b> using the same WhatsApp.<br><br> And with access to <b>all the tool's features without any limitations</b>, all with real-time synchronization between collaborators.",
                    basic: "Basic",
                    premium: "Premium",
                    chatGptIntegration: "Integration with Chat-GPT",
                    audioTranscription: "Audio transcription",
                    api: "API",
                    webhook: "Webhook",
                    multipleUsers: "Multiple users",
                    loginWithPassword: "Login with password",
                    transferBetweenAttendants: "Transfer between attendants",
                    chatBetweenAttendants: "Chat between attendants",
                    showHiddenMessages: "Show hidden messages",
                    massShooting: "Mass shooting",
                    modeCrm: "CRM mode",
                    unlimitedTabsAndList: "Unlimited tabs and lists",
                    cannedMessagesAndScripts: "Canned messages and scripts",
                    scheduleMessageAndReminders: "Schedule messages and reminders",
                    hashtagTransfer: "Transfer by hashtag",
                    unlimitedFilters: "Unlimited filters",
                    planBasicInformationMessage: "Plan available for individual use of WhatsApp Web",
                    planPremiumInformationMessage: "Plan available for shared use of WhatsApp Web",
                    toSign: "Sign",
                    FREEplan: "FREE plan",
                    PREMIUMplan: "PREMIUM plan",
                    BASICplan: "BASIC plan",
                    youAreInThePlan: "You are in the plan",
                    FREE: "FREE",
                    BASIC: "BASIC",
                    TEST: "TEST",
                    PREMIUM: "PREMIUM",
                    withLimitedResources: "with limited resources",
                    howereInAPeriodOf: "however in a period of",
                    signUpForAPlanRightNow: "Sign up for a plan right now!",
                    SUBSCRIBETOPLAN: "» SUBSCRIBE TO PLAN",
                    talkToYourTeam: "Talk to your team",
                    serviceWillRestart: "Service will restart due to plan change! Wait...",
                    userNotFound: "User not found!",
                    serviceCarriedOutSuccessfully: "Service carried out successfully!",
                    channelNotFound: "Channel not found!",
                    expiredCredential: "Expired credential!",
                    failedToDisplay: "Failed to display!",
                    typeThePassword: "Type the password",
                    incorrectPassword: "Incorrect password!",
                    unregisteredUser: "Unregistered user!",
                    whatsappChannelNotRegistered: "WhatsApp channel not registered!",
                    failedToRegister: "Failed to register!",
                    startConversation: "Start conversation",
                    translate: "Translate",
                    notifications: "Notifications",
                    knowledgeBase: "Knowledge base",
                    changeLogs: "Change logs",
                    administrativePanel: "Administrative Panel",
                    yourCurrentPlan: "Your current plan",
                    exportContactsFromListSelectedCsv: "Export contacts from selected list (CSV)",
                    downloadContacts: "Download Contacts",
                    createBroadcast: "Create broadcast",
                    titleToSearchAdnRetrieveTheBroadcastLater: "Title to search and retrieve the broadcast later",
                    iWillNotSpam: "I will not SPAM",
                    saveList: "Save list",
                    createAndStartStreaming: "Create and start streaming",
                    jQueryContactsList: "jQuery Contacts List",
                    resetSortOrder: "Reset sort order",
                    searchAContact: "Search for a contact...",
                    id: "ID",
                    firstName: "Name",
                    lastName: "Last name",
                    email: "Email",
                    phone: "Phone",
                    address: "Address",
                    csv: "CSV",
                    exportCsv: "Export CSV",
                    csvInformationalMessage: "This is the CSV version of the contact database. It syncs with your contact database every time you open the popup.",
                    backToContactList: "Back to contact list",
                    copyCsvToClipboard: "Copy CSV to clipboard",
                    generalFilter: "General Filter",
                    filterByUser: "Filter by User",
                    tagFilter: "Filter by Tag",
                    registerNewConversation: "Register new conversation",
                    allsFilters: "All",
                    noResponseFromAttendant: "No response attendant",
                    noResponseFromClient: "No response client",
                    groupChats: "Group chats",
                    directChats: "Direct Chats",
                    unread: "Unread",
                    registerNewList: "New list",
                    suggest: "Suggest?",
                    "autoSuggestAnswers(Active)": "Auto suggest answers (Active)",
                    "autoSuggestAnswers(Inactive)": "Auto suggest answers (Inactive)",
                    freeSearch: "Free search",
                    textTranslation: "Text translation",
                    translate: "Translate",
                    translateThisTextIntoPortuguese: "Translate this text into Portuguese",
                    translateThisTextIntoEnglish: "Translate this text into English",
                    translateThisTextIntoSpanish: "Translate this text into Spanish",
                    makeYourTextMoreSummarized: "Make your text more summarized",
                    sumUp: "Summarize",
                    makeYourTextBigger: "Make your text bigger",
                    enlarge: "Enlarge",
                    makeYourTextClearer: "Make your text clearer",
                    ofCourse: "Of course",
                    makeYourTextMoreUserFriendly: "Make your text more friendly",
                    friendly: "Friendly",
                    makeYourTextMoreFormal: "Make your text more formal",
                    formal: "Formal",
                    correctSpellingError: "Correct spelling errors (pt-BR)",
                    orthography: "Spelling",
                    makeYourTextMoreDirect: "Make your text more direct",
                    direct: "Direct",
                    copilotAutoSuggestModeActived: "Copilot auto-suggest mode activated.",
                    help: "Help",
                    howCanThisHelpMeTitle: "How can this help me?",
                    helpMeMessage: "It allows you to <b>review, translate, search or even change the tone of a text</b> before sending it, thus making it easier to maintain <b>more effective communication</b> with your contacts.",
                    howToUseTitle: "How to use?",
                    howToUseSubtitle: "<b>There are 2 ways to use Copilot in your text box:</b>",
                    messageHowToUseOne: "<b>1st</b> Selecting a <b>part of the text</b> entered and clicking on one of the action buttons, when doing this Copilot will only process and replace this selected text <b>not affecting the rest of the content</b>",
                    messageHowToUseTwo: "<b>2nd</b> Just by clicking some of the options after writing something, when none of the text is selected, the <b>complete content</b> is processed and replaced according to the selected option.",
                    whatEachOfTheTitleFeaturesIsForTitle: "What is each of the features for?",
                    messageSuggest: "<b>- Suggest:</b> When activated, Copilot will suggest messages according to the context of the conversation.",
                    messageSearch: "<b>- Search:</b> This function does a free search and replaces with the result.",
                    spellingMessage: "<b>- Spelling:</b> This function corrects possible spelling errors (pt-BR exclusive).",
                    messageTranslatePt: "<b>- Translate:Portuguese:</b> Translates the text into Portuguese.",
                    messageTranslateEn: "<b>- Translate:English:</b> Translates the text into English.",
                    messageTranslateEs: "<b>- Translate:Spanish:</b> Translates the text into Spanish.",
                    messageSummarize: "<b>- Summarize:</b> Summarizes the text making it as short as possible, maintaining the same context.",
                    messageEnlarge: "<b>- Enlarge:</b> Makes the text larger, maintaining the same context.",
                    clearMessage: "<b>- Clear:</b> Makes the text as clear as possible.",
                    friendlyMessage: "<b>- Friendly:</b> Makes the text a little more friendly, changing some terms.",
                    formalMessage: "<b>- Formal:</b> Makes the text a little more formal, changing some terms.",
                    directMessage: "<b>- Direct:</b> Makes the text as direct as possible.",
                    areYouSureYouWantToDeleteThisList: "Are you sure you want to remove this list?",
                    messageDeleteList: "All cards that belong to this list will be finalized.",
                    yes: "Yes",
                    no: "No",
                    thisCardAlreadyBelongsToAList: "This card already belongs to a list",
                    moveCard: "Move card",
                    messageCardBelongsToAList: "",
                    toSave: "Save",
                    enterANewName: "Enter a new name",
                    messageFooter: "The name will be visible in all messages sent.",
                    invalidNumber: "Invalid number",
                    oops: "Oops!",
                    typeATitleForTheAudio: "Enter a title for the audio",
                    typeATitleForTheImage: "Enter a title for the image",
                    typeTheText: "Enter a text",
                    typeTheTitleReference: "Enter a reference title",
                    selectMoreThaOneMessage: "Select more than one message",
                    createdScript: "Created script",
                    sendItToYourCustomerWithJustOneClick: "Send to your customer with just one click!",
                    readyMessageAdded: "Ready message added",
                    areYouSureYouWantToRemoveThisMessage: "Are you sure you want to remove this message?",
                    copyJson: "copy json",
                    callDetails: "Call details",
                    executionDate: "Execution date",
                    processed: "Processed?",
                    success: "Success",
                    result: "Result: ",
                    processAgain: "Process again",
                    toDiscard: "Discard",
                    textSubmissionsAwaitingProcessing: "Text submissions awaiting processing:",
                    mediaSubmissionsAwaitingProcessing: "Media uploads awaiting processing:",
                    bulkActionsConfirmationMessage: 'This action will be applied to all "stuck" events.<br> When confirming it cannot be undone, as it is a <b>one-way operation!</b>',
                    processEverything: "Process everything",
                    discardEverything: "Discard everything",
                    accessAndDocumentation: "Access and Documentation",
                    resourcesNowAvailable: "Resources Now Available",
                    planLimitation: "Plan limitation",
                    informativeMessagePlans: "You have reached the 3 message limit",
                    viewPlans: "View plans",
                    multiAttendant: "Multi-Attendant",
                    messageSendQrCodeWpp: "Connect multiple agents to a single number with the Premium plan!",
                    iUnderstood: "Got it",
                    startNewChatMessage: "You can start a conversation with someone whose phone number is not saved in your contact list.",
                    receiveCare: "Receive care",
                    service: "Service: ",
                    transferredBy: "Transferred by",
                    accepted: "Accept",
                    acceptedAndOpen: "Accept and open",
                    refuse: "Refuse",
                    transferredService: "Service transferred",
                    messageServiceTransferred: "From now on, you are the new person responsible for this service!",
                    canceled: "Canceled",
                    serviceRefused: "Service refused",
                    transferService: "Transfer service",
                    messageTransferService: "The marking with the attendant's name will be changed to: ",
                    transfer: "Transfer",
                    messageAcceptService: "The user needs to accept this service!",
                    copilotTimeout: "Processing attempt failed, try again.",
                    titleInvalidOperation: "Invalid operation",
                    thisCardBelongsToTheList: "This card belongs to the list: ",
                    thisCardBelongsToTheListMessage: ". When moving, the flow of automations from the current list to this conversation will end.",
                    moveCard: "Move card",
                    unableToMoveToList: "Unable to move to list",
                    closeThisCard: "Close this card?",
                    messageCloseThisCard: "When closing this card, if you enter the value of the gain, it will be added to the dashboard metrics and linked to the user who started the flow of this card.",
                    end: "End!",
                    transmissionEnded: "Transmission ended! :)",
                    configureAllShippingParameters: "Configure all shipping parameters",
                    agreeToTermsOfUse: "Agree to terms of use",
                    selectMoreThanOneContact: "Select more than 1 contact!",
                    titleFlaws: "Problem number(s): ",
                    messageFailures: "Failed to add one or more numbers!",
                    titlePreSendMsgReady: "Confirm sending message: ",
                    hashtagAdded: "Hashtag added",
                    messageHashtagAdded: "Make sure to activate the module.",
                    titleExtensionUpdated: "Your extension has been <b>updated</b>",
                    titleSettingsWebhook: "Webhook configuration updated!",
                    titleRequestFailed: "Request failed",
                    messageRequestFailed: "This WhatsApp number is not registered!",
                    messageRequestFailedFooter: "Try again.",
                    titleRequestSent: "Request sent",
                    messageRequestSent: "Request that the person responsible for the cell phone (Manager) enter the panel and accept your request!",
                    messageRequestSentFooter: "You will automatically connect when your request is accepted by the person who has the cell phone in hand.",
                    titleNotice: "Notice",
                    titleRestrictedAccess: "Restricted access",
                    buttonCheckSignature: "Check signature",
                    titleServiceCompleted: "Service completed!",
                    messageServiceCompleted: "You have completed the service.",
                    titleCardClosed: "Card closed",
                    titleDisplayOfHiddenMessagesActivated: "Display of hidden messages activated!",
                    titleWebhookActivated: "Webhook module activated!",
                    titleHashtagTransferActivated: "Auto #hashtag transfer enabled!",
                    titleList: "List: ",
                    removedBy: "removed by ",
                    titleFailedToCreateSchedule: "Failed to create the schedule (cronAgendamento)",
                    titleScheduledCreatedSuccessfully: "Scheduling created successfully!",
                    titleRemoveSchedule: "Are you sure you want to remove this schedule?",
                    messageRemoveSchedule: "The flow will be terminated",
                    messageSendTo: "Message sent to: ",
                    messageFailedSendTo: "Failed to send the schedule to: ",
                    appoitmentDetails: "Appointment details",
                    name: "Name: ",
                    Date: "Date scheduling scheduling",
                    schedulingDate: "Scheduling date: ",
                    schedulingType: "Scheduling type: ",
                    situation: "Situation: ",
                    tryAgain: "Try again",
                    sendNow: "Send now",
                    premiumAccountLogin: "Premium account login",
                    enterYourLoginDetails: "Enter your login details",
                    iDontHaveALogin: "I don't have a login",
                    user: "User",
                    password: "Password",
                    toEnter: "Enter",
                    createUser: "Create user",
                    createLogin: "Create login",
                    messageCreateUser: "Request the administrator of this WhatsApp account to create your registration",
                    messageCreateUserFooter: "If you are the administrator just click: ",
                    titleDisconnectUser: "Do you want to disconnect from this user?",
                    disconnect: "Disconnect",
                    apiKeyOpenAiConfiguration: "API Key OpenAI",
                    enterYouurOpenAiApiKey: "Enter your OpenAI API key",
                    pasteYourKeyHere: "Paste your key here",
                    messageRequestFailedKeyApi: "This key is not valid!",
                    titleRequestSentKeyPApi: "Key added successfully!!",
                    messageRequestSentKeyApi: "You can now use the Chat-GPT module in your conversations.",
                    chatGptModuleNotConfigured: "Chat-GPT module not configured",
                    pleaseConfigureYourOpenAiApiKey: "Please configure your OpenAI API key",
                    insufficientFunds: "Insufficient funds",
                    messageInsufficientFunds: "Please access your account dashboard on the Open Ai website and add balance to continue...",
                    unableProcessYourRequest: "We are currently unable to process your request. Try again later...",
                    invalidKeyApi: "Invalid key API",
                    messageInvalidKeyApi: "The key you entered is invalid. Please check and try again.",
                    transcription: "Transcription",
                    transcribeAudioToText: "Transcribe audio to text",
                    webhooksConfiguration: "Webhooks Configuration",
                    messagesNotification: "Message notification",
                    pasteYourUrlHere: "Paste your URL here",
                    notificationConfiguration: "Notification configuration",
                    notifyReceivedMessages: "Notify received messages",
                    receivedMessages: "Messages received",
                    notifySentMessages: "Notify sent messages",
                    sentMessages: "Messages sent",
                    notifyDirectChatMessages: "Notify direct chat messages",
                    directChatMessages: "Direct chat messages",
                    notifyGroupMessages: "Notify group messages",
                    groupChat: "Group chat",
                    titleRemoveUser: "Are you sure you want to remove this user?",
                    agreeThatYouWillNotSpam: "I agree that I will not SPAM",
                    timeIsOver: "Time over",
                    messageGenerateNewRequestCode: "Click to generate new request code"
                }
            }
        }
        ,
        940: ()=>{
            window.wacore.user = {},
            window.wacore.user.variables = {
                status: null,
                cookie: null,
                username: null,
                name: null
            },
            window.wacore.user.callbacks = {
                login: function(e) {
                    if (!e.msg)
                        return;
                    let t = e.msg;
                    t.success && !t.error_password && t.data ? (window.wacore.user.functions.changeCookie(t.data.token),
                    window.wacore.user.functions.changeStatus(!0, t)) : window.wacore.user.modals.showLogin(!0, t.message, t.keyTranslate)
                }
            },
            window.wacore.user.requests = {
                login: function(e) {
                    let t = window.Store.Contact.get(window.Store.getMeUser()?._serialized)?.pushname
                      , a = {
                        sitechannel: wacore.sitechannel,
                        channel: wacore.channel,
                        name: t ?? wacore.sitechannel,
                        plan: currentPlan,
                        username: wacore.sitechannel
                    };
                    e ? (a.password = e.password,
                    a.username = e.username,
                    wacore.request.api_post("login_premium", "auth/account/", a, !0, null, !0)) : wacore.request.api_post("login_basic", "auth/account_basic/", a, !0, null, !0)
                }
            },
            window.wacore.user.modals = {
                showLogin: function(e, t, a="") {
                    Swal.fire({
                        icon: e ? "error" : "warning",
                        title: '<strong data-translate-key="premiumAccountLogin"></strong>',
                        showClass: {
                            popup: "animate__animated animate__fadeInDown"
                        },
                        hideClass: {
                            popup: "animate__animated animate__fadeOutUp"
                        },
                        html: `\n            <p style="margin-bottom:5px;"><b>WhatsApp ${window.wacore.function.setMask("+" + wacore.sitechannel)}</b></p>\n            <br><p style="color:${e ? "red" : "black"};"> ${e ? `<span data-translate-key=${a}></span>` : '<span data-translate-key="enterYourLoginDetails"></span>'}</p>\n            <input type="text" id="login-username" class="swal2-input" placeholder="" data-translate-key="user">\n            <input type="password" id="login-password" class="swal2-input" placeholder="" data-translate-key="password">`,
                        confirmButtonText: '<span data-translate-key="toEnter"></span>',
                        focusConfirm: !1,
                        showCancelButton: !0,
                        cancelButtonText: '<span data-translate-key="iDontHaveALogin"></span>',
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                        ,
                        preConfirm: ()=>{
                            const e = Swal.getPopup().querySelector("#login-username").value
                              , t = Swal.getPopup().querySelector("#login-password").value;
                            return e ? t ? {
                                username: e,
                                password: t
                            } : (Swal.showValidationMessage("Preencha o campo senha!"),
                            !1) : (Swal.showValidationMessage("Preencha o campo usuário!"),
                            !1)
                        }
                    }).then((e=>{
                        e.isConfirmed ? window.wacore.user.requests.login(e.value) : window.wacore.user.modals.showNewUser()
                    }
                    ))
                },
                showNewUser: function() {
                    Swal.fire({
                        title: '<strong data-translate-key="createUser"></strong>',
                        allowOutsideClick: !1,
                        allowEscapeKey: !1,
                        showLoaderOnConfirm: !0,
                        confirmButtonText: '<span data-translate-key="toGoBack"></span>',
                        showCancelButton: !0,
                        cancelButtonText: '<span data-translate-key="createLogin"></span>',
                        html: `<p style="margin-bottom:5px;"><b>WhatsApp ${window.wacore.function.setMask("+" + wacore.sitechannel)}</b></p> \n            <br><p style="color:black;"> <span data-translate-key="messageCreateUser"></span></p>`,
                        footer: '<h6><span data-translate-key="messageCreateUserFooter"></span> <b><span data-translate-key="createLogin"></span></b></h6>',
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((e=>{
                        e.isConfirmed ? window.wacore.user.modals.showLogin() : window.open(`${window.infoWl.panelUrl}/login?language=${localStorage.getItem("painel:language") || "en"}`, "_blank")
                    }
                    ))
                }
            },
            window.wacore.user.functions = {
                changeUserName: async function() {
                    if ("premium" == currentPlan || "basic" == currentPlan) {
                        const {value: e} = await Swal.fire({
                            title: '<strong data-translate-key="editDisplayName"></strong>',
                            icon: "warning",
                            confirmButtonText: '<span data-translate-key="toSave"></span>',
                            footer: '<center data-translate-key="messageFooter"></center>',
                            html: `\n                <p style="color: #089676;"><strong>${wacore.user.variables.name}</strong></p>\n                <input type="text" class="swal2-input w-100 m-auto" data-translate-key="enterANewName" style="display: flex;" placeholder=""></input>`,
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                            ,
                            preConfirm: ()=>[document.querySelector(".swal2-input").value]
                        });
                        e && ("premium" == currentPlan || "basic" == currentPlan ? ("premium" == currentPlan && wacore.fetch.requestChangeName({
                            name: e
                        }),
                        "basic" == currentPlan && window.localStorage.setItem("wapp:name", e),
                        document.querySelectorAll(".user_name_span").forEach((t=>{
                            t.innerHTML = e
                        }
                        )),
                        wacore.user.variables.name = e) : window.wacore.function.modal_plan("Recurso disponível apenas para os planos: Basic ou Premium"))
                    } else
                        window.wacore.function.modal_plan("Recurso disponível apenas para os planos: Basic ou Premium")
                },
                checkAccountStatus: function() {
                    "free" == currentPlan || "basic" == currentPlan || "premium" == currentPlan && 0 == usersCount ? wacore.user.variables.cookie ? wacore.fetch.requestAccountStatus() : (window.wacore.user.requests.login(),
                    window.wacore.user.functions.changeStatus(!1)) : "premium" == currentPlan && usersCount > 0 && (wacore.user.variables.cookie ? wacore.fetch.requestAccountStatus() : (wacore.channel && window.wacore.user.modals.showLogin(),
                    window.wacore.user.functions.changeStatus(!1)))
                },
                changeCookie: function(e) {
                    e ? (wacore.request.storageCookie("set", e),
                    wacore.user.variables.cookie = e) : (wacore.user.variables.cookie = null,
                    wacore.request.storageCookie("set", null))
                },
                changeStatus: async function(e, t) {
                    if (wacore.status = !0,
                    e) {
                        try {
                            document.getElementById("btn-crm").disabled = !1,
                            document.getElementById("btn-api").disabled = !1,
                            document.getElementById("btn-metricas").disabled = !1,
                            document.getElementById("btn-agendamentos").disabled = !1,
                            document.getElementById("btn-disparo-massa").disabled = !1,
                            document.getElementById("btn-msg-fav").disabled = !1,
                            document.getElementById("btn-modulos").disabled = !1
                        } catch (e) {
                            console.log(e)
                        }
                        if (!wacore.user.variables.status) {
                            wacore.user.variables.status = e,
                            document.querySelector('[data-testid="alert-update"]') && document.querySelector('[data-testid="alert-update"]').parentElement && document.querySelector('[data-testid="alert-update"]').parentElement.parentElement && document.querySelector('[data-testid="alert-update"]').parentElement.parentElement.remove(),
                            $(".closedPopup").remove(),
                            wacore.user.variables.username = t.data.user.username,
                            window.localStorage.setItem("wapp:username", wacore.user.variables.username);
                            var a = wacore.sitechannel
                              , n = wacore.user.variables.username;
                            wacore.toRequest("req_websocket", {
                                channel: a,
                                username: n
                            }),
                            "premium" == currentPlan && (usersCount > 0 ? (wacore.attributes = t.data?.user?.attributes,
                            document.querySelectorAll(".btnattr").forEach((function(e) {
                                e.getAttribute("data-title") && (window.wacore.attributes.filter((t=>t.title == e.getAttribute("data-title")))[0]?.checked ? e.style.display = "block" : e.style.display = "none")
                            }
                            ))) : (document.querySelectorAll(".utrak-link").forEach((function(e) {
                                e.style.display = "block"
                            }
                            )),
                            document.querySelectorAll(".utrak-link-solo").forEach((function(e) {
                                e.style.display = "block"
                            }
                            ))),
                            t.data.user.name ? (document.querySelectorAll(".user_name_span").forEach((e=>{
                                e.innerHTML = t.data.user.name
                            }
                            )),
                            wacore.user.variables.name = t.data.user.name) : await window.wacore.user.functions.changeUserName()),
                            "basic" == currentPlan && (document.querySelectorAll(".utrak-link").forEach((function(e) {
                                e.style.display = "block"
                            }
                            )),
                            document.querySelectorAll(".utrak-link-solo").forEach((function(e) {
                                e.style.display = "block"
                            }
                            )),
                            window.localStorage.getItem("wapp:name") ? (document.querySelectorAll(".user_name_span").forEach((e=>{
                                e.innerHTML = window.localStorage.getItem("wapp:name")
                            }
                            )),
                            wacore.user.variables.name = window.localStorage.getItem("wapp:name")) : await window.wacore.user.functions.changeUserName()),
                            "free" == currentPlan && (document.querySelectorAll(".utrak-link").forEach((function(e) {
                                e.style.display = "block"
                            }
                            )),
                            document.querySelectorAll(".utrak-link-solo").forEach((function(e) {
                                e.style.display = "block"
                            }
                            )),
                            document.querySelectorAll(".user_name_span").forEach((e=>{
                                e.innerHTML = t.data.user.name
                            }
                            )),
                            wacore.user.variables.name = t.data.user.name),
                            null != document.getElementById("side") ? (document.querySelector("#login-class").innerHTML = `\n                    <div title="" data-translate-key="signature" style="text-align: center;">\n                        <div class="menu-tooltip mb-3" onclick="window.wacore.function.assinar()">\n                            <div class="server invite">\n                                ${window.wacore.svgs.wallet(28, 28, "")}\n                            </div>\n                        </div>\n                    </div>\n\n                    <div style="text-align: center;">\n                        <hr class="server-divider">\n                        <div class="container dropdown" style="display: flex;justify-content: center;">\n                            <div class="btn btn-primary" \n                            title="" data-translate-key="settings"\n                            data-bs-toggle="dropdown" aria-expanded="false">\n                                ${window.wacore.svgs.menu_config(28, 28, "")}\n                                <ul\n                                class="dropdown-menu dropdown-menu-dark text-small shadow"\n                                aria-labelledby="meumenu">\n                                    <div class="text-white p-2 text-center"><span data-translate-key="connectedAs"></span><br>\n                                    ${window.wacore.user.variables.username}\n                                    </div>\n\n                                    <li><hr class="dropdown-divider"></li> \n                                    <li><a class="dropdown-item" onclick="window.wacore.user.functions.changeUserName(); window.wacore.format_translation.translateText()" data-translate-key="changeDisplayName"> </a></li>\n                                    <li><a class="dropdown-item" onclick="window.wacore.function.planos()" data-translate-key="plansAndPrices"></a></li>\n                                    <li><a class="dropdown-item" onclick="window.wacore.function.assinar()" data-translate-key="signature"></a></li>\n\n                                    <li><hr class="dropdown-divider"></li> \n                                    <li><hr class="dropdown-divider"></li> \n\n                                    <li><a class="dropdown-item" onclick="window.wacore.function.faleconosco()" data-translate-key="contactUs"></a></li>\n                                    \n                                    ${"premium" == currentPlan && usersCount > 0 ? '<li><hr class="dropdown-divider"></li><li><div class="dropdown-item" role="button" id="bt-desconectar-sessao" data-translate-key="disconnectFromThisUser"> </div></li>' : ""}  \n                                    \n                                    <li><hr class="dropdown-divider"></li> \n                                    \n                                    <div class="text-white text-center" style="font-weight: 900;font-size: smaller;"><span data-translate-key="version"></span> ${window.infoWl.version}</div>\n                                </ul>\n                            </div>\n                        </div>\n                    </div>`,
                            $("#bt-desconectar-sessao").click((function() {
                                Swal.fire({
                                    title: '<strong data-translate-key="titleDisconnectUser"></strong>',
                                    showCancelButton: !0,
                                    confirmButtonText: '<span data-translate-key="disconnect"></span>',
                                    cancelButtonText: '<span data-translate-key="cancel"></span>',
                                    didOpen: ()=>{
                                        window.wacore.format_translation.translateText()
                                    }
                                }).then((async e=>{
                                    e.isConfirmed && setTimeout((function(e) {
                                        window.wacore.user.functions.logout()
                                    }
                                    ), 500)
                                }
                                ))
                            }
                            )),
                            window.wacore.format_translation.translateText()) : document.querySelector("#login-class") && (document.querySelector("#login-class").innerHTML = "")
                        }
                        window.wacore.crm.startChat(!0)
                    } else
                        null != document.getElementById("side") && (document.querySelector("#login-class").innerHTML = `\n                <div style="text-align: center;"> \n                    <div class="dropdown">\n                        <div class="btn btn-primary"  data-bs-toggle="dropdown" aria-expanded="false" style="background-color:transparent !important;">\n                            <div class="server invite">\n                                ${window.wacore.svgs.menu_config(28, 28, "")}\n                            </div>\n                            <ul class="dropdown-menu dropdown-menu-dark text-small shadow">\n                                <li><hr class="dropdown-divider"></li>\n                                <li><a class="dropdown-item nav__link" href="javascript:void(0)" onclick="window.wacore.user.modals.showLogin()"> Cadastre-se</a></li>\n                            </ul>\n                        </div>\n                    </div>\n                \n                    <hr class="server-divider">\n\n                    <div class="container">\n                        <div class="btn btn-primary" role="button" onclick="window.wacore.user.modals.showLogin()"><svg xmlns="http://www.w3.org/2000/svg" class="svg-ib " width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg> </div>\n                    </div>\n                </div>`);
                    document.querySelectorAll(".bt-openlink").forEach((function(e) {
                        e.addEventListener("click", (function(e) {
                            window.open(e.currentTarget.getAttribute("data-url"), "_blank")
                        }
                        ))
                    }
                    ))
                },
                logout: function() {
                    window.wacore.user.functions.changeStatus(!1),
                    window.wacore.user.functions.changeCookie(!1),
                    setTimeout((function() {
                        window.location.reload()
                    }
                    ), 1e3)
                }
            }
        }
        ,
        69: ()=>{
            window.wacore = {},
            window.wacore.status = !1,
            window.wacore.channel = null,
            window.wacore.activeChat = null,
            window.wacore.users = [],
            window.wacore.recentChats = [],
            window.wacore.config = {
                msgDeleted: !1
            },
            window.EvoCalendar,
            window.wacore.curFilter = {
                action: "renderSystemTab",
                type: "system",
                filterValue: "tab_all",
                name: "allsFilters"
            },
            window.wacore.maskList = [{
                code: "+247 ####"
            }, {
                code: "+290 ####"
            }, {
                code: "+290 ####"
            }, {
                code: "+683 ####"
            }, {
                code: "+690 ####"
            }, {
                code: "+500 #####"
            }, {
                code: "+676 #####"
            }, {
                code: "+677 #####"
            }, {
                code: "+678 #####"
            }, {
                code: "+688 2####"
            }, {
                code: "+49 ### ###"
            }, {
                code: "+682 ## ###"
            }, {
                code: "+686 ## ###"
            }, {
                code: "+688 90####"
            }, {
                code: "+95 ### ###"
            }, {
                code: "+298 ### ###"
            }, {
                code: "+376 ### ###"
            }, {
                code: "+387 ## ####"
            }, {
                code: "+508 ## ####"
            }, {
                code: "+597 ### ###"
            }, {
                code: "+672 1## ###"
            }, {
                code: "+672 3## ###"
            }, {
                code: "+681 ## ####"
            }, {
                code: "+685 ## ####"
            }, {
                code: "+687 ## ####"
            }, {
                code: "+850 ### ###"
            }, {
                code: "+230 ### ####"
            }, {
                code: "+239 ## #####"
            }, {
                code: "+245 # ######"
            }, {
                code: "+246 ### ####"
            }, {
                code: "+263 # ######"
            }, {
                code: "+269 ## #####"
            }, {
                code: "+297 ### ####"
            }, {
                code: "+299 ## ## ##"
            }, {
                code: "+354 ### ####"
            }, {
                code: "+372 ### ####"
            }, {
                code: "+387 ## #####"
            }, {
                code: "+49 ### ## ##"
            }, {
                code: "+501 ### ####"
            }, {
                code: "+507 ### ####"
            }, {
                code: "+592 ### ####"
            }, {
                code: "+597 ### ####"
            }, {
                code: "+599 ### ####"
            }, {
                code: "+599 ### ####"
            }, {
                code: "+599 ### ####"
            }, {
                code: "+60 # ### ###"
            }, {
                code: "+62 ## ### ##"
            }, {
                code: "+65 #### ####"
            }, {
                code: "+670 ### ####"
            }, {
                code: "+673 ### ####"
            }, {
                code: "+674 ### ####"
            }, {
                code: "+677 ### ####"
            }, {
                code: "+678 ## #####"
            }, {
                code: "+679 ## #####"
            }, {
                code: "+680 ### ####"
            }, {
                code: "+689 ## ## ##"
            }, {
                code: "+691 ### ####"
            }, {
                code: "+692 ### ####"
            }, {
                code: "+95 # ### ###"
            }, {
                code: "+960 ### ####"
            }, {
                code: "+220 ### ## ##"
            }, {
                code: "+232 ## ######"
            }, {
                code: "+234 ## ### ##"
            }, {
                code: "+237 #### ####"
            }, {
                code: "+238 ### ## ##"
            }, {
                code: "+248 # ### ###"
            }, {
                code: "+252 # ### ###"
            }, {
                code: "+252 # ### ###"
            }, {
                code: "+265 1 ### ###"
            }, {
                code: "+291 # ### ###"
            }, {
                code: "+350 ### #####"
            }, {
                code: "+356 #### ####"
            }, {
                code: "+372 #### ####"
            }, {
                code: "+373 #### ####"
            }, {
                code: "+47 ### ## ###"
            }, {
                code: "+49 ### ## ###"
            }, {
                code: "+504 #### ####"
            }, {
                code: "+505 #### ####"
            }, {
                code: "+506 #### ####"
            }, {
                code: "+52 ## ## ####"
            }, {
                code: "+53 # ### ####"
            }, {
                code: "+599 9### ####"
            }, {
                code: "+60 ## ### ###"
            }, {
                code: "+62 ## ### ###"
            }, {
                code: "+64 ## ### ###"
            }, {
                code: "+66 ## ### ###"
            }, {
                code: "+670 77# #####"
            }, {
                code: "+670 78# #####"
            }, {
                code: "+850 #### ####"
            }, {
                code: "+852 #### ####"
            }, {
                code: "+853 #### ####"
            }, {
                code: "+886 #### ####"
            }, {
                code: "+95 ## ### ###"
            }, {
                code: "+961 # ### ###"
            }, {
                code: "+965 #### ####"
            }, {
                code: "+967 # ### ###"
            }, {
                code: "+973 #### ####"
            }, {
                code: "+974 #### ####"
            }, {
                code: "+975 # ### ###"
            }, {
                code: "+1 ### ### ####"
            }, {
                code: "+1 242 ### ####"
            }, {
                code: "+1 246 ### ####"
            }, {
                code: "+1 264 ### ####"
            }, {
                code: "+1 268 ### ####"
            }, {
                code: "+1 284 ### ####"
            }, {
                code: "+1 340 ### ####"
            }, {
                code: "+1 345 ### ####"
            }, {
                code: "+1 441 ### ####"
            }, {
                code: "+1 473 ### ####"
            }, {
                code: "+1 649 ### ####"
            }, {
                code: "+1 664 ### ####"
            }, {
                code: "+1 670 ### ####"
            }, {
                code: "+1 671 ### ####"
            }, {
                code: "+1 684 ### ####"
            }, {
                code: "+1 721 ### ####"
            }, {
                code: "+1 758 ### ####"
            }, {
                code: "+1 767 ### ####"
            }, {
                code: "+1 784 ### ####"
            }, {
                code: "+1 809 ### ####"
            }, {
                code: "+1 829 ### ####"
            }, {
                code: "+1 849 ### ####"
            }, {
                code: "+1 868 ### ####"
            }, {
                code: "+1 869 ### ####"
            }, {
                code: "+1 876 ### ####"
            }, {
                code: "+216 ## ### ###"
            }, {
                code: "+218 ## ### ###"
            }, {
                code: "+222 ## ## ####"
            }, {
                code: "+223 ## ## ####"
            }, {
                code: "+224 ## ### ###"
            }, {
                code: "+225 ## ### ###"
            }, {
                code: "+226 ## ## ####"
            }, {
                code: "+227 ## ## ####"
            }, {
                code: "+228 ## ### ###"
            }, {
                code: "+229 ## ## ####"
            }, {
                code: "+231 ## ### ###"
            }, {
                code: "+234 ## ### ###"
            }, {
                code: "+236 ## ## ####"
            }, {
                code: "+241 # ## ## ##"
            }, {
                code: "+252 ## ### ###"
            }, {
                code: "+254 ### ######"
            }, {
                code: "+257 ## ## ####"
            }, {
                code: "+258 ## ### ###"
            }, {
                code: "+262 ##### ####"
            }, {
                code: "+262 ##### ####"
            }, {
                code: "+266 # ### ####"
            }, {
                code: "+267 ## ### ###"
            }, {
                code: "+268 ## ## ####"
            }, {
                code: "+27 ## ### ####"
            }, {
                code: "+31 ## ### ####"
            }, {
                code: "+32 ### ### ###"
            }, {
                code: "+33 ### ### ###"
            }, {
                code: "+34 ### ### ###"
            }, {
                code: "+357 ## ### ###"
            }, {
                code: "+36 ### ### ###"
            }, {
                code: "+370 ### ## ###"
            }, {
                code: "+371 ## ### ###"
            }, {
                code: "+374 ## ### ###"
            }, {
                code: "+377 ## ### ###"
            }, {
                code: "+382 ## ### ###"
            }, {
                code: "+385 ## ### ###"
            }, {
                code: "+386 ## ### ###"
            }, {
                code: "+389 ## ### ###"
            }, {
                code: "+39 6 698 #####"
            }, {
                code: "+40 ## ### ####"
            }, {
                code: "+41 ## ### ####"
            }, {
                code: "+45 ## ## ## ##"
            }, {
                code: "+46 ## ### ####"
            }, {
                code: "+48 ### ### ###"
            }, {
                code: "+49 ### ## ####"
            }, {
                code: "+502 # ### ####"
            }, {
                code: "+503 ## ## ####"
            }, {
                code: "+509 ## ## ####"
            }, {
                code: "+51 ### ### ###"
            }, {
                code: "+56 # #### ####"
            }, {
                code: "+591 # ### ####"
            }, {
                code: "+593 # ### ####"
            }, {
                code: "+594 ##### ####"
            }, {
                code: "+60 ## ### ####"
            }, {
                code: "+60 ### ### ###"
            }, {
                code: "+61 # #### ####"
            }, {
                code: "+62 ## ### ####"
            }, {
                code: "+62 8## ### ###"
            }, {
                code: "+64 ### ### ###"
            }, {
                code: "+66 ## ### ####"
            }, {
                code: "+675 ### ## ###"
            }, {
                code: "+81 ### ### ###"
            }, {
                code: "+82 ## ### ####"
            }, {
                code: "+84 ## #### ###"
            }, {
                code: "+850 ## ### ###"
            }, {
                code: "+855 ## ### ###"
            }, {
                code: "+856 ## ### ###"
            }, {
                code: "+880 ## ### ###"
            }, {
                code: "+93 ## ### ####"
            }, {
                code: "+94 ## ### ####"
            }, {
                code: "+961 ## ### ###"
            }, {
                code: "+966 # ### ####"
            }, {
                code: "+967 ## ### ###"
            }, {
                code: "+968 ## ### ###"
            }, {
                code: "+971 # ### ####"
            }, {
                code: "+972 # ### ####"
            }, {
                code: "+975 17 ### ###"
            }, {
                code: "+976 ## ## ####"
            }, {
                code: "+977 ## ### ###"
            }, {
                code: "+993 # ### ####"
            }, {
                code: "+20 ### ### ####"
            }, {
                code: "+211 ## ### ####"
            }, {
                code: "+212 ## #### ###"
            }, {
                code: "+213 ## ### ####"
            }, {
                code: "+218 21 ### ####"
            }, {
                code: "+221 ## ### ####"
            }, {
                code: "+233 ### ### ###"
            }, {
                code: "+235 ## ## ## ##"
            }, {
                code: "+240 ## ### ####"
            }, {
                code: "+242 ## ### ####"
            }, {
                code: "+243 ### ### ###"
            }, {
                code: "+244 ### ### ###"
            }, {
                code: "+249 ## ### ####"
            }, {
                code: "+250 ### ### ###"
            }, {
                code: "+251 ## ### ####"
            }, {
                code: "+253 ## ## ## ##"
            }, {
                code: "+255 ## ### ####"
            }, {
                code: "+256 ### ### ###"
            }, {
                code: "+260 ## ### ####"
            }, {
                code: "+261 ## ## #####"
            }, {
                code: "+264 ## ### ####"
            }, {
                code: "+265 # #### ####"
            }, {
                code: "+30 ### ### ####"
            }, {
                code: "+351 ## ### ####"
            }, {
                code: "+352 ### ### ###"
            }, {
                code: "+353 ### ### ###"
            }, {
                code: "+355 ### ### ###"
            }, {
                code: "+359 ### ### ###"
            }, {
                code: "+377 ### ### ###"
            }, {
                code: "+378 #### ######"
            }, {
                code: "+381 ## ### ####"
            }, {
                code: "+39 ### #### ###"
            }, {
                code: "+420 ### ### ###"
            }, {
                code: "+421 ### ### ###"
            }, {
                code: "+43 ### ### ####"
            }, {
                code: "+44 ## #### ####"
            }, {
                code: "+49 ### ### ####"
            }, {
                code: "+52 ### ### ####"
            }, {
                code: "+54 ### ### ####"
            }, {
                code: "+57 ### ### ####"
            }, {
                code: "+58 ### ### ####"
            }, {
                code: "+590 ### ### ###"
            }, {
                code: "+593 ## ### ####"
            }, {
                code: "+595 ### ### ###"
            }, {
                code: "+598 # ### ## ##"
            }, {
                code: "+62 8## ### ####"
            }, {
                code: "+63 ### ### ####"
            }, {
                code: "+64 ### ### ####"
            }, {
                code: "+7 ### ### ## ##"
            }, {
                code: "+7 6## ### ## ##"
            }, {
                code: "+7 7## ### ## ##"
            }, {
                code: "+81 ## #### ####"
            }, {
                code: "+84 ### #### ###"
            }, {
                code: "+86 ### #### ###"
            }, {
                code: "+886 # #### ####"
            }, {
                code: "+90 ### ### ####"
            }, {
                code: "+91 #### ### ###"
            }, {
                code: "+92 ### ### ####"
            }, {
                code: "+962 # #### ####"
            }, {
                code: "+963 ## #### ###"
            }, {
                code: "+966 5 #### ####"
            }, {
                code: "+967 ### ### ###"
            }, {
                code: "+970 ## ### ####"
            }, {
                code: "+971 5# ### ####"
            }, {
                code: "+972 5# ### ####"
            }, {
                code: "+98 ### ### ####"
            }, {
                code: "+992 ## ### ####"
            }, {
                code: "+995 ### ### ###"
            }, {
                code: "+996 ### ### ###"
            }, {
                code: "+998 ## ### ####"
            }, {
                code: "+234 ### ### ####"
            }, {
                code: "+234 ### ### ####"
            }, {
                code: "+375 ## ### ## ##"
            }, {
                code: "+380 ## ### ## ##"
            }, {
                code: "+423 ### ### ####"
            }, {
                code: "+49 #### ### ####"
            }, {
                code: "+55 ## #########"
            }, {
                code: "+596 ### ## ## ##"
            }, {
                code: "+850 ### #### ###"
            }, {
                code: "+850 191 ### ####"
            }, {
                code: "+856 20## ### ###"
            }, {
                code: "+86 ### #### ####"
            }, {
                code: "+964 ### ### ####"
            }, {
                code: "+994 ## ### ## ##"
            }, {
                code: "+358 ### ### ## ##"
            }, {
                code: "+62 8## ### ## ###"
            }, {
                code: "+86 ## ##### #####"
            }, {
                code: "+850 #### #############"
            }]
        }
        ,
        987: ()=>{
            window.wacore.webhook = {},
            window.wacore.webhook.config = {
                active: !0,
                message: {
                    endpoint: "",
                    sent: !0,
                    received: !0,
                    chat: !0,
                    group: !0
                }
            },
            window.wacore.webhook.variables = {},
            window.wacore.webhook.requests = {
                setConfigWebhook: function() {
                    window.wacore.webhook.config.message.endpoint = document.getElementById("webhook-endpoint")?.value ?? "",
                    window.wacore.webhook.config.message.sent = document.getElementById("input_msg_sent")?.checked ?? !0,
                    window.wacore.webhook.config.message.received = document.getElementById("input_msg_received")?.checked ?? !0,
                    window.wacore.webhook.config.message.chat = document.getElementById("input_msg_chat")?.checked ?? !0,
                    window.wacore.webhook.config.message.group = document.getElementById("input_msg_group")?.checked ?? !0,
                    wacore.request.api_post("set_webhook", "channel/set-webhook", {
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel,
                        endpoint: window.wacore.webhook.config.message.endpoint,
                        sent: window.wacore.webhook.config.message.sent,
                        received: window.wacore.webhook.config.message.received,
                        chat: window.wacore.webhook.config.message.chat,
                        group: window.wacore.webhook.config.message.group
                    }, !0, wacore.user.variables.cookie)
                },
                setStatusWebhook: function(e) {
                    wacore.request.api_post("modulo_webhook", "channel/set-webhook-status", {
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel,
                        status: e
                    }, !0, wacore.user.variables.cookie)
                },
                webhookNotification: function(e, t) {
                    wacore.request.api_post("notify_webhook", "channel/notify-webhook", {
                        channel: wacore.channel,
                        sitechannel: wacore.sitechannel,
                        id: e,
                        message: JSON.stringify(t)
                    }, !0, wacore.user.variables.cookie)
                }
            },
            window.wacore.webhook.modals = {
                showWebHookConfig: function() {
                    Swal.fire({
                        title: '<strong data-translate-key="webhooksConfiguration"></strong>',
                        html: `<b data-translate-key="messagesNotification"></b>\n                <input type="text" id="webhook-endpoint" class="swal2-input" placeholder="" data-translate-key="pasteYourUrlHere" style="width:80%" value="${window.wacore.webhook.config.message.endpoint}">\n                <br><br><h6 data-translate-key="notificationConfiguration"></h6>\n                <div class="d-inline-flex small ml-1">\n                    <div title="" data-translate-key="notifyReceivedMessages" class="form-check mr-1" style="min-width: fit-content;">\n                        <input class="form-check-input mr-1" type="checkbox" ${window.wacore.webhook.config.message.received ? "checked" : ""} id="input_msg_received">\n                        <label class="form-check-label" for="input_msg_received" data-translate-key="receivedMessages"></label>\n                    </div>\n                    <div title="" data-translate-key="notifySentMessages" class="form-check mr-1" style="min-width: fit-content;">\n                        <input class="form-check-input mr-1" type="checkbox" ${window.wacore.webhook.config.message.sent ? "checked" : ""} id="input_msg_sent">\n                        <label class="form-check-label" for="input_msg_sent" data-translate-key="sentMessages"></label>\n                    </div>\n                    <div title="" data-translate-key="notifyDirectChatMessages" class="form-check mr-1" style="min-width: fit-content;">\n                        <input class="form-check-input mr-1" type="checkbox" ${window.wacore.webhook.config.message.chat ? "checked" : ""} id="input_msg_chat">\n                        <label class="form-check-label" for="input_msg_chat" data-translate-key="directChatMessages"></label>\n                    </div>\n                    <div title="" data-translate-key="notifyGroupMessages" class="form-check mr-1" style="min-width: fit-content;">\n                        <input class="form-check-input mr-1" type="checkbox" ${window.wacore.webhook.config.message.group ? "checked" : ""} id="input_msg_group">\n                        <label class="form-check-label" for="input_msg_group" data-translate-key="groupChat"></label>\n                    </div>\n                </div>\n            <br>`,
                        showCloseButton: !0,
                        showCancelButton: !1,
                        showConfirmButton: !0,
                        confirmButtonText: '<span data-translate-key="toRecord"></span>',
                        focusConfirm: !1,
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    }).then((e=>{
                        e.isConfirmed && window.wacore.webhook.requests.setConfigWebhook()
                    }
                    ))
                }
            },
            window.wacore.webhook.functions = {
                newMessageNotification: async function(e) {
                    try {
                        if ("premium" == currentPlan && window.wacore.webhook.config.active && window.wacore.webhook.config.message.endpoint) {
                            var t = window.wacore.whatsapp.serializeMessageObj(e);
                            if (t) {
                                if (t.fromMe && !window.wacore.webhook.config.message.sent)
                                    return;
                                if (!t.fromMe && !window.wacore.webhook.config.message.received)
                                    return;
                                if (t.chat.isGroup && !window.wacore.webhook.config.message.group)
                                    return;
                                if (!t.chat.isGroup && !window.wacore.webhook.config.message.chat)
                                    return;
                                await window.wacore.webhook.requests.webhookNotification(t.id._serialized, t)
                            }
                        }
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }
        ,
        994: ()=>{
            window.wacore.whatsapp = {
                login: !1,
                getFilteredUnreadCount: function() {
                    try {
                        var e = window.Store.Chat._models.filter((e=>e.unreadCount && e.unreadCount > 0 && !e.archive)).map((e=>e.unreadCount));
                        if (!e || 0 == e.length)
                            return 0;
                        const t = (e,t)=>e + t;
                        return e.reduce(t)
                    } catch (e) {
                        console.log(e)
                    }
                },
                syncEarlyMessagesFromChat: async function(e) {
                    const t = await window.wacore.whatsapp.sendExist(e);
                    for (; !t.msgs.msgLoadState.noEarlierMsgs; )
                        await window.Store.ConversationMsgs.loadEarlierMsgs(t);
                    return !0
                },
                getMessagesFromChatId: e=>Store.Msg._models.filter((t=>t.id.remote._serialized == e && "remove" !== t)),
                getChatById: function(e) {
                    return Store.Chat._models.find((t=>t.id._serialized == e))
                },
                getContactById: function(e) {
                    return Store.Contact._models.find((t=>t.id._serialized == e))
                },
                serializeMessageObj: function(e) {
                    return null == e ? null : {
                        id: e.id,
                        from: e.from._serialized,
                        quotedParticipant: e.quotedParticipant && e.quotedParticipant._serialized ? e.quotedParticipant._serialized : void 0,
                        author: e.author && e.author._serialized ? e.author._serialized : void 0,
                        to: e.to && e.to._serialized ? e.to._serialized : void 0,
                        fromMe: e.id.fromMe,
                        sender: e.senderObj ? window.wacore.whatsapp.serializeContactObj(e.senderObj) : null,
                        timestamp: e.t,
                        content: e.body,
                        isGroupMsg: e.isGroupMsg,
                        isLink: e.isLink,
                        isMMS: e.isMMS,
                        isMedia: e.isMedia,
                        isNotification: e.isNotification,
                        isPSA: e.isPSA,
                        type: e.type,
                        chatId: e.id.remote,
                        chat: window.wacore.whatsapp.serializeChatObj(window.wacore.whatsapp.getChatById(e.id.remote)),
                        quotedMsgObj: window.wacore.whatsapp.serializeMessageObj(e._quotedMsgObj),
                        mediaData: window.window.wacore.whatsapp.serializeMediaData(e)
                    }
                },
                serializeMediaData: function(e) {
                    if (null == e)
                        return null;
                    let t = window.window.wacore.whatsapp.serializeRawObj(e.mediaData);
                    return {
                        type: e.type,
                        mimetype: e.mimetype,
                        caption: t?.caption,
                        filename: e.filename,
                        deprecatedMms3Url: e.deprecatedMms3Url,
                        directPath: e.directPath,
                        filehash: e.filehash,
                        mediaKey: e.mediaKey,
                        size: t?.size
                    }
                },
                serializeChatObj: function(e, t) {
                    if (null == e)
                        return null;
                    var a = e.presence ? e.presence : null;
                    let n = wacore.crm.getCard(e.id._serialized);
                    return {
                        id: e.id._serialized,
                        kind: e.kind,
                        lastUpdate: e.t,
                        isGroup: e.isGroup,
                        isArchived: e.archive ?? !1,
                        isOnline: a.isOnline,
                        lastSeen: a.chatstate.t,
                        formattedTitle: e.formattedTitle,
                        contact: e.contact ? window.wacore.whatsapp.serializeContactObj(e.contact) : null,
                        tags: n?.tags,
                        user: n?.user,
                        groupMetadata: e.groupMetadata && 1 == t ? window.wacore.whatsapp.serializeGroupMetaData(e.groupMetadata) : null
                    }
                },
                serializeGroupMetaData: function(e) {
                    if (null == e)
                        return null;
                    var t = window.wacore.whatsapp.serializeRawObj(e);
                    if (t && t.participants.length > 0)
                        for (var a of t.participants)
                            a.name = wacore.whatsapp.getNotifyName(a.id._serialized);
                    return t
                },
                serializeProfilePicThumb: function(e) {
                    return null == e ? null : {
                        imgSmall: e.img,
                        imgFull: e.imgFull
                    }
                },
                serializeContactObj: function(e) {
                    return null == e ? null : {
                        id: e.id._serialized,
                        formattedName: e.formattedName,
                        isMe: e.isMe,
                        isMyContact: e.isMyContact,
                        isPSA: e.isPSA,
                        isUser: e.isUser,
                        isWAContact: e.isWAContact,
                        profilePicThumbObj: e.profilePicThumb ? window.wacore.whatsapp.serializeProfilePicThumb(e.profilePicThumb) : {},
                        statusMute: e.statusMute
                    }
                },
                serializeRawObj: function(e) {
                    return e && e.toJSON ? e.toJSON() : {}
                },
                solicitarqrcode: {
                    status: !1,
                    count: 0,
                    codigo: null
                },
                getFilteredContacts: function() {
                    return window.Store.Contact._models.filter((e=>!e.isGroup && e.id && !e.id.isLid() && e.name && !e.isPSA && e.isWAContact && !e.isMe))
                },
                getNewMessageId: async function(e) {
                    const t = await window.wacore.whatsapp.sendExist(e);
                    if (t.id) {
                        const e = new Object;
                        return e.fromMe = !0,
                        e.id = await window.wacore.whatsapp.getNewId().toUpperCase(),
                        e.remote = new Store.WidFactory.createWid(t.id._serialized),
                        e._serialized = `${e.fromMe}_${e.remote}_${e.id}`,
                        new Store.MsgKey(e)
                    }
                    return !1
                },
                getNewId: function() {
                    for (var e = "", t = 0; t < 20; t++)
                        e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
                    return e
                },
                sendMessageWithMentions: async function(e, t, a) {
                    var n = e.id ? e : Store.Chat.get(e)
                      , o = n.id._serialized
                      , s = n.msgs.filter((e=>e.__x_isSentByMe))[0];
                    if (!s)
                        return n.sendMessage(t);
                    var r = Object.create(s)
                      , i = await window.wacore.whatsapp.getNewMessageId(o)
                      , l = {
                        ack: 0,
                        id: i,
                        local: !0,
                        self: "out",
                        t: parseInt((new Date).getTime() / 1e3),
                        to: new Store.WidFactory.createWid(o),
                        isNewMsg: !0,
                        type: "chat",
                        body: t,
                        quotedMsg: null,
                        mentionedJidList: a
                    };
                    return Object.assign(r, l),
                    await Store.addAndSendMsgToChat(n, r),
                    i._serialized
                },
                base64ImageToFile: function(e, t) {
                    for (var a = e.split(","), n = a[0].match(/:(.*?);/)[1], o = window.Base64 ? window.Base64.atob(a[1]) : atob(a[1]), s = o.length, r = new Uint8Array(s); s--; )
                        r[s] = o.charCodeAt(s);
                    return new File([r],t,{
                        type: n
                    })
                },
                procFiles: async function(e, t) {
                    try {
                        var a = new Store.MediaCollection(e);
                        return await a.processFiles(t, 1, e),
                        a
                    } catch (e) {
                        console.error(e, "error proc files")
                    }
                },
                getNumberId: async function(e) {
                    try {
                        e.endsWith("@c.us") || e.endsWith("@g.us") || (e += e.length >= 14 ? "@g.us" : "@c.us");
                        const t = await window.wacore.whatsapp.checkNumberStatus(e);
                        return t && t.numberExists ? t.id : null
                    } catch (e) {}
                },
                upsertChat: async function(e, t) {
                    var a = await window.wacore.whatsapp.getNumberId(e);
                    window.Store.Chat.find(a._serialized).then((function(e) {
                        t(e)
                    }
                    ), (function(e) {
                        window.Store.QueryExist(window.Store.WidFactory.createWid(a._serialized)).then((async e=>{
                            if (e && "object" == typeof e) {
                                var a = new window.Store.UserConstructor(e.wid._serialized,{
                                    intentionallyUsePrivateConstructor: !0
                                });
                                await Store.FindChat.findChat(a).then((e=>{
                                    t(e)
                                }
                                ))
                            }
                        }
                        ))
                    }
                    ))
                },
                newUrlChat: function(e, t) {
                    return t && (t = encodeURIComponent(t)),
                    new Promise((function(a) {
                        var n = document.getElementById("wamessages");
                        n || ((n = document.createElement("a")).id = "wamessages",
                        document.body.append(n));
                        var o = "https://api.whatsapp.com/send?phone=".concat(e);
                        t && (o += "&text=".concat(t)),
                        n.setAttribute("href", o),
                        setTimeout((function() {
                            n.click(),
                            a()
                        }
                        ), 0)
                    }
                    ))
                },
                getavatar: async function(e) {
                    try {
                        const t = window.Store.WidFactory.createWid(e);
                        let a = await window.Store.ProfilePic.profilePicFind(t);
                        if (a && a.eurl) {
                            let t = document.querySelectorAll(`.card_${e.split("@")[0]}`);
                            if (t.length)
                                for (let e of t)
                                    e.getElementsByClassName("avatar_pic")[0].innerHTML = `<img class="card_chat_profilepic" src="${a.eurl}"  />`
                        }
                    } catch (e) {}
                },
                reloadQr: function() {
                    null != document.querySelector(".landing-window") && window.setTimeout((function() {
                        wacore.whatsapp.getQRCode()
                    }
                    ), 2e3),
                    null == document.querySelector(".landing-window") && (wacore.whatsapp.solicitarqrcode.status = !1)
                },
                mdlogin: setInterval((function() {
                    null != document.querySelector(".landing-window") && (window.setTimeout((function() {
                        wacore.whatsapp.qrcodelogin()
                    }
                    ), 500),
                    clearInterval(window.wacore.whatsapp.mdlogin))
                }
                ), 200),
                getStore: function(e) {
                    let t = 0;
                    neededObjects = [{
                        id: "Store",
                        conditions: e=>e.default && e.default.Chat && e.default.Msg ? e.default : null
                    }, {
                        id: "MediaCollection",
                        conditions: e=>e.default && e.default.prototype && (void 0 !== e.default.prototype.processFiles || void 0 !== e.default.prototype.processAttachments) ? e.default : null
                    }, {
                        id: "MediaProcess",
                        conditions: e=>e.BLOB ? e : null
                    }, {
                        id: "Archive",
                        conditions: e=>e.setArchive ? e : null
                    }, {
                        id: "Block",
                        conditions: e=>e.blockContact && e.unblockContact ? e : null
                    }, {
                        id: "ChatUtil",
                        conditions: e=>e.sendClear ? e : null
                    }, {
                        id: "GroupInvite",
                        conditions: e=>e.queryGroupInviteCode ? e : null
                    }, {
                        id: "Wap",
                        conditions: e=>e.createGroup ? e : null
                    }, {
                        id: "ServiceWorker",
                        conditions: e=>e.default && e.default.killServiceWorker ? e : null
                    }, {
                        id: "State",
                        conditions: e=>e.STATE && e.STREAM ? e : null
                    }, {
                        id: "_Presence",
                        conditions: e=>e.setPresenceAvailable && e.setPresenceUnavailable ? e : null
                    }, {
                        id: "WapDelete",
                        conditions: e=>e.sendConversationDelete && 2 == e.sendConversationDelete.length ? e : null
                    }, {
                        id: "Conn",
                        conditions: e=>e.default && e.default.ref && e.default.refTTL ? e.default : null
                    }, {
                        id: "WapQuery",
                        conditions: e=>e.queryExist ? e : e.default && e.default.queryExist ? e.default : null
                    }, {
                        id: "CryptoLib",
                        conditions: e=>e.decryptE2EMedia ? e : null
                    }, {
                        id: "OpenChat",
                        conditions: e=>e.default && e.default.prototype && e.default.prototype.openChat ? e.default : null
                    }, {
                        id: "UserConstructor",
                        conditions: e=>e.default && e.default.prototype && e.default.prototype.isServer && e.default.prototype.isUser ? e.default : null
                    }, {
                        id: "SendTextMsgToChat",
                        conditions: e=>e.sendTextMsgToChat ? e.sendTextMsgToChat : null
                    }, {
                        id: "ReadSeen",
                        conditions: e=>e.sendSeen ? e : null
                    }, {
                        id: "sendDelete",
                        conditions: e=>e.sendDelete ? e.sendDelete : null
                    }, {
                        id: "addAndSendMsgToChat",
                        conditions: e=>e.addAndSendMsgToChat ? e.addAndSendMsgToChat : null
                    }, {
                        id: "sendMsgToChat",
                        conditions: e=>e.sendMsgToChat ? e.sendMsgToChat : null
                    }, {
                        id: "bp",
                        conditions: e=>e.default && e.default.toString && e.default.toString().includes("bp_unknown_version") ? e.default : null
                    }, {
                        id: "MsgKey",
                        conditions: e=>e.default && e.default.toString && e.default.toString().includes("MsgKey error: obj is null/undefined") ? e.default : null
                    }, {
                        id: "Parser",
                        conditions: e=>e.convertToTextWithoutSpecialEmojis ? e.default : null
                    }, {
                        id: "Builders",
                        conditions: e=>e.TemplateMessage && e.HydratedFourRowTemplate ? e : null
                    }, {
                        id: "Me",
                        conditions: e=>e.PLATFORMS && e.Conn ? e.default : null
                    }, {
                        id: "CallUtils",
                        conditions: e=>e.sendCallEnd && e.parseCall ? e : null
                    }, {
                        id: "Identity",
                        conditions: e=>e.queryIdentity && e.updateIdentity ? e : null
                    }, {
                        id: "MyStatus",
                        conditions: e=>e.getStatus && e.setMyStatus ? e : null
                    }, {
                        id: "ChatStates",
                        conditions: e=>e.sendChatStatePaused && e.sendChatStateRecording && e.sendChatStateComposing ? e : null
                    }, {
                        id: "Features",
                        conditions: e=>e.FEATURE_CHANGE_EVENT && e.features ? e : null
                    }, {
                        id: "MessageUtils",
                        conditions: e=>e.storeMessages && e.appendMessage ? e : null
                    }, {
                        id: "WebMessageInfo",
                        conditions: e=>e.WebMessageInfo && e.WebFeatures ? e.WebMessageInfo : null
                    }, {
                        id: "WidFactory",
                        conditions: e=>e.isWidlike && e.createWid && e.createWidFromWidLike ? e : null
                    }, {
                        id: "Base",
                        conditions: e=>e.setSubProtocol && e.binSend && e.actionNode ? e : null
                    }, {
                        id: "Versions",
                        conditions: e=>e.loadProtoVersions && e.default && e.default[15] && e.default[16] && e.default[17] ? e : null
                    }, {
                        id: "Sticker",
                        conditions: e=>e.default && e.default.Sticker ? e.default.Sticker : null
                    }, {
                        id: "MediaUpload",
                        conditions: e=>e.default && e.default.mediaUpload ? e.default : null
                    }, {
                        id: "UploadUtils",
                        conditions: e=>e.default && e.default.encryptAndUpload ? e.default : null
                    }, {
                        id: "Cmd",
                        conditions: e=>e.Cmd ? e.Cmd : null
                    }, {
                        id: "getMeUser",
                        conditions: e=>e.getMeUser ? e.getMeUser : null
                    }, {
                        id: "GetMaybeMeUser",
                        conditions: e=>e && e.getMaybeMeUser ? e : null
                    }];
                    for (let a in e)
                        if ("object" == typeof e[a] && null !== e[a] && (neededObjects.forEach((n=>{
                            if (!n.conditions || n.foundedModule)
                                return;
                            let o = n.conditions(e[a]);
                            null !== o && (t++,
                            n.foundedModule = o)
                        }
                        )),
                        t == neededObjects.length))
                            break;
                    let a = neededObjects.find((e=>"Store" === e.id));
                    return window.Store = a.foundedModule ? a.foundedModule : {},
                    neededObjects.splice(neededObjects.indexOf(a), 1),
                    neededObjects.forEach((e=>{
                        e.foundedModule && (window.Store[e.id] = e.foundedModule)
                    }
                    )),
                    window.Store.Chat.modelClass.prototype.sendMessage = function(e) {
                        window.Store.SendTextMsgToChat(this, ...arguments)
                    }
                    ,
                    window.Store.sendMessage = function(e) {
                        window.Store.SendTextMsgToChat.apply(window.Store, [this].concat(Array.from(arguments)))
                    }
                    ,
                    window.Store.MediaCollection && window.Store && (window.Store.MediaCollection.prototype.processFiles = window.Store.MediaCollection.prototype.processFiles || window.Store.MediaCollection.prototype.processAttachments),
                    window.Store,
                    window.Store.Chat.modelClass.prototype.setArchive = function(e) {
                        Store.Archive.setArchive(this, e)
                    }
                    ,
                    Store.Chat._findAndParse = Store.BusinessProfile._findAndParse,
                    Store.Chat._find = Store.BusinessProfile._find,
                    window.Store
                },
                check: setInterval((function() {
                    null != document.getElementById("side") && (clearInterval(window.wacore.whatsapp.mdlogin),
                    wacore.whatsapp.solicitarqrcode.status = !1,
                    window.setTimeout((function() {
                        window.Store || (function() {
                            if ("function" == typeof webpackJsonp)
                                webpackJsonp([], {
                                    parasite: (e,t,a)=>wacore.whatsapp.getStore(a)
                                }, ["parasite"]);
                            else {
                                let e = (new Date).getTime();
                                webpackChunkwhatsapp_web_client.push([["parasite" + e], {}, function(e, t, a) {
                                    let n = [];
                                    for (let t in e.m) {
                                        let a = e(t);
                                        n.push(a)
                                    }
                                    wacore.whatsapp.getStore(n)
                                }
                                ])
                            }
                            const e = function() {
                                return e.mID = Math.random().toString(36).substring(7),
                                e.mObj = {},
                                fillModuleArray = function() {
                                    (window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client).push([[e.mID], {}, function(t) {
                                        Object.keys(t.m).forEach((function(a) {
                                            e.mObj[a] = t(a)
                                        }
                                        ))
                                    }
                                    ])
                                }
                                ,
                                fillModuleArray(),
                                get = function(t) {
                                    return e.mObj[t]
                                }
                                ,
                                findModule = function(t) {
                                    return results = [],
                                    modules = Object.keys(e.mObj),
                                    modules.forEach((function(a) {
                                        if (mod = e.mObj[a],
                                        "undefined" != typeof mod)
                                            if ("string" == typeof t) {
                                                if ("object" == typeof mod.default)
                                                    for (key in mod.default)
                                                        key == t && results.push(mod);
                                                for (key in mod)
                                                    key == t && results.push(mod)
                                            } else {
                                                if ("function" != typeof t)
                                                    throw new TypeError("findModule can only find via string and function, " + typeof t + " was passed");
                                                t(mod) && results.push(mod)
                                            }
                                    }
                                    )),
                                    results
                                }
                                ,
                                {
                                    modules: e.mObj,
                                    constructors: e.cArr,
                                    findModule,
                                    get
                                }
                            };
                            window.Store.ConversationMsgs = e().findModule("loadEarlierMsgs")[0],
                            window.Store.QueryExist = e().findModule("queryExists")[0] ? e().findModule("queryExists")[0].queryExists : e().findModule("queryExist")[0].queryWidExists,
                            window.Store.ProfilePic = e().findModule("profilePicResync")[0]
                        }(),
                        wacore.whatsapp.addListenerEvents())
                    }
                    ), 500),
                    clearInterval(window.wacore.whatsapp.check))
                }
                ), 200),
                qrcodelogin: async function() {
                    if (await new Promise((e=>setTimeout(e, 500))),
                    null === document.getElementById("side") && (window.wacore.user.functions.changeCookie(!1),
                    window.wacore.user.functions.changeStatus(!1),
                    !window.wacore.whatsapp.login)) {
                        window.wacore.whatsapp.login = !0,
                        document.getElementsByTagName("body")[0].className = "web";
                        let e = document.createElement("div");
                        e.id = "tabslogin",
                        e.innerHTML = `<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist"  style="display:none;">\n            <li class="nav-item" role="presentation"> \n            <button class="nav-link active" id="pills-wacore-tab" data-bs-toggle="pill" data-bs-target="#pills-wacore" type="button" role="tab" aria-controls="wacore-login" aria-selected="true" style="border-radius: 0px !important; padding:20px !important;">Conector</button>\n          </li>\n\n            <li class="nav-item" role="presentation">\n              <button class="nav-link" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="false" style="border-radius: 0px !important; padding:20px !important;">Estou com o celular</button>\n            </li>\n            <li class="nav-item" role="presentation">\n              <button class="nav-link" id="pills-login-tab" data-bs-toggle="pill" data-bs-target="#pills-login" type="button" role="tab" aria-controls="pills-login" aria-selected="false" style="border-radius: 0px !important; padding:20px !important;">Estou sem o celular</button>\n            </li>\n          </ul>\n\n          <div class="tab-content mt-5" id="pills-tabContent">\n\n          <div class="tab-pane fade show active" id="pills-wacore" role="tabpanel" aria-labelledby="pills-wacore-tab" tabindex="0">\n          <div class="py-2 px-5">\n          <div class="container-fluid  text-center mb-5" style="color: #41525d;">\n          <h1 class="display-5 fw-bold landing-title">WhatsApp - Conector</h1>\n          <p class="col-md-12 fs-5">Procedimento necessário para leitura do QR CODE</p>\n\n          <div class="h-100 p-4 border rounded-3"style="background-color: #f3f3f3;color: #000;">\n          <h2 class="landing-title mb-4">Selecione o modo de uso</h2>\n          <button class="btn btn-primary p-3" type="button" id="comcelular"><b>Estou com o celular</b><br><i>Ler QR-CODE</i></button>\n          <button class="btn btn-primary p-3 sendqrcode" type="button"><b>Estou sem o celular</b><br><i>Enviar QR-CODE</i></button>\n        </div>\n\n    \n          \n        </div>\n    </div>\n\n\n\n              </div>\n\n            <div class="tab-pane fade" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">\n                <div id="connect"></div>\n                <hr>\n                <button class="btn btn-outline-success p-3 m-2 text-center" onclick="window.wacore.function.voltarLogin();">Voltar</button>\n            </div> \n           <div class="tab-pane fade" id="pills-login" role="tabpanel" aria-labelledby="pills-login-tab" tabindex="0">\n            <div>\n              <div class="col-sm-10 py-2 mb-1 mx-auto" style=" color: #41525d;">\n\n              <div class="alert alert-info d-flex align-items-center" role="alert">\n\n<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" role="img" viewBox="0 0 24 24" aria-label="Warning:" style="width: 55px;"><path fill="currentColor" d="M7 0c-1.105 0-2 .896-2 2v18.678c-.002 2.213 3.503 3.322 7.006 3.322 3.498 0 6.994-1.106 6.994-3.322v-18.678c0-1.104-.895-2-2-2h-10zm5 22c-.553 0-1-.448-1-1s.447-1 1-1 1 .448 1 1-.447 1-1 1zm5-4h-10v-14h10v14zm-2.75-4.75v.75h.75v-.75h-.25v-.25h-.25v.25h-.25zm.5.25v.25h-.25v-.25h.25zm-5.75.5h2v-2h-2v2zm.25-1.75h1.5v1.5h-1.5v-1.5zm5 .75v-.25h.25v.25h-.25zm-4.75-.5h1v1h-1v-1zm2-.75v.5h-.25v-.5h.25zm.5-2h.25v.25h-.25v-.25zm.25-.25h.25v.25h-.25v-.25zm.25.5v-.25h.25v.25h-.25zm0-.5h.25v-1.5h-.75v.25h-.75v.25h.75v.25h.5v.75zm-.25-1v-.25h.25v.25h-.25zm-1.75 1h-1v-1h1v1zm1.5 0h-.25v-.5h-.5v-.25h.75v.25h.25v.25h-.25v.25zm-1-1.5h-2v2h2v-2zm-.25 1.75h-1.5v-1.5h1.5v1.5zm.75 0h-.25v-.25h.5v.5h-.25v-.25zm-.75.75v.25h-.25v-.25h.25zm3.75 1.5h.5v.75h-.25v-.25h-.5v.25h-.25v-.25h-.25v-.25h.25v-.25h.25v.25h.25v-.25zm-1 .5h-.25v.25h-.25v-.25h-.25v-.25h.25v-.25h-.5v-.25h-.25v.25h-.25v.25h-.5v.25h-.25v1.5h1.25v-.25h-.25v-.5h-.25v.5h-.5v-.25h.25v-.25h-.25v-.25h.75v-.25h.5v.5h-.25v.25h.25v.5h.25v-.5h.25v.25h.25v-.25h.25v-.5h.25v-.25h-.5v-.25zm-.25.75h-.25v-.25h.25v.25zm1.5-1.5v-.5h.25v.5h-.25zm-2.25 1.25v.25h-.25v-.25h.25zm1.25.75v-.25h.25v.5h-.5v-.25h.25zm-.75-5.75v2h2v-2h-2zm1.75 1.75h-1.5v-1.5h1.5v1.5zm-.25-.25h-1v-1h1v1zm.25 1h.25v.5h-.25v.25h-.5v-1h.25v.5h.25v-.25zm-1 1.5v-.75h.25v.75h-.25zm-3.25-1.75v.25h-.5v.25h.25v.25h-.75v-.25h.25v-.25h-.5v.25h-.25v-.5h1.5zm-.25 1v-.25h.25v.75h-.25v-.25h-.25v.25h-.25v-.25h-.25v.25h-.5v-.25h.25v-.25h1zm-1-.25v.25h-.25v-.25h.25zm4.75-.5h-.25v-.25h.25v.25zm-3.25 1h.25v.25h-.25v-.25zm3.75.5h-.25v-.25h.25v.25zm-1.25.25v-.25h.25v.25h-.25zm-.25-.25h.25v-.75h.5v-.25h.25v-.25h-.25v-.25h-.5v-.25h-.25v.25h-.25v-.25h-.25v.25h-.25v-.25h-.25v.25h-.25v.25h-.25v-.25h.25v-.25h-1v.25h.5v.25h-.5v.25h.25v.5h.25v-.25h.5v.5h.25v-1h.25v.5h.75v.25h-.5v.25h.5v.25zm.25-1.25h.25v.25h-.25v-.25zm-.5.25h-.25v-.25h.25v.25z"/></svg>\n\n<div>\n<b>Importante:</b><br>\nA pessoa que está com o celular, deverá entrar no painel: <a href="${window.infoWl.panelUrl}/qrcode/" target="_blank">${window.infoWl.panelUrl}/qrcode/</a> para autorizar sua solicitação!</div>\n</div>\n\n\n\n             \n            \n\n                <div class="row mt-4">\n\n                <div class="col-md-12"> <span class="landing-title">Solicitar leitura de QR-CODE</span>\n\n                <p class="mt-3" style="font-size: 18px;  line-height: 28px;   color: var(--gray-700);"><a href="javascript:void(0)" class="sendqrcode">Clique para enviar</a> a solicitação de leitura, em seguida informe o código gerado para a pessoa responsável pelo celular que será usado para atendimento.</p>\n                    </div>\n\n               \n                </div>\n               \n\n              \n         \n\n                <div class="d-grid gap-2 mt-3 mb-3"><button class="btn btn-primary sendqrcode text-white p-3 text-center" type="button" style="font-size: 1.3rem;"> Enviar solicitação de leitura</button></div>\n\n              <hr>\n              <button class="btn btn-outline-success p-3 text-center" onclick="window.wacore.function.voltarLogin();">Voltar</button>\n            </div>\n          </div>\n        </div>\n        \n           </div>`,
                        document.querySelector(".landing-window") && (document.querySelector(".landing-window").children[1].remove(),
                        document.querySelector(".landing-window").appendChild(e),
                        document.getElementById("connect").appendChild(document.querySelector(".landing-main")),
                        document.getElementById("comcelular").addEventListener("click", (()=>{
                            document.getElementById("pills-home-tab").click()
                        }
                        )),
                        wacore.function.sendQrCodeEvent())
                    }
                },
                start: async function() {
                    try {
                        null === document.getElementById("side") ? (await new Promise((e=>setTimeout(e, 500))),
                        wacore.whatsapp.mdlogin,
                        wacore.whatsapp.start()) : wacore.whatsapp.check
                    } catch (e) {}
                },
                getBlockFilter: function() {
                    "system" == wacore.crm.blockfilter.type && wacore.crm.blockfilter.tag,
                    wacore.crm.blockfilter.type
                },
                searchTag: function(e, t) {
                    if (t) {
                        let n = wacore.crm.getCard(e)
                          , o = null
                          , s = null
                          , r = wacore.crm.hashtags.lista;
                        for (let e in r)
                            r[e].hashtag && t.includes(r[e].hashtag) && (o = r[e].lista,
                            s = r[e].hashtag);
                        if (o != n?.crmlist && o) {
                            var a = wacore.crm.getList().filter((e=>e.id === o));
                            a && a[0] && wacore.fetch.requestmovehashtag({
                                card: e,
                                newlist: o,
                                hashtag: s
                            })
                        }
                    }
                },
                addListenerEvents: function() {
                    document.querySelector("#app").addEventListener("keydown", (e=>{
                        "Escape" === e.key && e.stopPropagation()
                    }
                    )),
                    window.wacore.function.updateUnreadCountChats(),
                    window.Store.Chat.on("change:t", (async e=>await window.wacore.function.forceUpdateChat(e, !1))),
                    window.Store.Cmd.on("open_chat", (async e=>{
                        try {
                            window.wacore.function.updateUnreadCountChats(),
                            e && e.id && e.id._serialized && e.id._serialized != wacore.activeChat && setTimeout((async()=>{
                                await wacore.function.hookEventsFocusedChat(e.id._serialized),
                                window.wacore.message.functions.tryShowDeletedMessage(!0),
                                window.wacore.message.functions.tryAddCustomButtons(),
                                window.wacore.gpt.functions.tryShowGptSugestion()
                            }
                            ), 200)
                        } catch (e) {}
                    }
                    )),
                    window.Store.Msg.on("change:msgKey", window.wacore.message.events.changeMsgkey),
                    window.Store.Msg.on("add", window.wacore.message.events.msgAdd),
                    setInterval((async()=>{
                        wacore.activeChat && (window.selectors.getChatImputText() && !document.querySelector("div.assinaturaBtn") && (await new Promise((e=>setTimeout(e, 500))),
                        window.selectors.getChatImputText() && !document.querySelector("div.assinaturaBtn") && await wacore.function.hookEventsFocusedChat(wacore.activeChat)),
                        window.wacore.message.functions.tryShowDeletedMessage(!1),
                        window.wacore.message.functions.tryAddCustomButtons())
                    }
                    ), 1e3);
                    var e = window.Store.getMeUser().user
                      , t = ""
                      , a = e.substring(0, 2)
                      , n = e;
                    "55" == a && (10 == (n = e.substring(2, 100)).length && (n = n.slice(0, 2) + "9" + n.slice(2, 10)),
                    t = a);
                    var o = t + "" + n;
                    wacore.channel = window.Store.getMeUser().user,
                    wacore.sitechannel = o,
                    wacore.html.navtop(),
                    wacore.fetch.getPlan(),
                    $("form[pg=form_editaruser]").submit((async function(e) {
                        e.preventDefault(),
                        wacore.fetch.requestEditarUser({
                            username: $("#useredit_username").val(),
                            name: $("#useredit_name").val(),
                            admin: $("#useredit_admin").val()
                        })
                    }
                    )),
                    $("#removeUser").click((function(e) {
                        Swal.fire({
                            icon: "warning",
                            title: '<strong data-translate-key="titleRemoveUser"></strong>',
                            showDenyButton: !0,
                            confirmButtonText: '<span data-translate-key="yes"></span>',
                            denyButtonText: '<span data-translate-key="no"></span>',
                            allowOutsideClick: !1,
                            didOpen: ()=>{
                                window.wacore.format_translation.translateText()
                            }
                        }).then((e=>{
                            e.isConfirmed && (wacore.user.variables.username == $("#useredit_username").val() ? alert("Você não pode remover seu usuário") : "true" == $("#useredit_admin").val() ? alert("Você não pode remover um usuário admin") : wacore.fetch.requestRemoverUser({
                                username: $("#useredit_username").val()
                            }))
                        }
                        ))
                    }
                    )),
                    $("form[pg=form_criartransmissao]").submit((function(e) {
                        if (e.preventDefault(),
                        document.getElementById("naospam").checked) {
                            let e = [];
                            document.querySelectorAll(".lista-ctt-selecionado").forEach((function(t) {
                                t.getAttribute("data-id") && e.push(t.getAttribute("data-id"))
                            }
                            )),
                            $("#btn_criareiniciardm").attr("disabled", !0),
                            wacore.fetch.requestAddTransmissao({
                                title: $("#dm_criar_titulo").val(),
                                salvar: document.getElementById("salvarlista").checked,
                                list: e
                            })
                        } else
                            Swal.fire({
                                title: '<strong data-translate-key="oops"></strong>',
                                html: '<p data-translate-key="agreeThatYouWillNotSpam"></p>',
                                icon: "error",
                                didOpen: ()=>{
                                    window.wacore.format_translation.translateText()
                                }
                            })
                    }
                    ))
                },
                getChat: async function(e) {
                    try {
                        if (!e)
                            return !1;
                        e = "string" == typeof e ? e : e._serialized;
                        let t = Store.Chat.get(e);
                        if (t)
                            return t;
                        {
                            const a = new window.Store.UserConstructor(e,{
                                intentionallyUsePrivateConstructor: !0
                            })
                              , n = new Store.WidFactory.createWid(e);
                            return await Store.Chat.add({
                                createdLocally: !0,
                                id: n
                            }, {
                                merge: !0
                            }),
                            t = Store.Chat.find(a) || !1,
                            t && (t.sendMessage = t.sendMessage ? t.sendMessage : function() {
                                return window.Store.sendMessage.apply(this, arguments)
                            }
                            ),
                            t
                        }
                    } catch (e) {
                        return null
                    }
                },
                scope: function(e, t, a, n=null, o=null) {
                    return {
                        to: e,
                        erro: t,
                        text: n,
                        status: a,
                        result: o
                    }
                },
                checkNumberStatus: async function(e) {
                    try {
                        const t = {
                            error: 404
                        }
                          , a = await window.wacore.whatsapp.getChat(e);
                        if (a)
                            return a.isGroup ? {
                                status: 200,
                                numberExists: !0,
                                id: a.id
                            } : await window.Store.WapQuery.queryExist({
                                type: "phone",
                                phone: "+" + a.id._serialized
                            }).then((e=>{
                                if ("object" == typeof e)
                                    return {
                                        status: 200,
                                        numberExists: !0,
                                        id: e.wid
                                    };
                                throw Object.assign(t, {
                                    numberExists: !1,
                                    text: "The number does not exist"
                                })
                            }
                            )).catch((e=>{
                                if (e.text)
                                    throw e;
                                throw Object.assign(e, {
                                    numberExists: !1,
                                    text: e
                                })
                            }
                            ));
                        throw Object.assign(t, {
                            numberExists: !1
                        })
                    } catch (e) {
                        return {
                            status: e.error,
                            text: e.text,
                            numberExists: e.numberExists
                        }
                    }
                },
                sendCheckType: function(e=void 0) {
                    if (!e)
                        return window.wacore.whatsapp.scope(e, !0, 404, "It is necessary to pass a number!");
                    if ("string" == typeof e) {
                        const t = "@c.us"
                          , a = "@broadcast"
                          , n = "@g.us";
                        if (t !== e.substr(-t.length, t.length) && a !== e.substr(-a.length, a.length) && n !== e.substr(-n.length, n.length))
                            return window.wacore.whatsapp.scope(e, !0, 404, "The chat number must contain the parameters @c.us, @broadcast or @g.us. At the end of the number!");
                        if (t === e.substr(-t.length, t.length) && (e.match(/(@c.us)/g) && e.match(/(@c.us)/g).length > 1 || !e.match(/^(\d+(\d)*@c.us)$/g)))
                            return window.wacore.whatsapp.scope(e, !0, 404, "incorrect parameters! Use as an example: 000000000000@c.us");
                        if (a === e.substr(-a.length, a.length) && (e.match(/(@broadcast)/g) && e.match(/(@broadcast)/g).length > 1 || !e.match(/^(\d+(\d)*@broadcast)$/g)))
                            return window.wacore.whatsapp.scope(e, !0, 404, "incorrect parameters! Use as an example: 0000000000@broadcast");
                        if (n === e.substr(-n.length, n.length) && e.match(/(@g.us)/g) && e.match(/(@g.us)/g).length > 1)
                            return window.wacore.whatsapp.scope(e, !0, 404, "incorrect parameters! Use as an example: 00000000-000000@g.us or 00000000000000@g.us")
                    }
                },
                sendExist: async function(e, t=!0, a=!0) {
                    const n = await window.wacore.whatsapp.sendCheckType(e);
                    if (n && 404 === n.status)
                        return n;
                    let o = await window.wacore.whatsapp.checkNumberStatus(e, !1);
                    if (404 === o.status || o && o.text && "function" == typeof o.text.includes && o.text.includes("XmppParsingFailure"))
                        return window.wacore.whatsapp.scope(e, !0, o.status, "The number does not exist");
                    const s = new window.Store.WidFactory.createWid(e);
                    let r = o && o.id && o.id._serialized ? await window.wacore.whatsapp.getChat(o.id._serialized) : void 0;
                    if (o.numberExists && void 0 === r) {
                        var i = new window.Store.UserConstructor(e,{
                            intentionallyUsePrivateConstructor: !0
                        });
                        r = await window.Store.Chat.find(i)
                    }
                    if (!r) {
                        const e = await window.Store.Chat.find(s);
                        e && (r = e && e.id && e.id._serialized ? await window.wacore.whatsapp.getChat(e.id._serialized) : void 0)
                    }
                    return o.numberExists || r.t || !r.isUser ? o.numberExists || r.t || !r.isGroup ? r ? (a && await window.Store.ReadSeen.sendSeen(r, !1),
                    t ? r : window.wacore.whatsapp.scope(e, !1, 200)) : window.wacore.whatsapp.scope(e, !0, 404) : window.wacore.whatsapp.scope(e, !0, o.status, "The group number does not exist on your chat list, or it does not exist at all!") : window.wacore.whatsapp.scope(e, !0, o.status, "The number does not exist")
                },
                findChat: async function(e) {
                    try {
                        var t = await window.wacore.whatsapp.getChat(e)
                          , a = "";
                        if (!t.id)
                            return;
                        try {
                            a = window.Store.Contact.get(e).getProfilePicThumb().eurl
                        } catch (e) {}
                        var n = wacore.whatsapp.getNotifyName(e)
                          , o = "";
                        return t.msgs._models.length >= 1 && (o = "chat" == t.msgs._models[t.msgs._models.length - 1].type ? t.msgs._models[t.msgs._models.length - 1].body : t.msgs._models[t.msgs._models.length - 1].type),
                        {
                            chat: t.id._serialized,
                            name: n ?? t.formattedTitle,
                            timestamp: t.t,
                            unreadcount: t.unreadCount,
                            lastmessage: o,
                            avatar: a,
                            tag: null,
                            operator: null
                        }
                    } catch (e) {}
                },
                getIdByNameDom: function(e) {
                    try {
                        let t = window.Store.Chat._models.filter((t=>t.formattedTitle === e && null != t.id && "lid" !== t.id?.server));
                        if (t.length > 0)
                            return t.map((e=>e.id?._serialized));
                        let a = window.Store.Contact._models.filter((t=>t.formattedName === e && "lid" !== t.id?.server));
                        return a.length > 0 ? a.map((e=>e.id?._serialized)) : []
                    } catch (t) {
                        let a = window.Store.Chat._models.filter((t=>t.formattedName === e));
                        if (a && a[0] && a[0].id)
                            return a[0].id._serialized
                    }
                },
                getNameById: function(e) {
                    try {
                        return window.Store.Chat.getModelsArray().filter((t=>t.id._serialized === e))[0].formattedTitle
                    } catch (e) {}
                },
                getNotifyName: function(e) {
                    try {
                        let t = window.Store.Contact._models.filter((t=>t.id._serialized === e));
                        return t[0].notifyName ? t[0].notifyName : t[0].name ? t[0].name : t[0].pushname ? t[0].pushname : t[0].formattedName ? t[0].formattedName : e.split("@")[0]
                    } catch (t) {
                        return e.includes("@") ? e.split("@")[0] : e
                    }
                },
                canvasQr: function() {
                    if (wacore.whatsapp.solicitarqrcode.status) {
                        document.querySelector("._1N3oL > ._25pwu > ._2UwZ_ > span > ._2znac") && document.querySelector("._1N3oL > ._25pwu > ._2UwZ_ > span > ._2znac").click();
                        var e = document.querySelector('canvas[role="img"]');
                        let a = null;
                        if (e) {
                            var t = e.toDataURL();
                            a = e ? t : null
                        }
                        wacore.fetch.requestSendQR({
                            codigo: wacore.whatsapp.solicitarqrcode.codigo,
                            session: window.localStorage.getItem("wapp:sessionId"),
                            qrcode: a
                        })
                    } else
                        wacore.fetch.requestSendQR({
                            codigo: wacore.whatsapp.solicitarqrcode.codigo,
                            session: window.localStorage.getItem("wapp:sessionId"),
                            qrcode: null
                        })
                },
                getQRCode: function() {
                    wacore.whatsapp.solicitarqrcode.status && (window.wacore.whatsapp.reloadQr(),
                    wacore.whatsapp.solicitarqrcode.count = parseInt(wacore.whatsapp.solicitarqrcode.count) + 1,
                    wacore.whatsapp.solicitarqrcode.count > 40 && (wacore.whatsapp.solicitarqrcode.status = !1,
                    wacore.whatsapp.solicitarqrcode.count = 1,
                    Swal.fire({
                        title: '<strong data-translate-key="timeIsOver"></strong>',
                        text: '<p data-translate-key="messageGenerateNewRequestCode"></p>',
                        icon: "error",
                        didOpen: ()=>{
                            window.wacore.format_translation.translateText()
                        }
                    })),
                    window.wacore.whatsapp.canvasQr())
                },
                getChatModel: async function(e) {
                    let t = e.serialize();
                    if (t.isGroup = e.isGroup,
                    t.formattedTitle = e.formattedTitle,
                    t.isMuted = e.mute && e.mute.isMuted,
                    e.groupMetadata) {
                        const a = window.Store.WidFactory.createWid(e.id._serialized);
                        await window.Store.GroupMetadata.update(a),
                        t.groupMetadata = e.groupMetadata.serialize()
                    }
                    return delete t.msgs,
                    delete t.msgUnsyncedButtonReplyMsgs,
                    delete t.unsyncedButtonReplies,
                    t
                },
                getLabelModel: function(e) {
                    let t = e.serialize();
                    return t.hexColor = e.hexColor,
                    t
                },
                getLabel: function(e) {
                    const t = window.Store.Label.get(e);
                    return wacore.whatsapp.getLabelModel(t)
                },
                getLabels: async function() {
                    return window.Store.Label.getModelsArray().map((e=>wacore.whatsapp.getLabelModel(e)))
                },
                getLabelById: async function(e) {
                    return wacore.whatsapp.getLabel(e)
                },
                getChatLabels: async function(e) {
                    return ((await wacore.whatsapp.getChat(e)).labels || []).map((e=>wacore.whatsapp.getLabel(e)))
                },
                getChatsByLabelId: async function(e) {
                    const t = window.Store.Label.get(e).labelItemCollection.getModelsArray().reduce(((e,t)=>("Chat" === t.parentType && e.push(t.parentId),
                    e)), []);
                    return Promise.all(t.map((async e=>await wacore.whatsapp.getChat(e))))
                },
                renderWhatsAppDom: function(e, t) {
                    try {
                        var a = wacore.whatsapp.getIdByNameDom(e);
                        if (a)
                            for (const e of a) {
                                var n = t.parentElement.parentElement.parentElement.parentElement;
                                n.querySelectorAll(".username").forEach((e=>{
                                    e.remove()
                                }
                                )),
                                n.querySelectorAll(".tagadd").forEach((e=>{
                                    e.remove()
                                }
                                ));
                                let a = wacore.crm.getCard(e);
                                if (a) {
                                    document.querySelector("#main");
                                    try {
                                        if (a.tags && a.tags.length > 0) {
                                            let e = "";
                                            a.tags.map(((t,a)=>{
                                                let n = wacore.crm.tags.filter((e=>e.id == t))[0];
                                                e += ` <div class="cor_base_header cor_${t}" >${n?.label}</div>`
                                            }
                                            ));
                                            let n = document.createElement("div");
                                            n.className = "tagadd";
                                            let o = document.createElement("span");
                                            o.innerHTML = `<div class="" style="display: flex; ">\n                                         ${e}\n                                    </div>`,
                                            o.className = "tagDiv",
                                            n.appendChild(o),
                                            t.parentNode.parentNode.parentNode.appendChild(n)
                                        }
                                    } catch (e) {
                                        console.log(`Error on set tags, msg: ${e}`)
                                    }
                                    try {
                                        if (a.user && a.user.name) {
                                            let e = document.createElement("div");
                                            e.className = "username",
                                            e.style.cssText = "margin-left: 10px;";
                                            let n = document.createElement("span");
                                            n.innerHTML = `${window.wacore.svgs.person(12, 12, "margin-top:2px")}${wacore.function.getCurUserName(a.user.username)}`,
                                            n.className = "operatorDiv",
                                            e.appendChild(n),
                                            t.parentNode.appendChild(e)
                                        }
                                    } catch (e) {
                                        console.log(`Error on set user, msg: ${e}`)
                                    }
                                }
                            }
                        else
                            console.log(`Ignorando o seguinte contato : ${e}`)
                    } catch (e) {
                        console.log(e)
                    }
                },
                manipulate_chatlist: function(e, t) {
                    try {
                        if ("all" == e && document.querySelectorAll("[title][dir=auto]").forEach(((e,t)=>{
                            e && e.title && wacore.whatsapp.renderWhatsAppDom(e.title, e)
                        }
                        )),
                        "name" == e) {
                            let e = document.querySelector('[title="' + t + '"][dir=auto]');
                            e && e.title && wacore.whatsapp.renderWhatsAppDom(e.title, e)
                        }
                        if ("number" == e) {
                            var a = wacore.whatsapp.getNameById(t);
                            let e = document.querySelector('[title="' + a + '"][dir=auto]');
                            e && e.title && wacore.whatsapp.renderWhatsAppDom(e.title, e)
                        }
                    } catch (e) {}
                },
                countAll: function() {
                    try {
                        let e = window.Store.Chat._models.filter((function(e) {
                            return !e.archive
                        }
                        ));
                        document.querySelectorAll(".count_tab_all").forEach((function(t) {
                            t.innerText = e.length
                        }
                        )),
                        window.wacore.format_translation.translateText();
                        let t = window.Store.Chat._models.filter((function(e) {
                            return !e.lastReceivedKey?.fromMe && !e.archive
                        }
                        ));
                        document.querySelectorAll(".count_tab_needs_user_reply").forEach((function(e) {
                            e.innerText = t.length
                        }
                        ));
                        let a = window.Store.Chat._models.filter((function(e) {
                            return e.lastReceivedKey?.fromMe && !e.archive
                        }
                        ));
                        document.querySelectorAll(".count_tab_client_awaiting_reply").forEach((function(e) {
                            e.innerText = a.length
                        }
                        ));
                        let n = window.Store.Chat._models.filter((function(e) {
                            return e.isGroup && !e.archive
                        }
                        ));
                        document.querySelectorAll(".count_tab_groups").forEach((function(e) {
                            e.innerText = n.length
                        }
                        ));
                        let o = window.Store.Chat._models.filter((function(e) {
                            return !e.isGroup && !e.archive
                        }
                        ));
                        document.querySelectorAll(".count_tab_1_1").forEach((function(e) {
                            e.innerText = o.length
                        }
                        ));
                        let s = window.Store.Chat._models.filter((function(e) {
                            return e.unreadCount && !e.archive
                        }
                        ));
                        document.querySelectorAll(".count_tab_unread").forEach((function(e) {
                            e.innerText = s.length
                        }
                        ))
                    } catch (e) {}
                },
                resetAll: function() {
                    try {
                        window.Store.Chat._models.filter((function(e) {
                            return !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !0
                        }
                        ))
                    } catch (e) {}
                },
                forceSortListChat: function() {
                    window.Store.Chat.sort()
                },
                doUpdatesChatList: function() {
                    wacore.whatsapp.forceSortListChat(),
                    setTimeout((()=>{
                        var e = window.wacore.function.exportList;
                        e.length > 50 && (e = e.slice(0, 50)),
                        e.forEach((function(e) {
                            e.number === wacore.channel ? wacore.whatsapp.manipulate_chatlist("number", `${e.number}@c.us`) : wacore.whatsapp.manipulate_chatlist("name", e.name)
                        }
                        ))
                    }
                    ), 100)
                },
                renderTabAll: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.archive || window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        ))
                    } catch (e) {}
                },
                renderUnread: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.unreadCount && e.unreadCount > 0 && !e.archive && window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return !(e.unreadCount && 0 != e.unreadCount || e.archive)
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderWaitingClientReply: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.lastReceivedKey && e.lastReceivedKey.fromMe && !e.archive && window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return e.lastReceivedKey && !e.lastReceivedKey.fromMe && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderWaitingUserReply: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            !e.lastReceivedKey || e.lastReceivedKey.fromMe || e.archive || window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return e.lastReceivedKey && e.lastReceivedKey.fromMe && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderGroups: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.isGroup && !e.archive && window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return !e.isGroup && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderOnetoOne: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.isGroup || e.archive || window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return e.isGroup && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderOfficial: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.contact.businessProfile || e.archive || window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return !e.contact.businessProfile && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderBroadCast: function() {
                    try {
                        window.wacore.function.exportList.length = 0,
                        window.Store.Chat._models.filter((function(e) {
                            e.isBroadcast || e.archive || window.wacore.function.exportList.push({
                                number: e.id?.user,
                                name: e.contact?.pushname || e.id?.user
                            })
                        }
                        )),
                        window.Store.Chat._models.filter((function(e) {
                            return !e.isBroadcast && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        ))
                    } catch (e) {}
                },
                renderSystemTab: function(e, t) {
                    try {
                        switch (t || wacore.function.forceCloseFocusedChat(),
                        wacore.whatsapp.resetAll(),
                        e) {
                        case "tab_all":
                            wacore.whatsapp.renderTabAll();
                            break;
                        case "tab_client_awaiting_reply":
                            wacore.whatsapp.renderWaitingClientReply();
                            break;
                        case "tab_needs_user_reply":
                            wacore.whatsapp.renderWaitingUserReply();
                            break;
                        case "tab_groups":
                            wacore.whatsapp.renderGroups();
                            break;
                        case "tab_1_1":
                            wacore.whatsapp.renderOnetoOne();
                            break;
                        case "tab_official_accounts":
                            wacore.whatsapp.renderOfficial();
                            break;
                        case "tab_broadcasts":
                            wacore.whatsapp.renderBroadCast();
                            break;
                        case "tab_unread":
                            wacore.whatsapp.renderUnread()
                        }
                        wacore.whatsapp.doUpdatesChatList()
                    } catch (e) {}
                },
                renderFilter: async function(e, t, a, n) {
                    window.wacore.curFilter = {
                        action: e,
                        type: t,
                        filterValue: a,
                        name: n
                    },
                    document.querySelectorAll(".chats-filter--active").forEach((function(e) {
                        e.classList.remove("chats-filter--active")
                    }
                    ));
                    var o = document.querySelector(".filterchange-title");
                    if ("system" == t && o) {
                        if (o && o.firstChild && 1 === o.firstChild.nodeType)
                            var s = o.firstChild.getAttribute("data-translate-key");
                        if (n.includes(" "))
                            return void (o.innerHTML = `<span data-translate-key=${s}>${n}</span><i class="count_` + a + '">0</i>');
                        o.innerHTML = `<span data-translate-key=${n}></span><i class="count_` + a + '">0</i>'
                    }
                    "users" == t && (document.querySelector(".filterchange-title").innerHTML = '<span style="display: inline-block;"><svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3.848 19h-.848c-.796 0-1.559-.316-2.121-.879-.563-.562-.879-1.325-.879-2.121v-3c0-7.175 5.377-13 12-13s12 5.825 12 13v3c0 .796-.316 1.559-.879 2.121-.562.563-1.325.879-2.121.879h-.848c-2.69 4.633-6.904 5-8.152 5-1.248 0-5.462-.367-8.152-5zm16.152-5.876c-.601.236-1.269-.18-1.269-.797 0-.304-.022-.61-.053-.915-1.761-.254-3.618-1.926-3.699-3.723-1.315 2.005-4.525 4.17-7.044 4.17 1.086-.699 1.839-2.773 1.903-3.508-.581 1.092-2.898 3.136-4.551 3.487l-.018.489c0 .619-.669 1.032-1.269.797v3.771c.287.256.632.464 1.041.594.225.072.412.224.521.424 2.206 4.046 5.426 4.087 6.438 4.087.929 0 3.719-.035 5.877-3.169-1.071.433-2.265.604-3.759.653-.37.6-1.18 1.016-2.118 1.016-1.288 0-2.333-.784-2.333-1.75s1.045-1.75 2.333-1.75c.933 0 1.738.411 2.112 1.005 1.9-.026 4.336-.334 5.888-2.645v-2.236zm-11-.624c.686 0 1.243.672 1.243 1.5s-.557 1.5-1.243 1.5-1.243-.672-1.243-1.5.557-1.5 1.243-1.5zm6 0c.686 0 1.243.672 1.243 1.5s-.557 1.5-1.243 1.5-1.243-.672-1.243-1.5.557-1.5 1.243-1.5zm5.478-1.5h1.357c-.856-5.118-4.937-9-9.835-9-4.898 0-8.979 3.882-9.835 9h1.357c.52-4.023 3.411-7.722 8.478-7.722s7.958 3.699 8.478 7.722z"></path></svg></span> <span style="display: inline-block;">' + n + "</span>"),
                    "tags" == t && (n.includes("changecolor") ? document.querySelector(".filterchange-title").innerHTML = '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle fill="' + a + '" cx="11.998" cy="11.998" fill-rule="nonzero" r="9.998"/></svg>' : document.querySelector(".filterchange-title").innerHTML = `<div class="cor_base_header cor_${a}" >${n}</div>`),
                    "list" == t && document.querySelector(".filterchange-title") && (document.querySelector(".filterchange-title").innerHTML = ' <span data-translate-key="alls"></span> <i class="count_tab_all">0</i>'),
                    "renderSystemTab" == e && window.wacore.whatsapp.renderSystemTab(a),
                    "renderTagsTab" == e && await window.wacore.whatsapp.renderTagsTab(a),
                    "renderOperatorTab" == e && await window.wacore.whatsapp.renderOperatorTab(a),
                    "renderListTab" == e && await window.wacore.whatsapp.renderListTab(a),
                    window.wacore.whatsapp.countAll()
                },
                renderListTab: async function(e, t) {
                    try {
                        var a = wacore.crm.cards.filter((t=>t.crmlist === e))
                          , n = [];
                        a.map((e=>n.push(e.id))),
                        window.wacore.function.exportList.length = 0;
                        for (const e of a)
                            if (e.id) {
                                const t = await window.wacore.whatsapp.getChat(e.id);
                                t && t.id && window.wacore.function.exportList.push({
                                    number: t.id?.user,
                                    name: t.contact?.pushname || t.id?.user
                                })
                            }
                        t || wacore.function.forceCloseFocusedChat(),
                        wacore.whatsapp.resetAll(),
                        window.Store.Chat._models.filter((function(e) {
                            return !n.includes(e.id._serialized) && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        )),
                        wacore.whatsapp.doUpdatesChatList()
                    } catch (e) {
                        console.log(e)
                    }
                },
                renderOperatorTab: async function(e, t) {
                    try {
                        var a = wacore.crm.getChatIdsByUser(e);
                        window.wacore.function.exportList.length = 0;
                        for (const e of a)
                            if (e) {
                                let t = await window.wacore.whatsapp.getChat(e);
                                t && t.id && window.wacore.function.exportList.push({
                                    number: t.id?.user,
                                    name: t.contact?.pushname || t.id?.user
                                })
                            }
                        t || wacore.function.forceCloseFocusedChat(),
                        wacore.whatsapp.resetAll(),
                        window.Store.Chat._models.filter((function(e) {
                            return !a.includes(e.id._serialized) && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        )),
                        wacore.whatsapp.doUpdatesChatList()
                    } catch (e) {}
                },
                renderTagsTab: async function(e, t) {
                    try {
                        var a = wacore.crm.getChatIdsFromTag(e);
                        window.wacore.function.exportList.length = 0;
                        for (const e of a) {
                            let t = await window.wacore.whatsapp.getChat(e);
                            t && t.id && window.wacore.function.exportList.push({
                                number: t.id?.user,
                                name: t.contact?.pushname || t.id?.user
                            })
                        }
                        t || wacore.function.forceCloseFocusedChat(),
                        wacore.whatsapp.resetAll(),
                        window.Store.Chat._models.filter((function(e) {
                            return !a.includes(e.id._serialized) && !e.archive
                        }
                        )).forEach((function(e) {
                            return e.__x_shouldAppearInList = !1
                        }
                        )),
                        wacore.whatsapp.doUpdatesChatList()
                    } catch (e) {}
                }
            }
        }
    }
      , t = {};
    function a(n) {
        var o = t[n];
        if (void 0 !== o)
            return o.exports;
        var s = t[n] = {
            exports: {}
        };
        return e[n](s, s.exports, a),
        s.exports
    }
    a(69),
    a(863),
    a(643),
    a(994),
    a(940),
    a(872),
    a(547),
    a(796),
    a(295),
    a(583),
    a(18),
    a(467),
    a(987),
    a(811),
    a(754),
    a(195),
    a(22),
    a(778),
    a(787)
}
)();
