System.register(["./app.component", "@angular/core/testing", "@angular/platform-browser"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var app_component_1, testing_1, platform_browser_1;
    return {
        setters: [
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }
        ],
        execute: function () {
            describe('AppComponent', function () {
                var de;
                var comp;
                var fixture;
                beforeEach(testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({
                        declarations: [app_component_1.AppComponent]
                    })
                        .compileComponents();
                }));
                beforeEach(function () {
                    fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
                    comp = fixture.componentInstance;
                    de = fixture.debugElement.query(platform_browser_1.By.css('h1'));
                });
                it('should create component', function () { return expect(comp).toBeDefined(); });
                it('should have expected <h1> text', function () {
                    fixture.detectChanges();
                    var h1 = de.nativeElement;
                    expect(h1.innerText).toMatch(/angular/i, '<h1> should say something about "Angular"');
                });
            });
        }
    };
});
//# sourceMappingURL=app.component.spec.js.map