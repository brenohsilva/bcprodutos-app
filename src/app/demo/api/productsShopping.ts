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
    unit_price: number; //será o subtotal / amount
    subTotal: number
}
export interface Shopping {
    description?: string;
    payment_method?: string;
    installment?: string | number;
    tax?: number;
    total_value?: number; // será o valor dos produtos + o tax
    itens?: ShoppingItens[]
    
}
