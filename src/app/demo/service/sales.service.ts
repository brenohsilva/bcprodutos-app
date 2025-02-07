import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SalesService {
    constructor(private http: HttpClient) {}

    private readonly base_url = 'http://localhost:3000/';

    registerSale(body: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}sales`, body)   
    }

    getValueSalesByPeriod(period: string): Observable<any> {
        const params = new HttpParams().set('range', period);
        return this.http.get<any>(`${this.base_url}sales/values`, { params });
    }

    getQuantityOfProductSoldByPeriod(period: string):Observable<any>{
        const params = new HttpParams().set('range', period);
        return this.http.get<any>(`${this.base_url}sales/quantity-of-products-sold`, { params });
    }

    getQuantityOfSalesByPeriod(period: string): Observable<any>{
        const params = new HttpParams().set('range', period);
        return this.http.get<any>(`${this.base_url}sales/amount`, { params });
    }

    getlatestSales(): Observable<any>{
        return this.http.get<any>(`${this.base_url}sales/last-sales`);
    }

    
    
}
