import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about.component';
import { CoursesComponent } from './courses.component'

const routes: Routes = [
    { path: '', redirectTo: 'navbar', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'courses', component: CoursesComponent }
    
    
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }