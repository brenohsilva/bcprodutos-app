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
    providers: [DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {
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

    //chart
    view: [number, number] = [700, 400]; // Tamanho do gráfico
    // Dados para o Pie Chart
    single: any[] = []
    // Opções do gráfico
    showLabels: boolean = true;
    showLegend: boolean = true;
    gradient: boolean = true;
    colorScheme = 'natural';

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
            monthlyProfit: this.dashboardService
                .getMontlyProfit()
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
        });
    }

    getLatestSales() {
        this.salesService.getlatestSales().subscribe((res) => {
            if (res.success) {
                this.latestSales = res.data;
            }
        });
    }

    formatedDate(data: string): string | null {
        return this.datePipe.transform(data, 'dd-MM-yyyy');
    }
    
}
