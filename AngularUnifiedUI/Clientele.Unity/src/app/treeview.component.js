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
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
var Integraluitreeview = require("./integralui/components/integralui.treeview");
var IntegralUITreeView = Integraluitreeview.IntegralUITreeView;
var TreeviewComponent = (function () {
    // Initialize items in component constructor
    function TreeviewComponent() {
        // Editor settings
        this.isEditActive = false;
        this.editItem = null;
        this.originalText = '';
        this.editorFocused = false;
        this.hoverItem = null;
        this.items = [
            {
                id: 1,
                text: "Favorites",
                icon: "computer-icons favorites",
                items: [
                    { id: 11, pid: 1, text: "Desktop", icon: "computer-icons empty-doc" },
                    { id: 12, pid: 1, text: "Downloads", icon: "computer-icons downloads" }
                ]
            },
            {
                id: 2,
                text: "Libraries",
                icon: "computer-icons folder",
                items: [
                    {
                        id: 21,
                        pid: 2,
                        text: "Documents",
                        icon: "computer-icons documents",
                        expanded: false,
                        items: [
                            { id: 211, pid: 21, text: "My Documents", icon: "computer-icons empty-doc" },
                            { id: 212, pid: 21, text: "Public Documents", icon: "computer-icons empty-doc" }
                        ]
                    },
                    { id: 22, pid: 2, text: "Music", icon: "computer-icons music" },
                    { id: 23, pid: 2, text: "Pictures", icon: "computer-icons pictures" },
                    { id: 24, pid: 2, text: "Videos", icon: "computer-icons videos" }
                ]
            },
            {
                id: 3,
                text: "Computer",
                icon: "computer-icons pc",
                expanded: false,
                items: [
                    { id: 31, pid: 3, text: "Local Disk (C:)", icon: "computer-icons disk" },
                    { id: 32, pid: 3, text: "Storage (D:)", icon: "computer-icons disk" }
                ]
            },
            { id: 4, text: "Network", icon: "computer-icons network" },
            { id: 5, text: "Recycle Bin", icon: "computer-icons recycle" }
        ];
    }
    TreeviewComponent.prototype.showEditor = function (item) {
        this.originalText = item.text;
        this.isEditActive = true;
        this.editItem = item;
        this.editorFocused = true;
    };
    TreeviewComponent.prototype.closeEditor = function () {
        this.editItem = null;
        this.originalText = '';
        this.editorFocused = false;
    };
    TreeviewComponent.prototype.editorKeyDown = function (e) {
        if (this.editItem) {
            switch (e.keyCode) {
                case 13:
                    this.closeEditor();
                    break;
                case 27:
                    this.editItem.text = this.originalText;
                    this.closeEditor();
                    break;
            }
        }
    };
    TreeviewComponent.prototype.editorLostFocus = function () {
        if (this.editItem)
            this.editItem.text = this.originalText;
        this.closeEditor();
    };
    TreeviewComponent.prototype.onItemClick = function (e) {
        alert("im here");
    };
    TreeviewComponent.prototype.onBeforeExpand = function (e) {
        var self = this;
        if (e.item.items && e.item.items.length == 0) {
            // Replace the expanding icon with a loading icon
            self.treeview.beginLoad(e.item);
            //let loadTimer = setTimeout(function () {
            //    // Get random number of child items
            //    let count: number = self.getChildCount();
            //    for (let i = 1; i <= count; i++) {
            //        // Create a child item
            //        let childItem: any = {
            //            expanded: false,
            //            hasChildren: self.itemHasChildren(),
            //            items: [],
            //            text: e.item.text + i
            //        }
            //        // Add the child item to the expanding item
            //        e.item.items.push(childItem);
            //    }
            //    // Restore the expanding icon
            //    self.treeview.endLoad(e.item);
            //    // Update the appareance of the TreeView
            //    self.treeview.refresh();
            //    clearTimeout(loadTimer);
            //}, 1000);
        }
    };
    return TreeviewComponent;
}());
__decorate([
    core_1.ViewChild('application', { read: core_1.ViewContainerRef }),
    __metadata("design:type", core_1.ViewContainerRef)
], TreeviewComponent.prototype, "applicationRef", void 0);
__decorate([
    core_1.ViewChild('treeview'),
    __metadata("design:type", IntegralUITreeView)
], TreeviewComponent.prototype, "treeview", void 0);
TreeviewComponent = __decorate([
    core_1.Component({
        selector: 'treeview',
        templateUrl: './treeview.component.html',
        styleUrls: ['./treeview.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [])
], TreeviewComponent);
exports.TreeviewComponent = TreeviewComponent;
//# sourceMappingURL=treeview.component.js.map