"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { getSession } from "next-auth/react"

function PaymentSuccessComponent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState("processing") // processing, success, error
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")
    const payerId = searchParams.get("PayerID")

    if (!token) {
      setStatus("error")
      setMessage("Không tìm thấy thông tin thanh toán")
      return
    }

    const processPayment = async () => {
      try {
        const response = await fetch("/api/payment/capture-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: token,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Đã xảy ra lỗi khi xử lý thanh toán")
        }

        setStatus("success")
        setMessage(data.message || "Thanh toán thành công")
        await getSession()
        toast({
          title: "Thanh toán thành công",
          description: "Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi",
          variant: "success",
        })
      } catch (error) {
        console.error("Payment processing error:", error)
        setStatus("error")
        setMessage(error.message || "Đã xảy ra lỗi khi xử lý thanh toán")

        toast({
          title: "Lỗi thanh toán",
          description: error.message || "Đã xảy ra lỗi khi xử lý thanh toán",
          variant: "destructive",
        })
      }
    }

    processPayment()
  }, [searchParams, toast])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {status === "processing" && "Đang xử lý thanh toán"}
              {status === "success" && "Thanh toán thành công"}
              {status === "error" && "Lỗi thanh toán"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "processing" && "Vui lòng đợi trong khi chúng tôi xử lý thanh toán của bạn"}
              {status === "success" && "Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi"}
              {status === "error" && "Đã xảy ra lỗi khi xử lý thanh toán của bạn"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            {status === "processing" && <Loader2 className="h-16 w-16 text-green-500 animate-spin" />}
            {status === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
            {status === "error" && <AlertCircle className="h-16 w-16 text-red-500" />}

            <p className="mt-4 text-center">
              {message ||
                (status === "processing"
                  ? "Đang xử lý thanh toán của bạn..."
                  : status === "success"
                    ? "Thanh toán của bạn đã được xử lý thành công."
                    : "Đã xảy ra lỗi khi xử lý thanh toán của bạn.")}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            {status === "processing" ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý
              </Button>
            ) : (
              <Button onClick={() => router.push("/profile/info")}>
                {status === "success" ? "Xem tài khoản của bạn" : "Thử lại"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
      <PaymentSuccessComponent />
    </Suspense>
  )
}
