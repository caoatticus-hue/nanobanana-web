import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Image as ImageIcon
} from 'lucide-react';
import { generateImage } from './lib/api';

// 类型定义
type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 持久化状态：确保关闭网页后数据依然存在
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
    const saved = localStorage.getItem('ai_studio_final_v4');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [loading, setLoading] = useState(false);
  const [currentResults, setCurrentResults] = useState<string[]>([]);

  // 状态自动同步到本地存储
  useEffect(() => {
    localStorage.setItem('ai_studio_final_v4', JSON.stringify(state));
  }, [state]);

  // 2. 清空数据逻辑
  const clearAllData = () => {
    if (window.confirm("确定要删除所有云存储记录并重置界面吗？")) {
      localStorage.removeItem('ai_studio_final_v4');
      setState(initialState);
      setCurrentResults([]);
      window.location.reload();
    }
  };

  // 3. AI 执行逻辑
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
        // 图片加速代理转发
        const optimizedUrls = urls.map(url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`);
        setCurrentResults(optimizedUrls);
        setState((prev: any) => ({
          ...prev,
          imageConfig: { ...prev.imageConfig, history: [...optimizedUrls, ...prev.imageConfig.history].slice(0, 12) }
        }));
      } else {
        await new Promise(r => setTimeout(r, 1500));
        alert("该模块逻辑已就绪，正在接入云端算力...");
      }
    } catch (e) {
      alert("AI 服务暂时不可用，请稍后刷新重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col text-white">
      {/* 动态背景 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('https://bing.img.run/rand_uhd.php')", backgroundColor: "#0a0a0a" }}
      />
      <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[4px] saturate-150" />

      {/* 主界面容器 */}
      <div className="relative z-20 flex flex-col h-full p-6 lg:p-10 gap-6">
        
        {/* 顶部标题栏 */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter drop-shadow-2xl">AI STUDIO</h1>
            <p className="text-white/40 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold italic">Resuming from last session</p>
          </div>
          <nav className="flex items-center gap-1 p-1 ios-panel rounded-full bg-white/5">
            {['image', 'paper'].includes(state.activeModule) && (
              <>
                <TabBtn label={state.activeModule === 'image' ? '生成模式' : '创作模式'} active={state.mode === 'gen'} onClick={() => setState({...state, mode:'gen'})} />
                <TabBtn label={state.activeModule === 'image' ? '清晰化' : '润色'} active={state.mode === 'fix'} onClick={() => setState({...state, mode:'fix'})} />
              </>
            )}
          </nav>
          <div className="ios-panel px-5 py-2.5 rounded-full flex items-center gap-3 text-[11px] font-black bg-white/5">
            <Sun size={14} className="text-yellow-400" />
            <span className="tracking-widest uppercase">Smart Engine Online</span>
          </div>
        </header>

        {/* 创意输入框 */}
        <section className="ios-panel p-2 flex items-center shadow-2xl h-20 shrink-0 bg-white/10 border-white/10 group focus-within:border-blue-500/50 transition-all">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="在此输入您的创意要求..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-lg text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleExecute}
            className="h-16 px-10 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-xl shadow-blue-900/40"
          >
            {loading ? <Clock className="animate-spin" size={20} /> : <Zap size={20} />}
            执行任务
          </button>
        </section>

        {/* 三栏主布局 */}
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          
          {/* 左侧：侧边导航栏 */}
          <aside className="w-20 ios-panel flex flex-col items-center py-8 gap-6 shrink-0 bg-black/20">
            <NavBtn icon={<Layout />} active={state.activeModule === 'home'} onClick={() => setState({...state, activeModule:'home'})} />
            <NavBtn icon={<Sparkles />} active={state.activeModule === 'image'} onClick={() => setState({...state, activeModule:'image'})} />
            <NavBtn icon={<Video />} active={state.activeModule === 'video'} onClick={() => setState({...state, activeModule:'video'})} />
            <NavBtn icon={<Presentation />} active={state.activeModule === 'ppt'} onClick={() => setState({...state, activeModule:'ppt'})} />
            <NavBtn icon={<FileText />} active={state.activeModule === 'paper'} onClick={() => setState({...state, activeModule:'paper'})} />
            <div className="flex-1" />
            <NavBtn icon={<Settings />} />
          </aside>

          {/* 中间：自适应结果展示区 */}
          <main className="flex-1 ios-panel relative overflow-hidden flex flex-col bg-black/10">
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-blue-400 font-black tracking-widest text-sm uppercase">Calculating AI Weights...</p>
                </div>
              ) : currentResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {currentResults.map((url, i) => (
                    <div key={i} className="group relative aspect-video ios-panel overflow-hidden border-white/5 shadow-2xl">
                      <img src={url} className="w-full h-full object-cover" alt="result" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button onClick={() => window.open(url)} className="p-4 bg-white/20 backdrop-blur-xl rounded-full hover:bg-blue-600 transition-all active:scale-90"><Download size={24}/></button>
                        <button className="p-4 bg-white/20 backdrop-blur-xl rounded-full hover:bg-white/40 active:scale-90"><Maximize2 size={24}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/5 gap-6">
                  <div className="text-center">
                    <h2 className="text-6xl font-black text-white/10 mb-6 tracking-tighter uppercase italic">{state.activeModule} Ready</h2>
                    <p className="text-xs tracking-[0.8em] font-medium text-white/20 uppercase">Awaiting your creativity</p>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* 右侧：配置设置面板 */}
          <aside className="w-80 ios-panel p-8 flex flex-col gap-10 shrink-0 overflow-y-auto no-scrollbar bg-black/20">
            {state.activeModule === 'home' ? (
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[10px] font-black opacity-30 mb-5 tracking-[0.2em] uppercase">Storage System</p>
                  <button 
                    onClick={clearAllData}
                    className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all shadow-lg"
                  >
                    <Trash2 size={14} /> 删除云存储数据
                  </button>
                </div>
                <div className="p-6 ios-panel bg-white/5 border-white/5">
                  <p className="text-[11px] text-white/40 leading-relaxed font-bold italic tracking-wide">
                    “系统已自动记录您的上一次创作状态。所有操作均经过 AIStudio V2 加速引擎处理。”
                  </p>
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

// 子组件：功能设置详情
function RenderSettings({ state, setState }: any) {
  const Label = ({ children }: any) => <p className="text-[10px] font-black opacity-30 mb-5 tracking-[0.2em] uppercase text-white">{children}</p>;

  switch (state.activeModule) {
    case 'image':
      return (
        <div className="flex flex-col gap-10">
          <div>
            <Label>渲染模型</Label>
            <div className="flex flex-col gap-2">
              <ConfigBtn label="极速模型 (Turbo)" active={state.imageConfig.quality === 'fast'} onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'fast'}})} />
              <ConfigBtn label="精细画质 (Flux)" active={state.imageConfig.quality === 'high'} onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'high'}})} />
            </div>
          </div>
          <div>
            <Label>并行张数</Label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(n => (
                <button 
                  key={n}
                  onClick={() => setState({...state, imageConfig: {...state.imageConfig, count: n}})}
                  className={`py-3 rounded-xl text-xs font-black border transition-all ${state.imageConfig.count === n ? 'border-blue-500 bg-blue-500/30 text-blue-400' : 'border-white/10 bg-white/5 text-white/30'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>云端历史</Label>
            <div className="grid grid-cols-3 gap-2">
              {state.imageConfig.history.map((url: string, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                  <img src={url} className="w-full h-full object-cover" alt="hist" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case 'video':
      return (
        <div className="flex flex-col gap-10">
          <div><Label>参考上传</Label><div className="h-36 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/20 gap-3 hover:bg-white/5 transition-colors cursor-pointer"><Upload size={24}/><span className="text-[10px] font-bold">上传参考素材</span></div></div>
          <div><Label>视频长度</Label><div className="flex gap-2"><ConfigBtn label="5s" active /><ConfigBtn label="10s" /></div></div>
        </div>
      );
    case 'ppt':
      return (
        <div className="flex flex-col gap-10">
          <div><Label>PPT 结构</Label><textarea className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-blue-500 transition-all placeholder:text-white/10" placeholder="在此输入 PPT 目录..."></textarea></div>
          <div><Label>页面幅宽</Label><div className="grid grid-cols-2 gap-2"><ConfigBtn label="16:9" active /><ConfigBtn label="4:3" /></div></div>
        </div>
      );
    default:
      return <div className="text-white/10 text-center py-20 font-black italic">Wait for Input</div>;
  }
}

// 基础 UI 按钮组件
function TabBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-8 py-2.5 rounded-full text-[11px] font-black transition-all ${active ? 'bg-blue-600 text-white shadow-xl scale-105' : 'text-white/20 hover:text-white'}`}>
      {label}
    </button>
  );
}

function NavBtn({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-2xl scale-110 shadow-blue-500/40' : 'text-white/20 hover:bg-white/10 hover:text-white'}`}>
      {icon}
    </button>
  );
}

function ConfigBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full py-4 px-5 rounded-2xl text-left text-[11px] font-black border-2 transition-all ${active ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg' : 'border-transparent bg-white/5 text-white/20 hover:bg-white/10'}`}>
      {label}
    </button>
  );
}
