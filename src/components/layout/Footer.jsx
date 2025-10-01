import React from 'react'
import Link from "next/link"
import { Sparkles, Clock, Utensils, ShoppingBag, Heart, ArrowRight, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.1),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            {/* Main footer content */}
            <div className="container relative z-10">
                {/* Top section */}
                <div className="py-12 md:py-16 ml-4">
                    <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
                        {/* Brand section */}
                        <div className="lg:col-span-2 space-y-6">
                            <Link href="/" className="flex items-center gap-3 text-2xl font-bold group">
                                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                    <Image src="/Logo.png" alt="Nutrimate logo" width={24} height={24} className="h-6 w-6 object-contain" />
                                </div>
                                <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                                    Nutrimate
                                </span>
                            </Link>
                            <p className="text-gray-300 leading-relaxed max-w-md">
                                Trợ lý nấu ăn thông minh giúp bạn khám phá công thức mới, lên kế hoạch bữa ăn và tạo món ăn ngon từ nguyên liệu có sẵn.
                            </p>

                            {/* Newsletter signup */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-white">Nhận công thức mới mỗi tuần</h4>
                                <div className="flex gap-2 max-w-sm">
                                    <Input
                                        placeholder="Email của bạn"
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:bg-white/15 transition-all"
                                    />
                                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 px-6">
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Quick links */}
                        <div className="space-y-6">
                            <h4 className="font-semibold text-white text-lg">Liên kết nhanh</h4>
                            <nav className="flex flex-col gap-3">
                                {[
                                    { href: "#features", label: "Tính năng" },
                                    { href: "#examples", label: "Ví dụ" },
                                    { href: "/dang-nhap", label: "Đăng nhập" },
                                    { href: "/dang-ky", label: "Đăng ký" }
                                ].map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.href}
                                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Support & Legal */}
                        <div className="space-y-6">
                            <h4 className="font-semibold text-white text-lg">Hỗ trợ</h4>
                            <nav className="flex flex-col gap-3">
                                {[
                                    { href: "#", label: "Trung tâm trợ giúp" },
                                    { href: "#", label: "Điều khoản sử dụng" },
                                    { href: "#", label: "Chính sách bảo mật" },
                                    { href: "#", label: "Liên hệ" }
                                ].map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.href}
                                        className="text-gray-300 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-white/10 py-6 ml-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-6">
                            <p className="text-sm text-gray-400">
                                © {new Date().getFullYear()} Nutrimate. Đã đăng ký bản quyền.
                            </p>
                            <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
                                <span>Phiên bản 2.0</span>
                                <span>•</span>
                                <span>Cập nhật lần cuối: Tháng 12, 2024</span>
                            </div>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-4 mr-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4 text-rose-400" />
                                    <span>1,200+</span>
                                </div>
                                <span>người dùng hài lòng</span>
                            </div>
                            <div className="w-px h-4 bg-white/20" />
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Sparkles className="h-4 w-4 text-orange-400" />
                                <span>Được tạo bởi AI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating elements */}
            <div className="absolute bottom-10 left-10 w-4 h-4 bg-orange-400/20 rounded-full animate-pulse" />
            <div className="absolute top-20 right-16 w-6 h-6 bg-orange-300/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        </footer>
    )
}