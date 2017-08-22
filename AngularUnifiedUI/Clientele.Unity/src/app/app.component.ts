import { Component } from '@angular/core';


@Component({
    selector: 'my-app',
    template: `
        <login [hidden]="showLogin" (onLoggedIn)="login()"></login>
        <navbar [hidden]="showNavbar" (onLoggedOut)="Logout()"></navbar>
        
        
    `,
})
export class AppComponent {

    showLogin: boolean;
    showNavbar: boolean;

    constructor() {
        this.showLogin = false;
        this.showNavbar = true;
    }

    login() {
        this.showLogin = true;
        this.showNavbar = false;
    }

    Logout() {
        this.showLogin = false;
        this.showNavbar = true;
    }

    
}


