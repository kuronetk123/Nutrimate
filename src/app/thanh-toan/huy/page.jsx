"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Thanh toán đã bị hủy</CardTitle>
            <CardDescription className="text-center">Bạn đã hủy quá trình thanh toán</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <XCircle className="h-16 w-16 text-red-500" />

            <p className="mt-4 text-center">
              Thanh toán của bạn đã bị hủy. Không có khoản phí nào được tính vào tài khoản của bạn.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push("/gia-ca")}>
              Quay lại giá cả
            </Button>
            <Button onClick={() => router.push("/")}>Về trang chủ</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
