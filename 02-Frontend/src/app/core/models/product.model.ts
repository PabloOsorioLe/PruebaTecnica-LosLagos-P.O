export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  category: string;
  environmentalImpact: number;
  socialImpact: number;
  isSustainable: boolean;
}