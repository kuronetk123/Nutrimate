"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    getSubscriptionPlans,
    getCurrentSubscription,
    createPayPalCheckout,
    processPayPalApproval,
    cancelSubscription,
    resumeSubscription,
    getBillingHistory,
} from "@/services/subscription-service"

// Create context
const SubscriptionContext = createContext(undefined)

// Provider component
export function SubscriptionProvider({ children }) {
    const [plans, setPlans] = useState([])
    const [currentSubscription, setCurrentSubscription] = useState(null)
    const [billingHistory, setBillingHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { toast } = useToast()

    // Fetch subscription plans
    const fetchPlans = async () => {
        try {
            setIsLoading(true)
            const data = await getSubscriptionPlans()
            setPlans(data)
            setError(null)
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi lấy danh sách gói dịch vụ")
            toast({
                title: "Lỗi",
                description: err.message || "Đã xảy ra lỗi khi lấy danh sách gói dịch vụ",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch current subscription
    const fetchCurrentSubscription = async () => {
        try {
            setIsLoading(true)
            const data = await getCurrentSubscription()
            setCurrentSubscription(data)
            setError(null)
        } catch (err) {
            // Only set error if it's not a 404 (no subscription)
            if (err.message !== "No subscription found") {
                setError(err.message || "Đã xảy ra lỗi khi lấy thông tin gói dịch vụ")
                toast({
                    title: "Lỗi",
                    description: err.message || "Đã xảy ra lỗi khi lấy thông tin gói dịch vụ",
                    variant: "destructive",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch billing history
    const fetchBillingHistory = async (page = 1, limit = 10) => {
        try {
            setIsLoading(true)
            const data = await getBillingHistory(page, limit)
            setBillingHistory(data)
            setError(null)
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi lấy lịch sử thanh toán")
            toast({
                title: "Lỗi",
                description: err.message || "Đã xảy ra lỗi khi lấy lịch sử thanh toán",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Initialize data
    useEffect(() => {
        fetchPlans()
        fetchCurrentSubscription()
    }, [])

    // Subscribe to a plan
    const subscribe = async (planId, interval) => {
        try {
            setIsLoading(true)
            setError(null)

            // Create PayPal checkout session
            const { approvalUrl, subscriptionId } = await createPayPalCheckout(planId, interval)

            // Store subscription ID in session storage for later use
            sessionStorage.setItem("pendingSubscriptionId", subscriptionId)

            // Redirect to PayPal for approval
            window.location.href = approvalUrl
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi tạo phiên thanh toán")
            toast({
                title: "Lỗi",
                description: err.message || "Đã xảy ra lỗi khi tạo phiên thanh toán",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Process subscription approval
    const processApproval = async (subscriptionId, orderId) => {
        try {
            setIsLoading(true)
            setError(null)

            // Process the approval
            await processPayPalApproval(subscriptionId, orderId)

            // Refresh subscription data
            await fetchCurrentSubscription()

            toast({
                title: "Thành công",
                description: "Đăng ký gói dịch vụ thành công",
            })

            // Redirect to dashboard
            router.push("/dashboard")
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi xử lý thanh toán")
            toast({
                title: "Lỗi",
                description: err.message || "Đã xảy ra lỗi khi xử lý thanh toán",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Cancel subscription
    const cancelCurrentSubscription = async (reason) => {
        try {
            setIsLoading(true)
            setError(null)

            // Cancel the subscription
            await cancelSubscription(reason)

            // Refresh subscription data
            await fetchCurrentSubscription()

            toast({
                title: "Thành công",
                description: "Gói dịch vụ sẽ bị hủy vào cuối kỳ thanh toán hiện tại",
            })
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi hủy gói dịch vụ")
            toast({
                title: "Lỗi",
                description: err.message || "Đã xảy ra lỗi khi hủy gói dịch vụ",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Resume subscription
    const resumeCurrentSubscription = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Resume the subscription
            await resumeSubscription()

            // Refresh subscription data
            await fetchCurrentSubscription()

            toast({
                title: "Thành công",
                description: "Gói dịch vụ đã được khôi phục",
            })
        } catch (err) {
            setError(err.message || "Đã xảy ra lỗi khi khôi phục gói dịch vụ")
            toast({
                title: "Lỗi",
                description: err.message || "Đã xảy ra lỗi khi khôi phục gói dịch vụ",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Check if user has access to a feature
    const hasAccess = (featureKey) => {
        if (!currentSubscription) return false

        // Get the plan features
        const planFeatures = currentSubscription.plan.features || []

        // Check if the feature is included in the plan
        return planFeatures.includes(featureKey)
    }

    // Format currency
    const formatCurrency = (amount, currency = "VND") => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency,
        }).format(amount)
    }

    // Context value
    const value = {
        plans,
        currentSubscription,
        billingHistory,
        isLoading,
        error,
        fetchPlans,
        fetchCurrentSubscription,
        fetchBillingHistory,
        subscribe,
        processApproval,
        cancelSubscription: cancelCurrentSubscription,
        resumeSubscription: resumeCurrentSubscription,
        hasAccess,
        formatCurrency,
        clearError: () => setError(null),
    }

    return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

// Hook for using subscription context
export function useSubscription() {
    const context = useContext(SubscriptionContext)
    if (context === undefined) {
        throw new Error("useSubscription must be used within a SubscriptionProvider")
    }
    return context
}
