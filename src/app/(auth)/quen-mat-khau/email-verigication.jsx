"use client"


import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export default function EmailVerification({ email, onVerified, onResend }) {
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState < string | null > (null)
    const [success, setSuccess] = useState(false)
    const [resending, setResending] = useState(false)
    const [countdown, setCountdown] = useState(0)

    // Handle input change for verification code
    const handleCodeChange = (index, value) => {
        if (value.length > 1) {
            value = value.charAt(0)
        }

        if (value && !/^\d+$/.test(value)) {
            return
        }

        const newCode = [...verificationCode]
        newCode[index] = value
        setVerificationCode(newCode)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`)
            if (nextInput) {
                nextInput.focus()
            }
        }
    }

    // Handle key down for backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`)
            if (prevInput) {
                prevInput.focus()
            }
        }
    }

    // Handle paste event
    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text")
        if (pastedData.length <= 6 && /^\d+$/.test(pastedData)) {
            const newCode = [...verificationCode]
            for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
                newCode[i] = pastedData.charAt(i)
            }
            setVerificationCode(newCode)

            // Focus the appropriate input
            if (pastedData.length < 6) {
                const nextInput = document.getElementById(`code-${pastedData.length}`)
                if (nextInput) {
                    nextInput.focus()
                }
            }
        }
    }

    // Handle verification
    const handleVerify = async () => {
        const code = verificationCode.join("")
        if (code.length !== 6) {
            setError("Vui lòng nhập đầy đủ mã xác thực 6 chữ số")
            return
        }

        setIsVerifying(true)
        setError(null)

        try {
            // Mock API call - replace with actual verification API
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Simulate successful verification
            setSuccess(true)
            setTimeout(() => {
                onVerified()
            }, 1000)
        } catch (err) {
            setError("Mã xác thực không hợp lệ. Vui lòng thử lại.")
        } finally {
            setIsVerifying(false)
        }
    }

    // Handle resend code
    const handleResend = async () => {
        if (countdown > 0) return

        setResending(true)
        setError(null)

        try {
            await onResend()
            setCountdown(60)
        } catch (err) {
            setError("Không thể gửi lại mã. Vui lòng thử lại sau.")
        } finally {
            setResending(false)
        }
    }

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown])

    if (success) {
        return (
            <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <AlertTitle className="text-emerald-700">Xác thực thành công!</AlertTitle>
                <AlertDescription>Email của bạn đã được xác thực. Đang chuyển hướng...</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Xác thực email của bạn</h2>
                <p className="text-muted-foreground">
                    Chúng tôi đã gửi mã xác thực 6 chữ số đến <span className="font-medium">{email}</span>
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="code-0">Mã xác thực</Label>
                    <div className="flex justify-center gap-2">
                        {verificationCode.map((digit, index) => (
                            <Input
                                key={index}
                                id={`code-${index}`}
                                type="text"
                                inputMode="numeric"
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-12 h-12 text-center text-lg"
                                maxLength={1}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Lỗi</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    onClick={handleVerify}
                    disabled={isVerifying || verificationCode.some((digit) => !digit)}
                >
                    {isVerifying ? "Đang xác thực..." : "Xác thực"}
                </Button>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Không nhận được mã?{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto text-emerald-500"
                            onClick={handleResend}
                            disabled={resending || countdown > 0}
                        >
                            {resending ? (
                                <span className="flex items-center">
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Đang gửi lại...
                                </span>
                            ) : countdown > 0 ? (
                                `Gửi lại sau ${countdown}s`
                            ) : (
                                "Gửi lại mã"
                            )}
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    )
}
