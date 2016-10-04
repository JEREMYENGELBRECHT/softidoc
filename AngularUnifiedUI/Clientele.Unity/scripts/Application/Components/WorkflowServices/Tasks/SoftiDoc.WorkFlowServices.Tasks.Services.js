/**********************************************************************************************/
(function () {
    angular.module('SoftiDoc.WorkFlowServices.Tasks.Services', [])
        .service('SoftiDoc.WorkFlowServices.Tasks.Services.ApplicationService',
        [
            'SoftiDoc.WorkFlowServices.Tasks.Services.ApplicationRepository',
            'SoftiDoc.WorkFlowServices.Tasks.SharedData',
            'eventBroadcastingService',
            'ajaxJsonService',
            'workflowServicesManagementApiService',
            'SoftiDoc.WorkFlowServices.Tasks.ModalService',
            '$filter', '$route',

            function (tasksApplicationRepository, sharedTaskData, eventBroadcastingService, ajaxJsonService, workflowServicesManagementApiService, modalService, $filter, $route) {

                //var configuration = applicationHost.retrieveApplicationConfigurationById('SoftiDoc.ApplicationFormsCapture');
                var sourceUrl = "";//configuration.UnityUrl;

                function filterDate(data) {

                    Enumerable.From(data).ForEach(function (x) {
                        x.DisplayMetadata = angular.fromJson(x.DisplayMetadata);
                        x.Created = $filter('date')(x.Created, 'dd-MM-yyyy h:mm a');
                        x.Modified = $filter('date')(x.Modified, 'dd-MM-yyyy h:mm a');
                    });

                    return data;
                }

                function userCanPerformTask(permittedActions, task, allowedActionCount) {
                    var result = Enumerable.From(permittedActions).Any(function (x) {
                        return getTaskAction(task).Key == x;
                    });

                    if (allowedActionCount != null && result)
                        allowedActionCount.allowedActionCount++;

                    return result;
                }

                function getTaskAction(actionName) {
                    return Enumerable.From(sharedTaskData.TaskActions).FirstOrDefault({ Name: 'Unknown', Key: 0 }, function (x) {
                        return x.Name == actionName;
                    });
                };

                function delegateTask(taskId, comment, reason, userId) {
                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionStarted');
                    ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'TaskOwnership/' + taskId + '/Delegate', { OwnerId: userId, Comment: comment, Reason: reason })
                            .then(function (result) {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.DelegateSuccess', result);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Delegate Task', message: 'Task Was Delegated Successfully.', Success: "success" });
                                $route.reload();
                            })
                            .catch(function (result) {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.DelegateFailed', result);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Delegate Task', message: 'Task Delegation Failed.', Success: "error" });
                            });
                }

                function closeTask(formId, comment, reason, taskTemplateId, taskId) {
                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionStarted');
                    ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Tasks/Skip/' + taskId + '/Skip', { Comment: comment, Reason: reason, TaskId: taskId })
                            .then(function (result) {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.CloseSuccess', result);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Close Task', message: 'Task Was Closed Successfully.', Success: "success" });
                                $route.reload();
                            })
                            .catch(function (result) {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.CloseFailed', result);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Close Task', message: 'Close Task Failed.', Success: "error" });
                            });
                }

                function revokeTask(taskId, comment) {

                    var workFlowUrl = workflowServicesManagementApiService.getWorkflowApiUrl();

                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionStarted');
                    ajaxJsonService.Post(workFlowUrl + 'TaskOwnership/' + taskId + '/Revoke', { Comment: comment })
                            .then(function (result) {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.RevokeSuccess', result);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Task Revoke', message: 'Task Was Revoked Successfully.', Success: "success" });
                                $route.reload();
                            })
                            .catch(function (result) {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlow.Tasks.RevokeFailed', result);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Task Revoke', message: 'Task Revoke Failed.', Success: "error" });
                            });
                }

                function filterQueue(applicationId, data, role) {

                    var queues = tasksApplicationRepository.getQueues(applicationId);

                    var availableQueue = Enumerable.From(queues).First(function (x) {
                        return x.Role == role;
                    });

                    var result = Enumerable.From(data).Where(function (x) {
                        return availableQueue.Queues.indexOf(x.Status) > -1;
                    }).ToArray();

                    Enumerable.From(result).ForEach(function (x) {
                        Enumerable.From(availableQueue.Queues).ForEach(function (y, index) {
                            if (y == x.Status) {
                                x.Order = index;
                            }
                        });
                    });

                    return result;
                }

                function addComment(taskId) {
                    modalService.showCommentModal("Comment", "Comment", function (result) { saveComment(taskId, result); }, 'static');
                }

                function saveComment(taskId, result) {
                    ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'SaveComment/' + taskId, { Comment: result }).then(function () {
                        eventBroadcastingService.broadcastEvent('UINotify', { title: 'Task Comment', message: 'Task Comment Added.', Success: "success" });
                    }).catch(function () {
                        eventBroadcastingService.broadcastEvent('UINotify', { title: 'Task Comment', message: 'Task Comment Failed.', Success: "error" });
                    });
                };

                function postponeTask(taskId, dateTime, comment, reason) {
                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkFlowServices.TaskActionStarted');

                    ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Tasks/Postpone/' + taskId + '/Postpone', { DueDate: dateTime, Comment: comment, Reason: reason })
                        .then(function () {
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.AfterPostponeTaskComplete', null);
                            eventBroadcastingService.broadcastEvent('UINotify', { title: 'Postpone Task', message: 'Postpone Task Success.', Success: "success" });
                            $route.reload();
                        })
                        .catch(function () {
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.AfterPostponeTaskComplete', null);
                            eventBroadcastingService.broadcastEvent('UINotify', { title: 'Postpone Task', message: 'Postpone Task Failed.', Success: "error" });
                        });
                }

                return {
                    userCanPerformTask: function (permittedActions, task, allowedActionCount) {
                        return userCanPerformTask(permittedActions, task, allowedActionCount);
                    },
                    callcentreRevoke: function (taskId) {
                        revokeTask(taskId, "Call Centre");
                    },
                    revoke: function (taskId) {
                        modalService.showGenericInputModal('Revoke Task', "Reason", function (reason) { revokeTask(taskId, reason); });
                    },
                    closeTask: function (task) {
                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + task.TaskTemplateId + '/' + 2 + '/Reasons').then(function (result) {
                            modalService.showCloseModal(function (reason, comment) { closeTask(task.ResourceId, reason, comment, task.TaskTemplateId, task.Id); }, { TaskId: task.Id, Reasons: result.data });
                        });
                    },
                    closeApplicationForm: function (formId) {
                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 2 + '/Reasons').then(function (result) {
                            modalService.showCloseApplicationFormModal(function (reason, comment) { closeApplicationForm(formId, reason, comment); }, { Reasons: result.data });
                        });
                    },
                    reopenApplicationForm: function (formId) {
                        reopenApplicationForm(formId);
                    },
                    delegateTask: function (task) {
                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + task.TaskTemplateId + '/' + 3 + '/Reasons').then(function (result) {
                            modalService.showDelegateModal(function (reason, comment, userId) { delegateTask(task.Id, reason, comment, userId); }, { TaskId: task.Id, Reasons: result.data, ResourceUri: workflowServicesManagementApiService.getWorkflowApiUrl() + 'Team' }, 'static');
                        });
                    },
                    claimTask: function (task) {
                        eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionStarted');
                        ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'TaskOwnership/' + task.Id + '/Claim', null).then(function () {
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                            eventBroadcastingService.broadcastEvent('UINotify', { title: 'Claim Task', message: 'Task Claimed Successfully', Success: "success" });
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.ClaimSuccess', task);
                            $route.reload();
                        });
                    },
                    assignTask: function (taskId) {
                        eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionStarted');
                        var success = function (result) {
                            ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'TaskOwnership/' + taskId + '/Assign', { OwnerId: result })
                                .then(function () {
                                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                                    eventBroadcastingService.broadcastEvent('UINotify', { title: 'Assign Task', message: 'Task Assigned Successfully', Success: "success" });
                                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.AssignSuccess', null);
                                })
                                .catch(function () {
                                    eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                                    eventBroadcastingService.broadcastEvent('UINotify', { title: 'Assign Task', message: 'Failed To Assign Task', Success: "error" });
                                });
                        };
                        modalService.showAssignTaskModal('Assign Task', 'User', workflowServicesManagementApiService.getWorkflowApiUrl() + 'Team', success);
                    },
                    postponeTask: function (task) {
                        eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionStarted');
                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + task.TaskTemplateId + '/' + 1 + '/Reasons').then(function (result) {
                            var modalUrl = sourceUrl + '/Views/WorkflowServices/Tasks/Templates/postponeCaptureTask.tpl.html';

                            var modal = modalService.showModal('SoftiDoc.Tasks.Controllers.PostponeCaptureTaskController', modalUrl, { TaskId: task.Id, Reasons: result.data });
                            modal.result.then(function (model) {
                                postponeTask(task.Id, model.DateTime, model.Comment, model.Reason);
                            }, function () {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                            });
                        });
                    },
                    escalateCaptureTask: function (taskId) {
                        var modal = modalService.showModal('SoftiDoc.ApplicationFormsCapture.EscalateCaptureTaskController', '/scripts/Application/Components/ApplicationFormsCapture/Common/Templates/escalateCaptureTask.tpl.html', taskId);
                        modal.result.then(function () {
                            eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.AfterEscalateTaskComplete', null);
                        }, function () {

                        });
                    },
                    acceptTask: function (taskId) {
                        eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionStarted');
                        return ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'TaskOwnership/' + taskId + '/Accept').then(
                            function () {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.AcceptSuccess', taskId);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Accept', message: 'Task Accepted', Success: "success" });
                            });
                    },
                    resumeTask: function (taskId) {
                        eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionStarted');
                        return ajaxJsonService.Post(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Tasks/Resume/' + taskId + '/Resume').then(
                            function () {
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.TaskActionCompleted');
                                eventBroadcastingService.broadcastEvent('SoftiDoc.WorkflowServices.ResumeSuccess', taskId);
                                eventBroadcastingService.broadcastEvent('UINotify', { title: 'Resume', message: 'Task Resumed', Success: "success" });
                            });
                    },
                    addComment: function (taskId) {
                        addComment(taskId);
                    },
                    getCommentsByTaskId: function (taskId) {

                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'GetComments/' + taskId).then(function (result) {
                            modalService.showComments(result.data);
                        });
                    },
                    saveComment: function (taskId) {
                        saveComment(taskId);
                    },
                    filterQueue: function (applicationId, data, role) {
                        return filterQueue(applicationId, data, role);
                    },
                    viewStatusHistory: function (taskId) {
                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'StatusHistoryWithComments/' + taskId).then(function (result) {
                            modalService.showTaskStatusHistoryModal(filterDate(result.data));
                        });
                    },
                    viewOwnershipHistory: function (taskId) {
                        ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'TaskOwnership/' + taskId + '/OwnershipHistory').then(function (result) {
                            modalService.showOwnershipHistoryModal(filterDate(result.data));
                        });
                    },
                    loadTask: function (id) {
                        var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "Tasks/TaskId/" + id;
                        return ajaxJsonService.Get(url);
                    },

                    getFieldByKey: function (array, key) {
                        var item = Enumerable.From(array).FirstOrDefault({ fieldValue: "" }, function (x) { return x.Key == key; });

                        return item.FieldValue;
                    },
                }
            }])
        .service('SoftiDoc.WorkFlowServices.Tasks.SharedData', function () {

            var taskActions = [
                { Name: 'Unknown', Key: 0 },
                { Name: 'Create', Key: 1 },
                { Name: 'Assign', Key: 2 },
                { Name: 'Forward', Key: 3 },
                { Name: 'Postpone', Key: 4 },
                { Name: 'Resume', Key: 5 },
                { Name: 'Claim', Key: 6 },
                { Name: 'Delegate', Key: 7 },
                { Name: 'Revoke', Key: 8 },
                { Name: 'Complete', Key: 9 },
                { Name: 'Accept', Key: 11 },
                { Name: 'Submit', Key: 12 },
                { Name: 'Close', Key: 12 },
                { Name: 'Fail', Key: 13 },
                { Name: 'Error', Key: 14 },
                { Name: 'Continue', Key: 15 }];

            return {
                TaskActions: taskActions
            };
        })
        .service('SoftiDoc.WorkFlowServices.Tasks.Services.ApplicationRepository', function ($location) {
            var applicationConfigurations = [];

            //var queueRoutes = [{ Key: "InvalidForm", Route: "/ApplicationFormsCapture/InvalidFormTask/" }];

            var registerApplicationForTasks = function (applicationId, configuration) {

                var taskedApplication = {
                    ApplicationId: applicationId,
                    tasks: configuration.Tasks,
                    queueRoutes: configuration.QueueRoutes,
                    queues: configuration.Queues,
                    searchableTasks: configuration.SearchableTasks
                }

                applicationConfigurations.push(taskedApplication);
            }

            return {
                getQueues: function (applicationId) {
                    var availableQueues = Enumerable.From(applicationConfigurations).First(function (x) {
                        return x.ApplicationId.toLowerCase() == applicationId.toLowerCase();
                    });

                    return availableQueues.queues;
                },

                registerApplication: function (applicationId, configuration) {
                    registerApplicationForTasks(applicationId, configuration);
                },

                getRoute: function (applicationId, queue) {

                    var application = Enumerable.From(applicationConfigurations).First(function (x) {
                        return x.ApplicationId.toLowerCase() == applicationId.toLowerCase();
                    });

                    var route = Enumerable.From(application.queueRoutes).First(function (x) {
                        return x.Key.toLowerCase() == queue.toLowerCase();
                    });

                    return route.Route;
                },
                getTaskDisplayFields: function (applicationId, queue) {

                    var application = Enumerable.From(applicationConfigurations).First(function (x) {
                        return x.ApplicationId.toLowerCase() == applicationId.toLowerCase();
                    });

                    var route = Enumerable.From(application.queueRoutes).First(function (x) {
                        return x.Key.toLowerCase() == queue.toLowerCase();
                    });

                    return route.DisplayFields;
                },
                getTaskSearchConfiguration: function (applicationId, queue) {

                var application = Enumerable.From(applicationConfigurations).First(function (x) {
                    return x.ApplicationId.toLowerCase() === applicationId.toLowerCase();
                });

                if (!angular.isDefined(application.searchableTasks)) {
                    return null;
                }
                    
                var route = Enumerable.From(application.searchableTasks).FirstOrDefault(null,function (x) {
                    return x.Key.toLowerCase() === queue.toLowerCase();
                });
               
                return route;
            }
            };
        })
        .service('SoftiDoc.WorkFlowServices.Tasks.Services.WebApiService', ['ajaxJsonService', 'workflowServicesManagementApiService', 'eventBroadcastingService', '$filter', function (ajaxJsonService, workflowServicesManagementApiService, eventBroadcastingService, $filter) {

            function filterDate(data) {

                Enumerable.From(data).ForEach(function (x) {
                    x.DisplayMetadata = angular.fromJson(x.DisplayMetadata);
                    x.Created = $filter('date')(x.Created, 'dd-MM-yyyy h:mm a');
                    x.Modified = $filter('date')(x.Modified, 'dd-MM-yyyy h:mm a');
                });

                return data;
            }

            return {
                getTaskBasket: function () {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "MyTasks/Basket";
                    return ajaxJsonService.Get(url, null);
                },
                getAvailableTaskCount: function (queue) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "Tasks/" + queue + "/Available/Count";
                    return ajaxJsonService.Get(url, null);
                },
                claimTask: function (taskTemplate) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "TaskOwnership/" + taskTemplate + "/ClaimNextAvailableTask";
                    return ajaxJsonService.Post(url, null);
                },
                loadQueueList: function (queue, roleId) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "MyTasks/" + queue + '/' + roleId;
                    return ajaxJsonService.Get(url, null);
                },
                loadTaskList: function (taskQueue, roleId, status, pageNo) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "MyTasks/" + taskQueue + "/" + roleId + "/" + status + "/" + pageNo;
                    return ajaxJsonService.Get(url);
                },
                filterQueue: function (data) {
                    return filterQueue(data);
                },
                filterUnassignedQueue: function (data) {
                    return filterUnassignedQueue(data);
                },
                filter: function (data) {
                    return filterDate(data);
                },
                getTeam: function () {
                    return ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Team', null);
                },
                loadOwnerTaskQueueList: function (userId) {
                    return ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Tasks/Basket/' + userId);
                },
                loadOwnerQueueList: function (queue, userId, roleId) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "Tasks/QueueName/" + queue + "/UserId/" + userId + "/RoleId/" + roleId;
                    return ajaxJsonService.Get(url);
                },
                loadOwnerTaskList: function (queue, status, pageNo, userId, roleId) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "TaskOwnership/" + queue + '/' + userId + '/' + roleId + '/' + status + '/' + pageNo;
                    return ajaxJsonService.Get(url);
                },
                loadUnassignedQueueList: function () {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "Tasks/" + queue + "/" + status.Key + "/" + pageNo;
                    return ajaxJsonService.Get(url);
                },
                loadUnassignedTaskList: function (status, pageNo, queue) {
                    var url = workflowServicesManagementApiService.getWorkflowApiUrl() + "Tasks/" + queue + "/" + status + "/" + pageNo;
                    return ajaxJsonService.Get(url);
                },
                loadUnassignedTasks: function (queueName) {
                    return ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Tasks/QueueName/' + queueName);
                },
                loadTaskCountForQueue: function (queueName, status) {
                    return ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'Tasks/' + queueName + '/' + status + '/Count/');
                },
                getTeamMember: function () {
                    return ajaxJsonService.Get(workflowServicesManagementApiService.getWorkflowApiUrl() + 'TeamMember');
                }
            };
        }])
        .service('SoftiDoc.WorkFlowServices.Tasks.ModalService', ['$modal', 'eventBroadcastingService', function ($modal, eventBroadcastingService) {

            //var configuration = applicationHost.retrieveApplicationConfigurationById('SoftiDoc.ApplicationFormsCapture');
            var sourceUrl = "";//configuration.UnityUrl;

            function raiseTaskActionComplete() {
                eventBroadcastingService.broadcastEvent('SoftiDoc.Capture.TaskActionCompleted');
            };

            return {
                showCloseModal: function (resultAction, model) {
                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/CloseTaskModal.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.CloseTaskModalController',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                            model: function () {
                                return model;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        resultAction(result.comment, result.reason);
                    }, null);
                },
                showDelegateModal: function (resultAction, model, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }
                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/DelegateTaskModal.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.DelegateTaskModalController',
                        size: 'lg',
                        backdrop: backdropStatic,
                        resolve: {
                            model: function () {
                                return model;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        resultAction(result.comment, result.reason, result.userId);
                    }, raiseTaskActionComplete());
                },
                showGenericInputModal: function (header, label, resultAction, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }
                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/genericInputModal.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.GenericInputModalController',
                        size: 'lg',
                        backdrop: backdropStatic,
                        resolve: {
                            model: function () {
                                return { Header: header, Label: label };
                            }
                        }
                    });

                    modalInstance.result.then(function (value) {
                        resultAction(value);
                    }, null);
                },
                showCommentModal: function (header, label, resultAction, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }
                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/TaskCommentModal.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.CommentModalController',
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        backdrop: backdropStatic,
                        keyboard: false,
                        resolve: {
                            model: function () {
                                return { Header: header, Label: label };
                            }
                        }
                    });

                    modalInstance.result.then(function (value) {
                        resultAction(value);
                    }, null);
                },
                showComments: function (data) {

                    var backdropStatic = 'true';

                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/ViewTaskComments.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.TaskCommentsController',
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        backdrop: backdropStatic,
                        keyboard: false,
                        resolve: {
                            model: function () {
                                return { Data: data, Header: "Task Comments" };
                            }
                        }
                    });

                },
                showMultipleTaskModal: function (controller, templateUri, resultAction, model, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }

                    var modalInstance = $modal.open({
                        templateUrl: templateUri,
                        controller: controller,
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        backdrop: backdropStatic,
                        resolve: {
                            model: function () {
                                return model;
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {
                        resultAction(data);
                    },
                        null
                    );
                },
                showMandatoryCommentModal: function (resultAction, header) {

                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Application/Common/Templates/captureMandatoryCommentModal.tpl.html',
                        controller: 'SoftiDoc.ApplicationFormsCapture.MandatoryCommentModalController',
                        size: 'lg',
                        keyboard: false,
                        backdrop: 'static',
                        windowClass: 'unity-modal-lg',
                        resolve: {
                            model: function () {
                                return header;
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {
                        resultAction(data);
                    }, raiseTaskActionComplete());
                },

                showAvailableTaskActionModal: function (acceptAction, rejectAction, name) {

                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Application/Common/Templates/availableTaskActionModal.tpl.html',
                        controller: "SoftiDoc.ApplicationFormsCapture.AvailableTaskActionModalController",
                        resolve: {
                            model: function () {
                                return { Name: name };
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        if (result)
                            acceptAction();
                        else rejectAction();
                    }, rejectAction);
                },
                showTaskStatusHistoryModal: function (data) {
                    $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/TaskStatusHistory.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.StatusHistoryModalController',
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        resolve: {
                            model: function () {
                                return { Data: data };
                            }
                        }
                    });

                },
                showOwnershipHistoryModal: function (data, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }

                    $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/TaskOwnershipHistory.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.TaskOwnershipModalController',
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        backdrop: backdropStatic,
                        resolve: {
                            model: function () {
                                return { Data: data };
                            }
                        }
                    });
                },
                showAssignTaskModal: function (header, label, resourceUri, resultAction, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }

                    var modalInstance = $modal.open({
                        templateUrl: sourceUrl + '/Views/WorkFlowServices/Tasks/Templates/captureAssignTaskModal.tpl.html',
                        controller: 'WorkflowServices.Tasks.Controllers.AssignTaskModalController',
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        backdrop: backdropStatic,
                        resolve: {
                            model: function () {
                                return { Header: header, Label: label, ResourceUri: resourceUri };
                            }
                        }
                    });

                    modalInstance.result.then(function (value) {
                        resultAction(value);
                    }, raiseTaskActionComplete());
                },
                showModal: function (controller, templateUri, model, backdropStatic) {
                    if (angular.isUndefined(backdropStatic) || backdropStatic == null) {
                        backdropStatic = 'true';
                    }

                    return $modal.open({
                        templateUrl: templateUri,
                        controller: controller,
                        size: 'lg',
                        windowClass: 'unity-modal-lg',
                        backdrop: backdropStatic,
                        resolve: {
                            model: function () {
                                return model;
                            }
                        }
                    });
                }
            };
        }]);

})();


