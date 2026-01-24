import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, MessageSquare, Zap, Download, Clock, Upload, 
  Layout, Maximize2, Palette, List, AlignLeft
} from 'lucide-react';
import { generateImage } from './lib/api';

// 类型定义
type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 状态管理与“从上次停止处开始”
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_v3_data');
    return saved ? JSON.parse(saved) : {
      activeModule: 'home' as Module,
      mode: 'gen' as Mode,
      prompt: '',
      imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] },
      videoConfig: { duration: '5s', ratio: '16:9' },
      pptConfig: { pages: 10, outline: '', style: 'Modern' },
      paperConfig: { words: 2000, style: 'Academic', ref: '' }
    };
  });

  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);

  // 2. 实时保存状态
  useEffect(() => {
    localStorage.setItem('ai_studio_v3_data', JSON.stringify(state));
  }, [state]);

  // 3. 核心执行逻辑
  const handleExecute = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    try {
      if (state.activeModule === 'image' && state.mode === 'gen') {
        const url = await generateImage(state.prompt, state.imageConfig.quality, state.imageConfig.ratio);
        setCurrentResult(url);
        // 更新历史记录
        const newHistory = [url, ...state.imageConfig.history].slice(0, 10);
        setState({ ...state, imageConfig: { ...state.imageConfig, history: newHistory } });
      } else {
        // 其他模块模拟生成
        setTimeout(() => { setCurrentResult('success'); setLoading(false); }, 2000);
      }
    } catch (e) { alert("任务执行异常"); } finally { setLoading(false); }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans selection:bg-blue-500/30">
      {/* 自动取色背景层：通过 mix-blend-mode 实现随背景变色 */}
      <div className="fixed inset-0 z-0 bg-[#121212] url('https://bing.img.run/rand_uhd.php') center/cover no-repeat" />
      <div className="fixed inset-0 z-10 bg-black/30 backdrop-blur-[2px]" />

      <div className="relative z-20 flex flex-col h-full p-8 lg:p-12 gap-8 overflow-hidden">
        
        {/* 顶部：问候与天气 */}
        <header className="flex items-center justify-between px-2 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">AI STUDIO</h1>
            <p className="text-white/50 text-sm mt-1">
              {new Date().getHours() < 12 ? '早安' : '下午好'}，欢迎回来
            </p>
          </div>
          
          {/* 模块切换标签 */}
          <nav className="ios-panel p-1.5 flex gap-1 rounded-full bg-white/10">
            {['image', 'paper'].includes(state.activeModule) && (
              <>
                <TabBtn label={state.activeModule === 'image' ? '生成' : '创作'} active={state.mode === 'gen'} onClick={() => setState({...state, mode:'gen'})} />
                <TabBtn label={state.activeModule === 'image' ? '清晰化' : '润色'} active={state.mode === 'fix'} onClick={() => setState({...state, mode:'fix'})} />
              </>
            )}
          </nav>

          <div className="ios-panel px-6 py-3 rounded-full flex items-center gap-4 text-white/80 text-sm shadow-xl bg-white/5 border-white/10">
            <Sun size={18} className="text-yellow-400" />
            <span>26°C · 晴天</span>
          </div>
        </header>

        {/* 创意输入框 */}
        <section className="ios-panel p-2 flex items-center shadow-2xl h-24 shrink-0 bg-white/10 border-white/20">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            placeholder="输入您的创意指令..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-xl text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleExecute}
            className="h-20 px-12 bg-blue-600 hover:bg-blue-500 rounded-[20px] flex items-center gap-3 font-bold text-white shadow-lg active:scale-95 transition-all"
          >
            {loading ? <Clock className="animate-spin" /> : <Zap size={22} />}
            立即执行
          </button>
        </section>

        {/* 主内容区域：三栏布局 */}
        <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
          
          {/* 1. 悬浮侧边栏 */}
          <aside className="w-20 ios-panel flex flex-col items-center py-10 gap-8 shrink-0 bg-black/20">
            <NavBtn icon={<Layout />} active={state.activeModule === 'home'} onClick={() => setState({...state, activeModule:'home'})} />
            <NavBtn icon={<Sparkles />} active={state.activeModule === 'image'} onClick={() => setState({...state, activeModule:'image'})} />
            <NavBtn icon={<Video />} active={state.activeModule === 'video'} onClick={() => setState({...state, activeModule:'video'})} />
            <NavBtn icon={<Presentation />} active={state.activeModule === 'ppt'} onClick={() => setState({...state, activeModule:'ppt'})} />
            <NavBtn icon={<FileText />} active={state.activeModule === 'paper'} onClick={() => setState({...state, activeModule:'paper'})} />
            <div className="flex-1" />
            <NavBtn icon={<Settings />} />
          </aside>

          {/* 2. 核心预览/结果展示区 */}
          <main className="flex-[3] ios-panel relative overflow-hidden flex items-center justify-center bg-black/10">
            {renderMainContent(state, currentResult, loading)}
          </main>

          {/* 3. 动态配置面板 */}
          <aside className="w-80 ios-panel p-8 flex flex-col gap-10 shrink-0 overflow-y-auto no-scrollbar bg-black/20">
            {renderSettingsPanel(state, setState)}
          </aside>

        </div>
      </div>
    </div>
  );
}

// 辅助渲染函数：主内容
function renderMainContent(state: any, result: any, loading: boolean) {
  if (loading) return (
    <div className="flex flex-col items-center gap-6 animate-pulse">
      <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-blue-400 font-bold tracking-widest">AI 正在深度运算中...</p>
    </div>
  );

  switch (state.activeModule) {
    case 'home': return (
      <div className="text-center p-12">
        <h2 className="text-5xl font-bold text-white mb-6">欢迎使用 AI STUDIO</h2>
        <p className="text-white/40 max-w-md mx-auto leading-relaxed italic">“从上回停止的地方，开启新的灵感旅程。”</p>
      </div>
    );
    case 'image':
      return result ? (
        <img src={result} className="max-w-[90%] max-h-[90%] rounded-2xl shadow-2xl object-contain" />
      ) : (
        <div className="text-white/10 flex flex-col items-center gap-4">
          {state.mode === 'fix' ? <Upload size={80} /> : <Sparkles size={80} />}
          <p className="text-xs tracking-[0.5em]">{state.mode === 'fix' ? '请上传原图' : '生成结果将在此显示'}</p>
        </div>
      );
    // PPT, 视频, 论文的结果展示逻辑以此类推...
    default: return <div className="text-white/20">预览功能加载中...</div>;
  }
}

// 辅助渲染函数：设置面板
function renderSettingsPanel(state: any, setState: any) {
  const Label = ({ children }: any) => <p className="text-[10px] font-black opacity-30 mb-4 tracking-[0.2em] uppercase text-white">{children}</p>;

  switch (state.activeModule) {
    case 'image':
      return (
        <>
          <div>
            <Label>渲染引擎</Label>
            <div className="flex flex-col gap-2">
              <ConfigBtn label="极速渲染" active={state.imageConfig.quality === 'fast'} onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'fast'}})} />
              <ConfigBtn label="画质优先" active={state.imageConfig.quality === 'high'} onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'high'}})} />
            </div>
          </div>
          <div>
            <Label>历史记录</Label>
            <div className="grid grid-cols-3 gap-2">
              {state.imageConfig.history.map((url: string, i: number) => (
                <div key={i} className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <img src={url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </>
      );
    case 'ppt':
      return (
        <>
          <div><Label>生成张数</Label><input type="range" className="w-full" min="5" max="30" /></div>
          <div><Label>PPT 风格</Label><ConfigBtn label="简约商务" active /><ConfigBtn label="创意多媒体" /></div>
        </>
      );
    case 'video':
      return (
        <>
          <div><Label>视频时长</Label><div className="flex gap-2"><ConfigBtn label="5s" active /><ConfigBtn label="10s" /></div></div>
          <div><Label>画面比例</Label><div className="grid grid-cols-2 gap-2"><ConfigBtn label="16:9" active /><ConfigBtn label="9:16" /></div></div>
        </>
      );
    default: return <div className="text-white/20">请先选择功能模块</div>;
  }
}

// 基础 UI 组件
function TabBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
      {label}
    </button>
  );
}

function NavBtn({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-white/30 hover:bg-white/10 hover:text-white'}`}>
      {icon}
    </button>
  );
}

function ConfigBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full py-4 px-6 rounded-2xl text-left text-sm font-bold border-2 transition-all ${active ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-transparent bg-white/5 text-white/40 hover:bg-white/10'}`}>
      {label}
    </button>
  );
}
