"use client"

import Link from "next/link"
import { useState } from "react"
import toast from 'react-hot-toast';
import { ChefHat, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Liên hệ với chúng tôi</h1>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi
                                    hoặc đề xuất nào.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Thông tin liên hệ</h2>
                                    <p className="text-muted-foreground md:text-lg">
                                        Có nhiều cách để liên hệ với chúng tôi. Chọn phương thức phù hợp nhất với bạn.
                                    </p>
                                </div>
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="rounded-full bg-orange-100 p-3">
                                            <Mail className="h-6 w-6 text-orange-700" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold">Email</h3>
                                            <p className="text-muted-foreground">info@Nutrimate.vn</p>
                                            <p className="text-muted-foreground">support@Nutrimate.vn</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="rounded-full bg-orange-100 p-3">
                                            <Phone className="h-6 w-6 text-orange-700" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold">Điện thoại</h3>
                                            <p className="text-muted-foreground">+84 (0) 123 456 789</p>
                                            <p className="text-muted-foreground">Thứ Hai - Thứ Sáu: 9:00 - 17:00</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="rounded-full bg-orange-100 p-3">
                                            <MapPin className="h-6 w-6 text-orange-700" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold">Địa chỉ</h3>
                                            <p className="text-muted-foreground">Tòa nhà Innovation, 123 Đường Nguyễn Huệ</p>
                                            <p className="text-muted-foreground">Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                                        <h3 className="mb-4 font-bold">Giờ làm việc</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Thứ Hai - Thứ Sáu:</span>
                                                <span>9:00 - 17:00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Thứ Bảy:</span>
                                                <span>10:00 - 15:00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Chủ Nhật:</span>
                                                <span>Đóng cửa</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-12 md:py-24 bg-orange-50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Câu hỏi thường gặp</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl">
                                    Dưới đây là một số câu hỏi thường gặp từ người dùng của chúng tôi
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto max-w-3xl space-y-4 py-12">
                            {[
                                {
                                    question: "Nutrimate có miễn phí không?",
                                    answer:
                                        "Nutrimate cung cấp phiên bản miễn phí với các tính năng cơ bản. Chúng tôi cũng có các gói trả phí với nhiều tính năng nâng cao hơn.",
                                },
                                {
                                    question: "Làm thế nào để bắt đầu sử dụng Nutrimate?",
                                    answer:
                                        "Để bắt đầu, bạn chỉ cần đăng ký tài khoản trên trang web của chúng tôi. Sau đó, bạn có thể nhập các nguyên liệu bạn có và Nutrimate sẽ gợi ý các công thức phù hợp.",
                                },
                                {
                                    question: "Nutrimate có hỗ trợ các chế độ ăn đặc biệt không?",
                                    answer:
                                        "Có, Nutrimate hỗ trợ nhiều chế độ ăn khác nhau như chay, không gluten, ít carb, và nhiều chế độ khác. Bạn có thể tùy chỉnh trong phần cài đặt tài khoản.",
                                },
                                {
                                    question: "Tôi có thể đóng góp công thức cho Nutrimate không?",
                                    answer:
                                        "Có, chúng tôi rất khuyến khích người dùng đóng góp công thức. Bạn có thể chia sẻ công thức của mình thông qua tính năng 'Đóng góp công thức' trong ứng dụng.",
                                },
                                {
                                    question: "Nutrimate có hoạt động trên thiết bị di động không?",
                                    answer:
                                        "Có, Nutrimate hoạt động trên tất cả các thiết bị. Chúng tôi có ứng dụng di động cho cả iOS và Android, cũng như phiên bản web có thể truy cập từ bất kỳ trình duyệt nào.",
                                },
                            ].map((faq, i) => (
                                <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                                    <h3 className="font-bold">{faq.question}</h3>
                                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>


        </div>
    )
}

function ContactForm() {
    const handleSubmit = async (e) => {
        e.preventDefault()

        const loadingToast = toast.loading('Submitting form...');
        const form = new FormData(e.target)
        const formData = Object.fromEntries(form.entries())

        try {
            const res = await fetch('/api/send-email/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {

                toast.success('Submitted form successfully!', {
                    id: loadingToast,
                });
                e.target.reset()
            }
        } catch (error) {

            toast.error('Failed to send email.');
            console.error('Error sending email:', error);
        }
        finally {
            toast.dismiss(loadingToast);

        }

    }
    const [isSubmitted, setIsSubmitted] = useState(false)

    if (isSubmitted) {
        return (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-card p-8 shadow-sm">
                <div className="rounded-full bg-orange-100 p-4">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Cảm ơn bạn đã liên hệ!</h3>
                <p className="mt-2 text-center text-muted-foreground">
                    Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
                </p>
                <Button className="mt-6 bg-orange-500 hover:bg-orange-600" onClick={() => setIsSubmitted(false)}>
                    Gửi tin nhắn khác
                </Button>
            </div>
        )
    }

    return (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold">Gửi tin nhắn cho chúng tôi</h2>
            <p className="mt-2 text-muted-foreground">
                Điền vào biểu mẫu dưới đây và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" name="name" placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" placeholder="email@example.com" type="email" required />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" placeholder="0123456789" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề</Label>
                    <Select name="subject">
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn chủ đề" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">Câu hỏi chung</SelectItem>
                            <SelectItem value="support">Hỗ trợ kỹ thuật</SelectItem>
                            <SelectItem value="billing">Thanh toán</SelectItem>
                            <SelectItem value="partnership">Hợp tác</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Tin nhắn</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Nhập tin nhắn của bạn ở đây..."
                        className="min-h-[120px]"
                        required
                    />
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 cursor-pointer">
                    <Send className="mr-2 h-4 w-4" /> Gửi tin nhắn
                </Button>
            </form>

        </div>
    )
}
