'use client';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Settings { [key: string]: string; }

const defaults: Settings = {
  site_name: 'Appalachian Growth Solutions',
  site_description: 'We are a premium digital solutions agency. We help businesses build, grow, and succeed online with cutting-edge technology.',
  contact_email: 'appalachaingrowth@gmail.com',
  phone_number: '+1 (555) 123-4567',
  address: 'United States',
  working_hours: 'Mon - Sat, 9:00 AM - 6:00 PM',
  social_instagram: '#',
  social_facebook: '#',
  social_twitter: '#',
  social_linkedin: '#',
  hero_headline: '',
  hero_subtext: 'High-converting Shopify & WordPress stores built for growth.',
  hero_description: 'We build fast, conversion-focused eCommerce stores that don\'t just look good — they\'re built to attract customers and generate sales.',
  hero_cta_primary: 'Get Your Store Built',
  hero_cta_secondary: 'View Our Work',
  hero_process_steps: 'Design, Development, SEO, Growth',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState('');

  const load = useCallback(async () => {
    try { const r = await fetch('/api/admin/settings'); if (r.ok) { const d = await r.json(); setSettings({ ...defaults, ...d }); } } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    try {
      const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      if (!r.ok) throw new Error(); toast.success('Settings saved');
    } catch { toast.error('Failed to save'); } finally { setSaving(false); }
  }

  function addKey() {
    if (!newKey.trim()) return;
    setSettings(s => ({ ...s, [newKey.trim()]: '' }));
    setNewKey('');
  }

  function removeKey(key: string) {
    const next = { ...settings };
    delete next[key];
    setSettings(next);
  }

  if (loading) return <div className='flex justify-center h-64'><Loader2 className='w-8 h-8 text-[#B6FF00] animate-spin' /></div>;

  const entries = Object.entries(settings);

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div><h2 className='text-xl font-bold text-white'>Site Settings</h2><p className='text-[#888] text-sm'>General website settings</p></div>
        <Button onClick={save} disabled={saving} className='bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold'>
          {saving ? <Loader2 className='w-4 h-4 animate-spin' /> : <><Save className='w-4 h-4 mr-2' />Save All</>}
        </Button>
      </div>

      <div className='rounded-xl border border-[rgba(182,255,0,0.08)] bg-[#0A0A0A] p-6 space-y-4'>
        {entries.map(([key, value]) => (
          <div key={key} className='flex items-start gap-3'>
            <div className='flex-1'>
              <Label className='text-[#ccc]'>{key}</Label>
              <Input
                value={value}
                onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                className='mt-1'
              />
            </div>
            <button onClick={() => removeKey(key)} className='mt-7 w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-red-400 transition-colors'>
              <Trash2 className='w-3.5 h-3.5' />
            </button>
          </div>
        ))}

        <div className='flex items-center gap-3 pt-2 border-t border-[rgba(182,255,0,0.08)]'>
          <Input
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder='New setting key...'
            onKeyDown={e => e.key === 'Enter' && addKey()}
            className='flex-1'
          />
          <Button onClick={addKey} variant='outline' className='border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl'>
            <Plus className='w-4 h-4 mr-1' />Add
          </Button>
        </div>
      </div>
    </div>
  );
}
