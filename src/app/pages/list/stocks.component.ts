import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Table } from 'primeng/table';
import { Product } from 'src/app/demo/api/product';
import { Sales } from 'src/app/demo/api/productsSales';
import { ProductShopping, Shopping } from 'src/app/demo/api/productsShopping';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './stocks.component.html',
})
export class StocksComponent implements OnInit {
    products: Product[] = [];

    //--- Ordenação ---------------
    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;
    sortField: string = '';

    //----------------------------

    product: Product = {};

    paymentMethods: any[] = [];

    installments: any[] = [];

    salesAmount: number;

    salesDialog: boolean = false;

    shoppingDialog: boolean = false;

    sales: Sales = {
        description: 'Venda Única',
        payment_method: 'Pix',
        coast: 0,
        discount: 0,
    };

    shopping: Shopping = {
        description: 'Compra Única',
        installment: 'A vista',
        payment_method: 'Cartão de Credito',
        tax: 0,
        total_value: 0,
    };

    shoppingProductAmount: number = 1;

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.initialData()
    }

    initialData(){
        this.productService.getProducts().subscribe((data) => {
            this.products = data.data
        })

    this.sortOptions = [
        { label: 'Maior Preço', value: '!price' },
        { label: 'Menor Preço', value: 'price' },
    ];

    this.paymentMethods = [
        { label: 'Dinheiro', value: 'Dinheiro' },
        { label: 'Cartão de Credito', value: 'Cartão de Credito' },
        { label: 'Cartão de Debito', value: 'Cartão de Debito' },
        { label: 'Pix', value: 'Pix' },
    ];

    this.installments = [
        { label: 'A vista', value: 'A vista' },
        { label: 'Parcelado em 1x', value: 1 },
        { label: 'Parcelado em 2x', value: 2 },
        { label: 'Parcelado em 3x', value: 3 },
        { label: 'Parcelado em 4x', value: 4 },
        { label: 'Parcelado em 5x', value: 5 },
        { label: 'Parcelado em 6x', value: 6 },
    ];
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    getTagClass(color?: string): string {
        if (color) {
            switch (color.toLowerCase()) {
                case 'preto':
                    return 'tag-preto'
              case 'azul':
                return 'tag-azul';
              case 'marrom':
                return 'tag-marrom';
              case 'branco':
                return 'tag-branco';
              case 'amarelo':
                return 'tag-amarelo';
              default:
                return 'custom-tag';
            }
        }
        return ''
      }

    openNewSales(product: any) {
        this.product = product;
        this.salesDialog = true;
    }

    closeNewsales(){
        this.salesDialog = false;
    }

    calculateTotalValueOfSales(): number {
        const subTotal = (this.product.sales_price || 0) * (this.salesAmount || 1);
        const discount = this.sales.discount || 0;
        const coast = this.sales.coast || 0;
        return subTotal - discount - coast;
    }

    openNewShopping(product: any) {
        this.product = product;
        this.shoppingDialog = true;
    }

    closeNewShopping(){
        this.shoppingDialog = false;
    }

    saveSale() {
        const subTotal = (this.product.sales_price || 0) * (this.salesAmount || 1);
        const discount = this.sales.discount || 0;
        const coast = this.sales.coast || 0;
        const totalValue = subTotal - discount - coast;
    
        this.sales = {
            ...this.sales,
            subTotal,
            totalValue,
            itens: [
                {
                    productId: this.product.id,
                    unit_price: this.product.sales_price,
                    amount: this.salesAmount,
                    subTotal,
                },
            ],
        };
    
        console.log(this.sales);
    }
    

    saveShopping() {

        this.shopping = {
            ...this.shopping,
            total_value: this.shopping.total_value + + this.shopping.tax,
            itens: [
                {
                    productId: this.product.id,
                    amount: this.shoppingProductAmount,
                    unit_price:
                        this.shopping.total_value / this.shoppingProductAmount,
                    subTotal: this.shopping.total_value,
                },
            ],
        };

        console.log(this.shopping);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    
}
