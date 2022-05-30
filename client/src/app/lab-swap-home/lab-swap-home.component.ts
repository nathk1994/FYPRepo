import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AccountService, LabSwapService, AlertService } from '@app/_services';
import { ModalService } from '../_modal';

@Component({ templateUrl: 'lab-swap-home.component.html', styleUrls: ['./lab-swap-home.component.scss'] })
export class LabSwapHomeComponent implements OnInit {
    account = this.accountService.accountValue;
    labSwap = this.labSwapService.labSwapValue;
    isAdmin: boolean = false
    isLecturer: boolean = false
    isStudent: boolean = false
    labSwapForm!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;
    labSwaps: any[];
    accounts: any[];
    currentLabSwap = null;
    isDeleting;
    mySubscription;

    constructor(
        public modalService: ModalService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private labSwapService: LabSwapService,
        private alertService: AlertService,
    )
    {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.mySubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
            // Trick the Router into believing it's last link wasn't previously loaded
            this.router.navigated = false;
            }
        }); 
    } 

    ngOnInit() { // void?
        this.isAdminEmail();
        this.isStudentEmail();
        this.isLecturerEmail();
        this.isLecturerEmail2();

        this.retrieveAccounts();

        if (this.isLecturer == true)
            this.retrieveLabSwapsByCreator();
        else if (this.isAdmin == true)
            this.retrieveLabSwaps();
        else if (this.isStudent == true)
            this.retrieveLabSwapsByClassGroup();


        this.id = this.route.snapshot.params['id'];

        this.labSwapForm = this.formBuilder.group({
            labName: ['', Validators.required],
            labDate: ['', Validators.required],
            labTime: ['', Validators.required],
            classGroup: ['', Validators.required],
            room: [''],
            availableLabSlotsNumber: ['', Validators.required],
            createdBy: [this.account.email],
        }); 
        
    }

    ngOnDestroy(){
        if (this.mySubscription) {
          this.mySubscription.unsubscribe();
        }
    }

    reload(){
        this.router.navigate([this.router.url])
    }

    // Implmented account type check here instead, and then set this.isLecturer = true;
    public isAdminEmail() { 

            //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
            if(this.account.email.indexOf("@hotmail.com", this.account.email.length - "@hotmail.com".length) !== -1){
                //VALID
                console.log("ADMIN EMAIL VALID");
                this.isAdmin = true; // working!
            }
            else{
                console.log("ADMIN EMAIL INVALID");
            }
    }

    public isStudentEmail() { 
            if(this.account.email.indexOf("@mycit.ie", this.account.email.length - "@mycit.ie".length) !== -1){
                //VALID
                console.log("STUDENT EMAIL VALID");
                this.isStudent = true;
            }
            else{
                console.log("STUDENT EMAIL INVALID");
            }
    }

    public isLecturerEmail() { 
            if(this.account.email.indexOf("@mtu.ie", this.account.email.length - "@mtu.ie".length) !== -1){
                //VALID
                console.log("LECTURER EMAIL VALID");
                this.isLecturer = true;
            }
            else{
                console.log("LECTURER EMAIL INVALID");
            }
    }

    public isLecturerEmail2() { 
            if(this.account.email.indexOf("@cit.ie", this.account.email.length - "@cit.ie".length) !== -1){
                //VALID
                console.log("LECTURER EMAIL 2 VALID");
                this.isLecturer = true;
            }
            else{
                console.log("LECTURER EMAIL 2 INVALID");
            }
    }

    openModal(id: string) {
        this.modalService.open(id);
    }

    public closeModal(id: string) {
        this.modalService.close(id);
    }

    retrieveLabSwapsByClassGroup(): void {
        this.labSwapService.getAll()
          .subscribe(
            data => {
              this.labSwaps = data.filter(labSwap => labSwap.classGroup === this.account.accountClassGroup);
              console.log(data);
            },
            error => {
              console.log(error);
            });
    }

    retrieveLabSwapsByCreator(): void {
        this.labSwapService.getAll()
          .subscribe(
            data => {
              this.labSwaps = data.filter(labSwap => labSwap.createdBy === this.account.email);
              console.log(data);
            },
            error => {
              console.log(error);
            });
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
        this.createLabSwap();
        this.modalService.close("add-modal-1");
        this.reload(); // will cause form submission cancelled error in console but sends form anyway..
    }

    private createLabSwap() {
        this.labSwapService.create(this.labSwapForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Lab Swap Created', { keepAfterRouteChange: true });
                this.router.navigate(['/lab'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
            
    }

    updateLabSwap(id: string) {
        this.labSwapService.update(this.id, this.labSwapForm.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Lab Swap Updated', { keepAfterRouteChange: true });
                this.router.navigate(['/lab'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    public deleteLabSwap(id: string) {
        if (confirm('Are you sure you want to delete this lab?')) {
            const labSwap = this.labSwaps.find(x => x.id === id);
            labSwap.isDeleting = true;
            this.labSwapService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.alertService.success('Lab Swap Deleted', { keepAfterRouteChange: true });
                    this.labSwaps = this.labSwaps.filter(x => x.id !== id) 
                });
        }
    }

    notifyLecturer(id: string) { 
        if (confirm('Are you sure you want to reserve a slot for this lab?')) {
            const labSwap = this.labSwaps.find(x => x.id === id);
            this.labSwapService.notifyLecturer(labSwap, this.account) //this.labSwapV 
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.alertService.success('Lab slot reserved. Lecturer has been notified!', { keepAfterRouteChange: true });
                        this.router.navigate(['/lab'], { relativeTo: this.route });
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                    }
                });
        }
    }
}
