/**********************************************************************************************/
/* Routing                                                                                    */
/* Routing Requires the controllers for assignment to a route - these use the 'lookup' method */
/**********************************************************************************************/

angular.module('Clientele.ServiceError.Routes', ['Clientele.ServiceError.Controllers'])
    .config(function ($routeProvider) {

        var componentKey = "ServiceError";
        var componentUrlPrefix = "/" + componentKey + "/";
        var viewLocationPrefix = "/views/" + componentKey + "/";

    $routeProvider
        .when(componentUrlPrefix, { templateUrl: viewLocationPrefix + 'Index.html', controller: 'serviceErrorIndexController', caseInsensitiveMatch: true })
        .when(componentUrlPrefix + "Error/", { templateUrl: viewLocationPrefix + 'Errors.html', controller: 'serviceErrorErrorController', caseInsensitiveMatch: true });
});