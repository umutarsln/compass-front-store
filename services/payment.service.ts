import { api } from './api';

export enum PaymentProvider {
  IYZICO = 'IYZICO',
  QNBPAY = 'QNBPAY',
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
  /** true ise tutar 0 (örn. %100 kupon), ödeme alınmadan sipariş ödendi; başarı sayfasına yönlendir */
  paymentNotRequired?: boolean;
  formAction?: string;
  formMethod?: 'POST';
  formFields?: Record<string, string>;
  checkoutMode?: string;
}

/** GET /payment-settings public yanıtı (sırlar yok). */
export interface PaymentSettingsPublic {
  iyzicoEnabled: boolean;
  ibanEftEnabled: boolean;
  qnbpayEnabled: boolean;
  qnbpayCheckoutMode: string;
  qnbpayMerchantIdMasked: string | null;
}

class PaymentService {
  private endpoint = '/payments';

  /**
   * Checkout başlatır (Iyzico veya QNBpay).
   */
  async createCheckout(checkoutDto: CheckoutDto): Promise<CheckoutResponse> {
    return await api.post<CheckoutResponse>(`${this.endpoint}/checkout`, checkoutDto);
  }

  /**
   * IBAN EFT bilgilerini döndürür.
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
   * Mağaza için güvenli ödeme bayrakları.
   */
  async getPaymentSettings(): Promise<PaymentSettingsPublic> {
    return await api.get<PaymentSettingsPublic>('/payment-settings');
  }
}

export const paymentService = new PaymentService();
