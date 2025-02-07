import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ShoppingService {
    constructor(private http: HttpClient) {}

    private readonly base_url = 'http://localhost:3000/';

    registerShopping(body: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}shopping`, body);
    }

    getValueShoppingByPeriod(period: string): Observable<any> {
        const params = new HttpParams().set('range', period);
        return this.http.get<any>(`${this.base_url}shopping/values`, { params });
    }

    getQuantityOfProductPurchasedByPeriod(period: string): Observable<any> {
        const params = new HttpParams().set('range', period);
        return this.http.get<any>(
            `${this.base_url}shopping/quantity-of-products-purchased`,
            { params }
        );
    }

    getQuantityOfShoppingByPeriod(period: string): Observable<any> {
        const params = new HttpParams().set('range', period);
        return this.http.get<any>(`${this.base_url}shopping/amount`, { params });
    }

    getLatestShopping(): Observable<any>{
        return this.http.get<any>(`${this.base_url}shopping/latest`)
    }
}
