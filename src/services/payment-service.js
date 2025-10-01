/**
 * PayPal Service
 * Handles PayPal API interactions for payments and subscriptions
 */

// PayPal API configuration
const PAYPAL_BASE_URL =
    process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

// Get PayPal access token
async function getAccessToken() {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET

        if (!clientId || !clientSecret) {
            throw new Error("PayPal credentials are not configured")
        }

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            },
            body: "grant_type=client_credentials",
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error_description || "Failed to get PayPal access token")
        }

        const data = await response.json()
        return data.access_token
    } catch (error) {
        console.error("Error getting PayPal access token:", error)
        throw error
    }
}

// Create a PayPal product (one-time setup)
async function createProduct(name, description) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/catalogs/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name,
                description,
                type: "SERVICE",
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to create PayPal product")
        }

        return await response.json()
    } catch (error) {
        console.error("Error creating PayPal product:", error)
        throw error
    }
}

// Create a subscription plan
async function createPlan(productId, planName, description, price, interval) {
    try {
        const accessToken = await getAccessToken()

        // Determine billing cycle based on interval
        const billingCycle = {
            frequency: {
                interval_unit: interval.toUpperCase(),
                interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0, // Infinite cycles
            pricing_scheme: {
                fixed_price: {
                    value: price.toString(),
                    currency_code: "VND",
                },
            },
        }

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/plans`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                product_id: productId,
                name: planName,
                description,
                status: "ACTIVE",
                billing_cycles: [billingCycle],
                payment_preferences: {
                    auto_bill_outstanding: true,
                    setup_fee: {
                        value: "0",
                        currency_code: "VND",
                    },
                    setup_fee_failure_action: "CONTINUE",
                    payment_failure_threshold: 3,
                },
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to create PayPal plan")
        }

        return await response.json()
    } catch (error) {
        console.error("Error creating PayPal plan:", error)
        throw error
    }
}

// Create a subscription
async function createSubscription(planId, returnUrl, cancelUrl) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                plan_id: planId,
                application_context: {
                    brand_name: "Nutrimate",
                    locale: "vi-VN",
                    shipping_preference: "NO_SHIPPING",
                    user_action: "SUBSCRIBE_NOW",
                    payment_method: {
                        payer_selected: "PAYPAL",
                        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
                    },
                    return_url: returnUrl,
                    cancel_url: cancelUrl,
                },
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to create PayPal subscription")
        }

        return await response.json()
    } catch (error) {
        console.error("Error creating PayPal subscription:", error)
        throw error
    }
}

// Get subscription details
async function getSubscription(subscriptionId) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to get subscription details")
        }

        return await response.json()
    } catch (error) {
        console.error("Error getting subscription details:", error)
        throw error
    }
}

// Cancel a subscription
async function cancelSubscription(subscriptionId, reason) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                reason: reason || "Customer canceled the subscription",
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to cancel subscription")
        }

        return true
    } catch (error) {
        console.error("Error canceling subscription:", error)
        throw error
    }
}

// Suspend a subscription
async function suspendSubscription(subscriptionId, reason) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/suspend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                reason: reason || "Customer requested suspension",
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to suspend subscription")
        }

        return true
    } catch (error) {
        console.error("Error suspending subscription:", error)
        throw error
    }
}

// Activate a suspended subscription
async function activateSubscription(subscriptionId, reason) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/activate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                reason: reason || "Customer requested activation",
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to activate subscription")
        }

        return true
    } catch (error) {
        console.error("Error activating subscription:", error)
        throw error
    }
}

// Update subscription pricing
async function updateSubscriptionPricing(subscriptionId, price) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/revise`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                plan_id: subscriptionId,
                shipping_amount: {
                    currency_code: "VND",
                    value: "0",
                },
                shipping_address: {
                    type: "NO_SHIPPING",
                },
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to update subscription pricing")
        }

        return true
    } catch (error) {
        console.error("Error updating subscription pricing:", error)
        throw error
    }
}

// Create a one-time payment
async function createPayment(amount, description, returnUrl, cancelUrl) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "VND",
                            value: amount.toString(),
                        },
                        description,
                    },
                ],
                application_context: {
                    brand_name: "Nutrimate",
                    locale: "vi-VN",
                    landing_page: "BILLING",
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW",
                    return_url: returnUrl,
                    cancel_url: cancelUrl,
                },
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to create PayPal payment")
        }

        return await response.json()
    } catch (error) {
        console.error("Error creating PayPal payment:", error)
        throw error
    }
}

// Capture a payment (after user approval)
async function capturePayment(orderId) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to capture PayPal payment")
        }

        return await response.json()
    } catch (error) {
        console.error("Error capturing PayPal payment:", error)
        throw error
    }
}

// Verify webhook signature
async function verifyWebhookSignature(headers, body) {
    try {
        const accessToken = await getAccessToken()
        const webhookId = process.env.PAYPAL_WEBHOOK_ID

        if (!webhookId) {
            throw new Error("PayPal webhook ID is not configured")
        }

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                auth_algo: headers["paypal-auth-algo"],
                cert_url: headers["paypal-cert-url"],
                transmission_id: headers["paypal-transmission-id"],
                transmission_sig: headers["paypal-transmission-sig"],
                transmission_time: headers["paypal-transmission-time"],
                webhook_id: webhookId,
                webhook_event: body,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to verify webhook signature")
        }

        const verification = await response.json()
        return verification.verification_status === "SUCCESS"
    } catch (error) {
        console.error("Error verifying webhook signature:", error)
        throw error
    }
}

// Get transaction details
async function getTransactionDetails(transactionId) {
    try {
        const accessToken = await getAccessToken()

        const response = await fetch(`${PAYPAL_BASE_URL}/v1/payments/payment/${transactionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to get transaction details")
        }

        return await response.json()
    } catch (error) {
        console.error("Error getting transaction details:", error)
        throw error
    }
}

// Refund a payment
async function refundPayment(captureId, amount, reason) {
    try {
        const accessToken = await getAccessToken()

        const payload = {
            note_to_payer: reason || "Refund for your payment",
        }

        if (amount) {
            payload.amount = {
                value: amount.toString(),
                currency_code: "VND",
            }
        }

        const response = await fetch(`${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to refund payment")
        }

        return await response.json()
    } catch (error) {
        console.error("Error refunding payment:", error)
        throw error
    }
}

module.exports = {
    getAccessToken,
    createProduct,
    createPlan,
    createSubscription,
    getSubscription,
    cancelSubscription,
    suspendSubscription,
    activateSubscription,
    updateSubscriptionPricing,
    createPayment,
    capturePayment,
    verifyWebhookSignature,
    getTransactionDetails,
    refundPayment,
}
