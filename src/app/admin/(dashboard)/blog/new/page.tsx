'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Plus,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Link as LinkIcon,
  ListOrdered,
  List,
  Quote,
  Code,
  ImageIcon,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Tag {
  id: string;
  name: string;
  slug: string;
}

const DEFAULT_AUTHOR = 'Appalachian Growth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function calcReadTime(content: string): number {
  if (!content) return 0;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* ─── Markdown Toolbar ─── */
function MarkdownToolbar({ onInsert }: { onInsert: (pre: string, post: string) => void }) {
  const btnClass =
    'w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-[#B6FF00] hover:bg-[#B6FF00]/10 transition-colors';

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/[0.06] bg-[#0A0A0A]">
      <button type="button" onClick={() => onInsert('# ', '')} className={btnClass} title="Heading 1">
        <Heading1 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('## ', '')} className={btnClass} title="Heading 2">
        <Heading2 className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('### ', '')} className={btnClass} title="Heading 3">
        <Heading3 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/[0.06] self-center" />
      <button type="button" onClick={() => onInsert('**', '**')} className={btnClass} title="Bold">
        <Bold className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('*', '*')} className={btnClass} title="Italic">
        <Italic className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('[', '](url)')} className={btnClass} title="Link">
        <LinkIcon className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/[0.06] self-center" />
      <button type="button" onClick={() => onInsert('1. ', '')} className={btnClass} title="Ordered List">
        <ListOrdered className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('- ', '')} className={btnClass} title="Unordered List">
        <List className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('> ', '')} className={btnClass} title="Blockquote">
        <Quote className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('`', '`')} className={btnClass} title="Inline Code">
        <Code className="w-4 h-4" />
      </button>
      <button type="button" onClick={() => onInsert('![alt](', ')')} className={btnClass} title="Image">
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Main Component ─── */
export default function AdminBlogNew() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [author, setAuthor] = useState(DEFAULT_AUTHOR);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');

  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');

  // Categories list
  const [categories, setCategories] = useState<string[]>([]);

  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewTag, setShowNewTag] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState('');
  const [saveError, setSaveError] = useState('');

  // Load categories and tags
  useEffect(() => {
    fetch('/api/admin/blog-categories')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCategories(Array.isArray(data) ? data : data.categories || []))
      .catch(() => {});
    fetch('/api/admin/blog-tags')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAvailableTags(Array.isArray(data) ? data : data.tags || []))
      .catch(() => {});
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManuallyEdited]);

  // Read time
  const readTime = calcReadTime(content);

  // Close tag dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('.tag-selector')) setShowTagDropdown(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ─── Markdown insertion ─── */
  const insertMarkdown = useCallback(
    (prefix: string, suffix: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = content.substring(start, end);
      const before = content.substring(0, start);
      const after = content.substring(end);
      const newContent = before + prefix + selected + suffix + after;
      setContent(newContent);
      // Restore cursor position
      setTimeout(() => {
        ta.focus();
        const newPos = start + prefix.length + selected.length + suffix.length;
        ta.setSelectionRange(
          selected ? newPos : start + prefix.length,
          selected ? newPos : start + prefix.length
        );
      }, 0);
    },
    [content]
  );

  /* ─── Image Upload ─── */
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', 'blog');
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      if (r.ok) {
        const data = await r.json();
        setCoverImage(data.url || data.src || '');
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  /* ─── Tag Management ─── */
  const filteredTags = availableTags.filter(
    (t) =>
      !selectedTags.includes(t.name) &&
      t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  function addTag(name: string) {
    if (name && !selectedTags.includes(name)) {
      setSelectedTags([...selectedTags, name]);
    }
    setTagSearch('');
    setShowTagDropdown(false);
  }

  function addNewTag() {
    const trimmed = newTag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      // Also add to available tags if not there
      if (!availableTags.find((t) => t.name === trimmed)) {
        setAvailableTags([...availableTags, { id: crypto.randomUUID(), name: trimmed, slug: slugify(trimmed) }]);
      }
      setNewTag('');
      setShowNewTag(false);
    }
  }

  function removeTag(name: string) {
    setSelectedTags(selectedTags.filter((t) => t !== name));
  }

  /* ─── Save ─── */
  async function save() {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    setSaveError('');
    console.log('[Blog Create] Starting save...');
    try {
      const body = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt,
        content,
        coverImage: coverImage || null,
        category: category || newCategory || null,
        author: author || DEFAULT_AUTHOR,
        isPublished,
        readTime,
        publishedAt: publishedAt || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        tagNames: selectedTags,
      };
      console.log('[Blog Create] Sending POST /api/admin/blogs ...');
      const r = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log('[Blog Create] Response status:', r.status);
      if (r.ok) {
        const data = await r.json();
        console.log('[Blog Create] Success! Blog slug:', data.slug);
        setCreated(true);
        setCreatedSlug(data.slug || slug.trim());
        toast.success('Blog post created successfully!');
      } else {
        const err = await r.json().catch(() => ({}));
        const errMsg = err.error || 'Failed to create';
        const details = err.details || '';
        console.error('[Blog Create] Error:', errMsg, details);
        setSaveError(details ? `${errMsg} — ${details}` : errMsg);
        toast.error(errMsg);
      }
    } catch (err) {
      console.error('[Blog Create] Exception:', err);
      const msg = String((err as Error)?.message || 'Failed to create');
      setSaveError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'bg-[#111] border-white/[0.06] text-white placeholder:text-[#555] rounded-lg focus:border-[#B6FF00]/30';
  const labelClass = 'text-[#ccc] text-sm font-medium';

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/blog')}
            className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">New Blog Post</h2>
            <p className="text-[#888] text-sm">Create a new blog post</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/blog')}
            className="border-[rgba(182,255,0,0.2)] text-white hover:bg-[#111] rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={saving || !title.trim()}
            className="bg-[#B6FF00] text-[#050505] hover:bg-[#B6FF00]/90 rounded-xl font-bold min-w-[120px]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Post'}
          </Button>
        </div>
      </div>

      {/* Success Banner */}
      {created && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-300">Blog post created successfully!</p>
              <p className="mt-1 text-sm text-green-400/70">Your post &quot;{title}&quot; has been saved.</p>
              <div className="mt-3 flex gap-3">
                <NextLink
                  href={`/blog/${createdSlug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300 transition-colors hover:bg-green-500/30"
                >
                  View Post
                </NextLink>
                <button
                  onClick={() => router.push('/admin/blog')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#111] px-4 py-2 text-sm font-medium text-[#888] transition-colors hover:text-white"
                >
                  Back to Blog List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {saveError && !created && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{saveError}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* ─── Main Content Card ─── */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
          <div className="space-y-5">
            {/* Title */}
            <div>
              <Label className={labelClass}>Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog post title..."
                className={`mt-1.5 ${inputClass} h-11 text-lg font-semibold`}
              />
            </div>

            {/* Slug */}
            <div>
              <Label className={labelClass}>Slug</Label>
              <div className="flex items-center gap-0 mt-1.5">
                <span className="bg-[#111] border border-white/[0.06] border-r-0 rounded-l-lg px-3 py-2 text-[#555] text-sm">
                  /blog/
                </span>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="post-slug"
                  className={`${inputClass} rounded-l-none h-10`}
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label className={labelClass}>Short Excerpt</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of the post..."
                className={`mt-1.5 ${inputClass} resize-none`}
                rows={3}
              />
            </div>

            {/* Featured Image */}
            <div>
              <Label className={labelClass}>Featured Image</Label>
              <div className="mt-1.5">
                {coverImage ? (
                  <div className="relative inline-block">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-white/[0.06]"
                    />
                    <button
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/[0.08] rounded-lg cursor-pointer hover:border-[#B6FF00]/30 transition-colors">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-[#B6FF00] animate-spin mb-2" />
                    ) : (
                      <Upload className="w-6 h-6 text-[#555] mb-2" />
                    )}
                    <span className="text-sm text-[#666]">
                      {uploading ? 'Uploading...' : 'Click to upload featured image'}
                    </span>
                    <span className="text-xs text-[#444] mt-1">PNG, JPG, WebP</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <div className="flex items-center justify-between">
                <Label className={labelClass}>Content (Markdown)</Label>
                <div className="flex items-center gap-1 text-xs text-[#555]">
                  <Clock className="w-3 h-3" />
                  <span>{readTime} min read</span>
                </div>
              </div>
              <div className="mt-1.5 rounded-lg border border-white/[0.06] overflow-hidden">
                <MarkdownToolbar onInsert={insertMarkdown} />
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content in Markdown...\n\n# Heading 1\n## Heading 2\n**bold** *italic* [link](url)"
                  className={`${inputClass} border-0 rounded-none resize-y min-h-[350px] focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Sidebar Info Card ─── */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
          <div className="space-y-5">
            {/* Author */}
            <div>
              <Label className={labelClass}>Author</Label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`mt-1.5 ${inputClass} h-10`}
              />
            </div>

            {/* Category */}
            <div>
              <Label className={labelClass}>Category</Label>
              <div className="mt-1.5 space-y-2">
                {!showNewCategory ? (
                  <div className="flex gap-2">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`flex-1 ${inputClass} h-10 px-3 focus:outline-none`}
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="w-10 h-10 rounded-lg bg-[#111] border border-white/[0.06] flex items-center justify-center text-[#888] hover:text-[#B6FF00] transition-colors shrink-0"
                      title="Create new category"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name..."
                      className={`${inputClass} h-10 flex-1`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setCategory(newCategory);
                          setShowNewCategory(false);
                        }
                        if (e.key === 'Escape') {
                          setShowNewCategory(false);
                          setNewCategory('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategory.trim()) setCategory(newCategory.trim());
                        setShowNewCategory(false);
                      }}
                      className="w-10 h-10 rounded-lg bg-[#B6FF00]/10 flex items-center justify-center text-[#B6FF00] transition-colors shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategory(false);
                        setNewCategory('');
                      }}
                      className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-white transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="tag-selector relative">
              <Label className={labelClass}>Tags</Label>
              <div className="mt-1.5 space-y-2">
                {/* Selected Tags as Pills */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#B6FF00]/10 text-[#B6FF00] text-xs font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {!showNewTag ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTagDropdown(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-[#111] border border-white/[0.06] rounded-lg text-[#555] text-sm hover:border-white/[0.12] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add tag...
                    </button>
                    {showTagDropdown && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-[#111] border border-white/[0.08] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        <div className="p-2 border-b border-white/[0.06]">
                          <Input
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            placeholder="Search tags..."
                            className={`${inputClass} h-8 text-xs`}
                            autoFocus
                          />
                        </div>
                        {filteredTags.length === 0 ? (
                          <div className="p-3 text-center text-[#555] text-xs">
                            No tags found
                          </div>
                        ) : (
                          filteredTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => addTag(tag.name)}
                              className="w-full text-left px-3 py-2 text-sm text-[#ccc] hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                              {tag.name}
                            </button>
                          ))
                        )}
                        <div className="border-t border-white/[0.06] p-1">
                          <button
                            type="button"
                            onClick={() => {
                              setShowTagDropdown(false);
                              setShowNewTag(true);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-[#B6FF00] hover:bg-white/[0.04] transition-colors"
                          >
                            + Create new tag
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="New tag name..."
                      className={`${inputClass} h-10 flex-1`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addNewTag();
                        if (e.key === 'Escape') {
                          setShowNewTag(false);
                          setNewTag('');
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addNewTag}
                      className="w-10 h-10 rounded-lg bg-[#B6FF00]/10 flex items-center justify-center text-[#B6FF00] transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewTag(false);
                        setNewTag('');
                      }}
                      className="w-10 h-10 rounded-lg bg-[#111] flex items-center justify-center text-[#888] hover:text-white transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Publish Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClass}>Status</Label>
                <div className="mt-1.5">
                  <div className="flex gap-1 bg-[#111] rounded-lg p-0.5">
                    {(['draft', 'published'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setIsPublished(s === 'published')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors capitalize ${
                          isPublished === (s === 'published')
                            ? 'bg-[#B6FF00]/15 text-[#B6FF00]'
                            : 'text-[#888] hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label className={labelClass}>Publish Date</Label>
                <Input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className={`mt-1.5 ${inputClass} h-10`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── SEO Section ─── */}
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A]">
          <Accordion type="single" collapsible>
            <AccordionItem value="seo" className="border-0 px-6">
              <AccordionTrigger className="text-white font-semibold text-sm py-4 hover:no-underline">
                SEO Settings
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pb-2">
                  <div>
                    <Label className="text-[#888] text-xs">Meta Title</Label>
                    <Input
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || 'Leave empty to use post title'}
                      className={`mt-1 ${inputClass} h-10`}
                    />
                  </div>
                  <div>
                    <Label className="text-[#888] text-xs">Meta Description</Label>
                    <Textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Leave empty to use excerpt"
                      className={`mt-1 ${inputClass} resize-none`}
                      rows={3}
                    />
                    <p className="text-[#444] text-xs mt-1">{metaDescription.length}/160 characters</p>
                  </div>
                  <div>
                    <Label className="text-[#888] text-xs">Canonical URL</Label>
                    <Input
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://example.com/blog/post-slug"
                      className={`mt-1 ${inputClass} h-10`}
                    />
                  </div>

                  <div className="border-t border-white/[0.04] pt-4">
                    <p className="text-xs text-[#666] font-medium mb-3">Open Graph</p>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-[#888] text-xs">OG Title</Label>
                        <Input
                          value={ogTitle}
                          onChange={(e) => setOgTitle(e.target.value)}
                          placeholder="Leave empty to use meta title"
                          className={`mt-1 ${inputClass} h-10`}
                        />
                      </div>
                      <div>
                        <Label className="text-[#888] text-xs">OG Description</Label>
                        <Textarea
                          value={ogDescription}
                          onChange={(e) => setOgDescription(e.target.value)}
                          placeholder="Leave empty to use meta description"
                          className={`mt-1 ${inputClass} resize-none`}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="text-[#888] text-xs">OG Image</Label>
                        <Input
                          value={ogImage}
                          onChange={(e) => setOgImage(e.target.value)}
                          placeholder="Leave empty to use featured image"
                          className={`mt-1 ${inputClass} h-10`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
