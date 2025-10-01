
import { redirect } from "next/navigation"
// import { useAuth } from "@/lib/hooks/use-auth"
import { AdminSidebar } from "@/app/admin/components/admin-sidebar"

export default async function AdminLayout({ children }) {
    // Check if user is admin
    // const { isAdmin } = useAuth();
 

    // if (!isAdmin) {
    //     redirect("/dang-nhap?redirect=/admin")
    // }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 p-8">{children}</div>
        </div>
    )
}
