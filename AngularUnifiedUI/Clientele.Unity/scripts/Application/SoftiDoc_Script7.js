/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/personalize/js/personalize.storage.js. */
'use strict'; (function (Drupal) {
    Drupal.personalizeStorage = (function () {
        var keyListKey = 'personalize::storage::keys'; function _getStore(session) { session = session === undefined ? true : session; return session ? sessionStorage : localStorage; }
        function _getTrackedKeys(session) {
            var store = _getStore(session); var keys = store.getItem(keyListKey); if (keys) { keys = JSON.parse(keys); } else { keys = []; }
            return keys;
        }
        function _addToKeyList(key, session) { var store = _getStore(session); var keys = _getTrackedKeys(session); keys.push(key); store.setItem(keyListKey, JSON.stringify(keys)); }
        function _removeFromKeyList(key, session) {
            var store = _getStore(session); var keys = _getTrackedKeys(session); var index = keys.indexOf(key); if (index > -1) { keys.splice(index, 1); }
            store.setItem(keyListKey, JSON.stringify(keys));
        }
        function _pruneOldest(session, numEntries) { numEntries = numEntries || 10; var keys = _getTrackedKeys(session); var totalKeys = keys.length; var until = totalKeys > numEntries ? totalKeys - numEntries : 0; var key, i; for (i = totalKeys; i >= until; i--) { key = keys.pop(); _remove(key, session); } }
        function _write(key, value, session) { var store = _getStore(session); store.setItem(key, JSON.stringify(value)); _addToKeyList(key, session); }
        function _remove(key, session) { var store = _getStore(session); store.removeItem(key); _removeFromKeyList(key, session); }
        return {
            keyListKey: keyListKey, supportsLocalStorage: function () {
                if (this.supportsHtmlLocalStorage !== undefined) { return this.supportsHtmlLocalStorage; }
                try { this.supportsHtmlLocalStorage = window.hasOwnProperty('localStorage') && window.localStorage !== null; } catch (e) { this.supportsHtmlLocalStorage = false; }
                return this.supportsHtmlLocalStorage;
            }, read: function (key, session) {
                if (!this.supportsLocalStorage()) { return null; }
                var store = _getStore(session), stored = store.getItem(key), record; if (stored) { record = JSON.parse(stored); if (record !== undefined) { return record; } }
                return null;
            }, write: function (key, value, session) {
                if (!this.supportsLocalStorage()) { return; }
                _remove(key, session); try { _write(key, value, session); } catch (e) {
                    if (e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        _pruneOldest(session); try { _write(key, value, session); } catch (e2) { console.error('Failed to write to storage, unhandled exception: ', e2); }
                        return;
                    }
                    console.error('Failed to write to storage, unhandled exception: ', e);
                }
            }, remove: function (key, session) {
                if (!this.supportsLocalStorage()) { return; }
                _remove(key, session);
            }, clearStorage: function (prefix, session) {
                if (!this.supportsLocalStorage()) { return; }
                var store = _getStore(session), i = store.length, key; while (i--) { key = store.key(i); if (key.indexOf(prefix) === 0) { _remove(key, session); } }
            }
        };
    })();
})(Drupal);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/personalize/js/personalize.storage.js. */
!function () { var a, b, c, d; !function () { var e = {}, f = {}; a = function (a, b, c) { e[a] = { deps: b, callback: c } }, d = c = b = function (a) { function c(b) { if ("." !== b.charAt(0)) return b; for (var c = b.split("/"), d = a.split("/").slice(0, -1), e = 0, f = c.length; f > e; e++) { var g = c[e]; if (".." === g) d.pop(); else { if ("." === g) continue; d.push(g) } } return d.join("/") } if (d._eak_seen = e, f[a]) return f[a]; if (f[a] = {}, !e[a]) throw new Error("Could not find module " + a); for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++) "exports" === i[l] ? k.push(g = {}) : k.push(b(c(i[l]))); var n = j.apply(this, k); return f[a] = g || n } }(), a("promise/all", ["./utils", "exports"], function (a, b) { "use strict"; function c(a) { var b = this; if (!d(a)) throw new TypeError("You must pass an array to all."); return new b(function (b, c) { function d(a) { return function (b) { f(a, b) } } function f(a, c) { h[a] = c, 0 === --i && b(h) } var g, h = [], i = a.length; 0 === i && b([]); for (var j = 0; j < a.length; j++) g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g) }) } var d = a.isArray, e = a.isFunction; b.all = c }), a("promise/asap", ["exports"], function (a) { "use strict"; function b() { return function () { process.nextTick(e) } } function c() { var a = 0, b = new i(e), c = document.createTextNode(""); return b.observe(c, { characterData: !0 }), function () { c.data = a = ++a % 2 } } function d() { return function () { j.setTimeout(e, 1) } } function e() { for (var a = 0; a < k.length; a++) { var b = k[a], c = b[0], d = b[1]; c(d) } k = [] } function f(a, b) { var c = k.push([a, b]); 1 === c && g() } var g, h = "undefined" != typeof window ? window : {}, i = h.MutationObserver || h.WebKitMutationObserver, j = "undefined" != typeof global ? global : void 0 === this ? window : this, k = []; g = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? b() : i ? c() : d(), a.asap = f }), a("promise/config", ["exports"], function (a) { "use strict"; function b(a, b) { return 2 !== arguments.length ? c[a] : (c[a] = b, void 0) } var c = { instrument: !1 }; a.config = c, a.configure = b }), a("promise/polyfill", ["./promise", "./utils", "exports"], function (a, b, c) { "use strict"; function d() { var a; a = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self; var b = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function () { var b; return new a.Promise(function (a) { b = a }), f(b) }(); b || (a.Promise = e) } var e = a.Promise, f = b.isFunction; c.polyfill = d }), a("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function (a, b, c, d, e, f, g, h) { "use strict"; function i(a) { if (!v(a)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor"); if (!(this instanceof i)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); this._subscribers = [], j(a, this) } function j(a, b) { function c(a) { o(b, a) } function d(a) { q(b, a) } try { a(c, d) } catch (e) { d(e) } } function k(a, b, c, d) { var e, f, g, h, i = v(c); if (i) try { e = c(d), g = !0 } catch (j) { h = !0, f = j } else e = d, g = !0; n(b, e) || (i && g ? o(b, e) : h ? q(b, f) : a === D ? o(b, e) : a === E && q(b, e)) } function l(a, b, c, d) { var e = a._subscribers, f = e.length; e[f] = b, e[f + D] = c, e[f + E] = d } function m(a, b) { for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3) c = e[g], d = e[g + b], k(b, c, d, f); a._subscribers = null } function n(a, b) { var c, d = null; try { if (a === b) throw new TypeError("A promises callback cannot return that same promise."); if (u(b) && (d = b.then, v(d))) return d.call(b, function (d) { return c ? !0 : (c = !0, b !== d ? o(a, d) : p(a, d), void 0) }, function (b) { return c ? !0 : (c = !0, q(a, b), void 0) }), !0 } catch (e) { return c ? !0 : (q(a, e), !0) } return !1 } function o(a, b) { a === b ? p(a, b) : n(a, b) || p(a, b) } function p(a, b) { a._state === B && (a._state = C, a._detail = b, t.async(r, a)) } function q(a, b) { a._state === B && (a._state = C, a._detail = b, t.async(s, a)) } function r(a) { m(a, a._state = D) } function s(a) { m(a, a._state = E) } var t = a.config, u = (a.configure, b.objectOrFunction), v = b.isFunction, w = (b.now, c.all), x = d.race, y = e.resolve, z = f.reject, A = g.asap; t.async = A; var B = void 0, C = 0, D = 1, E = 2; i.prototype = { constructor: i, _state: void 0, _detail: void 0, _subscribers: void 0, then: function (a, b) { var c = this, d = new this.constructor(function () { }); if (this._state) { var e = arguments; t.async(function () { k(c._state, d, e[c._state - 1], c._detail) }) } else l(this, d, a, b); return d }, "catch": function (a) { return this.then(null, a) } }, i.all = w, i.race = x, i.resolve = y, i.reject = z, h.Promise = i }), a("promise/race", ["./utils", "exports"], function (a, b) { "use strict"; function c(a) { var b = this; if (!d(a)) throw new TypeError("You must pass an array to race."); return new b(function (b, c) { for (var d, e = 0; e < a.length; e++) d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d) }) } var d = a.isArray; b.race = c }), a("promise/reject", ["exports"], function (a) { "use strict"; function b(a) { var b = this; return new b(function (b, c) { c(a) }) } a.reject = b }), a("promise/resolve", ["exports"], function (a) { "use strict"; function b(a) { if (a && "object" == typeof a && a.constructor === this) return a; var b = this; return new b(function (b) { b(a) }) } a.resolve = b }), a("promise/utils", ["exports"], function (a) { "use strict"; function b(a) { return c(a) || "object" == typeof a && null !== a } function c(a) { return "function" == typeof a } function d(a) { return "[object Array]" === Object.prototype.toString.call(a) } var e = Date.now || function () { return (new Date).getTime() }; a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e }), b("promise/polyfill").polyfill() }();;/**/
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/personalize/js/personalize.js. */
(function ($) {
    var cookieName = 'drupal-personalize'; Drupal.personalize = Drupal.personalize || {}; Drupal.personalize.contextTimeout = Drupal.personalize.contextTimeout || 5000; var sessionId = false; Drupal.personalize.initializeSessionID = function () {
        if (sessionId) { return sessionId; }
        var storedId = $.cookie(cookieName); if (storedId) { sessionId = storedId; }
        else if (Drupal.settings.personalize.sessionID) { sessionId = Drupal.settings.personalize.sessionID; }
        return sessionId;
    }; Drupal.personalize.saveSessionID = function (session_id) { sessionId = session_id; $.cookie(cookieName, session_id); }; var adminMode = null; Drupal.personalize.isAdminMode = function () {
        if (adminMode == null) { adminMode = Drupal.settings.personalize.hasOwnProperty('adminMode'); }
        return adminMode;
    }; var DNT = null; Drupal.personalize.DNTenabled = function () {
        if (DNT == null) { DNT = false; }
        return DNT;
    }; var debugMode = null; Drupal.personalize.isDebugMode = function () {
        if (debugMode === null) { debugMode = Drupal.settings.personalize.debugMode && (Drupal.personalize.isAdminMode() || $.cookie('personalizeDebugMode')); }
        return debugMode;
    }; var processedDecisions = {}, decisionCallbacks = {}, processedOptionSets = {}, processingOptionSets = {}; var TimeoutPromise = function (timeoutMS, promise) { var isTimedOut = false, isResolved = false; return new Promise(function (resolve, reject) { setTimeout(function () { isTimedOut = true; if (!isResolved) { reject(new Error("Promise timed out")); } }, timeoutMS); promise.then(function (response) { isResolved = true; if (!isTimedOut) { resolve(response) } }, function (error) { isResolved = true; if (!isTimedOut) { reject(error); } }); }); }
    Drupal.personalize.getVisitorContexts = function (contexts, callback) {
        var contextPromises = []; var promisePlugins = []; var contextValues = {}; for (var plugin in contexts) { if (contexts.hasOwnProperty(plugin)) { var contextResult = getVisitorContext(plugin, contexts[plugin]); if (contextResult instanceof Promise) { promisePlugins.push(plugin); contextPromises.push(new TimeoutPromise(Drupal.personalize.contextTimeout, contextResult)); } else { contextValues[plugin] = contextResult; } } }
        if (contextPromises.length == 0) { callback(contextValues); return; }
        Promise.all(contextPromises).then(function processLoadedVisitorContexts(loadedContexts) { var num = loadedContexts.length; for (var i = 0; i < num; i++) { contextValues[promisePlugins[i]] = loadedContexts[i]; } }, function handleErrorContexts(err) { if (console.log) { console.log(err.message); } }).then(function () { callback(contextValues); });
    }; var processedListeners = {}; Drupal.behaviors.personalize = {
        attach: function (context, settings) {
            settings.personalize = settings.personalize || {}; Drupal.personalize.initializeSessionID(); Drupal.personalize.storage.utilities.maintain(); Drupal.personalize.personalizePage(settings); if (!Drupal.personalize.isAdminMode()) { Drupal.personalize.sendGoals(settings); }
            addActionListener(settings); $(document).bind('visitorActionsBindActions', function (e, boundActions) { for (var action in boundActions) { if (boundActions.hasOwnProperty(action) && processedListeners.hasOwnProperty(action)) { if (boundActions[action] == null || (boundActions[action] instanceof jQuery && boundActions[action].length == 0)) { Drupal.personalize.debug('Element goal ' + action + ' has no DOM element on this page.', 3001); } } } });
        }
    }; Drupal.personalize.personalizePage = function (settings) {
        var optionSets = prepareOptionSets(settings); var agents = processOptionSets(optionSets); if (!$.isEmptyObject(agents)) {
            var contexts = getAgentsContexts(agents); var callback = function (contextValues) {
                for (var agentName in agents) {
                    if (!agents.hasOwnProperty(agentName)) { continue; }
                    var agent = agents[agentName]; var agentContexts = {}; for (var plugin in agent.enabledContexts) { if (agent.enabledContexts.hasOwnProperty(plugin)) { if (contextValues.hasOwnProperty(plugin) && !$.isEmptyObject(contextValues[plugin])) { agentContexts[plugin] = contextValues[plugin]; } } }
                    agent.visitorContext = Drupal.personalize.evaluateContexts(agent.agentType, agentContexts, agent.fixedTargeting);
                }
                triggerDecisions(agents);
            }; Drupal.personalize.getVisitorContexts(contexts, callback);
        }
    }; function debugGoal(goal_name, agent_name, value) { Drupal.personalize.debug('Sending goal ' + goal_name + ' to agent ' + agent_name + ' with value ' + value, 2010); }
    Drupal.personalize.sendGoals = function (settings) {
        if (settings.personalize.goals_attained) {
            for (var agent_name in settings.personalize.goals_attained) {
                if (settings.personalize.goals_attained.hasOwnProperty(agent_name)) {
                    var agent = settings.personalize.agent_map[agent_name]; if (!Drupal.personalize.agents.hasOwnProperty(agent.type)) { continue; }
                    for (var i in settings.personalize.goals_attained[agent_name]) {
                        if (settings.personalize.goals_attained[agent_name].hasOwnProperty(i) && !settings.personalize.goals_attained[agent_name][i].processed) {
                            Drupal.personalize.agents[agent.type].sendGoalToAgent(agent_name, settings.personalize.goals_attained[agent_name][i].name, settings.personalize.goals_attained[agent_name][i].value); settings.personalize.goals_attained[agent_name][i].processed = 1; debugGoal(settings.personalize.goals_attained[agent_name][i].name, agent_name, settings.personalize.goals_attained[agent_name][i].value)
                            $(document).trigger('sentGoalToAgent', [agent_name, settings.personalize.goals_attained[agent_name][i].name, settings.personalize.goals_attained[agent_name][i].value]);
                        }
                    }
                }
            }
        }
    }; Drupal.personalize.executors = Drupal.personalize.executors || {}; Drupal.personalize.executors.show = {
        'execute': function ($option_sets, choice_name, osid, preview) {
            if ($option_sets.length == 0) { return; }
            $option_sets.each(function () {
                var $option_set = $(this); var noscripthtml = '', choices = null, winner = ''; var $option_source = $('script[type="text/template"]', $option_set); if ($option_source.length == 0) { $option_source = $(document).find('script[data-personalize-script=' + osid + ']'); }
                if ($option_source.length != 0) {
                    var element = $option_source.get(0); noscripthtml = $option_source.prev('noscript').text(); var json = element.innerText; if (typeof preview === 'undefined') { preview = false; }; if (json === undefined || json.length == 0) { json = element.text; }
                    choices = jQuery.parseJSON(json);
                }
                else { noscripthtml = $option_set.find('noscript').text(); }
                if (choices == null || choices === false || !choices.hasOwnProperty(choice_name)) { winner = noscripthtml; }
                else if (!choices[choice_name].hasOwnProperty('html')) {
                    var controlOptionName = Drupal.settings.personalize.controlOptionName; if (choices.hasOwnProperty(controlOptionName) && choices[controlOptionName].hasOwnProperty('html')) { winner = choices[controlOptionName]['html']; }
                    else { winner = noscripthtml; }
                }
                else if (choices[choice_name]['html'].length == 0) { winner = noscripthtml; }
                else { winner = choices[choice_name]['html']; }
                $option_set.empty().append($option_source); $option_set.append(winner);
            }); Drupal.personalize.executorCompleted($option_sets, choice_name, osid); var bread = document; var circus = Drupal.settings; Drupal.attachBehaviors(bread, circus);
        }
    }; Drupal.personalize.executorCompleted = function ($option_set, option_name, osid) { $(document).trigger('personalizeOptionChange', [$option_set, option_name, osid]); }; Drupal.personalize.executors.callback = {
        'execute': function ($option_set, choice_name, osid, preview) {
            if ($option_set.length == 0) { return; }
            var custom_settings = {}; custom_settings.url = Drupal.settings.basePath + Drupal.settings.pathPrefix + 'personalize/option_set/' + osid + '/' + choice_name + '/ajax'; custom_settings.event = 'onload'; custom_settings.keypress = false; custom_settings.prevent = false; if (preview !== true) { custom_settings.progress = { message: '', type: 'none' }; }
            var callback_action = new Drupal.ajax(null, $option_set, custom_settings); try { $.ajax(callback_action.options); }
            catch (err) { var defaultHtml = $option_set.next('noscript').text(); $option_set.html(defaultHtml); $option_set.next('noscript').remove(); return false; }
        }
    }
    Drupal.personalize.agents = Drupal.personalize.agents || {}; Drupal.personalize.agents.default_agent = {
        'getDecisionsForPoint': function (name, visitor_context, choices, decision_point, callback) {
            var j, decisions = {}; for (j in choices) {
                if (choices.hasOwnProperty(j)) { decisions[j] = choices[j][0]; }
                callback(decisions);
            }
        }, 'sendGoalToAgent': function (agent_name, goal_name, value) { }, 'featureToContext': function (featureString) { var contextArray = featureString.split('::'); return { 'key': contextArray[0], 'value': contextArray[1] } }
    }; function getAgentsContexts(agents) {
        var contexts = {}; for (var agentName in agents) {
            if (!agents.hasOwnProperty(agentName)) { continue; }
            var agent = agents[agentName]; for (var pluginName in agent.enabledContexts) {
                if (agent.enabledContexts.hasOwnProperty(pluginName)) {
                    var plugin = agent.enabledContexts[pluginName]; if (!contexts.hasOwnProperty(pluginName)) { contexts[pluginName] = {}; }
                    for (var context in plugin) { if (plugin.hasOwnProperty(context)) { contexts[pluginName][context] = plugin[context]; } }
                }
            }
        }
        return contexts;
    }
    function getVisitorContext(plugin, context) {
        var visitor_context = Drupal.personalize.visitor_context; if (visitor_context.hasOwnProperty(plugin) && typeof visitor_context[plugin].getContext === 'function') { return visitor_context[plugin].getContext(context); }
        return null;
    }
    Drupal.personalize.evaluateContexts = function (agentType, visitorContext, featureRules) {
        if (!Drupal.personalize.agents.hasOwnProperty(agentType)) { return {}; }
        var newVisitorContext = {}; for (var pluginName in visitorContext) { if (visitorContext.hasOwnProperty(pluginName)) { for (var contextKey in visitorContext[pluginName]) { if (visitorContext[pluginName].hasOwnProperty(contextKey)) { newVisitorContext[contextKey] = [visitorContext[pluginName][contextKey]]; } } } }
        if (typeof Drupal.personalize.agents[agentType].featureToContext !== 'function') { return newVisitorContext; }
        if (typeof featureRules !== 'undefined') { for (var featureName in featureRules) { if (featureRules.hasOwnProperty(featureName)) { var key = featureRules[featureName].context; var plugin = featureRules[featureName].plugin; if (visitorContext.hasOwnProperty(plugin) && visitorContext[plugin].hasOwnProperty(key)) { var operator = featureRules[featureName].operator; var match = featureRules[featureName].match; if (Drupal.personalize.targetingOperators.hasOwnProperty(operator)) { if (Drupal.personalize.targetingOperators[operator](visitorContext[plugin][key], match)) { var context = Drupal.personalize.agents[agentType].featureToContext(featureName); newVisitorContext[key].push(context.value); } } } } } }
        return newVisitorContext;
    }; Drupal.personalize.targetingOperators = { 'contains': function (actualValue, matchValue) { return actualValue.indexOf(matchValue) !== -1; }, 'starts': function (actualValue, matchValue) { return actualValue.indexOf(matchValue) === 0; }, 'ends': function (actualValue, matchValue) { return actualValue.indexOf(matchValue, actualValue.length - matchValue.length) !== -1; }, 'numgt': function (actualValue, matchValue) { if (isNaN(actualValue) || isNaN(matchValue)) return false; return actualValue > matchValue; }, 'numlt': function (actualValue, matchValue) { if (isNaN(actualValue) || isNaN(matchValue)) return false; return actualValue < matchValue; } }; Drupal.personalize.visitor_context = Drupal.personalize.visitor_context || {}; Drupal.personalize.visitor_context.user_profile_context = {
        'getContext': function (enabled) {
            if (!Drupal.settings.hasOwnProperty('personalize_user_profile_context')) { return []; }
            var i, context_values = {}; for (i in enabled) { if (enabled.hasOwnProperty(i) && Drupal.settings.personalize_user_profile_context.hasOwnProperty(i)) { context_values[i] = Drupal.settings.personalize_user_profile_context[i]; } }
            return context_values;
        }
    }; Drupal.personalize.visitor_context_read = function (key, context) { var bucketName = Drupal.personalize.storage.utilities.generateVisitorContextBucketName(key, context); var bucket = Drupal.personalize.storage.utilities.getBucket(bucketName); return bucket.read(key); }; Drupal.personalize.visitor_context_write = function (key, context, value, overwrite) {
        var bucketName = Drupal.personalize.storage.utilities.generateVisitorContextBucketName(key, context); var bucket = Drupal.personalize.storage.utilities.getBucket(bucketName); if (overwrite === false) { var current = bucket.read(key); if (current !== null) { return; } }
        return bucket.write(key, value);
    }; function prepareOptionSets(settings) {
        var option_sets = {}; if (settings.personalize.hasOwnProperty('mvt')) { for (var mvt_name in settings.personalize.mvt) { if (settings.personalize.mvt.hasOwnProperty(mvt_name)) { var mvt = settings.personalize.mvt[mvt_name]; var agent_info = Drupal.settings.personalize.agent_map[mvt.agent]; for (var i in mvt.option_sets) { if (mvt.option_sets.hasOwnProperty(i)) { var option_set = mvt.option_sets[i]; option_set.decision_point = mvt_name; option_set.agent = mvt.agent; option_set.agent_info = agent_info; option_sets[option_set.osid] = option_set; } } } } }
        if (settings.personalize.hasOwnProperty('option_sets')) {
            for (var osid in settings.personalize.option_sets) {
                if (settings.personalize.option_sets.hasOwnProperty(osid)) {
                    if (option_sets.hasOwnProperty(osid)) { continue; }
                    var option_set = settings.personalize.option_sets[osid]; option_set.agent_info = Drupal.settings.personalize.agent_map[option_set.agent]; option_sets[osid] = option_set;
                }
            }
        }
        return option_sets;
    }
    function generateDecisionStorageKey(agent_name, point) { return agent_name + Drupal.personalize.storage.utilities.cacheSeparator + point; }
    function readDecisionsFromStorage(agent_name, point) {
        if (!Drupal.settings.personalize.agent_map[agent_name].cache_decisions) { return null; }
        var bucket = Drupal.personalize.storage.utilities.getBucket('decisions'); return bucket.read(generateDecisionStorageKey(agent_name, point));
    }
    function writeDecisionsToStorage(agent_name, point, decisions) {
        if (!Drupal.settings.personalize.agent_map[agent_name].cache_decisions) { return; }
        var bucket = Drupal.personalize.storage.utilities.getBucket('decisions'); bucket.write(generateDecisionStorageKey(agent_name, point), decisions);
    }
    function triggerDecisions(agents) {
        var agent_name, agent, point, decisions, callback; for (agent_name in agents) {
            if (agents.hasOwnProperty(agent_name)) {
                agent = agents[agent_name]; processedDecisions[agent_name] = processedDecisions[agent_name] || {}; for (point in agent.decisionPoints) {
                    if (agent.decisionPoints.hasOwnProperty(point) && !processedDecisions[agent_name][point]) {
                        processedDecisions[agent_name][point] = true; callback = (function (inner_agent_name, inner_agent, inner_point) {
                            return function (selection) {
                                writeDecisionsToStorage(inner_agent_name, inner_point, selection)
                                executeDecisionCallbacks(inner_agent_name, inner_point, selection);
                            };
                        })(agent_name, agent, point); var decisionAgent = Drupal.personalize.agents[agent.agentType]; if (!decisionAgent || typeof decisionAgent.getDecisionsForPoint !== 'function') {
                            var fallbacks = agent.decisionPoints[point].fallbacks; decisions = {}; for (var key in fallbacks) { if (fallbacks.hasOwnProperty(key) && agent.decisionPoints[point].choices.hasOwnProperty(key)) { decisions[key] = agent.decisionPoints[point].choices[key][fallbacks[key]]; } }
                            executeDecisionCallbacks(agent_name, point, decisions); return;
                        }
                        Drupal.personalize.debug('Requesting decision for ' + agent_name + ': ' + point, 2000); decisionAgent.getDecisionsForPoint(agent_name, agent.visitorContext, agent.decisionPoints[point].choices, point, agent.decisionPoints[point].fallbacks, callback);
                    }
                }
            }
        }
        $(document).trigger('personalizeDecisionsEnd');
    }
    function optionSetIsStateful(osid) {
        if (!Drupal.settings.personalize.option_sets.hasOwnProperty(osid)) { return false; }
        var stateful = Drupal.settings.personalize.option_sets[osid].stateful; return stateful == "1";
    }
    function getPreselection(osid) {
        if (optionSetIsStateful(osid) && (selection = $.bbq.getState(osid, true))) { return selection; }
        if (Drupal.settings.personalize.preselected && Drupal.settings.personalize.preselected.hasOwnProperty(osid)) { return Drupal.settings.personalize.preselected[osid]; }
        return false;
    }
    function processOptionSets(option_sets) {
        var agents = {}, agentName, agentData, osid, decisionPoint, decisions, optionSetsToProcess = []; for (osid in option_sets) { if (option_sets.hasOwnProperty(osid)) { if (!processingOptionSets.hasOwnProperty(osid)) { optionSetsToProcess.push(osid); processingOptionSets[osid] = true; } } }
        for (osid in option_sets) {
            if (option_sets.hasOwnProperty(osid)) {
                if (optionSetsToProcess.indexOf(osid) == -1 || processedOptionSets.hasOwnProperty(osid)) { continue; }
                processedOptionSets[osid] = true; agentData = processOptionSet(option_sets[osid]); if (!agentData) { continue; }
                agentName = agentData.agentName; if (!agents.hasOwnProperty(agentName)) { agents[agentName] = agentData; } else { $.extend(true, agents[agentName].decisionPoints, agentData.decisionPoints); $.extend(agents[agentName].fixedTargeting, agentData.fixedTargeting); }
            }
        }
        for (agentName in agents) {
            if (agents.hasOwnProperty(agentName)) {
                for (decisionPoint in agents[agentName].decisionPoints) {
                    if (agents[agentName].decisionPoints.hasOwnProperty(decisionPoint)) {
                        decisions = readDecisionsFromStorage(agentName, decisionPoint); if (!decisionsAreValid(decisions, agents[agentName].decisionPoints[decisionPoint].choices)) { decisions = null; }
                        if (decisions != null) { Drupal.personalize.debug('Reading decisions from storage: ' + agentName + ': ' + decisionPoint, 2001); executeDecisionCallbacks(agentName, decisionPoint, decisions); delete agents[agentName].decisionPoints[decisionPoint]; }
                    }
                }
            }
        }
        return agents;
    }
    function processOptionSet(option_set) {
        var executor = option_set.executor == undefined ? 'show' : option_set.executor, osid = option_set.osid, agent_name = option_set.agent, agent_info = option_set.agent_info, decision_name = option_set.decision_name == undefined || option_set.decision_name == '' ? osid : option_set.decision_name, decision_point = option_set.decision_point == undefined || option_set.decision_point == '' ? decision_name : option_set.decision_point, choices = option_set.option_names, $option_set = null, fallbackIndex = 0, chosenOption = null; try { $option_set = $(option_set.selector); } catch (error) { return; }
        if (option_set.selector.length > 0 && $option_set.length == 0 && agent_info.active) { Drupal.personalize.debug('No DOM element for the following selector in the ' + agent_name + ' personalization: "' + option_set.selector + '"', 3002); }
        if (option_set.hasOwnProperty('winner') && option_set.winner !== null) { fallbackIndex = option_set.winner; }
        var selection = getPreselection(osid); if (selection !== false) { chosenOption = selection; Drupal.personalize.debug('Preselected option being shown for ' + agent_name, 2002); }
        else if (Drupal.personalize.isAdminMode()) { chosenOption = choices[fallbackIndex]; Drupal.personalize.debug('Fallback option being shown for ' + agent_name + ' because admin mode is on.', 2003); }
        else if (Drupal.personalize.DNTenabled()) { chosenOption = choices[fallbackIndex]; Drupal.personalize.debug('Fallback option being shown for ' + agent_name + ' because DNT is enabled.', 2004); }
        else if (!agent_info.active) { chosenOption = choices[fallbackIndex]; Drupal.personalize.debug('Fallback option being shown for ' + agent_name + ' because the personalization is not running.', 2005); }
        if (chosenOption !== null) {
            if (Drupal.personalize.executors.hasOwnProperty(executor)) { Drupal.personalize.executors[executor].execute($option_set, chosenOption, osid); }
            return;
        }
        if (!agent_info) { return; }
        var agentData = { agentName: agent_name, agentType: agent_info.type == undefined ? 'default_agent' : agent_info.type, enabledContexts: agent_info.enabled_contexts, decisionPoints: {}, fixedTargeting: {} }; agentData.decisionPoints[decision_point] = { choices: {}, callbacks: {}, fallbacks: {} }; agentData.decisionPoints[decision_point].choices[decision_name] = choices; agentData.decisionPoints[decision_point].fallbacks[decision_name] = fallbackIndex; addDecisionCallback(executor, agent_name, decision_point, decision_name, $option_set, osid); if (option_set.hasOwnProperty('targeting')) { for (var j in option_set.targeting) { if (option_set.targeting.hasOwnProperty(j)) { $.extend(agentData.fixedTargeting, getTargeting(option_set.targeting[j])); } } }
        return agentData;
    }
    function getTargeting(targeting) {
        var rules = {}; if (targeting.hasOwnProperty('targeting_features')) { for (var i in targeting.targeting_features) { if (targeting.targeting_features.hasOwnProperty(i)) { var feature_name = targeting.targeting_features[i]; if (targeting.hasOwnProperty('targeting_rules') && targeting.targeting_rules.hasOwnProperty(feature_name)) { rules[feature_name] = targeting.targeting_rules[feature_name]; } } } }
        return rules;
    }
    function decisionsAreValid(decisionsToCheck, validDecisions) {
        var i; for (i in decisionsToCheck) { if (decisionsToCheck.hasOwnProperty(i)) { if (!validDecisions.hasOwnProperty(i) || validDecisions[i].indexOf(decisionsToCheck[i]) == -1) { return false; } } }
        return true;
    }
    function addDecisionCallback(executor, agent_name, decision_point, decision_name, $option_set, osid) { var callback = (function (inner_executor, $inner_option_set, inner_osid, inner_agent_name) { return function (decision) { Drupal.personalize.debug('Calling the executor for ' + inner_agent_name + ': ' + inner_osid + ': ' + decision, 2020); Drupal.personalize.executors[inner_executor].execute($inner_option_set, decision, inner_osid); $(document).trigger('personalizeDecision', [$inner_option_set, decision, inner_osid, inner_agent_name]); } }(executor, $option_set, osid, agent_name)); decisionCallbacks[agent_name] = decisionCallbacks[agent_name] || {}; decisionCallbacks[agent_name][decision_point] = decisionCallbacks[agent_name][decision_point] || {}; decisionCallbacks[agent_name][decision_point][decision_name] = decisionCallbacks[agent_name][decision_point][decision_name] || {}; decisionCallbacks[agent_name][decision_point][decision_name][osid] = callback; }
    function executeDecisionCallbacks(agent_name, decision_point, decisions) {
        var callbacks = {}; if (decisionCallbacks.hasOwnProperty(agent_name) && decisionCallbacks[agent_name].hasOwnProperty(decision_point)) { callbacks = decisionCallbacks[agent_name][decision_point]; }
        for (var decision in decisions) { if (decisions.hasOwnProperty(decision) && callbacks.hasOwnProperty(decision)) { for (var osid in callbacks[decision]) { if (callbacks[decision].hasOwnProperty(osid)) { callbacks[decision][osid].call(undefined, decisions[decision]); if (optionSetIsStateful(osid)) { var state = {}; state[osid] = decisions[decision]; $.bbq.pushState(state); } } } } }
    }
    function addActionListener(settings) {
        var adminMode = Drupal.personalize.isAdminMode(); if (Drupal.hasOwnProperty('visitorActions')) {
            var events = {}, new_events = 0; for (var eventName in settings.personalize.actionListeners) { if (settings.personalize.actionListeners.hasOwnProperty(eventName) && !processedListeners.hasOwnProperty(eventName)) { processedListeners[eventName] = 1; events[eventName] = settings.personalize.actionListeners[eventName]; new_events++; } }
            if (new_events > 0 && !adminMode) { var callback = function (eventName, jsEvent) { if (events.hasOwnProperty(eventName)) { var goals = events[eventName]; for (var i in goals) { if (goals.hasOwnProperty(i)) { var agent = settings.personalize.agent_map[goals[i].agent]; if (agent !== undefined) { debugGoal(eventName, goals[i].agent, goals[i].value); Drupal.personalize.agents[agent.type].sendGoalToAgent(goals[i].agent, eventName, goals[i].value, jsEvent); $(document).trigger('sentGoalToAgent', [goals[i].agent, eventName, goals[i].value, jsEvent]); } } } } }; Drupal.visitorActions.publisher.subscribe(callback); }
        }
    }
    Drupal.personalize.storage = Drupal.personalize.storage || {}; Drupal.personalize.storage.buckets = Drupal.personalize.storage.buckets || {}; Drupal.personalize.storage.utilities = {
        cachePrefix: 'Drupal.personalize', cacheSeparator: ':', generateVisitorContextBucketName: function (key, context) { return 'visitor_context' + this.cacheSeparator + context + this.cacheSeparator + key; }, getBucketExpiration: function (bucketName) {
            var data = {}; if (Drupal.settings.personalize.cacheExpiration.hasOwnProperty(bucketName)) { var expirationSetting = Drupal.settings.personalize.cacheExpiration[bucketName]; if (expirationSetting == 'session') { data.bucketType = 'session'; data.expires = 0; } else { data.bucketType = 'local'; if (expirationSetting === 'none') { data.expires = NaN; } else { data.expires = expirationSetting * 60 * 1000; } } }
            return data;
        }, getBucket: function (bucketName) {
            if (!Drupal.personalize.storage.buckets.hasOwnProperty(bucketName)) { var expirationData = this.getBucketExpiration(bucketName); if (expirationData.hasOwnProperty('bucketType')) { Drupal.personalize.storage.buckets[bucketName] = new Drupal.personalize.storage.bucket(bucketName, expirationData.bucketType, expirationData.expires); } else { Drupal.personalize.storage.buckets[bucketName] = new Drupal.personalize.storage.nullBucket(bucketName); } }
            return Drupal.personalize.storage.buckets[bucketName];
        }, supportsLocalStorage: function () {
            if (this.supportsHtmlLocalStorage != undefined) { return this.supportsHtmlLocalStorage; }
            try { this.supportsHtmlLocalStorage = 'localStorage' in window && window['localStorage'] !== null; } catch (e) { this.supportsHtmlLocalStorage = false; }
            return this.supportsHtmlLocalStorage;
        }, maintain: function () {
            if (!this.supportsLocalStorage()) { return; }
            if (this.wasMaintained != undefined) { return; }
            var currentTime = new Date().getTime(); var num = localStorage.length; var expirations = {}; for (var i = (num - 1) ; i >= 0; i--) { var key = localStorage.key(i); if (key.indexOf(this.cachePrefix) == 0) { var keyParts = key.split(this.cacheSeparator); var bucketName = keyParts.length >= 2 ? keyParts[1] : ''; var expiration = expirations.hasOwnProperty(bucketName) ? expirations[bucketName] : this.getBucketExpiration(bucketName); expirations[bucketName] = expiration; if (expiration.bucketType === 'local' && !isNaN(expiration.expires)) { var stored = localStorage.getItem(key); if (stored) { var record = JSON.parse(stored); if (record.ts && (record.ts + expiration.expires) < currentTime) { localStorage.removeItem(key); } } } } }
            this.wasMaintained = true;
        }
    }; Drupal.personalize.storage.nullBucket = function (bucketName) { return { read: function (key) { return null; }, write: function (key, value) { return; } } }
    Drupal.personalize.storage.bucket = function (bucketName, bucketType, expiration) {
        this.bucketName = bucketName; if (Drupal.personalize.storage.utilities.supportsLocalStorage()) { this.store = bucketType === 'session' ? sessionStorage : localStorage; }
        this.expiration = expiration;
    }
    Drupal.personalize.storage.bucket.prototype = (function () {
        function getBucketPrefix() { return Drupal.personalize.storage.utilities.cachePrefix + Drupal.personalize.storage.utilities.cacheSeparator + this.bucketName; }
        function generateKey(key) { return getBucketPrefix.call(this) + Drupal.personalize.storage.utilities.cacheSeparator + key; }
        function generateRecord(value) { var now = new Date().getTime(); var record = { ts: now, val: value }; return JSON.stringify(record); }
        return {
            read: function (key) {
                if (!Drupal.personalize.storage.utilities.supportsLocalStorage()) { return null; }
                var stored = this.store.getItem(generateKey.call(this, key)); if (stored) { var record = JSON.parse(stored); if (typeof record.val !== 'undefined') { return record.val; } }
                return null;
            }, write: function (key, value) {
                if (!Drupal.personalize.storage.utilities.supportsLocalStorage()) { return; }
                var fullKey = generateKey.call(this, key); var record = generateRecord.call(this, value); this.store.removeItem(fullKey); try { this.store.setItem(fullKey, record); } catch (e) { return; }
            }, removeItem: function (key) {
                if (!Drupal.personalize.storage.utilities.supportsHtmlLocalStorage()) { return; }
                var fullKey = generateKey.call(this, key); this.store.removeItem(fullKey);
            }
        }
    })(); Drupal.ajax.prototype.commands.personalize_settings_merge = function (ajax, response, status) { response.merge = true; this.settings(ajax, response, status); }; Drupal.personalize.resetAll = function () { sessionId = false; processedDecisions = {}; decisionCallbacks = {}; processedOptionSets = {}; processingOptionSets = {}; processedListeners = {}; Drupal.personalize.storage.buckets = {}; delete Drupal.personalize.storage.utilities.wasMaintained; }; Drupal.personalize.debug = function (message, code) { if (Drupal.personalize.isDebugMode() && Drupal.hasOwnProperty('personalizeDebug')) { Drupal.personalizeDebug.log(message, code); } }
})(jQuery);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/personalize/js/personalize.js. */
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/personalize/js/personalize.debug.js. */
(function ($, Drupal) {
    Drupal.personalizeDebug = (function () {
        var debuggedMessages = []; return {
            'log': function (message, code, type) {
                if (debuggedMessages.indexOf(message) != -1) { return; }
                if (console && console.log) { console.log(code + ': ' + message); }
                $(document).trigger('personalizeDebugEvent', { 'type': type, 'code': code, 'message': message }); debuggedMessages.push(message);
            }
        };
    })();
})(Drupal.jQuery, Drupal);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/personalize/js/personalize.debug.js. */
0
