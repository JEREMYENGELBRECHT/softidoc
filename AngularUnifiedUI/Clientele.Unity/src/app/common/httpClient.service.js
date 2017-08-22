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
var http_1 = require("@angular/http");
var angular_2_local_storage_1 = require("angular-2-local-storage");
//import { LoaderService } from '../core/loader/loader.service';
var Observable_1 = require("rxjs/Observable");
var HttpClient = (function () {
    function HttpClient(http, localStorageService) {
        this.http = http;
        this.localStorageService = localStorageService;
    }
    HttpClient.prototype.createAuthorizationHeader = function (headers) {
        if (this.localStorageService.get('id_token') != null) {
            headers.append('Authorization', this.localStorageService.get('id_token'));
        }
    };
    HttpClient.prototype.get = function (url) {
        //this.showLoader();
        var _this = this;
        var headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(url, {
            headers: headers
        }).catch(this.onCatch)
            .do(function (res) {
            _this.onSuccess(res);
        }, function (error) {
            _this.onError(error);
        })
            .finally(function () {
            _this.onEnd();
        });
    };
    HttpClient.prototype.post = function (url, data) {
        //this.showLoader();
        var _this = this;
        var headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(url, data, {
            headers: headers
        }).catch(this.onCatch)
            .do(function (res) {
            _this.onSuccess(res);
        }, function (error) {
            _this.onError(error);
        })
            .finally(function () {
            _this.onEnd();
        });
    };
    HttpClient.prototype.put = function (url, data) {
        //this.showLoader();
        var _this = this;
        var headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(url, data, {
            headers: headers
        }).catch(this.onCatch)
            .do(function (res) {
            _this.onSuccess(res);
        }, function (error) {
            _this.onError(error);
        })
            .finally(function () {
            _this.onEnd();
        });
    };
    HttpClient.prototype.onCatch = function (error, caught) {
        return Observable_1.Observable.throw(error);
    };
    HttpClient.prototype.onSuccess = function (res) {
        console.log('Request successful');
    };
    HttpClient.prototype.onError = function (res) {
        console.log('Error, status code: ' + res.status);
    };
    HttpClient.prototype.onEnd = function () {
        //this.hideLoader();
    };
    return HttpClient;
}());
HttpClient = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, angular_2_local_storage_1.LocalStorageService])
], HttpClient);
exports.HttpClient = HttpClient;
//# sourceMappingURL=httpClient.service.js.map