/**********************************************************************************************/
/* Api Services                                                                                   */
/**********************************************************************************************/
angular.module('Clientele.MyComponent.Services', [])
    .factory('myComponentApiService', function (ajaxJsonService, myComponentApiUrl, $rootScope) {
        
        var myComponentResourceUrl = myComponentApiUrl + "/MyComponentResource/";

        return {
            getAllMyComponentResource: function () {
                var url = myComponentResourceUrl;
                return ajaxJsonService.Get(url, null);
            },
            getFile: function (downloadUrl,fileName) {
                var url = myComponentApiUrl + downloadUrl;

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
            }
        };
    });