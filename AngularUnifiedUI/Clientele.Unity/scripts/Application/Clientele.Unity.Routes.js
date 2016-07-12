/**********************************************************************************************/
/* Routing                                                                                    */
/* Routing Requires the controllers for assignment to a route - these use the 'lookup' method */
/**********************************************************************************************/
angular.module('Clientele.Unity.Routes', ['Clientele.Unity.Controllers', 'Clientele.Unity.EnvironmentVariables', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.
            when("/", { templateUrl: '/Views/Unity/home.html' }).
            when("/noaccess", { templateUrl: '/Views/Unity/accessdenied.html', controller: 'accessDeniedController', caseInsensitiveMatch: true }).
            when("/IdentityNotFound/", { templateUrl: '/IdentityNotFound.html', controller: 'identityNotFoundController', caseInsensitiveMatch: true }).
            when("/NoAccessRights/", { templateUrl: '/NoAccessRights.html', caseInsensitiveMatch: true }).
            when("/Login", { templateUrl: '/Views/Unity/Login.html', controller: 'loginController', caseInsensitiveMatch: true }).
            when("/Logout", { templateUrl: '/Views/Unity/logout.html', controller: 'logoutController', caseInsensitiveMatch: true });
    });
