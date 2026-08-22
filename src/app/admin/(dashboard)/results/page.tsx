'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Transformation { id: string; client: string; metric: string; before: string; after: string; improvement: string; description: string; sortOrder: number; isPublished: boolean; }

const empty = { client: '', metric: '', before: '', after: '', improvement: '', description: '', sortOrder: 0, isPublished: true };

export default function AdminResults() {
  const [items, setItems] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Transformation | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => { try { const r = await fetch('/api/admin/results'); if (r.ok) setItems(await r.json()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(empty); setDialogOpen(true); }
  function openEdit(t: Transformation) { setEditing(t); const { id, ...f } = t; setForm(f); setDialogOpen(true); }

  async function save() {
    setSaving(true);
    try { const r = await fetch(editing ? `/api/admin/results/${editing.id}` : '/api/admin/results', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (!r.ok) throw new Error(); toast.success(editing ? 'Updated' : 'Created'); setDialogOpen(false); load(); } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function del() { if (!deleteId) return; try { await fetch(`/api/admin/results/${deleteId}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteId(null); }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-white">Results / Transformations</h2><p className="text-[#888] text-sm">Manage before/after results</p></div>
        <Button onClick={openCreate} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />Add Result</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="col-span-full text-center py-12 text-[#666] rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A]">No results yet.</div>}
        {items.map(t => (
          <div key={t.id} className={`rounded-xl border bg-[#0A0A0A] p-4 hover:border-[rgba(182,255,0,0.2)] transition-all ${t.isPublished ? 'border-[rgba(182,255,0,0.08)]' : 'border-[rgba(255,255,255,0.05)] opacity-60'}`}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-white font-medium text-sm">{t.client}</h3><div className="flex gap-1">
              <button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => setDeleteId(t.id)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </div></div>
            <p className="text-[#888] text-xs mb-3">{t.metric}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-[#111] rounded-lg p-2 text-center"><div className="text-[#666] text-[10px] uppercase mb-1">Before</div><div className="text-[#888] font-mono text-sm">{t.before}</div></div>
              <div className="bg-[rgba(182,255,0,0.06)] rounded-lg p-2 text-center"><div className="text-[rgba(182,255,0,0.6)] text-[10px] uppercase mb-1">After</div><div className="text-[#B6FF00] font-bold font-mono text-sm">{t.after}</div></div>
            </div>
            <span className="bg-[#B6FF00] text-[#050505] rounded-full px-2.5 py-0.5 text-xs font-bold">↑ {t.improvement}</span>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Edit' : 'Add'} Result</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4"><div><Label className="text-[#ccc]">Client</Label><Input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} className="mt-1" /></div><div><Label className="text-[#ccc]">Metric</Label><Input value={form.metric} onChange={e => setForm({ ...form, metric: e.target.value })} className="mt-1" /></div></div>
            <div className="grid grid-cols-3 gap-4"><div><Label className="text-[#ccc]">Before</Label><Input value={form.before} onChange={e => setForm({ ...form, before: e.target.value })} className="mt-1" /></div><div><Label className="text-[#ccc]">After</Label><Input value={form.after} onChange={e => setForm({ ...form, after: e.target.value })} className="mt-1" /></div><div><Label className="text-[#ccc]">Improvement</Label><Input value={form.improvement} onChange={e => setForm({ ...form, improvement: e.target.value })} className="mt-1" placeholder="+300%" /></div></div>
            <div><Label className="text-[#ccc]">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              <div className="flex items-end pb-2"><div className="flex items-center gap-3"><button onClick={() => setForm({ ...form, isPublished: !form.isPublished })} className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} /></button><span className="text-sm text-[#ccc]">Published</span></div></div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Result?</AlertDialogTitle><AlertDialogDescription className="text-[#888]">This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">Cancel</AlertDialogCancel><AlertDialogAction onClick={del} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}