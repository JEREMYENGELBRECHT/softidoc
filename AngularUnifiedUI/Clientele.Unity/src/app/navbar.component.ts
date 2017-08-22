import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./app.component.css', './capsule-app-theme.css']
    
})
export class NavbarComponent {

    @Output() onLoggedOut = new EventEmitter<boolean>();

    constructor() {
        
    }

    logout() {
        this.onLoggedOut.emit(true);
    }
}