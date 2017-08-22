import { HttpClient } from './httpClient.service';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
//import { LoaderService } from '../core/loader/loader.service';

function httpServiceFactory(http: Http, localStorageService: LocalStorageService) {
    return new HttpClient(http, localStorageService);
}

export { httpServiceFactory };