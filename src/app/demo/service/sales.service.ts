import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SalesService {
    constructor(private http: HttpClient) {}

    private readonly base_url = 'http://localhost:3000/';

    registerSale(body: any): Observable<any> {
        console.log(body)
        return this.http.post<any>(`${this.base_url}sales`, body)
            
    }
}
