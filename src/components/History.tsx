const History = () => {
  return (
    <div className="main-content">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">历史记录</h2>
        </div>

        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <p>暂无历史记录</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>生成的图像会显示在这里</p>
        </div>
      </div>
    </div>
  )
}

export default History
