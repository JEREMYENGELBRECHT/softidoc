/**********************************************************************************************/
/* Api Services                                                                                   */
/* Services to separate our data logic from our view logic                                    */
/**********************************************************************************************/
angular.module('SoftiDoc.WorkFlowServices.Services', [])
    .factory('workflowServicesManagementApiService', function (ajaxJsonService, unityApplicationRepository, $location) {

        var determineApplicationFromPath = function () {
            var splitPath = $location.$$path.split("/");

            if (splitPath.length > 0) {
                var applicationKey = splitPath[1];
                return applicationKey.toLowerCase();
            }
        };

        var getCurrentApplicationWorkFlowServiceApiUrl = function () {
            var currentApplicationConfiguration = unityApplicationRepository.GetApplicationConfiguration(determineApplicationFromPath());

            if (currentApplicationConfiguration.WorkFlowServiceApiUrl.indexOf("http://") == -1) {

                var url = "";

                for (var i = 0; i < environmentVars.length;i++)
                {
                    if (environmentVars[i].name === currentApplicationConfiguration.WorkFlowServiceApiUrl) {
                        url = environmentVars[i].value;
                    }
                }

                environment.value(currentApplicationConfiguration.WorkFlowServiceApiUrl, url);
              
                currentApplicationConfiguration.WorkFlowServiceApiUrl = url;
            }

            return currentApplicationConfiguration.WorkFlowServiceApiUrl;
        };

        return {
            getWorkflowApiUrl: function () {
                return getCurrentApplicationWorkFlowServiceApiUrl();
            },
            getRoles: function () {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Roles/";
                return ajaxJsonService.Get(url, null);
            },
            getWorkFlowTeams: function () {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/";
                return ajaxJsonService.Get(url, null);
            },
            deleteTeam: function (teamId) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/" + teamId;
                return ajaxJsonService.Delete(url, null);
            },
            deleteTeamMember: function (teamId, teamMemberId) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/" + teamId + "/Member/" + teamMemberId;
                return ajaxJsonService.Delete(url, null);
            },
            changeTeamMemberStatus: function (teamMember) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/" + teamMember.TeamId + "/Member/" + teamMember.Id;
                return ajaxJsonService.Put(url, teamMember);
            },
            getTeamMembers: function (teamId) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/" + teamId + "/Member/";
                return ajaxJsonService.Get(url, null);
            },
            addNewTeam: function (teamName) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/";
                return ajaxJsonService.Post(url, { TeamName: teamName });
            },
            updateTeam: function (team) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/" + team.Id;
                return ajaxJsonService.Put(url, team);
            },
            addNewTeamMember: function (teamMember) {
                var url = getCurrentApplicationWorkFlowServiceApiUrl() + "/Team/" + teamMember.TeamId + "/Member/";
                return ajaxJsonService.Post(url, teamMember);
            }
        };
    });
