export type ScreenType = 'home' | 'category' | 'checkout' | 'success' | 'tracking' | 'cart' | 'reorder' | 'plp';

export interface Category {
  id: string;
  name: string;
  image: string;
  isPromo?: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  image: string;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: any; // Using Lucide icon component or string
  items: SubCategory[];
  type?: 'grid' | 'row';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  weight: string;
  discount: string;
  categoryId?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any; 
  active: boolean;
}