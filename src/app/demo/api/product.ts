interface InventoryStatus {
    label: string;
    value: string;
}
export interface Product {
    id?: string;
    code?: string;
    name?: string;
    image?: string;
    amount?: number;
    type?: string;
    size?: number;
    color?: string;
    category?: string;
    sales_price?: number;
}