import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Image as ImageIcon, ChevronRight
} from 'lucide-react';
import { generateImage } from './lib/api';

type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_v10');
    return saved ? JSON.parse(saved) : {
      activeModule: 'home' as Module,
      mode: 'gen' as Mode,
      prompt: '',
      imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
      pptConfig: { pages: 10 },
      paperConfig: { words: 2000 }
    };
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('ai_studio_v10', JSON.stringify(state));
  }, [state]);

  const handleAction = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    setResults([]);
    try {
      if (state.activeModule === 'image') {
        const url = await generateImage(state.prompt, state.imageConfig.quality, state.imageConfig.ratio);
        const urlArray = Array.isArray(url) ? url : [url];
        const optimized = urlArray.map(u => `https://images.weserv.nl/?url=${encodeURIComponent(u)}`);
        setResults(optimized);
        setState((s: any) => ({
          ...s,
          imageConfig: { ...s.imageConfig, history: [...optimized, ...s.imageConfig.history].slice(0, 9) }
        }));
      } else {
        await new Promise(r => setTimeout(r, 1000));
        alert("已将请求发送至算力节点");
      }
    } catch (e) {
      alert("处理失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#ececec] overflow-hidden font-sans">
      
      {/* 侧边导航栏 */}
      <nav className="w-16 flex flex-col items-center py-6 gap-6 border-r border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 cursor-pointer active:scale-90 transition-transform">
          <Zap size={20} fill="currentColor" />
        </div>
        <button onClick={() => setState({...state, activeModule:'home'})} className={`p-3 rounded-xl transition-all ${state.activeModule === 'home' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}><Layout size={20} /></button>
        <button onClick={() => setState({...state, activeModule:'image'})} className={`p-3 rounded-xl transition-all ${state.activeModule === 'image' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}><Sparkles size={20} /></button>
        <button onClick={() => setState({...state, activeModule:'video'})} className={`p-3 rounded-xl transition-all ${state.activeModule === 'video' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}><Video size={20} /></button>
        <button onClick={() => setState({...state, activeModule:'ppt'})} className={`p-3 rounded-xl transition-all ${state.activeModule === 'ppt' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}><Presentation size={20} /></button>
        <button onClick={() => setState({...state, activeModule:'paper'})} className={`p-3 rounded-xl transition-all ${state.activeModule === 'paper' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}><FileText size={20} /></button>
        <div className="flex-1"></div>
        <button className="p-3 text-white/10 hover:text-white"><Settings size={20} /></button>
      </nav>

      {/* 主界面容器 */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 顶部栏 */}
        <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-black tracking-tighter">AI STUDIO</h1>
            {state.activeModule !== 'home' && (
              <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
                <button onClick={() => setState({...state, mode:'gen'})} className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${state.mode === 'gen' ? 'bg-white/10 text-white' : 'text-white/20'}`}>
                  {state.activeModule === 'paper' ? '智能撰写' : '核心生成'}
                </button>
                <button onClick={() => setState({...state, mode:'fix'})} className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${state.mode === 'fix' ? 'bg-white/10 text-white' : 'text-white/20'}`}>
                  {state.activeModule === 'paper' ? '深度润色' : '后期增强'}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Sun size={14} className="text-yellow-500 opacity-50" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Nodes Active</span>
          </div>
        </header>

        {/* 动态内容滚动区 */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {state.activeModule === 'home' ? (
            /* 主页：独立概览界面 */
            <div className="p-12 max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black mb-2 tracking-tight">概览</h2>
                  <p className="text-white/20 text-sm">从最近的创作记录中继续工作</p>
                </div>
                <button onClick={() => {localStorage.clear(); window.location.reload();}} className="text-[10px] font-bold text-white/10 hover:text-red-400 flex items-center gap-2"><Trash2 size={12}/>销毁存储</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {state.imageConfig.history.length > 0 ? state.imageConfig.history.map((url: string, i: number) => (
                  <div key={i} className="group bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-black">
                      <img src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="history" />
                    </div>
                    <div className="flex items-center justify-between text-white/30 text-[11px] font-bold">
                      <span>IMAGE_GEN_{i}</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center opacity-20">
                    <ImageIcon size={48} />
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.5em]">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* 功能模块界面 */
            <div className="p-10 max-w-4xl mx-auto flex flex-col h-full">
              <div className="relative mb-12 group shrink-0">
                <input 
                  value={state.prompt}
                  onChange={(e) => setState({...state, prompt: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                  placeholder="在此输入指令..."
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-xl px-6 text-base outline-none focus:border-blue-500/30 transition-all"
                />
                <button 
                  onClick={handleAction}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Clock className="animate-spin" size={16} /> : <Zap size={16} />}
                  <span>{loading ? '运行中' : '运行'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                {results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    {results.map((url, i) => (
                      <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                        <img src={url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="res" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                          <button onClick={() => window.open(url)} className="p-3 bg-white/10 rounded-full hover:bg-blue-600"><Download size={18}/></button>
                          <button className="p-3 bg-white/10 rounded-full hover:bg-white/20"><Maximize2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-5">
                    <ImageIcon size={80} strokeWidth={1} />
                    <p className="mt-4 text-[10px] font-black tracking-widest uppercase">Input Required</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 右侧属性调节面板 */}
      {state.activeModule !== 'home' && (
        <aside className="w-72 border-l border-white/5 bg-black/20 shrink-0 overflow-y-auto no-scrollbar">
          <div className="p-8 flex flex-col gap-10">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">参数配置</h3>
              {state.activeModule === 'image' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-[10px] text-white/40 block mb-2 font-bold">数量</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map(n => (
                        <button key={n} onClick={() => setState({...state, imageConfig: {...state.imageConfig, count: n}})} className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${state.imageConfig.count === n ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-white/5 bg-white/5 text-white/20'}`}>{n}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">附件参考</h3>
              <div className="h-32 border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center text-white/10 gap-2 hover:bg-white/5 transition-all cursor-pointer group">
                <Upload size={20} className="group-hover:text-blue-500" />
                <span className="text-[10px] font-bold">上传资料</span>
              </div>
            </section>
          </div>
        </aside>
      )}
    </div>
  );
}
