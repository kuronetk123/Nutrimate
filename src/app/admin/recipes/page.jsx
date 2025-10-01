"use client"


import { useEffect, useState } from "react"
import { useAdminRecipes } from "@/lib/hooks/use-admin"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Loader, ChevronUp, ChevronDown, Eye, Trash2, SquarePen } from "lucide-react"
// import { formatDate } from "@/lib/formatDate"
import { useToast } from "@/lib/hooks/use-toast"
import { formatDate } from "date-fns"
export default function AdminRecipes() {
  const {
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
  } = useAdminRecipes()

  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchRecipes(1, 10, "", category, sortBy, sortOrder)
  }, [fetchRecipes, category, sortBy, sortOrder])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRecipes(1, 10, searchTerm, category, sortBy, sortOrder)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return null
    return sortOrder === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateRecipeStatus(id, status);
      toast({
        title: "Cập nhật thành công",
        description: `Công thức đã được chuyển sang trạng thái: ${status}`,
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật trạng thái công thức",
        variant: "destructive",
      });
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await deleteRecipe(id)
      toast({
        title: "Xóa thành công",
        description: "Công thức đã được xóa khỏi hệ thống",
      })
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xóa công thức",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading && recipes.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-muted-foreground">Đang tải danh sách công thức...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-500">Đã xảy ra lỗi</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => fetchRecipes()} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }
  console.log(recipes)
  return (

    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý công thức</h1>
        <p className="text-muted-foreground">Quản lý tất cả công thức trong hệ thống Nutrimate</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Tìm kiếm công thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>
        </form>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="Bữa sáng">Bữa sáng</SelectItem>
              <SelectItem value="Bữa trưa">Bữa trưa</SelectItem>
              <SelectItem value="Bữa tối">Bữa tối</SelectItem>
              <SelectItem value="Món tráng miệng">Món tráng miệng</SelectItem>
              <SelectItem value="Đồ uống">Đồ uống</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Hiển thị {recipes?.length} / {totalRecipes} công thức
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] cursor-pointer" >
                <div className="flex items-center gap-1">Ảnh</div>
              </TableHead>
              <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Tên công thức {getSortIcon("name")}</div>
              </TableHead>
              {/* <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                <div className="flex items-center gap-1">Danh mục {getSortIcon("category")}</div>
              </TableHead> */}
              <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                <div className="flex items-center gap-1">Ngày tạo {getSortIcon("createdAt")}</div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("viewCount")}>
                <div className="flex items-center gap-1">Lượt xem {getSortIcon("viewCount")}</div>
              </TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow key={recipe.id}>
                <TableCell className="font-medium">

                  <img src={recipe.imageUrl} className="h-[50px] w-[50px] rounded" />

                </TableCell>
                <TableCell className="font-medium">{recipe.name}</TableCell>
                {/* <TableCell>
                  <Badge variant="outline">{recipe.category}</Badge>
                </TableCell> */}
                <TableCell>{new Date(recipe.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{recipe.viewCount}</TableCell>
                <TableCell>
                  <Select value={recipe.status} onValueChange={(value) => handleStatusChange(recipe.id, value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="accepted">Đã duyệt</SelectItem>
                      <SelectItem value="rejected">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <a href={`/cong-thuc/${recipe.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href={`/admin/recipes/${recipe.id}/edit`} target="_blank" rel="noopener noreferrer">
                        <SquarePen className="h-4 w-4" />
                      </a>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Công thức này sẽ bị xóa vĩnh viễn khỏi hệ thống và tất cả
                            dữ liệu liên quan sẽ bị mất.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(recipe.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            {deletingId === recipe.id ? (
                              <>
                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                Đang xóa...
                              </>
                            ) : (
                              "Xóa"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={fetchPreviousPage}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => fetchRecipes(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={fetchNextPage}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
