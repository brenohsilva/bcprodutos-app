import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) {}

   private readonly base_url = environment.BASE_URL;

    getProductsSmall() {
        return this.http
            .get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProducts(): Observable<any> {
        return this.http.get<any>(this.base_url + 'products')
            
    }

    getLastProductsSold():Observable<any>{
        return this.http.get<any>(`${this.base_url}products/last-sales-products`)
    }

    getLastProductPurchased(): Observable<any>{
        return this.http.get<any>(`${this.base_url}products/last-shopping-products`)
    }

    getProductsMixed() {
        return this.http
            .get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProductsWithOrdersSmall() {
        return this.http
            .get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }
}
