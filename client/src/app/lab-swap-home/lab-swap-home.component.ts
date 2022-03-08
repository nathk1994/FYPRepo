﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
// import { MustMatch } from '@app/_helpers';
import { AccountService, LabSwapService, AlertService } from '@app/_services';
import { LabSwap } from '@app/_models/labSwap';
import { ModalService } from '../_modal';

@Component({ templateUrl: 'lab-swap-home.component.html', styleUrls: ['./lab-swap-home.component.scss'] })
export class LabSwapHomeComponent implements OnInit {
    account = this.accountService.accountValue;
    //labSwap = this.labSwapService.labSwapValue;
    labSwap: LabSwap;
    labSwapForm!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    labSwaps: any[];
    accounts: any[];
    currentLabSwap = null;
    //labSwap?: LabSwap[];

    constructor(
        public modalService: ModalService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private labSwapService: LabSwapService,
        private alertService: AlertService
    ) {}

    ngOnInit() { // void?
        this.retrieveAccounts();
        this.retrieveLabSwaps();
        // this.getLabSwap(this.route.snapshot.paramMap.get('id'));
        // this.labSwapService.getAll()
        // .subscribe(
        //   data => {
        //     this.labSwaps = data;
        //     console.log(data);
        //   },
        //   error => {
        //     console.log(error);
        // });

        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        this.accountService.getAll()
            .pipe(first())
            .subscribe(accounts => this.accounts = accounts);

        // this.labSwapService.getAll()
        //     .pipe(first())
        //     .subscribe(labSwaps => this.labSwaps = labSwaps);
        
        
        // password not required in edit mode
        // const passwordValidators = [Validators.minLength(6)];
        // if (this.isAddMode) {
        //     passwordValidators.push(Validators.required);
        // }

        //const formOptions: AbstractControlOptions = { validators: MustMatch('password', 'confirmPassword') };
        this.labSwapForm = this.formBuilder.group({
            swapCandidateOne: ['', Validators.required],
            swapRequestDetail: ['', Validators.required],
            //password: ['', [Validators.minLength(6), this.isAddMode ? Validators.required : Validators.nullValidator]],
            //confirmPassword: ['', this.isAddMode ? Validators.required : Validators.nullValidator]
        }); //formOptions

        if (!this.isAddMode) { // (!this.isAddMode)
            this.labSwapService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.labSwapForm.patchValue(x));
        }
    }

    openModal(id: string) {
        this.modalService.open(id);
    }

    public closeModal(id: string) {
        this.modalService.close(id);
    }

    retrieveLabSwaps(): void {
        this.labSwapService.getAll()
          .subscribe(
            data => {
              this.labSwaps = data;
              console.log(data);
            },
            error => {
              console.log(error);
            });
    }

    retrieveAccounts(): void {
        this.accountService.getAll()
          .subscribe(
            data => {
              this.accounts = data;
              console.log(data);
            },
            error => {
              console.log(error);
            });
    }

    // convenience getter, for easy access to form fields
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

        this.modalService.close; // investigate, not working
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


// @Component({ templateUrl: 'lab-swap-home.component.html' })
// export class LabSwapHomeComponent {
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