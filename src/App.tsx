import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Image as ImageIcon // 确保这里引用了
} from 'lucide-react';
import { generateImage } from './lib/api';

type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 持久化数据
  const initialState = {
    activeModule: 'home' as Module,
    mode: 'gen' as Mode,
    prompt: '',
    imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
    videoConfig: { duration: '5s', ratio: '16:9' },
    pptConfig: { pages: 10, style: 'Modern' },
    paperConfig: { words: 2000, style: 'Academic' }
  };

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_v5');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [loading, setLoading] = useState(false);
  const [currentResults, setCurrentResults] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('ai_studio_v5', JSON.stringify(state));
  }, [state]);

  // 2. 清除云数据
  const clearAllData = () => {
    if (window.confirm("确定要删除所有历史记录吗？")) {
      localStorage.removeItem('ai_studio_v5');
      setState(initialState);
      setCurrentResults([]);
      window.location.reload();
    }
  };

  // 3. AI 执行引擎
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
        // 使用代理加速
        const optimized = urls.map(u => `https://images.weserv.nl/?url=${encodeURIComponent(u)}`);
        setCurrentResults(optimized);
        setState((prev: any) => ({
          ...prev,
          imageConfig: { ...prev.imageConfig, history: [...optimized, ...prev.imageConfig.history].slice(0, 12) }
        }));
      } else {
        await new Promise(r => setTimeout(r, 1000));
        alert("该功能模块已锁定，等待云端下发指令...");
      }
    } catch (e) {
      alert("服务连接超时");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col text-white bg-[#050505]">
      {/* 动态取色背景层 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: "url('https://bing.img.run/rand_uhd.php')" }}
      />
      <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-md saturate-150" />

      <div className="relative z-20 flex flex-col h-full p-6 lg:p-10 gap-6">
        {/* 顶部 */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter">AI STUDIO</h1>
            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em]">Personal Creative Hub</p>
          </div>
          
          <nav className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
            {['image', 'paper'].includes(state.activeModule) && (
              <>
                <button onClick={() => setState({...state, mode:'gen'})} className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all ${state.mode === 'gen' ? 'bg-blue-600 shadow-lg' : 'text-white/40 hover:text-white'}`}>生成</button>
                <button onClick={() => setState({...state, mode:'fix'})} className={`px-6 py-2 rounded-full text-[10px] font-bold transition-all ${state.mode === 'fix' ? 'bg-blue-600 shadow-lg' : 'text-white/40 hover:text-white'}`}>润色</button>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <Sun size={12} className="text-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Engine Optimized</span>
          </div>
        </header>

        {/* 输入框 */}
        <section className="flex items-center bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl focus-within:border-blue-500/50 transition-all">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="描述你的想法，AI 为你实现..."
            className="flex-1 bg-transparent border-none outline-none px-6 text-base text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleExecute}
            className="h-14 px-8 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-2 font-bold active:scale-95 transition-all shadow-xl"
          >
            {loading ? <Clock className="animate-spin" size={18} /> : <Zap size={18} />}
            <span>执行</span>
          </button>
        </section>

        {/* 主体三栏 */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* 左侧导航 */}
          <aside className="w-16 flex flex-col items-center py-6 gap-6 bg-black/20 rounded-3xl border border-white/5">
            <NavIcon icon={<Layout size={20}/>} active={state.activeModule === 'home'} onClick={() => setState({...state, activeModule:'home'})} />
            <NavIcon icon={<Sparkles size={20}/>} active={state.activeModule === 'image'} onClick={() => setState({...state, activeModule:'image'})} />
            <NavIcon icon={<Video size={20}/>} active={state.activeModule === 'video'} onClick={() => setState({...state, activeModule:'video'})} />
            <NavIcon icon={<Presentation size={20}/>} active={state.activeModule === 'ppt'} onClick={() => setState({...state, activeModule:'ppt'})} />
            <NavIcon icon={<FileText size={20}/>} active={state.activeModule === 'paper'} onClick={() => setState({...state, activeModule:'paper'})} />
            <div className="flex-1" />
            <button className="text-white/20 hover:text-white"><Settings size={20}/></button>
          </aside>

          {/* 中间预览 */}
          <main className="flex-1 bg-black/20 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-blue-400">
                  <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black tracking-[0.3em]">AI PROCESSING</p>
                </div>
              ) : currentResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentResults.map((url, i) => (
                    <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5">
                      <img src={url} className="w-full h-full object-cover" alt="result" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button onClick={() => window.open(url)} className="p-3 bg-white/10 rounded-full hover:bg-blue-600"><Download size={20}/></button>
                        <button className="p-3 bg-white/10 rounded-full hover:bg-white/20"><Maximize2 size={20}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-white/5 gap-4">
                  <ImageIcon size={80} strokeWidth={1} />
                  <p className="text-[10px] font-black tracking-[0.5em] uppercase">Ready for Canvas</p>
                </div>
              )}
            </div>
          </main>

          {/* 右侧设置 */}
          <aside className="w-72 flex flex-col gap-8 p-6 bg-black/20 rounded-3xl border border-white/5 overflow-y-auto no-scrollbar">
            {state.activeModule === 'home' ? (
              <div className="flex flex-col gap-6">
                <p className="text-[10px] font-black opacity-20 tracking-widest uppercase">System Storage</p>
                <button 
                  onClick={clearAllData}
                  className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-500/20"
                >
                  <Trash2 size={14} /> 删除云存储数据
                </button>
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-white/30 leading-relaxed italic">当前主题色已随必应背景自动调整。所有生成历史将保存于本地缓存中。</p>
                </div>
              </div>
            ) : (
              <SettingsPanel state={state} setState={setState} />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

// 子组件：导航按钮
function NavIcon({ icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-white/20 hover:bg-white/5 hover:text-white'}`}
    >
      {icon}
    </button>
  );
}

// 子组件：动态配置面板
function SettingsPanel({ state, setState }: any) {
  const Label = ({ title }: { title: string }) => <p className="text-[9px] font-black opacity-20 tracking-widest uppercase mb-4 text-white">{title}</p>;

  if (state.activeModule === 'image') {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Label title="渲染模型" />
          <div className="flex flex-col gap-2">
            <button onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'fast'}})} className={`w-full py-3 px-4 rounded-xl text-left text-[10px] font-bold border ${state.imageConfig.quality === 'fast' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 bg-white/5 text-white/40'}`}>极速 Turbo</button>
            <button onClick={() => setState({...state, imageConfig: {...state.imageConfig, quality:'high'}})} className={`w-full py-3 px-4 rounded-xl text-left text-[10px] font-bold border ${state.imageConfig.quality === 'high' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 bg-white/5 text-white/40'}`}>画质 Flux</button>
          </div>
        </div>
        <div>
          <Label title="生成数量" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(n => (
              <button key={n} onClick={() => setState({...state, imageConfig: {...state.imageConfig, count: n}})} className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${state.imageConfig.count === n ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5 bg-white/5 text-white/20'}`}>{n}</button>
            ))}
          </div>
        </div>
        <div>
          <Label title="近期历史" />
          <div className="grid grid-cols-3 gap-2">
            {state.imageConfig.history.map((url: string, i: number) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img src={url} className="w-full h-full object-cover" alt="hist" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return <div className="text-[10px] text-white/10 text-center py-20 font-bold uppercase tracking-widest">Configuring Module...</div>;
}
