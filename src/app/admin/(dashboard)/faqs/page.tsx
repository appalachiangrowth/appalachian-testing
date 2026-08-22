'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FAQ { id: string; question: string; answer: string; sortOrder: number; isPublished: boolean; }

const empty = { question: '', answer: '', sortOrder: 0, isPublished: true };

export default function AdminFAQs() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => { try { const r = await fetch('/api/admin/faqs'); if (r.ok) setItems(await r.json()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(empty); setDialogOpen(true); }
  function openEdit(f: FAQ) { setEditing(f); const { id, ...d } = f; setForm(d); setDialogOpen(true); }

  async function save() {
    setSaving(true);
    try { const r = await fetch(editing ? `/api/admin/faqs/${editing.id}` : '/api/admin/faqs', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); if (!r.ok) throw new Error(); toast.success(editing ? 'Updated' : 'Created'); setDialogOpen(false); load(); } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function del() { if (!deleteId) return; try { await fetch(`/api/admin/faqs/${deleteId}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteId(null); }
  async function togglePub(f: FAQ) { try { await fetch(`/api/admin/faqs/${f.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !f.isPublished }) }); load(); } catch {} }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-white">FAQs</h2><p className="text-[#888] text-sm">Manage frequently asked questions</p></div>
        <Button onClick={openCreate} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />Add FAQ</Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 && <div className="text-center py-12 text-[#666] rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A]">No FAQs yet.</div>}
        {items.map(f => (
          <div key={f.id} className={`rounded-xl border bg-[#0A0A0A] overflow-hidden transition-all ${f.isPublished ? 'border-[rgba(182,255,0,0.08)]' : 'border-[rgba(255,255,255,0.05)] opacity-60'}`}>
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={() => setExpandedId(expandedId === f.id ? null : f.id)} className="text-[#888] hover:text-[#B6FF00] shrink-0">
                {expandedId === f.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <span className="text-white font-medium text-sm flex-1 truncate">{f.question}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${f.isPublished ? 'bg-[rgba(182,255,0,0.1)] text-[#B6FF00]' : 'bg-[rgba(255,255,255,0.05)] text-[#888]'}`}>{f.isPublished ? 'Live' : 'Draft'}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(f)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => setDeleteId(f.id)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
            {expandedId === f.id && <div className="px-4 pb-3 pl-11"><p className="text-[#888] text-sm leading-relaxed">{f.answer}</p></div>}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Edit' : 'Add'} FAQ</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-[#ccc]">Question</Label><Input value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} className="mt-1" /></div>
            <div><Label className="text-[#ccc]">Answer</Label><Textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} className="mt-1" rows={4} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              <div className="flex items-end pb-2"><div className="flex items-center gap-3"><button onClick={() => setForm({ ...form, isPublished: !form.isPublished })} className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} /></button><span className="text-sm text-[#ccc]">Published</span></div></div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button>
              <Button onClick={save} disabled={saving || !form.question} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete FAQ?</AlertDialogTitle><AlertDialogDescription className="text-[#888]">This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">Cancel</AlertDialogCancel><AlertDialogAction onClick={del} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}