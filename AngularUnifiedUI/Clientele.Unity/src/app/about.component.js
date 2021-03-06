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
var Carservice = require("./carservice");
var CarService = Carservice.CarService;
var AboutComponent = (function () {
    function AboutComponent(carService) {
        this.carService = carService;
    }
    AboutComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this.carService.getCarsSmall().then(cars => this.cars = <Car[]>cars);
        this.carService.getCarsSmall().subscribe(function (cars) { return _this.cars = cars; });
    };
    return AboutComponent;
}());
AboutComponent = __decorate([
    core_1.Component({
        selector: 'about',
        templateUrl: './about.component.html',
        styleUrls: ['./app.component.css', './capsule-app-theme.css'],
        providers: [CarService]
    }),
    __metadata("design:paramtypes", [CarService])
], AboutComponent);
exports.AboutComponent = AboutComponent;
//# sourceMappingURL=about.component.js.map