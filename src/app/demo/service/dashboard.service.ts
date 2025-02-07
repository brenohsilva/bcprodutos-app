import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {
    constructor(private http: HttpClient) {}

    private readonly base_url = 'http://localhost:3000/';

    getProductsStockQuantity() : Observable<any>{
        return this.http.get<any>(`${this.base_url}products/stocks/quantity`)
    }

    getIndividualProductStockQuantity() : Observable<any>{
        return this.http.get<any>(`${this.base_url}products/stocks/quantity-by-name`)
    }

    getMontlyBalance() : Observable<any>{
        return this.http.get<any>(`${this.base_url}overview/profit`)
    }

    getStockRevenue(): Observable<any> {
        return this.http.get<any>(`${this.base_url}overview/revenue`)
    }


}
