'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
// import { Button } from "./ui/button"; // I'll check if this exists or create it
import { LayoutDashboard, LogOut, FileText } from 'lucide-react'

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { name: 'Workflows', href: '/workflows', icon: LayoutDashboard },
    { name: 'Requests', href: '/requests', icon: FileText },
  ]

  return (
    <nav className="flex flex-col w-64 border-r bg-slate-50 min-h-screen p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-indigo-600">Antigravity</h1>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900',
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  )
}
