/**********************************************************************************************/
/* Routing                                                                                    */
/* Routing Requires the controllers for assignment to a route - these use the 'lookup' method */
/**********************************************************************************************/

angular.module('Clientele.MyComponent.Routes', ['Clientele.MyComponent.Controllers'])
    .config(function ($routeProvider) {

        var componentKey = "MyComponent";
        var componentUrlPrefix = "/" + componentKey + "/";
        var viewLocationPrefix = "/views/" + componentKey + "/";

        $routeProvider
            .when(componentUrlPrefix, { templateUrl: viewLocationPrefix + 'Index.html', controller: 'myComponentIndexController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "Upload/", { templateUrl: viewLocationPrefix + 'Upload.html', controller: 'myComponentUploadController', caseInsensitiveMatch: true });
    });