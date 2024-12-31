export interface ProductShopping {
    id?: string;
    amount?: number;
    price?: number;
    paymentMethod?: string;
    tax?: number;
    totalValue?: number;
}

export interface ShoppingItens {
    productId: number | string;
    amount: number;
    unitPrice: number; //será o subtotal / amount
    subTotal: number
}
export interface Shopping {
    description?: string;
    paymentMethod?: string;
    installment?: string | number;
    tax?: number;
    totalValue?: number; // será o valor dos produtos + o tax
    shoppingItens?: ShoppingItens[]
    
}
