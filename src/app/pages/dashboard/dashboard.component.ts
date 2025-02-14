import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../demo/api/product';
import { ProductService } from '../../demo/service/product.service';
import { Subscription, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../demo/service/dashboard.service';
import { SalesResponse } from '../../demo/api/productsSales';
import { SalesService } from '../../demo/service/sales.service';
import { DatePipe } from '@angular/common';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
    products!: Product[];

    dashboardData = {
        estimatedStockValue: 0,
        montlySales: 0,
        montlyShopping: 0,
        monthlyBalance: 0,
        totalStockProducts: 0,
    };

    latestSales: SalesResponse[]

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    pieData: any;

    pieOptions: any;

    constructor(
        private productService: ProductService,
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
        this.getLatestSales()
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
                    const labels = Object.keys(res.data);
                    const values = Object.values(res.data);
                    this.pieData = {
                        labels: labels,
                        datasets: [
                            {
                                data: values,
                                backgroundColor: [
                                    documentStyle.getPropertyValue(
                                        '--bluegray-500'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--green-600'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--orange-500'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--pink-500'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--purple-500'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--cyan-500'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--yellow-500'
                                    ),
                                ],
                                hoverBackgroundColor: [
                                    documentStyle.getPropertyValue(
                                        '--bluegray-400'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--green-400'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--orange-300'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--pink-300'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--purple-300'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--cyan-300'
                                    ),
                                    documentStyle.getPropertyValue(
                                        '--yellow-300'
                                    ),
                                ],
                            },
                        ],
                    };

                    this.pieOptions = {
                        plugins: {
                            legend: {
                                labels: {
                                    usePointStyle: true,
                                    color: textColor,
                                },
                            },
                        },
                    };
                }
            });
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
                .getMontlyBalance()
                .pipe(catchError(() => of(null))),
            totalStockProducts: this.dashboardService
                .getProductsStockQuantity()
                .pipe(catchError(() => of(null))),
        }).subscribe((res) => {
            (this.dashboardData.estimatedStockValue =
                res.estimatedStockValue?.revenue_amount || 0),
                (this.dashboardData.monthlyBalance =
                    res.monthlyTotalBalance?.data?.profit || 0),
                (this.dashboardData.montlySales =
                    res.monthlyTotalBalance?.data?.sales_value || 0),
                (this.dashboardData.montlyShopping =
                    res.monthlyTotalBalance?.data?.shopping_value || 0),
                (this.dashboardData.totalStockProducts =
                    res.totalStockProducts?.total_stock || 0);
        });
    }

    getLatestSales(){
        this.salesService.getlatestSales().subscribe((res)=> {
            if (res.success) {
                this.latestSales = res.data
            }
        })
    }

    formatedDate(data: string): string | null {
        return this.datePipe.transform(data, 'dd-MM-yyyy');
      }
}
