import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin, catchError, of } from 'rxjs';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { SalesService } from 'src/app/demo/service/sales.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './sales.component.html',
})
export class SalesComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    salesData = {
        valueSalesOfWeek: 0,
        valueSalesOfMonth: 0,
        quantityOfSalesByWeek: 0,
        quantityOfSalesByMonth: 0,
        quantityOfProductSoldByWeek: 0,
        quantityOfProductSoldByMonth: 0,
    };

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        public salesService: SalesService,
        private router: Router
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.getSalesData();
        this.initChart();
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));

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
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
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
                    data: [
                        65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,
                        65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,
                    ],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [
                        28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56, 55, 40,
                        65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40,
                    ],
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

    registerNewSale() {
        this.router.navigate(['uikit/novasvendas']);
    }

    getSalesData() {
        forkJoin({
            valueSalesOfWeek: this.salesService.getValueSalesByPeriod('week').pipe(catchError(() => of(null))),
            valueSalesOfMonth: this.salesService.getValueSalesByPeriod('month').pipe(catchError(() => of(null))),
            quantityOfSalesByWeek: this.salesService.getQuantityOfSalesByPeriod('week').pipe(catchError(() => of(null))),
            quantityOfSalesByMonth: this.salesService.getQuantityOfSalesByPeriod('month').pipe(catchError(() => of(null))),
            quantityOfProductSoldByWeek: this.salesService.getQuantityOfProductSoldByPeriod('week').pipe(catchError(() => of(null))),
            quantityOfProductSoldByMonth: this.salesService.getQuantityOfProductSoldByPeriod('month').pipe(catchError(() => of(null))),
        }).subscribe((res) => {
            this.salesData.valueSalesOfWeek = Number(res.valueSalesOfWeek?.data?.liquido || 0);
            this.salesData.valueSalesOfMonth = Number(res.valueSalesOfMonth?.data?.liquido || 0);
            this.salesData.quantityOfSalesByWeek = res.quantityOfSalesByWeek?.data || 0;
            this.salesData.quantityOfSalesByMonth = res.quantityOfSalesByMonth?.data || 0;
            this.salesData.quantityOfProductSoldByWeek = res.quantityOfProductSoldByWeek?.data || 0;
            this.salesData.quantityOfProductSoldByMonth = res.quantityOfProductSoldByMonth?.data || 0;
        });
    }
}
