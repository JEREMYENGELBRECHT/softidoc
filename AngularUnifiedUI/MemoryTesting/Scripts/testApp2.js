angular.module("testApp", ['ngRoute', 'services'])
    .config(function ($routeProvider) {
        $routeProvider.
            when("/", { templateUrl: '/Views/home.html', controller: test2Controller, caseInsensitiveMatch: true });
    });

angular.module("services", ["Resourcing2"]);

var modules = angular.module("Resourcing2", ['ngResource']);

for (var i = 0; i < 3000; i++) {
    modules.factory('someResource' + i, function ($resource) { return $resource("/test/test/", {}, []); });
}



var functionString = "function($scope";
for (var i = 0; i < 3000; i++) {
    functionString += ",someresource" + i;
}

functionString += "){};";

eval("var test2Controller = " + functionString);

var injectString = ['$scope'];

for (var i = 0; i < 3000; i++) {
    injectString.push('someResource' + i);
}

test2Controller['$inject'] = injectString;








