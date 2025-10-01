"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/lib/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function CheckoutButton({ plan }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký gói dịch vụ",
        variant: "destructive",
      })
      router.push("/dang-nhap?callbackUrl=/gia-ca")
      return
    }

    try {
      setIsLoading(true)

      // Create PayPal order
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          planDuration: plan.duration,
          price: plan.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đã xảy ra lỗi khi tạo đơn hàng")
      }

      // Redirect to PayPal approval URL
      window.location.href = data.approvalUrl
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Lỗi thanh toán",
        description: error.message || "Đã xảy ra lỗi khi xử lý thanh toán",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      className="w-full"
      variant={plan.id.includes("premium") ? "default" : "outline"}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý
        </>
      ) : (
        "Đăng ký ngay"
      )}
    </Button>
  )
}
