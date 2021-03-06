﻿/**********************************************************************************************/
/* Routing                                                                                    */
/* Routing Requires the controllers for assignment to a route - these use the 'lookup' method */
/**********************************************************************************************/
angular.module('SoftiDoc.Unity.Routes', ['SoftiDoc.Unity.Controllers', 'SoftiDoc.Unity.EnvironmentVariables', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.
            when("/", { templateUrl: '/Views/Unity/home.html'}).
            when("/noaccess", { templateUrl: '/Views/Unity/accessdenied.html', controller: 'accessDeniedController', caseInsensitiveMatch: true }).
            when("/MainPage", { templateUrl: '/Views/Unity/MainPage.html', controller: 'MainPageController', caseInsensitiveMatch: true }).
            when("/IdentityNotFound/", { templateUrl: '/IdentityNotFound.html', controller: 'identityNotFoundController', caseInsensitiveMatch: true }).
            when("/NoAccessRights/", { templateUrl: '/NoAccessRights.html', caseInsensitiveMatch: true }).
            when("/Login", { templateUrl: '/Views/Unity/Login.html', controller: 'loginController', caseInsensitiveMatch: true }).
            when("/Logout", { templateUrl: '/Views/Unity/logout.html', controller: 'logoutController', caseInsensitiveMatch: true });
    });
