
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle, Book, Users, Utensils, Calendar, CreditCard, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function TutorialPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả chủ đề", icon: Book },
    { id: "getting-started", name: "Bắt đầu sử dụng", icon: Users },
    { id: "mealplan", name: "Kế hoạch bữa ăn", icon: Calendar },
    { id: "recipes", name: "Công thức", icon: Utensils },
    { id: "account", name: "Tài khoản & Hồ sơ", icon: Users },
    { id: "payment", name: "Thanh toán & Đăng ký", icon: CreditCard },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "Làm thế nào để đăng ký và đăng nhập?",
      answer:
        "Nhấn vào nút Đăng ký hoặc Đăng nhập ở góc phải màn hình, điền thông tin cá nhân để tạo tài khoản hoặc truy cập nếu đã có tài khoản.",
    },
    {
      id: 2,
      category: "mealplan",
      question: "Cách tạo kế hoạch bữa ăn cá nhân?",
      answer:
        "Vào mục 'Kế hoạch bữa ăn', chọn ngày và thêm các món ăn phù hợp. Bạn có thể lưu, chỉnh sửa hoặc xóa kế hoạch bất cứ lúc nào.",
    },
    {
      id: 3,
      category: "recipes",
      question: "Tìm kiếm và lưu công thức như thế nào?",
      answer:
        "Truy cập mục 'Công thức', sử dụng thanh tìm kiếm hoặc bộ lọc để tìm món ăn. Nhấn vào biểu tượng lưu để thêm vào danh sách yêu thích.",
    },
    {
      id: 4,
      category: "account",
      question: "Làm sao để cập nhật thông tin cá nhân?",
      answer:
        "Vào mục 'Hồ sơ', chỉnh sửa thông tin như tên, email, mật khẩu và lưu thay đổi. Bạn cũng có thể cập nhật mục tiêu dinh dưỡng tại đây.",
    },
    {
      id: 5,
      category: "payment",
      question: "Các hình thức thanh toán và đăng ký?",
      answer:
        "Nutrimate hỗ trợ thanh toán qua thẻ tín dụng, VNPay, MoMo và chuyển khoản ngân hàng. Chọn gói đăng ký phù hợp để sử dụng các tính năng nâng cao.",
    },
    {
      id: 6,
      category: "getting-started",
      question: "Ứng dụng có miễn phí không?",
      answer:
        "Bạn có thể sử dụng các chức năng cơ bản miễn phí. Để truy cập các tính năng nâng cao, hãy chọn gói đăng ký phù hợp trong mục 'Gói đăng ký'.",
    },
    {
      id: 7,
      category: "mealplan",
      question: "Có thể chia sẻ kế hoạch bữa ăn không?",
      answer:
        "Bạn có thể xuất kế hoạch bữa ăn dưới dạng PDF hoặc chia sẻ qua email với bạn bè và gia đình.",
    },
    {
      id: 8,
      category: "recipes",
      question: "Làm sao để đóng góp công thức mới?",
      answer:
        "Vào mục 'Công thức', chọn 'Đăng công thức mới', điền thông tin món ăn và gửi để được kiểm duyệt trước khi hiển thị.",
    },
    {
      id: 9,
      category: "account",
      question: "Quên mật khẩu thì làm thế nào?",
      answer:
        "Nhấn vào 'Quên mật khẩu' ở trang đăng nhập, nhập email để nhận liên kết đặt lại mật khẩu.",
    },
    {
      id: 10,
      category: "payment",
      question: "Hủy đăng ký có được hoàn tiền không?",
      answer:
        "Bạn có thể hủy đăng ký bất cứ lúc nào. Chính sách hoàn tiền sẽ được áp dụng tùy theo từng gói dịch vụ và thời gian sử dụng.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-600">Trung tâm hướng dẫn Nutrimate</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu cách sử dụng Nutrimate và nhận hỗ trợ nhanh chóng
            </p>
          </div>
          {/* Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm chủ đề hướng dẫn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
            </CardContent>
          </Card>
          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${selectedCategory === category.id ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : ""}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{category.name}</span>
                </Button>
              );
            })}
          </div>
          {/* FAQ Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
                Câu hỏi thường gặp
                <Badge variant="secondary" className="ml-2">
                  {filteredFaqs.length} kết quả
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                  <p className="text-gray-600 mb-4">Thử thay đổi từ khóa hoặc chọn chủ đề khác</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
          {/* Contact Support */}
          <Card className="mt-8 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vẫn cần hỗ trợ?</h3>
              <p className="text-gray-600 mb-6">
                Nếu bạn không tìm thấy câu trả lời, hãy liên hệ đội ngũ hỗ trợ của chúng tôi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/lien-he">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Liên hệ hỗ trợ
                  </Button>
                </Link>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Gọi: +84 28 1234 5678
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
