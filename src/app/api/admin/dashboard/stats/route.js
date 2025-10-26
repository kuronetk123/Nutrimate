import { NextResponse } from "next/server"
import connectDB from "@/common/db"
import { requireAdmin } from "@/lib/auth"
import User from "@/database/models/User"
import Recipe from "@/database/models/Recipe"
import Subscription from "@/database/models/Subscription"
import Transaction from "@/database/models/Transaction"

export async function GET(request) {
  try {
    const user = await requireAdmin(request)
    if (user?.error) {
      return NextResponse.json({ error: "Không có quyền truy cập", detail: user.error }, { status: 403 })
    }

    await connectDB()

    // Get current date and calculate date ranges
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    const firstDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth, 0)

    // User stats
    const totalUsers = await User.countDocuments()
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    })
    const newUsersPrevMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfPrevMonth, $lte: lastDayOfPrevMonth },
    })

    // Recipe stats
    const totalRecipes = await Recipe.countDocuments()
    const newRecipesThisMonth = await Recipe.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    })

    // Subscription stats
    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
    })
    const subscriptionsByType = await Subscription.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$planType", count: { $sum: 1 } } },
    ])

    // Revenue stats
    const totalRevenue = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }])

    const revenueThisMonth = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const revenuePrevMonth = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfPrevMonth, $lte: lastDayOfPrevMonth },
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    // Monthly revenue for the past 12 months
    const last12Months = []
    for (let i = 0; i < 12; i++) {
      const startDate = new Date(currentYear, currentMonth - i, 1)
      const endDate = new Date(currentYear, currentMonth - i + 1, 0)

      last12Months.push({
        month: startDate.toLocaleString("vi-VN", { month: "short" }),
        startDate,
        endDate,
      })
    }

    const monthlyRevenue = await Promise.all(
      last12Months.map(async ({ month, startDate, endDate }) => {
        const result = await Transaction.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate, $lte: endDate },
              status: "completed",
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])

        return {
          month,
          revenue: result.length > 0 ? result[0].total : 0,
        }
      }),
    )

    // Monthly user growth for the past 12 months
    const monthlyUserGrowth = await Promise.all(
      last12Months.map(async ({ month, startDate, endDate }) => {
        const newUsers = await User.countDocuments({
          createdAt: { $gte: startDate, $lte: endDate },
        })

        return {
          month,
          users: newUsers,
        }
      }),
    )

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")

    const formattedTransactions = recentTransactions.map((tx) => ({
      id: tx._id.toString(),
      amount: tx.amount,
      status: tx.status,
      date: tx.createdAt.toISOString(),
      user: tx.userId
        ? {
          id: tx.userId._id.toString(),
          name: tx.userId.name,
          email: tx.userId.email,
        }
        : null,
      planType: tx.planType,
      paymentMethod: tx.paymentMethod,
    }))

    // Revenue by plan type
    const revenueByPlanType = await Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$planType", total: { $sum: "$amount" } } },
    ])

    return NextResponse.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        growthRate:
          newUsersPrevMonth > 0
            ? (((newUsersThisMonth - newUsersPrevMonth) / newUsersPrevMonth) * 100).toFixed(1)
            : 100,
        monthly: monthlyUserGrowth.reverse(),
      },
      recipes: {
        total: totalRecipes,
        newThisMonth: newRecipesThisMonth,
      },
      subscriptions: {
        active: activeSubscriptions,
        byType: subscriptionsByType.map((item) => ({
          type: item._id,
          count: item.count,
        })),
      },
      revenue: {
        total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        thisMonth: revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0,
        prevMonth: revenuePrevMonth.length > 0 ? revenuePrevMonth[0].total : 0,
        growthRate:
          revenuePrevMonth.length > 0 && revenuePrevMonth[0].total > 0
            ? (((revenueThisMonth.length > 0 ? revenueThisMonth[0].total : 0) - revenuePrevMonth[0].total) /
              revenuePrevMonth[0].total) *
            100
            : 0,
        monthly: monthlyRevenue.reverse(),
        byPlanType: revenueByPlanType.map((item) => ({
          type: item._id,
          total: item.total,
        })),
      },
      recentTransactions: formattedTransactions,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy thống kê bảng điều khiển" }, { status: 500 })
  }
}
