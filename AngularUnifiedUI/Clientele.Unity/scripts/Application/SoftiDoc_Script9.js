/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/patched/acquia_lift/js/acquia_lift.api.js. */
(function ($, Drupal) {
    var instance; Drupal.acquiaLiftAPI = (function () {
        function SingletonAPI(session_id) { var settings = Drupal.settings.acquia_lift_learn; this.options = { 'server': settings.baseUrl, 'user_hash': session_id, 'application_hash': settings.applicationHash, 'client_id': settings.clientId }; }
        SingletonAPI.prototype = {
            constructor: SingletonAPI, decision: function (agent_name, options, callback) {
                var params = { client_id: this.options.client_id, user_hash: this.options.user_hash, campaign_id: agent_name, application_hash: this.options.application_hash }; var fb, path = 'play'; fb = null; if (options.fallback != null) { fb = options.fallback; }
                return this.send(path, params, null, (function () {
                    return function (res) {
                        var selection = fb, policy; if (res) {
                            if (res.hasOwnProperty('outcome')) { selection = res.outcome; }
                            if (res.hasOwnProperty('policy')) { policy = res.policy; }
                            else if (res.outcome[0].hasOwnProperty('policy')) { policy = res.outcome[0].policy; }
                        }
                        return callback(selection, policy);
                    };
                })(this));
            }, goal: function (agent_name, options, callback) {
                var path = 'feedback'; var params = { client_id: this.options.client_id }; var body = { 'user_hash': this.options.user_hash, 'application_hash': this.options.application_hash, 'campaign_id': agent_name, 'goal_id': options.goal, 'score': +options.reward }; return this.send(path, params, body, (function (_this) {
                    return function (res) {
                        var success, nodecision, accepted, retryable; if (callback == null) { return; }
                        success = res != null && res.hasOwnProperty('feedback_id'); nodecision = res != null && res.hasOwnProperty('error') && res.error.indexOf("The request has been accepted for processing") === 0; accepted = success || nodecision; retryable = (res != null ? res.submitted : void 0) == null; return callback(accepted, _this.options.user_hash, retryable);
                    };
                })(this));
            }, reset: function () { instance = undefined; }, send: function (path, data, body, cb) {
                var postBody = body ? JSON.stringify(body) : ""; data._t = new Date().getTime(); var querystring = '', key, value, i = 0; for (key in data) { value = data[key]; querystring += i == 0 ? "" : "&"; querystring += key + "=" + (encodeURI(value)); i++; }
                var url = this.options.server + "/" + path + "?" + querystring; return microAjax(url, function (text) { var response; try { response = JSON.parse(text); return cb(response); } catch (e) { return cb(null); } }, postBody);
            }
        }; return {
            name: "AcquiaLiftAPI", getInstance: function () {
                var session_id = Drupal.acquiaLiftLearn.getSessionID(); if (instance === undefined) { instance = new SingletonAPI(session_id); }
                return instance;
            }
        };
    })(); function microAjax(url, callbackFunction) {
        var getRequest = function (method, url) {
            var xhr = new XMLHttpRequest(); if ("withCredentials" in xhr) { xhr.open(method, url, true); } else if (typeof XDomainRequest != "undefined") { xhr = new XDomainRequest(); xhr.open(method, url); } else { xhr = null; }
            return xhr;
        }; var postBody = (arguments[2] || ""), method = postBody !== "" ? 'POST' : 'GET', request = getRequest(method, url); if (request) {
            request.timeout = 5000; request.onload = function () { return callbackFunction(request.responseText); }; request.onerror = request.ontimeout = function () { return callbackFunction(null); }; if (method == 'POST') { request.setRequestHeader('Content-Type', 'application/json'); }
            request.send(postBody);
        }
        else { return callbackFunction(null); }
    }
})(Drupal.jQuery, Drupal);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/patched/acquia_lift/js/acquia_lift.api.js. */
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/patched/acquia_lift/js/acquia_lift.page.js. */
(function ($, Drupal) { Drupal.behaviors.acquia_lift_goal_queue = { attach: function (context, settings) { $('body').once('acquiaLiftGoalsQueue', function () { Drupal.acquiaLiftUtility.GoalQueue.processQueue(true); }); } } })(Drupal.jQuery, Drupal);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/patched/acquia_lift/js/acquia_lift.page.js. */
/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/patched/acquia_lift/js/acquia_lift.goals_queue.js. */
(function ($, Drupal) {
    "use strict"; Drupal.acquiaLiftUtility = Drupal.acquiaLiftUtility || {}; Drupal.acquiaLiftUtility.QueueItem = function (params) {
        var queueItemUid, queueItemData, queueItemProcessing = false, numberTried = 0; this.getId = function () { return queueItemUid; }; this.setId = function (value) { queueItemUid = value; }
        this.getData = function () { return queueItemData; }; this.setData = function (value) { queueItemData = value; }; this.isProcessing = function () { return queueItemProcessing; }; this.setProcessing = function (isProcessing) { queueItemProcessing = isProcessing; }; this.getNumberTried = function () { return numberTried; }; this.setNumberTried = function (value) { numberTried = value; }; this.incrementTries = function () { numberTried++; }; if (params.hasOwnProperty('id') && params.hasOwnProperty('data') && params.hasOwnProperty('pflag') && params.hasOwnProperty('numberTried')) { this.setId(params.id); this.setData(params.data); this.setProcessing(params.pflag); this.setNumberTried(params.numberTried); } else { var uid = 'acquia-lift-ts-' + new Date().getTime() + Math.random(); this.setId(uid); this.setData(params); this.setProcessing(false); this.setNumberTried(0); }
    }; Drupal.acquiaLiftUtility.QueueItem.prototype = { constructor: Drupal.acquiaLiftUtility.QueueItem, 'equals': function (queueItem) { return (queueItem instanceof Drupal.acquiaLiftUtility.QueueItem && queueItem.getId() == this.getId()); }, 'reset': function () { this.setProcessing(false); }, 'toObject': function () { return { 'id': this.getId(), 'data': this.getData(), 'pflag': this.isProcessing(), 'numberTried': this.getNumberTried() }; } }
    Drupal.acquiaLiftUtility.Queue = Drupal.acquiaLiftUtility.Queue || (function ($) {
        var cookieName = 'acquiaLiftQueue', maxRetries = 5; function cookieHandlesSerialization() { return ($.cookie.json && $.cookie.json == true); }
        function readQueue() { var queue = $.cookie(cookieName); var unserialized = cookieHandlesSerialization() ? queue : $.parseJSON(queue); return $.isArray(unserialized) ? unserialized : []; }
        function getAll() {
            var unserialized = readQueue(), i, num = unserialized.length, queue = []; for (i = 0; i < num; i++) { queue.push(new Drupal.acquiaLiftUtility.QueueItem(unserialized[i])); }
            return queue;
        }
        function getFirstUnprocessed() {
            var unserialized = readQueue(), i, num = unserialized.length, item; for (i = 0; i < num; i++) { item = new Drupal.acquiaLiftUtility.QueueItem(unserialized[i]); if (!item.isProcessing()) { return item; } }
            return null;
        }
        function indexOf(queue, item) {
            var i, num = queue.length, test; for (i = 0; i < num; i++) { test = new Drupal.acquiaLiftUtility.QueueItem(queue[i]); if (test.equals(item)) { return i; } }
            return -1;
        }
        function writeQueue(queue) {
            var queueData = [], i, num = queue.length; for (i = 0; i < num; i++) { if (queue[i] instanceof Drupal.acquiaLiftUtility.QueueItem) { queueData.push(queue[i].toObject()) } else { queueData.push(queue[i]); } }
            if (!cookieHandlesSerialization()) { queueData = JSON.stringify(queueData); }
            $.cookie(cookieName, queueData);
        }
        function addBack(queueItem, reset) {
            var queue = readQueue(); var index = indexOf(queue, queueItem); if (reset && reset == true) { queueItem.reset(); queueItem.incrementTries(); }
            if (queueItem.getNumberTried() >= maxRetries) { Drupal.acquiaLiftUtility.Queue.remove(queueItem); return; }
            if (index >= 0) { queue.splice(index, 1, queueItem); } else { queue.push(queueItem); }
            writeQueue(queue);
        }; return {
            'add': function (data, reset) {
                reset = reset == undefined ? true : reset; if (data instanceof Drupal.acquiaLiftUtility.QueueItem) { addBack(data, reset); return; }
                var queue = readQueue(); queue.push(new Drupal.acquiaLiftUtility.QueueItem(data)); writeQueue(queue);
            }, 'getNext': function () {
                var item = getFirstUnprocessed(); if (item) { item.setProcessing(true); this.add(item, false); }
                return item;
            }, 'remove': function (queueItem) {
                var queue = readQueue(); var index = indexOf(queue, queueItem); if (index >= 0) { queue.splice(index, 1); writeQueue(queue); return true; }
                return false;
            }, 'reset': function () {
                var i, queue = getAll(), num = queue.length; for (i = 0; i < num; i++) { queue[i].reset(); }
                writeQueue(queue);
            }, 'empty': function () { writeQueue([]); }
        }
    }($));
}(Drupal.jQuery, Drupal)); (function ($, Drupal) {
    "use strict"; Drupal.acquiaLiftUtility = Drupal.acquiaLiftUtility || {}; Drupal.acquiaLiftUtility.GoalQueue = Drupal.acquiaLiftUtility.GoalQueue || (function ($) {
        var acquiaLiftAPI; var isProcessing = false; function convertGoalToQueueData(goal) { return { 'a': goal.agentName, 'o': goal.options }; }
        function convertQueueDataToGoal(item) {
            if (!item.a || !item.o) { return {}; }
            return { 'agentName': item.a, 'options': $.extend(true, {}, item.o) };
        }
        function processGoalItem(queueItem, callback) {
            var api_class = Drupal.settings.acquia_lift.api_class; if (!Drupal.hasOwnProperty(api_class)) { throw new Error('Cannot communicate with Lift API.'); }
            acquiaLiftAPI = Drupal[api_class].getInstance(); var goal = convertQueueDataToGoal(queueItem.getData()); if (!goal.agentName || !goal.options) { throw new Error('Invalid goal data.'); }
            acquiaLiftAPI.goal(goal.agentName, goal.options, function (accepted, session, retryable) { if (callback && typeof callback === 'function') { callback(queueItem, accepted, session, retryable); } }); if (typeof acquiaLiftAPI.isManualBatch == "function" && acquiaLiftAPI.isManualBatch()) { acquiaLiftAPI.batchSend(); }
        }
        return {
            'addGoal': function (agentName, options, process) { var data = convertGoalToQueueData({ 'agentName': agentName, 'options': options }); var process = process == undefined ? true : process; Drupal.acquiaLiftUtility.Queue.add(data); if (process) { this.processQueue(); } }, 'processQueue': function (reset) {
                var that = this; reset = reset || false; if (isProcessing) {
                    setTimeout(function () { that.processQueue(reset); }, 2)
                    return;
                }
                isProcessing = true; if (reset) { Drupal.acquiaLiftUtility.Queue.reset(); }
                var failed = []; function processNext() {
                    var item = Drupal.acquiaLiftUtility.Queue.getNext(); if (item) {
                        try { processGoalItem(item, processComplete); }
                        catch (e) { Drupal.acquiaLiftUtility.Queue.remove(item); processNext(); }
                    } else {
                        var i, num = failed.length; for (i = 0; i < num; i++) { Drupal.acquiaLiftUtility.Queue.add(failed[i]); }
                        isProcessing = false;
                    }
                }
                function processComplete(item, accepted, session, retryable) {
                    if (!accepted && retryable) { failed.push(item); } else { Drupal.acquiaLiftUtility.Queue.remove(item) }
                    processNext();
                }
                processNext();
            }, 'reset': function () { isProcessing = false; Drupal.acquiaLiftUtility.Queue.reset(); }
        }
    }($));
}(Drupal.jQuery, Drupal));;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/patched/acquia_lift/js/acquia_lift.goals_queue.js. */
0
