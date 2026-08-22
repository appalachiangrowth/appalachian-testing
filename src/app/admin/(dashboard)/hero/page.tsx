'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeroStat { id: string; value: string; label: string; target: number; suffix: string; isStatic: boolean; sortOrder: number; }
interface HeroScreenshot { id: string; category: string; url: string; alt: string; sortOrder: number; }

const emptyStat = { value: '', label: '', target: 0, suffix: '', isStatic: false, sortOrder: 0 };
const emptyScreenshot = { category: 'laptop', url: '', alt: '', sortOrder: 0 };

function uploadFile(file: File): Promise<string> {
  const fd = new FormData(); fd.append('file', file); fd.append('category', 'hero');
  return fetch('/api/admin/upload', { method: 'POST', body: fd }).then(r => r.json()).then(d => { if (!d.url) throw new Error(); return d.url; });
}

export default function AdminHero() {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [screenshots, setScreenshots] = useState<HeroScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState<HeroStat | null>(null);
  const [editingShot, setEditingShot] = useState<HeroScreenshot | null>(null);
  const [statForm, setStatForm] = useState(emptyStat);
  const [shotForm, setShotForm] = useState(emptyScreenshot);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'stat' | 'screenshot' } | null>(null);
  const [statDialog, setStatDialog] = useState(false);
  const [shotDialog, setShotDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try { const r = await fetch('/api/admin/hero'); if (r.ok) { const d = await r.json(); setStats(d.stats || []); setScreenshots(d.screenshots || []); } } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  function openCreateStat() { setEditingStat(null); setStatForm(emptyStat); setStatDialog(true); }
  function openEditStat(s: HeroStat) { setEditingStat(s); const { id, ...f } = s; setStatForm(f as typeof emptyStat); setStatDialog(true); }
  function openCreateShot() { setEditingShot(null); setShotForm(emptyScreenshot); setShotDialog(true); }
  function openEditShot(s: HeroScreenshot) { setEditingShot(s); const { id, ...f } = s; setShotForm(f as typeof emptyScreenshot); setShotDialog(true); }

  async function saveStat() {
    setSaving(true);
    try {
      const r = await fetch(editingStat ? `/api/admin/hero/${editingStat.id}` : '/api/admin/hero', {
        method: editingStat ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...statForm, type: 'stat' }),
      });
      if (!r.ok) throw new Error(); toast.success(editingStat ? 'Updated' : 'Created'); setStatDialog(false); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function saveShot() {
    setSaving(true);
    try {
      const r = await fetch(editingShot ? `/api/admin/hero/${editingShot.id}` : '/api/admin/hero', {
        method: editingShot ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...shotForm, type: 'screenshot' }),
      });
      if (!r.ok) throw new Error(); toast.success(editingShot ? 'Updated' : 'Created'); setShotDialog(false); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await fetch(`/api/admin/hero/${deleteTarget.id}?type=${deleteTarget.type}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    setDeleteTarget(null);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return; setUploading(true);
    try { const url = await uploadFile(f); setShotForm(p => ({ ...p, url })); toast.success('Uploaded'); } catch { toast.error('Upload failed'); } finally { setUploading(false); }
  }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  const laptopShots = screenshots.filter(s => s.category === 'laptop');
  const monitorShots = screenshots.filter(s => s.category === 'monitor');
  const mobileShots = screenshots.filter(s => s.category === 'mobile');

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Hero Stats</h2>
          <Button onClick={openCreateStat} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold text-sm"><Plus className="w-4 h-4 mr-1" />Add Stat</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.length === 0 && <div className="col-span-full text-center py-8 text-[#666] rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A]">No stats yet.</div>}
          {stats.map(s => (
            <div key={s.id} className="rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] p-4 text-center">
              <div className="text-[#B6FF00] text-2xl font-bold">{s.value}</div>
              <div className="text-[#888] text-xs mt-1">{s.label}</div>
              <div className="flex justify-center gap-1 mt-2">
                <span className="text-[10px] text-[#666] bg-[#111] px-1.5 py-0.5 rounded">{s.isStatic ? 'static' : `target:${s.target}`}</span>
                <button onClick={() => openEditStat(s)} className="w-6 h-6 rounded bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => setDeleteTarget({ id: s.id, type: 'stat' })} className="w-6 h-6 rounded bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshots */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Device Screenshots</h2>
          <Button onClick={openCreateShot} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold text-sm"><Plus className="w-4 h-4 mr-1" />Add Screenshot</Button>
        </div>
        {['laptop', 'monitor', 'mobile'].map(cat => (
          <div key={cat} className="mb-6">
            <h3 className="text-sm font-medium text-[#B6FF00] mb-2 uppercase tracking-wider">{cat} ({(cat === 'laptop' ? laptopShots : cat === 'monitor' ? monitorShots : mobileShots).length})</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {(cat === 'laptop' ? laptopShots : cat === 'monitor' ? monitorShots : mobileShots).map(s => (
                <div key={s.id} className="relative group rounded-lg border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] overflow-hidden">
                  <img src={s.url} alt={s.alt || ''} className="w-full h-16 object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button onClick={() => openEditShot(s)} className="w-6 h-6 rounded bg-[#B6FF00] flex items-center justify-center text-[#050505]"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => setDeleteTarget({ id: s.id, type: 'screenshot' })} className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-white"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stat Dialog */}
      <Dialog open={statDialog} onOpenChange={setStatDialog}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">{editingStat ? 'Edit' : 'Add'} Stat</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Value</Label><Input value={statForm.value} onChange={e => setStatForm({ ...statForm, value: e.target.value })} className="mt-1" placeholder="1000+" /></div>
              <div><Label className="text-[#ccc]">Label</Label><Input value={statForm.label} onChange={e => setStatForm({ ...statForm, label: e.target.value })} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-[#ccc]">Target</Label><Input type="number" value={statForm.target} onChange={e => setStatForm({ ...statForm, target: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">Suffix</Label><Input value={statForm.suffix} onChange={e => setStatForm({ ...statForm, suffix: e.target.value })} className="mt-1" placeholder="+" /></div>
              <div><Label className="text-[#ccc]">Sort Order</Label><Input type="number" value={statForm.sortOrder} onChange={e => setStatForm({ ...statForm, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
            </div>
            <div className="flex items-center gap-3"><button onClick={() => setStatForm({ ...statForm, isStatic: !statForm.isStatic })} className={`relative w-11 h-6 rounded-full transition-colors ${statForm.isStatic ? 'bg-[#B6FF00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${statForm.isStatic ? 'translate-x-5' : ''}`} /></button><span className="text-sm text-[#ccc]">Static (no animation)</span></div>
            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setStatDialog(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button><Button onClick={saveStat} disabled={saving} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingStat ? 'Update' : 'Create'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Screenshot Dialog */}
      <Dialog open={shotDialog} onOpenChange={setShotDialog}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">{editingShot ? 'Edit' : 'Add'} Screenshot</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-[#ccc]">Device Category</Label><select value={shotForm.category} onChange={e => setShotForm({ ...shotForm, category: e.target.value })} className="mt-1 w-full rounded-xl border border-[rgba(182,255,0,0.12)] bg-[#0D0D0D] px-4 py-2.5 text-sm text-white"><option value="laptop">Laptop</option><option value="monitor">Monitor</option><option value="mobile">Mobile</option></select></div>
            <div><Label className="text-[#ccc]">Image</Label>
              <div className="mt-1 flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-dashed border-[rgba(182,255,0,0.2)] px-4 py-2.5 text-sm text-[#888] hover:text-[#B6FF00] hover:border-[#B6FF00] cursor-pointer transition-colors">{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}{shotForm.url ? 'Change' : 'Upload'}<input type="file" accept="image/*" onChange={handleUpload} className="hidden" /></label>
                {shotForm.url && <><img src={shotForm.url} alt="" className="w-24 h-16 rounded-lg object-cover" /><button onClick={() => setShotForm({ ...shotForm, url: '' })} className="text-[#888] hover:text-red-400"><X className="w-4 h-4" /></button></>}
              </div>
            </div>
            <div><Label className="text-[#ccc]">Or enter image URL</Label><Input value={shotForm.url} onChange={e => setShotForm({ ...shotForm, url: e.target.value })} className="mt-1" placeholder="/portfolio/example.webp" /></div>
            <div><Label className="text-[#ccc]">Alt Text</Label><Input value={shotForm.alt} onChange={e => setShotForm({ ...shotForm, alt: e.target.value })} className="mt-1" /></div>
            <div><Label className="text-[#ccc]">Sort Order</Label><Input type="number" value={shotForm.sortOrder} onChange={e => setShotForm({ ...shotForm, sortOrder: parseInt(e.target.value) || 0 })} className="mt-1" /></div>
            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShotDialog(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button><Button onClick={saveShot} disabled={saving || !shotForm.url} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingShot ? 'Update' : 'Create'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete?</AlertDialogTitle><AlertDialogDescription className="text-[#888]">This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}