import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';

import { LocalStorageModule } from 'angular-2-local-storage';

import { IntegralUIModule } from './integralui/integralui.module';

import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar.component';
import { AboutComponent } from './about.component';
import { CoursesComponent } from './courses.component'
import { TreeviewComponent } from './treeview.component'

import { Login } from './login/login';

import { HttpClient } from './common/httpClient.service';
import { httpServiceFactory } from './common/httpClient.factory';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';


import { AppRoutingModule } from './app-routing.module';
import Notificationservice = require("./common/notificationService/notification.service");
import NotificationService = Notificationservice.NotificationService;



import { LocalStorageService } from 'angular-2-local-storage';

@NgModule({
    imports: [BrowserModule, AppRoutingModule, IntegralUIModule, FormsModule, HttpModule, MaterialModule, BrowserAnimationsModule, CalendarModule, DataTableModule, SharedModule, TreeModule,
        LocalStorageModule.withConfig({
        prefix: 'my-app',
        storageType: 'localStorage'
        })
    ],
    declarations: [AppComponent, NavbarComponent, AboutComponent, CoursesComponent, TreeviewComponent, Login],
    bootstrap: [AppComponent],
    providers: [NotificationService,
        {
            provide: HttpClient,
            useFactory: httpServiceFactory,
            deps: [LocalStorageService]
            }]
   
})
export class AppModule { }
