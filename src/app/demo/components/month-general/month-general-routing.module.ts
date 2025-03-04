import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonthGeneralComponent } from './month-general.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: MonthGeneralComponent },
            {
                path: ':year/:month/general',
                data: { breadcrumb: 'Geral Mensal' },
                loadChildren: () =>
                    import('../month-general/month-general.module').then(
                        (m) => m.MonthGeneralModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MonthGeneralRoutingModule {}
