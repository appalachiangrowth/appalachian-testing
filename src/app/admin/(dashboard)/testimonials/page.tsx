'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Testimonial { id: string; name: string; role: string; type: string; text: string; rating: number; sortOrder: number; isPublished: boolean; }

const empty = { name: '', role: '', type: '', text: '', rating: 5, sortOrder: 0, isPublished: true };

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => { try { const r = await fetch('/api/admin/testimonials'); if (r.ok) setItems(await r.json()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(empty); setDialogOpen(true); }
  function openEdit(t: Testimonial) { setEditing(t); const { id, ...f } = t; setForm(f); setDialogOpen(true); }

  async function save() {
    setSaving(true);
    try { const r = await fetch(editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (!r.ok) throw new Error(); toast.success(editing ? 'Updated' : 'Created'); setDialogOpen(false); load(); } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function del() { if (!deleteId) return; try { await fetch(`/api/admin/testimonials/${deleteId}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteId(null); }

  async function togglePub(t: Testimonial) {
    try { await fetch(`/api/admin/testimonials/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !t.isPublished }) }); toast.success(t.isPublished ? 'Unpublished' : 'Published'); load(); } catch { toast.error('Failed'); }
  }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-white">Testimonials</h2><p className="text-[#888] text-sm">Manage client testimonials</p></div>
        <Button onClick={openCreate} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="col-span-full text-center py-12 text-[#666]">No testimonials yet.</div>}
        {items.map(t => (
          <div key={t.id} className={`rounded-xl border bg-[#0A0A0A] p-4 hover:border-[rgba(182,255,0,0.2)] transition-all ${t.isPublished ? 'border-[rgba(182,255,0,0.08)]' : 'border-[rgba(255,255,255,0.05)] opacity-60'}`}>
            <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'text-[#B6FF00] fill-[#B6FF00]' : 'text-[#333]'}`} />)}</div>
            <p className="text-[#bbb] text-sm leading-relaxed line-clamp-3 mb-4">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div><p className="text-white font-medium text-sm">{t.name}</p><p className="text-[#888] text-xs">{t.role}</p></div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => togglePub(t)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]">{t.isPublished ? <span className="text-[10px]">Off</span> : <span className="text-[10px]">On</span>}</button>
                <button onClick={() => setDeleteId(t.id)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Edit' : 'Add'} Testimonial</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-[#ccc]">Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
            <div><Label className="text-[#ccc]">Role / Company</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1" /></div>
            <div><Label className="text-[#ccc]">Category / Type</Label><Input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1" placeholder="e.g. Fashion eCommerce" /></div>
            <div><Label className="text-[#ccc]">Testimonial Text</Label><Textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="mt-1" rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Rating</Label><div className="flex gap-1 mt-2">{[1,2,3,4,5].map(n => <button key={n} onClick={() => setForm({ ...form, rating: n })} className="w-8 h-8 flex items-center justify-center"><Star className={`w-6 h-6 transition-colors ${n <= form.rating ? 'text-[#B6FF00] fill-[#B6FF00]' : 'text-[#333]'}`} /></button>)}</div></div>
              <div><Label className="text-[#ccc]">Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
            </div>
            <div className="flex items-center gap-3"><button onClick={() => setForm({ ...form, isPublished: !form.isPublished })} className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} /></button><span className="text-sm text-[#ccc]">Published</span></div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button>
              <Button onClick={save} disabled={saving || !form.name} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Testimonial?</AlertDialogTitle><AlertDialogDescription className="text-[#888]">This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">Cancel</AlertDialogCancel><AlertDialogAction onClick={del} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}