import { api } from './api';

export enum PaymentProvider {
  IYZICO = 'IYZICO',
  IBAN_EFT = 'IBAN_EFT',
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

  /**
   * Get IBAN information for IBAN EFT payment
   */
  async getIbanInfo(): Promise<{
    iban: string;
    accountName: string;
    bankName: string;
    whatsappNumber: string | null;
  } | null> {
    return await api.post<{
      iban: string;
      accountName: string;
      bankName: string;
      whatsappNumber: string | null;
    } | null>(`${this.endpoint}/iban-eft/info`);
  }

  /**
   * Get payment settings (which payment methods are enabled)
   */
  async getPaymentSettings(): Promise<{
    iyzicoEnabled: boolean;
    ibanEftEnabled: boolean;
  }> {
    return await api.get<{
      iyzicoEnabled: boolean;
      ibanEftEnabled: boolean;
    }>('/payment-settings');
  }
}

export const paymentService = new PaymentService();
