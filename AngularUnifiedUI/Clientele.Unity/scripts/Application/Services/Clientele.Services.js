angular.module('Clientele.Services', ['ngResource'])
    .service('eventBroadcastingService', function ($rootScope) {
        return {
            broadcastEvent: function (event, message) {
                $rootScope.$broadcast(event, message);
            },

            UINotify: function (data) {
                if (!angular.isUndefined(data.Success)) {
                    $rootScope.$broadcast('UINotify', { title: data.Success ? "Success" : "Error", message: data.Message, Success: data.Success });
                }
            }
        };
    })
    .service('signalRService', [
        '$rootScope', 'eventBroadcastingService', 'authenticationService', function ($rootScope, eventBroadcastingService, authenticationService) {
            var registeredHubs = [];

            var hubConnections = [];

            var registerHub = function (hubId, url, actions) {
                registeredHubs.push({ hubId: hubId, url: url, actions: actions });
            };

            var startAllHubs = function () {
                for (var i = 0; i < registeredHubs.length; i++) {
                    startHub(registeredHubs[i]);
                }
            };

            var startHubById = function (hubId) {
                if (!angular.isUndefined(hubConnections[hubId])) {
                    for (var i = 0; i < registeredHubs.length; i++) {
                        if (registeredHubs[i].hubId == hubId) {
                            startHub(registeredHubs[i]);
                        }
                    }
                }
            };

            var startHub = function (hub) {
                if (authenticationService.GetUser() == null) {
                    return;
                }

                if (!angular.isUndefined(hubConnections[hub.hubId])) {
                    if (!hubConnections[hub.hubId].isRunning) {
                        tryStartHub(hub);
                    }
                } else {
                    tryStartHub(hub);
                }
            };

            var tryStartHub = function (hub) {
                var hubToStart = new SignalRConnection(authenticationService.GetUser().id);

                hubToStart.configureSignalRHub(hub.url, hub.hubId);

                for (var i = 0; i < hub.actions.length; i++) {
                    hubToStart.addAction(hub.actions[i].EventName, function (viewModel) {
                        var args = angular.fromJson(viewModel.eventArgs);
                        eventBroadcastingService.broadcastEvent(viewModel.EventName, args);
                    });
                }

                hubToStart.enablePreStartRetry().run($rootScope.BearerToken);
                hubConnections[hub.hubId] = { hub: hubToStart, isRunning: true };
            };

            var killHub = function (hubId) {
                if (!angular.isUndefined(hubConnections[hubId])) {
                    //hubConnections[hubId];
                }
            };

            var killHubs = function (hubIds) {
                for (var i = 0; i < hubIds.length; i++) {
                    killHub(hubIds[i]);
                }
            };

            return {
                RegisterHub: function (hubId, url, actions) {
                    registerHub(hubId, url, actions);
                },
                StartAllHubs: function (hubIds) {
                    startAllHubs();
                },
                StartHub: function (hubId) {
                    startHubById(hubId);
                },
                KillHubs: function (hubIds) {
                    killHubs(hubIds);
                },
                KillHub: function (hubId) {
                    killHub(hubId);
                }
            };
        }
    ])
    .service('ajaxJsonService', [
        '$http', '$rootScope', function ($http, $rootScope) {
            var ajax = function (url, verb, parameters) {

                if ($rootScope.BearerToken != null) {
                    if (parameters != null) {
                        return $http({ method: verb, url: url, data: parameters });

                    } else {
                        return $http({ method: verb, url: url });
                    }
                } else {
                    if (parameters != null) {

                        return $http({ method: verb, url: url, data: parameters, withCredentials: true });

                    } else {
                        return $http({ method: verb, url: url, withCredentials: true });
                    }
                }
            };

            var ajaxJson = function (url, verb, parameters) {

                if ($rootScope.BearerToken != null) {
                    if (parameters != null) {
                        return $http({
                            method: verb,
                            url: url,
                            data: parameters,
                            headers: {
                                "Content-Type": "text/plain"
                            }
                        });

                    } else {
                        return $http({
                            method: verb,
                            url: url,
                            headers: {
                                "Content-Type": "text/plain"
                            }
                        });
                    }
                } else {
                    if (parameters != null) {
                        return $http({
                            method: verb,
                            url: url,
                            data: parameters,
                            withCredentials: true,
                            headers: {
                                "Content-Type": "text/plain"
                            }
                        });

                    } else {
                        return $http({
                            method: verb,
                            url: url,
                            withCredentials: true,
                            headers: {
                                "Content-Type": "text/plain"
                            }
                        });
                    }
                }
            };

            return {
                GetJson: function (url, parameters) {
                    return ajaxJson(url, "GET", parameters);
                },
                Get: function (url, parameters) {
                    return ajax(url, "GET", parameters);
                },
                Post: function (url, parameters) {
                    return ajax(url, "POST", parameters);
                },
                Put: function (url, parameters) {
                    return ajax(url, "PUT", parameters);
                },
                Delete: function (url, parameters) {
                    return ajax(url, "DELETE", parameters);
                }
            };
        }
    ])
    .service('notificationService', function ($dialogs) {
        $.pnotify.defaults.delay = 2000;

        var consumeConfirm = function () {

            window.confirm = function (mess, acceptAction, declineAction, body) {
                return confirm(mess, acceptAction, declineAction, body);
            };

        };

        var consumeAlert = function () {
            if (_alert) return;
            _alert = window.alert;
            window.alert = function (message) {
                $.pnotify({
                    title: 'Alert',
                    text: message
                });
            };
        };

        var confirm = function (message, acceptAction, declineAction, body) {
            dlg = $dialogs.confirm(message, body);
            dlg.result.then(
                function () {
                    acceptAction();
                },
                function () {
                    declineAction();
                });
        };

        consumeAlert();
        consumeConfirm();

        return {
            notify:
                function (title, text, type) {
                    $.pnotify({
                        title: title,
                        text: text,
                        animate_speed: 'fastest',
                        type: type
                    });
                }
        };
    })
    .factory('unityApplicationRepository', function ($rootScope, authenticationService) {

        var swapApplications = function () {
            applications = tempApplications;
            navigationCollection = tempNavigationCollection;
            configurationCollection = tempConfigurationCollection;
        };

        $rootScope.$on("UserLoggedIn", function () {
            swapApplications();
            $rootScope.$broadcast("ApplicationsLoaded", true);
        });

        var applications = [];
        var navigationCollection = [];
        var configurationCollection = [];

        var tempApplications = [];
        var tempNavigationCollection = [];
        var tempConfigurationCollection = [];

        var uniqueApplicationId = function (id) {
            for (var i = 0; i < tempConfigurationCollection.length; i++) {
                if (tempConfigurationCollection[i].Id == id) {
                    alert("Warning: There are duplicate application keys.");
                    return false;
                }
            }

            return true;
        };

        var claimExists = function (claims) {

            var requiredClaims = [];
            if (angular.isDefined(claims)) {
                requiredClaims = claims.split(",");
            }

            if (requiredClaims.length == 0) {
                return true;
            }

            var hasClaim = false;

            for (var j = 0; j < requiredClaims.length; j++) {
                if (authenticationService.HasAnyMatchingClaim(requiredClaims[j])) {
                    hasClaim = true;
                }
            }

            return hasClaim;
        };

        return {
            addApplication: function (applicationKey, navigationData, configurationData) {

                if (navigationCollection[applicationKey]) {

                    alert("Warning: " + applicationKey + " already exists.");
                    return;
                }

                if (uniqueApplicationId(configurationData.Id)) {
                    tempNavigationCollection[applicationKey.toLowerCase()] = navigationData;
                    tempConfigurationCollection[applicationKey.toLowerCase()] = configurationData;
                    tempApplications.push(applicationKey);
                }
            },
            Applications: applications,
            GetApplicationNavigation: function (key) {

                var navigationItems = [];
                if (!navigationCollection[key]) {
                    return navigationItems;
                }

                for (var i = 0; i < navigationCollection[key].length; i++) {

                    var hasClaim = claimExists(navigationCollection[key][i].requiredClaim);

                    if (hasClaim) {
                        navigationItems.push(navigationCollection[key][i]);
                        var childNavigationItems = [];

                        if (!angular.isUndefined(navigationCollection[key][i].childNavItems)) {
                            for (var y = 0; y < navigationCollection[key][i].childNavItems.length; y++) {

                                var childHasClaim = claimExists(navigationCollection[key][i].childNavItems[y].requiredClaim);

                                if (childHasClaim) {
                                    childNavigationItems.push(navigationCollection[key][i].childNavItems[y]);
                                }
                            }

                            navigationCollection[key][i].childNavItems = childNavigationItems;
                        }
                    }
                }

                return navigationItems;
            },
            GetApplicationConfiguration: function (key) { return configurationCollection[key]; },
            GetApplications: function () {
                return applications;
            }
        };
    })
    .factory('uiLoader', function ($q, $timeout) {

        var useChainWithLoader = function (scope, actions, successAction, errorAction) {
            $timeout(function () {
                scope.loading = true;
                scope.showContent = false;
                scope.loadEmpty = false;

                var defer = $q.defer();
                var promises = [];

                angular.forEach(actions, function (value) {
                    promises.push(value());
                });

                scope.loading = true;
                scope.showContent = false;
                scope.loadEmpty = false;

                $q.all(promises)
                    .then($q.spread(successAction)).then(function () {
                        scope.loading = false;
                        scope.showContent = true;
                        scope.loadEmpty = false;
                    }).catch
                    (function (error) {
                        errorAction(error);
                        scope.loading = false;
                        scope.loadError = true;
                    });;

                return defer;
            });
        };

        var useWithLoader = function (scope, action, successAction, errorAction) {

            $timeout(function () {
                scope.loading = true;
                scope.showContent = false;
                scope.loadEmpty = false;

                var result = action();

                if (angular.isDefined(result.success)) {
                    result.success(function (data) {
                        successAction(data);
                        scope.loading = false;
                        scope.loadError = false;
                        scope.loadEmpty = false;
                        scope.showContent = true;
                    })
                        .error(function (data) {
                            scope.loading = false;
                        }).catch(function (error) {
                            scope.loading = false;

                            //capture mustnt show error for 409. needs to be excluded somehow.
                            if (error.status != "409" && !angular.isDefined(errorAction))
                                scope.loadError = true;

                            if (angular.isDefined(errorAction)) {
                                errorAction(error);
                                scope.loadError = false;
                                scope.loadEmpty = false;
                                scope.showContent = true;
                            }
                        });
                } else {
                    result.then(function (data) {
                        successAction(data);
                        scope.loading = false;
                        scope.loadError = false;
                        scope.showContent = true;
                    })
                        .catch(function (error) {
                            errorAction(error);
                            scope.loading = false;
                            scope.loadError = true;
                        });
                }
            });
        };

        return {
            UseChainWithLoader: function (scope, actions, successAction, errorAction) {
                useChainWithLoader(scope, actions, successAction, errorAction);
                scope.LoadingMessage = "Loading ...";
            },
            UseWithLoader: function (scope, action, successAction, errorAction) {
                useWithLoader(scope, action, successAction, errorAction);
                scope.LoadingMessage = "Loading ...";
            },
            UseLoaderWithCustomMessage: function (scope, action, successAction, customMessage, errorAction) {
                useWithLoader(scope, action, successAction, errorAction);
                scope.LoadingMessage = customMessage;
            }
        };
    })
    .factory('validationService', function () {
        return {
            validateForm: function (scope, formObject, customValidationRules) {

                var validationResults = [];

                var formToValidate = $eval("scope." + formObject);

                if (!formToValidate.$invalid) {
                    if (customValidationRules.length > 0) {
                        angular.forEach(customValidationRules, function (value, key) {
                            var result = eval(value);
                            if (result != "") {
                                validationResults.push(result);
                            }
                        });
                    }
                }

                return validationResults;
            }
        };
    })
    .factory('watchingService', function () {
        // generates a toggle for the event listeners on the scope
        var generateWatchToggler = function (watchExpr, fn, scope) {
            var watchFn;
            return function () {
                if (watchFn) {
                    watchFn();
                    watchFn = undefined;
                    console.log("Disabled " + watchExpr);
                } else {
                    watchFn = scope.$watch(watchExpr, fn);
                    console.log("Enabled " + watchExpr);
                }
            };
        };

        // method call for handling when the property changes
        // If the property has changes and changes are allowed by the 'changeAllowed' evaluation, the changeAction is executed
        // todo: create complex object for propertyChanges 
        var propertyChanged = function (scope, oldValue, newValue, objectName, propertyName, watchCollection, changeAction, changeAllowed) {
            var object = scope.$parent[objectName];

            if (oldValue == "undefined" || oldValue == undefined) {
                return;
            }
            if (oldValue != newValue) {
                if (eval(changeAllowed())) {
                    changeAction();
                    return;
                }

                // if we cannot execute then we need to revert ( ideally validation should take care of this, but this is for POC )
                // retrieve the toggle method from the collection relative to the scope
                var watchToggleFunction = watchCollection[objectName + '.' + propertyName];
                // toggle the event listener
                scope.$eval(watchToggleFunction);
                // revert values
                object[propertyName] = oldValue;
                // toggle the event listener
                scope.$eval(watchToggleFunction);
            }
        };

        return {
            startWatch: function (scope, objectName, propertyName, watchCollection, changeAction, changeAllowed) {
                var watchToggler = generateWatchToggler(objectName + '.' + propertyName, function (newValue, oldValue) {
                    propertyChanged(scope, oldValue, newValue, objectName, propertyName, watchCollection, changeAction, changeAllowed);
                }, scope);

                watchToggler();

                watchCollection[objectName + '.' + propertyName] = watchToggler;
            }
        };
    })
    .factory('resourceService', function ($resource) {

        return {
            buildResource: function (apiUrl, additionalMethods) {

                var methods = {
                    get: { method: 'GET', params: {}, isArray: true },
                    getSingle: { method: 'GET', params: { id: '@id' }, isArray: false },
                    update: {
                        method: 'PUT',
                        params: {
                            updateParam: "@updateParam"
                        }
                    }
                }

                if (!angular.isUndefined(additionalMethods)) {
                    for (var i = 0; i < additionalMethods.length; i++) {
                        methods[additionalMethods[i].key] = additionalMethods[i].value;
                    }
                }

                return $resource(apiUrl, {}, methods);
            }
        };
    })
    .factory('httpResponseService', function (eventBroadcastingService) {
        var broadCastError = function (message) {
            eventBroadcastingService.UINotify({ Success: false, Message: message });
        }

        var broadCastSuccess = function (message) {
            eventBroadcastingService.UINotify({ Success: true, Message: message });
        }

        var handleCustomSuccess = function (successCode, alertMessage) {
            switch (successCode) {
                case 200:
                case 201:
                case 202:
                case 204:
                    broadCastSuccess(alertMessage);
                    break;

                default:
                    broadCastSuccess("Your action was successful.");
                    break;
            }
        }

        var handleDefaultSuccess = function (successCode, resourceName, actionName) {
            switch (successCode) {
                case 201:
                    broadCastSuccess("The " + resourceName + " was created successfully.");
                    break;
                case 200:
                case 202:
                case 204:
                    broadCastSuccess("The " + actionName + " on " + resourceName + " was executed successfully.");
                    break;

                default:
                    broadCastSuccess("Your action was successful.");
                    break;
            }
        }

        var handleCustomError = function (errorCode, alertMessage) {
            switch (errorCode) {
                case 400:
                case 401:
                case 403:
                case 404:
                case 408:
                case 409:
                case 500:
                case 503:
                    broadCastError(alertMessage);
                    break;

                default:
                    broadCastError("An error has occured, please try again later");
                    break;
            }
        }

        var handleDefaultError = function (errorCode, resourceName, actionName) {
            switch (errorCode) {
                case 400:
                    broadCastError("The " + resourceName + " data you sent to the server was not formatted correctly, please check all submitted values.");
                    break;
                case 401:
                    broadCastError("You are unauthorised to access the requested " + resourceName);
                    break;
                case 403:
                    broadCastError("You are forbidden to access the requested " + resourceName);
                    break;
                case 404:
                    broadCastError("The " + resourceName + " you tried to access could not be found.");
                    break;
                case 409:
                    broadCastError("The " + resourceName + " you tried to modify was previously modified - please reload your data and try again.");
                    break;
                case 408:
                case 500:
                    broadCastError("The service " + actionName + " on your " + resourceName + " is temporarily down. Please try again shortly.");
                    break;

                default:
                    broadCastError("There was an error processing your  " + resourceName + " request, please try again later. If the problem continues, please contact an administrator.");
                    break;
            }
        }

        return {
            HandleCustomError: function (httpCode, alertMessage) {
                handleCustomError(httpCode, alertMessage);
            },
            HandleDefaultError: function (httpCode, resourceName, action) {
                handleDefaultError(httpCode, resourceName, action);
            },
            HandleCustomSuccess: function (httpCode, alertMessage) {
                handleCustomSuccess(httpCode, alertMessage);
            },
            HandleDefaultSuccess: function (httpCode, resourceName) {
                handleDefaultSuccess(httpCode, resourceName);
            }
        };
    })
    .service("EasyModalService", [
        '$modal', '$q', function ($modal, $q) {

            function showModalAsync(input) {
                var deferred = $q.defer();

                var modalInstance = $modal.open({
                    templateUrl: 'Views/EasyModal/EasyModal.html',
                    controller: 'EasyModalAsyncController',
                    size: 'lg',
                    windowClass: 'easy-modal-window-large',
                    resolve: {
                        model: function () {
                            return { input: input }
                        }
                    }
                });

                modalInstance.result.then(function (returnResult) { deferred.resolve(returnResult); }, null);

                return deferred.promise;
            }

            return {
                showModalAsync: function (input) {
                    return showModalAsync(input);
                }

            }
        }
    ])
  .service("EasyUpload", [
        '$upload', function ($upload) {

            function uploadFile(file, url, metadata) {

                metadata.FileName = file.name;

                return $upload.upload({
                    url: url,
                    method: "POST",
                    data: { Metadata: metadata },
                    file: file
                });
            }

            return {
                uploadFile: function (file, url, metadata) {
                    return uploadFile(file, url, metadata);
                }
            }

        }
  ]);
var SignalRConnection = function (userId) {
    var connected = false;
    var hubUrl;
    var hubName;
    var actions = [];
    var monitorService = false;
    var preStartRetryEnabled = false;
    var serviceRunningCallback;
    var serviceNotRunningCallback;
    var enableJsonP = false;
    var myHub;

    this.enableServiceMonitor = function (serviceNotRunningAction, serviceRunningAction) {
        monitorService = true;

        serviceNotRunningCallback = serviceNotRunningAction;
        serviceRunningCallback = serviceRunningAction;

        return this;
    };

    this.server = function () {
        return myHub.server;
    };

    this.addAction = function (name, action) {
        var item = { name: name, action: action };
        actions.push(item);
        return this;
    };

    this.configureSignalRHub = function (url, name) {
        hubUrl = url;
        hubName = name;
        return this;
    };

    this.run = function (token) {
        tryStartSignalR(token);
        return this;
    };

    this.enablePreStartRetry = function () {
        preStartRetryEnabled = true;
        return this;
    };

    this.enableJsonP = function () {
        enableJsonP = true;
        return this;
    };

    function delay(callback) {
        var millisecondsToWait = 10000;
        setTimeout(function () {
            callback();
        }, millisecondsToWait);
    }

    function tryStartSignalRAsync(func) {
        var loop = {
            next: function () {
                if (connected) {
                    return;
                }

                if (!connected) {
                    func(loop);
                }
            }
        };
        loop.next();
        return loop;
    }

    function updateStatus(running) {
        if (!monitorService)
            return;
        if (running)
            serviceRunningCallback();
        else
            serviceNotRunningCallback();
    }

    function tryStartSignalR(token) {

        window.jQuery.getScript(hubUrl + "/signalr/hubs")
            .done(function () {
                runSignalR(token);
            })
            .fail(function (data) {
                if (!preStartRetryEnabled)
                    return;
                tryStartSignalRAsync(function (loop) {
                    delay(function () {
                        if (!connected) {
                            tryStartSignalRWithoutFail(hubUrl);
                            loop.next();
                        } else {
                            updateStatus(true);
                        }
                    });
                }
                );
            });
    }

    function runSignalR(token) {

        var connection = $.hubConnection();
        connection.url = hubUrl + "signalr";

        var myHub = connection.createHubProxy(hubName);

        if (myHub != undefined) {

            for (var i = 0; i < actions.length; i++) {
                myHub.on(actions[i].name, actions[i].action);
            }

            connection.start({ jsonp: false, token: token }).done(function () {
                connected = true;
                updateStatus(true);
            }).fail(
                function (data) {
                    //   alert("X");
                });

            connection.reconnected(function () {
                updateStatus(true);
            });

            connection.reconnecting(function () {
                updateStatus(false);

                setTimeout(function () {
                    connection.start(token);
                }, 5000);
            });

        }
    }

    function tryStartSignalRWithoutFail(token) {
        try {
            window.jQuery.getScript(hubUrl + "/signalr/hubs")
            .done(function () {
                runSignalR(token);
            });
        }
        catch (exception) {
            alert("fail");
        }

    }
};
