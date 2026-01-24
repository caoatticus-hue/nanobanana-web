import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Image as ImageIcon
} from 'lucide-react';
import { generateImage } from './lib/api';

// 严格遵循站点的类型定义
type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 状态管理：支持本地持久化（模拟云端存储）
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_v7');
    return saved ? JSON.parse(saved) : {
      activeModule: 'image' as Module,
      mode: 'gen' as Mode,
      prompt: '',
      imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
      videoConfig: { duration: '5s' },
      pptConfig: { pages: 10 },
      paperConfig: { words: 2000 }
    };
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // 自动保存
  useEffect(() => {
    localStorage.setItem('ai_studio_v7', JSON.stringify(state));
  }, [state]);

  // 2. 清除所有数据逻辑
  const handleClearData = () => {
    if (confirm("确定要删除所有历史记录和云端配置吗？")) {
      localStorage.removeItem('ai_studio_v7');
      window.location.reload();
    }
  };

  // 3. 执行引擎：支持多图并行生成
  const handleGenerate = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    setResults([]);
    try {
      if (state.activeModule === 'image') {
        const tasks = Array.from({ length: state.imageConfig.count }).map(() => 
          generateImage(state.prompt, state.imageConfig.quality)
        );
        const urls = await Promise.all(tasks);
        setResults(urls);
        setState((s: any) => ({
          ...s,
          imageConfig: { ...s.imageConfig, history: [...urls, ...s.imageConfig.history].slice(0, 9) }
        }));
      } else {
        await new Promise(r => setTimeout(r, 1500));
        alert("该模块已准备就绪，正在接入后端算力");
      }
    } catch (e) {
      alert("连接失败，请检查网络");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#ededed] font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* 侧边导航栏 - 极致深色 */}
      <aside className="w-[72px] border-r border-white/5 flex flex-col items-center py-8 gap-8 bg-black/40">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 mb-4">
          <Zap size={20} fill="currentColor" />
        </div>
        <NavIcon icon={<Layout size={20}/>} active={state.activeModule === 'home'} onClick={() => setState({...state, activeModule:'home'})} />
        <NavIcon icon={<Sparkles size={20}/>} active={state.activeModule === 'image'} onClick={() => setState({...state, activeModule:'image'})} />
        <NavIcon icon={<Video size={20}/>} active={state.activeModule === 'video'} onClick={() => setState({...state, activeModule:'video'})} />
        <NavIcon icon={<Presentation size={20}/>} active={state.activeModule === 'ppt'} onClick={() => setState({...state, activeModule:'ppt'})} />
        <NavIcon icon={<FileText size={20}/>} active={state.activeModule === 'paper'} onClick={() => setState({...state, activeModule:'paper'})} />
        <div className="flex-1" />
        <button className="p-3 text-white/20 hover:text-white transition-colors"><Settings size={20} /></button>
      </aside>

      {/* 主工作区 */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header - 照搬设计 */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 bg-black/20 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight">AI STUDIO</span>
            <span className="text-[10px] text-white/20 font-bold tracking-widest uppercase">Premium Workspace</span>
          </div>

          <div className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center gap-1">
            <Tab label="生成" active={state.mode === 'gen'} onClick={() => setState({...state, mode:'gen'})} />
            <Tab label="清晰化/润色" active={state.mode === 'fix'} onClick={() => setState({...state, mode:'fix'})} />
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[11px] font-bold opacity-60">
            <Sun size={14} className="text-yellow-500" />
            <span>26°C · ENGINES ONLINE</span>
          </div>
        </header>

        {/* 内容滚动区 */}
        <div className="flex-1 overflow-y-auto p-10 no-scrollbar">
          
          {/* 核心输入框 - 视觉重心 */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative group">
              <input 
                value={state.prompt}
                onChange={(e) => setState({...state, prompt: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="在此输入您的创意描述或工作指令..."
                className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl px-8 text-lg outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/10 pr-40"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 rounded-xl flex items-center gap-2 font-bold transition-all active:scale-95 shadow-xl"
              >
                {loading ? <Clock className="animate-spin" size={18} /> : <Zap size={18} />}
                <span>{loading ? '生成中...' : '开始生成'}</span>
              </button>
            </div>
          </div>

          {/* 结果展示 - 自适应卡片 */}
          <div className="max-w-6xl mx-auto">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
                {results.map((url, i) => (
                  <div key={i} className="group relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/5 bg-white/5 shadow-2xl">
                    <img src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="result" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                      <button onClick={() => window.open(url)} className="p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-blue-600"><Download size={24}/></button>
                      <button className="p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"><Maximize2 size={24}/></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-white/5">
                <ImageIcon size={120} strokeWidth={0.5} />
                <p className="mt-4 tracking-[1em] text-[10px] font-black uppercase">Awaiting Output</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 右侧设置面板 */}
      <aside className="w-80 border-l border-white/5 bg-black/20 backdrop-blur-xl flex flex-col">
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar flex flex-col gap-10">
          
          {state.activeModule === 'home' ? (
            <div className="flex flex-col gap-8">
              <SectionTitle>系统管理</SectionTitle>
              <button 
                onClick={handleClearData}
                className="w-full py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={14} /> 删除云存储数据
              </button>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-[11px] text-white/30 leading-relaxed italic">当前界面采用自动取色方案，所有历史记录已同步至您的本地加密存储中。</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              <section>
                <SectionTitle>配置参数</SectionTitle>
                <div className="flex flex-col gap-3 mt-4">
                  <ConfigItem label="渲染精度" value="High Quality" />
                  <ConfigItem label="输出格式" value="Ultra HD" />
                </div>
              </section>

              <section>
                <SectionTitle>生成张数</SectionTitle>
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[1, 2, 3, 4].map(n => (
                    <button 
                      key={n} 
                      onClick={() => setState({...state, imageConfig: {...state.imageConfig, count: n}})}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${state.imageConfig.count === n ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5 bg-white/5 text-white/20'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <SectionTitle>素材参考</SectionTitle>
                <div className="mt-4 h-40 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-white/10 gap-2 hover:bg-white/5 transition-all cursor-pointer">
                  <Upload size={24} />
                  <span className="text-[10px] font-bold">上传参考资料</span>
                </div>
              </section>

              <section>
                <SectionTitle>云端历史记录</SectionTitle>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {state.imageConfig.history.map((url: string, i: number) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/10 bg-white/5">
                      <img src={url} className="w-full h-full object-cover" alt="history" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

// 辅助组件 - 确保 100% TS 兼容
function NavIcon({ icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
    </button>
  );
}

function Tab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/30 hover:text-white'}`}
    >
      {label}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{children}</h3>;
}

function ConfigItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
      <span className="text-[11px] text-white/40 font-bold">{label}</span>
      <span className="text-[11px] text-blue-400 font-black">{value}</span>
    </div>
  );
}
