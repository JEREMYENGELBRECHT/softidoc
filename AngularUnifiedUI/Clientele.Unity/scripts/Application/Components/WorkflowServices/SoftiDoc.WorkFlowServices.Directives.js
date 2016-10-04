angular.module('SoftiDoc.WorkFlowServices.Directives', [])
    .directive('workflowTeamList', function () {
        return {
            restrict: 'E',
            templateUrl: '/Views/WorkFlowServices/TeamManagement/WorkFlowTeamList.html',
            scope: {
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                errorOccuredEvent: '=?',
                overrideTemplate: '=?'
            },
            controller: 'workflowTeamListController',
            compile: function (tElement, tAtrrs) {
                if (!angular.isUndefined(tAtrrs.overrideTemplate)) {
                    if (tAtrrs.overrideTemplate != "") {
                        if (eval(tAtrrs.overrideTemplate)) {
                            tElement.html("");
                        }
                    }
                }

                return {
                    post: function postLink(scope, iElement, iAttrs, controller) {
                        scope.$broadcast('SoftiDoc.Workflow.InitializeComplete', null);
                    }
                };
            }
        };
    })
    .directive('workflowTeamMemberList', function () {
        return {
            restrict: 'E',
            templateUrl: '/Views/WorkFlowServices/TeamManagement/WorkflowTeamMemberList.html',
            scope: {
                loadEvent: '=?',
                cacheData: '=?',
                dataLoadedEmitEvent: '=?',
                errorOccuredEvent: '=?',
                overrideTemplate: '=?'
            },
            controller: 'WorkflowTeamMemberListController',
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
    })
     .directive('workflowRoleList', function () {
         return {
             restrict: 'E',
             templateUrl: '/Views/WorkFlowServices/TeamManagement/RoleList.html',
             scope: {
                 loadEvent: '=?',
                 cacheData: '=?',
                 dataLoadedEmitEvent: '=?',
                 errorOccuredEvent: '=?',
                 overrideTemplate: '=?'
             },
             controller: 'workflowRoleListController',
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
     });