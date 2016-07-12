/**********************************************************************************************/
(function () {

    var dashBoardController = function ($scope, $location, uiLoader, tasksWebApi, taskService, taskApplicationRepository, applicationId, unityApplicationRepository, httpResponseService) {

        var determineApplicationFromPath = function () {
            var splitPath = $location.$$path.split("/");

            if (splitPath.length > 0) {
                var applicationKey = splitPath[1];
                return applicationKey.toLowerCase();
            }
        };

        $scope.showSearchResults = false;

        $scope.searchText = "";
        $scope.searchResultsExist = false;

        $scope.tasks = [];
        $scope.currentPage = 0;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 0;
        $scope.availableCount = 0;
        // $scope.taskService = taskService;

        $scope.navigateToTask = function (id, queue) {
            navigateToTask(id, { TaskQueueName: queue });
        }

        $scope.searchTasks = function () {
            if ($scope.searchText === "") {
                alert("Please fill in a value to search for");
                return;
            }

            if (angular.isUndefined($scope.selectedTaskQueue))
                return;

            var action = function () { return $scope.searchConfiguration.searchFunction($scope.searchText, $scope.selectedTaskQueue.TaskQueueName); };

            var resultAction = function (data) {
                if (data.indexOf("does not exist") !== -1) {
                    $scope.showSearchResults = true;
                    $scope.searchResultsExist = false;
                    return;
                }

                $scope.searchResultsExist = true;

                if (data.length === 1) {
                    navigateToTask(data[0].Id, { TaskQueueName: $scope.selectedTaskQueue.TaskQueueName });
                } else {
                    $scope.showSearchResults = false;
                    $scope.searchResults = {
                        Results: data,
                        Queue: $scope.selectedTaskQueue.TaskQueueName
                    }
                }
            };

            uiLoader.UseWithLoader($scope, action, resultAction);
        };

        $scope.breadcrumbList = [];

        $scope.buildHistoryItems = function () {
            $scope.historyItems = $scope.breadcrumbList.slice(0, $scope.breadcrumbList.length - 1);
            $scope.activeBreadCrumb = $scope.breadcrumbList[$scope.breadcrumbList.length - 1];
        }

        $scope.activateBreadCrumb = function (item) {
            item.Action();

            var index = $scope.breadcrumbList.indexOf(item);
            $scope.breadcrumbList = $scope.breadcrumbList.slice(0, index + 1);
            $scope.buildHistoryItems();
        }

        $scope.refresh = function () {
            if ($scope.activeBreadCrumb.Refresh == null)
                return;

            $scope.activeBreadCrumb.Refresh();
        }

        function addHistoryItem(name, backAction, level, refreshAction) {

            if ($scope.breadcrumbList.length > 0 && $scope.breadcrumbList[$scope.breadcrumbList.length - 1].Level == level) {
                $scope.breadcrumbList[$scope.breadcrumbList.length - 1] = { Name: name, Action: backAction, Level: level, Refresh: refreshAction };
            }
            else
                $scope.breadcrumbList.push({
                    Name: name, Action: backAction, Level: level, Refresh: refreshAction
                });

            $scope.buildHistoryItems();
        }

        $scope.availableTasks = function () {
            return $scope.availableCount > 0;
        };

        $scope.hasItems = function (item) {
            return item.Total > 0;
        };

        $scope.hasNoItems = function (item) {
            return item.Total == 0;
        };

        $scope.taskQueueHasItems = function (item) {
            return item.ActiveCount > 0;
        };

        $scope.taskQueueHasNoItems = function (item) {
            return item.ActiveCount == 0;
        };

        $scope.postponeTask = function (item) {
            taskService.postponeTask(item);
        };

        $scope.getFieldValue = function (array, key) {
            return taskService.getFieldByKey(array, key);
        };

        $scope.claimTask = function (queue) {
            uiLoader.UseWithLoader($scope, function () { return tasksWebApi.claimTask(queue.TaskQueueName); }, function (data) {
                navigateToTask(data.TaskId, queue);
            });
        };

        $scope.setPage = function (pageNo) {

            if ($scope.selectedQueue == {} || pageNo == 0)
                return;

            loadTaskList(pageNo);
        };

        $scope.shouldShowTaskList = function () {
            return $scope.selectedQueue != null && $scope.selectedQueueData != undefined && $scope.selectedQueueData.length > 0 && !$scope.searchResultsExist;
        };

        $scope.shouldShowEmptyTaskList = function () {
            return $scope.selectedQueue != null && ($scope.selectedQueueData == undefined || $scope.selectedQueueData.length == undefined || $scope.selectedQueueData.length == 0);
        };

        $scope.noWorkForQueue = function () {
            return $scope.selectedQueueData.length == 0 && $scope.selectedQueue != {};
        };

        $scope.selectTask = function (task) {
            navigateToTask(task.Id);
        };

        $scope.isSelected = function (value) {
            return value == $scope.selectedQueue.Key;
        };

        $scope.selectQueue = function (queue) {
            $scope.selectedQueue = queue;
            loadTaskList(1);
            addHistoryItem(queue.Status, clearSelectedTaskQueue, "Queue");
        };

        $scope.selectTaskQueue = function (item) {
            $scope.selectedTaskQueue = item;
            loadQueueList();
            addHistoryItem(item.TaskTemplateName, clearSelectedTaskQueueData, "TaskQueue");

            var searchConfiguration = taskApplicationRepository.getTaskSearchConfiguration(determineApplicationFromPath(), $scope.selectedTaskQueue.TaskQueueName);

            console.log(searchConfiguration);

            if (searchConfiguration !== null) {
                $scope.searchConfiguration = searchConfiguration;
            } else {
                $scope.searchConfiguration = undefined;
            }

        };

        $scope.selectRole = function (item) {
            $scope.selectedRole = item;
            $scope.hasClaimableQueues = Enumerable.From(item.TaskBaskets).Any(function (x) {
                return x.TaskResponsibilityId != 7;
            });
            addHistoryItem(item.Role, clearSelectedTaskQueue, "Role", getTaskBasket);
        };

        function clearSelectedRole() {
            $scope.selectedRole = null;
            clearSelectedTaskQueue();
        };

        function clearSelectedTaskQueue() {
            $scope.selectedTaskQueue = null;
            $scope.selectedQueueData = null;
            $scope.selectedQueue = null;
        };

        function clearSelectedTaskQueueData() {
            $scope.selectedQueueData = null;
            $scope.selectedQueue = null;
        };

        $scope.setUnassignedPage = function (pageNo) {

            if ($scope.selectedUnassignedQueue === "" || pageNo === 0)
                return;

            loadUnassignedTaskList(pageNo);
        };

        $scope.noWorkForQueue = function () {
            return $scope.selectedQueueData.length == 0 && $scope.selectedQueue != "";
        };

        function loadTaskList(pageNo) {

            if (angular.isUndefined($scope.selectedTaskQueue) || angular.isUndefined($scope.selectedQueue) || angular.isUndefined($scope.selectedQueue.Key))
                return;

            if (angular.isUndefined($scope.pageNo))
                $scope.pageNo = 1;
            else
                $scope.pageNo = pageNo;

            var action = function () { return tasksWebApi.loadTaskList($scope.selectedTaskQueue.TaskQueueName, $scope.selectedTaskQueue.RoleId, $scope.selectedQueue.Key, $scope.pageNo); };
            var resultAction = function (data) {
                var fields = taskApplicationRepository.getTaskDisplayFields(determineApplicationFromPath(), $scope.selectedTaskQueue.TaskQueueName);


                $scope.taskQueueFields = fields;

                $scope.selectedQueueData = tasksWebApi.filter(data.Results);
                $scope.totalItems = data.TotalResultCount;
                $scope.itemsPerPage = data.PageSize;
            };

            uiLoader.UseWithLoader($scope, action, resultAction);
        }

        function navigateToTask(taskId, queue) {

            var taskQueueName = queue == null ? $scope.selectedTaskQueue.TaskQueueName : queue.TaskQueueName;
            var route = taskApplicationRepository.getRoute(determineApplicationFromPath(), taskQueueName);
            $location.path(route + taskId);
        };

        function getTaskBasket() {
            uiLoader.UseWithLoader($scope, tasksWebApi.getTaskBasket, function (data) {
                $scope.userBaskets = data;

                if (data.length == 1) {
                    $scope.selectRole(data[0]);
                } else {
                    var firstActiveRole = getFirstActiveRole(data);
                    $scope.selectRole(firstActiveRole);
                }
            });
        }

        function getFirstActiveRole(roles) {
            var activerole;
            roles.forEach(function (role) {
                role.TaskBaskets.forEach(function (basket) {
                    if (basket.TaskResponsibilityId != 7) {
                        activerole = role;
                    };
                });
            });
            return activerole;
        }

        function loadQueueList() {
            if (angular.isUndefined($scope.selectedTaskQueue) || $scope.selectedTaskQueue == null) {
                return;
            }
            uiLoader.UseWithLoader($scope, function () { return tasksWebApi.loadQueueList($scope.selectedTaskQueue.TaskQueueName, $scope.selectedTaskQueue.RoleId); }, function (data) {
                $scope.taskStatusList = taskService.filterQueue(determineApplicationFromPath(), data, $scope.teamMember.Role);
            });
        }

        var success = function (data) {
            addHistoryItem('Home', clearSelectedRole, "Home");
            $scope.teamMember = data;
            getTaskBasket();
        };

        var error = function (errData) {
            if (errData.status != 500) {
                httpResponseService.HandleCustomError(errData.status, errData.data);
                $location.path("/" + determineApplicationFromPath());

                return;
            }

            alert("You currently have no roles assigned, please contact an administrator.");
            $location.path("/" + determineApplicationFromPath());

        };

        uiLoader.UseWithLoader($scope, tasksWebApi.getTeamMember, success, error);
    }

    dashBoardController.$inject = [
        '$scope', '$location', 'uiLoader', 'Clientele.WorkFlowServices.Tasks.Services.WebApiService',
        'Clientele.WorkFlowServices.Tasks.Services.ApplicationService', 'Clientele.WorkFlowServices.Tasks.Services.ApplicationRepository', 'applicationId', 'unityApplicationRepository', 'httpResponseService'];

    var advancedDashboardController = function ($scope, $location, uiLoader, tasksWebApi, taskService, taskApplicationRepository, applicationId, unityApplicationRepository, httpResponseService) {

        $scope.team = {};

        var determineApplicationFromPath = function () {
            var splitPath = $location.$$path.split("/");

            if (splitPath.length > 0) {
                var applicationKey = splitPath[1];
                return applicationKey.toLowerCase();
            }

            return "";
        };

        $scope.tasks = [];
        $scope.currentPage = 0;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 0;
        $scope.availableCount = 0;
        // $scope.taskService = taskService;

        $scope.breadcrumbList = [];

        $scope.buildHistoryItems = function () {
            $scope.historyItems = $scope.breadcrumbList.slice(0, $scope.breadcrumbList.length - 1);
            $scope.activeBreadCrumb = $scope.breadcrumbList[$scope.breadcrumbList.length - 1];
        }

        $scope.activateBreadCrumb = function (item) {
            item.Action();

            var index = $scope.breadcrumbList.indexOf(item);
            $scope.breadcrumbList = $scope.breadcrumbList.slice(0, index + 1);
            $scope.buildHistoryItems();
        }

        $scope.refresh = function () {
            if ($scope.activeBreadCrumb.Refresh == null)
                return;

            $scope.activeBreadCrumb.Refresh();
        }

        function addHistoryItem(name, backAction, level, refreshAction) {

            if ($scope.breadcrumbList.length > 0 && $scope.breadcrumbList[$scope.breadcrumbList.length - 1].Level == level) {
                $scope.breadcrumbList[$scope.breadcrumbList.length - 1] = { Name: name, Action: backAction, Level: level, Refresh: refreshAction };
            }
            else
                $scope.breadcrumbList.push({
                    Name: name, Action: backAction, Level: level, Refresh: refreshAction
                });

            $scope.buildHistoryItems();
        }

        $scope.availableTasks = function () {
            return $scope.availableCount > 0;
        };

        $scope.hasItems = function (item) {
            return item.Total > 0;
        };

        $scope.hasNoItems = function (item) {
            return item.Total == 0;
        };

        $scope.taskQueueHasItems = function (item) {
            return item.ActiveCount > 0;
        };

        $scope.taskQueueHasNoItems = function (item) {
            return item.ActiveCount == 0;
        };

        $scope.postponeTask = function (item) {
            taskService.postponeTask(item);
        };

        $scope.getFieldValue = function (array, key) {
            return taskService.getFieldByKey(array, key);
        };

        $scope.claimTask = function (queue) {
            uiLoader.UseWithLoader($scope, function () { return tasksWebApi.claimTask(queue.TaskQueueName); }, function (data) {
                navigateToTask(data.TaskId, queue);
            });
        };

        $scope.setPage = function (pageNo) {

            if ($scope.selectedQueue == {} || pageNo == 0)
                return;

            loadTaskList(pageNo);
        };

        $scope.shouldShowTaskList = function () {
            return $scope.selectedQueue != null && $scope.selectedQueueData != undefined && $scope.selectedQueueData.length > 0;
        };

        $scope.shouldShowEmptyTaskList = function () {
            return $scope.selectedQueue != null && ($scope.selectedQueueData == undefined || $scope.selectedQueueData.length == undefined || $scope.selectedQueueData.length == 0);
        };

        $scope.noWorkForQueue = function () {
            return $scope.selectedQueueData.length == 0 && $scope.selectedQueue != {};
        };

        $scope.selectTask = function (task) {
            navigateToTask(task.Id);
        };

        //$scope.isSelected = function (value) {
        //    return value == $scope.selectedQueue.Key;
        //};

        $scope.selectQueue = function (queue) {
            $scope.selectedQueue = queue;
            loadTaskList(1);
            addHistoryItem(queue.Status, clearSelectedTaskQueue, "Queue");
        };

        $scope.selectTaskQueue = function (item) {
            $scope.selectedTaskQueue = item;
            loadQueueList();
            addHistoryItem(item.TaskTemplateName, clearSelectedTaskQueueData, "TaskQueue");
        };

        $scope.selectRole = function (item) {
            navigateToRole(item);
        };

        function loadTaskList(pageNo) {

            if (angular.isUndefined($scope.selectedQueue) || $scope.selectedQueue == "")
                return;

            if (angular.isUndefined($scope.pageNo)) {
                $scope.pageNo = 1;
            } else {
                $scope.pageNo = pageNo;
            }

            var selectedQueue = $scope.selectedQueue.Key;
            var action = function () {
                return tasksWebApi.loadOwnerTaskList($scope.selectedTaskQueue.TaskQueueName, selectedQueue, pageNo, $scope.selectedTeamMember.UserId, $scope.selectedTaskQueue.RoleId);
            };
            var resultAction = function (data) {
                $scope.selectedQueueData = tasksWebApi.filter(data.Results);

                var fields = taskApplicationRepository.getTaskDisplayFields(determineApplicationFromPath(), $scope.selectedTaskQueue.TaskQueueName);
                $scope.taskQueueFields = fields;

                $scope.totalItems = data.TotalResultCount;
                $scope.itemsPerPage = data.PageSize;
                addHistoryItem($scope.selectedQueue.Status, clearSelectedTaskQueue, "Queue");
            };

            uiLoader.UseWithLoader($scope, action, resultAction);
        }

        function navigateToTask(taskId, queue) {

            var taskQueueName = queue == null ? $scope.selectedTaskQueue.TaskQueueName : queue.TaskQueueName;
            var route = taskApplicationRepository.getRoute(determineApplicationFromPath(), taskQueueName);
            $location.path(route + taskId);
        };

        //function getTaskBasket() {
        //    uiLoader.UseWithLoader($scope, tasksWebApi.getTaskBasket, function (data) {
        //        $scope.userBaskets = data;

        //        if (data.length == 1)
        //            $scope.selectRole(data[0]);
        //    });
        //}

        function navigateToRole(item) {
            $scope.selectedRole = item;
            addHistoryItem(item.Role, clearSelectedTaskQueue, "Role");
        };

        $scope.selectTeam = function (team) {
            $scope.selectedTeam = team;
            addHistoryItem(team.Name, clearSelectedTeamMember, "Team");
            $scope.selectedTeamMembers = Enumerable.From(team.TeamMembers).Where(function (x) {
                return x.IsActive && !x.IsDeleted;
            }).ToArray();
        };

        function navigateToBasketsDirectly(roleList) {
            return roleList.length === 1;
        }


        function loadTaskTemplateList() {
            uiLoader.UseWithLoader($scope, function () {
                return tasksWebApi.loadOwnerTaskQueueList($scope.selectedTeamMember.UserId);
            }, function (data) {
                $scope.userBaskets = data;
                if (navigateToBasketsDirectly(data)) {
                    navigateToRole(data[0]);
                }
            });
        }

        $scope.viewTasksByTeamMember = function (user) {
            $scope.selectedTeamMember = user;
            addHistoryItem(user.Name, clearSelectedRole, "TeamMember");
            loadTaskTemplateList();
        };

        function clearSelectedTaskQueueData() {
            $scope.selectedQueueData = null;
            $scope.selectedQueue = null;
        };

        function clearSelectedTaskQueue() {
            $scope.selectedTaskQueue = null;
            clearSelectedTaskQueueData();
        };

        function clearSelectedRole() {
            $scope.selectedRole = null;
            clearSelectedTaskQueue();
        };

        function clearSelectedTeamMember() {
            $scope.selectedTeamMember = null;
            clearSelectedRole();
        };
        function clearSelectedTeam() {
            $scope.selectedTeam = null;
            clearSelectedTeamMember();
        };

        function loadQueueList() {
            if (angular.isUndefined($scope.selectedTaskQueue) || $scope.selectedTaskQueue == null) {
                return;
            }

            uiLoader.UseWithLoader($scope, function () {
                return tasksWebApi.loadOwnerQueueList($scope.selectedTaskQueue.TaskQueueName, $scope.selectedTeamMember.UserId, $scope.selectedTaskQueue.RoleId);
            }, function (data) {
                $scope.taskStatusList = taskService.filterQueue(determineApplicationFromPath(), data, $scope.teamMember.Role);
                addHistoryItem($scope.selectedTaskQueue.TaskTemplateName, clearSelectedTaskQueueData, "TaskQueue");

            });
        }

        var success = function (data) {
            addHistoryItem('Home', clearSelectedRole, "Home");
            $scope.teamMember = data;
            uiLoader.UseWithLoader($scope, tasksWebApi.getTeam, function (data) {
                $scope.team = data;
                addHistoryItem("Home", clearSelectedTeam, "Home");
            });
        };

        var error = function (errData) {
            if (errData.status != 500) {
                httpResponseService.HandleCustomError(errData.status, errData.data);
                $location.path("/" + determineApplicationFromPath());

                return;
            }

            alert("You currently have no roles assigned, please contact an administrator.");
            $location.path("/" + determineApplicationFromPath());

        };

        uiLoader.UseWithLoader($scope, tasksWebApi.getTeamMember, success, error);
    }

    advancedDashboardController.$inject = [
        '$scope', '$location', 'uiLoader', 'Clientele.WorkFlowServices.Tasks.Services.WebApiService',
        'Clientele.WorkFlowServices.Tasks.Services.ApplicationService', 'Clientele.WorkFlowServices.Tasks.Services.ApplicationRepository', 'applicationId', 'unityApplicationRepository', 'httpResponseService'];


    var unassignedTasksController = function ($scope, $location, uiLoader, tasksWebApi, taskService, taskApplicationRepository, applicationId, unityApplicationRepository, httpResponseService) {

        $scope.team = {};

        var determineApplicationFromPath = function () {
            var splitPath = $location.$$path.split("/");

            if (splitPath.length > 0) {
                var applicationKey = splitPath[1];
                return applicationKey.toLowerCase();
            }

            return "";
        };

        $scope.taskService = taskService;
        $scope.selectedRole = null;
        $scope.selectedTeamMember = null;
        $scope.ownerStatusList = {};
        $scope.taskStatusList = {};
        $scope.selectedQueueData = null;
        $scope.selectedQueue = null;
        $scope.currentPage = 0;
        $scope.maxSize = 5;
        $scope.itemsPerPage = 0;
        $scope.availableCount = 0;
        $scope.selectUserId = "";
        $scope.selectedUnassignedQueue = null;
        $scope.selectedUnassignedQueueData = [];
        $scope.selectedTaskTemplate = null;
        $scope.selectedTaskQueue = null;
        // $scope.taskService = taskService;

        $scope.breadcrumbList = [];

        $scope.buildHistoryItems = function () {
            $scope.historyItems = $scope.breadcrumbList.slice(0, $scope.breadcrumbList.length - 1);
            $scope.activeBreadCrumb = $scope.breadcrumbList[$scope.breadcrumbList.length - 1];
        }

        $scope.activateBreadCrumb = function (item) {
            item.Action();

            var index = $scope.breadcrumbList.indexOf(item);
            $scope.breadcrumbList = $scope.breadcrumbList.slice(0, index + 1);
            $scope.buildHistoryItems();
        };

        $scope.refresh = function () {
            if ($scope.activeBreadCrumb.Refresh == null)
                return;

            $scope.activeBreadCrumb.Refresh();
        }

        function addHistoryItem(name, backAction, level, refreshAction) {

            if ($scope.breadcrumbList.length > 0 && $scope.breadcrumbList[$scope.breadcrumbList.length - 1].Level == level) {
                $scope.breadcrumbList[$scope.breadcrumbList.length - 1] = { Name: name, Action: backAction, Level: level, Refresh: refreshAction };
            }
            else
                $scope.breadcrumbList.push({
                    Name: name, Action: backAction, Level: level, Refresh: refreshAction
                });

            $scope.buildHistoryItems();
        }

        $scope.availableTasks = function () {
            return $scope.availableCount > 0;
        };

        $scope.hasItems = function (item) {
            return item.Total > 0;
        };

        $scope.hasNoItems = function (item) {
            return item.Total == 0;
        };

        $scope.taskQueueHasItems = function (item) {
            return item.ActiveCount > 0;
        };

        $scope.taskQueueHasNoItems = function (item) {
            return item.ActiveCount == 0;
        };

        $scope.postponeTask = function (item) {
            taskService.postponeTask(item);
        };

        $scope.getFieldValue = function (array, key) {
            return taskService.getFieldByKey(array, key);
        };

        $scope.claimTask = function (queue) {
            uiLoader.UseWithLoader($scope, function () { return tasksWebApi.claimTask(queue.TaskQueueName); }, function (data) {
                navigateToTask(data.TaskId, queue);
            });
        };

        $scope.setPage = function (pageNo) {

            if ($scope.selectedQueue == {} || pageNo == 0)
                return;

            loadTaskList(pageNo);
        };

        $scope.shouldShowTaskList = function () {
            return $scope.selectedQueue != null && $scope.selectedQueueData != undefined && $scope.selectedQueueData.length > 0;
        };

        $scope.shouldShowEmptyTaskList = function () {
            return $scope.selectedQueue != null && ($scope.selectedQueueData == undefined || $scope.selectedQueueData.length == undefined || $scope.selectedQueueData.length == 0);
        };

        $scope.noWorkForQueue = function () {
            return $scope.selectedQueueData.length == 0 && $scope.selectedQueue != {};
        };

        $scope.selectTask = function (task) {
            navigateToTask(task);
        };

        //$scope.isSelected = function (value) {
        //    return value == $scope.selectedQueue.Key;
        //};

        $scope.selectQueue = function (queue) {
            $scope.selectedQueue = queue;
            loadTaskList(1);
            addHistoryItem(queue.Status, clearSelectedTaskQueue, "Queue");
        };

        $scope.selectTaskQueue = function (item) {
            $scope.selectedTaskQueue = item;
            loadQueueList();
            addHistoryItem(item.TaskTemplateName, clearSelectedTaskQueueData, "TaskQueue");
        };

        $scope.selectRole = function (item) {
            $scope.selectedRole = item;
            addHistoryItem(item.Role, clearSelectedTaskQueue, "Role");
        };

        $scope.selectUnassignedQueue = function (queue) {
            $scope.selectedTaskTemplate = queue.TaskQueueName;
            $scope.selectUnassignedQueueName = queue.TaskTemplateName;
            var action = function () {
                return tasksWebApi.loadUnassignedTasks(queue.TaskQueueName);
            };
            var success = function (data) {
                $scope.selectedUnAssignedTaskQueue = taskService.filterQueue(determineApplicationFromPath(), data, 'Unassigned');
                addHistoryItem(queue.TaskTemplateName, clearSelectedTaskQueueData, "TaskQueue");
            };

            uiLoader.UseWithLoader($scope, action, success);
        };

        $scope.shouldShowUnassignedQueue = function () {
            if ($scope.selectedUnassignedQueueData == null) {
                return false;
            }
            return $scope.selectedUnassignedQueue != undefined && $scope.selectedUnassignedQueueData.length > 0;
        };

        $scope.shouldShowEmptyTaskList = function () {
            if ($scope.selectedUnassignedQueueData == null) {
                return false;
            }
            return $scope.selectedUnassignedQueue != null && ($scope.selectedUnassignedQueueData.length == undefined || $scope.selectedUnassignedQueueData.length == 0);
        };


        function loadUnassignedTaskList(pageNo) {

            if ((angular.isUndefined($scope.selectedTaskTemplate) || $scope.selectedTaskTemplate == null) || angular.isUndefined($scope.selectedUnassignedQueue) || $scope.selectedUnassignedQueue === "")
                return;
            if (angular.isUndefined(pageNo) && angular.isUndefined($scope.pageNo)) {
                $scope.pageNo = 1;
            }
            if (!angular.isUndefined(pageNo))
                $scope.pageNo = pageNo;

            var selectedUnassignedQueue = $scope.selectedUnassignedQueue;

            var action = function () {
                return tasksWebApi.loadUnassignedTaskList($scope.selectedUnassignedQueue.Key, $scope.pageNo, $scope.selectedTaskTemplate);
            };

            var resultAction = function (data) {
                $scope.selectedUnassignedQueueData = tasksWebApi.filter(data.Results);

                var fields = taskApplicationRepository.getTaskDisplayFields(determineApplicationFromPath(), $scope.selectedTaskTemplate);
                $scope.taskQueueFields = fields;

                $scope.totalUnassignedItems = data.TotalResultCount;
                $scope.itemsPerPage = data.PageSize;
                addHistoryItem(selectedUnassignedQueue.Status, clearSelectedTaskQueue, "Queue");
            };

            uiLoader.UseWithLoader($scope, action, resultAction);
        }

        $scope.setUnassignedPage = function (pageNo) {
            if ($scope.selectedUnassignedQueue === "" || pageNo === 0)
                return;

            loadUnassignedTaskList(pageNo);
        }

        $scope.selectUnassignedQueueList = function (item, pageNo) {
            $scope.selectedUnassignedQueue = item;

            if ($scope.selectedUnassignedQueue == "" || pageNo == 0)
                return;
            loadUnassignedTaskList(pageNo);
        };

        function navigateToTask(task) {
            var route = taskApplicationRepository.getRoute(determineApplicationFromPath(), task.TaskQueue);
            $location.path(route + task.Id);
        };

        function clearSelectedTaskQueueData() {
            $scope.selectedUnassignedQueue = null;
            $scope.selectedUnassignedQueueData = null;
        };

        function clearSelectedTaskQueue() {
            $scope.selectedTaskQueue = null;
            $scope.selectedUnAssignedTaskQueue = null;
            $scope.selectedQueue = null;
            clearSelectedTaskQueueData();
        };

        function clearSelectedRole() {
            $scope.selectedRole = null;
            clearSelectedTaskQueue();
        };

        function clearSelectedTeamMember() {
            $scope.selectedTeamMember = null;
            clearSelectedRole();
        };
        function clearSelectedTeam() {
            $scope.selectedTeam = null;
            clearSelectedTeamMember();
        };

        function loadQueueList() {
            if (angular.isUndefined($scope.selectedTaskQueue) || $scope.selectedTaskQueue == null) {
                return;
            }

            uiLoader.UseWithLoader($scope, function () {
                return tasksWebApi.loadOwnerQueueList($scope.selectedTaskQueue.TaskQueueName, $scope.selectedTeamMember.UserId, $scope.selectedTaskQueue.RoleId);
            }, function (data) {
                $scope.taskStatusList = taskService.filterQueue(determineApplicationFromPath(), data, $scope.teamMember.Role);
                addHistoryItem($scope.selectedTaskQueue.TaskTemplateName, clearSelectedTaskQueueData, "TaskQueue");
            });
        }

        var success = function (data) {
            addHistoryItem('Home', clearSelectedRole, "Home");
            $scope.teamMember = data;
            uiLoader.UseWithLoader($scope, tasksWebApi.getTeam, function (data) {
                $scope.team = data;
                addHistoryItem("Home", clearSelectedTeam, "Home");
            });
        };

        var error = function (errData) {
            if (errData.status != 500) {
                httpResponseService.HandleCustomError(errData.status, errData.data);
                $location.path("/" + determineApplicationFromPath());

                return;
            }

            alert("You currently have no roles assigned, please contact an administrator.");
            $location.path("/" + determineApplicationFromPath());

        };

        function getTaskBasket() {
            uiLoader.UseWithLoader($scope, tasksWebApi.getTaskBasket, function (data) {
                addHistoryItem('Home', clearSelectedRole, "Home");

                $scope.userBaskets = data;

                if (data.length === 1)
                    $scope.selectRole(data[0]);
            });
        }

        function loadUnassignedQueueList() {
            getTaskBasket();
        }

        function loadData() {
            loadUnassignedQueueList();
        }

        loadData();
    }

    unassignedTasksController.$inject = [
        '$scope', '$location', 'uiLoader', 'Clientele.WorkFlowServices.Tasks.Services.WebApiService',
        'Clientele.WorkFlowServices.Tasks.Services.ApplicationService', 'Clientele.WorkFlowServices.Tasks.Services.ApplicationRepository', 'applicationId', 'unityApplicationRepository', 'httpResponseService'];


    angular.module('Clientele.WorkFlowServices.Tasks.Controllers', [])
        .controller("WorkflowServices.Tasks.Controllers.DashboardController", dashBoardController)
        .controller("WorkflowServices.Tasks.Controllers.AdvancedDashboardController", advancedDashboardController)
        .controller("WorkflowServices.Tasks.Controllers.UnassignedTaskController", unassignedTasksController)
        .controller('WorkflowServices.Tasks.Controllers.TaskActionController', [
            '$scope',
            '$location',
            '$routeParams',
            '$rootScope',
            'recordStoreApplicationApiUrl',
            'Clientele.WorkFlowServices.Tasks.Services.ApplicationService',
            'uiLoader',
            'eventBroadcastingService',
            'Clientele.WorkFlowServices.Tasks.ModalService',
            'Clientele.WorkFlowServices.Tasks.Services.WebApiService',
            'Clientele.WorkFlowServices.Tasks.Services.ApplicationRepository',
            function ($scope,
                $location,
                $routeParams,
                $rootScope,
                recordStoreApplicationApiUrl,
                taskService,
                uiLoader,
                eventBroadcastingService,
                taskModalService,
                taskWebApi,
                taskApplicationRepository
                ) {
                $scope.isCurrentOwner = false;
                $scope.CanGetNextTask = false;

                $scope.taskService = taskService;

                var determineApplicationFromPath = function () {
                    var splitPath = $location.$$path.split("/");

                    if (splitPath.length > 0) {
                        var applicationKey = splitPath[1];
                        return applicationKey.toLowerCase();
                    }
                };

                function navigateToTask(taskId, queue) {
                    var taskQueueName = queue
                    var route = taskApplicationRepository.getRoute(determineApplicationFromPath(), taskQueueName);
                    $location.path(route + taskId);
                };

                $scope.ClaimNextTask = function () {
                    var template = $scope.task.TaskTemplateId;

                    uiLoader.UseWithLoader($scope, function () {
                        return taskWebApi.loadTaskCountForQueue($scope.task.TaskQueue, 'Available');
                    },
                    function (taskQueueData) {
                        if (taskQueueData === 0 || taskQueueData === "0") {
                            alert("There are currently no more of this task type to get");
                            $scope.CanGetNextTask = false;
                            return;
                        }

                        uiLoader.UseWithLoader($scope, function () { return taskWebApi.claimTask($scope.task.TaskQueue); }, function (data) {
                            navigateToTask(data.TaskId, $scope.task.TaskQueue);
                        });
                    });
                }

                var claimTaskAction = function () {
                    return taskService.claimTask($scope.task);
                };

                var acceptTaskAction = function () {
                    return taskService.acceptTask($scope.task.Id);
                };

                var resumeTaskAction = function () {
                    return taskService.resumeTask($scope.task.Id);
                };

                var customTasks = [];
                customTasks.push({
                    Label: "Save",
                    Action: function (task) {
                        alert(task.Id);
                    },
                    CanPerformAction: function (task) {
                        return true;
                    }
                });

                $scope.customTasks = customTasks;

                $scope.$on("Clientele.WorkflowServices.ClaimSuccess", function () {
                    loadTask();
                });

                $scope.$on("Clientele.WorkflowServices.AcceptSuccess", function () {
                    loadTask();
                });

                $scope.$on("Clientele.WorkflowServices.ResumeSuccess", function () {
                    loadTask();
                });

                $scope.$on("Clientele.WorkflowServices.AfterPostponeTaskComplete", function () {
                    loadTask();
                });

                $scope.$on("Clientele.WorkflowServices.RevokeSuccess", function () {
                    loadTask();
                });

                $scope.$on("Clientele.WorkflowServices.DelegateSuccess", function () {
                    loadTask();
                });

                $scope.$on("Clientele.WorkflowServices.AssignSuccess", function () {
                    loadTask();
                });

                function configureAvailableActions(permittedActions) {
                    $scope.canSubmit = taskService.userCanPerformTask(permittedActions, 'Submit');

                    var allowedActions = { allowedActionCount: 0 };
                    $scope.canClaim = taskService.userCanPerformTask(permittedActions, 'Claim', allowedActions);
                    $scope.canPostpone = taskService.userCanPerformTask(permittedActions, 'Postpone', allowedActions);
                    $scope.canAccept = taskService.userCanPerformTask(permittedActions, 'Accept', allowedActions);
                    $scope.canRevoke = taskService.userCanPerformTask(permittedActions, 'Revoke', allowedActions);
                    $scope.canResume = taskService.userCanPerformTask(permittedActions, 'Resume', allowedActions);
                    $scope.canAssign = taskService.userCanPerformTask(permittedActions, 'Assign', allowedActions);
                    $scope.canDelegate = taskService.userCanPerformTask(permittedActions, 'Delegate', allowedActions);
                    $scope.canClose = taskService.userCanPerformTask(permittedActions, 'Close', allowedActions);

                    $scope.allowedActionCount = allowedActions.allowedActionCount;
                }

                function loadTask() {
                    var action = function () { return taskService.loadTask($routeParams.taskId); };

                    uiLoader.UseWithLoader($scope, action, function (data) {
                        $scope.isReadonly = data.Status != "In Progress";
                        $scope.task = data;

                        if ($scope.task.Finalized) {
                            $scope.CanGetNextTask = true;
                        }

                        uiLoader.UseWithLoader($scope, taskService.getTeamMember, function (memberData) {

                            var x = memberData;

                            if (data.OwnerId === $rootScope.userId) {
                                $scope.isCurrentOwner = true;
                            }

                            $scope.pdfUrl = "/Scripts/UI/jsPDF/web/viewer.html?token=" + $rootScope.BearerToken + "&file=" + recordStoreApplicationApiUrl + "/RecordFile/" + $scope.task.ResourceId;
                        });

                        configureAvailableActions(data.PermittedActions);
                    });
                }


                var init = function () {

                    var action = function () { return taskService.loadTask($routeParams.taskId); };

                    var memberAction = function () {
                        return taskWebApi.getTeamMember();
                    };

                    var memberSuccess = function (memberData) {
                        if ($scope.OwnerId === memberData.Id) {
                            $scope.isCurrentOwner = true;
                        }
                    };

                    uiLoader.UseWithLoader($scope, action, function (data) {
                        $scope.isReadonly = data.Status !== "In Progress";
                        $scope.task = data;
                        $scope.OwnerId = data.OwnerId;

                        console.log($scope.task);

                        if ($scope.task.Finalized) {
                            $scope.CanGetNextTask = true;
                        }

                        uiLoader.UseWithLoader($scope, memberAction, memberSuccess);

                        configureAvailableActions(data.PermittedActions);

                        eventBroadcastingService.broadcastEvent("Clientele.WorkflowServices.TaskLoaded", data);
                    });
                };

                init();

                $scope.ShowCustomMenu = function (actionMenuLabel) {
                    if ((actionMenuLabel != undefined && actionMenuLabel !== "") && $scope.allowedActionCount > 0
                        && !$scope.canClaim && !$scope.canAssign && !$scope.canAccept && !$scope.canResume && $scope.isCurrentOwner) {
                        return true;
                    }
                    return false;
                }
            }
        ])
    .controller('WorkflowServices.Tasks.Controllers.CloseTaskModalController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.header = 'Close Task';
        $scope.label = 'Comment';
        $scope.model = {};
        $scope.model.Reasons = model.Reasons;

        $scope.ok = function () {
            $modalInstance.close({ comment: $scope.model.InputValue, reason: $scope.model.Reason.Id });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('WorkflowServices.Tasks.Controllers.TaskOwnershipModalController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.model = model;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('WorkflowServices.Tasks.Controllers.StatusHistoryModalController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.model = model;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('WorkflowServices.Tasks.Controllers.TaskCommentsController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.model = { Comments: model };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('WorkflowServices.Tasks.Controllers.DelegateTaskModalController', ['$scope', '$modalInstance', 'model', 'ajaxJsonService', function ($scope, $modalInstance, model, ajaxJsonService) {

        $scope.teams = {};

        $scope.selectTeam = function () {
            $scope.selectedTeamMembers = $scope.model.selectedTeam.TeamMembers;
        };

        ajaxJsonService.Get(model.ResourceUri).then(function (data) {
            $scope.teams = data.data;
        });

        $scope.header = 'Delegate Task';
        $scope.label = 'Comment';
        $scope.model = {};
        $scope.model.Reasons = model.Reasons;

        $scope.ok = function () {
            $modalInstance.close({ comment: $scope.model.InputValue, reason: $scope.model.Reason.Id, userId: $scope.model.selectedUser.Id });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('WorkflowServices.Tasks.Controllers.CommentModalController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.header = model.Header;

        $scope.label = model.Label;
        $scope.model = model;

        $scope.ok = function () {
            $modalInstance.close($scope.model.comment);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('Clientele.Tasks.Controllers.PostponeCaptureTaskController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.model = {};
        $scope.model.Comment = "";

        $scope.Reasons = model.Reasons;
        $scope.model.Reason = $scope.Reasons[0];
        $scope.model.Date = new Date();
        $scope.model.Time = new Date();
        $scope.minDate = new Date();

        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.dateTimeChanged = function () {
            $scope.model.datetime = new Date($scope.model.Date.getFullYear(), $scope.model.Date.getMonth(), $scope.model.Date.getDate(),
                $scope.model.Time.getHours(), $scope.model.Time.getMinutes(), 0);
        };

        $scope.save = function () {
            $modalInstance.close({ DateTime: $scope.model.datetime, Comment: $scope.model.Comment, Reason: $scope.model.Reason.Id });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('WorkflowServices.Tasks.Controllers.GenericInputModalController', ['$scope', '$modalInstance', 'model', function ($scope, $modalInstance, model) {

        $scope.header = model.Header;
        $scope.label = model.Label;
        $scope.model = model;

        $scope.ok = function () {
            $modalInstance.close($scope.model.InputValue);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]).controller('WorkflowServices.Tasks.Controllers.AssignTaskModalController', ['$scope', '$modalInstance', 'model', 'ajaxJsonService', function ($scope, $modalInstance, model, ajaxJsonService) {

        $scope.header = model.Header;
        $scope.teams = {};

        $scope.selectTeam = function () {
            $scope.selectedTeamMembers = $scope.model.selectedTeam.TeamMembers;
        };

        ajaxJsonService.Get(model.ResourceUri).then(function (data) {
            $scope.teams = data.data;
        });

        $scope.label = model.Label;
        $scope.model = model;

        $scope.ok = function () {
            $modalInstance.close($scope.model.selectedUser.Id);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);


})();

//    , 'Clientele.ApplicationFormsCapture.Common.Services.TaskService'
//    , 'Clientele.ApplicationFormsCapture.Services.RouteManager'
//    , 'Clientele.ApplicationFormsCapture.Services.TeamMemberService'
//    , 'Clientele.ApplicationFormsCapture.Services.LocationService'


