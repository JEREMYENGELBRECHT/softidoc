Quick Do’s and Don’ts
1.	Don’t just use $rootScope – use services instead currently only the BearerToken is on $rootScope
2.	Do keep your module dependencies neat and tidy
3.	Do separate modules out into files for different types ( controllers can be linked together for an application dependent on size )
4.	Don’t assign variable names to your modules ( only startup modules are named for specific purpose )
5.	Do load your data in your views when $viewContentLoaded or $includeContentLoaded has fired.
6.	Do avoid global variables – if these are needed assign them to environment variables configuration so that they can be injected.
7.	Do use the UiLoader service and loading-widget directive mechanism to wrap your calls to show that you are busy doing work on the UI. ( see the note on listening for $http on the service )

Adding my Application

To create a new component or "application" within the Unity host, you will need to do the following:
1.	Copy and rename the "MyComponentScripts" folder to /scripts/Application/Components/MyNewComponentName/
2.	 Rename SoftiDoc.MyComponent.js to your component name keeping with the naming convention.
3.	Rename all other SoftiDoc.MyComponent.*.js files to your component name keeping with the naming conventions.
4.	 In each of the files, update the names of your modules to match the file names as well as changing the dependency names.
5.	In the Index.html page in the root of the application host, add the following replacing MyComponent with your component name:
<script src="/scripts/Application/Components/MyComponent/SoftiDoc.MyComponent.js"></script>
<script src="/scripts/Application/Components/MyComponent/SoftiDoc.MyComponent.Routes.js"></script>
<script src="/scripts/Application/Components/MyComponent/SoftiDoc.MyComponent.Controllers.js"></script>
<script src="/scripts/Application/Components/MyComponent/SoftiDoc.MyComponent.Services.js"></script>
Note The following in terms of module dependency/hierarchy:
a.	Your application needs routes to know where to direct uri/urls to.
b.	Your routes need controllers to know how to control/manage each of the urls.
c.	Your controllers need Unity ApplicationHost services and/or custom services as defined in SoftiDoc.MyComponent.Services.js
 

In SoftiDoc.MyComponent.js ( renamed ) :
1.	Change registerApplication.registerApplication("SoftiDoc.MyComponent"); to use your component namespace – this will register your component with the applications module - this is crucial for your application module to be included in the application.
2.	Generate a sequential guid and replace the value for myApplicationGuid (The system won't allow duplicates and a first declared approach will take place to keep the application running)
3.	Change your component key (text not guid or int) to a unique key for your application (The system won't allow duplicates and a first declared approach will take place to keep the application running)
4.	Change the searchUrl value to match your search functionality ( "" defines no searching capability )
5.	Icon ( currently under development )
6.	IdentityPrefix ( Main namespace for your application - used for checking for main application entry point )
7.	Define your unique title navigation ( this could be done ajax style or hard coding )
i.	url : hashbang url to page always including your component key for the system to automatically identify your application
ii.	label : readable friendly text
iii.	 requiredClaim : required claim to access the page/section/area ( could be comma delimited if multiple )
8.	 Define title navigation child items if needs be
9.	The "cssInjector" service has been injected for you to be able to add custom CSS files and register them so that they only ever get added once.  If you are adding additional UI component css files, you would do this here as well, so that if another is reusing the css, it only ever gets added once by means of the cssInjector service.
NB: Your application key must match your paths used in the Routes module.
 
In SoftiDoc.MyComponent.Routes.js
1.	Change the component key to match that used in the SoftiDoc.MyComponent.js file
2.	Define your routes/entry points to parts of your component in the routeProvider sections  DO NOT define an "otherwise" option - this will stop all further route definitions from being added!

Note: Angular is case sensitive to Urls by default - the starter application by default makes it caseInSensitive.
3.	templareUrl html files are to be placed in /Views/MyComponentKey/
4.	Define controllers if needs be each of the routes in quotes - the controllers will be defined in the controllers file. The convention is myComponent[View]Controller
In SoftiDoc.MyComponent.Controllers.js
1.	Change the module name if needs be to match
2.	Create controllers matching those in the route definitions
3.	Note: The Array declaration is the angular preferred method of controller declaration
4.	The Example for the Upload controller shows how inject the current applicationId as you defined in your SoftiDoc.MyComponent.js file as well as an apiUrl defined in the configuration section ( See the "add your api Configuration for deployment" below )
5.	Certain directives such as the file upload directives explicitly require you to tell it which application is consuming it and where to send the file to. This allows the directives to be more flexible and reusable with other Apis.
6.	Note the module dependency and injection of the myComponentApiService in myComponentIndexController
In SoftiDoc.MyComponent.Services.js
The Starter sample has an Api service for you to start with and you will note the following:
1.	the ajaxJsonService is injected for you to call the underlying Get, Put, Post and Delete data integration calls
2.	The $rootScope is only injected to pass the bearer token for XHR file downloading with authentication
3.	Your component api url is injected for you to create resource urls with
4.	An example getAllMyComponentResource method exists to wrap domain specific/repository specific language calls with underlying data integration calls.
5.	An example Blob file download call with save has been added. [if you don't use this, remove the $rootScope and method]
6.	The myComponentApiService service would be injected into your controllers to retrieve data
Note: Before writing new services always check the system services if something already exists to do the same function.
Also check other component services to potentially leverage off of them by making their service a system service.

In terms of "service" vs "factory" keep the following in mind:
a.	If you need a service that exists/starts as soon as it is declared, it is most likely an ApplicationHost service and should be added there. An example would be the signalR service - push notifications should be available right from declaration.
b.	If you only need your service to be initialised on first call through the dependency injection mechanism, then factory is more appropriate. However, if you anticipate the service being used in other components/areas then it may be better to add it to the ApplicationHost services folder, /scripts/Application/Services/
c.	Factory and Service both are singletons and they live for the lifetime of the application. The only difference is that "Service" will initialise/construct on declaration and Factory will initialise/construct on construction of the object/controller it is being injected into.

Adding my Views
1.	Copy the MyComponentViews folder to /Views/MyComponent/ renaming MyComponent to match the urls you defined in your SoftiDoc.MyComponent.Routes.js file
2.	Add corresponding html files to the folder ( no html, body , script or head tags - only those that normally exist in the Body )

How do I add security
1.	The title navigation and side application navigation are automatically taken care of by the Host using the requiredClaims you configured in the application registration.
2.	In the html view you can use the "authorise-access" directive as an element for authorisation nesting or as an attribute for a component:
E.g. 
<authorise-access sectionname="MyComponent Section" claim-required="SoftiDoc.MyComponent.Upload" redirect="false">    Content in here.. child components </authorise-access>
or
<div authorise-access sectionname="MyComponent Section" claim-required="SoftiDoc.MyComponent.Upload" redirect="false"> Content in here.. child components </div>

Directive Options:
1.	redirect [ false: text will be replaced with section name, true : the entire view is redirected to a noaccess page]
2.	sectionname - Used when there is no redirect to show a message of "you do not have access to [sectionname] please contact an administrator"
3.	suppress-message [true : The element(html tag) that the directive on and its children dissappear from the DOM and UI]  this is to allow for composable UIs where users do not see things they shouldn't including messages.
4.	claim-required [ single claim or multiple comma delimited ] - note: multiple are treated as an "or" or an "Any", so if one claim matches the user will have access.
 
Note: if you wish to check multiple types of access with an "And" logic you will need to nest the directives.
E.g.
<authorise-access sectionname="MyComponent Section View" claim-required="SoftiDoc.MyComponent.Read" redirect="false">   
 	    First Level Content
<authorise-access sectionname="MyComponent Section Edit" claim-required="SoftiDoc.MyComponent.Edit" redirect="false"> 
    Second level content
</authorise-access>
</authorise-access>
How Do I get the my services to know about my api url and how can I get it configured for deployment?

Add your api Configuration for deployment:
1.	In the /Configuration/Examples/serverConfiguration.json file add a unique entry for your apiUrl, similar to:
 "identityServiceApiUrl" : http://useridentity.SoftiDoc.local/api/"
2.	Talk to whoever is in charge of deployment to add a corresponding entry and values for test, uat and production to Octopus.
3.	 In the /Configuration/serverConfiguration.json file (if it is not there copy/paste it from examples) add a unique entry for your api that you will be testing with,  that matches the one you will use in your services.

Note: The application loads the configuration from /Configuration/serverConfiguration.json on application bootstrapping but it is never commited to the repository, it is managed by Octopus.
The /Configuration/serverConfiguration.json in your source-code base for testing/using/changing while debugging only.
 
System Services:
1.	eventBroadcastingService 
i.	broadcasts all custom events from $rootScope down 
ii.	broadcasts a special event "UINotify" which the notification UI picks up and using the notification service notifies the user additional services (e.g. signalR and $http requests might need to notify the user of something, and this is the way to do it). This gives us the flexibility of swapping out our notification service if we need to.
2.	signalRService - this will be used to listen for all push notifications from all apis
3.	ajaxJsonService - abstracts away $http calls to Get, Post, Put and Delete calls and adds credentials to calls if there is no token.
4.	unityApplicationRepository - adds and allows for retrieval of components in the application host.
5.	uiLoader – Promise wrapper used in conjunction with the loadingWidget directive.
Note: Creating a generic directive that listens for an $http request does not work well for multiple ajax requests/widgets on a single page – it has to be individually tied together. Also, manipulating the DOM from a controller is bad practice, else the service would have generated the loading content.

6.	notificationService - used to notify the UI of certain actions and override browser alert and confirm calls.
7.	validationService - work in progress - generic way to validate large forms ( See xEditable under UI components )
8.	watchingService - generic $watch abstraction service to do additional property change watching with validation and successful change callbacks
9.	resourceService - $resource builder with additional methods ( most likely will be deleted )
10.	authenticationService - performs claims checking, identification, redirecting and handling all things authorisation/authentication/identification
 
System Directives:
1.	authorise-access - used for declaritive authorisation on an html element or component
2.	application-mode - shows you what mode the application host is in
3.	unity-fileupload - used to upload single or multiple files to a specified api url passing declared applicationId
4.	loading-widget – used to wrap around your content showing a loading icon.

a.	Place the following around your content:
<div loading-widget ng-hide="loadError">
b.	Inject the uiLoader into your controller and wrap your loading calls like so:
uiLoader.UseWithLoader( $scope, PromiseReturnFunctionGettingData, SuccessFunction);

System Filters/Formatters:
1.	fileSize - displays bytes as Kb, Mb, Gb etc
2.	referenceNumber - displays a reference number in format [prefix][0(n)][Num]

System UI Components
1.	Bootstap for Angular
2.	xEditable - inline editing and forms incorporating the 'onbeforesave' and 'onaftersave' property watching features
3.	jQuery dialogs ( used for overring the confirm dialog )
4.	Pines notifier for notifications
5.	angular file upload
6.	ng-grid
7.	jsPdf for viewing pdf files
8.	SaveBlob for saving blob files
9.	css injector
10. ui-sortable assist the ui-dashboard component to be able to sort on the widgets
11. angular-ui-dashboard allows widgets to be added, removed, dropped and dragged.
12. angular-wysiwyg editor
13. colopicker assists wysiwyg editor to select colors.