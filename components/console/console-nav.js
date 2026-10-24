import { FileText, Flag, HardDrive, LifeBuoy, Mail, Megaphone, PanelsTopLeft } from 'lucide-react'

// Studio and Admin share one Console sidebar; `count` keys read from the layout's counts, `subs` deep-link via ?section=.
export const CONSOLE_NAV = [
  {
    key: 'studio',
    label: 'Studio',
    items: [
      { key: 'posts', label: 'Posts', icon: FileText, href: '/studio/posts', count: 'posts' },
      { key: 'releases', label: 'Releases', icon: Megaphone, href: '/studio/releases', count: 'releases' },
      { key: 'pages', label: 'Pages', icon: PanelsTopLeft, href: '/studio/pages', count: 'pages' },
      { key: 'help', label: 'Help Center', icon: LifeBuoy, href: '/studio/help', count: 'help' },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    locked: true,
    items: [
      {
        key: 'emails',
        label: 'Emails',
        icon: Mail,
        href: '/admin/emails',
        subs: [
          { key: 'templates', label: 'Templates' },
          { key: 'logs', label: 'Send log' },
          { key: 'keys', label: 'API keys' },
        ],
      },
      { key: 'notice', label: 'Notice banner', icon: Flag, href: '/admin/notice', live: true },
      {
        key: 'storage',
        label: 'Storage',
        icon: HardDrive,
        href: '/admin/storage',
        subs: [
          { key: 'overview', label: 'Overview' },
          { key: 'providers', label: 'Providers' },
          { key: 'browser', label: 'Browser' },
          { key: 'rules', label: 'Rules' },
          { key: 'keys', label: 'Keys & activity' },
        ],
      },
    ],
  },
]

// The nav item whose route owns the current pathname.
export function activeNavItem(pathname) {
  for (const group of CONSOLE_NAV) {
    const item = group.items.find((entry) => pathname === entry.href || pathname.startsWith(`${entry.href}/`))
    if (item) return item
  }
  return null
}
