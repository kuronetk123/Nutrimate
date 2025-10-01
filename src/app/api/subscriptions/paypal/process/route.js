import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getSubscription, capturePayment } from "@/services/paypal-service"

export async function POST(request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { subscriptionId, orderId } = body

        if (!subscriptionId && !orderId) {
            return NextResponse.json({ error: "Missing subscription ID or order ID" }, { status: 400 })
        }

        // Process subscription
        if (subscriptionId) {
            // Get subscription details from PayPal
            const paypalSubscription = await getSubscription(subscriptionId)

            if (paypalSubscription.status !== "ACTIVE" && paypalSubscription.status !== "APPROVED") {
                return NextResponse.json({ error: "Subscription is not active" }, { status: 400 })
            }

            // Find the plan mapping to get our internal plan ID
            const planMapping = await db.paypalPlanMapping.findFirst({
                where: { paypalPlanId: paypalSubscription.plan_id },
            })

            if (!planMapping) {
                return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
            }

            // Calculate expiration date
            const now = new Date()
            const expirationDate = new Date()

            if (planMapping.interval === "month") {
                expirationDate.setMonth(now.getMonth() + 1)
            } else {
                expirationDate.setFullYear(now.getFullYear() + 1)
            }

            // Check if user already has a subscription
            const existingSubscription = await db.userSubscription.findFirst({
                where: { userId: session.user.id },
            })

            if (existingSubscription) {
                // Update existing subscription
                await db.userSubscription.update({
                    where: { id: existingSubscription.id },
                    data: {
                        planId: planMapping.planId,
                        paypalSubscriptionId: subscriptionId,
                        status: "active",
                        currentPeriodEnd: expirationDate,
                        cancelAtPeriodEnd: false,
                        updatedAt: new Date(),
                    },
                })
            } else {
                // Create new subscription
                await db.userSubscription.create({
                    data: {
                        userId: session.user.id,
                        planId: planMapping.planId,
                        paypalSubscriptionId: subscriptionId,
                        status: "active",
                        currentPeriodEnd: expirationDate,
                        cancelAtPeriodEnd: false,
                    },
                })
            }

            // Create transaction record
            await db.transaction.create({
                data: {
                    userId: session.user.id,
                    amount: paypalSubscription.billing_info.last_payment.amount.value,
                    currency: paypalSubscription.billing_info.last_payment.amount.currency_code,
                    status: "completed",
                    paymentMethod: "paypal",
                    paymentId: subscriptionId,
                    type: "subscription",
                    description: `Subscription to ${planMapping.interval === "month" ? "Monthly" : "Yearly"} plan`,
                },
            })

            return NextResponse.json({
                success: true,
                message: "Subscription processed successfully",
                subscription: {
                    id: subscriptionId,
                    planId: planMapping.planId,
                    status: "active",
                    currentPeriodEnd: expirationDate.toISOString(),
                    cancelAtPeriodEnd: false,
                },
            })
        }

        // Process one-time payment
        if (orderId) {
            // Capture the payment
            const captureData = await capturePayment(orderId)

            if (captureData.status !== "COMPLETED") {
                return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
            }

            // Extract payment details
            const paymentUnit = captureData.purchase_units[0]
            const amount = paymentUnit.payments.captures[0].amount.value
            const currency = paymentUnit.payments.captures[0].amount.currency_code
            const captureId = paymentUnit.payments.captures[0].id

            // Create transaction record
            await db.transaction.create({
                data: {
                    userId: session.user.id,
                    amount,
                    currency,
                    status: "completed",
                    paymentMethod: "paypal",
                    paymentId: captureId,
                    type: "one-time",
                    description: paymentUnit.description || "One-time payment",
                },
            })

            return NextResponse.json({
                success: true,
                message: "Payment processed successfully",
                payment: {
                    id: captureId,
                    amount,
                    currency,
                    status: "completed",
                },
            })
        }
    } catch (error) {
        console.error("Error processing PayPal payment:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
