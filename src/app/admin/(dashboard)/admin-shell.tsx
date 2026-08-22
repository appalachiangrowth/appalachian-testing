"use client";

import { useState } from "react";
import Link from "next/link";
import { Toaster } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquareQuote,
  Users,
  Settings,
  Megaphone,
  TrendingUp,
  HelpCircle,
  Image as ImageIcon,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Briefcase,
  Activity,  LayoutGrid,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/blog-diagnostic", label: "Blog Diagnostic", icon: Activity },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/results", label: "Results", icon: TrendingUp },
  { href: "/admin/hero", label: "Hero Screenshots", icon: ImageIcon },
  { href: "/admin/seo-images", label: "SEO Images", icon: BarChart3 },
  { href: "/admin/platform-images", label: "Platform Images", icon: LayoutGrid },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquareQuote },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {}
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-[#0A0A0A] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B6FF00]/10">
              <span className="text-sm font-black text-[#B6FF00]">AG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-tight">Appalachian</span>
              <span className="text-[10px] text-neutral-500 leading-tight">Growth Solutions</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-neutral-500 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#B6FF00]/10 text-[#B6FF00]"
                        : "text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-white/[0.06] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <Toaster richColors position="top-right" />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#0A0A0A] px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-neutral-400 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-white">
              {navItems.find(
                (item) =>
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
              )?.label || "Admin"}
            </h1>
          </div>
          <Link
            href="/"
            target="_blank"
            className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-xs text-neutral-400 transition-all hover:border-white/[0.12] hover:text-white"
          >
            View Site ↗
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
