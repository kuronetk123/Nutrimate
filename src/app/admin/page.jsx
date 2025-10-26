"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  Users,
  BookOpen,
  CreditCard,
  DollarSign,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

// Format currency to VND with symbol ₫, convert USD to VND using exchange rate
const USD_TO_VND = 24500; // Update this rate as needed
const formatCurrency = (value) => {
  const vndValue = value * USD_TO_VND;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(vndValue).replace("đ", "₫")
}

// Format percentage
const formatPercentage = (value) => {
  return `${value > 0 ? "+" : ""}${value}%`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/dashboard/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats")
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải dữ liệu bảng điều khiển",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Bảng Điều Khiển</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Bảng Điều Khiển</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Không có dữ liệu để hiển thị</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { users, recipes, subscriptions, revenue, recentTransactions } = stats

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bảng Điều Khiển</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
          <TabsTrigger value="users">Người Dùng</TabsTrigger>
          <TabsTrigger value="subscriptions">Đăng Ký</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenue.total)}</div>
                <p className="text-xs text-muted-foreground">Tổng doanh thu từ tất cả các giao dịch</p>
              </CardContent>
            </Card>

            {/* Monthly Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh Thu Tháng Này</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenue.thisMonth)}</div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {revenue.growthRate > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={revenue.growthRate > 0 ? "text-green-500" : "text-red-500"}>
                    {formatPercentage(revenue.growthRate)}
                  </span>
                  so với tháng trước
                </p>
              </CardContent>
            </Card>

            {/* Active Subscriptions Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đăng Ký Hoạt Động</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptions.active}</div>
                <p className="text-xs text-muted-foreground">Tổng số đăng ký đang hoạt động</p>
              </CardContent>
            </Card>

            {/* Total Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.total}</div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {users.growthRate > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={users.growthRate > 0 ? "text-green-500" : "text-red-500"}>
                    {formatPercentage(users.growthRate)}
                  </span>
                  người dùng mới tháng này
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Doanh Thu Theo Tháng</CardTitle>
              <CardDescription>Biểu đồ doanh thu 12 tháng gần đây</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={revenue.monthly}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                        currency: "VND",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Doanh Thu" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Giao Dịch Gần Đây</CardTitle>
              <CardDescription>10 giao dịch gần đây nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentTransactions.map((transaction) => (
                  <div className="flex items-center" key={transaction.id}>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {transaction.user?.name || "Người dùng không xác định"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.user?.email || "Email không xác định"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{formatCurrency(transaction.amount)}</div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {transaction.status === "completed"
                          ? "Hoàn thành"
                          : transaction.status === "pending"
                            ? "Đang xử lý"
                            : "Thất bại"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenue.total)}</div>
              </CardContent>
            </Card>

            {/* Monthly Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh Thu Tháng Này</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenue.thisMonth)}</div>
              </CardContent>
            </Card>

            {/* Previous Month Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh Thu Tháng Trước</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(revenue.prevMonth)}</div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {revenue.growthRate > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={revenue.growthRate > 0 ? "text-green-500" : "text-red-500"}>
                    {formatPercentage(revenue.growthRate)}
                  </span>
                  tăng trưởng
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Xu Hướng Doanh Thu</CardTitle>
              <CardDescription>Biểu đồ doanh thu 12 tháng gần đây</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={revenue.monthly}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        notation: "compact",
                        compactDisplay: "short",
                        currency: "VND",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh Thu" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Plan Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Theo Gói</CardTitle>
                <CardDescription>Phân bổ doanh thu theo loại gói đăng ký</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenue.byPlanType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="type"
                    >
                      {revenue.byPlanType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Giao Dịch Gần Đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div className="flex items-center justify-between" key={transaction.id}>
                      <div>
                        <p className="text-sm font-medium">{transaction.user?.name || "Không xác định"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
                        <p className="text-xs text-muted-foreground">{transaction.planType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Người Dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.total}</div>
              </CardContent>
            </Card>

            {/* New Users Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Người Dùng Mới (Tháng Này)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.newThisMonth}</div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  {users.growthRate > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={users.growthRate > 0 ? "text-green-500" : "text-red-500"}>
                    {formatPercentage(users.growthRate)}
                  </span>
                  so với tháng trước
                </p>
              </CardContent>
            </Card>

            {/* Total Recipes Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng Công Thức</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipes.total}</div>
                <p className="text-xs text-muted-foreground">{recipes.newThisMonth} công thức mới tháng này</p>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Line Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Xu Hướng Tăng Trưởng Người Dùng</CardTitle>
              <CardDescription>Biểu đồ tăng trưởng người dùng 12 tháng gần đây</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={users.monthly}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, "Người dùng mới"]}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} name="Người Dùng Mới" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Growth Bar Chart */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Người Dùng Mới Theo Tháng</CardTitle>
              <CardDescription>Số lượng người dùng đăng ký mới mỗi tháng</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={users.monthly}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, "Người dùng"]}
                    labelFormatter={(label) => `Tháng: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="users" fill="#00C49F" name="Người Dùng Mới" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Active Subscriptions Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đăng Ký Hoạt Động</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subscriptions.active}</div>
              </CardContent>
            </Card>
          </div>

          {/* Subscriptions by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng Ký Theo Loại</CardTitle>
              <CardDescription>Phân bổ đăng ký theo loại gói</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subscriptions.byType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="type"
                  >
                    {subscriptions.byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
