"use client"

import { useState } from "react"
import { useToast } from "./use-toast"
import { useRouter } from "next/navigation"

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const createCheckout = async (planDetails) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: planDetails.id,
          planName: planDetails.name,
          planDuration: planDetails.duration,
          price: planDetails.price,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đã xảy ra lỗi khi tạo đơn hàng")
      }

      // Redirect to PayPal approval URL
      window.location.href = data.approvalUrl

      return data
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Lỗi thanh toán",
        description: error.message || "Đã xảy ra lỗi khi xử lý thanh toán",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const capturePayment = async (orderId) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/payment/capture-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đã xảy ra lỗi khi xử lý thanh toán")
      }

      toast({
        title: "Thanh toán thành công",
        description: "Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi",
        variant: "success",
      })

      return data
    } catch (error) {
      console.error("Payment capture error:", error)
      toast({
        title: "Lỗi thanh toán",
        description: error.message || "Đã xảy ra lỗi khi xử lý thanh toán",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSubscription = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đã xảy ra lỗi khi hủy gói dịch vụ")
      }

      toast({
        title: "Hủy gói dịch vụ thành công",
        description: "Gói dịch vụ của bạn sẽ hết hạn vào cuối kỳ thanh toán",
        variant: "success",
      })

      router.refresh()
      return data
    } catch (error) {
      console.error("Cancel subscription error:", error)
      toast({
        title: "Lỗi hủy gói dịch vụ",
        description: error.message || "Đã xảy ra lỗi khi hủy gói dịch vụ",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resumeSubscription = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/subscriptions/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đã xảy ra lỗi khi khôi phục gói dịch vụ")
      }

      toast({
        title: "Khôi phục gói dịch vụ thành công",
        description: "Gói dịch vụ của bạn đã được khôi phục",
        variant: "success",
      })

      router.refresh()
      return data
    } catch (error) {
      console.error("Resume subscription error:", error)
      toast({
        title: "Lỗi khôi phục gói dịch vụ",
        description: error.message || "Đã xảy ra lỗi khi khôi phục gói dịch vụ",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createCheckout,
    capturePayment,
    cancelSubscription,
    resumeSubscription,
  }
}
