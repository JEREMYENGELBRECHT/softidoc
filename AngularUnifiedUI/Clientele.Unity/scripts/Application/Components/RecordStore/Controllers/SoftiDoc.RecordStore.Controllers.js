/**********************************************************************************************/
/* Controllers                                                                                */
/* Controllers require the data API (recordStoreApiService) for JSON calls                    */
/**********************************************************************************************/
angular.module('SoftiDoc.RecordStore.Controllers',
    [
    'SoftiDoc.RecordStore.Services',
    'SoftiDoc.RecordStore.Controllers.AdvancedSearch',
    'SoftiDoc.RecordStore.Controllers.MetaData',
    'SoftiDoc.RecordStore.Controllers.Sources',
    'SoftiDoc.RecordStore.Controllers.ActivityHistory'
    ])
    .controller('recordsBySourceController', ['$scope', '$routeParams', 'recordStoreApiService', 'recordStoreApplicationApiUrl', 'uiLoader', 'httpResponseService', '$timeout',
        function ($scope, $routeParams, recordStoreApiService, recordStoreApplicationApiUrl, uiLoader, httpResponseService, $timeout) {
            $scope.Records = [];
            $scope.pageSize = 25;
            
            $scope.currentPage = 1;
            $scope.recordTotal = 0;

            $scope.numberOfPages = function () {
                return Math.ceil($scope.Records.length / $scope.pageSize);
            };

            $scope.apiUrl = recordStoreApplicationApiUrl;
            $scope.recordSourceId = $routeParams.Id;

            $scope.isPdf = function (fileName) {
                if (fileName.toLowerCase().indexOf(".pdf") != -1) {
                    return true;
                }

                return false;
            };

            $scope.GetFile = function () {
                var downloadUrl = this.record.DownloadUrl;
                recordStoreApiService.getFile(downloadUrl, this.record.FileName);
            };

            var loadData = function () {
                var promise = recordStoreApiService.getRecordsForRecordSource($scope.recordSourceId, $scope.currentPage - 1, $scope.pageSize);
                promise.catch(function (data) {
                    httpResponseService.HandleDefaultError(data.status, "records", "listing");
                });
                return promise;
            };

            $scope.numberPages = function () {
                return Math.ceil(data.ResultCount / $scope.pageSize);
            };

            var loadPagedData = function () {
                uiLoader.UseWithLoader($scope, loadData,
                   function (data, result) {
                       $scope.recordTotal = data.ResultCount;
                       $scope.Records = data.Records;
                   });
            };

            $scope.pageChanged = function (page) {
                $scope.currentPage = page;
                loadPagedData();
            };

            $scope.$on('$viewContentLoaded', function () {
                loadPagedData();
            });
        }])
    .controller('recordsByMetaDataController', ['$scope', '$routeParams', 'recordStoreApiService', 'recordStoreApplicationApiUrl', 'uiLoader', 'applicationId',
        function ($scope, $routeParams, recordStoreApiService, recordStoreApplicationApiUrl, uiLoader, applicationId) {
            $scope.apiUrl = recordStoreApplicationApiUrl;
            $scope.recordSourceId = applicationId.Id;

            $scope.isPdf = function (fileName) {
                if (fileName.toLowerCase().indexOf(".pdf") != -1) {
                    return true;
                }

                return false;
            };

            $scope.GetFile = function () {
                var downloadUrl = this.record.DownloadUrl;
                recordStoreApiService.getFile(downloadUrl, this.record.FileName);
            };

            var loadData = function () {

                $scope.metaDataQuery = {
                    RecordSourceId: applicationId.Id,
                    Keys: "apple",
                    Values: "tasty"
                };

                return recordStoreApiService.getRecordsByMetaData($scope.metaDataQuery);
            };

            $scope.$on('$includeContentLoaded', function () {
                uiLoader.UseWithLoader($scope, loadData,
                    function (data, result) {
                        $scope.Records = data;
                    });
            });

        }])
    .controller('viewRecordController', ['$scope', '$routeParams', 'recordStoreApplicationApiUrl', '$rootScope',
        function ($scope, $routeParams, recordStoreApplicationApiUrl, $rootScope) {
            var recordRenderUrl = "/Scripts/UI/jsPDF/web/viewer.html?selectThumbnails=false&token=" + $rootScope.BearerToken + "&file=" + recordStoreApplicationApiUrl + "/RecordFile/" + $routeParams.Id;
            $scope.pdfUrl = recordRenderUrl;

            $scope.$on("ThumbnailSelectedFromPdfViewer", function (eventName, data) {
            });
        }])
    .controller('recordUploadController', ['$scope', '$upload', 'recordStoreApplicationApiUrl', 'notificationService', 'applicationId', 'authenticationService',
        function ($scope, $upload, recordStoreApplicationApiUrl, notificationService, applicationId, authenticationService) {

            //if (!authenticationService.HasClaim("SoftiDoc.RecordStore.Upload")) {
            //    authenticationService.RedirectToNoAccessPage();
            //}

            $scope.recordStoreApplicationApiUrl = recordStoreApplicationApiUrl + '/upload/';
            $scope.applicationId = applicationId;

            $scope.message = "Select a file (or files) to upload.";

            $scope.$on("FileUploading", function (event, message) {
                $scope.message = "File uploading...";
            });

            $scope.$on("FileUploaded", function (event, message) {
                notificationService.notify("Record Uploaded", message.documentName + " was uploaded successfully", "success");
                $scope.message = "Select a file to upload.";
            });

            $scope.$on("FileUploadError", function (event, message) {
                notificationService.notify("Record Upload Error", "There was an error processing " + message.documentName + ", please try again or contact an administrator.", "error");
            });
        }])
    .controller('recordSearchController', ['$scope', '$routeParams',
        function ($scope, $routeParams) {
            $scope.searchText = $routeParams.searchText;

        }])
    .controller('editRecordController', ['$scope', '$routeParams', 'recordStoreApiService', '$filter', 'eventBroadcastingService', '$q', 'uiLoader', '$timeout',
          function ($scope, $routeParams, recordStoreApiService, $filter, eventBroadcastingService, $q, uiLoader, $timeout) {
              $scope.name = "recordDetails";
              $scope.recordId = $routeParams.RecordId;
              $scope.sourceId = $routeParams;
              $scope.consumingSystems = [];

              $scope.$on('$viewContentLoaded', function () {


                  uiLoader.UseWithLoader($scope, loadData, function (data) {
                      $scope.consumingSystems = data;
                      $timeout(function () {
                          uiLoader.UseWithLoader($scope, loadRecordData, function (data) {
                              $scope.record = data;
                              $scope.getSelectedSystem();
                          });
                      });
                  });
              });

              var loadData = function () {
                  return recordStoreApiService.getConsumingSystems(null);
              };

              var loadRecordData = function () {
                  return recordStoreApiService.getEditRecordData({ Id: $scope.sourceId, RecordId: $scope.recordId });
              };

              $scope.saveConsumingSystem = function (value) {

                  var d = $q.defer();

                  var params = { Id: $scope.recordId, consumerId: value };

                  recordStoreApiService.defineConsumingSystem(params).success(
                    function (data, result) {
                        eventBroadcastingService.broadcastEvent("recordConsumerChanged", { recordId: params.Id });
                        eventBroadcastingService.UINotify(data);
                        d.resolve();
                    }).error(function (data) {
                        d.resolve("Server error.");
                    });

                  return d.promise;
              };

              $scope.getSelectedSystem = function () {
                  if ($scope.record == undefined || $scope.record == "undefined") {
                      return 'Not set';
                  }
                  var selected = $filter('filter')($scope.consumingSystems, { value: $scope.record.IntendedSystemId });
                  return ($scope.record.IntendedSystemId && selected.length) ? selected[0].text : 'Not set';
              };
          }]);

/**********************************************************************************************/
/* Sub division of metadata controllers for readbility sake                                   */
/**********************************************************************************************/
angular.module('SoftiDoc.RecordStore.Controllers.MetaData', ['SoftiDoc.RecordStore.Services'])

.controller('metaDataController', ['$scope', '$routeParams', 'recordStoreApiService', 'validationService', 'eventBroadcastingService', 'uiLoader', 'authenticationService', 'resourceService',
    function ($scope, $routeParams, recordStoreApiService, validationService, eventBroadcastingService, uiLoader, authenticationService) {
        var rand = Math.random();

        $scope.recordId = "";
        $scope.loading = true;
        $scope.name = "MetaData";
        $scope.metaDataTemplate = '/Views/RecordStore/MetaData.html?rnd=' + rand;

        $scope.newKeyValuePair = {
            NewMetaDataKey: "",
            NewMetaDataValue: ""
        };

        $scope.metaDataResults = [];

        var loadData = function () {
            return recordStoreApiService.getMetaDataForRecord($scope.recordId);
        };

        var keyExists = function (data) {
            var count = 0;

            var fullCollection = $scope.metaDataResults;
            angular.forEach(fullCollection, function (value, key) {
                if (value.KeyField == data) {
                    count++;
                }
            });

            return count > 0;
        };

        $scope.checkDuplicate = function (data) {
            if (keyExists(data, $scope)) {
                return "You can't have more than one item with the same key.";
            }
        };

        $scope.setEdit = function (canEdit) {
            $scope.canEdit = true;

            //if (authenticationService.HasClaim("SoftiDoc.RecordStore.RecordMetaData.Edit")) {
            //    $scope.canEdit = canEdit;
            //}
        };

        $scope.getParameter = function (param) {
            $scope.recordId = eval("$routeParams." + param);
        };

        $scope.addMetaData = function () {

            if ($scope.newKeyValuePair.NewMetaDataKey == "" || $scope.newKeyValuePair.NewMetaDataValue == "") {
                eventBroadcastingService.UINotify({ Success: false, Message: "Please complete both key and value for a new metadata entry." });
                return;
            }

            var parameters = {
                Id: $scope.recordId,
                MetaDataKey: $scope.newKeyValuePair.NewMetaDataKey,
                MetaDataValue: $scope.newKeyValuePair.NewMetaDataValue,
            };

            recordStoreApiService.addMetaData(parameters).success(function (data, result) {
                eventBroadcastingService.broadcastEvent("recordMetaDataAdded", { recordId: parameters.Id });
                eventBroadcastingService.UINotify(data);
            });
        };

        $scope.$on("recordMetaDataAdded", function (event) {

            uiLoader.UseWithLoader($scope, loadData, function (data) {
                $scope.metaDataResults = data;
                $scope.newKeyValuePair = {
                    NewMetaDataKey: "",
                    NewMetaDataValue: ""
                };
            });
        });

        $scope.$on("recordMetaDataDeleted", function (event) {
            uiLoader.UseWithLoader($scope, loadData, function (data) {
                $scope.metaDataResults = data;
                $scope.newKeyValuePair = {
                    NewMetaDataKey: "",
                    NewMetaDataValue: ""
                };
            });
        });

        $scope.$on('$includeContentLoaded', function (event) {
            uiLoader.UseWithLoader($scope, loadData, function (data) {
                $scope.metaDataResults = data;
                $scope.newKeyValuePair = {
                    NewMetaDataKey: "",
                    NewMetaDataValue: ""
                };
            });
        });
    }])
.controller('metaDataItemController', ['$scope', '$routeParams', 'recordStoreApiService', 'eventBroadcastingService',
    function ($scope, $routeParams, recordStoreApiService, eventBroadcastingService) {

        var acceptAction = function (metaDataItem) {
            var parameters = {
                Id: metaDataItem.Id
            };

            recordStoreApiService.deleteMetaData(parameters).success(function (data, result) {
                eventBroadcastingService.broadcastEvent("recordMetaDataDeleted", { recordId: parameters.Id });
                eventBroadcastingService.UINotify(data);
            });
        };

        var keyExists = function (data) {
            var count = 0;

            var fullCollection = $scope.$parent.$parent.$parent.metaDataResults;
            angular.forEach(fullCollection, function (value, key) {
                if (value.KeyField == data) {
                    count++;
                }
            });

            return count > 0;
        };

        $scope.deleteMetaData = function (metaDataItem) {
            confirm("Are you sure you wish to remove this metadata?", function () { acceptAction(metaDataItem); }, function () {
            });
        };

        $scope.changeMetaDataKey = function (data) {

            if (keyExists(data, $scope)) {
                return "You can't have more than one item with the same key.";
            }

            var parameters =
            {
                RecordId: $routeParams.recordId,
                Id: $scope.$parent.metaDataResult.Id,
                MetaDataKey: data,
                MetaDataValue: $scope.$parent.metaDataResult.Value
            };


            recordStoreApiService.changedMetaData(parameters).success(function (val, result) {
                eventBroadcastingService.broadcastEvent("recordMetadataChanged", { metaDataId: parameters.Id });
                eventBroadcastingService.UINotify(val);
            });
        };

        $scope.changeMetaDataValue = function () {
            var parameters = {
                RecordId: $routeParams.recordId,
                Id: $scope.$parent.metaDataResult.Id,
                MetaDataKey: $scope.$parent.metaDataResult.KeyField,
                MetaDataValue: $scope.$parent.metaDataResult.Value
            };

            recordStoreApiService.changedMetaData(parameters).success(function (val, result) {
                eventBroadcastingService.broadcastEvent("recordMetadataChanged", { metaDataId: parameters.Id });
                eventBroadcastingService.UINotify(val);
            });
        };

    }]);

/**********************************************************************************************/
/* Sub division of source controllers for readbility sake                                     */
/**********************************************************************************************/
angular.module('SoftiDoc.RecordStore.Controllers.Sources', ['SoftiDoc.RecordStore.Services'])
.controller('sourceController', ['$scope', 'recordStoreApiService', 'uiLoader', 'httpResponseService',
        function ($scope, recordStoreApiService, uiLoader, httpResponseService) {
            $scope.Sources = [];

            var loadData = function () {

                var promise = recordStoreApiService.getAllSources();

                promise.catch(function (data) {
                    httpResponseService.HandleDefaultError(data.status, "record sources", "list");
                });
                return promise;
            };

            // when the scope and view is loaded then load the data
            $scope.$on('$viewContentLoaded', function () {
                uiLoader.UseWithLoader($scope, loadData, function (data) {
                    $scope.Sources = data;
                });
            });;
        }])
.controller('recordSourceItemController', ['$scope', 'recordStoreApiService', 'watchingService',
        function ($scope, recordStoreApiService, watchingService) {
            var watches = new Object();

            // random predicate function we will use to allow/disallow change
            var isChangeAllowed = function () {
                return $scope.$parent.source.RecordCount > 100;
            };

            var underlyingChangHandler = function () {
                // we have access to the current Item and scope is this item.
                alert("Do some REST action post property change");
            };

            // use the watching service to listen for changes to the "RecordCount" on the "source" object being passed through on the ng-repeat
            watchingService.startWatch($scope, 'source', 'RecordCount', watches, underlyingChangHandler, isChangeAllowed);
        }]);

/**********************************************************************************************/
/* Sub division of activity history controllers for readbility sake                           */
/**********************************************************************************************/
angular.module('SoftiDoc.RecordStore.Controllers.ActivityHistory', ['SoftiDoc.RecordStore.Services'])
    .controller('activityHistoryController', ['$scope', '$routeParams', 'recordStoreApiService', 'uiLoader',
        function ($scope, $routeParams, recordStoreApiService, uiLoader) {
            var rand = Math.random();

            var loadData = function () {

                uiLoader.UseWithLoader($scope, function () { return recordStoreApiService.getActivityHistoryForRecord($scope.recordId); }, function (data, result) {
                    $scope.activityHistoryResults = data;
                });
            };

            $scope.name = "activityHistory";
            $scope.activityHistoryTemplate = '/Views/RecordStore/activityHistory.html?rnd=' + rand;
            $scope.recordId = "";

            $scope.getParameter = function (param) {
                $scope.recordId = eval("$routeParams." + param);
            };

            $scope.$on("recordMetaDataAdded", function (event) {
                loadData();
            });

            $scope.$on("recordMetaDataDeleted", function (event) {
                loadData();
            });

            $scope.$on("recordMetadataChanged", function (event) {
                loadData();
            });

            $scope.$on("recordConsumerChanged", function (event) {
                loadData();
            });

            $scope.$on('$includeContentLoaded', function (event) {

                loadData();
            });
        }]);

/**********************************************************************************************/