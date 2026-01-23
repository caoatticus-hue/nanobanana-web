import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ImageGenerator from './components/ImageGenerator'
import VideoGenerator from './components/VideoGenerator'
import History from './components/History'
import Settings from './components/Settings'

type Tab = 'create' | 'video' | 'history' | 'settings'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create')

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <ImageGenerator />
      case 'video':
        return <VideoGenerator />
      case 'history':
        return <History />
      case 'settings':
        return <Settings />
      default:
        return <ImageGenerator />
    }
  }

  return (
    <div className="app flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
