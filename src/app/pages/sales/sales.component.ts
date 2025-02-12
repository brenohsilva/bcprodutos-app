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
        valueSalesOfWeekNet: 0,
        valueSalesOfWeekGross: 0,
        valueSalesOfMonthNet: 0,
        valueSalesOfMonthGross: 0,
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
        this.getLastProductsSold()
        this.initChart();

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
                '01/02',
                '02/02',
                '03/02',
                '04/02',
                '05/02'
            ],
            datasets: [
                {
                    label: 'Faturamento Diário',
                    data: [
                        150, 80, 239, 81, 0
                    ],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0,
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
        this.router.navigate(['info/registrar-venda']);
    }

    getSalesData() {
        forkJoin({
            valueSalesOfWeek: this.salesService
                .getValueSalesByPeriod('week')
                .pipe(catchError(() => of(null))),
            valueSalesOfMonth: this.salesService
                .getValueSalesByPeriod('month')
                .pipe(catchError(() => of(null))),
            quantityOfSalesByWeek: this.salesService
                .getQuantityOfSalesByPeriod('week')
                .pipe(catchError(() => of(null))),
            quantityOfSalesByMonth: this.salesService
                .getQuantityOfSalesByPeriod('month')
                .pipe(catchError(() => of(null))),
            quantityOfProductSoldByWeek: this.salesService
                .getQuantityOfProductSoldByPeriod('week')
                .pipe(catchError(() => of(null))),
            quantityOfProductSoldByMonth: this.salesService
                .getQuantityOfProductSoldByPeriod('month')
                .pipe(catchError(() => of(null))),
        }).subscribe((res) => {
            this.salesData.valueSalesOfWeekNet = Number(
                res.valueSalesOfWeek?.data?.liquido || 0
            );
            this.salesData.valueSalesOfWeekGross = Number(
                res.valueSalesOfWeek?.data?.bruto || 0  
            );
            this.salesData.valueSalesOfMonthNet = Number(
                res.valueSalesOfMonth?.data?.liquido || 0
            );
            this.salesData.valueSalesOfMonthGross = Number(res.valueSalesOfMonth.data.bruto || 0)
            this.salesData.quantityOfSalesByWeek =
                res.quantityOfSalesByWeek?.data || 0;
            this.salesData.quantityOfSalesByMonth =
                res.quantityOfSalesByMonth?.data || 0;
            this.salesData.quantityOfProductSoldByWeek =
                res.quantityOfProductSoldByWeek?.data || 0;
            this.salesData.quantityOfProductSoldByMonth =
                res.quantityOfProductSoldByMonth?.data || 0;
        });
    }

    getLastProductsSold() {
        this.productService.getLastProductsSold().subscribe((res) => {
           
            if (res.success) {
                this.products = res.data;
            }
        });
    }
}
