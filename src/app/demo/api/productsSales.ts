
export interface SalesItens {
    productId: number | string;
    amount: number;
    unit_price: number;
    subTotal?: number;
}
export interface Sales {
    description?: string;
    additional?: number;
    payment_method?: string;
    coast?: number;
    discount?: number;
    total_gross_value?: number;
    total_net_value?: number;
    subTotal?: number;
    totalValue?:number;
    itens?: SalesItens[]
    
}
