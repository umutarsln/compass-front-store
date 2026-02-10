"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

interface CountdownTime {
  days: number
  hours: number
  minutes: number
}

export function ValentinesCountdown() {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    // Sevgililer Günü: 14 Şubat 2026, 23:59:59
    const targetDate = new Date('2026-02-14T23:59:59').getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        setTimeLeft({ days, hours, minutes })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Her dakika güncelle

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-pink-200/50 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 p-4 lg:p-6 shadow-lg w-full">
      {/* Dekoratif kalp arka plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-3 lg:left-4">
          <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-pink-400 fill-pink-400" />
        </div>
        <div className="absolute top-4 right-6 lg:right-8">
          <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-rose-400 fill-rose-400" />
        </div>
        <div className="absolute bottom-3 left-6 lg:left-8">
          <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 fill-red-400" />
        </div>
        <div className="absolute bottom-2 right-3 lg:right-4">
          <Heart className="w-5 h-5 lg:w-7 lg:h-7 text-pink-300 fill-pink-300" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-1.5 lg:gap-2 mb-4 lg:mb-6">
          <Heart className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-pink-500 fill-pink-500" />
          <h3 className="text-xs lg:text-base font-semibold text-pink-900 text-center">
            Sevgililer Günü için Son Sipariş
          </h3>
          <Heart className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-pink-500 fill-pink-500" />
        </div>

        <div className="flex items-center justify-center gap-2 lg:gap-3 px-1">
          {/* Günler */}
          <div className="flex flex-col items-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1.5 lg:px-3.5 lg:py-2.5 border border-pink-200 shadow-sm min-w-[45px] lg:min-w-[60px]">
              <div className="text-lg lg:text-2xl font-bold text-pink-600 tabular-nums">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
            </div>
            <span className="text-[9px] lg:text-xs text-pink-700 font-medium mt-1 lg:mt-1.5">Gün</span>
          </div>

          {/* Saatler */}
          <div className="flex flex-col items-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1.5 lg:px-3.5 lg:py-2.5 border border-pink-200 shadow-sm min-w-[45px] lg:min-w-[60px]">
              <div className="text-lg lg:text-2xl font-bold text-pink-600 tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
            </div>
            <span className="text-[9px] lg:text-xs text-pink-700 font-medium mt-1 lg:mt-1.5">Saat</span>
          </div>

          {/* Dakikalar */}
          <div className="flex flex-col items-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-2 py-1.5 lg:px-3.5 lg:py-2.5 border border-pink-200 shadow-sm min-w-[45px] lg:min-w-[60px]">
              <div className="text-lg lg:text-2xl font-bold text-pink-600 tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
            </div>
            <span className="text-[9px] lg:text-xs text-pink-700 font-medium mt-1 lg:mt-1.5">Dakika</span>
          </div>
        </div>
      </div>
    </div>
  )
}
