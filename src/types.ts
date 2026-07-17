export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  calories: number;
  category: 'toppings' | 'sauce' | 'cheese' | 'patty';
}

export type HeatLevel = 'MILD' | 'SPICY' | 'INFERNO' | 'GHOST';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  image: string;
  category: 'burgers' | 'wings' | 'sides' | 'drinks';
  tags: string[]; // e.g. ["SPICY", "SIGNATURE", "CHEESY", "GLUTEN_FREE_OPTION"]
  heatLevel?: HeatLevel;
  customizable: boolean;
}

export interface CartItem {
  id: string; // unique item instance id
  menuItem: MenuItem;
  quantity: number;
  addedToppings: CustomizationOption[];
  heatLevel?: HeatLevel;
  specialInstructions: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  totalCalories: number;
  status: 'QUEUED' | 'SEARING' | 'ASSEMBLING' | 'PACKAGING' | 'READY';
  createdAt: string;
  customerName: string;
}
