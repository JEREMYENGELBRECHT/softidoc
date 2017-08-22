import { Component, ViewEncapsulation, ViewChild, ViewContainerRef, OnInit } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { TreeNode } from 'primeng/primeng';

import NodeService = require("./treeview/NodeService");
import NodeService1 = NodeService.NodeService;

@Component({
    selector: 'treeview',
    templateUrl: './treeview.component.html',
    styleUrls: ['./treeview.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [NodeService1]
})
export class TreeviewComponent implements OnInit {
    
    files: TreeNode[];

    selectedFile: TreeNode;

    // Initialize items in component constructor
    constructor(private http: Http, private nodeService: NodeService1) {}


    ngOnInit() {
        //this.nodeService.getFiles().then(files => this.files = <TreeNode[]>files);
        this.nodeService.getFiles().subscribe(files => this.files = <TreeNode[]>files);

    }
    
}