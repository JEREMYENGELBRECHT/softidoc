/*
  filename: integralui.listview.module.ts
  version : 1.0.0
  Copyright © 2016-2017 Lidor Systems. All rights reserved.

  This file is part of the "IntegralUI Web" Library.
                                                                   
  The contents of this file are subject to the IntegralUI Web License, and may not be used except in compliance with the License.
  A copy of the License should have been installed in the product's root installation directory or it can be found at
  http://www.lidorsystems.com/products/web/studio/license-agreement.aspx.
                                                            
  This SOFTWARE is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language
  governing rights and limitations under the License. Any infringement will be prosecuted under applicable laws.
*/
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var integralui_core_module_1 = require("./integralui.core.module");
var integralui_common_module_1 = require("./integralui.common.module");
var integralui_core_1 = require("./components/integralui.core");
var integralui_listview_1 = require("./components/integralui.listview");
var integralui_listitem_1 = require("./components/integralui.listitem");
var IntegralUIListViewModule = (function () {
    function IntegralUIListViewModule() {
    }
    return IntegralUIListViewModule;
}());
IntegralUIListViewModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule, integralui_core_module_1.IntegralUICoreModule, integralui_common_module_1.IntegralUICommonModule],
        declarations: [
            integralui_listview_1.IntegralUIListView
        ],
        exports: [
            integralui_core_1.IntegralUIFocus,
            integralui_listview_1.IntegralUIListView,
            integralui_listitem_1.IntegralUIListItem,
            integralui_core_1.IntegralUITemplate
        ]
    })
], IntegralUIListViewModule);
exports.IntegralUIListViewModule = IntegralUIListViewModule;
//# sourceMappingURL=integralui.listview.module.js.map