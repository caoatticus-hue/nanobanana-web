const History = () => {
  return (
    <div className="main-content">
      <div className="card animate-fade-in">
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          历史记录
        </h2>

        <div className="empty-state">
          <div className="empty-icon">⏰</div>
          <p className="empty-title">还没有生成记录</p>
          <p className="empty-desc">开始创作你的第一张图片吧！</p>
        </div>
      </div>
    </div>
  )
}

export default History
