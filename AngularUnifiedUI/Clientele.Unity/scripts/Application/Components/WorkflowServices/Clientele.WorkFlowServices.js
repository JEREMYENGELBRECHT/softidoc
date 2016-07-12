/**********************************************************************************************/
/* Component / Module Definition                                                              */
/* Includes the reference to the data API and the route definitions for the component itself  */
/**********************************************************************************************/

//tasks functionality


applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Clientele.WorkFlowServices.Controllers.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Clientele.WorkFlowServices.Services.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Clientele.WorkFlowServices.Directives.js");

applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/Clientele.WorkFlowServices.Tasks.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/Clientele.WorkFlowServices.Tasks.Controllers.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/Clientele.WorkFlowServices.Tasks.Directives.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/Clientele.WorkFlowServices.Tasks.Services.js");

applicationHost.registerApplication("Clientele.WorkFlowServices");

/**********************************************************************************************/
angular.module('Clientele.WorkFlowServices', [ 'Clientele.WorkFlowServices.Tasks','Clientele.WorkFlowServices.Controllers', 'Clientele.WorkFlowServices.Directives', 'Clientele.WorkFlowServices.Services'])
    .run(function (unityApplicationRepository){
        var componentId = "a17ef72d-dd66-cae9-895d-08d0b96e23c5";


    	var configuration = { Id: componentId, searchUrl: "", applicationName: "Clientele Workflow Services", icon: "", IdentityPrefix: "Clientele.WorkflowServices", WorkFlowServiceApiUrl: "" };

    	var titleBarNavigation = [];

    	unityApplicationRepository.addApplication('WorkFlowServices', titleBarNavigation, configuration);
    });

/**********************************************************************************************/
/* Component Specific Directives                                                              */
/**********************************************************************************************/


/**********************************************************************************************/
