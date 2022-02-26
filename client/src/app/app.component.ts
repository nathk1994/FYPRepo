import { Component } from '@angular/core';

import { AccountService } from './_services';
import { Account, Role } from './_models';

// tslint:disable-next-line: component-selector
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    Role = Role;
    account: Account;

    constructor(private accountService: AccountService) {
        this.accountService.account.subscribe(x => this.account = x);
    }

    // tslint:disable-next-line: typedef
    logout() {
        this.accountService.logout();
    }
}
