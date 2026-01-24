import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Cloud, MessageSquare, Zap, Download, RefreshCw, Upload, Layout
} from 'lucide-react';
import { generateImage } from './lib/api';

// 定义导航类型
type Tab = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type SubTab = 'gen' | 'fix';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [subTab, setSubTab] = useState<SubTab>('gen');
  const [loading, setLoading] = useState(false);
  
  // 状态云存储模拟：从上次停止的地方开始
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_state');
    return saved ? JSON.parse(saved) : { prompt: '', ratio: '1:1', mode: 'fast' };
  });

  useEffect(() => {
    localStorage.setItem('ai_studio_state', JSON.stringify(state));
  }, [state]);

  // 模块渲染函数
  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <HomeSection />;
      case 'image': return <ImageSection state={state} setState={setState} subTab={subTab} setSubTab={setSubTab} />;
      case 'ppt': return <PPTSection />;
      case 'paper': return <PaperSection subTab={subTab} setSubTab={setSubTab} />;
      default: return <div className="text-white">开发中...</div>;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col text-white">
      <div className="bg-wallpaper" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0" />

      <div className="relative z-10 flex flex-col h-full p-[var(--app-padding)] gap-6 overflow-hidden">
        [span_3](start_span){/* 顶部标题与标签栏[span_3](end_span) */}
        <header className="flex items-center justify-between px-4 shrink-0">
          <h1 className="text-4xl font-black tracking-tighter">AI STUDIO</h1>
          {['image', 'paper'].includes(activeTab) && (
            <div className="ios-panel p-1 flex gap-1 rounded-full">
              <button 
                onClick={() => setSubTab('gen')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${subTab === 'gen' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
              >
                {activeTab === 'image' ? '生图' : '生成'}
              </button>
              <button 
                onClick={() => setSubTab('fix')}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${subTab === 'fix' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
              >
                {activeTab === 'image' ? '清晰化' : '润色'}
              </button>
            </div>
          )}
          <div className="flex items-center gap-4 ios-panel px-5 py-2 rounded-full text-sm">
            <Cloud size={16} className="text-blue-400" />
            <span>24°C / 北京</span>
          </div>
        </header>

        {/* 创意输入框 (横跨全屏) */}
        <div className="ios-panel p-2 flex items-center shadow-2xl h-20 shrink-0">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            placeholder="在此输入您的创意要求..."
            className="flex-1 bg-transparent border-none outline-none px-6 text-lg placeholder:text-white/30"
          />
          <button className="h-16 px-12 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-2 font-bold shadow-lg active:scale-95 transition-all">
            <Zap size={20} /> 执行任务
          </button>
        </div>

        {/* 下方自适应三栏布局 */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* 侧边栏：圆形悬浮按钮 */}
          <aside className="w-20 ios-panel flex flex-col items-center py-8 gap-6 shrink-0">
            <NavBtn icon={<Layout />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavBtn icon={<Sparkles />} active={activeTab === 'image'} onClick={() => setActiveTab('image')} />
            <NavBtn icon={<Video />} active={activeTab === 'video'} onClick={() => setActiveTab('video')} />
            <NavBtn icon={<Presentation />} active={activeTab === 'ppt'} onClick={() => setActiveTab('ppt')} />
            <NavBtn icon={<FileText />} active={activeTab === 'paper'} onClick={() => setActiveTab('paper')} />
            <div className="flex-1" />
            <NavBtn icon={<Settings />} />
          </aside>

          {/* 内容主区 */}
          <main className="flex-1 min-w-0 fade-scale-in">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

// 子模块：主页
function HomeSection() {
  return (
    <div className="w-full h-full ios-panel p-12 flex flex-col justify-center gap-6">
      <h2 className="text-6xl font-bold">下午好, 创作人</h2>
      <p className="text-xl opacity-60">“每一个伟大的创作都始于一个简单的描述。”</p>
      <div className="mt-10 grid grid-cols-3 gap-6">
        <div className="p-6 ios-panel bg-blue-600/20">
          <p className="text-xs font-bold opacity-50 mb-2">每日一言</p>
          <p>不要等待灵感，去寻找它。</p>
        </div>
      </div>
    </div>
  );
}

[span_4](start_span)// 子模块：生图[span_4](end_span)
function ImageSection({ state, setState, subTab }: any) {
  return (
    <div className="flex h-full gap-6">
      <div className="flex-[3] ios-panel flex items-center justify-center relative">
        {subTab === 'gen' ? (
          <div className="opacity-20 flex flex-col items-center"><ImageIcon size={80} /><p className="mt-4 tracking-widest text-sm">等待生成内容</p></div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-10">
             <div className="w-full h-64 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center gap-4">
                <Upload size={40} />
                <p>点击或拖拽上传需要清晰化的原图</p>
             </div>
          </div>
        )}
      </div>
      <div className="flex-1 ios-panel p-8 flex flex-col gap-8">
        <h3 className="text-xs font-black opacity-30 tracking-widest uppercase">配置面板</h3>
        {subTab === 'gen' ? (
          <>
            <div><p className="text-xs mb-3 opacity-50">比例</p>
            <div className="grid grid-cols-2 gap-2">
              {['1:1','16:9','9:16','4:3'].map(r => (
                <button key={r} onClick={() => setState({...state, ratio: r})} className={`py-3 rounded-xl text-xs border ${state.ratio === r ? 'border-blue-500 bg-blue-500/20' : 'border-white/10'}`}>{r}</button>
              ))}
            </div></div>
          </>
        ) : (
          <div><p className="text-xs mb-3 opacity-50">清晰倍数</p>
          <div className="grid grid-cols-3 gap-2">
            {['2x','4x','8x'].map(b => <button key={b} className="py-3 rounded-xl border border-white/10">{b}</button>)}
          </div></div>
        )}
      </div>
    </div>
  );
}

// 基础组件
function NavBtn({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 shadow-xl scale-110' : 'hover:bg-white/10 opacity-50 hover:opacity-100'}`}>
      {icon}
    </button>
  );
}

// 更多模块 (PPT, Paper) 逻辑以此类推...
function PPTSection() { return <div className="ios-panel h-full p-10">PPT 生成界面模块加载中...</div>; }
function PaperSection({ subTab }: any) { return <div className="ios-panel h-full p-10">{subTab === 'gen' ? '论文生成' : '论文润色'}模块加载中...</div>; }

export default App;
