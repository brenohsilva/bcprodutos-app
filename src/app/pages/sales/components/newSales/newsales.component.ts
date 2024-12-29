import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Product } from 'src/app/demo/api/product';
import { Sales, SalesItens } from 'src/app/demo/api/productsSales';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './newsales.component.html',
})
export class NewSalesComponent implements OnInit {
    constructor(private productService: ProductService) {}
    products: Product[] = [
        {
            id: "1",
            name: "Sapato Social",
            type: "Sem Cadarço",
            size: 40,
            color: 'Preto',
            price: 65,
            quantity: 1
        },
        {
            id: "2",
            name: "Tênis",
            type: "Sem Cadarço",
            size: 41,
            color: 'Marrom',
            price: 65,
            quantity: 1
        },
        {
            id: "3",
            name: "Sapato Social",
            type: "Com Cadarço",
            size: 42,
            color: 'Preto',
            price: 65,
            quantity: 1
        },
    ];
    product: Product = {};
    selectedProducts: Product[] = [];
    salesProducts: Product[] = [];
    Methods = [
        { label: 'Pix', value: { name: 'Pix' } },
        { label: 'Cartão de Credito', value: { name: 'Credito'} },
        { label: 'Cartão de Debito', value: {name: 'Debito' } },
        { label: 'Dinheiro', value: {name: 'Dinheiro'} }
    ];
    
    selectedMethod: any = null;
    coust: number
    discount: number
    description: string;
    salesData: Sales

    cols: any[] = [];
    openDeleteProductDialog: boolean = false;
    openAddNewProductsDialog: boolean = false

    
    ngOnInit(): void {
        // this.productService
        // .getProducts()
        // .then((data) => (this.products = data));
        
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'size', header: 'Size' },
            { field: 'color', header: 'Color' }
        ];

    }

    get subTotal(): number {
        return this.salesProducts.reduce((sum, product) => {
            const productTotal = (product.quantity || 1) * product.price;
            return sum + productTotal;
        }, 0) - (this.discount || 0);
    }
    
      get total(): number {
        return this.subTotal - (this.coust || 0);
      }

    newProducts(){
        this.openAddNewProductsDialog = true
    }

    addNewProducts(){
        this.salesProducts = [...this.selectedProducts]
        console.log(this.salesProducts)
        this.openAddNewProductsDialog = false

    }

    deleteProduct(product: Product) {
        this.openDeleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDelete(product: Product) {
        this.openDeleteProductDialog = false;
        this.salesProducts = this.salesProducts.filter(val => val.id !== product.id);
        this.selectedProducts = this.selectedProducts.filter(val => val.id !== product.id)
        this.openAddNewProductsDialog = false
    }

    registerSales(){
        const salesItens: SalesItens[] = this.salesProducts.map(product => ({
            productId: product.id,
            amount: product.quantity,
            unitPrice: product.price,
            subTotal: product.quantity * product.price
        }));

        const subTotal = (salesItens.reduce((sum, item) => sum + item.subTotal, 0) - (this.discount || 0));
        const totalValue = subTotal - (this.coust || 0);

        this.salesData = {
            description: this.description || 'Primeira compra',
            paymentMethod: this.selectedMethod?.name,
            coast: this.coust || 0, 
            discount: this.discount || 0, 
            subTotal, 
            totalValue, 
            salesItens
        };

        console.log(this.salesData)
    }

}
