import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { TreeNode } from 'primeng/primeng';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class NodeService {



    constructor(private http: Http) { }

    
    getFiles(): Observable<any> {

        //return this.http.get('./app/treeview/files.json')
        //    .toPromise()
        //    .then((res: Response) => <TreeNode[]>res.json().data)
        //    .then(data => { return data; });

        return this.http.get('./app/treeview/files.json')
            .map(this.extractData)
            .catch(this.handleError);

    }

    private extractData(res: Response) {
        let obj = res.json().data;
        return obj || {};
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}