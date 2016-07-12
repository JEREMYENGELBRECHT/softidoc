/**********************************************************************************************/
/* Controllers                                                                                */
/**********************************************************************************************/
(function () {
angular.module('Clientele.WorkFlowServices.Controllers', [])
    .controller('workflowTeamListController', ['$scope', '$routeParams', 'workflowServicesManagementApiService', 'uiLoader', 'httpResponseService', 'identityMaintenanceApiService', '$q',
        function ($scope, $routeParams, workflowServicesManagementApiService, uiLoader, httpResponseService, identityMaintenanceApiService, $q) {
            $scope.teams = [];

            $scope.$on('Clientele.Workflow.InitializeComplete', function () {
                if ($scope.loadEvent == null)
                    $scope.loadData();
            });

            $scope.saveTeam = function (newValue, team) {

                uiLoader.UseWithLoader($scope, function () {
                    var savePromise = workflowServicesManagementApiService.updateTeam({ Id: team.Id, TeamName: newValue });
                    savePromise.catch(function (returnData) {
                        httpResponseService.HandleCustomError(returnData.status, returnData.data.Message);
                        $scope.loadData();
                    });

                    return savePromise;

                }, function () {
                });
            };

            $scope.newTeam = {
                Show: false,
                TeamName: "",
                CanAdd: function () {
                    return $scope.TeamName != "";
                }
            };

            $scope.deleteTeam = function (teamId) {
                if (confirm("Are you sure you wish to delete this team, all members will be removed as well.", function () {
                      uiLoader.UseWithLoader($scope, function () { return deleteTeamFromApi(teamId); }, function () { $scope.loadData(); });
                }));
            };

            var deleteTeamFromApi = function (teamId) {
                var savePromise = workflowServicesManagementApiService.deleteTeam(teamId);
                savePromise.catch(function (returnData) {
                    httpResponseService.HandleCustomError(returnData.status, returnData.data.Message);
                    $scope.loadData();
                });
                return savePromise;
            };

            $scope.ShowAddNewTeam = function () {
                $scope.newTeam.Show = true;
            };

            var saveNewTeamAction = function () {
                var savePromise = workflowServicesManagementApiService.addNewTeam($scope.newTeam.TeamName);
                savePromise.catch(function (returnData) {
                    httpResponseService.HandleCustomError(returnData.status, returnData.data.Message);
                    $scope.loadData();
                });
                return savePromise;
            };

            $scope.AddTeam = function () {
                uiLoader.UseWithLoader($scope, saveNewTeamAction, function () {
                    $scope.fetchData();
                    $scope.newTeam.TeamName = "";
                    $scope.newTeam.Show = false;
                });
            };

            $scope.dataLoaded = false;

            $scope.emitDataLoaded = function () {
                if (!angular.isUndefined($scope.dataLoadedEmitEvent)) {
                    if ($scope.dataLoadedEmitEvent != "") {
                        $scope.$emit($scope.dataLoadedEmitEvent, $scope.teams);
                    }
                }
            };

            $scope.errorOccured = function (returnData) {
                if (!angular.isUndefined($scope.errorOccuredEvent)) {
                    if ($scope.errorOccuredEvent != "") {
                        $scope.$emit($scope.errorOccuredEvent, returnData);
                    }
                }
            };

            var callingAction = function () {
                var queryPromise = workflowServicesManagementApiService.getWorkFlowTeams();
                queryPromise.catch(function (returnData) {
                    $scope.errorOccured(returnData);
                });
                return queryPromise;
            };

            var successAction = function (data) {

                angular.forEach(data, function (value, key) {
                    value.membersCollapsed = true;
                });

                $scope.teams = data;
                $scope.dataLoaded = true;
                $scope.emitDataLoaded();
            };

            $scope.$on($scope.loadEvent, function () {
                $scope.loadData();
            });

            $scope.fetchData = function () {
                uiLoader.UseWithLoader($scope, callingAction, successAction);
            };

            $scope.loadData = function () {
                if (angular.isUndefined($scope.cacheData)) {
                    $scope.cacheData = false;
                }

                if (eval($scope.cacheData)) {
                    if (!$scope.dataLoaded) {
                        $scope.fetchData();
                    } else {
                        $scope.emitDataLoaded();
                    }
                } else {
                    $scope.fetchData();
                }

            };
        }])
    .controller('workflowTeamRowController', ['$scope',
        function ($scope) {
            $scope.assignMembers = function (team) {
                if (team.membersCollapsed) {
                    team.membersCollapsed = false;
                    $scope.$broadcast("loadTeamMembers", team);
                } else {
                    team.membersCollapsed = true;
                }
            };
        }])
    .controller('WorkflowTeamMemberListController', ['$scope', '$routeParams', 'workflowServicesManagementApiService', 'uiLoader', 'identityMaintenanceApiService', '$q', 'httpResponseService',
        function ($scope, $routeParams, workflowServicesManagementApiService, uiLoader, identityMaintenanceApiService, $q, httpResponseService) {
            var cachedUsers = [];

            $scope.usersDropdown = { selectedItem: null };
            $scope.rolesDropdown = { selectedItem: null };

            var getUserEmail = function (userId) {
                for (var i = 0; i < cachedUsers.length; i++) {
                    if (cachedUsers[i].Id == userId) {
                        return cachedUsers[i].Email;
                    }
                }

                return "";
            };

            var loadUserDropdown = function () {
                var queryPromise = identityMaintenanceApiService.getUsers();
                queryPromise.catch(function (returnData) {
                    $scope.errorOccured(returnData);
                });
                return queryPromise;
            };

            var userDropdownLoaded = function (data) {
                var users = [];
                for (var i = 0; i < data.length; i++) {
                    users.push({ Text: data[i].FirstName + " " + data[i].Surname + " (" + data[i].Tenant + "\\" + data[i].Username + ")", Value: data[i].Id });
                }

                $scope.usersDropdown = new Dropdown(users, "Select a user", null);

                $scope.$watch('usersDropdown', function (newVal, oldVal) {
                    if ($scope.usersDropdown.selectedItem == null || $scope.rolesDropdown.selectedItem == null) {
                        $scope.CanAddNewTeamMember = false;
                        return;
                    }
                    $scope.CanAddNewTeamMember = angular.isDefined($scope.usersDropdown.selectedItem.Value) && angular.isDefined($scope.rolesDropdown.selectedItem.Value);;
                }, true);

                cachedUsers = data;
            };

            var loadRoleDropdowns = function () {
                var queryPromise = workflowServicesManagementApiService.getRoles();
                queryPromise.catch(function (returnData) {
                    $scope.errorOccured(returnData);
                });
                return queryPromise;
            };

            var roleDropdownLoaded = function (data) {
                var roles = [];
                for (var i = 0; i < data.length; i++) {
                    roles.push({ Text: data[i].Name, Value: data[i].Id });
                }

                $scope.rolesDropdown = new Dropdown(roles, "Select a role", null);

                $scope.$watch('rolesDropdown', function (newVal, oldVal) {
                    if ($scope.usersDropdown.selectedItem == null || $scope.rolesDropdown.selectedItem == null) {
                        $scope.CanAddNewTeamMember = false;
                        return;
                    }
                    $scope.CanAddNewTeamMember = angular.isDefined($scope.usersDropdown.selectedItem.Value) && angular.isDefined($scope.rolesDropdown.selectedItem.Value);;
                }, true);
            };

            uiLoader.UseWithLoader($scope, loadUserDropdown, userDropdownLoaded);
            uiLoader.UseWithLoader($scope, loadRoleDropdowns, roleDropdownLoaded);

            $scope.teamMembers = [];

            $scope.newTeamMember = {
                ShowNewMember: false,
                TeamId: "",
                UserId: "",
                RoleId: ""
            };

            $scope.AddNewTeamMember = function () {
                var newTeamMember = {
                    UserId: $scope.usersDropdown.selectedItem.Value,
                    Name: $scope.usersDropdown.selectedItem.Text,
                    Email: getUserEmail($scope.usersDropdown.selectedItem.Value),

                    RoleId: $scope.rolesDropdown.selectedItem.Value,
                    TeamId: $scope.teamId
                };

                uiLoader.UseWithLoader($scope, function () {
                    var promise = workflowServicesManagementApiService.addNewTeamMember(newTeamMember);
                    promise.catch(function (returnData) {
                        httpResponseService.HandleCustomError(returnData.status, returnData.data.Message);

                        for (var i = 0; i < $scope.$parent.teams.length; i++) {
                            if ($scope.$parent.teams[i].Id == newTeamMember.TeamId) {
                                $scope.loadData($scope.$parent.teams[i]);
                            }
                        }
                    });
                    return promise;
                }, function () {
                    httpResponseService.HandleCustomSuccess(201, "Team member added");
                    $scope.fetchData($scope.team);
                    $scope.usersDropdown.selectedItem = null;
                    $scope.rolesDropdown.selectedItem = null;
                });
            };

            $scope.CanAddNewTeamMember = false;

            $scope.dataLoaded = false;

            $scope.emitDataLoaded = function () {
                if (!angular.isUndefined($scope.dataLoadedEmitEvent)) {
                    if ($scope.dataLoadedEmitEvent != "") {
                        $scope.$emit($scope.dataLoadedEmitEvent, $scope.PolicyResults);
                    }
                }
            };

            $scope.errorOccured = function (returnData) {
                if (!angular.isUndefined($scope.errorOccuredEvent)) {
                    if ($scope.errorOccuredEvent != "") {
                        $scope.$emit($scope.errorOccuredEvent, returnData);
                    }
                }
            };

            var callingAction = function (team) {
                var queryPromise = workflowServicesManagementApiService.getTeamMembers(team.Id);
                queryPromise.catch(function (returnData) {
                    $scope.errorOccured(returnData);
                });
                return queryPromise;
            };

            var successAction = function (data) {

                angular.forEach(data, function (value, key) {
                    value.membersCollapsed = true;
                });

                $scope.teamMembers = data;
                $scope.dataLoaded = true;
                $scope.emitDataLoaded();
            };

            $scope.$on($scope.loadEvent, function (event, team) {
                $scope.loadData(team);
                $scope.teamId = team.Id;
                $scope.team = team;
            });

            $scope.fetchData = function (team) {
                uiLoader.UseWithLoader($scope, function () {
                    return callingAction(team);
                }, successAction);
            };

            $scope.loadData = function (team) {
                if (angular.isUndefined($scope.cacheData)) {
                    $scope.cacheData = false;
                }

                if (eval($scope.cacheData)) {
                    if (!$scope.dataLoaded) {
                        $scope.fetchData(team);
                    } else {
                        $scope.emitDataLoaded();
                    }
                } else {
                    $scope.fetchData(team);
                }

            };

            $scope.addTeamMember = function () {
                $scope.newTeamMember.ShowNewMember = true;
            };
        }])
    .controller('teamMemberController', ['$scope', '$routeParams', 'workflowServicesManagementApiService', 'uiLoader', 'identityMaintenanceApiService', 'httpResponseService',
        function ($scope, $routeParams, workflowServicesManagementApiService, uiLoader, identityMaintenanceApiService, httpResponseService) {
            $scope.changeTeamMemberActiveStatus = function (teamMember) {
                uiLoader.UseWithLoader($scope, function () { return changeTeamMemberStatus(teamMember); }, function (returnData) {
                    httpResponseService.HandleCustomSuccess(200, returnData);
                });
            };

            var changeTeamMemberStatus = function (teamMember) {
                var savePromise = workflowServicesManagementApiService.changeTeamMemberStatus(teamMember);
                savePromise.catch(function (returnData) {
                    httpResponseService.HandleCustomError(returnData.status, returnData.data.Message);
                    $scope.loadData($scope.$parent.team);
                });
                return savePromise;
            };

            $scope.deleteTeamMember = function (teamId, teamMemberId) {
                if (confirm("Are you sure you wish to delete this team member.", function () {
                     uiLoader.UseWithLoader($scope, function () { return deleteTeamMemberFromApi(teamId, teamMemberId); }, function (data) {

                     $scope.loadData($scope.$parent.team);
                });
                }));
            };


            var deleteTeamMemberFromApi = function (teamId, teamMemberId) {
                var savePromise = workflowServicesManagementApiService.deleteTeamMember(teamId, teamMemberId);
                savePromise.catch(function (returnData) {
                    httpResponseService.HandleCustomError(returnData.status, returnData.data.Message);
                    $scope.loadData($scope.$parent.team);
                });
                return savePromise;
            };
        }]);
})();

/**********************************************************************************************/