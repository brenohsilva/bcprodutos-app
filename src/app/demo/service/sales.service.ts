import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SalesService {
    constructor(private http: HttpClient) {}

    private readonly base_url = environment.BASE_URL;

    registerSale(body: any): Observable<any> {
        return this.http.post<any>(`${this.base_url}sales`, body);
    }

    getValueSalesByPeriod(period: string, month: number): Observable<any> {
        const params = new HttpParams()
            .set('range', period)
            .set('month', month.toString());
        return this.http.get<any>(`${this.base_url}sales/values`, { params });
    }

    getQuantityOfProductSoldByPeriod(
        period: string,
        month: number
    ): Observable<any> {
        const params = new HttpParams()
            .set('range', period)
            .set('month', month.toString());
        return this.http.get<any>(
            `${this.base_url}sales/quantity-of-products-sold`,
            { params }
        );
    }

    getQuantityOfSalesByPeriod(period: string, month: number): Observable<any> {
        const params = new HttpParams()
            .set('range', period)
            .set('month', month.toString());
        return this.http.get<any>(`${this.base_url}sales/amount`, { params });
    }

    getlatestSales(month: number): Observable<any> {
        const params = new HttpParams().set('month', month.toString());
        return this.http.get<any>(`${this.base_url}sales/last-sales`, {
            params,
        });
    }

    getDailySales(): Observable<any> {
        return this.http.get<any>(`${this.base_url}sales/daily-sales`);
    }
}
