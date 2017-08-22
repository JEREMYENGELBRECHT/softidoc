"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var animations_1 = require("@angular/platform-browser/animations");
var material_1 = require("@angular/material");
var angular_2_local_storage_1 = require("angular-2-local-storage");
var integralui_module_1 = require("./integralui/integralui.module");
var app_component_1 = require("./app.component");
var navbar_component_1 = require("./navbar.component");
var about_component_1 = require("./about.component");
var courses_component_1 = require("./courses.component");
var treeview_component_1 = require("./treeview.component");
var login_1 = require("./login/login");
var httpClient_service_1 = require("./common/httpClient.service");
var httpClient_factory_1 = require("./common/httpClient.factory");
var primeng_1 = require("primeng/primeng");
var primeng_2 = require("primeng/primeng");
var primeng_3 = require("primeng/primeng");
var app_routing_module_1 = require("./app-routing.module");
var Notificationservice = require("./common/notificationService/notification.service");
var NotificationService = Notificationservice.NotificationService;
var angular_2_local_storage_2 = require("angular-2-local-storage");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, app_routing_module_1.AppRoutingModule, integralui_module_1.IntegralUIModule, forms_1.FormsModule, http_1.HttpModule, material_1.MaterialModule, animations_1.BrowserAnimationsModule, primeng_3.CalendarModule, primeng_1.DataTableModule, primeng_1.SharedModule, primeng_2.TreeModule,
            angular_2_local_storage_1.LocalStorageModule.withConfig({
                prefix: 'my-app',
                storageType: 'localStorage'
            })
        ],
        declarations: [app_component_1.AppComponent, navbar_component_1.NavbarComponent, about_component_1.AboutComponent, courses_component_1.CoursesComponent, treeview_component_1.TreeviewComponent, login_1.Login],
        bootstrap: [app_component_1.AppComponent],
        providers: [NotificationService,
            {
                provide: httpClient_service_1.HttpClient,
                useFactory: httpClient_factory_1.httpServiceFactory,
                deps: [angular_2_local_storage_2.LocalStorageService]
            }]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map