import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewShoppingComponent } from './new-shopping.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: NewShoppingComponent }
	])],
	exports: [RouterModule]
})
export class NewShoppingRoutingModule { }
