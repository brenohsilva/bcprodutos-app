import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ProductSales } from 'src/app/demo/api/productsSales';
import { ProductShopping } from 'src/app/demo/api/productsShopping';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './stocks.component.html',
})
export class StocksComponent implements OnInit {
    products: Product[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    product: Product = {};

    productSalesDialog: boolean = false;

    productShoppingDialog: boolean = false;

    paymentMethods: any[] = [];

    installments: any[] = [];

    paymentMethod: any;

    installment: any;

    coust: any;

    productSales: ProductSales;

    productShopping: ProductShopping = {
        price: 0,
        tax: 0,
        amount: 0,
        totalValue: 0,
    };

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.sortOptions = [
            { label: 'Maior Preço', value: '!price' },
            { label: 'Menor Preço', value: 'price' },
        ];

        this.paymentMethods = [
            { label: 'Dinheiro', value: 'Dinheiro' },
            { label: 'Cartão de Credito', value: 'Cartão de Credito' },
            { label: 'Cartão de Debito', value: 'Cartão de Debito' },
            { label: 'Pix', value: 'Pix' },
        ];

        this.installments = [
            { label: 'A vista', value: 'A vista' },
            { label: 'Parcelado em 1x', value: 1 },
            { label: 'Parcelado em 2x', value: 2 },
            { label: 'Parcelado em 3x', value: 3 },
            { label: 'Parcelado em 4x', value: 4 },
            { label: 'Parcelado em 5x', value: 5 },
            { label: 'Parcelado em 6x', value: 6 },
        ];
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    openNewSales(product: any) {
        this.product = product;
        this.productSalesDialog = true;
    }

    openNewShopping(product: any) {
        this.product = product;
        this.productShoppingDialog = true;
    }

    saveSale() {
        (this.productSales = {
            id: this.product.id,
            amount: this.product.quantity,
            paymentMethod: this.paymentMethod,
            coast: this.coust,
            totalValue: this.product.price * this.product.quantity,
        }),
            alert(this.productSales);
        console.log(this.productSales);
    }

    saveShopping() {
        this.productShopping = {
            ...this.productShopping,
            totalValue:
                (this.productShopping.price + this.productShopping.tax) *
                this.productShopping.amount,
        };
        alert(this.productShopping);
        console.log(this.productShopping)
    }
}
