/**********************************************************************************************/
/* Component / Module Definition                                                              */
/**********************************************************************************************/

applicationHost.registerApplication("Clientele.MyComponent");

/**********************************************************************************************/
angular.module('Clientele.MyComponent', ['Clientele.MyComponent.Routes'])
    .run(['unityApplicationRepository', function (unityApplicationRepository, cssInjector) {

        
        // this is needs to be a sequential guid
        var myApplicationGuid = "2d3052d3-c444-cd68-126a-08d0fb7a3566";
        var componentKey = "MyComponentKey";
        
        var configuration = {
            Id: myApplicationGuid,
            searchUrl: "/" + componentKey + "/search/",
            applicationName: "Clientele MyComponent",
            icon: "/content/images/myComponent.png",
            IdentityPrefix: "Clientele.MyComponent"
        };

        var titleBarNavigation = [];


        titleBarNavigation.push({ url: '#/' + componentKey + '/', label: 'MyComponent Home', requiredClaim: "Clientele.MyComponent" });

        titleBarNavigation.push({
            url: '#/' + componentKey + '/Documents/', label: 'Documents', requiredClaim: "Clientele.MyComponent",
            childNavItems:
            [
                { url: '#/' + componentKey + '/Documents/Upload/', label: 'Upload file', requiredClaim: "Clientele.RecordStore.Upload" },
            ]
        });
        

        titleBarNavigation.push({ url: '#/' + componentKey + '/Administer/', label: 'Administer', requiredClaim: "Clientele.MyComponent.Administer" });

        unityApplicationRepository.addApplication(componentKey, titleBarNavigation, configuration);
        
        //cssInjector.add("/Content/Components/Clientele.MyComponent.css");
    }]);
