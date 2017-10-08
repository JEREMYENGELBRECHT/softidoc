"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
//import { LocalStorageService } from 'angular-2-local-storage';
var Notificationservice = require("../common/notificationService/notification.service");
var NotificationService = Notificationservice.NotificationService;
var HttpClientservice = require("../common/httpClient.service");
var HttpClient = HttpClientservice.HttpClient;
//import { AppConfig } from '../config/app.config';
var Login = (function () {
    function Login(router, http, notificationService, httpClient) {
        this.router = router;
        this.http = http;
        this.notificationService = notificationService;
        this.httpClient = httpClient;
        this.onLoggedIn = new core_1.EventEmitter();
    }
    Login.prototype.login = function () {
        this.onLoggedIn.emit(true);
        //this.http.post("", {}, { headers: contentHeaders, withCredentials: true, })
        //  .subscribe(
        //  response => {
        //    let tokenType = response.json().token_type;
        //    let token = response.json().access_token;
        //    this.localStorageService.set('id_token', tokenType + " " + token);
        //    //this.fetchLoggedInUsersDetails();
        //  },
        //  error => {
        //    alert(error.text());
        //    console.log(error.text());
        //  });
    };
    Login.prototype.fetchLoggedInUsersDetails = function () {
        //this.httpClient.get("")
        //  .subscribe(
        //  response => {
        //    let responseJson = response.json();
        //    let user = responseJson.user;
        //    let claims = responseJson.claims;
        //    this.localStorageService.set('user', user);
        //    this.localStorageService.set('claims', claims);
        //    this.notificationService.showMessage("Welcome " + user.givenName, "Logged In");
        //    this.router.navigate(['/dashboard']);
        //  },
        //  error => {
        //    alert(error.text());
        //    console.log(error.text());
        //  });
    };
    return Login;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], Login.prototype, "onLoggedIn", void 0);
Login = __decorate([
    core_1.Component({
        selector: 'login',
        templateUrl: './login.html',
        styleUrls: ['../../capsule-app-theme.css', './login.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, http_1.Http, NotificationService, HttpClient])
], Login);
exports.Login = Login;
//# sourceMappingURL=login.js.map