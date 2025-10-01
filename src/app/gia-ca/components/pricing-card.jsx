"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/lib/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import CheckoutButton from "./checkout-button"

export default function PricingCard({ plan }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleSubscribe = () => {
    if (!session) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký gói dịch vụ",
        variant: "destructive",
      })
      router.push("/dang-nhap?callbackUrl=/gia-ca")
      return
    }
  }

  return (
    <Card className={`flex flex-col h-full ${plan.popular ? "border-orange-500 shadow-lg" : ""}`}>
      <CardHeader>
        {plan.popular && <Badge className="self-start mb-2 bg-orange-500 hover:bg-orange-600">Phổ biến nhất</Badge>}
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-6">
          <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-gray-500">/{plan.duration}</span>
        </div>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-orange-500 mr-2 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <CheckoutButton
          plan={{
            id: plan.id,
            name: plan.name,
            price: plan.price,
            duration: plan.duration === "tháng" ? "monthly" : "yearly",
          }}
        />
      </CardFooter>
    </Card>
  )
}
