/**********************************************************************************************/
/* Component / Module Definition                                                              */
/* Includes the reference to the data API and the route definitions for the component itself  */
/**********************************************************************************************/

//tasks functionality


applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/SoftiDoc.WorkFlowServices.Controllers.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/SoftiDoc.WorkFlowServices.Services.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/SoftiDoc.WorkFlowServices.Directives.js");

applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/SoftiDoc.WorkFlowServices.Tasks.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/SoftiDoc.WorkFlowServices.Tasks.Controllers.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/SoftiDoc.WorkFlowServices.Tasks.Directives.js");
applicationHost.registerJavaScript("/scripts/Application/Components/WorkflowServices/Tasks/SoftiDoc.WorkFlowServices.Tasks.Services.js");

applicationHost.registerApplication("SoftiDoc.WorkFlowServices");

/**********************************************************************************************/
angular.module('SoftiDoc.WorkFlowServices', [ 'SoftiDoc.WorkFlowServices.Tasks','SoftiDoc.WorkFlowServices.Controllers', 'SoftiDoc.WorkFlowServices.Directives', 'SoftiDoc.WorkFlowServices.Services'])
    .run(function (unityApplicationRepository){
        var componentId = "a17ef72d-dd66-cae9-895d-08d0b96e23c5";


    	var configuration = { Id: componentId, searchUrl: "", applicationName: "SoftiDoc Workflow Services", icon: "", IdentityPrefix: "SoftiDoc.WorkflowServices", WorkFlowServiceApiUrl: "" };

    	var titleBarNavigation = [];

    	unityApplicationRepository.addApplication('WorkFlowServices', titleBarNavigation, configuration);
    });

/**********************************************************************************************/
/* Component Specific Directives                                                              */
/**********************************************************************************************/


/**********************************************************************************************/
