
// Get available subscription plans
async function getSubscriptionPlans() {
    try {
        const response = await fetch("/api/subscriptions/plans")

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy danh sách gói dịch vụ")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching subscription plans:", error)
        throw error
    }
}

// Get current user subscription
async function getCurrentSubscription() {
    try {
        const response = await fetch("/api/subscriptions/current")

        if (response.status === 404) {
            return null
        }

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy thông tin gói dịch vụ")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching current subscription:", error)
        throw error
    }
}

// Create PayPal checkout session for subscription
async function createPayPalCheckout(planId, interval) {
    try {
        if (!planId) {
            throw new Error("ID gói dịch vụ không hợp lệ")
        }

        // Send request to API
        const response = await fetch("/api/subscriptions/paypal/create-checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ planId, interval }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Đã xảy ra lỗi khi tạo phiên thanh toán")
        }

        return data
    } catch (error) {
        console.error("Error creating PayPal checkout:", error)
        throw error
    }
}

// Process PayPal subscription approval
async function processPayPalApproval(subscriptionId, orderId) {
    try {
        if (!subscriptionId && !orderId) {
            throw new Error("Thông tin thanh toán không hợp lệ")
        }

        // Send request to API
        const response = await fetch("/api/subscriptions/paypal/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subscriptionId,
                orderId,
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Đã xảy ra lỗi khi xử lý thanh toán")
        }

        return data
    } catch (error) {
        console.error("Error processing PayPal approval:", error)
        throw error
    }
}

// Cancel subscription
async function cancelSubscription(reason) {
    try {
        // Send request to API
        const response = await fetch("/api/subscriptions/cancel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Đã xảy ra lỗi khi hủy gói dịch vụ")
        }

        return data
    } catch (error) {
        console.error("Error canceling subscription:", error)
        throw error
    }
}

// Resume subscription
async function resumeSubscription() {
    try {
        // Send request to API
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

        return data
    } catch (error) {
        console.error("Error resuming subscription:", error)
        throw error
    }
}

// Get billing history
async function getBillingHistory(page = 1, limit = 10) {
    try {
        const response = await fetch(`/api/subscriptions/billing-history?page=${page}&limit=${limit}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy lịch sử thanh toán")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching billing history:", error)
        throw error
    }
}

// Update payment method
async function updatePaymentMethod() {
    try {
        // Send request to API
        const response = await fetch("/api/subscriptions/update-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || "Đã xảy ra lỗi khi cập nhật phương thức thanh toán")
        }

        return data
    } catch (error) {
        console.error("Error updating payment method:", error)
        throw error
    }
}

module.exports = {
    getSubscriptionPlans,
    getCurrentSubscription,
    createPayPalCheckout,
    processPayPalApproval,
    cancelSubscription,
    resumeSubscription,
    getBillingHistory,
    updatePaymentMethod,
}
