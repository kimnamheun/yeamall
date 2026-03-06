"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, ChevronUp, ChevronDown, Edit, Trash2,
  Eye, EyeOff, Package, X,
} from "lucide-react";
import {
  createCategory, updateCategory, deleteCategory,
  reorderCategory, toggleCategoryActive,
} from "@/actions/admin";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  parentId: string | null;
  _count: { products: number };
}

interface Props {
  categories: CategoryWithCount[];
}

export default function CategoryManageClient({ categories }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    await createCategory(formData);
    form.reset();
    setShowForm(false);
    setLoading(false);
    router.refresh();
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editId) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateCategory(editId, formData);
    setEditId(null);
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;
    const result = await deleteCategory(id);
    if (!result.success && result.error) {
      alert(result.error);
    }
    router.refresh();
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderCategory(id, direction);
    router.refresh();
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleCategoryActive(id, !isActive);
    router.refresh();
  };

  const editCategory = editId ? categories.find((c) => c.id === editId) : null;

  return (
    <div className="space-y-4">
      {/* 추가 버튼 */}
      <button
        onClick={() => { setShowForm(!showForm); setEditId(null); }}
        className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus size={16} />
        카테고리 추가
      </button>

      {/* 추가 폼 */}
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-xl bg-white border border-border p-5 space-y-4">
          <h3 className="font-semibold text-sm">새 카테고리</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">카테고리명 *</label>
              <input name="name" required className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="예: 멸치" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">슬러그 (영문, 자동생성)</label>
              <input name="slug" className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="예: meolchi" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">이미지 URL</label>
              <input name="imageUrl" className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="/images/category.svg" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="h-9 px-6 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {loading ? "저장 중..." : "저장"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="h-9 px-4 rounded-lg border border-border text-sm hover:bg-muted">
              취소
            </button>
          </div>
        </form>
      )}

      {/* 수정 폼 */}
      {editCategory && (
        <form onSubmit={handleUpdate} className="rounded-xl bg-blue-50 border border-blue-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">카테고리 수정</h3>
            <button type="button" onClick={() => setEditId(null)} className="p-1 hover:bg-blue-100 rounded"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">카테고리명 *</label>
              <input name="name" required defaultValue={editCategory.name} className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">슬러그 *</label>
              <input name="slug" required defaultValue={editCategory.slug} className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">이미지 URL</label>
              <input name="imageUrl" defaultValue={editCategory.imageUrl || ""} className="w-full h-9 px-3 rounded-lg border border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="h-9 px-6 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
              {loading ? "수정 중..." : "수정"}
            </button>
            <button type="button" onClick={() => setEditId(null)} className="h-9 px-4 rounded-lg border border-border text-sm hover:bg-muted">
              취소
            </button>
          </div>
        </form>
      )}

      {/* 카테고리 목록 */}
      <div className="rounded-xl bg-white border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs w-20">순서</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">카테고리명</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">슬러그</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">상품수</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">상태</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs">관리</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => handleReorder(cat.id, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <span className="text-xs text-muted-foreground w-4 text-center">{idx + 1}</span>
                      <button
                        onClick={() => handleReorder(cat.id, "down")}
                        disabled={idx === categories.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm">{cat.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Package size={12} className="text-muted-foreground" />
                      {cat._count.products}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      cat.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {cat.isActive ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => handleToggleActive(cat.id, cat.isActive)}
                        className="p-1.5 rounded hover:bg-muted transition-colors"
                        title={cat.isActive ? "비활성화" : "활성화"}
                      >
                        {cat.isActive ? (
                          <EyeOff size={14} className="text-orange-400" />
                        ) : (
                          <Eye size={14} className="text-green-500" />
                        )}
                      </button>
                      <button
                        onClick={() => { setEditId(cat.id); setShowForm(false); }}
                        className="p-1.5 rounded hover:bg-muted transition-colors"
                        title="수정"
                      >
                        <Edit size={14} className="text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    등록된 카테고리가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
