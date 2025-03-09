import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { forkJoin, catchError, of } from 'rxjs';
import { Subscription, debounceTime } from 'rxjs';
import { Product } from 'src/app/demo/api/product';
import { SalesResponse } from 'src/app/demo/api/productsSales';
import { ProductService } from 'src/app/demo/service/product.service';
import { SalesService } from 'src/app/demo/service/sales.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './sales.component.html',
    providers: [DatePipe],
})
export class SalesComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Product[];

    latestSales: SalesResponse[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    salesData = {
        valueSalesOfWeekNet: 0,
        valueSalesOfWeekGross: 0,
        valueSalesOfMonthNet: 0,
        valueSalesOfMonthGross: 0,
        quantityOfSalesByWeek: 0,
        previousQuantityOfSalesByMonth: 0,
        quantityOfSalesByMonth: 0,
        quantityOfProductSoldByWeek: 0,
        quantityOfProductSoldByMonth: 0,
        previousQuantityOfProductSoldByMonth: 0,
    };

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        public salesService: SalesService,
        private router: Router,
        private datePipe: DatePipe
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.getSalesData();
        this.getLastProductsSold();
        this.getLatestSales();
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.salesService.getDailySales().subscribe((res) => {
            if (res.success) {
                const salesByDayMap = new Map<string, number>();
                res.data.forEach(
                    (item: { day: string; total_gross_value: string }) => {
                        const day = item.day;
                        const sales = parseFloat(item.total_gross_value);

                        if (salesByDayMap.has(day)) {
                            salesByDayMap.set(
                                day,
                                salesByDayMap.get(day)! + sales
                            );
                        } else {
                            salesByDayMap.set(day, sales);
                        }
                    }
                );
                const labels = Array.from(salesByDayMap.keys());
                const data = Array.from(salesByDayMap.values());

                this.chartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Faturamento Diário',
                            data: data,
                            fill: false,
                            backgroundColor:
                                documentStyle.getPropertyValue(
                                    '--bluegray-700'
                                ),
                            borderColor:
                                documentStyle.getPropertyValue(
                                    '--bluegray-700'
                                ),
                            tension: 0,
                        },
                    ],
                };
            }
        });

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
                res.valueSalesOfWeek?.data?.currentPeriod.liquido || 0
            );
            this.salesData.valueSalesOfWeekGross = Number(
                res.valueSalesOfWeek?.data?.currentPeriod.bruto || 0
            );
            this.salesData.valueSalesOfMonthNet = Number(
                res.valueSalesOfMonth?.data?.currentPeriod.liquido || 0
            );
            this.salesData.valueSalesOfMonthGross = Number(
                res.valueSalesOfMonth.data.currentPeriod.bruto || 0
            );
            this.salesData.quantityOfSalesByWeek =
                res.quantityOfSalesByWeek?.data.currentPeriod || 0;
                this.salesData.previousQuantityOfSalesByMonth = res.quantityOfSalesByMonth.data.previousPeriod || 0,
            this.salesData.quantityOfSalesByMonth =
                res.quantityOfSalesByMonth?.data.currentPeriod || 0;
            this.salesData.quantityOfProductSoldByWeek =
                res.quantityOfProductSoldByWeek?.data.currentPeriod || 0;
            this.salesData.quantityOfProductSoldByMonth =
                res.quantityOfProductSoldByMonth?.data.currentPeriod || 0;
                this.salesData.previousQuantityOfProductSoldByMonth = res.quantityOfProductSoldByMonth.data.previousPeriod || 0
        });
    }

    getLatestSales() {
        this.salesService.getlatestSales().subscribe((res) => {
            if (res.success) {
                this.latestSales = res.data;
            }
        });
    }

    getLastProductsSold() {
        this.productService.getLastProductsSold().subscribe((res) => {
            if (res.success) {
                this.products = res.data;
            }
        });
    }

    formatedDate(data: string): string | null {
        return this.datePipe.transform(data, 'dd-MM-yyyy');
    }
}
