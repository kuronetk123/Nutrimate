import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        // Get all subscription plans
        const plans = await db.subscriptionPlan.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                monthlyPrice: true,
                yearlyPrice: true,
                features: true,
                isPopular: true,
            },
            orderBy: {
                monthlyPrice: "asc",
            },
        })

        // Transform the plans to include both monthly and yearly options
        const transformedPlans = plans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            isPopular: plan.isPopular,
            features: plan.features,
            pricing: {
                monthly: {
                    price: plan.monthlyPrice,
                    currency: "VND",
                    interval: "month",
                },
                yearly: {
                    price: plan.yearlyPrice,
                    currency: "VND",
                    interval: "year",
                    savings: Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100),
                },
            },
        }))

        return NextResponse.json(transformedPlans)
    } catch (error) {
        console.error("Error fetching subscription plans:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
