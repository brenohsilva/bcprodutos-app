import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewShoppingComponent } from './new-shopping.component';
import { NewShoppingRoutingModule } from './new-shopping-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NewShoppingRoutingModule,
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
        ToastModule
    ],
    declarations: [NewShoppingComponent],
})
export class NewShoppingModule {}
