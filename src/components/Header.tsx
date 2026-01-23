const Header = () => {
  return (
    <header className="sidebar-header">
      <div className="sidebar-logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
          <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#3b82f6"/>
              <stop offset="1" stopColor="#8b5cf6"/>
            </linearGradient>
          </defs>
        </svg>
        <span>AI Studio</span>
      </div>
    </header>
  )
}

export default Header
