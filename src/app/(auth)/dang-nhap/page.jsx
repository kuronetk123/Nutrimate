"use client"
import { Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"

function LoginPageChild() {
    const { isAuthenticated } = useAuth();
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/onboarding"

    if (isAuthenticated) {
        router.push("ke-hoach-bua-an")
    }
    return (
        <div className="flex min-h-screen flex-col">

            <div className="flex flex-1 items-center justify-center">
                <div className="mx-auto grid w-full max-w-[900px] grid-cols-1 gap-8 rounded-xl border bg-card p-8 shadow-sm md:grid-cols-2 lg:p-12">
                    {/* left */}

                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold text-gray-800">Chào mừng đến với Nutrimate! 👨‍🍳</h1>
                            <p className="text-muted-foreground text-base">
                                Nutrimate là trợ lý ẩm thực thông minh giúp bạn lên thực đơn phù hợp với mục tiêu sức khỏe và khẩu vị cá nhân.
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Đăng nhập bằng Google để bắt đầu hành trình ẩm thực cá nhân hóa của bạn!
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Button
                                className="w-full ring-1 text-orange-500 bg-orange-50 hover:bg-orange-400 cursor-pointer hover:text-white"
                                onClick={() => signIn("google", { callbackUrl })}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                    <path
                                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                        fill="#34A853"
                                    />
                                </svg>      Đăng nhập với Google
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Bạn chưa có tài khoản? Tài khoản sẽ được tạo tự động sau khi đăng nhập Google.
                            </p>
                        </div>
                    </div>
                    {/* Right img */}
                    <div className="hidden md:flex md:items-center md:justify-center">
                        <div className="relative h-full w-full max-w-[300px] overflow-hidden rounded-lg">
                            <Image
                                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Đăng nhập"
                                width={400}
                                height={600}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-xl font-bold">Khám phá món ăn mới</h3>
                                <p className="text-sm">Đăng nhập để lưu công thức yêu thích và nhận gợi ý cá nhân hóa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Nutrimate. Đã đăng ký bản quyền.
            </footer>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">Đang tải...</div>}>
            <LoginPageChild />
        </Suspense>
    )
}