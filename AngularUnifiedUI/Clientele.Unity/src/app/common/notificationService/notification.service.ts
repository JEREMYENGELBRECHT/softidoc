import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Injectable()
export class NotificationService {
    constructor(private snackBar: MdSnackBar) { }

    public showMessage(title: string, body: string) {
        this.snackBar.open(title, body, { duration: 3000 });
    }

    public showError(title: string, body: string) {
        let config = new MdSnackBarConfig();
        config.duration = 3000;
        config.extraClasses = ['notification-error'];
        this.snackBar.open(title, body, config);
    }
}