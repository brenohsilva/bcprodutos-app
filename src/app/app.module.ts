import { NgModule } from '@angular/core';
import {
    HashLocationStrategy,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { ShoppingService } from './demo/service/shopping.service';
import { SalesService } from './demo/service/sales.service';
import { DashboardService } from './demo/service/dashboard.service';
import { AuthService } from './demo/service/auth.service';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ProductService,
        ShoppingService,
        AuthService,
        SalesService,
        DashboardService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
