'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Briefcase, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PortfolioItem {
  id: string;
  name: string;
  industry: string;
  platform: string;
  description: string;
  accentColor: string;
  secondaryColor: string;
  image: string;
  url: string;
  challenge: string;
  solution: string;
  result: string;
  sortOrder: number;
  isPublished: boolean;
}

const empty = {
  name: '',
  industry: '',
  platform: '',
  description: '',
  accentColor: '#B6FF00',
  secondaryColor: '#1a1a2e',
  image: '',
  url: '',
  challenge: '',
  solution: '',
  result: '',
  sortOrder: 0,
  isPublished: true,
};

function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('category', 'portfolio');
  return fetch('/api/admin/upload', { method: 'POST', body: fd })
    .then(r => r.json())
    .then(d => {
      if (!d.url) throw new Error();
      return d.url;
    });
}

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/portfolio');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setImageMode('upload');
    setDialogOpen(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditId(item.id);
    setForm({
      name: item.name,
      industry: item.industry,
      platform: item.platform,
      description: item.description,
      accentColor: item.accentColor,
      secondaryColor: item.secondaryColor,
      image: item.image,
      url: item.url,
      challenge: item.challenge,
      solution: item.solution,
      result: item.result,
      sortOrder: item.sortOrder,
      isPublished: item.isPublished,
    });
    setImageMode(item.image && !item.image.startsWith('/uploads/') ? 'url' : 'upload');
    setDialogOpen(true);
  }

  function openDelete(id: string) {
    setDeleteId(id);
    setDeleteOpen(true);
  }

  function updateForm(field: string, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/portfolio/${editId}` : '/api/admin/portfolio';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editId ? 'Portfolio item updated' : 'Portfolio item created');
      setDialogOpen(false);
      loadItems();
    } catch {
      toast.error('Failed to save portfolio item');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/portfolio/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Portfolio item deleted');
      setDeleteOpen(false);
      setDeleteId(null);
      loadItems();
    } catch {
      toast.error('Failed to delete portfolio item');
    }
  }

  async function togglePublished(item: PortfolioItem) {
    try {
      const res = await fetch(`/api/admin/portfolio/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(item.isPublished ? 'Item unpublished' : 'Item published');
      loadItems();
    } catch {
      toast.error('Failed to toggle status');
    }
  }

  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-7 h-7 text-[#B6FF00]" />
              <h2 className="text-2xl font-bold text-white">Portfolio</h2>
            </div>
            <p className="text-[#888] text-sm">Manage portfolio items shown on the website</p>
          </div>
          <Button
            onClick={openCreate}
            className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio Item
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[rgba(182,255,0,0.08)] overflow-hidden">
          <div className="bg-[#0D0D0D] grid grid-cols-[80px_1fr_140px_120px_100px] gap-4 px-5 py-3 text-xs text-[#888] font-medium uppercase tracking-wider">
            <div>Image</div>
            <div>Name</div>
            <div>Platform</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-[#0A0A0A]">
              <Loader2 className="w-6 h-6 text-[#B6FF00] animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-[#0A0A0A]">
              <Briefcase className="w-10 h-10 text-[#666] mx-auto mb-3" />
              <p className="text-[#666] text-sm">No portfolio items yet</p>
              <p className="text-[#666] text-xs mt-1">Click &quot;Add Portfolio Item&quot; to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(182,255,0,0.08)]">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-[#0A0A0A] grid grid-cols-[80px_1fr_140px_120px_100px] gap-4 px-5 py-3 items-center"
                >
                  {/* Image thumbnail */}
                  <div>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-8 rounded bg-[#1a1a1a] flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-[#666]" />
                      </div>
                    )}
                  </div>

                  {/* Name + Industry */}
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{item.name}</p>
                    <p className="text-[#888] text-xs truncate">{item.industry}</p>
                  </div>

                  {/* Platform badge */}
                  <div>
                    {item.platform ? (
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-[#B6FF00]/10 text-[#B6FF00] border border-[rgba(182,255,0,0.15)]">
                        {item.platform}
                      </span>
                    ) : (
                      <span className="text-[#666] text-xs">—</span>
                    )}
                  </div>

                  {/* Status toggle */}
                  <div>
                    <button
                      onClick={() => togglePublished(item)}
                      className="flex items-center gap-2 group cursor-pointer"
                    >
                      <div
                        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                          item.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                            item.isPublished ? 'translate-x-[22px]' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                      <span className="text-xs text-[#888]">
                        {item.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-[#B6FF00] transition-colors"
                        title="View site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-[#B6FF00] transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-[#888] hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border border-[rgba(182,255,0,0.08)] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editId ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-4 mt-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Name *</Label>
              <Input
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="Project name"
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666]"
              />
            </div>

            {/* Industry */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Industry</Label>
              <Input
                value={form.industry}
                onChange={e => updateForm('industry', e.target.value)}
                placeholder="e.g. E-Commerce, SaaS, Healthcare"
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666]"
              />
            </div>

            {/* Platform */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Platform</Label>
              <Input
                value={form.platform}
                onChange={e => updateForm('platform', e.target.value)}
                placeholder="Shopify, WordPress, etc."
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666]"
              />
            </div>

            {/* URL */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">URL</Label>
              <Input
                value={form.url}
                onChange={e => updateForm('url', e.target.value)}
                placeholder="https://..."
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666]"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Description</Label>
              <Textarea
                value={form.description}
                onChange={e => updateForm('description', e.target.value)}
                rows={2}
                placeholder="Brief description of the project"
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666] resize-none"
              />
            </div>

            {/* Image */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Image</Label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    imageMode === 'upload'
                      ? 'bg-[#B6FF00]/10 text-[#B6FF00] border border-[rgba(182,255,0,0.2)]'
                      : 'bg-white/5 text-[#888] border border-transparent hover:text-white'
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    imageMode === 'url'
                      ? 'bg-[#B6FF00]/10 text-[#B6FF00] border border-[rgba(182,255,0,0.2)]'
                      : 'bg-white/5 text-[#888] border border-transparent hover:text-white'
                  }`}
                >
                  URL
                </button>
              </div>

              {imageMode === 'upload' ? (
                <div>
                  {form.image && (
                    <div className="mb-2 relative inline-block">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full max-w-xs h-32 rounded-lg object-cover border border-[rgba(182,255,0,0.08)]"
                      />
                      <button
                        type="button"
                        onClick={() => updateForm('image', '')}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="border-[rgba(182,255,0,0.08)] text-[#999] hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Input
                  value={form.image}
                  onChange={e => updateForm('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666]"
                />
              )}
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[#999] text-sm">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue={form.accentColor}
                    onChange={e => updateForm('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-[rgba(182,255,0,0.08)] cursor-pointer bg-transparent"
                  />
                  <Input
                    value={form.accentColor}
                    onChange={e => updateForm('accentColor', e.target.value)}
                    className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[#999] text-sm">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue={form.secondaryColor}
                    onChange={e => updateForm('secondaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-[rgba(182,255,0,0.08)] cursor-pointer bg-transparent"
                  />
                  <Input
                    value={form.secondaryColor}
                    onChange={e => updateForm('secondaryColor', e.target.value)}
                    className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Challenge */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Challenge</Label>
              <Textarea
                value={form.challenge}
                onChange={e => updateForm('challenge', e.target.value)}
                rows={2}
                placeholder="What was the challenge?"
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666] resize-none"
              />
            </div>

            {/* Solution */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Solution</Label>
              <Textarea
                value={form.solution}
                onChange={e => updateForm('solution', e.target.value)}
                rows={2}
                placeholder="How was it solved?"
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666] resize-none"
              />
            </div>

            {/* Result */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Result</Label>
              <Textarea
                value={form.result}
                onChange={e => updateForm('result', e.target.value)}
                rows={2}
                placeholder="What was the outcome?"
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white placeholder:text-[#666] resize-none"
              />
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <Label className="text-[#999] text-sm">Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={e => updateForm('sortOrder', parseInt(e.target.value) || 0)}
                className="bg-[#050505] border-[rgba(182,255,0,0.08)] text-white"
              />
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between py-2">
              <Label className="text-[#999] text-sm">Published</Label>
              <button
                type="button"
                onClick={() => updateForm('isPublished', !form.isPublished)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    form.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                      form.isPublished ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </div>
                <span className="text-sm text-[#888]">
                  {form.isPublished ? (
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5" /> Draft
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Dialog footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(182,255,0,0.08)] mt-2">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-[#888] hover:text-white hover:bg-white/5 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editId ? (
                'Update Item'
              ) : (
                'Create Item'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#0A0A0A] border border-[rgba(182,255,0,0.08)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Portfolio Item
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              Are you sure you want to delete this portfolio item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-white/5 text-[#888] border-[rgba(182,255,0,0.08)] hover:text-white hover:bg-white/10 rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600 rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
