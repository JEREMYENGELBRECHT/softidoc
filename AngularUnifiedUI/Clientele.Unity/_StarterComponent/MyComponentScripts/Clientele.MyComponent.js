/**********************************************************************************************/
/* Component / Module Definition                                                              */
/**********************************************************************************************/

applicationHost.registerApplication("SoftiDoc.MyComponent");

/**********************************************************************************************/
angular.module('SoftiDoc.MyComponent', ['SoftiDoc.MyComponent.Routes'])
    .run(['unityApplicationRepository', function (unityApplicationRepository, cssInjector) {

        
        // this is needs to be a sequential guid
        var myApplicationGuid = "2d3052d3-c444-cd68-126a-08d0fb7a3566";
        var componentKey = "MyComponentKey";
        
        var configuration = {
            Id: myApplicationGuid,
            searchUrl: "/" + componentKey + "/search/",
            applicationName: "SoftiDoc MyComponent",
            icon: "/content/images/myComponent.png",
            IdentityPrefix: "SoftiDoc.MyComponent"
        };

        var titleBarNavigation = [];


        titleBarNavigation.push({ url: '#/' + componentKey + '/', label: 'MyComponent Home', requiredClaim: "SoftiDoc.MyComponent" });

        titleBarNavigation.push({
            url: '#/' + componentKey + '/Documents/', label: 'Documents', requiredClaim: "SoftiDoc.MyComponent",
            childNavItems:
            [
                { url: '#/' + componentKey + '/Documents/Upload/', label: 'Upload file', requiredClaim: "SoftiDoc.RecordStore.Upload" },
            ]
        });
        

        titleBarNavigation.push({ url: '#/' + componentKey + '/Administer/', label: 'Administer', requiredClaim: "SoftiDoc.MyComponent.Administer" });

        unityApplicationRepository.addApplication(componentKey, titleBarNavigation, configuration);
        
        //cssInjector.add("/Content/Components/SoftiDoc.MyComponent.css");
    }]);
