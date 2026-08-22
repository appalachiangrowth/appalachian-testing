'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PostTag {
  tagId: string;
  tag: { id: string; name: string; slug: string };
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string | null;
  author: string;
  isPublished: boolean;
  readTime: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  publishedAt: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
  postTags: PostTag[];
}

const PER_PAGE = 10;

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | 'draft' | 'published'>('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PER_PAGE),
        sort,
      });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (categoryFilter) params.set('category', categoryFilter);

      const r = await fetch(`/api/admin/blogs?${params}`);
      if (r.ok) {
        const data = await r.json();
        const list = data.blogs || [];
        setBlogs(list);
        setTotalPages(data.totalPages || Math.ceil(list.length / PER_PAGE) || 1);
        const cats = new Set<string>();
        list.forEach((b: Blog) => { if (b.category) cats.add(b.category); });
        setCategories(Array.from(cats).sort());
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter, sort]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter, sort]);

  async function deleteBlog() {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/admin/blogs/${deleteId}`, { method: 'DELETE' });
      if (r.ok) {
        toast.success('Blog post deleted');
        loadBlogs();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteId(null);
  }

  async function togglePublish(blog: Blog) {
    setTogglingId(blog.id);
    try {
      const r = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });
      if (r.ok) {
        toast.success(blog.isPublished ? 'Unpublished' : 'Published');
        loadBlogs();
      } else {
        toast.error('Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    }
    setTogglingId(null);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('');
    setCategoryFilter('');
    setSort('newest');
  }

  const hasFilters = search || statusFilter || categoryFilter || sort !== 'newest';

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Blog</h2>
          <p className="text-[#888] text-sm">Manage blog posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">
            <Plus className="w-4 h-4 mr-2" />New Post
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <Input
              placeholder="Search title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#111] border-white/[0.06] text-white placeholder:text-[#555] rounded-lg h-9"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex gap-1 bg-[#111] rounded-lg p-0.5">
            {(
              [
                ['all', 'All'],
                ['published', 'Published'],
                ['draft', 'Draft'],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setStatusFilter(val === 'all' ? '' : (val as 'draft' | 'published'))}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  (val === 'all' && !statusFilter) || statusFilter === val
                    ? 'bg-[#B6FF00]/15 text-[#B6FF00]'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#111] border border-white/[0.06] text-white text-xs rounded-lg px-3 py-2 h-9 min-w-[120px] focus:outline-none focus:border-[#B6FF00]/30"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#111] border border-white/[0.06] text-xs text-[#888] rounded-lg hover:text-white hover:border-white/[0.12] transition-colors h-9"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sort === 'newest' ? 'Newest' : 'Oldest'}
          </button>

          {/* Clear Filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#B6FF00] hover:text-[#B6FF00]/80 whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Blog Table */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Image</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Title</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Category</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Author</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Published</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs font-medium">Views</th>
                <th className="text-right px-4 py-3 text-[#888] text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#666]">
                    No blog posts found.
                  </td>
                </tr>
              )}
              {blogs.map((blog) => (
                <tr
                  key={blog.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-12 h-8 object-cover rounded-md border border-white/[0.06]"
                      />
                    ) : (
                      <div className="w-12 h-8 rounded-md bg-[#111] border border-white/[0.06] flex items-center justify-center">
                        <span className="text-[10px] text-[#555]">No img</span>
                      </div>
                    )}
                  </td>

                  {/* Title + Slug */}
                  <td className="px-4 py-3">
                    <p className="text-white font-medium text-sm truncate max-w-[250px]">
                      {blog.title}
                    </p>
                    <p className="text-[#555] text-xs truncate max-w-[250px]">
                      /{blog.slug}
                    </p>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    {blog.category ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.06] text-[#ccc] text-xs">
                        {blog.category}
                      </span>
                    ) : (
                      <span className="text-[#555] text-xs">—</span>
                    )}
                  </td>

                  {/* Author */}
                  <td className="px-4 py-3">
                    <span className="text-[#ccc] text-xs">{blog.author || '—'}</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        blog.isPublished
                          ? 'bg-[#B6FF00]/10 text-[#B6FF00]'
                          : 'bg-white/[0.06] text-[#888]'
                      }`}
                    >
                      {blog.isPublished ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>

                  {/* Published Date */}
                  <td className="px-4 py-3">
                    <span className="text-[#ccc] text-xs">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                  </td>

                  {/* Views */}
                  <td className="px-4 py-3">
                    <span className="text-[#ccc] text-xs">
                      {blog.views?.toLocaleString() || '0'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => togglePublish(blog)}
                        disabled={togglingId === blog.id}
                        className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00] transition-colors disabled:opacity-50"
                        title={blog.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {togglingId === blog.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : blog.isPublished ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                        className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00] transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <Link href={`/admin/blog/${blog.id}`}>
                        <button
                          className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00] transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(blog.id)}
                        className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-white/[0.04]">
          {blogs.length === 0 && (
            <div className="text-center py-12 text-[#666]">
              No blog posts found.
            </div>
          )}
          {blogs.map((blog) => (
            <div key={blog.id} className="p-4">
              <div className="flex gap-3 mb-3">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-16 h-12 object-cover rounded-lg border border-white/[0.06] shrink-0"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-[#111] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <span className="text-[10px] text-[#555]">No img</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm truncate">
                    {blog.title}
                  </p>
                  <p className="text-[#555] text-xs truncate">/{blog.slug}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      blog.isPublished
                        ? 'bg-[#B6FF00]/10 text-[#B6FF00]'
                        : 'bg-white/[0.06] text-[#888]'
                    }`}
                  >
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[#555] text-xs">
                    {blog.views?.toLocaleString() || '0'} views
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePublish(blog)}
                    disabled={togglingId === blog.id}
                    className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"
                  >
                    {togglingId === blog.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : blog.isPublished ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                    className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <Link href={`/admin/blog/${blog.id}`}>
                    <button className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]">
                      <Pencil className="w-3 h-3" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(blog.id)}
                    className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <span className="text-xs text-[#666]">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-white disabled:opacity-30 disabled:hover:text-[#888] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - page) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <span key={p} className="flex items-center">
                      {showEllipsis && (
                        <span className="w-6 text-center text-[#555] text-xs">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                          page === p
                            ? 'bg-[#B6FF00]/15 text-[#B6FF00]'
                            : 'bg-[#111] text-[#888] hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-white disabled:opacity-30 disabled:hover:text-[#888] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Blog Post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              This action cannot be undone. The blog post and all its data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteBlog}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
