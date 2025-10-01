import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import connectDB from "@/common/db"
//import { db } from "@/lib/db"

export async function GET() {
    try {
        // Check authentication
        const session = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get the user's subscription
        const subscription = await connectDB.userSubscription.findFirst({
            where: { userId: session.user.id },
            include: {
                plan: {
                    select: {
                        name: true,
                        description: true,
                        features: true,
                    },
                },
            },
        })

        if (!subscription) {
            return NextResponse.json({ error: "No subscription found" }, { status: 404 })
        }

        // Transform the subscription data
        const transformedSubscription = {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            createdAt: subscription.createdAt.toISOString(),
            updatedAt: subscription.updatedAt.toISOString(),
            plan: {
                id: subscription.planId,
                name: subscription.plan.name,
                description: subscription.plan.description,
                features: subscription.plan.features,
            },
        }

        return NextResponse.json(transformedSubscription)
    } catch (error) {
        console.error("Error fetching current subscription:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
