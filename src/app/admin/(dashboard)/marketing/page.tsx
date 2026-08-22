'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, Megaphone, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MarketingService { id: string; title: string; description: string; stat: string; icon: string; sortOrder: number; isPublished: boolean; }
interface MarketingMetric { id: string; metric: string; before: string; after: string; increase: string; sortOrder: number; }

const emptyService = { title: '', description: '', stat: '', icon: 'Search', sortOrder: 0, isPublished: true };
const emptyMetric = { metric: '', before: '', after: '', increase: '', sortOrder: 0 };

export default function AdminMarketing() {
  const [services, setServices] = useState<MarketingService[]>([]);
  const [metrics, setMetrics] = useState<MarketingMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<MarketingService | null>(null);
  const [editingMetric, setEditingMetric] = useState<MarketingMetric | null>(null);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [metricForm, setMetricForm] = useState(emptyMetric);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'service' | 'metric' } | null>(null);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [metricDialog, setMetricDialog] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/marketing');
      if (r.ok) {
        const data = await r.json();
        setServices(data.services || []);
        setMetrics(data.metrics || []);
      }
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  function openCreateService() { setEditingService(null); setServiceForm(emptyService); setServiceDialog(true); }
  function openEditService(s: MarketingService) { setEditingService(s); const { id, ...f } = s; setServiceForm(f as typeof emptyService); setServiceDialog(true); }
  function openCreateMetric() { setEditingMetric(null); setMetricForm(emptyMetric); setMetricDialog(true); }
  function openEditMetric(m: MarketingMetric) { setEditingMetric(m); const { id, ...f } = m; setMetricForm(f as typeof emptyMetric); setMetricDialog(true); }

  async function saveService() {
    setSaving(true);
    try {
      const r = await fetch(editingService ? `/api/admin/marketing/${editingService.id}` : '/api/admin/marketing', {
        method: editingService ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...serviceForm, type: 'service' }),
      });
      if (!r.ok) throw new Error(); toast.success(editingService ? 'Updated' : 'Created'); setServiceDialog(false); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function saveMetric() {
    setSaving(true);
    try {
      const r = await fetch(editingMetric ? `/api/admin/marketing/${editingMetric.id}` : '/api/admin/marketing', {
        method: editingMetric ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...metricForm, type: 'metric' }),
      });
      if (!r.ok) throw new Error(); toast.success(editingMetric ? 'Updated' : 'Created'); setMetricDialog(false); load();
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try { await fetch(`/api/admin/marketing/${deleteTarget.id}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    setDeleteTarget(null);
  }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  return (
    <div className="space-y-8">
      {/* Marketing Services */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#B6FF00]" /><h2 className="text-xl font-bold text-white">Marketing Services</h2></div>
          <Button onClick={openCreateService} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold text-sm"><Plus className="w-4 h-4 mr-1" />Add Service</Button>
        </div>
        <div className="rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] overflow-hidden">
          {services.length === 0 ? <div className="text-center py-8 text-[#666]">No services yet.</div> : (
            <table className="w-full text-sm">
              <thead className="bg-[#0D0D0D]"><tr>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider hidden md:table-cell">Icon</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider hidden sm:table-cell">Stat</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-[rgba(182,255,0,0.05)]">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-[rgba(182,255,0,0.02)] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{s.title}</td>
                    <td className="px-4 py-3 text-[#888] hidden md:table-cell"><code className="text-xs bg-[#111] px-2 py-0.5 rounded">{s.icon}</code></td>
                    <td className="px-4 py-3 text-[#B6FF00] font-medium hidden sm:table-cell">{s.stat}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${s.isPublished ? 'bg-[rgba(182,255,0,0.1)] text-[#B6FF00]' : 'bg-[rgba(255,255,255,0.05)] text-[#888]'}`}>{s.isPublished ? 'Live' : 'Draft'}</span></td>
                    <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1">
                      <button onClick={() => openEditService(s)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => setDeleteTarget({ id: s.id, type: 'service' })} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Marketing Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#B6FF00]" /><h2 className="text-xl font-bold text-white">Before/After Metrics</h2></div>
          <Button onClick={openCreateMetric} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold text-sm"><Plus className="w-4 h-4 mr-1" />Add Metric</Button>
        </div>
        <div className="rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] overflow-hidden">
          {metrics.length === 0 ? <div className="text-center py-8 text-[#666]">No metrics yet.</div> : (
            <table className="w-full text-sm">
              <thead className="bg-[#0D0D0D]"><tr>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Metric</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Before</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">After</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Increase</th>
                <th className="text-right px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-[rgba(182,255,0,0.05)]">
                {metrics.map(m => (
                  <tr key={m.id} className="hover:bg-[rgba(182,255,0,0.02)] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{m.metric}</td>
                    <td className="px-4 py-3 text-[#888] line-through">{m.before}</td>
                    <td className="px-4 py-3 text-[#B6FF00] font-bold">{m.after}</td>
                    <td className="px-4 py-3"><span className="text-[#B6FF00] text-xs font-bold">{m.increase}</span></td>
                    <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1">
                      <button onClick={() => openEditMetric(m)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => setDeleteTarget({ id: m.id, type: 'metric' })} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Service Dialog */}
      <Dialog open={serviceDialog} onOpenChange={setServiceDialog}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">{editingService ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-[#ccc]">Title</Label><Input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} className="mt-1" /></div>
            <div><Label className="text-[#ccc]">Description</Label><Textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} className="mt-1" rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[#ccc]">Stat / Highlight</Label><Input value={serviceForm.stat} onChange={e => setServiceForm({ ...serviceForm, stat: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">Icon Name</Label><Input value={serviceForm.icon} onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })} className="mt-1" placeholder="Search, Megaphone, Globe..." /></div>
            </div>
            <div className="flex items-center gap-3"><button onClick={() => setServiceForm({ ...serviceForm, isPublished: !serviceForm.isPublished })} className={`relative w-11 h-6 rounded-full transition-colors ${serviceForm.isPublished ? 'bg-[#B6FF00]' : 'bg-[#333]'}`}><div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${serviceForm.isPublished ? 'translate-x-5' : ''}`} /></button><span className="text-sm text-[#ccc]">Published</span></div>
            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setServiceDialog(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button><Button onClick={saveService} disabled={saving} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingService ? 'Update' : 'Create'}</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Metric Dialog */}
      <Dialog open={metricDialog} onOpenChange={setMetricDialog}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">{editingMetric ? 'Edit' : 'Add'} Metric</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-[#ccc]">Metric Name</Label><Input value={metricForm.metric} onChange={e => setMetricForm({ ...metricForm, metric: e.target.value })} className="mt-1" placeholder="e.g. Monthly Revenue" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-[#ccc]">Before</Label><Input value={metricForm.before} onChange={e => setMetricForm({ ...metricForm, before: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">After</Label><Input value={metricForm.after} onChange={e => setMetricForm({ ...metricForm, after: e.target.value })} className="mt-1" /></div>
              <div><Label className="text-[#ccc]">Increase %</Label><Input value={metricForm.increase} onChange={e => setMetricForm({ ...metricForm, increase: e.target.value })} className="mt-1" placeholder="+300%" /></div>
            </div>
            <div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setMetricDialog(false)} className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">Cancel</Button><Button onClick={saveMetric} disabled={saving} className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingMetric ? 'Update' : 'Create'}</Button></div>
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