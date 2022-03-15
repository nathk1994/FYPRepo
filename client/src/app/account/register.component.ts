import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { Account } from '@app/_models/account';  //

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    //email: any;
    //isLecturer: boolean = true;
    //isLecturer: any; //

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue],
            //isLecturer: ['', Validators.required],
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // isLecturerCitEmail(email) { 
    //     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     if(re.test(email)){
    //         //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //         if(email.indexOf("@cit.ie", email.length - "@cit.ie".length) !== -1){
    //             //VALID
    //             console.log("LECTURER VALID");
    //         }
    //     }
    // }

    // isLecturerMtuEmail(email) { 
    //     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     if(re.test(email)){
    //         //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //         if(email.indexOf("@mtu.ie", email.length - "@mtu.ie".length) !== -1){
    //             //VALID
    //             console.log("LECTURER EMAIL VALID");
    //         }
    //     }
    // }

    // isStudentEmail(email) { 
    //     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     if(re.test(email)){
    //         //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //         if(email.indexOf("@mycit.ie", email.length - "@mycit.ie".length) !== -1){
    //             //VALID
    //             console.log("STUDENT EMAIL VALID");
    //         }
    //     }
    // }

    // public isTestEmail(email) { 
    //     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     if(re.test(email)){
    //         //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //         if(email.indexOf("@hotmail.com", email.length - "@hotmail.com".length) !== -1){
    //             //VALID
    //             console.log("TEST EMAIL VALID");
    //         }
    //     }
    // }

    // public TestFunc() {
    //     console.log('Function is called')    
    // }

    // public isTestEmail() { 
    //     // var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     // if(re.test(email)){
    //         //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //         if(this.form.controls.email.value.indexOf("@hotmail.com", this.form.controls.email.value.length - "@hotmail.com".length) !== -1){
    //             //VALID
    //             console.log("TEST EMAIL VALID");
    //             this.form.controls.isLecturer.patchValue('1'); // Intended way.
    //             //this.isLecturer = false; // optional way, unsure how to implement.
    //         }
    //         else{
    //             console.log("TEST EMAIL INVALID");
    //         }

    //     //}
    // }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        //this.isTestEmail();

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
