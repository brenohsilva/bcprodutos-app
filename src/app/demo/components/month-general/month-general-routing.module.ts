import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonthGeneralComponent } from './month-general.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MonthGeneralComponent  }
    ])],
    exports: [RouterModule]
})
export class MonthGeneralRoutingModule { }
