import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewSalesComponent } from './newsales.component';
import { NewSalesRoutingModule } from './newsales-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NewSalesRoutingModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule,
        TableModule,
        DataViewModule,
        ButtonModule,
        RippleModule,
        DialogModule,
        TooltipModule,
        MessagesModule,
        MessageModule,
        ToastModule,
    ],
    declarations: [NewSalesComponent],
})
export class NewSalesModule {}
