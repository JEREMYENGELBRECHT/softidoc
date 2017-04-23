import { Component, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import Integraluitreeview = require("./integralui/components/integralui.treeview");
import IntegralUITreeView = Integraluitreeview.IntegralUITreeView;

@Component({
    selector: 'treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TreeviewComponent {
    // An Array object that holds all item objects shown in TreeView
    // It is set as a list of any custom objects, you can use any custom fields and data bind them with TreeView using its properties
    public items: Array<any>;

    // Get a reference of application view
    @ViewChild('application', { read: ViewContainerRef }) applicationRef: ViewContainerRef;
    @ViewChild('treeview') treeview: IntegralUITreeView;

    // Editor settings
    private isEditActive: boolean = false;
    private editItem: any = null;
    private originalText: string = '';
    private editorFocused: boolean = false;
    private hoverItem: any =  null;

    // Initialize items in component constructor
    constructor() {
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

    showEditor(item: any) {
        this.originalText = item.text;
        this.isEditActive = true;
        this.editItem = item;
        this.editorFocused = true;
    }

    closeEditor() {
        this.editItem = null;
        this.originalText = '';
        this.editorFocused = false;
    }

    editorKeyDown(e: any) {
        if (this.editItem) {
            switch (e.keyCode) {
            case 13: // ENTER
                this.closeEditor();
                break;

            case 27: // ESCAPE
                this.editItem.text = this.originalText;
                this.closeEditor();
                break;
            }
        }
    }

    editorLostFocus() {
        if (this.editItem)
            this.editItem.text = this.originalText;

        this.closeEditor();
    }

    private onItemClick(e: any) {
        alert("im here");
    }

    private onBeforeExpand(e: any) {
        let self = this;

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
    }

}