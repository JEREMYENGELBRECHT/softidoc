/// <reference path="../../../moment.min.js" />
/**********************************************************************************************/
/* Controllers                                                                                */
/**********************************************************************************************/
ConfigDobDateTimePicker = function ($scope) {
    $scope.clear = function () {
        $scope.advSearchDob = null;
    };

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
};

angular.module('SoftiDoc.ApiView.Controllers', [])
    .controller('apiViewPolicyQueryController', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.showPolicyFind = false;
            $scope.showStdSearch = false;
            $scope.showAdvSearch = false;
            $scope.showResult = '';

            $scope.$on("policySearchRequested", function (eventName, data) {
                $scope.policyNumber = data.policyNumber;
                $scope.showPolicyFind = true;
                $scope.showStdSearch = false;
                $scope.showAdvSearch = false;
                $scope.showResultsFor = 'Policy Search';
                $timeout(function () {
                    $scope.$broadcast("policyRequested");
                });
            });

            $scope.$on("apiViewPolicyError", function (eventName, eventData) {
                if (eventData.status == 400) {
                    alert("Please enter a valid policy number");
                } else if (eventData.status == 404) {
                    alert("No policy found");
                }
            });

            $scope.$on("apiViewStdPolicyError", function (eventName, eventData) {
                if (eventData.status == 400) {
                    alert("Please enter a valid search value");
                }
            });

            $scope.$on("apiViewAdvPolicyError", function (eventName, eventData) {
                if (eventData.status == 400) {
                    alert("Please enter some information for search");
                }
            });

            $scope.$on("stdPolicySearchRequested", function (eventName, data) {
                $scope.searchText = data.searchText;
                $scope.showPolicyFind = false;
                $scope.showStdSearch = true;
                $scope.showAdvSearch = false;
                $scope.showResultsFor = 'Standard Policy Search';
                $timeout(function () {
                    $scope.$broadcast("stdPolicySearchRequestedBroadcast");
                });
            });
            $scope.$on("advPolicySearchRequested", function (eventName, data) {
                $scope.searchParams = data.searchParams;
                $scope.showPolicyFind = false;
                $scope.showStdSearch = false;
                $scope.showAdvSearch = true;
                $scope.showResultsFor = 'Advanced Policy Search';
                $timeout(function () {
                    $scope.$broadcast("advPolicySearchRequestedBroadcast");
                    ;
                });
            });

        }])
    .controller('getPolicyController', ['$scope',
        function ($scope) {
            $scope.getPolicySearch = function () {
                $scope.$emit("policySearchRequested", { policyNumber: $scope.policyNumber });
            };
        }])
    .controller('policyQueryStdSearchController', ['$scope',
        function ($scope) {
            $scope.policyQueryStdSearch = function () {
                $scope.$emit("stdPolicySearchRequested", { searchText: $scope.searchText });
            };
        }])
    .controller('policyQueryAdvSearchController', ['$scope',
        function ($scope) {
            ConfigDobDateTimePicker($scope);
            $scope.policyQueryAdvSearch = function () {
                $scope.searchParams = {
                    PolicyNumber: $scope.advSearchPolicyNumber,
                    IfaNumber: $scope.advSearchIfaNumber,
                    IdNumber: $scope.advSearchIdNumber,
                    Passport: $scope.advSearchPassport,
                    ClientNumber: $scope.advSearchClientNumber,
                    BankAccountNumber: $scope.advSearchBankAccountNumber,
                    Surname: $scope.advSearchSurname,
                    MobileNumber: $scope.advSearchMobileNumber,
                    HomeNumber: $scope.advSearchHomeNumber,
                    WorkNumber: $scope.advSearchWorkNumber
                };
                if ($scope.advSearchDob != undefined) {
                    $scope.searchParams.DateOfBirth = moment($scope.advSearchDob).format('L');
                }

                $scope.$emit("advPolicySearchRequested", { searchParams: $scope.searchParams });
            };
        }])
    .controller('apiViewPolicyCommentsController', ['$scope', '$timeout',
        function ($scope, $timeout) {
            $scope.$on('policyCommentsSearchRequested', function (eventName, data) {
                $scope.policyNumber = data.policyNumber;
                $timeout(function () {
                    $scope.$broadcast("policyCommentsRequested");
                });
            });
            $scope.$on("apiViewCreateCommentError", function (eventName, eventData) {
                if (eventData.status == 400) {
                    alert("Please enter Policy Number and Comment.");
                }
            });
        }])
    .controller('apiViewWorkFlowServicesController', ['$scope', '$timeout', 'httpResponseService',
        function ($scope, $timeout, httpResponseService) {
            $scope.loadTeams = function () {
                $scope.$broadcast("loadworkFlowTeams");
            };

            $scope.$on("teamMemberError", function (event, eventData) {
                
            });
        }])
    .controller('getPolicyCommentsController', ['$scope',
        function ($scope) {
            $scope.getPolicyComments = function () {
                $scope.$emit('policyCommentsSearchRequested', { policyNumber: $scope.policyNumber });
            };
        }])
    .controller('apiViewAccountingHistorySummaryController', ['$scope',
        function ($scope) {
            $scope.fetchAccountingHistorySummary = function () {
                $scope.$broadcast("accountingHistorySummaryRequested");
            };
        }])
    .controller('apiViewRidersController', ['$scope',
        function ($scope) {
            $scope.fetchRiders = function () {
                $scope.$broadcast("ridersRequested");
            };
        }])
    .controller('apiViewPolicyIndividualsController', ['$scope',
        function ($scope) {
            $scope.fetchPolicyIndividuals = function () {
                $scope.$broadcast("policyIndividualsRequested");
            };
        }])
    .controller('apiViewPolicyStatusHistoryController', ['$scope',
        function ($scope) {
            $scope.fetchPolicyStatusHistory = function () {
                $scope.$broadcast("policyStatusHistoryRequested");
            };
        }]);

/**********************************************************************************************/