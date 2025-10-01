"use client"

import { useState, useCallback } from "react"
import {
    getAdminStats,
    getAdminUsers,
    getAdminUserDetails,
    updateAdminUser,
    deleteAdminUser,
    getAdminRecipes,
    updateRecipePublishStatus,
    deleteAdminRecipe,

} from "@/services/admin-service"

// Hook for admin dashboard stats
export function useAdminStats() {
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchStats = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getAdminStats()
            setStats(data)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Đã xảy ra lỗi khi lấy thống kê")
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        stats,
        isLoading,
        error,
        fetchStats,
    }
}

// Hook for admin user management
export function useAdminUsers() {
    const [users, setUsers] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchUsers = useCallback(
        async (page = 1, limit = 10, search, sortBy = "createdAt", sortOrder = "desc") => {
            setIsLoading(true)
            setError(null)

            try {
                const data = await getAdminUsers(page, limit, search, sortBy, sortOrder)
                setUsers(data.users)
                setTotalUsers(data.total)
                setTotalPages(data.pages)
                setCurrentPage(page)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Đã xảy ra lỗi khi lấy danh sách người dùng")
                }
            } finally {
                setIsLoading(false)
            }
        },
        [],
    )

    const fetchNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            fetchUsers(currentPage + 1)
        }
    }, [currentPage, totalPages, fetchUsers])

    const fetchPreviousPage = useCallback(() => {
        if (currentPage > 1) {
            fetchUsers(currentPage - 1)
        }
    }, [currentPage, fetchUsers])

    return {
        users,
        totalUsers,
        totalPages,
        currentPage,
        isLoading,
        error,
        fetchUsers,
        fetchNextPage,
        fetchPreviousPage,
    }
}

// Hook for admin user details
export function useAdminUserDetails() {
    const [userDetails, setUserDetails] = useState < AdminUserDetails | null > (null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState < string | null > (null)

    const fetchUserDetails = useCallback(async (userId) => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getAdminUserDetails(userId)
            setUserDetails(data)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Đã xảy ra lỗi khi lấy thông tin người dùng")
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateUser = useCallback(
        async (
            userId,
            userData,
        ) => {
            setIsLoading(true)
            setError(null)

            try {
                const updatedUser = await updateAdminUser(userId, userData)
                setUserDetails((prev) => (prev ? { ...prev, ...updatedUser } : null))
                return updatedUser
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Đã xảy ra lỗi khi cập nhật người dùng")
                }
                throw err
            } finally {
                setIsLoading(false)
            }
        },
        [],
    )

    const deleteUser = useCallback(async (userId) => {
        setIsLoading(true)
        setError(null)

        try {
            await deleteAdminUser(userId)
            setUserDetails(null)
            return true
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Đã xảy ra lỗi khi xóa người dùng")
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        userDetails,
        isLoading,
        error,
        fetchUserDetails,
        updateUser,
        deleteUser,
    }
}

// Hook for admin recipe management
export function useAdminRecipes() {
    const [recipes, setRecipes] = useState([])
    const [totalRecipes, setTotalRecipes] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchRecipes = useCallback(
        async (page = 1, limit = 10, search, category, sortBy = "createdAt", sortOrder = "desc") => {
            setIsLoading(true)
            setError(null)

            try {
                const data = await getAdminRecipes(page, limit, search, category, sortBy, sortOrder)
                setRecipes(data.recipes)
                setTotalRecipes(data.total)
                setTotalPages(data.pages)
                setCurrentPage(page)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Đã xảy ra lỗi khi lấy danh sách công thức")
                }
            } finally {
                setIsLoading(false)
            }
        },
        [],
    )

    const fetchNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            fetchRecipes(currentPage + 1)
        }
    }, [currentPage, totalPages, fetchRecipes])

    const fetchPreviousPage = useCallback(() => {
        if (currentPage > 1) {
            fetchRecipes(currentPage - 1)
        }
    }, [currentPage, fetchRecipes])

    // Update recipe status (pending, accepted, rejected)
    const updateRecipeStatus = useCallback(async (recipeId, status) => {
        setIsLoading(true)
        setError(null)

        try {
            await updateRecipePublishStatus(recipeId, status)
            setRecipes((prev) => prev.map((recipe) => (recipe.id === recipeId ? { ...recipe, status } : recipe)))
            return true
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Đã xảy ra lỗi khi cập nhật trạng thái công thức")
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    const deleteRecipe = useCallback(async (recipeId) => {
        setIsLoading(true)
        setError(null)

        try {
            await deleteAdminRecipe(recipeId)
            setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
            return true
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("Đã xảy ra lỗi khi xóa công thức")
            }
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return {
        recipes,
        totalRecipes,
        totalPages,
        currentPage,
        isLoading,
        error,
        fetchRecipes,
        fetchNextPage,
        fetchPreviousPage,
        updateRecipeStatus,
        deleteRecipe,
    }
}
