/**********************************************************************************************/
/* Controllers                                                                                */
/**********************************************************************************************/

angular.module('Clientele.MyComponent.Controllers', ['Clientele.MyComponent.Services'])
.controller('myComponentIndexController', ['$scope', '$routeParams', 'myComponentApiService',
function ($scope, $routeParams, myComponentApiService) {
    $scope.$on("$viewContentLoaded", function () {

    });
}])
 .controller('myComponentUploadController', ['$scope', '$routeParams', 'applicationId', 'recordStoreApplicationApiUrl',
        function ($scope, $routeParams, applicationId, recordStoreApplicationApiUrl) {
            $scope.message = "Please select a file to upload";
            $scope.fileUploaded = false;
            $scope.applicationId = applicationId;
            $scope.recordStoreApplicationApiUrl = recordStoreApplicationApiUrl + '/upload/';

            $scope.id = "";
            $scope.$on("FileUploaded", function (event, eventArgs) {
                $scope.id = eventArgs.documentId;
                $scope.fileUploaded = true;
            });

            $scope.$on("FileUploading", function (event, eventArgs) {
                $scope.id = "";
                $scope.fileUploaded = false;
            });
        }]);

/**********************************************************************************************/