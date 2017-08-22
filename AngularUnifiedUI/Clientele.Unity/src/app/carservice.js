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
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/toPromise");
var CarService = (function () {
    function CarService(http) {
        this.http = http;
    }
    CarService.prototype.getAll = function () {
        return this.http.get('./app/resources/cars-small.json')
            .toPromise()
            .then(function (response) {
            return response.json();
        }).catch(function (err) {
            console.log(err);
        });
    };
    CarService.prototype.getCarsSmall = function () {
        //return this.http.get('./app/resources/cars-small.json')
        //    .toPromise()
        //    .then((res: Response) => <Car[]>res.json().data)
        //    .then(data => { return data; });
        //return this.http
        //    .get('./app/resources/cars-small.json')
        //    .map((response: Response) => response.json().data)
        //    .toPromise();
        return this.http.get('./app/resources/cars-small.json')
            .map(this.extractData)
            .catch(this.handleError);
        // Subscribe to the observable, so when data is ready add it to the TreeView
        //obj.subscribe(data => data, error => console.log(error));
    };
    CarService.prototype.extractData = function (res) {
        var obj = res.json().data;
        return obj || {};
    };
    CarService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Rx_1.Observable.throw(errMsg);
    };
    return CarService;
}());
CarService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], CarService);
exports.CarService = CarService;
//# sourceMappingURL=carservice.js.map