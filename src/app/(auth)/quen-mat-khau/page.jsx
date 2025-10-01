"use client"

import Link from "next/link"
import { ChefHat, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="container flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                    <ChefHat className="h-6 w-6 text-orange-500" />
                    <span>Nutrimate</span>
                </Link>
            </div>
            <div className="flex flex-1 items-center justify-center">
                <div className="mx-auto w-full max-w-[450px] rounded-xl border bg-card p-8 shadow-sm">
                    <ForgotPasswordForm />
                </div>
            </div>
            <footer className="py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Nutrimate. Đã đăng ký bản quyền.
            </footer>
        </div>
    )
}

function ForgotPasswordForm() {
    const [isSubmitted, setIsSubmitted] = useState(false)

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-orange-100 p-3">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold">Kiểm tra email của bạn</h1>
                <p className="text-muted-foreground">
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến.
                </p>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSubmitted(false)}>
                    Gửi lại email
                </Button>
                <Link
                    href="/dang-nhap"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>
                <p className="text-muted-foreground">
                    Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="email@example.com" type="email" />
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => setIsSubmitted(true)}>
                    Gửi liên kết đặt lại
                </Button>
                <Link
                    href="/dang-nhap"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
                </Link>
            </div>
        </div>
    )
}
