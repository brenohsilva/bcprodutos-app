
export interface SalesItens {
    productId: number | string;
    amount: number;
    unitPrice: number;
    subTotal: number
}
export interface Sales {
    description?: string;
    paymentMethod?: string;
    coast?: number;
    discount?: number;
    subTotal?: number; //Valor com desconto mas sem o custo
    totalValue?: number;
    salesItens?: SalesItens[]
    
}

export interface UniqueSale {
    id?: string;
    paymentMethod?: string;
    coast?: number;
    discount?: number;
    amount?: number;
    unitPrice?: number;
    totalValue: number;
}