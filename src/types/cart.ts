export interface CartItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number | null;
  thumbnailUrl?: string | null;
  quantity: number;
  weight?: string | null;
}
