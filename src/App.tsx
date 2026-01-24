import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Palette, Image as ImageIcon
} from 'lucide-react';
import { generateImage } from './lib/api';

// 类型定义
type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 深度持久化状态：从上次停止的地方开始
  const initialState = {
    activeModule: 'home' as Module,
    mode: 'gen' as Mode,
    prompt: '',
    imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
    videoConfig: { duration: '5s', ratio: '16:9' },
    pptConfig: { pages: 10, outline: '', style: 'Modern' },
    paperConfig: { words: 2000, style: 'Academic', ref: '' }
  };

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_final_v2');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [loading, setLoading] = useState(false);
  const [currentResults, setCurrentResults] = useState<string[]>([]);

  // 状态自动同步到 localStorage
  useEffect(() => {
    localStorage.setItem('ai_studio_final_v2', JSON.stringify(state));
  }, [state]);

  // 2. 云存储删除逻辑
  const clearAllData = () => {
    if (window.confirm("确定要删除所有云存储数据并重置吗？")) {
      localStorage.removeItem('ai_studio_final_v2');
      setState(initialState);
      setCurrentResults([]);
      window.location.reload();
    }
  };

  // 3. AI 调度逻辑：支持并行多图生成
  const handleExecute = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    setCurrentResults([]);
    
    try {
      if (state.activeModule === 'image' && state.mode === 'gen') {
        const tasks = Array.from({ length: state.imageConfig.count }).map(() => 
          generateImage(state.prompt, state.imageConfig.quality, state.imageConfig.ratio)
        );
        const urls = await Promise.all(tasks);
        setCurrentResults(urls);
        setState((prev: any) => ({
          ...prev,
          imageConfig: { ...prev.imageConfig, history: [...urls, ...prev.imageConfig.history].slice(0, 12) }
        }));
      } else {
        // 其他模块模拟：视频/PPT/论文生成逻辑预留
        await new Promise(r => setTimeout(r, 2000));
        alert("该模块生成功能正在对接中...");
      }
    } catch (e) {
      alert("AI 服务暂时不可用，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col text-white">
      {/* 动态背景：必应每日壁纸 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('https://bing.img.run/rand_uhd.php')`, backgroundColor: '#0a0a0a' }}
      />
      <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-20 flex flex-col h-full p-6 lg:p-10 gap-6">
        
        {/* 顶部标题栏 */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter drop-shadow-lg">AI STUDIO</h1>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest font-bold">Resuming from last session</p>
          </div>
          
          <nav className="flex items-center gap-1 p-1.5 ios-panel rounded-full bg-white/5">
            {['image', 'paper'].includes(state.activeModule) && (
              <>
                <TabBtn label={state.activeModule === 'image' ? '生成' : '创作'} active={state.mode === 'gen'} onClick={() => setState({...state, mode:'gen'})} />
                <TabBtn label={state.activeModule === 'image' ? '清晰化' : '润色'} active={state.mode === 'fix'} onClick={() => setState({...state, mode:'fix'})} />
              </>
            )}
          </nav>

          <div className="ios-panel px-5 py-2.5 rounded-full flex items-center gap-3 text-xs font-bold bg-white/5 border-white/10">
            <Sun size={14} className="text-yellow-400" />
            <span>26°C · 北京</span>
          </div>
        </header>

        {/* 创意输入框 - 全宽布局 */}
        <section className="ios-panel p-2 flex items-center shadow-2xl h-20 shrink-0 bg-white/10 border-white/20">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="在此描述您的创意想法..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-lg text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleExecute}
            className="h-16 px-10 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-xl shadow-blue-900/40"
          >
            {loading ? <Clock className="animate-spin" size={20} /> : <Zap size={20} />}
            生成按钮
          </button>
        </section>

        {/* 三栏核心区 */}
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          
          {/* 左侧：侧边栏按钮 */}
          <aside className="w-20 ios-panel flex flex-col items-center py-8 gap-6 shrink-0 bg-black/20">
            <NavBtn icon={<Layout />} active={state.activeModule === 'home'} onClick={() => setState({...state, activeModule:'home'})} />
            <NavBtn icon={<Sparkles />} active={state.activeModule === 'image'} onClick={() => setState({...state, activeModule:'image'})} />
            <NavBtn icon={<Video />} active={state.activeModule === 'video'} onClick={() => setState({...state, activeModule:'video'})} />
            <NavBtn icon={<Presentation />} active={state.activeModule === 'ppt'} onClick={() => setState({...state, activeModule:'ppt'})} />
            <NavBtn icon={<FileText />} active={state.activeModule === 'paper'} onClick={() => setState({...state, activeModule:'paper'})} />
            <div className="flex-1" />
            <NavBtn icon={<Settings />} />
          </aside>

          {/* 中间：主预览区 */}
          <main className="flex-1 ios-panel relative overflow-hidden flex flex-col bg-black/10">
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-blue-400 font-bold tracking-tighter">AI 模型深度计算中...</p>
                </div>
              ) : currentResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                  {currentResults.map((url, i) => (
                    <div key={i} className="group relative aspect-video ios-panel overflow-hidden border-white/5 shadow-2xl">
                      <img src={url} className="w-full h-full object-cover" alt="result" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <button onClick={() => window.open(url)} className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-blue-600 transition-all"><Download size={20}/></button>
                         <button className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40"><Maximize2 size={20}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/10 gap-4">
                  {state.activeModule === 'home' ? (
                    <div className="text-center">
                      <h2 className="text-5xl font-black text-white/20 mb-4 tracking-tighter">HELLO CREATOR</h2>
                      <p className="text-sm tracking-[0.5em] font-light">从上回停止的地方开启灵感</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={100} strokeWidth={0.5} />
                      <p className="tracking-[0.8em] text-[10px] font-bold">READY TO CREATE</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* 右侧：功能设置面板 */}
          <aside className="w-80 ios-panel p-8 flex flex-col gap-10 shrink-0 overflow-y-auto no-scrollbar bg-black/20">
            {state.activeModule === 'home' ? (
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[10px] font-black opacity-30 mb-5 tracking-[0.2em] uppercase">云存储管理</p>
                  <button 
                    onClick={clearAllData}
                    className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={14} /> 删除云存储数据
                  </button>
                </div>
                <div className="p-5 ios-panel bg-white/5">
                  <p className="text-xs text-white/40 leading-relaxed font-medium">每日一言：每一个伟大的作品都始于一个简单的描述。系统已为您自动锁定环境取色方案。</p>
                </div>
              </div>
            ) : (
              <RenderSettings state={state} setState={setState} />
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}

// 设置面板子组件 - 严格遵循 PDF 逻辑
function RenderSettings({ state, setState }: any) {
  const Label = ({ children }: any) => <p className="text-[10px] font-black opacity-30 mb-5 tracking-[0.2em] uppercase">{children}</p>;

  switch (state.activeModule) {
    case 'image':
      return (
        <div className="flex flex-col gap-8">
          <div>
            <Label>渲染模型</Label>
            <div className="flex flex-col gap-2">
              <ConfigBtn label="极速模式 (Turbo)" active={state.imageConfig.quality === 'fast'} onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'fast'}})} />
              <ConfigBtn label="画质优先 (Flux)" active={state.imageConfig.quality === 'high'} onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'high'}})} />
            </div>
          </div>
          <div>
            <Label>并行生成张数</Label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(n => (
                <button 
                  key={n}
                  onClick={() => setState({...state, imageConfig: {...state.imageConfig, count: n}})}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${state.imageConfig.count === n ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/10 bg-white/5'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>历史云记录</Label>
            <div className="grid grid-cols-3 gap-2">
              {state.imageConfig.history.map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img src={url} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'ppt':
      return (
        <div className="flex flex-col gap-8">
          <div><Label>PPT 大纲</Label><textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-blue-500 transition-colors" placeholder="输入PPT目录结构..."></textarea></div>
          <div><Label>生成页数</Label><input type="range" className="w-full accent-blue-500" min="5" max="30" /></div>
        </div>
      );
    case 'video':
      return (
        <div className="flex flex-col gap-8">
          <div><Label>参考素材</Label><div className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/20 gap-2"><Upload size={24}/><span className="text-[10px]">点击上传参考图/视频</span></div></div>
          <div><Label>视频时长</Label><div className="flex gap-2"><ConfigBtn label="5秒" active /><ConfigBtn label="10秒" /></div></div>
        </div>
      );
    default:
      return <div className="text-white/20 text-center py-20">功能模块配置中</div>;
  }
}

// 基础 UI 组件
function TabBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}>
      {label}
    </button>
  );
}

function NavBtn({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-xl scale-110 shadow-blue-500/40' : 'text-white/30 hover:bg-white/10 hover:text-white'}`}>
      {icon}
    </button>
  );
}

function ConfigBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full py-4 px-5 rounded-2xl text-left text-xs font-bold border-2 transition-all ${active ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-transparent bg-white/5 text-white/30 hover:bg-white/10'}`}>
      {label}
    </button>
  );
}
