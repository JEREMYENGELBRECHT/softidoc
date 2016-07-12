/**********************************************************************************************/
/* Controllers                                                                                */
/* Controllers require the data API (recordStoreApiService) for JSON calls                    */
/**********************************************************************************************/
angular.module('Clientele.RecordStore.Controllers.AdvancedSearch', [])
    .controller('recordAdvancedSearchController', ['$scope', 'recordStoreApiService', 'recordStoreApplicationApiUrl', 'uiLoader', 'httpResponseService','$routeParams',
        function ($scope, recordStoreApiService, recordStoreApplicationApiUrl, uiLoader, httpResponseService, $routeParams) {
          
            $scope.searchText = $routeParams.searchText;
            $scope.oneAtATime = true;
            $scope.status = {isFirstOpen: true,isFirstDisabled: false};

            $scope.newMetaDataKeyWord = "";
            $scope.newMetaDataValue = "";
            $scope.newMetaDataKeywordMatches = true;
            $scope.keyWordComparisons = [];
            $scope.fileName = "";
            $scope.minimumPages = 0;
            $scope.minimumFileSize = 0;
            $scope.maximumPages = 0;
            $scope.maximumFileSize = 0;
            $scope.tempMinFileSize = 0;
            $scope.tempMaxFileSize = 0;
            
            $scope.criteriaText = "Select";
            $scope.filterJoinType = 0;

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.criteriaStatus = {
                isopen: false
            };

            $scope.initDate = new Date('2016-11-20');
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.criteriaDropdown = new Dropdown([{ Text: 'Any criteria must match', Value: 0 }, { Text: 'All criteria must match', Value: 1 }], "Select search criteria", null);

            var comparisonOptions = [{ Text: 'Equals', Value: true }, { Text: 'Does not equal', Value: false }];
            $scope.allMetaDataComparisons = new Dropdown(comparisonOptions, "Equals", true);
       
            $scope.showSearch = function () {
                $scope.showResults = false;
            };
            
            $scope.addMetaDataSearchCriteria = function() {
                if ($scope.newMetaDataKeyWord != "" && $scope.newMetaDataValue != "") {
                    $scope.keyWordComparisons.push({
                        Key: $scope.newMetaDataKeyWord,
                        Value: $scope.newMetaDataValue,
                        Matches: $scope.allMetaDataComparisons.selectedItem.Value
                    });
                    }
            };

            $scope.allMetaDataComparisonsMatch = false;

            $scope.removeMetaData = function(index) {
                $scope.keyWordComparisons.splice(index, 1);
            };

            $scope.search = function() {

                var jsonObjectForQueryString = {
                    RecordSourceId: $scope.sourceDropdown.selectedItem.Value,
                    JoinType: $scope.criteriaDropdown.selectedItem.Value,
                    FileName: $scope.fileName,
                    MinimumFileSize: $scope.tempMinFileSize,
                    MaximumFileSize: $scope.tempMaxFileSize,
                    ConsumerId: $scope.consumingSystemDropdown.selectedItem.Value,
                    MinimumNumberOfPages: $scope.minimumPages,
                    MaximumNumberOfPages: $scope.maximumPages,
                    MetaDataComparisons: $scope.keyWordComparisons,
                    CreatedEarliest: $scope.startDate,
                    CreatedLatest: $scope.endDate,
                    AllMetaDataComparisonsMatch: $scope.allMetaDataComparisonsMatch
                };

                $scope.$broadcast("advancedRecordStoreSearch", jsonObjectForQueryString);
            };
            
            $scope.$watch('maximumFileSize', function(oldVal, newVal) {
                $scope.tempMaxFileSize = $scope.maximumFileSize * 1024;
            });

            $scope.$watch('minimumFileSize', function(oldVal, newVal) {
                $scope.tempMinFileSize = $scope.minimumFileSize * 1024;
            });
            
            $scope.clear = function() {
                $scope.startDate = null;
                $scope.endDate = null;
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate == null ? new Date() : $scope.minDate;
                var nowUtc = new Date($scope.minDate.getUTCFullYear(), $scope.minDate.getUTCMonth(), $scope.minDate.getUTCDate(), $scope.minDate.getUTCHours(), $scope.minDate.getUTCMinutes(), $scope.minDate.getUTCSeconds());
                $scope.minDate = nowUtc;
            };
            
            $scope.toggleMin();

            $scope.openStartDate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.startDateOpened = true;
            };

            $scope.openEndDate = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.endDateOpened = true;
            };
            
            var loadAdvancedSearchFilters = function() {

                var promise = recordStoreApiService.getRecordSearchFilters();
                promise.catch(function(data) {
                    httpResponseService.HandleDefaultError(data.status, "advanced search filters", "listing");
                });
                return promise;
            };

            $scope.isPdf = function(fileName) {
                if (fileName.toLowerCase().indexOf(".pdf") != -1) {
                    return true;
                }

                return false;
            };

            $scope.GetFile = function() {
                var downloadUrl = this.record.DownloadUrl;
                recordStoreApiService.getFile(downloadUrl, this.record.FileName);
            };

            $scope.$on('$viewContentLoaded', function() {
                uiLoader.UseWithLoader($scope, loadAdvancedSearchFilters,
                    function(data, result) {

                        var sources = [];
                        for (var i = 0; i < data.Sources.length; i++) {
                            sources.push({ Text: data.Sources[i].SourceName, Value: data.Sources[i].Id });
                        }

                        $scope.sourceDropdown = new Dropdown(sources, "Select a source", null);

                        var consumingSystems = [];
                        for (var i = 0; i < data.ConsumingSystems.length; i++) {
                            consumingSystems.push({ Text: data.ConsumingSystems[i].text, Value: data.ConsumingSystems[i].value });
                        }

                        $scope.consumingSystemDropdown = new Dropdown(consumingSystems, "Select a consuming system", null);
                    
                        if (angular.isDefined($scope.searchText) ) {
                            if ($scope.searchText != "") {
                                
                                $scope.keyWordComparisons.push({
                                    Key: "Ifa.0.NewIfaNumber",
                                    Value: $scope.searchText,
                                    Matches: true
                                });
                                $scope.keyWordComparisons.push({
                                    Key: "Member.0.IdentityNumber",
                                    Value: $scope.searchText,
                                    Matches: true
                                });
                                $scope.keyWordComparisons.push({
                                    Key: "Member.0.Surname",
                                    Value: $scope.searchText,
                                    Matches: true
                                });
                                $scope.keyWordComparisons.push({
                                    Key: "Member.0.FirstNames",
                                    Value: $scope.searchText,
                                    Matches: true
                                });
                                $scope.keyWordComparisons.push({
                                    Key: "Product.0.ProductCode",
                                    Value: $scope.searchText,
                                    Matches: true
                                });
                                $scope.keyWordComparisons.push({
                                    Key: "Ifa.0.ExistingIfaNumber",
                                    Value: $scope.searchText,
                                    Matches: true
                                });

                                $scope.search();
                            }
                        }
                    });
            });
        }])
    .controller('recordAdvancedSearchResultsController', ['$scope', 'recordStoreApiService', 'recordStoreApplicationApiUrl', 'uiLoader', '$timeout','$routeParams',
        function($scope, recordStoreApiService, recordStoreApplicationApiUrl, uiLoader, $timeout,$routeParams) {

            $scope.searchText = $routeParams.searchText;
            
            if (angular.isDefined($scope.searchText)) {
                if ($scope.searchText != "") {
                   $scope.ResultCountMessage = "";
                }
            }
            
            $scope.Records = [];
            $scope.currentPage = 0;
            $scope.pageSize = 25;

            $scope.numberOfPages = function() {
                return Math.ceil($scope.Records.length / $scope.pageSize);
            };

            $scope.loadData = function(jsonObjectForQueryString) {
                var jsonString = angular.toJson(jsonObjectForQueryString);
                return recordStoreApiService.advancedSearch(jsonString);
            };

            $scope.$on('advancedRecordStoreSearch', function(name, eventData) {

                uiLoader.UseWithLoader($scope, function() { return $scope.loadData(eventData); },
                    function(data, result) {
                        $scope.$parent.showResults = true;
                        $scope.Records = data;
                        
                        if (data.length == 0) {
                            $scope.ResultCountMessage = "No records were found matching your critera";
                        }
                        
                        $scope.$parent.Records = data;
                        $timeout(function() {
                            $scope.currentPage = 0;
                            $scope.numberOfPages();
                        });

                    });

            });
        }]);

/**********************************************************************************************/