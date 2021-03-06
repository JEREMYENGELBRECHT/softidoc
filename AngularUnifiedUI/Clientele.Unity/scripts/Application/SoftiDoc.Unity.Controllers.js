﻿/**********************************************************************************************/
/* Controllers                                                                                */
/**********************************************************************************************/
angular.module('SoftiDoc.Unity.Controllers', ['SoftiDoc.AuthControllers', 'SoftiDoc.CentrePanel.Controller', 'SoftiDoc.OuterPanel.Controller'])
    .controller("MainUIController",[
        "$scope", "notificationService", '$location', '$timeout', 'unityApplicationRepository', 'localStorageService',
        function($scope, notificationService, $location, $timeout, unityApplicationRepository, localStorageService) {
            $scope.user = { accountName: "", givenName: "", surname: "" };

            $scope.show = function(e) {
                $scope.sho = true;
                e.stopPropagation();
            }

            $scope.hide = function(e) {
                $scope.sho = false;
            }

            var currentApplication = "";
            $scope.loggedIn = false;
            $scope.MultipleApplications = false;

            $scope.PanelIsOpen = true;
            $scope.PanelClass = $scope.PanelIsOpen ? 'PanelOpen' : 'PanelClosed';

            $scope.ChangeUrl = function(application) {
                if (application.target == "_blank") {
                    window.open(application.url);
                    return;
                }

                $location.path(application.url.replace("#", ""));
            };

            $scope.HidePanel = function() {
                $scope.PanelIsOpen = false;
                $scope.PanelClass = 'PanelClosed';
            }

            $scope.ToggleSidePanel = function() {
                $timeout(function() {
                    $scope.PanelIsOpen = $scope.PanelIsOpen ? false : true;
                    $scope.PanelClass = $scope.PanelIsOpen ? 'PanelOpen' : 'PanelClosed';
                });
            };

            $scope.Logout = function() {
                $scope.loggedIn = false;
                $location.path("/logout/");
            };

            $scope.$on('ApplicationsLoaded',
                function(event, eventArgs) {
                    $scope.MultipleApplications = unityApplicationRepository.GetApplications().length > 1;
                });

            $scope.$on('UserLoggedIn',
                function(event, message) {
                    $scope.loggedIn = true;
                    if (angular.isDefined(applicationHost.user)) {
                        $scope.user = applicationHost.user;
                    }
                });

            $scope.$on('UserLoggedOut',
                function(event, message) {
                    $timeout(function() {
                        $scope.user = { accountName: "", givenName: "", surname: "" };
                    });
                });

            $scope.$on("UINotify",
                function(event, data) {
                    notificationService.notify(data.title, data.message, data.Success ? "success" : "error");
                });

            $scope.$on('ApplicationChanged',
                function(event, message) {
                    if (angular.isDefined(message.applicationKey)) {

                        if (message.applicationKey == "Root" ||
                            message.applicationKey == "" ||
                            message.applicationKey == message.referrer) {
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

        }
    ])
    .controller("MainPageController", ["$scope", "authenticationService", "$location", "$route", "$timeout", "$rootScope", 'uiLoader', 'ajaxJsonService', function ($scope, authenticationService, $location, $route, $timeout, $rootScope, uiLoader, ajaxJsonService) {
            
        $scope.remove = function (scope) {
            scope.remove();
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBeginning = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };

        $scope.newSubItem = function (scope) {
            debugger;
            var nodeData = scope.$modelValue;
            nodeData.nodes.push({
                id: nodeData.id * 10 + nodeData.nodes.length,
                Name: nodeData.title + '.' + (nodeData.nodes.length + 1),
                nodes: []
            });
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };

        var loadTree = function() {
            var action = function () {
                //return ajaxJsonService.Get("http://softidocwebapi.azurewebsites.net/api/softidoc/getDatabases/", null);
                return ajaxJsonService.Get("http://localhost:42050/api/softidoc/getDatabases/", null);
            };

            var success = function (data) {
                debugger;
                //alert(data);
                $scope.data = data;

                
            };

            uiLoader.UseWithLoader($scope, action, success);
        };

        $scope.$on('$viewContentLoaded', function () {
            debugger;
            loadTree();
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

        //$scope.loggedIn = true;
        //var titleBarNavigation = [];

        //titleBarNavigation.push({ url: '#/Encashments/', label: 'Encashments Home', requiredClaim: "" });
        //titleBarNavigation.push({ url: '#/Encashments/Tasks', label: 'My Tasks', requiredClaim: "Encashments.Tasks" });
        //titleBarNavigation.push({ url: '#/Encashments/SpotChecking', label: 'Spot Checking', requiredClaim: "Encashments.SpotChecking" });
        //titleBarNavigation.push({ url: '#/Encashments/TaskManagement', label: 'Task Management', requiredClaim: "Encashments.TaskManagement" });
        //titleBarNavigation.push({ url: '#/Encashments/TeamManagement', label: 'Team Management', requiredClaim: "Encashments.TeamManagement" });
        //titleBarNavigation.push({ url: '#/Encashments/Help', label: 'Help', requiredClaim: "" });

        //$scope.navItems = titleBarNavigation;



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
    .controller('SoftiDoc.Gsd.Controllers.DepartmentNameSelectController', [
    '$scope', 'uiLoader', 'ajaxJsonService', '$modal', function ($scope, uiLoader, ajaxJsonService, $modal) {

        $scope.open = function () {
            showModal();
        };

        function showModal() {
            var configuration = applicationHost.retrieveApplicationConfigurationById('SoftiDoc.ApplicationFormsCapture');

            var modalInstance = $modal.open({
                templateUrl: '/Views/Gsd/departmentSelectModal.html',
                controller: 'SoftiDoc.Gsd.Controllers.DepartmentNameSelectModalController',
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
])
    .controller('SoftiDoc.Gsd.Controllers.DepartmentNameSelectModalController', ['$scope', '$modalInstance', '$http', 'model', 'ajaxJsonService', 'gsdApiUrl',
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
    "$q",
    function ($scope, $modalInstance, model, $q) {
        $scope.fields = model.input.Fields;
        $scope.title = model.input.Title;
        $scope.buttons = model.input.Buttons;

        $scope.visibleButtons = Enumerable.From(model.input.Buttons)
            .Where(function (x) {
                return x.Name.toLowerCase() !== 'cancel';
            })
            .ToArray();

        if ($scope.buttons == null || $scope.buttons.length === 0) {
            $scope.visibleButtons = [
                {
                    Name: "Ok"
                }
            ];
        }

        $scope.selectAll = function (field, column) {
            Enumerable.From(field.Rows)
                .ForEach(function (x) {
                    x[column.Name] = column.selected;
                });
        };

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

        Enumerable.From(model.input.Fields).ForEach(function (x) {

            if (x.Type === "SelectTagging") {
                $q.resolve(x.Options).then(function (data) {
                    x.Options = data.data == null ? data : data.data;
                });
            }

            if (x.Type === "UiGrid") {

                var columnDefinitions = [];

                Enumerable.From(x.Columns).ForEach(function (column) {
                    switch (column.Type) {
                        case "Hidden":
                            break;
                        case "SelectTagging":
                            columnDefinitions.push({
                                field: column.Name, editableCellTemplate: '/Views/EasyModal/UiGridSelectTagging.html', editDropdownOptionsArray: column.Options
                            });
                            break;
                        case "SelectKeyValue":
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
                    enableFiltering: false,
                    enableColumnResizing: false,
                    enableColumnMenus: false,
                    enableCellEditOnFocus: true,
                    data: x.Rows,
                    columnDefs: columnDefinitions
                };
            }
        });

        $scope.refreshOptions = function (search, column) {

            if (search.length < 2)
                return [];

            var containsOptions = [];

            Enumerable.From(column.Options)
                 .Where(function (x) {
                     if (x.toLowerCase().startsWith(search.toLowerCase())) {
                         containsOptions.push(x);
                     }
                 }).ToArray();

            Enumerable.From(column.Options)
                  .Where(function (x) {
                      if (x.toLowerCase().indexOf(search.toLowerCase()) > 0) {
                          containsOptions.push(x);
                      }
                  }).ToArray();

            column.FilteredOptions = containsOptions;
            return containsOptions;
        }

        $scope.clearOptions = function (column) {
            column.FilteredOptions = [];
        }

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

        $scope.addItemToDropdown = function (item, model, column) {

            var index = column.Options.indexOf(item);
            if (index > -1)
                return;

            column.Options.push(item);
        }

        $scope.cancel = function () {

            var cancelButtons = Enumerable.From($scope.buttons).Where(function (x) {
                return x.Name.toLowerCase() === 'cancel';
            }).ToArray();

            if (cancelButtons.length > 0)
                $modalInstance.close({ Fields: filterFields(), Action: function () { return cancelButtons[0].Action(filterFields()) } });
            else
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