"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Copy, ExternalLink, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface OrderSuccessLinkProps {
  successUrl: string
  lookupUrl?: string
  orderNo?: string
}

/**
 * Başarılı sipariş linkini kopyalanabilir şekilde gösterir.
 */
export function OrderSuccessLink({ successUrl, lookupUrl, orderNo }: OrderSuccessLinkProps) {
  const [copied, setCopied] = useState(false)

  /**
   * Başarı linkini panoya kopyalar.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(successUrl)
      setCopied(true)
      toast({
        title: "Link kopyalandı",
        description: "Sipariş başarı linkiniz panoya kopyalandı.",
      })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Kopyalanamadı",
        description: "Linki manuel olarak seçip kopyalayabilirsiniz.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-left">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-primary/10 p-2">
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-medium text-foreground">Sipariş Başarı Linkiniz</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Bu linki kaydederek sipariş özetinize istediğiniz zaman dönebilirsiniz.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background px-4 py-3 break-all text-sm text-foreground">
        {successUrl}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Button type="button" onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Kopyalandı" : "Linki Kopyala"}
        </Button>
        <Button type="button" variant="outline" asChild className="gap-2">
          <a href={successUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Linki Aç
          </a>
        </Button>
        <Button type="button" variant="outline" asChild className="gap-2">
          <Link href="/siparislerim">Alışverişlerim</Link>
        </Button>
      </div>

      {lookupUrl && orderNo && (
        <p className="mt-4 text-sm text-muted-foreground">
          Sipariş numaranız{" "}
          <span className="font-medium text-foreground">{orderNo}</span> ile de{" "}
          <Link href={lookupUrl} className="text-primary hover:underline">
            sipariş sorgulama
          </Link>{" "}
          sayfasından ulaşabilirsiniz.
        </p>
      )}
    </div>
  )
}
