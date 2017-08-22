import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
//import { LoaderService } from '../core/loader/loader.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpClient {

    constructor(private http: Http, private localStorageService: LocalStorageService) {
    }

    createAuthorizationHeader(headers: Headers) {
        if (this.localStorageService.get('id_token') != null) {
            headers.append('Authorization', this.localStorageService.get<string>('id_token'));
        }
    }

    get(url: string) {

        //this.showLoader();

        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(url, {
            headers: headers
        }).catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    post(url: string, data: object) {

        //this.showLoader();

        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(url, data, {
            headers: headers
        }).catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    put(url: string, data: object) {

        //this.showLoader();

        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(url, data, {
            headers: headers
        }).catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onEnd();
            });
    }

    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        return Observable.throw(error);
    }

    private onSuccess(res: Response): void {
        console.log('Request successful');
    }

    private onError(res: Response): void {
        console.log('Error, status code: ' + res.status);
    }

    private onEnd(): void {
        //this.hideLoader();
    }

    //private showLoader(): void {
    //    this.loaderService.show();
    //}

    //private hideLoader(): void {
    //    this.loaderService.hide();
    //}
}
