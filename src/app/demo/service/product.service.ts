import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../api/product';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) {}

    base_url = 'http://localhost:3000/';

    getProductsSmall() {
        return this.http
            .get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    // getProducts() {
    //     return this.http.get<any>('assets/demo/data/products.json')
    //         .toPromise()
    //         .then(res => res.data as Product[])
    //         .then(data => data);
    // }

    getProducts(): Observable<any> {
        return this.http.get<any>(this.base_url + 'products')
            
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
