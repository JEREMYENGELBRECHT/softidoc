
angular.module('Clientele.AuthControllers', [])

    .controller("loginController", ['$scope', '$timeout', 'authenticationService', '$location', '$rootScope', 'noAccessRightsUrl', 'unityApplicationRepository', 'httpResponseService', 'identityServiceApiUrl', 'runningMode', function ($scope, $timeout, authenticationService, $location, $rootScope, noAccessRightsUrl, unityApplicationRepository, httpResponseService, identityServiceApiUrl, runningMode) {

        $scope.registering = false,
        $scope.loggingIn = false;

        if (runningMode != "Production") {
            $scope.showManualLogin = true;
        } else {
            $scope.showManualLogin = false;
        }

        $scope.showForm = function () {
            return $scope.loggingIn || $scope.registering;
        };

        $scope.$on("UrlRejected", function (event, rejection) {
            $timeout(function () {
                $scope.registering = false;
                $scope.loggingIn = false;
            });

            if (rejection.config.url.indexOf("register") != -1) {
                alert("There seems to be a problem registering, please contact an administrator.");
            }

            if (rejection.config.url.toLowerCase().indexOf(identityServiceApiUrl + "auth") != -1) {
                if (rejection.data.ExceptionType) {
                    if (rejection.data.ExceptionType.indexOf("IdentityService") == -1) {
                        alert("There seems to be a problem logging you in, please contact an administrator. ");

                    } else {
                        alert("There seems to be a problem logging you in, please contact an administrator.\n\nError " + rejection.data.ExceptionMessage);
                    }
                }
            }
        });

        $scope.loggingIn = false;

        $scope.username = "";
        $scope.password = "";

        $scope.tennant = "Clientele";
        $scope.surname = "";
        $scope.givenName = "";
        $scope.emailAddress = "";

        $scope.isRegistering = false;

        $scope.ShowRegister = function () {
            $scope.isRegistering = true;
        };

        $scope.CancelRegister = function () {
            $scope.isRegistering = false;
        };

        $scope.LogInWithCredentials = function () {
            if ($scope.username == "" || $scope.password == "") {
                alert("Please fill in both username and password.");
                return;
            }

            $scope.loggingIn = true;

            authenticationService.Login({ isDomainLogin: false, username: $scope.username, password: $scope.password })
             .then(function (data) {
                 $scope.loggingIn = false;

                 if (data.Success) {
                     $rootScope.$broadcast("UserLoggedIn", true);
                 } else {
                     authenticationService.RedirectToNoAccessPage();
                 }
             }).catch(
             function (data) {

                 $scope.loggingIn = false;
                 if (data.status == 500) {
                     if (angular.isDefined(data.data.ExceptionMessage)) {
                         httpResponseService.HandleCustomError(500, data.data.ExceptionMessage);
                     } else {
                         httpResponseService.HandleCustomError(500, "An error occured logging in.");
                     }

                 }
             });
        };

        $scope.RegisterWithCredentials = function () {
            if ($scope.username == "" || $scope.password == "" || $scope.surname == "" || $scope.givenName == "" || $scope.emailAddress == "") {
                alert("Please fill in all fields.");
                return;
            }

            $scope.registering = true;

            var newUser = {
                Username: $scope.username,
                Tennant: $scope.tennant,
                Surname: $scope.surname,
                GivenName: $scope.givenName,
                EmailAddress: $scope.emailAddress,
                Password: $scope.password,
            };

            var promise = authenticationService.RegisterWithCredentials(newUser);

            promise.then(function () {
                $scope.registering = true;
            });

            promise.catch(function (data) {
                $scope.registering = true;
                if (data.status == 500) {
                    if (angular.isDefined(data.data.ExceptionMessage)) {
                        httpResponseService.HandleCustomError(500, data.data.ExceptionMessage);
                    } else {
                        httpResponseService.HandleCustomError(500, "An error occured registering.");
                    }

                }
            });

        };

        $scope.knownAsName = "";

        $scope.Continue = function () {
            if (data.claimsCount > 0) {
                if (angular.isUndefined($rootScope.referrerUrl)) {
                    $location.path("/");
                } else {
                    $location.path($rootScope.referrerUrl);
                }
            }
        };

        $scope.LogInWithDomainAccount = function () {
            $scope.loggingIn = true;

            authenticationService.Login({ isDomainLogin: true })
              .then(function (data) {
                  $scope.loggingIn = false;
                  if (data.Success) {
                      $rootScope.$broadcast("UserLoggedIn", true);
                  } else {
                      authenticationService.RedirectToNoAccessPage();
                  }
              }).catch(function () {
                  authenticationService.RedirectToNoAccessPage();
                  //$scope.loggingIn = false;
              });
        };

        $scope.$on("$viewContentLoaded", function () {
            if (authenticationService.isAuthenticated()) {
                $location.path("/");
            }
        });
    }])
    .controller("accessDeniedController", ['$scope', function ($scope) {

    }])
    .controller("logoutController", ['$scope', 'authenticationService', 'eventBroadcastingService', '$location', function ($scope, authenticationService, eventBroadcastingService, $location) {
        $scope.user = {
            name: '',
            password: '',
            passwordHash: ''
        };

        $scope.ErrorMessage = "";

        $scope.hashPassword = function (password) {
            var hash = "";

            for (var i = 0; i < password.length; i++) {
                hash += "*";
            }

            $scope.user.passwordHash = hash;
        };

        $scope.$on("$viewContentLoaded", function () {
            authenticationService.Logout();
            eventBroadcastingService.broadcastEvent("UserLoggedOut", true);
            $location.path(authenticationService.AuthenticationRoute);
        });

    }]);

angular.module('Clientele.Authentication', [])
.service('authenticationService', ['$q', '$rootScope', '$location', 'ajaxJsonService', 'identityServiceApiUrl', function ($q, $rootScope, $location, ajaxJsonService, identityServiceApiUrl) {
    var authenticationRoute = "/Login";
    var logoutRoute = "/Logout";
    var claimsDictionary = {};
    var returnObject = { Success: false };
    var loggedInUser = null;

    $rootScope.BearerToken = null;

    var redirectToNoAccessPage = function () {
        $location.path("/noaccess/");
    };

    var login = function (loginParameters) {
        var deferred = $q.defer();

        if (loginParameters.isDomainLogin) {

            ajaxJsonService.Post(identityServiceApiUrl + "auth/login/windows").success(function (data) {
                $rootScope.BearerToken = data.access_token;
                    $rootScope.lastOpenedDate = new Date();

                $.ajaxSetup({
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Bearer " + data.access_token);
                    }
                });

                $rootScope.lastLogin = new Date();

                // on success get claims
                loadClaims().then(
                    function (claimsReturnData) {

                        returnObject = { Success: true, claimsCount: claimsReturnData.claimsCount };

                        setTimeout(function () {
                            if (claimsReturnData) {
                                deferred.resolve(returnObject);
                            } else {
                                deferred.resolve({ Success: false, claimsCount: 0 });
                            }
                        }, 5);
                    });

            })
            .catch(function(exception) {
                alert(exception);
            });

            return deferred.promise;

        } else {

            ajaxJsonService.Post(identityServiceApiUrl + "auth/login/credentials",
                { "Username": loginParameters.username, "Password": loginParameters.password }
                ).success(function (data) {
                    $rootScope.BearerToken = data.access_token;

                    $.ajaxSetup({
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + data.access_token);
                        }
                    });

                    // on success get claims
                    loadClaims().then(
                        function (claimsReturnData) {

                            returnObject = { Success: true, claimsCount: claimsReturnData.claimsCount };

                            setTimeout(function () {
                                if (claimsReturnData) {
                                    deferred.resolve(returnObject);
                                } else {
                                    deferred.resolve({ Success: false, claimsCount: 0 });
                                }
                            }, 5);
                        });

                }).catch(
            function (data) {
                if (angular.isDefined(data.ExceptionMessage)) {
                    if (data.ExceptionMessage.indexOf("is not registered") != -1) {
                        //  register();
                    }
                }
                return returnObject;
            });

            return deferred.promise;
        }
    };

    var hasAnyMatchingClaim = function (identityPrefix) {

        if (identityPrefix == "") {
            return true;
        }
        for (var key in claimsDictionary) {
            if (key.indexOf(identityPrefix) == 0) {
                return true;
            }
        }

        return false;
    };

    var loadClaims = function () {

        var deferred = $q.defer();

        ajaxJsonService.Get(identityServiceApiUrl + "users/me/").success(
            function (data) {

                for (var i = 0; i < data.claims.length; i++) {
                    claimsDictionary[data.claims[i].Value] = "";
                }

                loggedInUser = data.user;
                $rootScope.userId = loggedInUser.id;

                setTimeout(function () {
                    deferred.resolve({ Success: true, claimsCount: data.claims.length });
                }, 5);

            }).error(function () {
                setTimeout(function () {
                    deferred.resolve({ Success: false, claimsCount: 0 });
                }, 5);
            });

        return deferred.promise;
    };

    var hasClaim = function (requiredClaim) {
        if (!angular.isUndefined(claimsDictionary[requiredClaim])) {
            return true;
        }

        return false;
    };

    var registerWithCredentials = function (newUser) {
        return ajaxJsonService.Post(identityServiceApiUrl + "users/register/credentials", newUser).success(function (data) {
            alert("Registration successful");

            $location.path("/Login/?registered=true");
        });
    };

    return {
        GetUser: function () { return loggedInUser; },

        AuthenticationRoute: authenticationRoute,

        BearerToken: $rootScope.BearerToken,

        ValidatePageAccessWithClaim: function (requiredClaim) {
            if (!hasClaim(requiredClaim)) {
                redirectToNoAccessPage();
            }
        },

        isAuthenticated: function () {
            return $rootScope.BearerToken != null;
        },

        isAuthRoute: function (routePath) {
            return routePath == authenticationRoute;
        },

        isLogoutRoute: function (routePath) {
            return routePath == logoutRoute;
        },

        Logout: function () {

            claimsDictionary = {};
            $rootScope.BearerToken = null;
        },

        Login: function (loginParameters) {

            if (angular.isDefined($rootScope.BearerToken)) {
                if ($rootScope.BearerToken != null) {
                    return;
                }
            }

            var deferred = $q.defer();

            setTimeout(function () {
                deferred.resolve(login(loginParameters));
            }, 5);

            return deferred.promise;
        },

        RedirectToNoAccessPage: function () {
            redirectToNoAccessPage();
        },

        HasAnyMatchingClaim: function (identityPrefix) {
            return hasAnyMatchingClaim(identityPrefix);
        },

        HasClaim: function (requiredClaim) {
            return (hasClaim(requiredClaim));
        },

        RegisterWithCredentials: function (newUser) {
            return registerWithCredentials(newUser);
        },

        retrieveIdentityClaims:
            function () {
                return "claims";
            }
    };
}]);