import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { LabSwap } from '@app/_models';

const baseUrl = `${environment.apiUrl}/lab-swaps`;

@Injectable({ providedIn: 'root' })
export class LabSwapService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<LabSwap[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<LabSwap>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}

// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { map, finalize } from 'rxjs/operators';

// import { environment } from '@environments/environment';
// import { LabSwap } from '@app/_models';

// //const baseUrl = `${environment.apiUrl}/accounts`;
// const baseUrl = `${environment.apiUrl}/lab-swaps`;
// //const baseUrl = `${environment.apiUrl}/lab-swap-home`;

// @Injectable({ providedIn: 'root' })
// export class LabSwapService {
//     private labSwapSubject: BehaviorSubject<LabSwap>;
//     public labSwap: Observable<LabSwap>;

//     constructor(
//         private router: Router,
//         private http: HttpClient
//     ) {
//         this.labSwapSubject = new BehaviorSubject<LabSwap>(null);
//         //this.labSwap = this.labSwapSubject.asObservable(); // - labSwap is an observable. We cannot get id by doing "this.labSwap.id"?
//     }

//     public get labSwapValue(): LabSwap {
//         return this.labSwapSubject.value;
//     }

//     // login(email: string, password: string) {
//     //     return this.http.post<any>(`${baseUrl}/authenticate`, { email, password }, { withCredentials: true })
//     //         .pipe(map(labSwap => {
//     //             this.labSwapSubject.next(labSwap);
//     //             this.startRefreshTokenTimer();
//     //             return labSwap;
//     //         }));
//     // }

//     logout() {
//         this.http.post<any>(`${baseUrl}/revoke-token`, {}, { withCredentials: true }).subscribe();
//         this.stopRefreshTokenTimer();
//         this.labSwapSubject.next(null);
//         this.router.navigate(['/account/login']);
//     }

//     // refreshToken() {
//     //     return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
//     //         .pipe(map((labSwap) => {
//     //             this.labSwapSubject.next(labSwap);
//     //             this.startRefreshTokenTimer();
//     //             return labSwap;
//     //         }));
//     // }

//     getAll() {
//         return this.http.get<LabSwap[]>(baseUrl);
//     }

//     getById(id: string) {
//         return this.http.get<LabSwap>(`${baseUrl}/${id}`);
//     }
    
//     create(params) {
//         return this.http.post(baseUrl, params);
//     }
    
//     update(id, params) {
//         return this.http.put(`${baseUrl}/${id}`, params)
//             .pipe(map((labSwap: any) => {
//                 // update the current lab swap if it was updated
//                 if (labSwap.id === this.labSwapValue.id) {
//                     // publish updated lab swap to subscribers
//                     labSwap = { ...this.labSwapValue, ...labSwap };
//                     this.labSwapSubject.next(labSwap);
//                 }
//                 return labSwap;
//             }));
//     }
    
//     // delete(id: string) {
//     //     return this.http.delete(`${baseUrl}/${id}`)
//     //         .pipe(finalize(() => {
//     //             // auto logout if the logged in account was deleted
//     //             if (id === this.labSwapValue.id)
//     //                 this.logout();
//     //         }));
//     // }

//     // helper methods

//     private refreshTokenTimeout;

//     // private startRefreshTokenTimer() {
//     //     // parse json object from base64 encoded jwt token
//     //     const jwtToken = JSON.parse(atob(this.labSwapValue.jwtToken.split('.')[1]));

//     //     // set a timeout to refresh the token a minute before it expires
//     //     const expires = new Date(jwtToken.exp * 1000);
//     //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
//     //     this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
//     // }

//     private stopRefreshTokenTimer() {
//         clearTimeout(this.refreshTokenTimeout);
//     }
// }