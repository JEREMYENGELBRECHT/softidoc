angular.module("testApp", ['ngRoute', 'services'])
    .config(function ($routeProvider) {
        $routeProvider.
            when("/", { templateUrl: '/Views/home.html', controller: 'test1Controller', caseInsensitiveMatch: true });
    })
    .controller("test1Controller", ["$scope", "resourceService", function ($scope, resourceService) {

        for (var i = 0; i < 3000; i++) {
            var x = resourceService.buildResource("/test", []);
            x = null;
        }
    }]);


angular.module("services", ["Resourcing"]);

angular.module("Resourcing", ['ngResource'])

.factory('resourceService', function ($resource) {

    return {
        buildResource: function (apiUrl, additionalMethods) {

            var methods = {
                get: { method: 'GET', params: {}, isArray: true },
                getSingle: { method: 'GET', params: { id: '@id' }, isArray: false },
                update: {
                    method: 'PUT',
                    params: {
                        metadataItem: "@updateParam"
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
});






