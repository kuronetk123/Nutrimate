import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyWebhookSignature, getSubscription } from "@/services/paypal-service"

export async function POST(request) {
    try {
        // Get the raw request body and headers
        const body = await request.json()
        const headers = Object.fromEntries(request.headers)

        // Verify the webhook signature
        const isValid = await verifyWebhookSignature(headers, body)

        if (!isValid) {
            console.error("Invalid PayPal webhook signature")
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
        }

        // Process the webhook event
        const event = body
        const eventType = event.event_type

        console.log(`Processing PayPal webhook: ${eventType}`)

        switch (eventType) {
            case "BILLING.SUBSCRIPTION.CREATED":
                // Subscription was created
                await handleSubscriptionCreated(event.resource)
                break

            case "BILLING.SUBSCRIPTION.ACTIVATED":
                // Subscription was activated
                await handleSubscriptionActivated(event.resource)
                break

            case "BILLING.SUBSCRIPTION.UPDATED":
                // Subscription was updated
                await handleSubscriptionUpdated(event.resource)
                break

            case "BILLING.SUBSCRIPTION.CANCELLED":
                // Subscription was cancelled
                await handleSubscriptionCancelled(event.resource)
                break

            case "BILLING.SUBSCRIPTION.SUSPENDED":
                // Subscription was suspended
                await handleSubscriptionSuspended(event.resource)
                break

            case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
                // Subscription payment failed
                await handleSubscriptionPaymentFailed(event.resource)
                break

            case "BILLING.SUBSCRIPTION.EXPIRED":
                // Subscription expired
                await handleSubscriptionExpired(event.resource)
                break

            case "PAYMENT.CAPTURE.COMPLETED":
                // Payment was captured successfully
                await handlePaymentCaptured(event.resource)
                break

            case "PAYMENT.CAPTURE.REFUNDED":
                // Payment was refunded
                await handlePaymentRefunded(event.resource)
                break

            default:
                console.log(`Unhandled PayPal webhook event: ${eventType}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error("Error processing PayPal webhook:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}

// Handler functions for different webhook events

async function handleSubscriptionCreated(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription created: ${subscriptionId}`)

    // This is usually handled by the checkout process, but we can update if needed
}

async function handleSubscriptionActivated(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription activated: ${subscriptionId}`)

    // Get full subscription details
    const subscription = await getSubscription(subscriptionId)

    // Find the user subscription
    const userSubscription = await db.userSubscription.findFirst({
        where: { paypalSubscriptionId: subscriptionId },
    })

    if (userSubscription) {
        // Update the subscription status
        await db.userSubscription.update({
            where: { id: userSubscription.id },
            data: {
                status: "active",
                updatedAt: new Date(),
            },
        })
    }
}

async function handleSubscriptionUpdated(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription updated: ${subscriptionId}`)

    // Get full subscription details
    const subscription = await getSubscription(subscriptionId)

    // Find the user subscription
    const userSubscription = await db.userSubscription.findFirst({
        where: { paypalSubscriptionId: subscriptionId },
    })

    if (userSubscription) {
        // Update the subscription details
        await db.userSubscription.update({
            where: { id: userSubscription.id },
            data: {
                status: mapPayPalStatus(subscription.status),
                updatedAt: new Date(),
            },
        })
    }
}

async function handleSubscriptionCancelled(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription cancelled: ${subscriptionId}`)

    // Find the user subscription
    const userSubscription = await db.userSubscription.findFirst({
        where: { paypalSubscriptionId: subscriptionId },
    })

    if (userSubscription) {
        // Update the subscription status
        await db.userSubscription.update({
            where: { id: userSubscription.id },
            data: {
                status: "canceled",
                cancelAtPeriodEnd: true,
                updatedAt: new Date(),
            },
        })
    }
}

async function handleSubscriptionSuspended(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription suspended: ${subscriptionId}`)

    // Find the user subscription
    const userSubscription = await db.userSubscription.findFirst({
        where: { paypalSubscriptionId: subscriptionId },
    })

    if (userSubscription) {
        // Update the subscription status
        await db.userSubscription.update({
            where: { id: userSubscription.id },
            data: {
                status: "suspended",
                updatedAt: new Date(),
            },
        })
    }
}

async function handleSubscriptionPaymentFailed(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription payment failed: ${subscriptionId}`)

    // Find the user subscription
    const userSubscription = await db.userSubscription.findFirst({
        where: { paypalSubscriptionId: subscriptionId },
    })

    if (userSubscription) {
        // Update the subscription status
        await db.userSubscription.update({
            where: { id: userSubscription.id },
            data: {
                status: "past_due",
                updatedAt: new Date(),
            },
        })

        // Create a failed payment record
        await db.transaction.create({
            data: {
                userId: userSubscription.userId,
                amount: resource.billing_info?.last_failed_payment?.amount?.value || 0,
                currency: resource.billing_info?.last_failed_payment?.amount?.currency_code || "VND",
                status: "failed",
                paymentMethod: "paypal",
                paymentId: resource.id,
                type: "subscription",
                description: "Failed subscription payment",
            },
        })
    }
}

async function handleSubscriptionExpired(resource) {
    const subscriptionId = resource.id
    console.log(`Subscription expired: ${subscriptionId}`)

    // Find the user subscription
    const userSubscription = await db.userSubscription.findFirst({
        where: { paypalSubscriptionId: subscriptionId },
    })

    if (userSubscription) {
        // Update the subscription status
        await db.userSubscription.update({
            where: { id: userSubscription.id },
            data: {
                status: "canceled",
                cancelAtPeriodEnd: true,
                updatedAt: new Date(),
            },
        })
    }
}

async function handlePaymentCaptured(resource) {
    const captureId = resource.id
    const paymentId = resource.supplementary_data?.related_ids?.order_id
    console.log(`Payment captured: ${captureId} for order ${paymentId}`)

    // Check if this is a subscription payment
    if (resource.custom_id) {
        const subscriptionId = resource.custom_id

        // Find the user subscription
        const userSubscription = await db.userSubscription.findFirst({
            where: { paypalSubscriptionId: subscriptionId },
        })

        if (userSubscription) {
            // Update the subscription period end date
            const currentPeriodEnd = new Date(userSubscription.currentPeriodEnd)
            const newPeriodEnd = new Date(currentPeriodEnd)

            // Find the plan to determine interval
            const planMapping = await db.paypalPlanMapping.findFirst({
                where: { planId: userSubscription.planId },
            })

            if (planMapping) {
                if (planMapping.interval === "month") {
                    newPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1)
                } else {
                    newPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1)
                }

                // Update the subscription
                await db.userSubscription.update({
                    where: { id: userSubscription.id },
                    data: {
                        currentPeriodEnd: newPeriodEnd,
                        status: "active",
                        updatedAt: new Date(),
                    },
                })
            }

            // Create a transaction record
            await db.transaction.create({
                data: {
                    userId: userSubscription.userId,
                    amount: resource.amount.value,
                    currency: resource.amount.currency_code,
                    status: "completed",
                    paymentMethod: "paypal",
                    paymentId: captureId,
                    type: "subscription",
                    description: "Subscription renewal payment",
                },
            })
        }
    }
}

async function handlePaymentRefunded(resource) {
    const refundId = resource.id
    const captureId = resource.links
        .find((link) => link.rel === "capture")
        .href.split("/")
        .pop()
    console.log(`Payment refunded: ${refundId} for capture ${captureId}`)

    // Find the transaction
    const transaction = await db.transaction.findFirst({
        where: { paymentId: captureId },
    })

    if (transaction) {
        // Update the transaction status
        await db.transaction.update({
            where: { id: transaction.id },
            data: {
                status: "refunded",
                updatedAt: new Date(),
            },
        })

        // If this was a subscription payment, update the subscription
        if (transaction.type === "subscription") {
            const userSubscription = await db.userSubscription.findFirst({
                where: { userId: transaction.userId },
            })

            if (userSubscription) {
                await db.userSubscription.update({
                    where: { id: userSubscription.id },
                    data: {
                        status: "canceled",
                        updatedAt: new Date(),
                    },
                })
            }
        }
    }
}

// Helper function to map PayPal status to our status
function mapPayPalStatus(paypalStatus) {
    switch (paypalStatus) {
        case "ACTIVE":
            return "active"
        case "SUSPENDED":
            return "suspended"
        case "CANCELLED":
            return "canceled"
        case "EXPIRED":
            return "canceled"
        default:
            return "active"
    }
}
