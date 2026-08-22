const BASE = '/api/admin';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function formDataBody(data: Record<string, unknown>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && v !== null) fd.append(k, String(v));
  }
  return fd;
}

export async function uploadFile(file: File, category = 'general') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('category', category);
  return apiFetch(`${BASE}/upload`, { method: 'POST', body: fd });
}

// ─── Auth ───
export const authApi = {
  getMe: () => apiFetch(`${BASE}/auth/me`),
  login: (email: string, password: string) =>
    apiFetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    fetch(`${BASE}/auth/logout`, { method: 'POST' }).then((r) => r.json()),
};

// ─── Blogs ───
export const blogsApi = {
  getAll: () => apiFetch(`${BASE}/blogs`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/blogs/${id}`, { method: 'DELETE' }),
};

// ─── Portfolio ───
export const portfolioApi = {
  getAll: () => apiFetch(`${BASE}/portfolio`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/portfolio/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/portfolio/${id}`, { method: 'DELETE' }),
};

// ─── Testimonials ───
export const testimonialsApi = {
  getAll: () => apiFetch(`${BASE}/testimonials`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/testimonials/${id}`, { method: 'DELETE' }),
};

// ─── Team ───
export const teamApi = {
  getAll: () => apiFetch(`${BASE}/team`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/team/${id}`, { method: 'DELETE' }),
};

// ─── FAQs ───
export const faqsApi = {
  getAll: () => apiFetch(`${BASE}/faqs`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/faqs/${id}`, { method: 'DELETE' }),
};

// ─── Marketing ───
export const marketingApi = {
  getAll: () => apiFetch(`${BASE}/marketing`),
  createService: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/marketing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'service' }),
    }),
  createMetric: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/marketing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'metric' }),
    }),
  updateService: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/marketing/${id}?type=service`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'service' }),
    }),
  updateMetric: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/marketing/${id}?type=metric`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'metric' }),
    }),
  delete: (id: string, type: 'service' | 'metric' = 'service') =>
    apiFetch(`${BASE}/marketing/${id}?type=${type}`, { method: 'DELETE' }),
};

// ─── Results / Transformations ───
export const resultsApi = {
  getAll: () => apiFetch(`${BASE}/results`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/results/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/results/${id}`, { method: 'DELETE' }),
};

// ─── Contacts ───
export const contactsApi = {
  getAll: () => apiFetch(`${BASE}/contacts`),
  deleteMany: (ids: string[]) =>
    apiFetch(`${BASE}/contacts?ids=${ids.join(',')}`, { method: 'DELETE' }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/contacts/${id}`, { method: 'DELETE' }),
};

// ─── Settings ───
export const settingsApi = {
  getAll: () => apiFetch(`${BASE}/settings`),
  update: (data: Record<string, string>) =>
    apiFetch(`${BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
};

// ─── Screenshots (Hero + SEO) ───
export const screenshotsApi = {
  getAll: () => apiFetch(`${BASE}/screenshots`),
  createHero: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/screenshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'hero' }),
    }),
  createSeo: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/screenshots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'seo' }),
    }),
  updateHero: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/screenshots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'hero' }),
    }),
  updateSeo: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/screenshots/${id}?type=seo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type: 'seo' }),
    }),
  delete: (id: string, type: 'hero' | 'seo' = 'hero') =>
    apiFetch(`${BASE}/screenshots/${id}?type=${type}`, { method: 'DELETE' }),
};

// ─── Hero Stats ───
export const heroStatsApi = {
  getAll: () => apiFetch(`${BASE}/hero-stats`),
  create: (data: Record<string, unknown>) =>
    apiFetch(`${BASE}/hero-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    apiFetch(`${BASE}/hero-stats/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiFetch(`${BASE}/hero-stats/${id}`, { method: 'DELETE' }),
};
