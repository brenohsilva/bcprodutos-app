import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class DashboardService {
    constructor(private http: HttpClient) {}

    private readonly base_url = environment.BASE_URL;

    getProductsStockQuantity(): Observable<any> {
        return this.http.get<any>(`${this.base_url}products/stocks/quantity`);
    }

    getIndividualProductStockQuantity(): Observable<any> {
        return this.http.get<any>(
            `${this.base_url}products/stocks/quantity-by-name`
        );
    }

    getMontlyBalance(month: number): Observable<any> {
        const params = new HttpParams().set('month', month.toString());
        return this.http.get<any>(`${this.base_url}overview/balance`, {
            params,
        });
    }

    getMontlyProfit(month: number): Observable<any> {
        const params = new HttpParams().set('month', month.toString());
        return this.http.get<any>(`${this.base_url}overview/profits`, {
            params,
        });
    }

    getStockRevenue(): Observable<any> {
        return this.http.get<any>(`${this.base_url}overview/revenue`);
    }

    getDailyProfits(month: number): Observable<any> {
        const params = new HttpParams().set('month', month.toString());
        return this.http.get<any>(`${this.base_url}overview/daily-profits`, {
            params,
        });
    }
}
