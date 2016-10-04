/**********************************************************************************************/
/* Api Services                                                                                   */
/**********************************************************************************************/
angular.module('SoftiDoc.ServiceError.Services', [])
    .factory('serviceErrorApiService', function (ajaxJsonService, serviceErrorApiUrl) {
        
        var myComponentResourceUrl = serviceErrorApiUrl + "/ServiceErrorResource/";

        return {
           getErrors: function() {
               var url = serviceErrorApiUrl + "Error";
               return ajaxJsonService.Get(url, null);
           },
           getApplications: function() {
               var url = serviceErrorApiUrl + "Application";
               return ajaxJsonService.Get(url, null);
           },
           getApplicationErrors: function (applicationName, hoursAgo) {
               var url = serviceErrorApiUrl + "Error/ApplicationHoursAgoQuery?ApplicationName=" + applicationName + "&HoursAgo=" + hoursAgo;
               return ajaxJsonService.Get(url, null);
           },
           getError: function(errorId) {
               var url = serviceErrorApiUrl + "Error/" + errorId;
               return ajaxJsonService.Get(url, null);
           },
           getApplicationErrorCount: function (hoursAgo) {
               var url = serviceErrorApiUrl + "ApplicationErrorCount?HoursAgo=" + hoursAgo;
               return ajaxJsonService.Get(url, null);
           },
           getErrorsForHourAgo: function(hoursAgo) {
               var url = serviceErrorApiUrl + "Error/HoursAgoQuery?HoursAgo=" + hoursAgo;
               return ajaxJsonService.Get(url, {
                   HoursAgo: hoursAgo
               });
           },
           getApplicationAll : function(){
               var url = serviceErrorApiUrl + "Application/All";
               return ajaxJsonService.Get(url, null);
           },
           getHoursAgoSelection : function() {
               return [
                   {
                       Id: 1,
                       Name: 'last hour',
                       HoursAgo: 1
                   },
                   {
                       Id: 2,
                       Name: 'last 2 hours',
                       HoursAgo: 2
                   },
                   {
                       Id: 3,
                       Name: 'last day',
                       HoursAgo: 24
                   },
                   {
                       Id: 4,
                       Name: 'last 30 days',
                       HoursAgo: 720
                   }
               ];
           }
        };
    });