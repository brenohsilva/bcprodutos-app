
export interface SalesItens {
    productId: number | string;
    amount: number;
    unit_price: number;
    sub_total?: number;
}
export interface Sales {
    description?: string;
    additional?: number;
    payment_method?: string;
    coast?: number;
    discount?: number;
    total_gross_value?: number;
    total_net_value?: number;
    itens?: SalesItens[]
}

export interface SalesItensResponse extends SalesItens {
    type?: string;
    size?: string;
    color?: string;
}

export interface SalesResponse extends Sales {
    products: SalesItensResponse[]
}