/**********************************************************************************************/
/* Routing                                                                                    */
/* Routing Requires the controllers for assignment to a route - these use the 'lookup' method */
/**********************************************************************************************/

angular.module('Clientele.ApiView.Routes', ['Clientele.ApiView.Controllers'])
    .config(function ($routeProvider) {

        var componentKey = "ApiView";
        var componentUrlPrefix = "/" + componentKey + "/";
        var viewLocationPrefix = "/views/" + componentKey + "/";

        $routeProvider
            .when(componentUrlPrefix, { templateUrl: viewLocationPrefix + 'Index.html', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "WorkFlowServices/", { templateUrl: viewLocationPrefix + 'WorkFlowServices.html', controller: 'apiViewWorkFlowServicesController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "PolicyQuery/", { templateUrl: viewLocationPrefix + 'PolicyQuery.html', controller: 'apiViewPolicyQueryController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "PolicyComments/", { templateUrl: viewLocationPrefix + 'PolicyComments.html', controller: 'apiViewPolicyCommentsController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "AccountingHistory/", { templateUrl: viewLocationPrefix + 'AccountingHistory.html', controller: 'apiViewAccountingHistorySummaryController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "Riders/", { templateUrl: viewLocationPrefix + 'Riders.html', controller: 'apiViewRidersController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "PolicyIndividuals/", { templateUrl: viewLocationPrefix + 'PolicyIndividuals.html', controller: 'apiViewPolicyIndividualsController', caseInsensitiveMatch: true })
            .when(componentUrlPrefix + "PolicyStatusHistory/", { templateUrl: viewLocationPrefix + 'PolicyStatusHistory.html', controller: 'apiViewPolicyStatusHistoryController', caseInsensitiveMatch: true });
    });