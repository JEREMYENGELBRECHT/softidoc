/**********************************************************************************************/
/* Component / Module Definition                                                              */
/**********************************************************************************************/

applicationHost.registerApplication("SoftiDoc.ServiceError");

/**********************************************************************************************/
angular.module('SoftiDoc.ServiceError', ['SoftiDoc.ServiceError.Routes'])
    .run(['unityApplicationRepository', function (unityApplicationRepository, cssInjector) {
        
        // this is needs to be a sequential guid
        var myApplicationGuid = "96AE8610-7BEB-454C-94C6-C5B5AD4F0684";
        var componentKey = "ServiceError";
        
        var configuration = {
            Id: myApplicationGuid,
            searchUrl: "",
            applicationName: "Clientèle Service Error",
            icon: "/content/images/myComponent.png",
            IdentityPrefix: "SoftiDoc.ServiceError"
        };

        var titleBarNavigation = [];
        
        titleBarNavigation.push({ url: '#/' + componentKey + '/', label: 'Service Errors Home', requiredClaim: "" });

        titleBarNavigation.push({
            url: '#/' + componentKey + '/Error/', label: 'Error', requiredClaim: ""           
        });
        
        //titleBarNavigation.push({
          //  url: '#/Error/', label: 'Documents', requiredClaim: "",
            //childNavItems:
            //[
              //  { url: '#/' +componentKey + '/Developer/CreateDeveloper', label: 'Register a developer', requiredClaim: "" },
                //{ url: '#/' +componentKey + '/Application/CreateApplication', label: 'Create an Application', requiredClaim: "" },
                //{ url: '#/' +componentKey +'/ApplicationDeveloper/AssignDeveloperToApplication', label: 'Assign a person to get notified. ', requiredClaim: "" }
           // ]
        //});
        unityApplicationRepository.addApplication(componentKey, titleBarNavigation, configuration);
        
        //cssInjector.add("/Content/Components/SoftiDoc.MyComponent.css");
    }]);
