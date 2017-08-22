import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Car } from './cars';


@Injectable()
export class CarService {

    public items1: Array<any>;

    data: any;

    constructor(private http: Http) { }

    public getAll(): Promise<Object> {
        return this.http.get('./app/resources/cars-small.json')
            .toPromise()
            .then((response: Response) => {
                return response.json();
            }).catch((err) => {
                console.log(err);
            });
    }

    
    getCarsSmall(): Observable<any> {

        //return this.http.get('./app/resources/cars-small.json')
        //    .toPromise()
        //    .then((res: Response) => <Car[]>res.json().data)
        //    .then(data => { return data; });

        //return this.http
        //    .get('./app/resources/cars-small.json')
        //    .map((response: Response) => response.json().data)
        //    .toPromise();

        return this.http.get('./app/resources/cars-small.json')
            .map(this.extractData)
            .catch(this.handleError);

        // Subscribe to the observable, so when data is ready add it to the TreeView
        //obj.subscribe(data => data, error => console.log(error));

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