const API_URL = "/api/admin";

// Get admin dashboard stats
export async function getAdminStats() {
    try {
        const response = await fetch("/api/admin/stats")

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy thống kê")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi lấy thống kê")
    }
}

// Get users for admin
export async function getAdminUsers(
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            sortOrder,
        })

        if (search) {
            queryParams.append("search", search)
        }

        const response = await fetch(`/api/admin/users?${queryParams.toString()}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy danh sách người dùng")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching admin users:", error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi lấy danh sách người dùng")
    }
}

// Get user details for admin
export async function getAdminUserDetails(userId) {
    try {
        if (!userId) {
            throw new Error("ID người dùng không hợp lệ")
        }

        const response = await fetch(`/api/admin/users/${userId}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy thông tin người dùng")
        }

        return await response.json()
    } catch (error) {
        console.error(`Error fetching admin user details for ${userId}:`, error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi lấy thông tin người dùng")
    }
}

// Update user for admin
export async function updateAdminUser(
    userId,
    userData,
) {
    try {
        if (!userId) {
            throw new Error("ID người dùng không hợp lệ")
        }

        const response = await fetch(`/api/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi cập nhật người dùng")
        }

        return await response.json()
    } catch (error) {
        console.error(`Error updating admin user ${userId}:`, error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi cập nhật người dùng")
    }
}

// Delete user for admin
export async function deleteAdminUser(userId) {
    try {
        if (!userId) {
            throw new Error("ID người dùng không hợp lệ")
        }

        const response = await fetch(`/api/admin/users/${userId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi xóa người dùng")
        }

        return await response.json()
    } catch (error) {
        console.error(`Error deleting admin user ${userId}:`, error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi xóa người dùng")
    }
}

// Get recipes for admin
export async function getAdminRecipes(
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "createdAt",
    sortOrder = "desc",
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sortBy,
            sortOrder,
        })

        if (search) {
            queryParams.append("search", search)
        }

        if (category) {
            queryParams.append("category", category)
        }

        const response = await fetch(`${API_URL}/recipes?${queryParams.toString()}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy danh sách công thức")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching admin recipes:", error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi lấy danh sách công thức")
    }
}

// Update recipe publish status for admin
export async function updateRecipePublishStatus(recipeId, status) {
    try {
        if (!recipeId) {
            throw new Error("ID công thức không hợp lệ")
        }

        const response = await fetch(`/api/admin/recipes/${recipeId}/publish`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi cập nhật trạng thái công thức")
        }

        return await response.json()
    } catch (error) {
        console.error(`Error updating recipe publish status ${recipeId}:`, error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi cập nhật trạng thái công thức")
    }
}

// Delete recipe for admin
export async function deleteAdminRecipe(recipeId) {
    try {
        if (!recipeId) {
            throw new Error("ID công thức không hợp lệ")
        }

        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi xóa công thức")
        }

        return await response.json()
    } catch (error) {
        console.error(`Error deleting admin recipe ${recipeId}:`, error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi xóa công thức")
    }
}

// Get contact messages for admin
export async function getAdminContactMessages(
    page = 1,
    limit = 10,
    status,
) {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        })

        if (status) {
            queryParams.append("status", status)
        }

        const response = await fetch(`/api/admin/contact-messages?${queryParams.toString()}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi lấy danh sách tin nhắn liên hệ")
        }

        return await response.json()
    } catch (error) {
        console.error("Error fetching admin contact messages:", error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi lấy danh sách tin nhắn liên hệ")
    }
}

// Update contact message status for admin
export async function updateContactMessageStatus(
    messageId,
    status,
) {
    try {
        if (!messageId) {
            throw new Error("ID tin nhắn không hợp lệ")
        }

        const response = await fetch(`/api/admin/contact-messages/${messageId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Đã xảy ra lỗi khi cập nhật trạng thái tin nhắn")
        }

        return await response.json()
    } catch (error) {
        console.error(`Error updating contact message status ${messageId}:`, error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error("Đã xảy ra lỗi khi cập nhật trạng thái tin nhắn")
    }
}
