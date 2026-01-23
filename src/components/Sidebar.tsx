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
      
      <div style={{ padding: '20px', borderTop: '1px solid #2e2e2e' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff'
          }}>
            U
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>用户</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>普通账户</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
