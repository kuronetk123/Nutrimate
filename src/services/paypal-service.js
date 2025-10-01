// const PAYPAL_API =
//   process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
const PAYPAL_API = "https://api-m.sandbox.paypal.com"

// Get base URL with fallback
function getBaseUrl() {
  // First try server-side environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // For client-side, try window.location
  if (typeof window !== "undefined") {
    const { protocol, host } = window.location
    return `${protocol}//${host}`
  }

  // Fallback to localhost if nothing else works
  return "http://localhost:3000"
}

// Get PayPal access token
async function getAccessToken() {
  try {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {

      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal token error:", data)
      throw new Error("Failed to get PayPal access token")
    }

    return data.access_token
  } catch (error) {
    console.error("PayPal token error:", error)
    throw new Error("Failed to get PayPal access token")
  }
}

// Create PayPal order
export async function createOrder(planDetails) {
  try {
    const accessToken = await getAccessToken()
    const baseUrl = getBaseUrl()

    // Ensure we have a valid base URL
    if (!baseUrl || baseUrl.includes("undefined")) {
      throw new Error("Invalid application URL. Please check your environment configuration.")
    }

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: planDetails.planId,
          description: `Nutrimate ${planDetails.planName} Subscription`,
          amount: {
            currency_code: "USD",
            value: planDetails.price.toString(),
          },
        },
      ],
      application_context: {
        brand_name: "Nutrimate",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${baseUrl}/thanh-toan/thanh-cong`,
        cancel_url: `${baseUrl}/thanh-toan/huy`,
      },
    }

    console.log("PayPal order payload:", JSON.stringify(payload, null, 2))

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal create order error:", data)
      throw new Error(data.message || "Failed to create PayPal order")
    }

    return data
  } catch (error) {
    console.error("PayPal create order error:", error)
    throw new Error(error.message || "Failed to create PayPal order")
  }
}

// Create PayPal subscription plan
export async function createPlan(planData) {
  try {
    const accessToken = await getAccessToken()

    const payload = {
      product_id: planData.productId,
      name: planData.name,
      description: planData.description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: planData.intervalUnit, // "MONTH" or "YEAR"
            interval_count: planData.intervalCount || 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0, // 0 means infinite
          pricing_scheme: {
            fixed_price: {
              value: planData.price.toString(),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: "0",
        inclusive: false,
      },
    }

    const response = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal create plan error:", data)
      throw new Error(data.message || "Failed to create PayPal plan")
    }

    return data
  } catch (error) {
    console.error("PayPal create plan error:", error)
    throw new Error(error.message || "Failed to create PayPal plan")
  }
}

// Create PayPal subscription
export async function createSubscription(subscriptionData) {
  try {
    const accessToken = await getAccessToken()
    const baseUrl = getBaseUrl()

    const payload = {
      plan_id: subscriptionData.planId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Start 1 minute from now
      quantity: "1",
      shipping_amount: {
        currency_code: "USD",
        value: "0.00",
      },
      subscriber: {
        name: {
          given_name: subscriptionData.subscriber.firstName,
          surname: subscriptionData.subscriber.lastName,
        },
        email_address: subscriptionData.subscriber.email,
      },
      application_context: {
        brand_name: "Nutrimate",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: `${baseUrl}/thanh-toan/thanh-cong`,
        cancel_url: `${baseUrl}/thanh-toan/huy`,
      },
    }

    const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal create subscription error:", data)
      throw new Error(data.message || "Failed to create PayPal subscription")
    }

    return data
  } catch (error) {
    console.error("PayPal create subscription error:", error)
    throw new Error(error.message || "Failed to create PayPal subscription")
  }
}

// Get PayPal subscription details
export async function getSubscription(subscriptionId) {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal get subscription error:", data)
      throw new Error(data.message || "Failed to get PayPal subscription")
    }

    return data
  } catch (error) {
    console.error("PayPal get subscription error:", error)
    throw new Error(error.message || "Failed to get PayPal subscription")
  }
}

// Cancel PayPal subscription
export async function cancelSubscription(subscriptionId, reason = "User requested cancellation") {
  try {
    const accessToken = await getAccessToken()

    const payload = {
      reason: reason,
    }

    const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const data = await response.json()
      console.error("PayPal cancel subscription error:", data)
      throw new Error(data.message || "Failed to cancel PayPal subscription")
    }

    return { success: true }
  } catch (error) {
    console.error("PayPal cancel subscription error:", error)
    throw new Error(error.message || "Failed to cancel PayPal subscription")
  }
}

// Verify PayPal webhook signature
export async function verifyWebhookSignature(headers, body, webhookId) {
  try {
    const accessToken = await getAccessToken()

    const payload = {
      transmission_id: headers["paypal-transmission-id"],
      cert_id: headers["paypal-cert-id"],
      auth_algo: headers["paypal-auth-algo"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId || process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: body,
    }

    const response = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal webhook verification error:", data)
      return false
    }

    return data.verification_status === "SUCCESS"
  } catch (error) {
    console.error("PayPal webhook verification error:", error)
    return false
  }
}

// Capture PayPal payment
export async function capturePayment(orderId) {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal capture payment error:", data)
      throw new Error(data.message || "Failed to capture PayPal payment")
    }

    return data
  } catch (error) {
    console.error("PayPal capture payment error:", error)
    throw new Error(error.message || "Failed to capture PayPal payment")
  }
}

// Get order details
export async function getOrderDetails(orderId) {
  try {
    const accessToken = await getAccessToken()

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal get order error:", data)
      throw new Error(data.message || "Failed to get PayPal order details")
    }

    return data
  } catch (error) {
    console.error("PayPal get order error:", error)
    throw new Error(error.message || "Failed to get PayPal order details")
  }
}

// Get subscription transactions
export async function getSubscriptionTransactions(subscriptionId, startDate, endDate) {
  try {
    const accessToken = await getAccessToken()

    const params = new URLSearchParams({
      start_time: startDate,
      end_time: endDate,
    })

    const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/transactions?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal get subscription transactions error:", data)
      throw new Error(data.message || "Failed to get subscription transactions")
    }

    return data
  } catch (error) {
    console.error("PayPal get subscription transactions error:", error)
    throw new Error(error.message || "Failed to get subscription transactions")
  }
}
