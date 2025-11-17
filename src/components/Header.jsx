import { useState } from 'react'

function Header({ onNavigate, current }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const link = (key, label) => (
    <button
      key={key}
      onClick={() => { onNavigate(key); setMenuOpen(false) }}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${current === key ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'}`}
    >
      {label}
    </button>
  )

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">EB</div>
          <span className="font-semibold text-gray-800">Event Booker</span>
        </div>
        <nav className="hidden sm:flex items-center gap-2">
          {link('browse', 'Browse Events')}
          {link('create', 'Create Event')}
          {link('verify', 'Verify Pass')}
          <a href="/test" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50">System Test</a>
        </nav>
        <button className="sm:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="sr-only">Menu</span>
          <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-800"></div>
        </button>
      </div>
      {menuOpen && (
        <div className="sm:hidden border-t px-4 py-2 flex flex-col gap-1">
          {link('browse', 'Browse Events')}
          {link('create', 'Create Event')}
          {link('verify', 'Verify Pass')}
          <a href="/test" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50">System Test</a>
        </div>
      )}
    </header>
  )
}

export default Header
