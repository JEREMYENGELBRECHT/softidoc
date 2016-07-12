var unityUrls = [];
var environmentVars = [];

$(document).ready(function () {

    var buildNumber = "";

    var loadScripts = function (applications) {

        // make sure all scripts have at least been checked for existance.
        for (var i = 0; i < applications.length; i++) {
            if (applications[i].ApplicationScriptValidated == null) {
                return;
            }
        }

        var validatedApplications = [];

        for (var i = 0; i < applications.length; i++) {
            if (applications[i].ApplicationScriptValidated) {
                validatedApplications.push(applications[i]);
            }
        }

        applicationHost.registeredApplications = validatedApplications;

        // load remote and lazy loaded scripts
        LazyLoad.js(applicationHost.registeredScripts, function () {
            for (var k = 0; k < applicationHost.registeredApplications.length; k++) {
                //execute the remote hook to register within Unity
                if (angular.isDefined(applicationHost.registeredApplications[k].RegisterApplication)) {
                    applicationHost.registeredApplications[k].RegisterApplication();
                }
            }

            applicationHost.bootstrap();
        });
    }

    // Kill ajax caching by default
    jQuery.ajaxSetup({ cache: false });

    $.getJSON("/configuration/serverConfiguration.json", function (data) {

        try {
            // collect the environment variables
            angular.forEach(data, function (key, value) {
                if (angular.isDefined(data[value].UnityUrl)) {
                    if (data[value].UnityUrl != "") {
                        unityUrls.push(data[value]);
                        applicationHost.registerApplication(data[value].ApplicationId);
                    }
                }

                buildNumber = data.BuildNumber;
                environmentVars.push({ name: value, value: data[value] });
                environment.value(value, data[value]);
            });

            var applications = applicationHost.registeredApplications;

            // take application registrations and register remote hooks where applicable
            for (var i = 0; i < applications.length; i++) {
                var applicationKey = applications[i].ApplicationId;

                var applicationConfiguration = applicationHost.retrieveApplicationConfigurationById(applicationKey);
                if (angular.isDefined(applicationConfiguration)) {
                    var url = applicationConfiguration.UnityUrl;
                    applicationConfiguration.BuildNumber = buildNumber;

                    var scriptLocation = url + "scripts/" + applicationKey + ".UnityHook.js?buildNumber=" + buildNumber;
                    validateScriptExists(i, scriptLocation);

                } else {
                    applications[i].ApplicationScriptValidated = true;
                    loadScripts(applications);
                }
            }
        } catch (error) {
            angular.element("#LoadingPlaceHolder").hide();
            angular.element("#ErrorPlaceHolder").show();
        }
    }).fail(function () {
        angular.element("#LoadingPlaceHolder").hide();
        angular.element("#ErrorPlaceHolder").show();
    });

    var validateScriptExists = function (index, scriptLocation) {
        var applications = applicationHost.registeredApplications;
        var request = createCORSRequest("HEAD", scriptLocation);

        if (request) {
            request.onload = function () {
                applications[index].ApplicationScriptValidated = true;
                applicationHost.registerJavaScript(scriptLocation);
                loadScripts(applications);
            };

            request.onerror = function (error) {
                applications[index].ApplicationScriptValidated = false;
                loadScripts(applications);
            }

            request.send();
        };
    }
});