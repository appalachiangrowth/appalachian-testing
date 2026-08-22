'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Globe, Linkedin, Github } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TeamMember { id: string; name: string; role: string; bio: string; initials: string; websiteUrl: string; linkedinUrl: string; githubUrl: string; sortOrder: number; isPublished: boolean; }

const empty = { name: '', role: '', bio: '', initials: '', websiteUrl: '#', linkedinUrl: '#', githubUrl: '#', sortOrder: 0, isPublished: true };

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => { try { const r = await fetch('/api/admin/team'); if (r.ok) setItems(await r.json()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditing(null); setForm(empty); setDialogOpen(true); }
  function openEdit(m: TeamMember) { setEditing(m); const { id, ...f } = m; setForm(f); setDialogOpen(true); }

  async function save() {
    setSaving(true);
    try { const r = await fetch(editing ? `/api/admin/team/${editing.id}` : '/api/admin/team', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, initials: form.initials || form.name.split(' ').map(w => w[0]).join('').toUpperCase() }) }); if (!r.ok) throw new Error(); toast.success(editing ? 'Updated' : 'Created'); setDialogOpen(false); load(); } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function del() { if (!deleteId) return; try { await fetch(`/api/admin/team/${deleteId}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } setDeleteId(null); }
  async function togglePub(m: TeamMember) { try { await fetch(`/api/admin/team/${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !m.isPublished }) }); load(); } catch {} }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-xl font-bold text-white">Team Members</h2><p className="text-[#888] text-sm">Manage your team</p></div>
        <Button onClick={openCreate} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold"><Plus className="w-4 h-4 mr-2" />Add Member</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.length === 0 && <div className="col-span-full text-center py-12 text-[#666]">No team members yet.</div>}
        {items.map(m => (
          <div key={m.id} className={`rounded-xl border bg-[#0A0A0A] p-4 text-center hover:border-[rgba(182,255,0,0.2)] transition-all ${m.isPublished ? 'border-[rgba(182,255,0,0.08)]' : 'border-[rgba(255,255,255,0.05)] opacity-60'}`}>
            <div className="w-16 h-16 rounded-full bg-[rgba(182,255,0,0.15)] flex items-center justify-center mx-auto mb-3"><span className="text-[#B6FF00] text-lg font-bold">{m.initials}</span></div>
            <h3 className="text-white font-medium text-sm">{m.name}</h3>
            <p className="text-[#B6FF00] text-xs mt-0.5">{m.role}</p>
            <div className="flex items-center justify-center gap-1 mt-3">
              <button onClick={() => openEdit(m)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
              <button onClick={() => setDeleteId(m.id)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-white">{editing ? 'Edit' : 'Add'} Team Member</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">Role</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="mt-1" /></div>
            </div>
            <div><Label className="text-[#ccc]">Initials</Label><Input value={form.initials} onChange={e => setForm({ ...form, initials: e.target.value })} className="mt-1" maxLength={3} /></div>
            <div><Label className="text-[#ccc]">Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="mt-1" rows={3} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div><Label className="text-[#ccc]">Website URL</Label><Input value={form.websiteUrl} onChange={e => setForm({ ...form, websiteUrl: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">LinkedIn URL</Label><Input value={form.linkedinUrl} onChange={e => setForm({ ...form, linkedinUrl: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">GitHub URL</Label><Input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Sort Order</Label><Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              <div className="flex items-end pb-2"><div className="flex items-center gap-3"><button onClick={() => setForm({ ...form, isPublished: !form.isPublished })} className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? 'translate-x-5' : ''}`} /></button><span className="text-sm text-[#ccc]">Published</span></div></div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button>
              <Button onClick={save} disabled={saving || !form.name} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Member?</AlertDialogTitle><AlertDialogDescription className="text-[#888]">This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">Cancel</AlertDialogCancel><AlertDialogAction onClick={del} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}