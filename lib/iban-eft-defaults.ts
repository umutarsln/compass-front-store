/**
 * Havale/EFT için mağazada gösterilen varsayılan IBAN ve hesap bilgileri.
 * API’den gelen değerler boşsa veya istek başarısızsa bu sabitler kullanılır.
 */
export const IBAN_EFT_DEFAULT_FORMATTED = "TR08 0011 1000 0000 0130 1278 04" as const

/** Banka uygulamalarına yapıştırmak için boşluksuz IBAN. */
export const IBAN_EFT_DEFAULT_COMPACT = "TR080011100000000130127804" as const

export const IBAN_EFT_DEFAULT_ACCOUNT_NAME = "İlev group iç ve dış ticaret ltd.şti" as const

/** IBAN banka koduna göre tipik kurum; panelden gelen `bankName` doluysa o kullanılır. */
export const IBAN_EFT_DEFAULT_BANK_NAME = "QNB Finansbank" as const

export type IbanEftInfoPayload = {
  iban: string
  accountName: string
  bankName: string
  whatsappNumber: string | null
}

/**
 * Boşluksuz IBAN üretir (kopyalama ve WhatsApp metni için).
 * @param iban Gösterim veya API’den gelen IBAN metni
 */
export function toCompactIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase()
}

/**
 * API yanıtını varsayılan havale bilgileriyle birleştirir; eksik alanları doldurur.
 * @param api Backend’den gelen bilgi veya null
 */
export function mergeIbanEftInfo(api: IbanEftInfoPayload | null): IbanEftInfoPayload {
  const iban = api?.iban?.trim() || IBAN_EFT_DEFAULT_FORMATTED
  const accountName = api?.accountName?.trim() || IBAN_EFT_DEFAULT_ACCOUNT_NAME
  const bankName = api?.bankName?.trim() || IBAN_EFT_DEFAULT_BANK_NAME
  const whatsappNumber = api?.whatsappNumber ?? null
  return { iban, accountName, bankName, whatsappNumber }
}
