/**********************************************************************************************/
/* Component / Module Definition                                                              */
/* Includes the reference to the data API and the route definitions for the component itself  */
/**********************************************************************************************/

applicationHost.registerApplication("Clientele.RecordStore");

applicationHost.registerJavaScript("/scripts/Application/Components/RecordStore/Clientele.RecordStore.Routes.js");
applicationHost.registerJavaScript("/scripts/Application/Components/RecordStore/Clientele.RecordStore.Services.js");
applicationHost.registerJavaScript("/scripts/Application/Components/RecordStore/Controllers/Clientele.RecordStore.Controllers.AdvancedSearch.js");
applicationHost.registerJavaScript("/scripts/Application/Components/RecordStore/Controllers/Clientele.RecordStore.Controllers.js");

/**********************************************************************************************/
angular.module('Clientele.RecordStore', ['Clientele.RecordStore.Routes', 'Clientele.RecordStore.Services'])
    .run(function (unityApplicationRepository, cssInjector) {

        var recordStoreGuid = "a179f72d-dd66-cae9-895d-08d0b96e23c5";
        var configuration = { Id: recordStoreGuid, searchUrl: "/recordstore/advancedSearch/", applicationName: "Clientèle Record Store", icon: "/content/images/recordStoreIcon.jpg", IdentityPrefix: "Clientele.RecordStore" };

        var titleBarNavigation = [];

        titleBarNavigation.push({ url: '#/RecordStore/', label: 'Record Store Home', requiredClaim: "" });
        titleBarNavigation.push({ url: '#/RecordStore/upload/', label: 'Upload file', requiredClaim: "" });
        titleBarNavigation.push({ url: '#/RecordStore/source/', label: 'All records', requiredClaim: "" });
        titleBarNavigation.push({ url: '#/RecordStore/advancedSearch/', label: 'Advanced Search', requiredClaim: "" });

        unityApplicationRepository.addApplication('RecordStore', titleBarNavigation, configuration);
    });

/**********************************************************************************************/
/* Component Specific Directives                                                              */
/**********************************************************************************************/


/**********************************************************************************************/
