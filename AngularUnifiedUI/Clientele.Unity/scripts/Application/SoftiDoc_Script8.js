/* Source and licensing information for the line(s) below can be found at https://www.docusign.com/sites/all/modules/contrib/visitor_actions/js/visitor_actions.js. */
(function ($) {
    var eventNamespace = 'visitorActions'; var forEach = Array.prototype.forEach && function (arr, iterator, scope) { Array.prototype.forEach.call(arr, iterator, scope); } || function (arr, iterator, scope) { 'use strict'; var i, len; for (i = 0, len = arr.length; i < len; ++i) { iterator.call(scope, arr[i], i, arr); } }; var some = Array.prototype.some && function (arr, comparator, scope) { return Array.prototype.some.call(arr, comparator, scope); } || function (arr, comparator, scope) {
        'use strict'; if (arr === null) { throw new TypeError(); }
        var thisp, i, t = Object(arr), len = t.length >>> 0; if (typeof comparator !== 'function') { throw new TypeError(); }
        thisp = arguments[2]; for (i = 0; i < len; i++) { if (i in t && comparator.call(thisp, t[i], i, t)) { return true; } }
        return false;
    }
    var Publisher = function () { this.subscribers = []; this.events = []; }; Publisher.prototype = { deliver: function (name, event, pageContext) { forEach(this.subscribers, function (subscriber) { subscriber.call(this, name, event, pageContext); }); this.events.push({ 'name': name, 'event': event, 'pageContext': pageContext }); }, subscribe: function (subscriber, receivePreviousEvents) { receivePreviousEvents = typeof (receivePreviousEvents) == 'undefined'; var alreadyExists = some(this.subscribers, function (el) { return el === subscriber; }); if (!alreadyExists) { this.subscribers.push(subscriber); if (receivePreviousEvents) { forEach(this.events, function (eventData) { subscriber.call(this, eventData.name, eventData.event, eventData.pageContext); }) } } }, reset: function () { this.subscribers = []; this.events = []; } }; Drupal.visitorActions = Drupal.visitorActions || {}; Drupal.visitorActions.publisher = new Publisher(); Drupal.behaviors.visitorActions = {
        attach: function (context, settings) {
            var name, action, callback, boundActions = {}; for (name in Drupal.settings.visitor_actions.actions) { if (Drupal.settings.visitor_actions.actions.hasOwnProperty(name)) { action = Drupal.settings.visitor_actions.actions[name]; if (Drupal.visitorActions.hasOwnProperty(action.actionable_element) && typeof Drupal.visitorActions[action.actionable_element].bindEvent === 'function') { callback = (function (innerName) { return function (event, actionContext) { Drupal.visitorActions.publisher.deliver(innerName, event, actionContext); } })(name); boundActions[name] = Drupal.visitorActions[action.actionable_element].bindEvent(name, action, context, callback); } } }
            $(document).trigger('visitorActionsBindActions', [boundActions]);
        }
    }; Drupal.visitorActions.getPageContext = function () { var actionContext = {}; actionContext['PageView'] = Drupal.settings.visitor_actions.pageContext; var clientContext = {}; clientContext.ReferralPath = document.referrer; var queryMap = {}, keyValuePairs = location.search.slice(1).split('&'); forEach(keyValuePairs, function (keyValuePair) { keyValuePair = keyValuePair.split('='); queryMap[keyValuePair[0]] = keyValuePair[1] || ''; }); clientContext.Campaign = queryMap.hasOwnProperty('utm_campaign') ? queryMap.utm_campaign : ''; clientContext.Source = queryMap.hasOwnProperty('utm_source') ? queryMap.utm_source : ''; clientContext.Medium = queryMap.hasOwnProperty('utm_medium') ? queryMap.utm_medium : ''; clientContext.Term = queryMap.hasOwnProperty('utm_term') ? queryMap.utm_term : ''; clientContext.Content = queryMap.hasOwnProperty('utm_content') ? queryMap.utm_content : ''; actionContext['PageView']['TrafficSource'] = clientContext; return actionContext; }; Drupal.visitorActions.link = {
        'bindEvent': function (name, action, context, callback) {
            var actionContext = Drupal.visitorActions.getPageContext(); try { var $selector = $(action.identifier, context); } catch (error) { return; }
            $selector.once('visitorActions-' + name).bind(action.event + '.' + eventNamespace, { 'eventNamespace': eventNamespace }, function (event) {
                if (event.type === 'click') {
                    var linkContext = {}; linkContext.DestinationUrl = $(this).attr('href'); linkContext.AnchorText = $(this).text(); linkContext.LinkClasses = $(this).attr('class').split(' '); linkContext.DataAttributes = {}; var linkData = $selector.data(); for (var dataKey in linkData) { var typeData = typeof (linkData[dataKey]); if (typeData !== 'object' && typeData !== 'undefined' && typeData !== 'function') { linkContext.DataAttributes[dataKey] = linkData[dataKey]; } }
                    actionContext.Click = linkContext;
                }
                if (typeof callback === 'function') { callback.call(null, event, actionContext) }
            }); return $selector;
        }
    }; Drupal.visitorActions.form = {
        'bindEvent': function (name, action, context, callback) {
            var formId = action.identifier.replace(/_/g, '-'); try { var $selector = $('form#' + formId, context); } catch (error) { return null; }
            var pageContext = Drupal.visitorActions.getPageContext(); if ($selector.length == 0 || typeof callback !== 'function') { return null; }
            if (action.event === 'submit_client') {
                for (var id in Drupal.settings.ajax) { var ajaxed = Drupal.ajax[id]; if (typeof ajaxed !== 'undefined' && typeof ajaxed.form !== 'undefined' && ajaxed.form.length > 0) { if (ajaxed.form[0] === $selector[0]) { ajaxed.drupalEventResponse = Drupal.ajax.prototype.eventResponse; ajaxed.eventResponse = function (element, event) { callback.call(null, event, pageContext); return this.drupalEventResponse(element, event); }; return $selector; } } }
                $selector.once('visitorActions-' + name).bind('submit.' + eventNamespace, { 'eventNamespace': eventNamespace }, function (event) { callback.call(null, event, pageContext); });
            }
            return $selector;
        }
    }; var pageViewed = false; Drupal.visitorActions.page = {
        'view': function (name, action, context, callback) {
            if (!pageViewed) {
                var event = { 'type': 'PageView' }; if (typeof callback === 'function') { callback.call(null, event, Drupal.visitorActions.getPageContext()); }
                pageViewed = true;
            }
        }, 'stay': function (name, action, context, callback) {
            var time = 5; if (action.options.hasOwnProperty('remains_for')) { time = action.options.remains_for; }
            var pageContext = Drupal.visitorActions.getPageContext(); setTimeout(function (event) { if (typeof callback === 'function') { callback.call(null, event, pageContext); } }, time * 1000);
        }, 'scrollToBottom': function (name, action, context, callback) {
            var $windowProcessed = $('html').once('visitorActionsPageBindEvent-' + name); if ($windowProcessed.length > 0) {
                var bottomOffset = 100; var pageContext = Drupal.visitorActions.getPageContext(); if (action.hasOwnProperty('options') && action.options.hasOwnProperty('bottom_offset')) { bottomOffset = action.options.bottom_offset; }
                $(window).bind('scroll.visitorActions-' + name, function (event) { var $window = $(event.currentTarget); if ($window.scrollTop() + $window.height() > $(document).height() - bottomOffset) { $window.unbind('scroll.visitorActions-' + name); if (typeof callback === 'function') { callback.call(null, event, pageContext); } } });
            }
        }, 'bindEvent': function (name, action, context, callback) {
            if (typeof (this[action.event]) === 'function') { this[action.event].call(this, name, action, context, callback); }
            return $(window);
        }, 'reset': function () { pageViewed = false; }
    };
})(jQuery);;;
/* Source and licensing information for the above line(s) can be found at https://www.docusign.com/sites/all/modules/contrib/visitor_actions/js/visitor_actions.js. */
0
