import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers';

import * as _ from 'lodash';

@Component({ templateUrl: 'update.component.html' })
export class UpdateComponent implements OnInit {

    @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
    fileInputLabel: string;
    account = this.accountService.accountValue;
    form: FormGroup;
    loading = false;
    submitted = false;
    deleting = false;

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: [this.account.title, Validators.required],
            firstName: [this.account.firstName, Validators.required],
            lastName: [this.account.lastName, Validators.required],
            email: [this.account.email, [Validators.required, Validators.email]],
            password: ['', [Validators.minLength(6)]],
            confirmPassword: [''],
            uploadedImage: ['']
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }

    // convenience getter for easy access to form fields 
    get f() { 
        return this.form.controls; 
    }

    onFileSelect(event) {
        const file = event.target.files[0];
        this.fileInputLabel = file.name;
        this.form.get('uploadedImage').setValue(file);
    }

    onSubmit() {
        //debugger;
        // if (!this.form.get('uploadedImage').value) {
        //     alert('Please select an image to upload!');
        //     return false;
        // }
      
          const formData = new FormData();
          formData.append('uploadedImage', this.form.get('uploadedImage').value);
          formData.append('agentId', '007');
      
      
          this.http
            .post<any>('http://localhost:4000/uploadedImages', formData).subscribe(response => {
              console.log(response);
              if (response.statusCode === 200) {
                // Reset the file input
                this.uploadFileInput.nativeElement.value = "";
                this.fileInputLabel = undefined;
              }
            }, er => {
              console.log(er);
              alert(er.error.error);
            });
        
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.update(this.account.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
        //debugger;
    }

    onDelete() {
        if (confirm('Are you sure?')) {
            this.deleting = true;
            this.accountService.delete(this.account.id)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Account deleted successfully', { keepAfterRouteChange: true });
                });
        }
    }
}