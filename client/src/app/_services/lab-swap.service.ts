import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { LabSwap } from '@app/_models';
import { Account } from '@app/_models';
import { BehaviorSubject, Observable } from 'rxjs';

const baseUrl = `${environment.apiUrl}/lab-swaps`;

@Injectable({ providedIn: 'root' })
export class LabSwapService {
    private labSwapSubject: BehaviorSubject<LabSwap>;
    public labSwap: Observable<LabSwap>;

    constructor(
        private http: HttpClient
    ) { 
        this.labSwapSubject = new BehaviorSubject<LabSwap>(null);
        this.labSwap = this.labSwapSubject.asObservable();
    }

    public get labSwapValue(): LabSwap {
        return this.labSwapSubject.value;
    }

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

    notifyLecturer(params: any, account: Account) {
        return this.http.post(`${baseUrl}/notifyLecturer`, {params, account}); 
        
    }

    // notifyLecturer(account: Account) {
    //     return this.http.post(`${baseUrl}/notifyLecturer`, account);
    // }

    // createdBy(labSwap: LabSwap): Observable<LabSwap> {
    //     return this.http.post<LabSwap>(this.heroesUrl, labSwap, httpOptions)
    //       .pipe(
    //         catchError(this.handleError('addLabSwap', labSwap))
    //     );
    // }
}


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