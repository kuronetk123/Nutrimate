"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
// use brand logo image instead of icon
import { useAuth } from "@/lib/hooks/use-auth"
import { Menu, X } from "lucide-react"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isAuthenticated, isAdmin, logout } = useAuth()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-2 items-center text-xl font-bold">
                    <Link href="/" className='flex items-center gap-2 ml-4'>
                        <Image
                            src="/Logo.png"
                            alt="Nutrimate logo"
                            width={40}
                            height={40}
                            priority
                            className="h-10 w-10 object-contain"
                        />
                        <span>Nutrimate</span>
                    </Link>

                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        {isAuthenticated &&
                            (<Link href="/ke-hoach-bua-an" className="px-4 py-2 text-sm font-medium hover:text-orange-500 transition-colors">
                                Kế hoạch bữa ăn
                            </Link>
                            )}

                        <Link href="/cong-thuc" className="px-4 py-2 text-sm font-medium hover:text-orange-500 transition-colors">
                            Công thức
                        </Link>
                        <Link href="/blog" className="px-4 py-2 text-sm font-medium hover:text-orange-500 transition-colors">
                            Blog
                        </Link>
                        <Link href="/lien-he" className="px-4 py-2 text-sm font-medium hover:text-orange-500 transition-colors">
                            Liên hệ
                        </Link>
                        <Link href="/about" className="px-4 py-2 text-sm font-medium hover:text-orange-500 transition-colors">
                            Giới thiệu
                        </Link>
                        <Link href="/gia-ca" className="px-4 py-2 text-sm font-medium hover:text-orange-500 transition-colors">
                            Gói đăng ký
                        </Link>
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <div className="relative ml-3">
                                    <div>
                                        <button
                                            type="button"
                                            className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                            id="user-menu"
                                            aria-expanded="false"
                                            aria-haspopup="true"
                                            onClick={toggleMenu}
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            {/* <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                            </div> */}
                                            <img className="h-8 w-8 rounded-full flex items-center justify-center" src={user?.image} />
                                        </button>
                                    </div>
                                    {isMenuOpen && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-gray-200 ring-opacity-5 focus:outline-none"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu"
                                        >
                                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 cursor-pointer">
                                                {user?.name || user?.email}
                                            </div>
                                            <Link
                                                href="/profile/info"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                role="menuitem"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Hồ sơ
                                            </Link>
                                            <Link
                                                href="/assistant"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                role="menuitem"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Hỗ trợ
                                            </Link>
                                            {isAdmin && (<Link
                                                href="/admin/recipes"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                role="menuitem"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Admin
                                            </Link>)}

                                            <button
                                                onClick={() => {
                                                    logout()
                                                    setIsMenuOpen(false)
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                                role="menuitem"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link
                                        href="/dang-nhap"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-600 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
                                    >
                                        Đăng nhập
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                            </button>
                        </div>



                        <Button className="ml-2 bg-orange-500 hover:bg-orange-600">
                            <Link href="/cong-thuc/aiSuggest" >
                                Bắt đầu
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
