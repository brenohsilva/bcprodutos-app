import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'vendas', data: { breadcrumb: 'Vendas' }, loadChildren: () => import('../../../pages/sales/sales.module').then(m => m.SalesModule) },
        { path: 'compras', data: { breadcrumb: 'Compras' }, loadChildren: () => import('../../../pages/shopping/shopping.module').then(m => m.ShoppingModule) },
        {path: 'registrar-venda', data: { breadcrumb: 'Novas Vendas' }, loadChildren: () => import('../../../pages/sales/components/newSales/newsales.module').then(m => m.NewSalesModule) },
        {path: 'registrar-compra', data: { breadcrumb: 'Novas Compras' }, loadChildren: () => import('../../../pages/shopping/components/newShopping/new-shopping.module').then(m => m.NewShoppingModule) },
        { path: 'estoque', data: { breadcrumb: 'Estoque' }, loadChildren: () => import('../../../pages/stocks/stocks.module').then(m => m.StocksModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class InfoRoutingModule { }
