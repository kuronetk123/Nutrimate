import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Format currency to VND
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value)
}

export function RevenueChart({ data, title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={data}
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
  )
}
