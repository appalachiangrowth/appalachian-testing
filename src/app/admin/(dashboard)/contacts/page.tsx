'use client';
import { useEffect, useState, useCallback } from 'react';
import { Mail, MailOpen, Loader2, Trash2, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface Contact { id: string; name: string; email: string; phone: string | null; service: string | null; platform: string | null; message: string; read: boolean; createdAt: string; }

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => { try { const r = await fetch('/api/admin/contacts'); if (r.ok) setContacts(await r.json()); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  async function toggleRead(c: Contact) {
    try { await fetch(`/api/admin/contacts/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: !c.read }) }); load(); } catch {}
  }

  async function del() {
    if (!deleteId) return;
    try { await fetch(`/api/admin/contacts/${deleteId}`, { method: 'DELETE' }); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    setDeleteId(null);
  }

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-[#B6FF00] animate-spin" /></div>;

  const unread = contacts.filter(c => !c.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Contact Submissions</h2>
          <p className="text-[#888] text-sm">{contacts.length} total · {unread} unread</p>
        </div>
      </div>

      <div className="rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] overflow-hidden">
        {contacts.length === 0 ? (
          <div className="text-center py-12 text-[#666]">No contact submissions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0D0D0D]"><tr>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider hidden md:table-cell">Service</th>
                <th className="text-left px-4 py-3 text-[#888] text-xs uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-[#888] text-xs uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-[rgba(182,255,0,0.05)]">
                {contacts.map(c => (
                  <tr key={c.id} className={`hover:bg-[rgba(182,255,0,0.02)] transition-colors ${!c.read ? 'bg-[rgba(182,255,0,0.03)]' : ''}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleRead(c)} className="flex items-center gap-1.5">
                        {c.read ? <MailOpen className="w-4 h-4 text-[#555]" /> : <Mail className="w-4 h-4 text-[#B6FF00]" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-[#888] hidden sm:table-cell">{c.email}</td>
                    <td className="px-4 py-3 text-[#888] hidden md:table-cell">{c.service || '—'}</td>
                    <td className="px-4 py-3 text-[#888] text-xs hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewing(c)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00]"><Eye className="w-3 h-3" /></button>
                      <button onClick={() => setDeleteId(c.id)} className="w-7 h-7 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)] max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Contact Details</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-[#888] text-xs uppercase mb-1">Name</div><div className="text-white text-sm">{viewing.name}</div></div>
                <div><div className="text-[#888] text-xs uppercase mb-1">Email</div><div className="text-[#B6FF00] text-sm">{viewing.email}</div></div>
                <div><div className="text-[#888] text-xs uppercase mb-1">Phone</div><div className="text-white text-sm">{viewing.phone || '—'}</div></div>
                <div><div className="text-[#888] text-xs uppercase mb-1">Service</div><div className="text-white text-sm">{viewing.service || '—'}</div></div>
                <div><div className="text-[#888] text-xs uppercase mb-1">Platform</div><div className="text-white text-sm">{viewing.platform || '—'}</div></div>
                <div><div className="text-[#888] text-xs uppercase mb-1">Date</div><div className="text-white text-sm">{new Date(viewing.createdAt).toLocaleString()}</div></div>
              </div>
              <div><div className="text-[#888] text-xs uppercase mb-1">Message</div><div className="text-[#bbb] text-sm leading-relaxed bg-[#0D0D0D] rounded-xl p-4">{viewing.message}</div></div>
              <div className="flex justify-between pt-2">
                <Button onClick={() => toggleRead(viewing)} variant="outline" className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl">{viewing.read ? 'Mark Unread' : 'Mark Read'}</Button>
                <Button onClick={() => { setDeleteId(viewing.id); setViewing(null); }} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl border-0">Delete</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#0A0A0A] border-[rgba(182,255,0,0.12)]">
          <AlertDialogHeader><AlertDialogTitle className="text-white">Delete Contact?</AlertDialogTitle><AlertDialogDescription className="text-[#888]">This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111]">Cancel</AlertDialogCancel><AlertDialogAction onClick={del} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}