import { useState } from 'react'

interface HistoryItem {
  id: string
  type: 'image' | 'video'
  prompt: string
  thumbnail: string
  fullUrl?: string
  createdAt: string
  status: 'success' | 'failed'
}

const History = () => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all')
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

  // 模拟历史数据
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      type: 'image',
      prompt: '一只可爱的橘猫在阳光明媚的窗台上晒太阳',
      thumbnail: 'https://picsum.photos/seed/cat/300/300',
      createdAt: '2024-01-15 14:30',
      status: 'success'
    },
    {
      id: '2',
      type: 'image',
      prompt: '梦幻般的星空下的古老城堡',
      thumbnail: 'https://picsum.photos/seed/castle/300/300',
      createdAt: '2024-01-15 13:20',
      status: 'success'
    },
    {
      id: '3',
      type: 'video',
      prompt: '海浪拍打岩石的自然风景',
      thumbnail: 'https://picsum.photos/seed/ocean/300/300',
      createdAt: '2024-01-15 12:10',
      status: 'success'
    },
    {
      id: '4',
      type: 'image',
      prompt: '未来科技感的城市夜景',
      thumbnail: 'https://picsum.photos/seed/future/300/300',
      createdAt: '2024-01-14 18:45',
      status: 'success'
    },
    {
      id: '5',
      type: 'image',
      prompt: '水彩风格的花园风景画',
      thumbnail: 'https://picsum.photos/seed/garden/300/300',
      createdAt: '2024-01-14 16:30',
      status: 'success'
    },
    {
      id: '6',
      type: 'image',
      prompt: '可爱的卡通人物头像',
      thumbnail: 'https://picsum.photos/seed/cartoon/300/300',
      createdAt: '2024-01-14 14:20',
      status: 'success'
    }
  ]

  const filteredItems = filter === 'all' 
    ? historyItems 
    : historyItems.filter(item => item.type === filter)

  const formatType = (type: string) => {
    return type === 'image' ? '🖼️ 图像' : '🎬 视频'
  }

  const deleteItem = (id: string) => {
    console.log('删除项目:', id)
  }

  return (
    <div className="animate-fade-in">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 标题区域 */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            历史记录
          </h1>
          <p style={{ color: '#9ca3af' }}>
            查看和管理您生成的图像和视频
          </p>
        </div>

        {/* 筛选标签 */}
        <div className="tabs" style={{ maxWidth: '400px', marginBottom: '24px' }}>
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`tab ${filter === 'image' ? 'active' : ''}`}
            onClick={() => setFilter('image')}
          >
            🖼️ 图像
          </button>
          <button
            className={`tab ${filter === 'video' ? 'active' : ''}`}
            onClick={() => setFilter('video')}
          >
            🎬 视频
          </button>
        </div>

        {/* 历史记录网格 */}
        {filteredItems.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedItem(item)}
              >
                <div style={{ marginBottom: '12px' }}>
                  <img
                    src={item.thumbnail}
                    alt={item.prompt}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                          <rect fill="#2a2a2a" width="200" height="200"/>
                          <text fill="#6b7280" font-family="system-ui" font-size="14" x="50%" y="50%" text-anchor="middle">加载失败</text>
                        </svg>
                      `)
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px', 
                    backgroundColor: 'rgba(59, 130, 246, 0.2)', 
                    color: '#3b82f6',
                    borderRadius: '6px'
                  }}>
                    {formatType(item.type)}
                  </span>
                  <span style={{ fontSize: '12px', color: '
