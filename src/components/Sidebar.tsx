import Header from './Header'

type Tab = 'create' | 'video' | 'history' | 'settings'

interface SidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navItems = [
    { id: 'create' as Tab, icon: '✨', label: '图像生成' },
    { id: 'video' as Tab, icon: '🎬', label: '视频生成' },
    { id: 'history' as Tab, icon: '📁', label: '历史记录' },
    { id: 'settings' as Tab, icon: '⚙️', label: '系统设置' },
  ]

  return (
    <aside className="sidebar">
      <Header title="AI Studio" />
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
