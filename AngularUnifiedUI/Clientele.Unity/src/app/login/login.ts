import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import { LocalStorageService } from 'angular-2-local-storage';
import Notificationservice = require("../common/notificationService/notification.service");
import NotificationService = Notificationservice.NotificationService;
import HttpClientservice = require("../common/httpClient.service");
import HttpClient = HttpClientservice.HttpClient;
//import { AppConfig } from '../config/app.config';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['../../capsule-app-theme.css', './login.css']
})

export class Login {

    @Output() onLoggedIn = new EventEmitter<boolean>();

  constructor(public router: Router, public http: Http, private notificationService: NotificationService, private localStorageService: LocalStorageService, private httpClient: HttpClient) { }

  login() {

      this.onLoggedIn.emit(true);

    //this.http.post("", {}, { headers: contentHeaders, withCredentials: true, })
    //  .subscribe(
    //  response => {
    //    let tokenType = response.json().token_type;
    //    let token = response.json().access_token;

    //    this.localStorageService.set('id_token', tokenType + " " + token);

    //    //this.fetchLoggedInUsersDetails();
    //  },
    //  error => {
    //    alert(error.text());
    //    console.log(error.text());
    //  });
  }

  fetchLoggedInUsersDetails() {

    //this.httpClient.get("")
    //  .subscribe(
    //  response => {
    //    let responseJson = response.json();
    //    let user = responseJson.user;
    //    let claims = responseJson.claims;

    //    this.localStorageService.set('user', user);
    //    this.localStorageService.set('claims', claims);

    //    this.notificationService.showMessage("Welcome " + user.givenName, "Logged In");
    //    this.router.navigate(['/dashboard']);
    //  },
    //  error => {
    //    alert(error.text());
    //    console.log(error.text());
    //  });
    
  }
}
