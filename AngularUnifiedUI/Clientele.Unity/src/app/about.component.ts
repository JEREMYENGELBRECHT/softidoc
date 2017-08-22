import { Component, OnInit } from '@angular/core';
import Carservice = require("./carservice");
import CarService = Carservice.CarService;
import { Car } from './cars';

@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./app.component.css', './capsule-app-theme.css'],
    providers: [CarService]

})
export class AboutComponent implements OnInit {

    cars: Car[];

    constructor(private carService: CarService) { }
    
    ngOnInit() {
        //this.carService.getCarsSmall().then(cars => this.cars = <Car[]>cars);
        this.carService.getCarsSmall().subscribe(cars => this.cars = <Car[]>cars);
    }

    
}