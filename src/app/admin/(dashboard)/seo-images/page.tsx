'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SeoImage {
  id: string;
  title: string;
  url: string;
  sortOrder: number;
}

const empty = { title: '', url: '', sortOrder: 0 };

export default function AdminSeoImages() {
  const [items, setItems] = useState<SeoImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SeoImage | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const r = await fetch('/api/admin/seo-images');
      if (r.ok) {
        setItems(await r.json());
      } else {
        let errMsg = `Failed to load (HTTP ${r.status})`;
        let details = '';
        try {
          const errData = await r.json();
          errMsg = errData.error || errMsg;
          if (errData.details) details = String(errData.details);
        } catch {}
        setLoadError(details ? `${errMsg} — ${details}` : errMsg);
        console.error('[SEO Images] Load error:', errMsg, details);
      }
    } catch (err) {
      console.error('Failed to load SEO images:', err);
      const msg = err instanceof Error ? err.message : 'Network error';
      setLoadError(`Network error: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setPendingFile(null);
    setSaveError('');
    setDialogOpen(true);
  }

  function openEdit(img: SeoImage) {
    setEditing(img);
    const { id, ...f } = img;
    setForm(f);
    setPendingFile(null);
    setSaveError('');
    setDialogOpen(true);
  }

  async function save() {
    // Clear any previous error
    setSaveError('');

    const title = form.title.trim();
    const url = form.url.trim();

    if (!title) {
      setSaveError('Please enter a title.');
      return;
    }

    if (!url) {
      setSaveError('Please upload an image or paste an image URL.');
      return;
    }

    setSaving(true);

    try {
      const endpoint = editing
        ? `/api/admin/seo-images/${editing.id}`
        : '/api/admin/seo-images';
      const method = editing ? 'PUT' : 'POST';

      console.log('[SEO Images] Sending', method, 'to', endpoint, { title, url, sortOrder: form.sortOrder });

      const r = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          url,
          sortOrder: form.sortOrder,
        }),
      });

      console.log('[SEO Images] Response status:', r.status);

      if (!r.ok) {
        let errMsg = `Server error (${r.status})`;
        let details = '';
        try {
          const errData = await r.json();
          errMsg = errData.error || errMsg;
          if (errData.details) details = String(errData.details);
        } catch {
          // response wasn't JSON
        }
        const fullError = details ? `${errMsg} — ${details}` : errMsg;
        console.error('[SEO Images] Error response:', fullError);
        setSaveError(fullError);
        return;
      }

      const data = await r.json();
      console.log('[SEO Images] Success:', data);

      toast.success(editing ? 'Updated successfully' : 'Created successfully');
      setDialogOpen(false);
      load();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      console.error('[SEO Images] Save failed:', message);
      setSaveError(`Network error: ${message}`);
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/admin/seo-images/${deleteId}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteId(null);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large (max 10MB)');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Use JPG, PNG, GIF, or WebP.');
      return;
    }

    setPendingFile(file);
    setUploading(true);
    setSaveError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'seo-results');

      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await r.json();

      if (!r.ok || !data.url) {
        throw new Error(data.error || 'Upload failed');
      }

      setForm((prev) => ({ ...prev, url: data.url }));
      toast.success('Image uploaded');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error(`Upload failed: ${message}`);
      setPendingFile(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage() {
    setForm((prev) => ({ ...prev, url: '' }));
    setPendingFile(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" />
      </div>
    );
  }

  const canCreate = form.title.trim().length > 0 && form.url.trim().length > 0;
  const isDisabled = saving || uploading || !canCreate;

  // Determine why button is disabled for the hint text
  let disabledHint = '';
  if (!saving && !uploading && !canCreate) {
    if (!form.title.trim()) disabledHint = 'Enter a title to enable Create';
    else if (!form.url.trim()) disabledHint = 'Upload an image or paste a URL to enable Create';
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">SEO Result Images</h2>
          <p className="text-[#888] text-sm">Manage SEO proof screenshots</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {loadError && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-400">Database Error</p>
            <p className="text-xs text-red-400/80 mt-1 break-all">{loadError}</p>
            <p className="text-xs text-[#555] mt-2">Run this on your server: <code className="bg-[#111] px-2 py-0.5 rounded">npx prisma db push</code></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-[#666] rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A]">
            No SEO images yet.
          </div>
        )}
        {items.map((img) => (
          <div
            key={img.id}
            className="group relative rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] overflow-hidden hover:border-[rgba(182,255,0,0.2)] transition-all"
          >
            <img src={img.url} alt={img.title} className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <span className="text-white text-sm font-medium">{img.title}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(img)}
                  className="w-8 h-8 rounded-lg bg-[#B6FF00] flex items-center justify-center text-[#050505]"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(img.id)}
                  className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) setSaveError('');
        setDialogOpen(open);
      }}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editing ? 'Edit' : 'Add'} SEO Image
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label className="text-[#ccc]">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setSaveError(''); }}
                className="mt-1"
                placeholder="e.g. Roofing Company - Google Rankings"
              />
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-[#ccc]">Upload Image *</Label>
              <div className="mt-1">
                {!form.url ? (
                  <label className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[rgba(182,255,0,0.2)] px-6 py-6 text-sm text-[#888] hover:text-[#B6FF00] hover:border-[#B6FF00] cursor-pointer transition-colors">
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-[#B6FF00]" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8" />
                        <span>Click to upload an image</span>
                        <span className="text-xs text-[#555]">JPG, PNG, GIF, WebP (max 10MB)</span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3">
                    <img
                      src={form.url}
                      alt="Preview"
                      className="w-32 h-20 rounded-lg object-cover border border-[rgba(182,255,0,0.1)]"
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-[#B6FF00] hover:underline"
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Change image'}
                      </button>
                      <button
                        onClick={removeImage}
                        className="text-sm text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Or Image URL */}
            <div>
              <Label className="text-[#ccc]">Or paste Image URL</Label>
              <Input
                value={form.url}
                onChange={(e) => { setForm({ ...form, url: e.target.value }); setSaveError(''); }}
                className="mt-1"
                placeholder="https://example.com/screenshot.webp"
              />
            </div>

            {/* Sort Order */}
            <div>
              <Label className="text-[#ccc]">Sort Order</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>

            {/* Inline Error Message */}
            {saveError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{saveError}</p>
              </div>
            )}

            {/* Disabled Hint */}
            {disabledHint && !saveError && (
              <p className="text-xs text-[#666] text-center">{disabledHint}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => { setSaveError(''); setDialogOpen(false); }}
                disabled={saving}
                className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={save}
                disabled={isDisabled}
                className={`rounded-xl font-bold min-w-[100px] transition-all ${
                  isDisabled
                    ? 'bg-[#333] text-[#666] cursor-not-allowed'
                    : 'bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="ml-2">Saving...</span>
                  </>
                ) : editing ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Image?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={del}
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
