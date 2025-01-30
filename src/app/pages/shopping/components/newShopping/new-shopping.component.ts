import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Product } from 'src/app/demo/api/product';
import { Sales, SalesItens } from 'src/app/demo/api/productsSales';
import { ProductShopping, Shopping, ShoppingItens } from 'src/app/demo/api/productsShopping';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './new-shopping.component.html',
})
export class NewShoppingComponent implements OnInit {
    constructor(private productService: ProductService) {}
    products: Product[] = [
        {
            id: '1',
            name: 'Sapato Social',
            type: 'Sem Cadarço',
            size: 40,
            color: 'Preto',
            sales_price: 65,
            amount: 1,
        },
        {
            id: '2',
            name: 'Tênis',
            type: 'Sem Cadarço',
            size: 41,
            color: 'Marrom',
            sales_price: 65,
            amount: 1,
        },
        {
            id: '3',
            name: 'Sapato Social',
            type: 'Com Cadarço',
            size: 42,
            color: 'Preto',
            sales_price: 65,
            amount: 1,
        },
    ];
    product: Product = {};
    selectedProducts: Product[] = [];
    shoppingProducts: ProductShopping[] = [];
    Methods = [
        { label: 'Pix', value: { name: 'Pix' } },
        { label: 'Cartão de Credito', value: { name: 'Credito' } },
        { label: 'Cartão de Debito', value: { name: 'Debito' } },
        { label: 'Dinheiro', value: { name: 'Dinheiro' } },
    ];

    selectedMethod: any = null;
    tax: number;
    description: string;
    shoppingData: Shopping;
    totalValue: number;

    cols: any[] = [];
    openDeleteProductDialog: boolean = false;
    openAddNewProductsDialog: boolean = false;

    ngOnInit(): void {
        // this.productService
        // .getProducts()
        // .then((data) => (this.products = data));

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'size', header: 'Size' },
            { field: 'color', header: 'Color' },
        ];
    }

    get total(): number {
        return this.shoppingProducts.reduce((sum, product) => {
            const productTotal = product.totalValue;
            return (sum + productTotal) ; 
        } , 0) + (this.tax || 0);
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

    registerShopping() {
        const shoppingItens: ShoppingItens[] = this.shoppingProducts.map(
            (product) => ({
                productId: product.id,
                amount: product.amount,
                unitPrice: product.totalValue / product.amount,
                subTotal: product.totalValue,
            })
        );

        const subTotal = shoppingItens.reduce(
            (sum, item) => sum + item.subTotal,
            0
        );
        const totalValue = subTotal + this.tax;

        this.shoppingData = {
            description: this.description || 'Primeira compra',
            paymentMethod: this.selectedMethod,
            tax: this.tax,
            totalValue,
            shoppingItens,
        };

        console.log(this.shoppingData);
    }
}
