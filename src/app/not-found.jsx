"use client"

import Link from 'next/link'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/ui/button'
import { ChefHat, Home, Search, ArrowLeft, Sparkles, UtensilsCrossed, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const suggestions = [
    {
      icon: Home,
      title: "Trang chủ",
      description: "Quay về trang chủ Nutrimate",
      href: "/",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Search,
      title: "Tìm công thức",
      description: "Khám phá công thức mới",
      href: "/tim-kiem",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: UtensilsCrossed,
      title: "Công thức phổ biến",
      description: "Xem món ăn được yêu thích",
      href: "/pho-bien",
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.1),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-6 h-6 bg-orange-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute top-40 right-16 w-4 h-4 bg-amber-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute bottom-32 left-20 w-8 h-8 bg-orange-100 rounded-full opacity-25 animate-pulse" />

      <Container className="flex min-h-screen items-center justify-center pt-24 sm:pt-32 lg:pt-40 relative z-10">
        <FadeIn className="flex max-w-4xl flex-col items-center text-center space-y-8">
          {/* 404 Number with Chef Hat */}
          <div className="relative">
            <div className={`text-8xl sm:text-9xl lg:text-[12rem] font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent transition-all duration-1000 ${isVisible ? 'scale-100' : 'scale-95'}`}>
              404
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                <ChefHat className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6 max-w-2xl">
            <div className="inline-block rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-6 py-3 text-sm font-medium text-orange-700 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Oops! Trang không tồn tại
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
              Không tìm thấy công thức này!
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
              Có vẻ như trang bạn đang tìm kiếm đã bị "nấu chín" hoặc không tồn tại.
              Đừng lo lắng, hãy để Nutrimate giúp bạn tìm những món ngon khác!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group flex-1"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Về trang chủ
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 flex-1"
            >
              <Link href="/tim-kiem" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Tìm công thức
              </Link>
            </Button>
          </div>

          {/* Suggestions */}
          <div className="w-full max-w-4xl mt-16">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">Hoặc thử những gợi ý này:</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {suggestions.map((suggestion, idx) => (
                <FadeIn key={idx} delay={300 + idx * 100}>
                  <Link href={suggestion.href} className="group">
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40" />
                      <div className="relative space-y-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${suggestion.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <suggestion.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Fun cooking fact */}
          <div className="mt-12 p-6 bg-gradient-to-r from-orange-100/50 to-amber-100/50 rounded-2xl border border-orange-200/50 max-w-2xl mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 rounded-full">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-orange-800">Mẹo nấu ăn hôm nay</h3>
            </div>
            <p className="text-sm text-orange-700 leading-relaxed">
              Trong khi bạn đang ở đây, hãy nhớ rằng: Muối không chỉ làm tăng vị mặn mà còn giúp tăng cường
              tất cả các hương vị khác trong món ăn. Thêm một chút muối vào món tráng miệng chocolate sẽ làm
              nó ngọt hơn!
            </p>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}