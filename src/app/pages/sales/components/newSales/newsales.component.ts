import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product } from 'src/app/demo/api/product';
import { Sales, SalesItens } from 'src/app/demo/api/productsSales';
import { ProductService } from 'src/app/demo/service/product.service';
import { SalesService } from 'src/app/demo/service/sales.service';

@Component({
    templateUrl: './newsales.component.html',
    providers: [MessageService],
})
export class NewSalesComponent implements OnInit {
    constructor(
        private productService: ProductService,
        private salesService: SalesService,
        private service: MessageService,
        private router: Router
    ) {}

    products: Product[] = [];
    product: Product = {};
    selectedProducts: Product[] = [];
    salesProducts: Product[] = [];
    Methods = [
        { label: 'Pix', value: { name: 'Pix' } },
        { label: 'Cartão de Credito', value: { name: 'Credito' } },
        { label: 'Cartão de Debito', value: { name: 'Debito' } },
        { label: 'Dinheiro', value: { name: 'Dinheiro' } },
    ];
    selectedMethod: any = null;
    additional: number;
    coust: number;
    discount: number;
    description: string;
    salesData: Sales;

    cols: any[] = [];
    openDeleteProductDialog: boolean = false;
    openAddNewProductsDialog: boolean = false;

    ngOnInit(): void {
        this.productService.getProducts().subscribe((data) => {
            this.products = data.data;
        });

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'size', header: 'Size' },
            { field: 'color', header: 'Color' },
        ];
    }

    showSuccessViaToast() {
        this.service.add({
            key: 'tst',
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Venda registrada com sucesso!',
        });
    }

    showErrorViaToast() {
        this.service.add({
            key: 'tst',
            severity: 'error',
            summary: 'Ops',
            detail: 'algo deu errado!',
        });
    }

    get totalGrossValue(): number {
        return (
            this.salesProducts.reduce((sum, product) => {
                const productTotal =
                    (product.amount || 1) * product.sales_price;
                return sum + productTotal;
            }, 0) + (this.additional || 0)
        );
    }

    get totalNetValue(): number {
        return this.totalGrossValue - (this.coust || 0) - (this.discount || 0);
    }

    newProducts() {
        this.openAddNewProductsDialog = true;
    }

    addNewProducts() {
        this.salesProducts = [...this.selectedProducts];
        this.openAddNewProductsDialog = false;
    }

    deleteProduct(product: Product) {
        this.openDeleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDelete(product: Product) {
        this.openDeleteProductDialog = false;
        this.salesProducts = this.salesProducts.filter(
            (val) => val.id !== product.id
        );
        this.selectedProducts = this.selectedProducts.filter(
            (val) => val.id !== product.id
        );
        this.openAddNewProductsDialog = false;
    }

    registerSales() {
        const itens: SalesItens[] = this.salesProducts.map((product) => ({
            productId: product.id,
            amount: product.amount,
            unit_price: product.sales_price,
        }));

        const total_gross_value =
            this.salesProducts.reduce((sum, product) => {
                const productTotal =
                    (product.amount || 1) * product.sales_price;
                return sum + productTotal;
            }, 0) + (this.additional || 0);

        const total_net_value =
            total_gross_value - (this.coust || 0) - (this.discount || 0);

        this.salesData = {
            description: this.description || 'Primeira compra',
            payment_method: this.selectedMethod?.name,
            additional: this.additional,
            coast: this.coust || 0,
            discount: this.discount || 0,
            total_gross_value,
            total_net_value,
            itens,
        };

        this.salesService.registerSale(this.salesData).subscribe(
            (res) => {
                console.log(res);
                if (res.success) {
                    this.showSuccessViaToast();
                    setTimeout(() => {
                        this.router.navigate(['info/vendas']);
                    }, 2000);
                }
            },
            (error) => {
                console.error('Erro na requisição:', error);
                this.showErrorViaToast();
            }
        );

    }
}
