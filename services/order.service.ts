import { api } from './api';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountedPrice: number | null;
  totalPrice: number;
  currency: string;
  createdAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  country?: string;
}

export interface BillingAddress extends Address {
  taxNumber?: string;
  taxOffice?: string;
}

export interface CreateOrderDto {
  cartId: string;
  guestEmail?: string;
  guestPhone?: string;
  guestFirstName?: string;
  guestLastName?: string;
  shippingAddress: Address;
  billingAddress?: BillingAddress;
  shippingCost?: number;
  discount?: number;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string | null;
  cartId: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  guestFirstName: string | null;
  guestLastName: string | null;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address | null;
  billingAddress: BillingAddress | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

class OrderService {
  private endpoint = '/orders';

  /**
   * Create order from cart
   */
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return await api.post<Order>(this.endpoint, createOrderDto);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    return await api.get<Order>(`${this.endpoint}/${id}`);
  }
}

export const orderService = new OrderService();
