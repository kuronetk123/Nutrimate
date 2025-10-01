import { NextResponse } from "next/server"
import { createOrder } from "@/services/paypal-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Bạn cần đăng nhập để thực hiện thanh toán" }, { status: 401 })
    }

    // Get plan details from request
    const { planId, planName, planDuration, price } = await request.json()

    if (!planId || !planName || !planDuration || !price) {
      return NextResponse.json({ error: "Thiếu thông tin gói dịch vụ" }, { status: 400 })
    }

    // Create PayPal order
    const order = await createOrder({
      planId,
      planName,
      planDuration,
      price: Number.parseFloat(price) / 25000, // Convert price to USD
    })

    // Return order ID and approval URL
    return NextResponse.json({
      orderId: order.id,
      approvalUrl: order.links.find((link) => link.rel === "approve").href,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: `Đã xảy ra lỗi khi tạo đơn hàng: ${error}` }, { status: 500 })
  }
}
