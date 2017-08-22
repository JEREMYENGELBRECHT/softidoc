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
var Navigation = (function () {
    function Navigation(router, viewContainer, resolver, loader, compiler) {
        this.router = router;
        this.viewContainer = viewContainer;
        this.resolver = resolver;
        this.loader = loader;
        this.compiler = compiler;
    }
    Navigation.prototype.navigate = function () {
        this.addApplication("http://localhost:9866/dynamic.module.js#DynamicModule");
    };
    Navigation.prototype.addApplication = function (path) {
        var _this = this;
        this.loader.load(path)
            .then(function (modFac) {
            // the missing step, need to use Compiler to resolve the module's embedded components
            _this.compiler.compileModuleAndAllComponentsAsync(modFac.moduleType)
                .then(function (factory) {
                return factory.componentFactories.find(function (x) { return x.componentType.name === "TestComponent"; });
            })
                .then(function (cmpFactory) {
                var modRef = modFac.create(_this.viewContainer.parentInjector);
                var component = _this.viewContainer.createComponent(cmpFactory, 0, modRef.injector);
            });
        });
    };
    return Navigation;
}());
Navigation = __decorate([
    core_1.Component({
        selector: 'navigation',
        template: "\n  <button (click)=\"navigate()\">Test</button>\n  ",
        styleUrls: []
    }),
    __metadata("design:paramtypes", [router_1.Router,
        core_1.ViewContainerRef,
        core_1.ComponentFactoryResolver,
        core_1.SystemJsNgModuleLoader,
        core_1.Compiler])
], Navigation);
exports.Navigation = Navigation;
//# sourceMappingURL=navigation.js.map