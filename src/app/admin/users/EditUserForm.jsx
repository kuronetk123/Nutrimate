"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Use AlertDialogFooter from props instead of importing
import { Loader } from "lucide-react";

export default function EditUserForm({ user, onClose, onSave, AlertDialogFooter }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/user/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onSave(data.user);
      } else {
        setError(data.message || "Cập nhật thất bại.");
      }
    } catch {
      setError("Cập nhật thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="font-semibold">Tên:</label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label className="font-semibold">Email:</label>
        <Input name="email" type="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label className="font-semibold">Vai trò:</label>
        <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-2 py-1">
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {AlertDialogFooter && (
        <AlertDialogFooter>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader className="h-4 w-4 animate-spin" /> : "Lưu thay đổi"}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>Huỷ</Button>
        </AlertDialogFooter>
      )}
    </form>
  );
}
