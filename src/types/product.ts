export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  sortOrder: number;
  parentId?: string | null;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  categoryId: string;
  category?: Category | null;
  images: string[];
  thumbnailUrl?: string | null;
  stock: number;
  weight?: string | null;
  origin?: string | null;
  unit?: string | null;
  isNew: boolean;
  isRecommended: boolean;
  isSoldOut: boolean;
  shippingInfo?: string | null;
}
