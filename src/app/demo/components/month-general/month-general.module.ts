import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardSkeletonModule } from 'src/app/layout/skeletons/dashboard-skeleton/dashboard-skeleton.module';
import { NgChartsModule } from 'ng2-charts';
import { MonthGeneralComponent } from './month-general.component';
import { MonthGeneralRoutingModule } from './month-general-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        MonthGeneralRoutingModule,
        DashboardSkeletonModule,
        NgxChartsModule,
        NgChartsModule,
    ],
    declarations: [MonthGeneralComponent],
})
export class MonthGeneralModule {}
