angular.module('Clientele.Directives.FormFields', [])
    .directive('fileUpload', function () {
        return {
            scope: true,        //create a new scope
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var files = event.target.files;
                    //iterate files since 'multiple' may be specified on the element
                    for (var i = 0; i < files.length; i++) {
                        //emit event upward
                        scope.$emit("fileSelected", { file: files[i] });
                    }
                });
            }
        };
    })
    .directive('unityFileLoad', function () {

        return {
            restrict: 'E',
            templateUrl: '/template/fileUpload.html',
            scope: {},
            link: function ($scope, element, attrs) {
                $scope.uploadApiUrl = attrs.uploadApiUrl;

                var fileInput = element.find('input[type="file"]');

                if (attrs.multiple != undefined && attrs.multiple != "undefined") {
                    fileInput.attr("multiple", "multiple");
                }
            },
            controller: ['$scope', '$upload', '$timeout',
                function ($scope, $upload, $timeout) {                                                         
                    var scope = $scope;

                    scope.percentage = 0;

                    $scope.onFileSelect = function ($files) {
                        
                        //$files: an array of files selected, each file has name, size, and type.
                        for (var i = 0; i < $files.length; i++) {
                            var file = $files[i];
                            scope.$emit("FileUploading", { documentId: "", documentName: file.name });
                            scope.percentage = 1;

                            scope.upload = $upload.upload({
                                url: scope.uploadApiUrl,
                                method: "POST",
                                data: { myObj: scope.myModelObj, name: file.name, applicationId: scope.applicationId },
                                file: file,
                            }).progress(function (evt) {
                                scope.percentage = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function (data, status, headers, config) {
                                // file is uploaded successfully
                                scope.percentage = 100;
                                scope.$emit("FileUploaded", { documentId: data.recordId, documentName: config.file.name });

                                $timeout(function () {
                                    scope.percentage = 0;
                                }, 1250);
                            })
                                .error(function (data, status, headers, config) {
                                    scope.$emit("FileUploadError", { documentName: config.file.name });
                                    $timeout(function () {
                                        scope.percentage = 0;
                                        // anything you want can go here and will safely be run on the next digest.
                                    });
                                });
                        }
                    };
                }]
        };
    })
    .directive('unityFileupload', function () {

        return {
            restrict: 'E',
            templateUrl: '/template/fileUpload.html',
            scope: {},
            link: function ($scope, element, attrs) {
                $scope.applicationId = attrs.applicationId;
                $scope.uploadApiUrl = attrs.uploadApiUrl;
                $scope.myModelObj = attrs.myModelObj;

                var fileInput = element.find('input[type="file"]');

                if (attrs.multiple != undefined && attrs.multiple != "undefined") {
                    fileInput.attr("multiple", "multiple");
                }
            },
            controller: ['$scope', '$upload', '$timeout',
                function ($scope, $upload, $timeout) {
                    var scope = $scope;

                    scope.percentage = 0;

                    $scope.onFileSelect = function ($files) {

                        if ($scope.applicationId == "" || $scope.uploadApiUrl == "") {
                            alert("There is a configuration error, please contact an administrator.");
                            return;
                        }
                        //$files: an array of files selected, each file has name, size, and type.
                        for (var i = 0; i < $files.length; i++) {
                            var file = $files[i];
                            scope.$emit("FileUploading", { documentId: "", documentName: file.name });
                            scope.percentage = 1;

                            scope.upload = $upload.upload({
                                url: scope.uploadApiUrl,
                                method: "POST",
                                data: { myObj: scope.myModelObj, name: file.name, applicationId: scope.applicationId },
                                file: file,
                            }).progress(function (evt) {
                                scope.percentage = parseInt(100.0 * evt.loaded / evt.total);
                            }).success(function (data, status, headers, config) {
                                // file is uploaded successfully
                                scope.percentage = 100;
                                scope.$emit("FileUploaded", { documentId: data.recordId, documentName: config.file.name });

                                $timeout(function () {
                                    scope.percentage = 0;
                                }, 1250);
                            })
                                .error(function (data, status, headers, config) {
                                    scope.$emit("FileUploadError", { documentName: config.file.name });
                                    $timeout(function () {
                                        scope.percentage = 0;
                                        // anything you want can go here and will safely be run on the next digest.
                                    });
                                });
                        }
                    };
                }]
        };
    });
