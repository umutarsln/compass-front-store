import { api } from './api';

export enum PaymentProvider {
  IYZICO = 'IYZICO',
}

export interface CheckoutDto {
  orderId: string;
  provider?: PaymentProvider;
}

export interface CheckoutResponse {
  attemptId: string;
  provider: PaymentProvider;
  redirectUrl: string;
  token?: string;
}

class PaymentService {
  private endpoint = '/payments';

  /**
   * Create checkout and initialize payment
   */
  async createCheckout(checkoutDto: CheckoutDto): Promise<CheckoutResponse> {
    return await api.post<CheckoutResponse>(`${this.endpoint}/checkout`, checkoutDto);
  }
}

export const paymentService = new PaymentService();
