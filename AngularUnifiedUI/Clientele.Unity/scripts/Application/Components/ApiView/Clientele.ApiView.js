/**********************************************************************************************/
/* Component / Module Definition                                                              */
/**********************************************************************************************/

applicationHost.registerApplication("Clientele.ApiView");

/**********************************************************************************************/
angular.module('Clientele.ApiView', ['Clientele.ApiView.Routes'])
    .run(['unityApplicationRepository', function (unityApplicationRepository) {


        // this is needs to be a sequential guid
        var myApplicationGuid = "7CFE91E5-D2DE-478C-B165-B5BAA0FE77D3";

        var componentKey = "ApiView";

        var configuration = {
            Id: myApplicationGuid,
            applicationName: "Clientele Api View",
            icon: "/content/images/apiview.png",
            WorkFlowServiceApiUrl: "http://localhost:52421/api/",

            IdentityPrefix: "Clientele.ApiView"
        };

        var titleBarNavigation = [];

        titleBarNavigation.push({ url: '#/' + componentKey + '/', label: 'Api View', requiredClaim: "" });

        unityApplicationRepository.addApplication(componentKey, titleBarNavigation, configuration);
    }]);
