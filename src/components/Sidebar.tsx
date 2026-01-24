import Header from './Header'

type Tab = 'create' | 'video' | 'history' | 'settings'

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navItems = [
    { id: 'create' as Tab, icon: '✨', label: '创作' },
    { id: 'video' as Tab, icon: '🎬', label: '视频' },
    { id: 'history' as Tab, icon: '⏰', label: '历史' },
    { id: 'settings' as Tab, icon: '⚙️', label: '设置' },
  ]

  return (
    <aside className="sidebar">
      <Header />
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
