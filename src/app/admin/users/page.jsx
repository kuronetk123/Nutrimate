
"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Loader, Eye, Trash2, SquarePen, Search } from "lucide-react";
import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from "@/components/ui/alert-dialog";
import EditUserForm from "./EditUserForm";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [modalType, setModalType] = useState(""); // "view" | "edit" | "delete"

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/user?page=${page}&search=${search}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    // TODO: Call API to delete user
    setTimeout(() => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeletingId(null);
      setModalUser(null);
      setModalType("");
    }, 1000);
  };

  const openModal = (user, type) => {
    setModalUser(user);
    setModalType(type);
  };

  const closeModal = () => {
    setModalUser(null);
    setModalType("");
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <Loader className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-muted-foreground">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
        <p className="text-muted-foreground">Quản lý tất cả người dùng trong hệ thống Nutrimate</p>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 mb-4">
        <Input
          type="search"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => openModal(user, "view")}> <Eye className="h-4 w-4" /> </Button>
                    <Button variant="outline" size="icon" onClick={() => openModal(user, "edit")}> <SquarePen className="h-4 w-4" /> </Button>
                    <Button variant="destructive" size="icon" onClick={() => openModal(user, "delete")} disabled={deletingId === user.id}> {deletingId === user.id ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} </Button>
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => setCurrentPage(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Modal for user actions */}
      <AlertDialog open={!!modalUser} onOpenChange={closeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalType === "view" && "Thông tin người dùng"}
              {modalType === "edit" && "Chỉnh sửa thông tin người dùng"}
              {modalType === "delete" && "Xác nhận xoá người dùng"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          {modalType === "view" && modalUser && (
            <div className="space-y-2">
              <div><span className="font-semibold">Tên:</span> {modalUser.name}</div>
              <div><span className="font-semibold">Email:</span> {modalUser.email}</div>
              <div><span className="font-semibold">Vai trò:</span> <Badge variant={modalUser.role === "admin" ? "default" : "outline"}>{modalUser.role}</Badge></div>
            </div>
          )}
          {modalType === "edit" && modalUser && (
            <EditUserForm user={modalUser} onClose={closeModal} onSave={updated => {
              setUsers(users.map(u => u.id === updated.id ? updated : u));
              closeModal();
            }} AlertDialogFooter={AlertDialogFooter} />
          )}
          {modalType === "delete" && modalUser && (
            <div>
              <p>Bạn có chắc muốn xoá người dùng <span className="font-semibold">{modalUser.name}</span>?</p>
              <AlertDialogFooter className="mt-4">
                <Button variant="destructive" onClick={() => handleDelete(modalUser.id)} disabled={deletingId === modalUser.id}>
                  {deletingId === modalUser.id ? <Loader className="h-4 w-4 animate-spin" /> : "Xoá"}
                </Button>
                <Button variant="outline" onClick={closeModal}>Huỷ</Button>
              </AlertDialogFooter>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
