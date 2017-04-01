/**********************************************************************************************/
/* Routing                                                                                    */
/* Routing Requires the controllers for assignment to a route - these use the 'lookup' method */
/**********************************************************************************************/
angular.module('SoftiDoc.RecordStore.Routes', ['SoftiDoc.RecordStore.Controllers'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/RecordStore/", { templateUrl: '/Views/RecordStore/Source.html', controller: 'sourceController', caseInsensitiveMatch: true })
            .when("/RecordStore/Source/Records/:Id", { templateUrl: '/Views/RecordStore/RecordsBySource.html', controller: 'recordsBySourceController', caseInsensitiveMatch: true })
            .when("/RecordStore/Source/", { templateUrl: '/Views/RecordStore/Source.html', controller: 'sourceController', caseInsensitiveMatch: true })
            .when("/RecordStore/Upload/", { templateUrl: '/Views/RecordStore/Upload.html', controller: 'recordUploadController', caseInsensitiveMatch: true })
            .when("/RecordStore/Search/", { templateUrl: '/Views/RecordStore/Search.html', controller: 'recordSearchController', caseInsensitiveMatch: true })
            .when("/RecordStore/RecordFile/:Id", { templateUrl: '/Views/RecordStore/ViewPdf.html', controller: 'viewRecordController', caseInsensitiveMatch: true })
            .when("/RecordStore/Source/Records/:Id/Record/:RecordId", { templateUrl: '/Views/RecordStore/EditRecord.html', controller: 'editRecordController', caseInsensitiveMatch: true })
            .when("/RecordStore/Search/:searchText", { templateUrl: '/Views/RecordStore/Search.html', controller: 'recordSearchController', caseInsensitiveMatch: true })
            .when("/RecordStore/advancedSearch/:searchText", { templateUrl: '/Views/RecordStore/AdvancedSearch.html', controller: 'recordAdvancedSearchController', caseInsensitiveMatch: true })
            .when("/RecordStore/advancedSearch/", { templateUrl: '/Views/RecordStore/AdvancedSearch.html', controller: 'recordAdvancedSearchController', caseInsensitiveMatch: true });
    });