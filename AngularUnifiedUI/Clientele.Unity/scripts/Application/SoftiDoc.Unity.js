/**********************************************************************************************/
/* Application Definition                                                                     */
/**********************************************************************************************/
var environment = angular.module('SoftiDoc.Unity.EnvironmentVariables', []);

var applicationHost = {
    registeredApplications: [],
    registeredScripts: [],
    bootstrap: function () {
        applicationHost.completeApplicationRegistration("unity");
    },
    registerApplication: function (applicationId) {
        applicationHost.registeredApplications.push(
            {
                ApplicationId: applicationId,
                ApplicationRegistered: false,
                ApplicationScriptValidated: null
            }
        );
    },
    retrieveApplicationById: function (applicationId) {
        for (var i = 0; i < applicationHost.registeredApplications.length; i++) {
            if (applicationHost.registeredApplications[i].ApplicationId == applicationId) {
                return applicationHost.registeredApplications[i];
            }
        }
    },
    registerJavaScript: function (script) {
        applicationHost.registeredScripts.push(script);
    },
    retrieveApplicationConfigurationById: function (applicationId) {
        for (var i = 0; i < unityUrls.length; i++) {
            if (unityUrls[i].ApplicationId == applicationId) {
                return unityUrls[i];
            }
        }

        return undefined;
    },
    completeApplicationRegistration: function (applicationId) {

        //find and mark the load as complete
        for (var i = 0; i < applicationHost.registeredApplications.length; i++) {
            if (applicationHost.registeredApplications[i].ApplicationId == applicationId) {
                applicationHost.registeredApplications[i].ApplicationRegistered = true;
            }
        }

        //make sure all remote applications are loaded before bootstrapping
        for (var i = 0; i < applicationHost.registeredApplications.length; i++) {
            if (angular.isDefined(applicationHost.registeredApplications[i].RegisterApplication)) {
                if (applicationHost.registeredApplications[i].ApplicationRegistered == false) {
                    return;
                }
            }
        }

        bootstrap();
    }
}

var bootstrap = function () {

    // define the installed applications
    var resourceUrls = [];
    resourceUrls.push('self');
    
    var applicationIds = [];

    for (var i = 0; i < applicationHost.registeredApplications.length; i++) {
        applicationIds.push(applicationHost.registeredApplications[i].ApplicationId);
        var applicationConfiguration = applicationHost.retrieveApplicationConfigurationById(applicationHost.registeredApplications[i].ApplicationId);
        if (angular.isDefined(applicationConfiguration)) {
            resourceUrls.push(applicationConfiguration.UnityUrl + "**");
        }
    }

    angular.module('InstalledApplications', applicationIds);

    // register the main module and its dependencies
    angular.module('SoftiDoc.Unity', ['SoftiDoc.Unity.Routes', 'SoftiDoc.Authentication', 'SoftiDoc.UI', 'InstalledApplications', 'SoftiDoc.Directives', 'SoftiDoc.Services', 'LocalStorageModule', 'ngResource', 'ui.grid', 'ui.grid.edit'])
        .config(window.$QDecorator)
        .config(function ($httpProvider, $provide, uiSelectConfig, $sceDelegateProvider) {

            uiSelectConfig.theme = 'bootstrap';

            $sceDelegateProvider.resourceUrlWhitelist(resourceUrls);

            //Enable cross domain calls
            //$httpProvider.defaults.withCredentials = true;
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            var urlMustBeCached = function (url) {

                if (url.indexOf("/scripts/") != -1) {
                    return true;
                }

                if (url.indexOf("/dialogs/") != -1) {
                    return true;
                }

                if (url.indexOf("/Scope/") != -1) {
                    return true;
                }

                if (url.indexOf("/role/") != -1) {
                    return true;
                }

                if (url.indexOf("bootstrap/") != -1) {
                    return true;
                }

                if (url.indexOf("select2/") != -1) {
                    return true;
                }

                if (url.indexOf("nodes_renderer1.html") != -1) {
                    return true;
                }

                if (url.indexOf("Template") != -1) {
                    return false;
                }

                if (url.toLowerCase().indexOf("/views/") != -1) {
                    return false;
                }

                return false;
            };

            // Intercept http calls.
            $provide.factory('httpInterceptor', function ($q, $window, identityServiceApiUrl, $rootScope, $location, eventBroadcastingService, $templateCache) {
                return {
                    // On request success
                    request: function (config) {

                        if (config.method === 'GET' && $templateCache.get(config.url) !== undefined)
                            return config;

                        var currentTime = new Date();
                        var currentMonth = currentTime.getMonth();
                        var currentDay = currentTime.getDay();
                        var currentYear = currentTime.getFullYear();
                        var currDate = currentDay + "/" + currentMonth + "/" + currentYear;

                        if (angular.isDefined($rootScope.lastOpenedDate)) {
                            var tokenMonth = $rootScope.lastOpenedDate.getMonth();
                            var tokenDay = $rootScope.lastOpenedDate.getDay();
                            var tokenYear = $rootScope.lastOpenedDate.getFullYear();

                            var tokenDate = tokenDay + "/" + tokenMonth + "/" + tokenYear;

                            if (tokenDate != currDate) {
                                window.location = document.location.origin;
                            }
                        }

                        if (urlMustBeCached(config.url)) {
                            // Return the config or wrap it in a promise if7 blank.
                            return config || $q.when(config);
                        }

                        if (config.method == 'GET') {
                            var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                            config.url = config.url + separator + 'noCache=' + new Date().getTime();
                        }

                        config.headers = config.headers || {};
                        if ($rootScope.BearerToken != null) {
                            config.headers.Authorization = 'Bearer ' + $rootScope.BearerToken;
                        }

                        // Return the config or wrap it in a promise if blank.
                        return config || $q.when(config);
                    },

                    // On request failure
                    requestError: function (rejection) {

                        // Return the promise rejection to be consume downstream
                        return $q.reject(rejection);
                    },

                    // On response success
                    response: function (response) {

                        // Return the response or promise.
                        return response || $q.when(response);
                    },

                    // On response failure
                    responseError: function (rejection) {
                        if (rejection.status == 0) {
                            eventBroadcastingService.broadcastEvent("UrlRejected", rejection);
                        }

                        if (rejection.status == 500) {
                            eventBroadcastingService.broadcastEvent("UrlRejected", rejection);
                        }

                        if (rejection.status == 401) {
                            if (rejection.config.url.toLowerCase().indexOf("http://") != -1) {
                                eventBroadcastingService.UINotify({ Success: false, Message: "You do not sufficient priveledges to perform the requested operation. You may need to reload Unity." });
                            }
                        }

                        if (rejection.status == 502) {
                            if (rejection.config.url.indexOf(identityServiceApiUrl) != -1) {
                                $location.path("/IdentityNotFound/");
                            }
                        }

                        if (rejection.status == 404) {
                            if (rejection.config.url.indexOf(identityServiceApiUrl) != -1) {
                                //todo move this to the login page with an error
                                $location.path("/IdentityNotFound/");
                            }
                        }

                        return $q.reject(rejection);
                    }
                };
            });

            $httpProvider.interceptors.push('httpInterceptor');
        })
        .run(function ($route, $rootScope, $location, eventBroadcastingService, authenticationService, editableOptions, useAuth, cssInjector, identityNotFoundUrl, signalRService, signalRHubUrl) {
            editableOptions.theme = 'bs3';

            var isReloadableRoute = function (routePath) {
                if (!authenticationService.isAuthRoute($location.path()) &&
                    !authenticationService.isLogoutRoute($location.path()) &&
                    routePath != $rootScope.referrerUrl &&
                    routePath != identityNotFoundUrl) {
                    return true;
                }

                return false;
            };

            var determineApplicationFromPath = function () {
                var splitPath = $location.$$path.split("/");

                if (splitPath.length > 0) {
                    var applicationKey = splitPath[1];

                    if (applicationKey != "Login" && applicationKey.toLowerCase() != "logout") {
                        if (angular.isDefined($rootScope.referrerUrl)) {
                            var application = $rootScope.referrerUrl.split("/").join("");
                            eventBroadcastingService.broadcastEvent("ApplicationChanged", { applicationKey: applicationKey, referrer: application });
                            return;
                        }

                        eventBroadcastingService.broadcastEvent("ApplicationChanged", { applicationKey: applicationKey, referrer: "" });
                    }
                } else {
                    eventBroadcastingService.broadcastEvent("Root", { applicationKey: applicationKey });
                }
            };

            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                debugger;
                if (eval(useAuth)) {
                    if (!authenticationService.isAuthenticated()) {
                        if (isReloadableRoute($location.path())) {
                            $rootScope.referrerUrl = $location.path();
                            $route.reload();
                            $location.path(authenticationService.AuthenticationRoute);
                        }
                    } else {

                        determineApplicationFromPath();

                        var signalRListeners = [];
                        signalRListeners.push({ EventName: "notify" });
                        signalRService.RegisterHub("SignalRHub", signalRHubUrl, signalRListeners);

                        // signalRService.StartAllHubs();
                    }
                } else {
                    determineApplicationFromPath();
                }
                
            });

            cssInjector.add("/Content/UiAddons/angular-ui-tree.min.css");
            cssInjector.add("/Content/UiAddons/ng-grid.css");
            cssInjector.add("/Content/UiAddons/ui-grid.css");
            cssInjector.add("/Content/UiAddons/xeditable.css");
            cssInjector.add("/Content/UiAddons/jquery.pnotify.css");
            cssInjector.add("/Content/UiAddons/jquery.pnotify.icons.css");
            cssInjector.add("/Content/UiAddons/pnotify.css");
            cssInjector.add("/Content/UiAddons/dialogs.css");
            cssInjector.add("/Content/UiAddons/select2.css");
            cssInjector.add("/Content/UiAddons/datepicker3.css");
            cssInjector.add("/Content/UiAddons/angular-ui-dashboard.css");
            cssInjector.add("/Content/UiAddons/colorpicker.css");

            angular.element("#LoadingPlaceHolder").hide();
            angular.element("#ContentPlaceHolder").show();
        });

    // start the app from the html tag
    angular.bootstrap("html", ['SoftiDoc.Unity']);
};

/**********************************************************************************************/
/* Additional injected modules that are required and moved compartmentalised for readability  */
/**********************************************************************************************/

angular.module('SoftiDoc.UI', ['ui.bootstrap', 'xeditable', 'SoftiDoc.Formatting', 'angularFileUpload', 'dialogs', 'angular.css.injector', 'ngGrid', 'ui.select', 'ui.tree', "highcharts-ng", 'SoftiDoc.Unity.EnvironmentConstants', 'monospaced.elastic', 'wysiwyg.module', 'ui.dashboard']);

/**********************************************************************************************/