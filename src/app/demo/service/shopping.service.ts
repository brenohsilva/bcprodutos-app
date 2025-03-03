import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ShoppingService {
    constructor(private http: HttpClient) {}

    private readonly base_url = environment.BASE_URL;

    registerShopping(body: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}shopping`, body);
    }

    getValueShoppingByPeriod(period: string, month: number): Observable<any> {
        const params = new HttpParams()
            .set('range', period)
            .set('month', month.toString());
        return this.http.get<any>(`${this.base_url}shopping/values`, {
            params,
        });
    }

    getQuantityOfProductPurchasedByPeriod(
        period: string,
        month: number
    ): Observable<any> {
        const params = new HttpParams()
            .set('range', period)
            .set('month', month.toString());
        return this.http.get<any>(
            `${this.base_url}shopping/quantity-of-products-purchased`,
            { params }
        );
    }

    getQuantityOfShoppingByPeriod(
        period: string,
        month: number
    ): Observable<any> {
        const params = new HttpParams()
            .set('range', period)
            .set('month', month.toString());
        return this.http.get<any>(`${this.base_url}shopping/amount`, {
            params,
        });
    }

    getLatestShopping(): Observable<any> {
        return this.http.get<any>(`${this.base_url}shopping/latest`);
    }
}
