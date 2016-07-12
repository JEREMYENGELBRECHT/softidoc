
angular.module('Clientele.ServiceError.Controllers', ['Clientele.ServiceError.Services'])
    .controller('serviceErrorIndexController', ['$scope', '$routeParams', 'serviceErrorApiService', 'uiLoader', '$modal',
        function($scope, $routeParams, serviceErrorApiService, uiLoader, $modal) {

            $scope.Test = function() {

            };

        }])
    .controller('serviceErrorErrorController', ['$scope', '$routeParams', 'serviceErrorApiService', 'uiLoader', '$modal', 'notificationService',
        function($scope, $routeParams, serviceErrorApiService, uiLoader, $modal, notificationService) {

            $scope.IsDetailedErrorSelected = false;

            $scope.ApplicationsUpdateHoursAgoSelected = function(hoursAgo) {
                $scope.HoursAgo = hoursAgo;
            };

            $scope.CurrentlySelectedDetailedError = {
                Date : ''
            };

            $scope.HoursAgoSelection = serviceErrorApiService.getHoursAgoSelection();

            $scope.$watch("HoursAgoSelected", function() {
                $scope.UpdateApplications();
                $scope.UpdateErrorList();
            });

            $scope.UpdateView = function() {
                $scope.UpdateApplications();
                $scope.UpdateErrorList();
            };

            $scope.UpdateApplications = function() {
                serviceErrorApiService.getApplicationErrorCount($scope.HoursAgoSelected.HoursAgo).success(function(data) {
                    $scope.Applications = data;
                });
            };

            $scope.UpdateErrorList = function() {
                if ($scope.CurrentApplication.ApplicationName == 'All') {
                    serviceErrorApiService.getErrorsForHourAgo($scope.HoursAgoSelected.HoursAgo).success(function(data) {
                        $scope.ErrorList = data;
                        $scope.NotifyWhenErrorListCount();
                    });
                } else {
                    serviceErrorApiService.getApplicationErrors($scope.CurrentApplication.ApplicationName, $scope.HoursAgoSelected.HoursAgo).success(function(data) {
                        $scope.ErrorList = data;
                        $scope.NotifyWhenErrorListCount();
                    });
                }

               
            };

            $scope.NotifyWhenErrorListCount = function() {
                if ($scope.ErrorList.length == 0) {
                    notificationService.notify('', 'There are currently no errors.', 'success');
                } else {
                    notificationService.notify('', 'There are currently ' + $scope.ErrorList.length + ' errors.', 'warning');
                }
            };

            $scope.HoursAgoSelected = $scope.HoursAgoSelection[2];

            $scope.CurrentApplication = "All";

            $scope.Applications = [];

            $scope.ErrorList = [];

            $scope.gridOptions = {
                data: 'ErrorList',
                showGroupPanel: true,
                columnDefs: [
                    { field: 'Application', displayName: 'Application', groupable: true, width: "20%" },
                    { field: 'ErrorType', displayName: 'Type', groupable: true, width: "20%" },
                    { field: 'Source', displayName: 'Source', groupable: true, width: "20%" },
                    { field: 'Message', displayName: 'Message', groupable: true, width: "10%" },
                    { field: 'Date', displayName: 'Date', groupable: true, width: "20%" },
                    { field: 'Time', displayName: 'Time', groupable: true, width: "10%" },
                    { field: 'User', displayName: 'User', groupable: true, width: "auto" }
                ],
                multiSelect: false,
                selectedItems: $scope.selectedRows,
                beforeSelectionChange: function (data) {
                  
                    serviceErrorApiService.getError(data.entity.ErrorId)
                        .success(function(result) {
                            $scope.CurrentlySelectedDetailedError = result;
                            $scope.IsDetailedErrorSelected = true;
                            return true;
                        });
                }
            };

            $scope.applicationChanged = function() {
                $scope.UpdateErrorList();
            };

            $scope.$on("$viewContentLoaded", function() {
                uiLoader.UseWithLoader($scope, function() {
                    return serviceErrorApiService.getApplicationErrorCount($scope.HoursAgoSelected.HoursAgo);
                }, function(data, result) {
                    $scope.Applications = data;
                    $scope.CurrentApplication = $scope.Applications[0];

                    serviceErrorApiService.getErrorsForHourAgo($scope.HoursAgoSelected.HoursAgo).
                        success(function(data) {
                            $scope.ErrorList = data;
                        });
                });
            });
            

        }]);
  
   
