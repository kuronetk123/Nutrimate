import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import PricingCard from "./components/pricing-card"

export const metadata = {
  title: "Giá cả | Nutrimate",
  description: "Các gói dịch vụ và giá cả của Nutrimate",
}

export default function PricingPage() {
  const plans = [
    {
      id: "basic-monthly",
      name: "Cơ bản",
      description: "Miễn phí – Dành cho người mới bắt đầu",
      price: 0,
      duration: "tháng",
      features: [
        "Tạo tối đa 10 công thức mỗi tháng",
        "Tạo tối đa 7 kế hoạch bữa ăn mỗi tháng",
        "Truy cập thư viện công thức cơ bản",
        "Lưu trữ 20 công thức yêu thích",
        "Hỗ trợ qua email",
      ],
      popular: false,
      durationInMonths: 1,
    },
    {
      id: "premium-monthly",
      name: "Cao cấp",
      description: "Dành cho người dùng nâng cao",
      price: 39000,
      duration: "tháng",
      features: [
        "Tạo tối đa 50 công thức mỗi tháng",
        "Tạo tối đa 30 kế hoạch bữa ăn mỗi tháng",
        "Truy cập toàn bộ thư viện công thức",
        "Lưu trữ không giới hạn công thức yêu thích",
        "Hỗ trợ qua email và chat",
        "Không quảng cáo",
      ],
      popular: true,
      durationInMonths: 1,
    },
    {
      id: "professional-monthly",
      name: "Chuyên nghiệp",
      description: "Dành cho người dùng chuyên nghiệp",
      price: 69000,
      duration: "tháng",
      features: [
        "Tạo công thức không giới hạn",
        "Tạo kế hoạch bữa ăn không giới hạn",
        "Tất cả tính năng của gói Cao cấp",
        "Tạo kế hoạch bữa ăn theo tuần",
        "Công cụ phân tích dinh dưỡng nâng cao",
        "Tạo thực đơn nhà hàng",
        "Tính toán chi phí nguyên liệu",
        "Hỗ trợ ưu tiên 24/7",
        "Đào tạo 1-1 với đầu bếp chuyên nghiệp",
      ],
      popular: false,
      durationInMonths: 1,
    },
    {
      id: "premium-yearly",
      name: "Cao cấp (Năm)",
      description: "Tiết kiệm 20% khi thanh toán theo năm",
      price: 390000,
      duration: "năm",
      features: [
        "Tạo tối đa 50 công thức mỗi tháng",
        "Tạo tối đa 30 kế hoạch bữa ăn mỗi tháng",
        "Truy cập toàn bộ thư viện công thức",
        "Tạo kế hoạch bữa ăn theo tuần",
        "Lưu trữ không giới hạn công thức yêu thích",
        "Hỗ trợ qua email và chat",
        "Không quảng cáo",
      ],
      popular: false,
      durationInMonths: 12,
    },
    {
      id: "professional-yearly",
      name: "Chuyên nghiệp (Năm)",
      description: "Tiết kiệm 20% khi thanh toán theo năm",
      price: 690000,
      duration: "năm",
      features: [
        "Tạo công thức không giới hạn",
        "Tạo kế hoạch bữa ăn không giới hạn",
        "Tất cả tính năng của gói Cao cấp",
        "Công cụ phân tích dinh dưỡng nâng cao",
        "Tạo thực đơn nhà hàng",
        "Tính toán chi phí nguyên liệu",
        "Hỗ trợ ưu tiên 24/7",
        "Đào tạo 1-1 với đầu bếp chuyên nghiệp",
      ],
      popular: false,
      durationInMonths: 12,
    },
  ];


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Chọn gói dịch vụ phù hợp với bạn</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chúng tôi cung cấp nhiều gói dịch vụ khác nhau để đáp ứng nhu cầu của bạn. Tất cả các gói đều bao gồm các tính
          năng cơ bản của Nutrimate.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Gói hàng tháng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            {plans
              .filter((plan) => plan.duration === "tháng")
              .map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
          </Suspense>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Gói hàng năm (Tiết kiệm 20%)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin" />
              </div>
            }
          >
            {plans
              .filter((plan) => plan.duration === "năm")
              .map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
          </Suspense>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4">Bạn có câu hỏi về các gói dịch vụ?</h3>
        <p className="text-gray-600 mb-6">
          Liên hệ với chúng tôi để được tư vấn về gói dịch vụ phù hợp nhất với nhu cầu của bạn.
        </p>
        <a
          href="/lien-he"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Liên hệ ngay
        </a>
      </div>
    </div>
  )
}
