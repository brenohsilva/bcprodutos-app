import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Product } from '../../api/product';
import { SalesResponse } from '../../api/productsSales';
import { DashboardService } from '../../service/dashboard.service';
import { SalesService } from '../../service/sales.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ShoppingService } from '../../service/shopping.service';

@Component({
    templateUrl: './month-general.component.html',
    styleUrl: './month-general.component.scss',
    providers: [DatePipe],
})
export class MonthGeneralComponent implements OnInit, OnDestroy {
    isloading = true;

    products!: Product[];

    year!: string;
    month!: string;

    dashboardData = {
        monthlyProfit: 0,
        previousMonthlyProfit: 0,
        montlySales: 0,
        previousMonthlySales: 0,
        montlyShopping: 0,
        previousMonthlyShopping: 0,
        monthlyBalance: 0,
        monthlySalesAmount: 0,
        previousMonthlySalesAmount: 0,
        monthlyShoppingAmount: 0,
        previousMonthlyShoppingAmount: 0,
        totalProductSold: 0,
        previousTotalProductSold: 0,
        totalProductPushased:0,
        previousTotalProductPushased: 0,
        monthlyBestSales: {
            date: '',
            value: 0
        },
        monthlyBestProfit: {
            date: '',
            value: 0
        }
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
        private shoppingService: ShoppingService,
        private datePipe: DatePipe,
        private route: ActivatedRoute
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.year = params['year'];
            this.month = params['month'];

            this.getDashboardData();
            this.initChart();
            this.getLatestSales();
        });
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
            .getItensSoldByMonth(Number(this.month))
            .subscribe((res) => {
                
                    this.single = Object.entries(res).map(
                        ([key, value]) => ({
                            name: key,
                            value: value,
                        })
                    );
                
            });

        this.dashboardService.getDailyProfits(Number(this.month)).subscribe((res) => {
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
            aspectRatio: 5,
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getDashboardData() {
        forkJoin({
            monthlyProfit: this.dashboardService.getMontlyProfit(Number(this.month)).pipe(catchError(() => of(null))),

            monthlySales: this.salesService.getValueSalesByPeriodFromGeneral(Number(this.month)).pipe(catchError(() => of(null))),
            monthlyShopping: this.shoppingService.getValueShoppingByPeriod('month',Number(this.month)).pipe(catchError(() => of(null))),

            monthlyTotalBalance: this.dashboardService.getMontlyBalance(Number(this.month)).pipe(catchError(() => of(null))),
            
            salesMadeByMonth: this.salesService.getQuantityOfSalesByPeriod('month', Number(this.month)).pipe(catchError(() => of(null))),
            shoppingMadeByMonth: this.shoppingService.getQuantityOfShoppingByPeriod('month', Number(this.month)).pipe(catchError(() => of(null))),

            totalProductSold: this.salesService.getQuantityOfProductSoldByPeriod('month', Number(this.month)).pipe(catchError(() => of(null))),
            totalProductPurchased: this.shoppingService.getQuantityOfProductPurchasedByPeriod('month', Number(this.month)).pipe(catchError(() => of(null))),

            bestSales: this.salesService.getBestSales( Number(this.month)).pipe(catchError(() => of(null))),
            bestProfit: this.salesService.getBestProfit(Number(this.month)).pipe(catchError(() => of(null))),
            
        }).subscribe((res) => {
            (this.dashboardData.monthlyProfit = res.monthlyProfit.data.currentMonthTotal || 0),
            (this.dashboardData.previousMonthlyProfit = res.monthlyProfit.data.previousMonthTotal || 0),

            (this.dashboardData.montlySales = res.monthlySales?.currentMonthSales.bruto|| 0),
            (this.dashboardData.previousMonthlySales = res.monthlySales?.previousMonthSales.bruto || 0),
            
            (this.dashboardData.montlyShopping = res.monthlyShopping?.data?.currentPeriod || 0),
            (this.dashboardData.previousMonthlyShopping = res.monthlyShopping?.data?.previousPeriod || 0),
            
            (this.dashboardData.monthlyBalance = res.monthlyTotalBalance?.data?.balance || 0),
            
            (this.dashboardData.monthlySalesAmount = res.salesMadeByMonth.data.currentPeriod || 0),
            (this.dashboardData.previousMonthlySalesAmount = res.salesMadeByMonth?.data.previousPeriod || 0);
            (this.dashboardData.monthlyShoppingAmount = res.shoppingMadeByMonth?.data.currentPeriod || 0),
            (this.dashboardData.previousMonthlyShoppingAmount = res.shoppingMadeByMonth?.data.previousPeriod || 0);

            (this.dashboardData.totalProductSold = res.totalProductSold?.data.currentPeriod || 0),
            (this.dashboardData.previousTotalProductSold = res.totalProductSold?.data.previousPeriod || 0),

            (this.dashboardData.totalProductPushased = res.totalProductPurchased?.data.currentPeriod || 0),
            (this.dashboardData.previousTotalProductPushased = res.totalProductPurchased?.data.previousPeriod || 0);

            (this.dashboardData.monthlyBestSales.date = this.formatedDate(res.bestSales.best_sales_day));
            (this.dashboardData.monthlyBestSales.value = res.bestSales.total_net_value || 0);

            (this.dashboardData.monthlyBestProfit.date =this.formatedDate(res.bestProfit.best_profit_day));
            (this.dashboardData.monthlyBestProfit.value = res.bestProfit.total_profit || 0);
            
            this.isloading = false;
        });
    }

    getLatestSales() {
        this.salesService.getlatestSales(Number(this.month)).subscribe((res) => {
            if (res.success) {
                this.latestSales = res.data;
            }
        });
    }

    formatedDate(data: string): string | null {
        return this.datePipe.transform(data, 'dd-MM-yyyy');
    }
}
