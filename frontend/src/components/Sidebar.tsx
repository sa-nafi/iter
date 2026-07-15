import { Link } from 'react-router-dom'
import { LayoutGrid, LineChart, ClipboardList, History } from 'lucide-react'

export type ViewType = 'calculator' | 'graph' | 'results' | 'history'

interface SidebarProps {
  view: ViewType
  onNavigate: (v: ViewType) => void
}

export default function Sidebar({ view, onNavigate }: SidebarProps) {
  const items = [
    { id: 'calculator', label: 'Calculator', Icon: LayoutGrid },
    { id: 'graph', label: 'Graph', Icon: LineChart },
    { id: 'results', label: 'Results', Icon: ClipboardList },
    { id: 'history', label: 'History', Icon: History },
  ] as const

  return (
    <aside className="w-16 md:w-64 border-r border-zinc-200 bg-white flex flex-col h-full flex-shrink-0 transition-all">
      <div className="h-16 flex items-center justify-center md:justify-start px-0 md:px-6 border-b border-zinc-100">
        <Link to="/" className="text-xl font-bold tracking-tight text-zinc-900 hidden md:block">
          Itera<span className="text-zinc-400">.</span>
        </Link>
        <Link to="/" className="text-xl font-bold tracking-tight text-zinc-900 block md:hidden">
          I<span className="text-zinc-400">.</span>
        </Link>
      </div>

      <nav className="flex-1 py-6 flex flex-col space-y-1.5 px-2 md:px-4">
        {items.map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center justify-center md:justify-start px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
              title={label}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-zinc-900' : 'text-zinc-400'}`} />
              <span className="ml-3 hidden md:block">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
