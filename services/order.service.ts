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

/** Backend'den gelen kişiselleştirme değeri: metin veya dosya (url ile) */
export type PersonalizationFieldValue = string | { id: string; url: string } | PersonalizationFieldValue[];

export interface OrderItemVariantValue {
  id: string;
  value: string;
  colorCode?: string | null;
  variantOption: { id: string; name: string; type: string } | null;
}

export interface OrderItemVariant {
  id: string;
  variantValues?: OrderItemVariantValue[];
  galleries?: Array<{
    mainImage?: { id: string; s3Url: string } | null;
    thumbnailImage?: { id: string; s3Url: string } | null;
  }>;
}

export interface OrderItemPersonalization {
  form: { formId: string; versionId: string; title: string; slug: string };
  schemaSnapshot: { fields: any[]; conditions?: any[] };
  userValues: Record<string, PersonalizationFieldValue>;
  pricingBreakdown?: any[];
  totalPersonalizationAmount?: number;
  currency?: string;
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
  variant?: OrderItemVariant | null;
  personalization?: OrderItemPersonalization | null;
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
  orderNo: string; // 8 haneli unique sipariş numarası
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
   * Get order by ID or order number
   * Supports both UUID (order ID) and 8-digit order number
   */
  async getOrderById(id: string): Promise<Order> {
    return await api.get<Order>(`${this.endpoint}/${id}`);
  }

  /**
   * Get order by order number (8 digits)
   */
  async getOrderByOrderNo(orderNo: string): Promise<Order> {
    return await api.get<Order>(`${this.endpoint}/${orderNo}`);
  }
}

export const orderService = new OrderService();
