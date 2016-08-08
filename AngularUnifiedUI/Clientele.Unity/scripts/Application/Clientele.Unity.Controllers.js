/**********************************************************************************************/
/* Controllers                                                                                */
/**********************************************************************************************/
angular.module('Clientele.Unity.Controllers', ['Clientele.AuthControllers'])
    .controller("MainUIController", ["$scope", "notificationService", '$location', '$timeout', 'unityApplicationRepository', 'localStorageService', function ($scope, notificationService, $location, $timeout, unityApplicationRepository, localStorageService) {
        $scope.user = { accountName: "", givenName: "", surname: "" };

        $scope.show = function (e) {
            $scope.sho = true;
            e.stopPropagation();
        }

        $scope.hide = function (e) {
            $scope.sho = false;
        }

        var currentApplication = "";
        $scope.loggedIn = false;
        $scope.MultipleApplications = false;

        $scope.PanelIsOpen = true;
        $scope.PanelClass = $scope.PanelIsOpen ? 'PanelOpen' : 'PanelClosed';

        $scope.ChangeUrl = function (application) {
            if (application.target == "_blank") {
                window.open(application.url);
                return;
            }

            $location.path(application.url.replace("#", ""));
        };

        $scope.HidePanel = function () {
            $scope.PanelIsOpen = false;
            $scope.PanelClass = 'PanelClosed';
        }

        $scope.ToggleSidePanel = function () {
            $timeout(function () {
                $scope.PanelIsOpen = $scope.PanelIsOpen ? false : true;
                $scope.PanelClass = $scope.PanelIsOpen ? 'PanelOpen' : 'PanelClosed';
            });
        };

        $scope.Logout = function () {
            $scope.loggedIn = false;
            $location.path("/logout/");
        };

        $scope.$on('ApplicationsLoaded', function (event, eventArgs) {
            $scope.MultipleApplications = unityApplicationRepository.GetApplications().length > 1;
        });

        $scope.$on('UserLoggedIn', function (event, message) {
            $scope.loggedIn = true;
            if (angular.isDefined(applicationHost.user)) {
                $scope.user = applicationHost.user;
            }
        });

        $scope.$on('UserLoggedOut', function (event, message) {
            $timeout(function () {
                $scope.user = { accountName: "", givenName: "", surname: "" };
            });
        });

        $scope.$on("UINotify", function (event, data) {
            notificationService.notify(data.title, data.message, data.Success ? "success" : "error");
        });

        $scope.$on('ApplicationChanged', function (event, message) {
            if (angular.isDefined(message.applicationKey)) {

                if (message.applicationKey == "Root" || message.applicationKey == "" || message.applicationKey == message.referrer) {
                    $scope.PanelIsOpen = false;
                    $scope.PanelClass = 'PanelClosed';
                    return;
                }

                if (message.applicationKey.toLowerCase() != currentApplication.toLowerCase()) {
                    $scope.ToggleSidePanel();
                    currentApplication = message.applicationKey;
                }
            }
        });

    }])
    .controller("identityNotFoundController", ["$scope", "authenticationService", "$location", "$route", "$timeout", "$rootScope", function ($scope, authenticationService, $location, $route, $timeout, $rootScope) {

        $scope.loginFailed = true;
        $scope.loggingIn = false;

        $scope.LogInWithDomainAccount = function () {
            $scope.loggingIn = true;
            $scope.loginFailed = false;
            authenticationService.Login({ isDomainLogin: true })
                .then(function (data) {
                    if (data.Success) {
                        $rootScope.$broadcast("UserLoggedIn", true);
                    } else {
                        authenticationService.RedirectToNoAccessPage();
                    }
                });
        };

        $scope.$on("AuthenticationFailed", function () {
            $scope.loginFailed = true;
            $scope.loggingIn = false;
        });

        $scope.$on("UrlRejected", function (event, args) {
        });
    }])
    .controller("unityNavigationController", ['$scope', 'authenticationService', 'unityApplicationRepository', 'applicationId', '$timeout', 'noAccessRightsUrl', '$location', '$rootScope', function ($scope, authenticationService, unityApplicationRepository, applicationId, $timeout, noAccessRightsUrl, $location, $rootScope) {
        $scope.iconSource = "";
        $scope.applications = [];


        var canViewLink = function (prefix) {
            var canView = true;
            if (angular.isUndefined(prefix)) {
                return true;
            }

            if (prefix != "") {
                if (!authenticationService.HasAnyMatchingClaim(prefix)) {
                    canView = false;
                }
            }

            return canView;
        };

        $scope.loadNavigation = function () {

            var applications = [];

            angular.forEach(unityApplicationRepository.GetApplications(), function (key, value) {
                var applicationConfiguration = unityApplicationRepository.GetApplicationConfiguration(key.toLowerCase());
                if (canViewLink(applicationConfiguration.IdentityPrefix)) {

                    var target = "_self";
                    var url = "#/" + key + "/";

                    if (!angular.isUndefined(applicationConfiguration.externalUrl)) {
                        target = "_blank";
                        url = applicationConfiguration.externalUrl;
                    }

                    applications.push(
                        {
                            applicationName: applicationConfiguration.applicationName,
                            url: url,
                            applicationKey: key,
                            target: target
                        }
                    );
                }
            });

            $scope.applications = applications;

            if (applications.length == 0) {
                $location.path(noAccessRightsUrl);
                return;
            }

            if (applications.length == 1) {
                if (angular.isUndefined($rootScope.referrerUrl)) {
                    return;
                }

                if ($rootScope.referrerUrl != "/") {
                    return;
                }

                var cleanedUrl = applications[0].url.replace("#", "");

                $rootScope.referrerUrl = cleanedUrl;
                $location.path(cleanedUrl);
                return;
            }

            if (!angular.isUndefined($rootScope.referrerUrl)) {
                $location.path($rootScope.referrerUrl);
                return;
            }

            $location.path("/");
        };

        $scope.$on('ApplicationsLoaded', function (event, message) {
            $scope.loadNavigation();
        });

        $scope.$on('UserLoggedOut', function (event, message) {
            $timeout(function () {
                $scope.applications = [];
            });
        });

        $scope.$on('ApplicationChanged', function (event, message) {
            if ($scope.currentApplicationKey != message.applicationKey) {

                $scope.currentApplication = unityApplicationRepository.GetApplicationConfiguration(message.applicationKey.toLowerCase());

                if (!$scope.currentApplication) {
                    return;
                }
                applicationId.Id = $scope.currentApplication.Id;
            }
        });


    }])
    .controller("applicationSpecificNavigationController", ['$scope', 'unityApplicationRepository', '$location', '$timeout', 'eventBroadcastingService', '$route', function ($scope, unityApplicationRepository, location, $timeout, eventBroadcastingService, $route) {
        $scope.navItems = [];
        $scope.currentApplication = ""; // name : searchUrl
        $scope.currentApplicationKey = ""; // name : searchUrl

        $scope.canSearch = false;
        $scope.searchText = { text: "" };
        $scope.search = function () {
            if (angular.isUndefined($scope.currentApplication) || $scope.currentApplication == "" || angular.isUndefined($scope.searchText.text.trim()) || $scope.searchText.text.trim() == "") {
                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Error', message: 'No search value entered.', success: "error" });
                return;
            }

            var newLocation = $scope.currentApplication.searchUrl.trim() + $scope.searchText.text.trim();

            if (newLocation.toLowerCase() == location.path().toLowerCase()) {
                $route.reload();
            } else {
                location.path(newLocation);
            }

            $scope.searchText.text = "";
        };

        $scope.isActive = function (viewLocation) {

            var locationSplit = viewLocation.split("/");

            if (locationSplit.length == 3) {
                if (("#" + location.path() == viewLocation)) {
                    return true;
                }
            } else {
                var locationPath = "#" + location.path();
                locationPath = locationPath.toLowerCase();
                var lowerViewLocation = viewLocation.toLowerCase();
                return locationPath.indexOf(lowerViewLocation) != -1;
            }

            return false;
        };

        $scope.$on('ApplicationChanged', function (event, message) {
            if ($scope.currentApplicationKey != message.applicationKey) {
                $scope.currentApplicationKey = message.applicationKey;

                if ($scope.currentApplicationKey) {
                    $timeout(function () {
                        $scope.navItems = unityApplicationRepository.GetApplicationNavigation(message.applicationKey.toLowerCase());

                        var searchUrl = "";

                        if (!angular.isUndefined(unityApplicationRepository.GetApplicationConfiguration(message.applicationKey.toLowerCase()))) {
                            searchUrl = unityApplicationRepository.GetApplicationConfiguration(message.applicationKey.toLowerCase()).searchUrl;
                        }

                        $scope.currentApplication = unityApplicationRepository.GetApplicationConfiguration(message.applicationKey.toLowerCase());

                        $scope.canSearch = true;

                        if (searchUrl == "") {
                            $scope.canSearch = false;
                        }

                    });
                } else {
                    $scope.navItems = [];
                    $scope.canSearch = false;
                }
            }
        });

        $scope.$on('UserLoggedOut', function (event, message) {
            $timeout(function () {
                $scope.navItems = [];
                $scope.currentApplication = {};
            });
        });

        $scope.$on('UserLoggedIn', function (event, message) {
            if ($scope.currentApplicationKey) {
                $timeout(function () {
                    $scope.navItems = unityApplicationRepository.GetApplicationNavigation($scope.currentApplicationKey.toLowerCase());
                    $scope.currentApplication = unityApplicationRepository.GetApplicationConfiguration($scope.currentApplicationKey.toLowerCase());
                });
            } else {
                $timeout(function () {
                    $scope.navItems = [];
                });
            }
        });
    }])
    .controller("UnityAddressViewController", ['$scope', '$modal', function ($scope, $modal) {

        $scope.updateAddress = function () {
            $scope.address = {
                addressType: $scope.addressType,
                addressLine1: $scope.addressLine1,
                isValid: false,
                addressLine2: $scope.addressLine2,
                addressLine3: $scope.addressLine3,
                postalCode: $scope.postalCode
            };

            var modalInstance = $modal.open({
                templateUrl: 'Views/UnityAddress/Modal/Edit.html',
                controller: 'AddressEditModalInstanceCtrl',
                size: 'unity-modal-lg',
                resolve: {
                    address: function () {
                        return $scope.address;
                    }
                }

            });

            modalInstance.result.then(function (address) {
                $scope.addressLine1 = address.addressLine1;
                $scope.addressLine2 = address.addressLine2;
                $scope.isValid = address.isValid;
                $scope.addressLine3 = address.addressLine3;
                $scope.postalCode = address.postalCode;
            });
        };
    }])
    .controller("AddressEditModalInstanceCtrl", ['$scope', '$rootScope', '$modalInstance', 'addressValidationApiFactory', 'address', function ($scope, $rootScope, $modalInstance, addressValidationApiFactory, address) {
        $scope.address = address;
        $scope.address.isValid = false;

        $scope.resetValidation = function () {
            $scope.address.isValid = false;
            $scope.address.validationMessage = "Please Validate";
            $scope.address.validationResultDescription = "Please Validate";
            $scope.validationInfoColour = "bg-info";
        };

        $scope.resetValidation();

        $scope.$watch("address.validationResultDescription", function (newVal, oldVal) {
            if (newVal === "Suspect") {
                $scope.validationInfoColour = "bg-warning";
            }

            if (newVal === "Invalid") {
                $scope.validationInfoColour = "bg-danger";
            }

            if (newVal === "Certified") {
                $scope.validationInfoColour = "bg-success";
            }
        });

        $scope.ok = function () {
            $modalInstance.close($scope.address);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.validate = function () {
            addressValidationApiFactory.validate($scope.address).success(function (validationResult) {
                $scope.address.isValid = validationResult.IsValid;
                $scope.address.validationMessage = validationResult.Message;
                $scope.address.validationResultDescription = validationResult.AddressValidationResultDescription;
                $scope.address.addressLine1 = validationResult.AddressLine1;
                $scope.address.addressLine2 = validationResult.AddressLine2;
                $scope.address.addressLine3 = validationResult.AddressLine3;
                $scope.address.postalCode = validationResult.PostalCode;

            });
        };
    }])
    .controller("UnityBankDetailViewController", ['$scope', '$modal', function ($scope, $modal) {

        $scope.updateBankDetails = function () {

            $scope.validationParameters = {
                CheckSoftyComp: $scope.checkSoftyComp,
                CheckFraudster: $scope.checkFraudster,
                CheckD3: $scope.checkD3,
                AllowDebitsStoppedOnAccount: $scope.allowDebitsStoppedOnAccount,
                SkipD3ForDebitsStoppedOnAccount: $scope.skipD3ForDebitsStoppedOnAccount
            };

            $scope.bankAcc = {
                accountType: $scope.accountType,
                accountName: $scope.accountName,
                accountNumber: $scope.accountNumber,
                bankName: $scope.bankName,
                branchCode: $scope.branchCode,
                branchCodeName: $scope.branchCodeName,
                AccountValidationParameters: $scope.validationParameters
            };

            var modalInstance = $modal.open({
                templateUrl: 'Views/UnityBankDetails/Modal/Edit.html',
                controller: 'BankDetailEditModalInstanceCtrl',
                size: 'modal-lg',
                resolve: {
                    bankAcc: function () {
                        return $scope.bankAcc;
                    }
                }
            });

            modalInstance.result.then(function (bankAcc) {
                $scope.$emit("BankDetailsUpdated", bankAcc);
            });
        };

        $scope.doAVSRCheck = function () {
            $scope.bankAcc = {
                bankAccountId: $scope.bankAccountId,
                AVSRResults: null
            };

            var modalInstance = $modal.open({
                templateUrl: 'Views/UnityBankDetails/Modal/AVSRModal.html',
                controller: 'AVSRCheckModalInstanceCtrl',
                size: 'modal-lg',
                resolve: {
                    bankAcc: function () {
                        return $scope.bankAcc;
                    }
                }
            });

            modalInstance.result.then(function (eventData) {
                console.log(eventData);
                $scope.$emit("AVSRCheckCompleted", { event: eventData });
            });


        };


    }])
    .controller("BankDetailEditModalInstanceCtrl", ['$scope', '$modalInstance', 'bankAcc', function ($scope, $modalInstance, bankAcc) {
        $scope.bankAcc = bankAcc;
        $scope.bankAcc.isValid = false;

        $scope.resetValidation = function () {
            $scope.bankAcc.isValid = false;
        };

        $scope.resetValidation();

        $scope.ok = function () {
            $modalInstance.close($scope.bankAcc);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$on("registerBankDetailsSuccess", function (event, eventData) {
            $modalInstance.close(eventData);
        });

        $scope.$on("registerBankDetailsFail", function (event, eventData) {
            alert(eventData.data.Message);

        });

    }])
    .controller("AVSRCheckModalInstanceCtrl", ['$scope', '$modalInstance', 'bankAcc', function ($scope, $modalInstance, bankAcc) {
        $scope.bankAcc = bankAcc;

        $scope.ok = function () {
            $modalInstance.close($scope.bankAcc);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss("cancel");
        };


        $scope.$on("avsrCheck", function (event, eventData) {
            $modalInstance.close(eventData);
        });

    }])
.controller('Clientele.Gsd.Controllers.DepartmentNameSelectController', [
    '$scope', 'uiLoader', 'ajaxJsonService', '$modal', function ($scope, uiLoader, ajaxJsonService, $modal) {

        $scope.open = function () {
            showModal();
        };

        function showModal() {
            var configuration = applicationHost.retrieveApplicationConfigurationById('Clientele.ApplicationFormsCapture');

            var modalInstance = $modal.open({
                templateUrl: '/Views/Gsd/departmentSelectModal.html',
                controller: 'Clientele.Gsd.Controllers.DepartmentNameSelectModalController',
                size: 'lg',
                resolve: {
                    model: function () {
                        return { department: $scope.sourceDepartment }
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.sourceDepartment = selectedItem;
            }, function () {

            });
        }
    }
]).controller('Clientele.Gsd.Controllers.DepartmentNameSelectModalController', ['$scope', '$modalInstance', '$http', 'model', 'ajaxJsonService', 'gsdApiUrl',
 function ($scope, $modalInstance, $http, model, ajaxJsonService, gsdApiUrl) {

     $scope.model = model;

     $scope.setParent = function (value) {
         $scope.selectedVenue = value.Name;
     }

     $scope.loadDepartmentNames = function () {
         var success = function (data) {
             $scope.model.Items = data.data;

             var result = Enumerable.From($scope.model.Items).FirstOrDefault({ Name: '', Key: 0 }, function (x) {
                 return x.Department.toLowerCase() == $scope.model.department.toLowerCase();
             });
             if (result !== { Name: '', Key: 0 }) {
                 $scope.model.selected = result;
             }
         };

         var error = function (error) {
             alert(error);
         };

         ajaxJsonService.Get(gsdApiUrl + '/DepartmentPayroll').then(success).catch(error);
     }

     $scope.clear = function () {
         $scope.model.selected = "";
     };

     $scope.ok = function () {
         $modalInstance.close($scope.model.selected.Department);
     };

     $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
     };
 }])
  .controller("EasyModalAsyncController", [
    '$scope',
    '$modalInstance',
    "model",
    function ($scope, $modalInstance, model) {
        $scope.fields = model.input.Fields;
        $scope.title = model.input.Title;
        $scope.buttons = model.input.Buttons;

        if ($scope.buttons == null || $scope.buttons.length === 0) {
            $scope.buttons = [
                {
                    Name: "Ok"
                }
            ];
        }

        Enumerable.From($scope.fields)
            .ForEach(function (x) {
                if (x.Type === "File") {
                    x.$Invalid = true;
                }
                else
                    x.$Invalid = false;
            });

        updateInvalidStatus();

        function updateInvalidStatus() {
            $scope.$Invalid = Enumerable.From($scope.fields).Any(function (x) {
                return x.$Invalid;
            });
        }

        var defaultWidth = "50px";

        Enumerable.From(model.input.Fields).ForEach(function (x) {

            if (x.Type === "UiGrid") {

                var columnDefinitions = [];

                Enumerable.From(x.Columns).ForEach(function (column) {
                    switch (column.Type) {
                        case "Hidden":
                            break;
                        case "SelectTagging":
                            columnDefinitions.push({
                                field: column.Name, editableCellTemplate: '/Views/EasyModal/UiGridSelect.html', editDropdownOptionsArray: column.Options
                            });
                            break;
                        default:
                            columnDefinitions.push({ field: column.Name, enableCellEdit: false });
                            break;
                    }
                });

                x.gridOptions = {
                    enableSorting: true,
                    enableGridMenu: false,
                    flatEntityAccess: true,
                    enableFiltering: false,
                    enableColumnResizing: false,
                    enableColumnMenus: false,
                    enableCellEditOnFocus: true,
                    data: x.Rows,
                    columnDefs: columnDefinitions
                };
            }
        });

        $scope.option = {};

        $scope.tagTransform = function (value) {
            return value;
        }

        $scope.dateChanged = function (field) {

            var selectedTime = field.Time === undefined ? new Date() : field.Value;
            var selectedDate = field.Date === undefined ? new Date() : field.Value;

            var date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.getHours(), selectedTime.getMinutes(), 0);

            field.Value = date;
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

        $scope.onFileSelect = function (field, $files) {
            field.Value = $files;
            field.$Invalid = false;
            updateInvalidStatus();
        }

        $scope.ok = function () {
            $modalInstance.close({ fields: $scope.fields });
        }

        function filterFields() {
            var result = {};

            Enumerable.From($scope.fields).ForEach(function (x) {

                if (x.Type === "SelectKeyValue") {
                    var selectedOptionValue = Enumerable.From(x.Options).First(function (y) { return y.Key === x.Value; });
                    result[x.Name] = { Value: selectedOptionValue.Value, Key: selectedOptionValue.Key };

                }
                else if (x.Type === "ReadonlyTable" || x.Type === "UiGrid") {
                    result[x.Name] = x.Rows;
                } else {
                    result[x.Name] = x.Value;
                }

            });

            return result;
        }

        $scope.inlineButtonClicked = function (column, row) {
            column.Action(row);
        }

        $scope.buttonClicked = function (column, row) {

            if (row == null)
                $modalInstance.close({ Fields: filterFields(), Action: function () { return column.Action == null ? null : column.Action(filterFields()) } });
            else
                $modalInstance.close({ Fields: filterFields(), Action: function () { return column.Action == null ? null : column.Action(row) } });
        }
    }
  ]);
/**********************************************************************************************/