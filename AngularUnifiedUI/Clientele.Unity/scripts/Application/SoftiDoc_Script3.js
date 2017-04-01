
/*
 * jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function ($, p) { var i, m = Array.prototype.slice, r = decodeURIComponent, a = $.param, c, l, v, b = $.bbq = $.bbq || {}, q, u, j, e = $.event.special, d = "hashchange", A = "querystring", D = "fragment", y = "elemUrlAttr", g = "location", k = "href", t = "src", x = /^.*\?|#.*$/g, w = /^.*\#/, h, C = {}; function E(F) { return typeof F === "string" } function B(G) { var F = m.call(arguments, 1); return function () { return G.apply(this, F.concat(m.call(arguments))) } } function n(F) { return F.replace(/^[^#]*#?(.*)$/, "$1") } function o(F) { return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/, "$1") } function f(H, M, F, I, G) { var O, L, K, N, J; if (I !== i) { K = F.match(H ? /^([^#]*)\#?(.*)$/ : /^([^#?]*)\??([^#]*)(#?.*)/); J = K[3] || ""; if (G === 2 && E(I)) { L = I.replace(H ? w : x, "") } else { N = l(K[2]); I = E(I) ? l[H ? D : A](I) : I; L = G === 2 ? I : G === 1 ? $.extend({}, I, N) : $.extend({}, N, I); L = a(L); if (H) { L = L.replace(h, r) } } O = K[1] + (H ? "#" : L || !K[1] ? "?" : "") + L + J } else { O = M(F !== i ? F : p[g][k]) } return O } a[A] = B(f, 0, o); a[D] = c = B(f, 1, n); c.noEscape = function (G) { G = G || ""; var F = $.map(G.split(""), encodeURIComponent); h = new RegExp(F.join("|"), "g") }; c.noEscape(",/"); $.deparam = l = function (I, F) { var H = {}, G = { "true": !0, "false": !1, "null": null }; $.each(I.replace(/\+/g, " ").split("&"), function (L, Q) { var K = Q.split("="), P = r(K[0]), J, O = H, M = 0, R = P.split("]["), N = R.length - 1; if (/\[/.test(R[0]) && /\]$/.test(R[N])) { R[N] = R[N].replace(/\]$/, ""); R = R.shift().split("[").concat(R); N = R.length - 1 } else { N = 0 } if (K.length === 2) { J = r(K[1]); if (F) { J = J && !isNaN(J) ? +J : J === "undefined" ? i : G[J] !== i ? G[J] : J } if (N) { for (; M <= N; M++) { P = R[M] === "" ? O.length : R[M]; O = O[P] = M < N ? O[P] || (R[M + 1] && isNaN(R[M + 1]) ? {} : []) : J } } else { if ($.isArray(H[P])) { H[P].push(J) } else { if (H[P] !== i) { H[P] = [H[P], J] } else { H[P] = J } } } } else { if (P) { H[P] = F ? i : "" } } }); return H }; function z(H, F, G) { if (F === i || typeof F === "boolean") { G = F; F = a[H ? D : A]() } else { F = E(F) ? F.replace(H ? w : x, "") : F } return l(F, G) } l[A] = B(z, 0); l[D] = v = B(z, 1); $[y] || ($[y] = function (F) { return $.extend(C, F) })({ a: k, base: k, iframe: t, img: t, input: t, form: "action", link: k, script: t }); j = $[y]; function s(I, G, H, F) { if (!E(H) && typeof H !== "object") { F = H; H = G; G = i } return this.each(function () { var L = $(this), J = G || j()[(this.nodeName || "").toLowerCase()] || "", K = J && L.attr(J) || ""; L.attr(J, a[I](K, H, F)) }) } $.fn[A] = B(s, A); $.fn[D] = B(s, D); b.pushState = q = function (I, F) { if (E(I) && /^#/.test(I) && F === i) { F = 2 } var H = I !== i, G = c(p[g][k], H ? I : {}, H ? F : 2); p[g][k] = G + (/#/.test(G) ? "" : "#") }; b.getState = u = function (F, G) { return F === i || typeof F === "boolean" ? v(F) : v(G)[F] }; b.removeState = function (F) { var G = {}; if (F !== i) { G = u(); $.each($.isArray(F) ? F : arguments, function (I, H) { delete G[H] }) } q(G, 2) }; e[d] = $.extend(e[d], { add: function (F) { var H; function G(J) { var I = J[D] = c(); J.getState = function (K, L) { return K === i || typeof K === "boolean" ? l(I, K) : l(I, L)[K] }; H.apply(this, arguments) } if ($.isFunction(F)) { H = F; return G } else { H = F.handler; F.handler = G } } }) })(jQuery, this);
/*
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function ($, i, b) { var j, k = $.event.special, c = "location", d = "hashchange", l = "href", f = $.browser, g = document.documentMode, h = f.msie && (g === b || g < 8), e = "on" + d in i && !h; function a(m) { m = m || i[c][l]; return m.replace(/^[^#]*#?(.*)$/, "$1") } $[d + "Delay"] = 100; k[d] = $.extend(k[d], { setup: function () { if (e) { return false } $(j.start) }, teardown: function () { if (e) { return false } $(j.stop) } }); j = (function () { var m = {}, r, n, o, q; function p() { o = q = function (s) { return s }; if (h) { n = $('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow; q = function () { return a(n.document[c][l]) }; o = function (u, s) { if (u !== s) { var t = n.document; t.open().close(); t[c].hash = "#" + u } }; o(a()) } } m.start = function () { if (r) { return } var t = a(); o || p(); (function s() { var v = a(), u = q(t); if (v !== t) { o(t = v, u); $(i).trigger(d) } else { if (u !== t) { i[c][l] = i[c][l].replace(/#.*/, "") + "#" + u } } r = setTimeout(s, $[d + "Delay"]) })() }; m.stop = function () { if (!n) { r && clearTimeout(r); r = 0 } }; return m })() })(jQuery, this);
;/**/
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/jquery_update/replace/ui/external/jquery.cookie.js. */
jQuery.cookie = function (key, value, options) {
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options); if (value === null) { options.expires = -1; }
        if (typeof options.expires === 'number') { var days = options.expires, t = options.expires = new Date(); t.setDate(t.getDate() + days); }
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    options = value || {}; var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent; return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/jquery_update/replace/ui/external/jquery.cookie.js. */
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/visitor_actions/modules/visitor_actions_ui/js/jquery/ducktape.events.js. */
if (!Drupal.jQuery.fn.on && !Drupal.jQuery.fn.off) {
    Drupal.jQuery.fn.on = function (types, selector, data, fn) {
        if (typeof selector !== "string") { return this.bind(types, selector, data); }
        else { return this.delegate(selector, types, data, fn); }
    }; Drupal.jQuery.fn.off = function (types, selector, fn) {
        if (typeof selector !== "string") { return this.unbind(types, selector, fn); }
        else { return this.undelegate(selector, types, fn); }
    };
};;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/visitor_actions/modules/visitor_actions_ui/js/jquery/ducktape.events.js. */
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/misc/ajax.js. */
(function ($) {
    Drupal.ajax = Drupal.ajax || {}; Drupal.settings.urlIsAjaxTrusted = Drupal.settings.urlIsAjaxTrusted || {}; Drupal.behaviors.AJAX = {
        attach: function (context, settings) {
            for (var base in settings.ajax) {
                if (!$('#' + base + '.ajax-processed').length) {
                    var element_settings = settings.ajax[base]; if (typeof element_settings.selector == 'undefined') { element_settings.selector = '#' + base; }
                    $(element_settings.selector).each(function () { element_settings.element = this; Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings); }); $('#' + base).addClass('ajax-processed');
                }
            }
            $('.use-ajax:not(.ajax-processed)').addClass('ajax-processed').each(function () {
                var element_settings = {}; element_settings.progress = { 'type': 'throbber' }; if ($(this).attr('href')) { element_settings.url = $(this).attr('href'); element_settings.event = 'click'; }
                var base = $(this).attr('id'); Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
            }); $('.use-ajax-submit:not(.ajax-processed)').addClass('ajax-processed').each(function () { var element_settings = {}; element_settings.url = $(this.form).attr('action'); element_settings.setClick = true; element_settings.event = 'click'; element_settings.progress = { 'type': 'throbber' }; var base = $(this).attr('id'); Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings); });
        }
    }; Drupal.ajax = function (base, element, element_settings) {
        var defaults = { url: 'system/ajax', event: 'mousedown', keypress: true, selector: '#' + base, effect: 'none', speed: 'none', method: 'replaceWith', progress: { type: 'throbber', message: Drupal.t('Please wait...') }, submit: { 'js': true } }; $.extend(this, defaults, element_settings); this.element = element; this.element_settings = element_settings; this.url = element_settings.url.replace(/\/nojs(\/|$|\?|&|#)/g, '/ajax$1'); if (Drupal.settings.urlIsAjaxTrusted[element_settings.url]) { Drupal.settings.urlIsAjaxTrusted[this.url] = true; }
        this.wrapper = '#' + element_settings.wrapper; if (this.element.form) { this.form = $(this.element.form); }
        var ajax = this; ajax.options = {
            url: ajax.url, data: ajax.submit, beforeSerialize: function (element_settings, options) { return ajax.beforeSerialize(element_settings, options); }, beforeSubmit: function (form_values, element_settings, options) { ajax.ajaxing = true; return ajax.beforeSubmit(form_values, element_settings, options); }, beforeSend: function (xmlhttprequest, options) { ajax.ajaxing = true; return ajax.beforeSend(xmlhttprequest, options); }, success: function (response, status, xmlhttprequest) {
                if (typeof response == 'string') { response = $.parseJSON(response); }
                if (response !== null && !Drupal.settings.urlIsAjaxTrusted[ajax.url]) { if (xmlhttprequest.getResponseHeader('X-Drupal-Ajax-Token') !== '1') { var customMessage = Drupal.t("The response failed verification so will not be processed."); return ajax.error(xmlhttprequest, ajax.url, customMessage); } }
                return ajax.success(response, status);
            }, complete: function (xmlhttprequest, status) { ajax.ajaxing = false; if (status == 'error' || status == 'parsererror') { return ajax.error(xmlhttprequest, ajax.url); } }, dataType: 'json', type: 'POST'
        }; $(ajax.element).bind(element_settings.event, function (event) {
            if (!Drupal.settings.urlIsAjaxTrusted[ajax.url] && !Drupal.urlIsLocal(ajax.url)) { throw new Error(Drupal.t('The callback URL is not local and not trusted: !url', { '!url': ajax.url })); }
            return ajax.eventResponse(this, event);
        }); if (element_settings.keypress) { $(ajax.element).keypress(function (event) { return ajax.keypressResponse(this, event); }); }
        if (element_settings.prevent) { $(ajax.element).bind(element_settings.prevent, false); }
    }; Drupal.ajax.prototype.keypressResponse = function (element, event) { var ajax = this; if (event.which == 13 || (event.which == 32 && element.type != 'text' && element.type != 'textarea')) { $(ajax.element_settings.element).trigger(ajax.element_settings.event); return false; } }; Drupal.ajax.prototype.eventResponse = function (element, event) {
        var ajax = this; if (ajax.ajaxing) { return false; }
        try {
            if (ajax.form) {
                if (ajax.setClick) { element.form.clk = element; }
                ajax.form.ajaxSubmit(ajax.options);
            }
            else { ajax.beforeSerialize(ajax.element, ajax.options); $.ajax(ajax.options); }
        }
        catch (e) { ajax.ajaxing = false; alert("An error occurred while attempting to process " + ajax.options.url + ": " + e.message); }
        if (typeof element.type != 'undefined' && (element.type == 'checkbox' || element.type == 'radio')) { return true; }
        else { return false; }
    }; Drupal.ajax.prototype.beforeSerialize = function (element, options) {
        if (this.form) { var settings = this.settings || Drupal.settings; Drupal.detachBehaviors(this.form, settings, 'serialize'); }
        options.data['ajax_html_ids[]'] = []; $('[id]').each(function () { options.data['ajax_html_ids[]'].push(this.id); }); options.data['ajax_page_state[theme]'] = Drupal.settings.ajaxPageState.theme; options.data['ajax_page_state[theme_token]'] = Drupal.settings.ajaxPageState.theme_token; for (var key in Drupal.settings.ajaxPageState.css) { options.data['ajax_page_state[css][' + key + ']'] = 1; }
        for (var key in Drupal.settings.ajaxPageState.js) { options.data['ajax_page_state[js][' + key + ']'] = 1; }
    }; Drupal.ajax.prototype.beforeSubmit = function (form_values, element, options) { }; Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
        if (this.form) { options.extraData = options.extraData || {}; options.extraData.ajax_iframe_upload = '1'; var v = $.fieldValue(this.element); if (v !== null) { options.extraData[this.element.name] = Drupal.checkPlain(v); } }
        $(this.element).addClass('progress-disabled').attr('disabled', true); if (this.progress.type == 'bar') {
            var progressBar = new Drupal.progressBar('ajax-progress-' + this.element.id, eval(this.progress.update_callback), this.progress.method, eval(this.progress.error_callback)); if (this.progress.message) { progressBar.setProgress(-1, this.progress.message); }
            if (this.progress.url) { progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500); }
            this.progress.element = $(progressBar.element).addClass('ajax-progress ajax-progress-bar'); this.progress.object = progressBar; $(this.element).after(this.progress.element);
        }
        else if (this.progress.type == 'throbber') {
            this.progress.element = $('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>'); if (this.progress.message) { $('.throbber', this.progress.element).after('<div class="message">' + this.progress.message + '</div>'); }
            $(this.element).after(this.progress.element);
        }
    }; Drupal.ajax.prototype.success = function (response, status) {
        if (this.progress.element) { $(this.progress.element).remove(); }
        if (this.progress.object) { this.progress.object.stopMonitoring(); }
        $(this.element).removeClass('progress-disabled').removeAttr('disabled'); Drupal.freezeHeight(); for (var i in response) { if (response.hasOwnProperty(i) && response[i]['command'] && this.commands[response[i]['command']]) { this.commands[response[i]['command']](this, response[i], status); } }
        if (this.form) { var settings = this.settings || Drupal.settings; Drupal.attachBehaviors(this.form, settings); }
        Drupal.unfreezeHeight(); this.settings = null;
    }; Drupal.ajax.prototype.getEffect = function (response) {
        var type = response.effect || this.effect; var speed = response.speed || this.speed; var effect = {}; if (type == 'none') { effect.showEffect = 'show'; effect.hideEffect = 'hide'; effect.showSpeed = ''; }
        else if (type == 'fade') { effect.showEffect = 'fadeIn'; effect.hideEffect = 'fadeOut'; effect.showSpeed = speed; }
        else { effect.showEffect = type + 'Toggle'; effect.hideEffect = type + 'Toggle'; effect.showSpeed = speed; }
        return effect;
    }; Drupal.ajax.prototype.error = function (xmlhttprequest, uri, customMessage) {
        Drupal.displayAjaxError(Drupal.ajaxError(xmlhttprequest, uri, customMessage)); if (this.progress.element) { $(this.progress.element).remove(); }
        if (this.progress.object) { this.progress.object.stopMonitoring(); }
        $(this.wrapper).show(); $(this.element).removeClass('progress-disabled').removeAttr('disabled'); if (this.form) { var settings = this.settings || Drupal.settings; Drupal.attachBehaviors(this.form, settings); }
    }; Drupal.ajax.prototype.commands = {
        insert: function (ajax, response, status) {
            var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper); var method = response.method || ajax.method; var effect = ajax.getEffect(response); var new_content_wrapped = $('<div></div>').html(response.data); var new_content = new_content_wrapped.contents(); if (new_content.length != 1 || new_content.get(0).nodeType != 1) { new_content = new_content_wrapped; }
            switch (method) { case 'html': case 'replaceWith': case 'replaceAll': case 'empty': case 'remove': var settings = response.settings || ajax.settings || Drupal.settings; Drupal.detachBehaviors(wrapper, settings); }
            wrapper[method](new_content); if (effect.showEffect != 'show') { new_content.hide(); }
            if ($('.ajax-new-content', new_content).length > 0) { $('.ajax-new-content', new_content).hide(); new_content.show(); $('.ajax-new-content', new_content)[effect.showEffect](effect.showSpeed); }
            else if (effect.showEffect != 'show') { new_content[effect.showEffect](effect.showSpeed); }
            if (new_content.parents('html').length > 0) { var settings = response.settings || ajax.settings || Drupal.settings; Drupal.attachBehaviors(new_content, settings); }
        }, remove: function (ajax, response, status) { var settings = response.settings || ajax.settings || Drupal.settings; Drupal.detachBehaviors($(response.selector), settings); $(response.selector).remove(); }, changed: function (ajax, response, status) { if (!$(response.selector).hasClass('ajax-changed')) { $(response.selector).addClass('ajax-changed'); if (response.asterisk) { $(response.selector).find(response.asterisk).append(' <span class="ajax-changed">*</span> '); } } }, alert: function (ajax, response, status) { alert(response.text, response.title); }, css: function (ajax, response, status) { $(response.selector).css(response.argument); }, settings: function (ajax, response, status) {
            if (response.merge) { $.extend(true, Drupal.settings, response.settings); }
            else { ajax.settings = response.settings; }
        }, data: function (ajax, response, status) { $(response.selector).data(response.name, response.value); }, invoke: function (ajax, response, status) { var $element = $(response.selector); $element[response.method].apply($element, response.arguments); }, restripe: function (ajax, response, status) { $('> tbody > tr:visible, > tr:visible', $(response.selector)).removeClass('odd even').filter(':even').addClass('odd').end().filter(':odd').addClass('even'); }, add_css: function (ajax, response, status) { $('head').prepend(response.data); var match, importMatch = /^@import url\("(.*)"\);$/igm; if (document.styleSheets[0].addImport && importMatch.test(response.data)) { importMatch.lastIndex = 0; while (match = importMatch.exec(response.data)) { document.styleSheets[0].addImport(match[1]); } } }, updateBuildId: function (ajax, response, status) { $('input[name="form_build_id"][value="' + response['old'] + '"]').val(response['new']); }
    };
})(jQuery);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/misc/ajax.js. */
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/jquery_update/js/jquery_update.js. */
(function (D) { var beforeSerialize = D.ajax.prototype.beforeSerialize; D.ajax.prototype.beforeSerialize = function (element, options) { beforeSerialize.call(this, element, options); options.data['ajax_page_state[jquery_version]'] = D.settings.ajaxPageState.jquery_version; } })(Drupal);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/jquery_update/js/jquery_update.js. */
0
