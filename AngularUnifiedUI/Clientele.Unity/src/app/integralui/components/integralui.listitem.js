/*
  filename: integralui.listitem.js
  version : 1.0.0
  Copyright © 2016-2017 Lidor Systems. All rights reserved.

  This file is part of the "IntegralUI Web" Library. 
                                                                   
  The contents of this file are subject to the IntegralUI Web License, and may not be used except in compliance with the License.
  A copy of the License should have been installed in the product's root installation directory or it can be found at
  http://www.lidorsystems.com/products/web/studio/license-agreement.aspx.
                                                            
  This SOFTWARE is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language 
  governing rights and limitations under the License. Any infringement will be prosecuted under applicable laws.                           
*/
var __extends=this&&this.__extends||function(b,a){function c(){this.constructor=b}for(var d in a)a.hasOwnProperty(d)&&(b[d]=a[d]);b.prototype=null===a?Object.create(a):(c.prototype=a.prototype,new c)},__decorate=this&&this.__decorate||function(b,a,c,d){var f=arguments.length,e=3>f?a:null===d?d=Object.getOwnPropertyDescriptor(a,c):d,g;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)e=Reflect.decorate(b,a,c,d);else for(var h=b.length-1;0<=h;h--)if(g=b[h])e=(3>f?g(e):3<f?g(a,c,e):
g(a,c))||e;return 3<f&&e&&Object.defineProperty(a,c,e),e},__metadata=this&&this.__metadata||function(b,a){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(b,a)},core_1=require("@angular/core"),integralui_core_1=require("./integralui.core"),integralui_common_service_1=require("../services/integralui.common.service"),IntegralUIListItem=function(b){function a(a,d,f){b.call(this,a,d);this.elemRef=a;this.commonService=d;this.baseService=f;this.parentCtrl=null;
this.allowSelection=!0}__extends(a,b);a.prototype.ngOnInit=function(){this.parentCtrl=this.baseService.getComponent();this.generalClassName="iui-listitem";this.contentClassName=this.generalClassName+"-content";this.initStyle()};a.prototype.itemDragStart=function(a){if(this.parentCtrl){var c=this.parentCtrl.getItemFromComponent(this);this.parentCtrl.processDragStart(a,c)}a.stopPropagation()};a.prototype.itemDragOver=function(a,d){if(this.parentCtrl){var c=this.parentCtrl.getItemFromComponent(this),
e=this.getPageRect(),b=this.getContentSize();this.parentCtrl.processDragOver(a,c,{x:e.left,y:e.top,width:e.right-e.left,height:b.height},d)}a.stopPropagation()};a.prototype.itemDragDrop=function(a){if(this.parentCtrl){var c=this.parentCtrl.getItemFromComponent(this);this.parentCtrl.processDragDrop(a,c)}a.stopPropagation()};a.prototype.onMouseDown=function(a){this.parentCtrl&&(this.allowSelection=this.parentCtrl.invokeMethod("SELECT_ITEM",{event:a,item:this.parentCtrl.getItemFromComponent(this)}));
this.mouseDown.emit(a);a.stopPropagation()};a.prototype.onMouseUp=function(a){this.parentCtrl&&this.allowSelection&&this.parentCtrl.invokeMethod("UPDATE_SELECTION",{event:a,item:this.parentCtrl.getItemFromComponent(this)});this.mouseUp.emit(a);a.stopPropagation()};a.prototype.selectItem=function(){this.state|=integralui_core_1.IntegralUIObjectState.selected};__decorate([core_1.ViewChild("content",{read:core_1.ElementRef}),__metadata("design:type",core_1.ElementRef)],a.prototype,"contentElem",void 0);
__decorate([core_1.ViewChild("dragElem",{read:core_1.ElementRef}),__metadata("design:type",core_1.ElementRef)],a.prototype,"dragElem",void 0);return a=__decorate([core_1.Component({selector:"iui-listitem",template:'\n        <li [ngClass]="getControlClass()" [ngStyle]="{ \'position\': positionType, \'top\': itemPos.top + \'px\', \'left\': itemPos.left + \'px\' }">\n            <div [ngClass]="getContentClass()" (click)="onClick($event)" (mousedown)="onMouseDown($event)" (mouseup)="onMouseUp($event)" (mouseenter)="onMouseEnter($event)" (mousemove)="onMouseMove($event)" (mouseleave)="onMouseLeave($event)" draggable="true" (dragstart)="itemDragStart($event)" (dragover)="itemDragOver($event, true)" (drop)="itemDragDrop($event)" #dragElem #content>\n                <span *ngIf="icon" class="iui-item-icon" [ngClass]="icon" [style.display]="getIconStatus()"></span>\n                <span *ngIf="text" class="iui-item-label">{{text}}</span>\n                <ng-content></ng-content>\n            </div>\n        </li>\n    ',
inputs:["controlStyle","data","icon","state","text"],outputs:"click mouseDown mouseEnter mouseLeave mouseMove mouseUp".split(" "),encapsulation:core_1.ViewEncapsulation.None}),__metadata("design:paramtypes",[core_1.ElementRef,integralui_common_service_1.IntegralUICommonService,integralui_core_1.IntegralUIBaseService])],a)}(integralui_core_1.IntegralUIItem);exports.IntegralUIListItem=IntegralUIListItem;