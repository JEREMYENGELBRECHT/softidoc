/**********************************************************************************************/
(function () {

    var buildNumber = applicationHost.BuildNumber;

    var workflowAdvancedTaskDashboard = function () {
        return {
            restrict: 'E',
            templateUrl: '/Views/WorkflowServices/Tasks/Dashboard/AdvancedDashboard.tpl.html?buildNumber=' + buildNumber,
            scope: {
                transactions: '=?',
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                overrideTemplate: '=?'
            },
       //     controller: "WorkflowServices.Tasks.Controllers.DashboardController",
            compile: function (tElement, tAtrrs) {
                if (!angular.isUndefined(tAtrrs.overrideTemplate)) {
                    if (tAtrrs.overrideTemplate != "") {
                        if (eval(tAtrrs.overrideTemplate)) {
                            tElement.html("");
                        }
                    }
                }
            }
        };
    };


    var workflowTaskDashboard = function () {
        return {
            restrict: 'E',
            templateUrl: '/Views/WorkflowServices/Tasks/Dashboard/Dashboard.tpl.html?buildNumber=' + buildNumber,
            scope: {
                transactions: '=?',
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                overrideTemplate: '=?'
            },
            controller: "WorkflowServices.Tasks.Controllers.DashboardController",
            compile: function (tElement, tAtrrs) {
                if (!angular.isUndefined(tAtrrs.overrideTemplate)) {
                    if (tAtrrs.overrideTemplate != "") {
                        if (eval(tAtrrs.overrideTemplate)) {
                            tElement.html("");
                        }
                    }
                }
            }
        };
    };

    var workflowActions = function () {
        return {
            restrict: 'E',
            templateUrl: '/Views/WorkflowServices/Tasks/Templates/TaskActionMenu.tpl.html?buildNumber=' + buildNumber,
            scope: {
                additionalActions: '=?',
                actionMenuLabel: '=?',
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                overrideTemplate: '=?'
            },
            controller: "WorkflowServices.Tasks.Controllers.TaskActionController",
            compile: function (tElement, tAtrrs) {
                if (!angular.isUndefined(tAtrrs.overrideTemplate)) {
                    if (tAtrrs.overrideTemplate != "") {
                        if (eval(tAtrrs.overrideTemplate)) {
                            tElement.html("");
                        }
                    }
                }
            }
        };
    };

    angular.module('SoftiDoc.WorkFlowServices.Tasks.Directives', [])
    .directive("workflowTaskDashboard", workflowTaskDashboard)
    .directive("workflowAdvancedTaskDashboard", workflowAdvancedTaskDashboard)
    .directive("workflowActions", workflowActions);
})();

