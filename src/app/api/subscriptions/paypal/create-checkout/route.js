import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
// import { db } from "@/lib/db"
import connectDB from "@/common/db"

import { createPlan, createSubscription } from "@/services/paypal-service"

export async function POST(request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { planId, interval } = body

        if (!planId || !["month", "year"].includes(interval)) {
            return NextResponse.json({ error: "Invalid plan or interval" }, { status: 400 })
        }

        // Get plan details from database
        const plan = await connectDB.subscriptionPlan.findUnique({
            where: { id: planId },
        })

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 })
        }

        // Get or create PayPal plan ID
        let paypalPlanId

        // Check if we already have a PayPal plan ID for this plan and interval
        const existingPlanMapping = await connectDB.paypalPlanMapping.findFirst({
            where: {
                planId,
                interval,
            },
        })

        if (existingPlanMapping) {
            paypalPlanId = existingPlanMapping.paypalPlanId
        } else {
            // Create a new PayPal plan
            const price = interval === "month" ? plan.monthlyPrice : plan.yearlyPrice

            // Get product ID from database or create a new one
            let productId
            const existingProduct = await connectDB.paypalProduct.findFirst({
                where: { name: "Nutrimate Subscription" },
            })

            if (existingProduct) {
                productId = existingProduct.paypalProductId
            } else {
                // This would typically be done in an admin setup, not during checkout
                return NextResponse.json({ error: "PayPal product not set up" }, { status: 500 })
            }

            // Create the plan in PayPal
            const paypalPlan = await createPlan(
                productId,
                `${plan.name} (${interval === "month" ? "Monthly" : "Yearly"})`,
                plan.description,
                price,
                interval,
            )

            // Save the PayPal plan ID mapping
            await connectDB.paypalPlanMapping.create({
                data: {
                    planId,
                    interval,
                    paypalPlanId: paypalPlan.id,
                },
            })

            paypalPlanId = paypalPlan.id
        }

        // Create a subscription in PayPal
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const returnUrl = `${baseUrl}/thanh-toan/thanh-cong`
        const cancelUrl = `${baseUrl}/thanh-toan/huy`

        const subscription = await createSubscription(paypalPlanId, returnUrl, cancelUrl)

        // Return the approval URL
        const approvalLink = subscription.links.find((link) => link.rel === "approve").href

        return NextResponse.json({
            subscriptionId: subscription.id,
            approvalUrl: approvalLink,
        })
    } catch (error) {
        console.error("Error creating PayPal checkout:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
