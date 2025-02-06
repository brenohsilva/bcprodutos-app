export interface ProductShopping {
    id?: string;
    amount?: number;
    price?: number;
    paymentMethod?: string;
    tax?: number;
    installment?: number;
    total_value?: number;
}

export interface ShoppingItens {
    productId: number | string;
    amount: number;
    unit_price: number; //será o subtotal / amount
    sub_total: number
}
export interface Shopping {
    description?: string;
    payment_method?: string;
    installment?: string | number;
    tax?: number;
    total_value?: number; // será o valor dos produtos + o tax
    itens?: ShoppingItens[] 
}

export interface ShoppingResponse extends Shopping {
    shopping_date: Date
}