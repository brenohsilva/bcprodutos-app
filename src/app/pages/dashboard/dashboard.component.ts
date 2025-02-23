import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../demo/api/product';
import { Subscription, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../demo/service/dashboard.service';
import { SalesResponse } from '../../demo/api/productsSales';
import { SalesService } from '../../demo/service/sales.service';
import { CommonModule, DatePipe } from '@angular/common';


@Component({
    templateUrl: './dashboard.component.html',
    providers: [DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {
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

    public chartLineData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
        datasets: [
          {
            label: 'Faturamento 2025',
            data: [65, 59],
            borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo abaixo da linha
            fill: false, // Preencher a área abaixo da linha
            tension: 0 // Suavização da linha (0 = sem curvas, 1 = curvas máximas)
          },
          {
            label: 'Lucro 2025',
            data: [59, 48],
            borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Cor de fundo abaixo da linha
            fill: true, // Preencher a área abaixo da linha
            tension: 0 // Suavização da linha
          },
        ],
      };
    
      public chartLineOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Meses',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Vendas',
            },
            beginAtZero: true,
          },
        },
      };

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

        this.dashboardService.getDailyProfits().subscribe((res) => {
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
            this.isloading = false;
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
