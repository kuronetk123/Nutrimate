import { NextResponse } from "next/server"
import { capturePayment, getOrderDetails } from "@/services/paypal-service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/common/db"
import Transaction from "@/database/models/Transaction"
import Subscription from "@/database/models/Subscription"
import User from "@/database/models/User"
import mongoose from "mongoose"

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Bạn cần đăng nhập để hoàn tất thanh toán" }, { status: 401 })
    }

    // Get order ID from request
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Thiếu mã đơn hàng" }, { status: 400 })
    }

    // Capture payment
    const captureData = await capturePayment(orderId)

    // Get order details
    const orderDetails = await getOrderDetails(orderId)

    // Connect to database
    await connectDB()

    // Get plan details from order
    const purchaseUnit = orderDetails.purchase_units[0]
    const planId = purchaseUnit.reference_id
    const amount = Number.parseFloat(purchaseUnit.amount.value)

    // Determine plan type and duration
    let planType, planDuration

    if (planId.includes("basic")) {
      planType = "basic"
    } else if (planId.includes("premium")) {
      planType = "premium"
    } else {
      planType = "professional"
    }

    if (planId.includes("monthly")) {
      planDuration = "monthly"
    } else if (planId.includes("yearly")) {
      planDuration = "yearly"
    } else {
      planDuration = "lifetime"
    }

    // Calculate subscription end date
    const startDate = new Date()
    let endDate

    if (planDuration === "monthly") {
      endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (planDuration === "yearly") {
      endDate = new Date(startDate)
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      // Lifetime subscription - set to 100 years
      endDate = new Date(startDate)
      endDate.setFullYear(endDate.getFullYear() + 100)
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: new mongoose.Types.ObjectId(session.user.id),
      amount,
      currency: "VND",
      status: "completed",
      paymentMethod: "paypal",
      paymentId: captureData.id,
      planType,
      planDuration,
      metadata: {
        orderId,
        paypalOrderId: captureData.id,
        captureId: captureData.purchase_units[0].payments.captures[0].id,
      },
    })

    await transaction.save()

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId: session.user.id,
      status: "active",
    })
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'subscription.status': planId
        }
      },
      { new: true }
    );

    // await User.findByIdAndUpdate(
    //   session.user.id,
    //   {
    //     'subscription.status': planId,
    //   },
    //   { new: true }
    // );

    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.planType = planType
      existingSubscription.planDuration = planDuration
      existingSubscription.endDate = endDate
      existingSubscription.paymentMethod = "paypal"
      existingSubscription.paymentId = captureData.id

      await existingSubscription.save()
    } else {
      // Create new subscription
      const subscription = new Subscription({
        userId: new mongoose.Types.ObjectId(session.user.id),
        planType,
        planDuration,
        status: "active",
        startDate,
        endDate,
        autoRenew: planDuration !== "lifetime",
        paymentMethod: "paypal",
        paymentId: captureData.id,
        metadata: {
          orderId,
          paypalOrderId: captureData.id,
        },
      })

      await subscription.save()
    }




    // Return success response
    return NextResponse.json({
      success: true,
      message: "Thanh toán thành công",
      transactionId: transaction._id.toString(),
    })
  } catch (error) {
    console.error("Capture payment error:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi xử lý thanh toán" }, { status: 500 })
  }
}
