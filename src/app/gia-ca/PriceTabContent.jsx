import { Check, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

const plans = {
  monthly: [
    {
      id: "free",
      title: "Miễn phí",
      price: "0đ",
      period: "/tháng",
      description: "Bắt đầu nấu ăn với Nutrimate",
      features: [
        { text: "10 công thức mỗi tháng", included: true },
        { text: "Tìm kiếm công thức cơ bản", included: true },
        { text: "Lưu 5 công thức yêu thích", included: true },
        { text: "Kế hoạch bữa ăn hàng tuần", included: false },
        { text: "Danh sách mua sắm tự động", included: false },
        { text: "Tùy chỉnh công thức", included: false },
        { text: "Không quảng cáo", included: false },
      ],
      button: "Bắt đầu miễn phí",
      variant: "outline",
    },
    {
      id: "basic",
      title: "Cơ bản",
      badge: "Phổ biến nhất",
      price: "99.000đ",
      period: "/tháng",
      description: "Dành cho những người yêu thích nấu ăn",
      features: [
        { text: "Không giới hạn công thức", included: true },
        { text: "Tìm kiếm công thức nâng cao", included: true },
        { text: "Lưu không giới hạn công thức", included: true },
        { text: "Kế hoạch bữa ăn hàng tuần", included: true },
        { text: "Danh sách mua sắm tự động", included: true },
        { text: "Tùy chỉnh công thức", included: false },
        { text: "Không quảng cáo", included: false },
      ],
      button: "Đăng ký ngay",
      variant: "default",
    },
    {
      id: "premium-monthly",
      title: "Cao cấp (Tháng)",
      price: "199.000đ",
      period: "/tháng",
      description: "Trải nghiệm đầy đủ tính năng của Nutrimate",
      features: [
        { text: "Tất cả tính năng của gói Cơ bản", included: true },
        { text: "Tùy chỉnh công thức theo sở thích", included: true },
        { text: "Không quảng cáo", included: true },
        { text: "Tạo công thức từ ảnh nguyên liệu", included: true },
        { text: "Phân tích dinh dưỡng chi tiết", included: true },
        { text: "Hỗ trợ ưu tiên 24/7", included: true },
        { text: "Chia sẻ kế hoạch với gia đình", included: true },
      ],
      button: "Đăng ký ngay",
      variant: "default",
    },
  ],
  yearly: [
    {
      id: "premium-weekly",
      title: "Cao cấp (Tuần)",
      price: "59.000đ",
      period: "/tuần",
      description: "Tận hưởng trải nghiệm ngắn hạn với tất cả tính năng",
      features: [
        { text: "Tất cả tính năng của gói Cơ bản", included: true },
        { text: "Tùy chỉnh công thức theo sở thích", included: true },
        { text: "Không quảng cáo", included: true },
        { text: "Tạo công thức từ ảnh nguyên liệu", included: true },
        { text: "Phân tích dinh dưỡng chi tiết", included: true },
        { text: "Hỗ trợ ưu tiên 24/7", included: true },
        { text: "Chia sẻ kế hoạch với gia đình", included: true },
      ],
      button: "Đăng ký ngay",
      variant: "default",
    },
    {
      id: "premium-yearly",
      title: "Cao cấp (Năm)",
      price: "1.899.000đ",
      period: "/năm",
      description: "Giá trị cao nhất – tiết kiệm đến 400.000đ",
      features: [
        { text: "Tất cả tính năng của gói Cơ bản", included: true },
        { text: "Tùy chỉnh công thức theo sở thích", included: true },
        { text: "Không quảng cáo", included: true },
        { text: "Tạo công thức từ ảnh nguyên liệu", included: true },
        { text: "Phân tích dinh dưỡng chi tiết", included: true },
        { text: "Hỗ trợ ưu tiên 24/7", included: true },
        { text: "Chia sẻ kế hoạch với gia đình", included: true },
      ],
      button: "Đăng ký ngay",
      variant: "default",
    },
  ],
};

export function PricingTabContent({ value }) {
  return (
    <TabsContent value={value}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans[value].map((plan) => (
          <Card
            key={plan.id}
            className={plan.variant === "outline" ? "" : "border-orange-200 shadow-lg scale-[1.01] border-2"}
          >
            <CardHeader className={plan.badge ? "bg-orange-50 rounded-t-lg" : ""}>
              {plan.badge && (
                <div className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 w-fit rounded-full mb-2">
                  {plan.badge}
                </div>
              )}
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline text-5xl font-bold">
                {plan.price}
                <span className="ml-1 text-sm font-normal text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`flex items-center ${!feature.included ? "text-muted-foreground" : ""}`}
                  >
                    {feature.included ? (
                      <Check className="mr-2 h-4 w-4 text-orange-500" />
                    ) : (
                      <X className="mr-2 h-4 w-4" />
                    )}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.variant}>
                {plan.button}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}
