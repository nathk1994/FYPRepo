import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
// import { LabSwapService } from './_services'; //new
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { LabSwapHomeComponent } from './lab-swap-home';
import { ModalModule } from './_modal';
//import { ModalComponent } from './_modal/modal.component';

// used to create fake backend
//import { fakeBackendProvider } from './_helpers';



@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        ModalModule,
        //LabSwapHomeComponent
    ],

    declarations: [
        AppComponent,
        AlertComponent,
        //ModalComponent,
        LabSwapHomeComponent
    ],

    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        //fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }