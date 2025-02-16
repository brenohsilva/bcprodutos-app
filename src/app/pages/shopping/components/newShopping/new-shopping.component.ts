import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/api/product';
import {
    ProductShopping,
    Shopping,
    ShoppingItens,
} from 'src/app/demo/api/productsShopping';
import { ProductService } from 'src/app/demo/service/product.service';
import { ShoppingService } from 'src/app/demo/service/shopping.service';

@Component({
    templateUrl: './new-shopping.component.html',
    providers: [MessageService],
})
export class NewShoppingComponent implements OnInit {
    constructor(
        private productService: ProductService,
        private shoppingService: ShoppingService,
        private service: MessageService,
        private router: Router
    ) {}
    products: Product[];
    product: Product = {};
    selectedProducts: Product[] = [];
    shoppingProducts: ProductShopping[] = [];
    Methods = [
        { label: 'Pix', value: { name: 'Pix' } },
        { label: 'Cartão de Credito', value: { name: 'Credito' } },
        { label: 'Cartão de Debito', value: { name: 'Debito' } },
        { label: 'Dinheiro', value: { name: 'Dinheiro' } },
    ];
    installments = [
        { label: 'A vista', value: 'A vista' },
        { label: 'Parcelado em 1x', value: 1 },
        { label: 'Parcelado em 2x', value: 2 },
        { label: 'Parcelado em 3x', value: 3 },
        { label: 'Parcelado em 4x', value: 4 },
        { label: 'Parcelado em 5x', value: 5 },
        { label: 'Parcelado em 6x', value: 6 },
    ];
    selectedMethod: any = null;
    installment: number = 1
    tax: number;
    description: string;
    shoppingData: Shopping;
    totalValue: number;

    cols: any[] = [];
    openDeleteProductDialog: boolean = false;
    openAddNewProductsDialog: boolean = false;
    cancelShoppingDialog: boolean = false;

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
            detail: 'Compra registrada com sucesso!',
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

    get total(): number {
        return (
            this.shoppingProducts.reduce((sum, product) => {
                console.log(product)
                const productTotal = product.total_value;
                return sum + productTotal;
            }, 0) + (this.tax || 0)
        );
    }

    newProducts() {
        this.openAddNewProductsDialog = true;
    }

    addNewProducts() {
        this.shoppingProducts = [...this.selectedProducts];
        this.openAddNewProductsDialog = false;
    }

    deleteProduct(product: Product) {
        this.openDeleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDelete(product: Product) {
        this.openDeleteProductDialog = false;
        this.shoppingProducts = this.shoppingProducts.filter(
            (val) => val.id !== product.id
        );
        this.selectedProducts = this.selectedProducts.filter(
            (val) => val.id !== product.id
        );
        this.openAddNewProductsDialog = false;
    }

    async registerShopping() {
        const itens: ShoppingItens[] = this.shoppingProducts.map((product) => ({
            productId: product.id,
            amount: product.amount,
            unit_price: product.total_value / product.amount,
            sub_total: product.total_value,
        }));

        const subTotal = itens.reduce((sum, item) => sum + item.sub_total, 0);
        const total_value = subTotal + this.tax;

        this.shoppingData = {
            description: this.description || 'Primeira compra',
            payment_method: this.selectedMethod.name || null,
            tax: this.tax,
            installment: this.installment,
            total_value,
            itens,
        };

        this.shoppingService.registerShopping(this.shoppingData).subscribe(
            (res) => {
                console.log(res);
                if (res.success) {
                    this.showSuccessViaToast();
                    setTimeout(() => {
                        this.router.navigate(['info/compras']);
                    }, 2000);
                }
            },
            (error) => {
                console.error('Erro na requisição:', error);
                this.showErrorViaToast();
            }
        );
    }

    cancelShopping(){
        this.cancelShoppingDialog = true
    }

    confirmCancelShopping(){
        this.cancelShoppingDialog = false
        this.router.navigate(['uikit/compras']);
    }
}
