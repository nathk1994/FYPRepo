import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, LabSwapService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    account = this.accountService.accountValue;
    labSwapForm!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private labSwapService: LabSwapService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        //const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
        this.labSwapForm = this.formBuilder.group({
            swapCandidateOne: ['', Validators.required],
            swapRequestDetail: ['', Validators.required],
            //password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            //confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
        }); //formOptions

        if (!this.isAddMode) {
            this.labSwapService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.labSwapForm.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.labSwapForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.labSwapForm.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createLabSwap();
        } else {
            this.updateLabSwap();
        }
    }

    private createLabSwap() {
        this.labSwapService.create(this.labSwapForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Lab Swap Created', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateLabSwap() {
        this.labSwapService.update(this.id, this.labSwapForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Lab Swap updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}

// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AccountService, AlertService, LabSwapService } from '@app/_services';
// import { first } from 'rxjs/operators';


// @Component({ templateUrl: 'home.component.html' })
// export class HomeComponent {
//     account = this.accountService.accountValue;
//     labSwap = this.labSwapService.labSwapValue;
//     loading = false;
//     submitted = false;
//     labSwapForm: FormGroup;

//     constructor(
//         private accountService: AccountService,
//         private labSwapService: LabSwapService,
//         private formBuilder: FormBuilder,
//         private router: Router,
//         private alertService: AlertService,
//         private route: ActivatedRoute,
//     ) { }

//     ngOnInit() {
//         this.labSwapForm = this.formBuilder.group({
//             //id: this.formBuilder.control(null, Validators.required),
//             swapCandidateOne: this.formBuilder.control(null),
//             swapRequestDetail: this.formBuilder.control(null)
//             // swapCandidateOne: [this.labSwap.swapCandidateOne, Validators.required],
//             // swapRequestDetail: [this.labSwap.swapRequestDetail, Validators.required],
//         });
//     }

//     get f() { 
//         return this.labSwapForm.controls; 
//     }

//     onSubmit() {
//         debugger;

//         // reset alerts on submit
//         //this.alertService.clear();

//         // stop here if form is invalid
//         if (this.labSwapForm.invalid) {
//             return;
//         }

//         this.loading = true;
//         this.labSwapService.update(this.labSwap.id, this.labSwapForm.value) //issue with id here
//             .pipe(first())
//             .subscribe({
//                 next: () => {
//                     this.alertService.success('Lab Swap Created successfully', { keepAfterRouteChange: true });
//                     this.router.navigate(['../'], { relativeTo: this.route });
//                 },
//                 error: error => {
//                     this.alertService.error(error);
//                     this.loading = false;
//                 }
//             });
//         debugger;
//     }
// }