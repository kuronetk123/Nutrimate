"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, LayoutDashboard, Users, BookOpen, MessageSquare, Settings, LogOut, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/hooks/use-auth"

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Người dùng",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Công thức",
      href: "/admin/recipes",
      icon: BookOpen,
    },
    {
      name: "Tin nhắn liên hệ",
      href: "/admin/contact-messages",
      icon: MessageSquare,
    },
    {
      name: "Cài đặt",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="w-64 bg-orange-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-orange-800">
        <Link href="/admin" className="flex items-center gap-2 text-xl font-bold">
          <ChefHat className="h-6 w-6" />
          <span>Nutrimate Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-orange-700 text-white"
                    : "text-orange-100 hover:bg-orange-800 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-orange-800">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-orange-100 hover:bg-orange-800 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  )
}
