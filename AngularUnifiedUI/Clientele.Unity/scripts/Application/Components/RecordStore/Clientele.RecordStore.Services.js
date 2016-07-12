/**********************************************************************************************/
/* Api Services                                                                                   */
/* Services to separate our data logic from our view logic                                    */
/**********************************************************************************************/
angular.module('Clientele.RecordStore.Services', [])
    .factory('recordStoreApiService', function (ajaxJsonService, recordStoreApplicationApiUrl, $rootScope) {
        var metaDataActions = {};

        return {
            getAllSources: function () {
                var url = recordStoreApplicationApiUrl + "/Source";
                return ajaxJsonService.Get(url, null);
            },
            getFile: function (downloadUrl, fileName) {
                var url = recordStoreApplicationApiUrl + downloadUrl;

                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.setRequestHeader("Authorization", "Bearer " + $rootScope.BearerToken);
                xhr.onload = function (e) {
                    if (this.status == 200) {
                        // Note: .response instead of .responseText
                        var blob = new Blob([this.response], { type: 'application/octet-stream' });
                        showSave(blob, fileName, "application/octet-stream");
                    }
                };

                xhr.send();
            },
            getActivityHistoryForRecord: function (recordId) {
                var url = recordStoreApplicationApiUrl + '/ActivityHistory/' + recordId;
                return ajaxJsonService.Get(url, null);
            },
            getRecordSearchFilters: function () {
                var url = recordStoreApplicationApiUrl + '/Record/Filters/';
                return ajaxJsonService.Get(url, null);
            },
            getMetaDataForRecord: function (recordId) {
                var url = recordStoreApplicationApiUrl + '/MetaData/' + recordId;
                return ajaxJsonService.Get(url, { id: recordId });
            },
            getRecordsByMetaData: function (metaDataQuery) {
                var url = recordStoreApplicationApiUrl + '/Source/Records/Search/?keys=' + metaDataQuery.Keys + '&values=' + metaDataQuery.Values + '&RecordSourceId=' + metaDataQuery.RecordSourceId;
                return ajaxJsonService.Get(url, metaDataQuery);
            },
            getRecordsForRecordSource: function (recordSourceId, pageNumber, resultsPerPage) {
                var url = recordStoreApplicationApiUrl + "/Source/Records/" + recordSourceId + "?pageNumber=" + pageNumber + "&resultsPerPage=" + resultsPerPage;
                return ajaxJsonService.Get(url, null);
            },
            addMetaData: function (parameters) {
                var url = recordStoreApplicationApiUrl + '/MetaData/';
                return ajaxJsonService.Post(url, parameters);
            },
            deleteMetaData: function (parameters) {
                var url = recordStoreApplicationApiUrl + '/MetaData/' + parameters.Id;
                return ajaxJsonService.Delete(url, { id: parameters.Id });
            },
            changedMetaData: function (parameters) {
                var url = recordStoreApplicationApiUrl + '/MetaData/';
                return ajaxJsonService.Put(url, parameters);
            },
            defineConsumingSystem: function (parameters) {
                var url = recordStoreApplicationApiUrl + '/Record/DefineConsumingSystem/' + parameters.Id;
                return ajaxJsonService.Put(url, parameters);
            },
            getEditRecordData: function (parameters) {
                var url = recordStoreApplicationApiUrl + '/Source/Records/' + parameters.Id.Id + '/Record/' + parameters.RecordId;
                return ajaxJsonService.Get(url, parameters);
            },
            getConsumingSystems: function (parameters) {
                var url = recordStoreApplicationApiUrl + '/ConsumingSystem';
                return ajaxJsonService.Get(url, parameters);
            },
            advancedSearch: function (queryString) {
                var url = recordStoreApplicationApiUrl + '/Records/AdvancedSearch/?AllRecordsSearchQuery=' + queryString;
                return ajaxJsonService.Get(url, null);
            }
        };
    });
