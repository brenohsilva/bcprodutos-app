import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewSalesComponent } from './newsales.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NewSalesComponent }
	])],
	exports: [RouterModule]
})
export class NewSalesRoutingModule { }
