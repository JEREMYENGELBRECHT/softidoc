import {
    Component,
    ViewContainerRef,
    Compiler,
    ComponentFactory,
    ComponentFactoryResolver,
    ModuleWithComponentFactories,
    ComponentRef,
    ReflectiveInjector,
    SystemJsNgModuleLoader,
    NgModule
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'navigation',
    template: `
  <button (click)="navigate()">Test</button>
  `,
    styleUrls: []
})

export class Navigation {

    constructor(public router: Router,
        private viewContainer: ViewContainerRef,
        private resolver: ComponentFactoryResolver,
        private loader: SystemJsNgModuleLoader,
        private compiler: Compiler
    ) { }

    navigate() {
        this.addApplication("http://localhost:9866/dynamic.module.js#DynamicModule");
    }

    addApplication(path: string) {

        this.loader.load(path)
            .then((modFac) => {
                // the missing step, need to use Compiler to resolve the module's embedded components
                this.compiler.compileModuleAndAllComponentsAsync<any>(modFac.moduleType)

                    .then((factory: ModuleWithComponentFactories<any>) => {
                        return factory.componentFactories.find(x => x.componentType.name === "TestComponent");
                    })
                    .then(cmpFactory => {

                        let modRef = modFac.create(this.viewContainer.parentInjector);
                        let component = this.viewContainer.createComponent(cmpFactory, 0, modRef.injector);
                    });
            });
    }
}
