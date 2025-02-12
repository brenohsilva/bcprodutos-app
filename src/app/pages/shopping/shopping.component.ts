import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

import { Subscription, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ShoppingResponse } from 'src/app/demo/api/productsShopping';
import { ProductService } from 'src/app/demo/service/product.service';
import { ShoppingService } from 'src/app/demo/service/shopping.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './shopping.component.html',
    providers: [DatePipe],
})
export class ShoppingComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Product[];

    shoppingData = {
        valueShoppingOfWeek: 0,
        valueShoppingOfMonth: 0,
        amountShoppingOnWeek: 0,
        amountShoppingOnMonth: 0,
        amountOfProductsPurchasedOnWeek: 0,
        amountOfProductsPurchasedOnMonth: 0,
    };

    latestShopping: ShoppingResponse[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private shoppingService: ShoppingService,
        private datePipe: DatePipe,
        private router: Router
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.getShoppingData();
        this.initChart();
        this.getLastProductPurchased();
        this.getLatesProducts();

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getShoppingData() {
        forkJoin({
            valueShoppingOfWeek: this.shoppingService
                .getValueShoppingByPeriod('week')
                .pipe(catchError(() => of(null))),
            valueShoppingOfMonth: this.shoppingService
                .getValueShoppingByPeriod('month')
                .pipe(catchError(() => of(null))),
            amountShoppingOnWeek: this.shoppingService
                .getQuantityOfShoppingByPeriod('week')
                .pipe(catchError(() => of(null))),
            amountShoppingOnMonth: this.shoppingService
                .getQuantityOfShoppingByPeriod('month')
                .pipe(catchError(() => of(null))),
            amountOfProductsPurchasedOnWeek: this.shoppingService
                .getQuantityOfProductPurchasedByPeriod('week')
                .pipe(catchError(() => of(null))),
            amountOfProductsPurchasedOnMonth: this.shoppingService
                .getQuantityOfProductPurchasedByPeriod('month')
                .pipe(catchError(() => of(null))),
        }).subscribe((res) => {
            this.shoppingData.valueShoppingOfWeek = Number(
                res.valueShoppingOfWeek.data || 0
            );
            this.shoppingData.valueShoppingOfMonth = Number(
                res.valueShoppingOfMonth.data || 0
            );
            this.shoppingData.amountShoppingOnWeek = Number(
                res.amountShoppingOnWeek.data || 0
            );
            this.shoppingData.amountShoppingOnMonth = Number(
                res.amountShoppingOnMonth.data || 0
            );
            this.shoppingData.amountOfProductsPurchasedOnWeek = Number(
                res.amountOfProductsPurchasedOnWeek.data || 0
            );
            this.shoppingData.amountOfProductsPurchasedOnMonth = Number(
                res.amountOfProductsPurchasedOnMonth.data || 0
            );
        });
    }

    getLastProductPurchased() {
        this.productService.getLastProductPurchased().subscribe((res) => {
            if (res.success) {
                this.products = res.data;
                console.log(this.products);
            }
        });
    }

    getLatesProducts() {
        this.shoppingService.getLatestShopping().subscribe((res) => {
            if (res.success) {
                this.latestShopping = res.data;
            }
        });
    }

    formatedDate(data: string): string | null {
        return this.datePipe.transform(data, 'dd-MM-yyyy');
    }

    registerNewShopping() {
        this.router.navigate(['info/registrar-compra']);
    }
}
