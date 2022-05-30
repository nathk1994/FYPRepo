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

}
