import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {StocksComponent } from './stocks.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: StocksComponent }
	])],
	exports: [RouterModule]
})
export class StockRoutingModule { }
