import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { IntegralUIModule } from './integralui/integralui.module';

import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar.component';
import { AboutComponent } from './about.component';
import { CoursesComponent } from './courses.component'
import { TreeviewComponent} from './treeview.component'

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    imports: [BrowserModule, AppRoutingModule, IntegralUIModule, FormsModule, HttpModule],
    declarations: [AppComponent, NavbarComponent, AboutComponent, CoursesComponent, TreeviewComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
