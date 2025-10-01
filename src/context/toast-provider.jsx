"use client"

import { useEffect, useState } from "react"

import { ToastProvider as Provider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/lib/hooks/use-toast"

export function ToastProvider() {
    const { toasts } = useToast()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Provider>
            {toasts.map(({ id, title, description, action, ...props }) => (
                <Toast key={id} {...props}>
                    <div className="grid gap-1">
                        {title && <ToastTitle>{title}</ToastTitle>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    {action}
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </Provider>
    )
}

import { Toast, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast"
