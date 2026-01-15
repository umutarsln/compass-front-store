"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Tag } from "lucide-react"

export function DiscountCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [prevTimeLeft, setPrevTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    // 1 hafta sonrası için hedef tarih
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7)

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        setIsExpired(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // İlk hesaplama
    const initial = calculateTimeLeft()
    setTimeLeft(initial)
    setPrevTimeLeft(initial)

    // Her saniye güncelle
    const interval = setInterval(() => {
      setTimeLeft((current) => {
        setPrevTimeLeft(current)
        return calculateTimeLeft()
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const TimeUnit = ({ 
    value, 
    label, 
    prevValue, 
    shouldAnimate 
  }: { 
    value: number
    label: string
    prevValue: number
    shouldAnimate: boolean
  }) => {
    const hasChanged = value !== prevValue
    const willAnimate = hasChanged && shouldAnimate

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative bg-background/10 backdrop-blur-sm rounded-lg px-4 py-3 md:px-6 md:py-4 min-w-[60px] md:min-w-[80px] overflow-hidden">
          {/* Eski sayı - aşağı kayıyor */}
          {willAnimate && (
            <motion.span
              key={`${label}-prev-${prevValue}`}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 40, opacity: 0 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
              className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground tabular-nums"
            >
              {String(prevValue).padStart(2, "0")}
            </motion.span>
          )}
          
          {/* Yeni sayı - yukarıdan geliyor */}
          <motion.span
            key={`${label}-${value}`}
            initial={willAnimate ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className="block text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </div>
        <span className="mt-2 text-xs md:text-sm text-primary-foreground/80 uppercase tracking-wider font-medium">
          {label}
        </span>
      </div>
    )
  }

  if (isExpired) {
    return (
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg md:text-xl text-muted-foreground">İndirim süresi doldu</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Sol taraf - İndirim mesajı */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-foreground/10 rounded-full">
              <Tag className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                %20 İndirim
              </h2>
              <p className="text-sm md:text-base text-primary-foreground/80 mt-1">
                Tüm ürünlerde geçerli
              </p>
            </div>
          </div>

          {/* Orta - Sayaç */}
          <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-2 text-primary-foreground/80">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm uppercase tracking-wider font-medium">
                Kalan Süre
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <TimeUnit 
                value={timeLeft.days} 
                label="Gün" 
                prevValue={prevTimeLeft.days}
                shouldAnimate={timeLeft.days !== prevTimeLeft.days}
              />
              <span className="text-2xl md:text-3xl font-bold text-primary-foreground/50">:</span>
              <TimeUnit 
                value={timeLeft.hours} 
                label="Saat" 
                prevValue={prevTimeLeft.hours}
                shouldAnimate={timeLeft.hours !== prevTimeLeft.hours || timeLeft.days !== prevTimeLeft.days}
              />
              <span className="text-2xl md:text-3xl font-bold text-primary-foreground/50">:</span>
              <TimeUnit 
                value={timeLeft.minutes} 
                label="Dakika" 
                prevValue={prevTimeLeft.minutes}
                shouldAnimate={timeLeft.minutes !== prevTimeLeft.minutes || timeLeft.hours !== prevTimeLeft.hours || timeLeft.days !== prevTimeLeft.days}
              />
              <span className="text-2xl md:text-3xl font-bold text-primary-foreground/50">:</span>
              <TimeUnit 
                value={timeLeft.seconds} 
                label="Saniye" 
                prevValue={prevTimeLeft.seconds}
                shouldAnimate={timeLeft.seconds !== prevTimeLeft.seconds || timeLeft.minutes !== prevTimeLeft.minutes || timeLeft.hours !== prevTimeLeft.hours || timeLeft.days !== prevTimeLeft.days}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
