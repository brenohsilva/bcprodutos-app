import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Product } from '../../api/product';
import { SalesResponse } from '../../api/productsSales';
import { DashboardService } from '../../service/dashboard.service';
import { SalesService } from '../../service/sales.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './month-general.component.html',
  styleUrl: './month-general.component.scss',
  providers: [DatePipe],
})
export class MonthGeneralComponent implements OnInit, OnDestroy {
 isloading = true;

    products!: Product[];

    dashboardData = {
        estimatedStockValue: 0,
        montlySales: 0,
        montlyShopping: 0,
        monthlyBalance: 0,
        monthlyProfit: 0,
        totalStockProducts: 0,
    };

    latestSales: SalesResponse[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    pieData: any;

    pieOptions: any;

    view: [number, number] = [800, 500];
    single: any[] = [];
    showLabels: boolean = true;
    showLegend: boolean = true;
    gradient: boolean = true;
    colorScheme = 'natural';

    barOptions: any;
    barData: any;


    constructor(
        public layoutService: LayoutService,
        private dashboardService: DashboardService,
        private salesService: SalesService,
        private datePipe: DatePipe
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.getDashboardData();
        this.initChart();
        this.getLatestSales();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.dashboardService
            .getIndividualProductStockQuantity()
            .subscribe((res) => {
                if (res.success) {
                    this.single = Object.entries(res.data).map(
                        ([key, value]) => ({
                            name: key,
                            value: value,
                        })
                    );
                }
            });

        this.dashboardService.getDailyProfits(2).subscribe((res) => {
            if (res.success) {
                const profitByDayMap = new Map<string, number>();
                res.data.forEach(
                    (item: { day: string; profit_day: string }) => {
                        const day = item.day;
                        const profit = parseFloat(item.profit_day);

                        if (profitByDayMap.has(day)) {
                            profitByDayMap.set(
                                day,
                                profitByDayMap.get(day)! + profit
                            );
                        } else {
                            profitByDayMap.set(day, profit);
                        }
                    }
                );

                const labels = Array.from(profitByDayMap.keys());
                const data = Array.from(profitByDayMap.values());

                this.barData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Lucro diário',
                            backgroundColor:
                                documentStyle.getPropertyValue('--primary-500'),
                            borderColor:
                                documentStyle.getPropertyValue('--primary-500'),
                            data: data,
                        },
                    ],
                };
            }
        });

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        display: false,
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
            aspectRatio: 5
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getDashboardData() {
        forkJoin({
            estimatedStockValue: this.dashboardService
                .getStockRevenue()
                .pipe(catchError(() => of(null))),
            monthlyTotalBalance: this.dashboardService
                .getMontlyBalance(2)
                .pipe(catchError(() => of(null))),
            totalStockProducts: this.dashboardService
                .getProductsStockQuantity()
                .pipe(catchError(() => of(null))),
            monthlyProfit: this.dashboardService
                .getMontlyProfit(2)
                .pipe(catchError(() => of(null))),
        }).subscribe((res) => {
            (this.dashboardData.estimatedStockValue =
                res.estimatedStockValue?.revenue_amount || 0),
                (this.dashboardData.monthlyBalance =
                    res.monthlyTotalBalance?.data?.balance || 0),
                (this.dashboardData.monthlyProfit =
                    res.monthlyProfit.data || 0),
                (this.dashboardData.montlySales =
                    res.monthlyTotalBalance?.data?.sales_value || 0),
                (this.dashboardData.montlyShopping =
                    res.monthlyTotalBalance?.data?.shopping_value || 0),
                (this.dashboardData.totalStockProducts =
                    res.totalStockProducts?.total_stock || 0);
            this.isloading = false;
        });
    }

    getLatestSales() {
        this.salesService.getlatestSales(2).subscribe((res) => {
            if (res.success) {
                this.latestSales = res.data;
            }
        });
    }

    formatedDate(data: string): string | null {
        return this.datePipe.transform(data, 'dd-MM-yyyy');
    }
}
