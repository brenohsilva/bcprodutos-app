import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../demo/api/product';
import { Subscription, catchError, debounceTime, forkJoin, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../demo/service/dashboard.service';
import { SalesResponse } from '../../demo/api/productsSales';
import { SalesService } from '../../demo/service/sales.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ShoppingService } from 'src/app/demo/service/shopping.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {

    currentDateTime: string = '';

    isloading = true;

    products!: Product[];

    dashboardData = {
        estimatedStockValue: 0,
        currentMonthlySales: 0,
        previousMonthlySales: 0,
        currentMonthlyShopping: 0,
        previousMonthlyShopping: 0,
        currentMonthlyBalance: 0,
        currentMonthlyProfit: 0,
        previousMonthlyProfit: 0,
        totalStockProducts: 0,
    };

    latestSales: SalesResponse[];

    subscription!: Subscription;

    view: [number, number] = [800, 500];
    single: any[] = [];
    colorScheme = 'natural';
    profitOption: any;
    profitData: any;

    public summaryData = {
        labels: [],
        datasets: [
            {
                label: 'Faturamento 2025',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo abaixo da linha
                fill: false, // Preencher a área abaixo da linha
                tension: 0, // Suavização da linha (0 = sem curvas, 1 = curvas máximas)
            },
            {
                label: 'Lucro 2025',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)', // Cor da linha
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Cor de fundo abaixo da linha
                fill: true, // Preencher a área abaixo da linha
                tension: 0, // Suavização da linha
            },
        ],
    };

    public summaryOption = {
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
                    display: false,
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
        private shoppingService: ShoppingService,
        private datePipe: DatePipe
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                console.log(config)
                this.initChart();
            });
    }

    ngOnInit() {
        this.getDashboardData();
        this.initChart();
        this.getLatestSales();
        this.loadChartData()

        setInterval(() => this.updateDateTime(), 1000);
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
            currentMonthlyProfit: this.dashboardService
                .getMontlyProfit()
                .pipe(catchError(() => of(null))),
                salesValues: this.salesService.getValueSalesByPeriod('month').pipe(catchError(() => of(null))),
                shoppingValues: this.shoppingService.getValueShoppingByPeriod('month').pipe(catchError(() => of(null))),
        }).subscribe((res) => {
            (this.dashboardData.estimatedStockValue = res.estimatedStockValue?.revenue_amount || 0),

            (this.dashboardData.totalStockProducts = res.totalStockProducts?.total_stock || 0);
                
            (this.dashboardData.currentMonthlyBalance = res.monthlyTotalBalance?.data?.balance || 0),
                
            (this.dashboardData.currentMonthlyProfit = res.currentMonthlyProfit.data.currentMonthTotal || 0),
                
            (this.dashboardData.previousMonthlyProfit = res.currentMonthlyProfit.data.previousMonthTotal || 0),
            
            (this.dashboardData.currentMonthlySales = res.salesValues?.data?.currentPeriod.bruto || 0),

            (this.dashboardData.previousMonthlySales = res.salesValues?.data?.previousPeriod.bruto || 0),

                
            (this.dashboardData.currentMonthlyShopping = res.shoppingValues?.data?.currentPeriod || 0),

            (this.dashboardData.previousMonthlyShopping = res.shoppingValues?.data?.previousPeriod || 0),

            
           
            
            this.isloading = false;
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

                this.profitData = {
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

        this.profitOption = {
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

    loadChartData() {
        this.dashboardService.getYearSummary().subscribe((res) => {
            if (res.success) {
                const salesData = res.data.sales;
                const profitData = res.data.profits;
    
                // Garantindo que os meses sejam adicionados na ordem correta
                const months = [
                    'janeiro', 'fevereiro'
                ];
    
                this.summaryData.labels = months.map(m => m.charAt(0).toUpperCase() + m.slice(1)); // Capitalizando os meses
                this.summaryData.datasets[0].data = months.map(m => salesData[m] || 0); // Faturamento
                this.summaryData.datasets[1].data = months.map(m => profitData[m] || 0); // Lucro
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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

    updateDateTime(): void {
        const now = new Date();
        this.currentDateTime = now.toLocaleString();
      }
}
