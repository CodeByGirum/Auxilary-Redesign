import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Plus, Trash2, GripVertical, ChevronDown, 
  Cpu, Zap, Database, Terminal, FileText, Check, 
  RotateCw, Save, ArrowLeft, Image as ImageIcon, BarChart3, AlertCircle
} from 'lucide-react';
import { Notebook, NotebookCell, Environment, Compute } from '../types';
import { EmbeddedTable } from '../components/chat/EmbeddedTable';
import { ChatChart } from '../components/chat/ChatChart';
import { CodeBlock } from '../components/chat/CodeBlock';
import { MarkdownRenderer } from '../components/chat/MarkdownRenderer';
import { TableData } from '../types/chat';

// Add global type for pyodide
declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

interface NotebookEditorProps {
  notebook: Notebook;
  onBack: () => void;
}

export const NotebookEditor: React.FC<NotebookEditorProps> = ({ notebook: initialNotebook, onBack }) => {
  // State
  const [title, setTitle] = useState(initialNotebook.title);
  const [cells, setCells] = useState<NotebookCell[]>(initialNotebook.cells || [
    { id: '1', type: 'markdown', status: 'idle', content: `# ${initialNotebook.title}\n\nThis notebook environment uses a real Python kernel running in your browser via WebAssembly.` },
    { id: '2', type: 'code', status: 'idle', content: `import pandas as pd\nimport numpy as np\n\n# Create a sample dataframe\ndata = {\n    'Month': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],\n    'Revenue': [12500, 14200, 11800, 15600, 16100],\n    'Cost': [8200, 8500, 7900, 9100, 9400]\n}\ndf = pd.DataFrame(data)\ndf['Profit'] = df['Revenue'] - df['Cost']\n\nprint("Data calculated successfully!")\ndf.head()` }
  ]);
  const [environment, setEnvironment] = useState<Environment>(initialNotebook.environment || 'python');
  const [compute, setCompute] = useState<Compute>(initialNotebook.compute || 'cpu-std');
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Pyodide State
  const [pyodide, setPyodide] = useState<any>(null);
  const [isKernelReady, setIsKernelReady] = useState(false);
  const [kernelStatus, setKernelStatus] = useState<string>('Initializing...');

  // Initialize Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      if (window.pyodide) {
        setPyodide(window.pyodide);
        setIsKernelReady(true);
        return;
      }

      if (window.loadPyodide) {
        try {
          setKernelStatus('Loading Python Kernel...');
          const py = await window.loadPyodide();
          setKernelStatus('Loading micropip...');
          await py.loadPackage("micropip");
          setPyodide(py);
          window.pyodide = py; // Store globally to avoid reload
          setIsKernelReady(true);
        } catch (e) {
          console.error("Failed to load Pyodide:", e);
          setKernelStatus('Kernel Error');
        }
      } else {
          // Fallback if script not loaded yet (should wait or retry)
          setKernelStatus('Waiting for Pyodide...');
      }
    };
    
    // Small delay to ensure script tag processed
    const t = setTimeout(initPyodide, 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-resize textareas
  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  // --- Actions ---

  const handleRunCell = async (id: string) => {
    const cell = cells.find(c => c.id === id);
    if (!cell || cell.type !== 'code') return;

    setCells(prev => prev.map(c => c.id === id ? { ...c, status: 'running', output: undefined } : c));

    if (!isKernelReady || !pyodide) {
        setCells(prev => prev.map(c => c.id === id ? { 
            ...c, 
            status: 'error', 
            output: { type: 'error', data: "Python kernel is not ready yet. Please wait." } 
        } : c));
        return;
    }

    try {
        // Redirect stdout
        let stdout = "";
        pyodide.setStdout({ batched: (msg: string) => { stdout += msg + "\n"; } });
        pyodide.setStderr({ batched: (msg: string) => { stdout += `[stderr] ${msg}\n`; } });

        // Load packages if needed (basic heuristic)
        if (cell.content.includes("pandas") || cell.content.includes("numpy")) {
             await pyodide.loadPackage(["pandas", "numpy"]);
        }
        if (cell.content.includes("matplotlib")) {
             await pyodide.loadPackage("matplotlib");
        }

        // Run
        let result = await pyodide.runPythonAsync(cell.content);
        
        let output: NotebookCell['output'];

        // Check if result is a Pandas DataFrame (via proxy)
        if (result && typeof result.to_json === 'function') {
             // It's likely a dataframe, convert to JSON
             const jsonStr = result.to_json(undefined, { orient: 'split' });
             const parsed = JSON.parse(jsonStr);
             const tableData: TableData = {
                 headers: parsed.columns,
                 rows: parsed.data.map((row: any[], idx: number) => {
                     const r: any = { id: idx.toString() };
                     parsed.columns.forEach((col: string, i: number) => {
                         r[col] = row[i];
                     });
                     return r;
                 })
             };
             // Attach stdout as well if exists? For now, if table, show table.
             // Maybe show stdout in a separate block if we want to be fancy, but keeping it simple.
             output = { type: 'table', data: tableData };
        } else if (result !== undefined) {
             // Basic result
             output = { type: 'text', data: (stdout ? stdout + "\n" : "") + String(result) };
        } else {
             // No return value, just stdout
             output = { type: 'text', data: stdout || "✓ Executed successfully" };
        }

        setCells(prev => prev.map(c => c.id === id ? { ...c, status: 'success', output, lastRun: new Date() } : c));

    } catch (err: any) {
        console.error(err);
        setCells(prev => prev.map(c => c.id === id ? { 
            ...c, 
            status: 'error', 
            output: { type: 'error', data: String(err) } 
        } : c));
    }
  };

  const handleAddCell = (type: 'code' | 'markdown', afterId?: string) => {
    const newCell: NotebookCell = {
      id: Date.now().toString(),
      type,
      content: '',
      status: 'idle'
    };

    if (afterId) {
      const idx = cells.findIndex(c => c.id === afterId);
      const newCells = [...cells];
      newCells.splice(idx + 1, 0, newCell);
      setCells(newCells);
    } else {
      setCells([...cells, newCell]);
    }
    setActiveCellId(newCell.id);
  };

  const handleDeleteCell = (id: string) => {
    setCells(cells.filter(c => c.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  // --- Components ---

  const EnvBadge = ({ env }: { env: Environment }) => {
    const configs: Record<Environment, any> = {
      python: { icon: Terminal, label: 'Python 3.11', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
      r: { icon: FileText, label: 'R 4.2', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
      sql: { icon: Database, label: 'SQL (AlaSQL)', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400' },
      'python-lite': { icon: Zap, label: 'Python Lite', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400' },
    };
    const cfg = configs[env] || configs.python;
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border border-transparent ${cfg.color}`}>
        <cfg.icon size={12} />
        {cfg.label}
      </div>
    );
  };

  const ComputeBadge = ({ comp }: { comp: Compute }) => {
    const configs: Record<Compute, any> = {
      'cpu-std': { icon: Cpu, label: 'Std (2 vCPU)', color: 'text-gray-600 bg-gray-100 dark:bg-[#333] dark:text-gray-300' },
      'cpu-pro': { icon: Cpu, label: 'Pro (8 vCPU)', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' },
      'gpu-t4': { icon: Zap, label: 'GPU (NVIDIA T4)', color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' },
      'tpu-v5': { icon: Zap, label: 'TPU v5', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
    };
    const cfg = configs[comp] || configs['cpu-std'];
    return (
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border border-transparent ${cfg.color}`}>
        <cfg.icon size={12} />
        {cfg.label}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] overflow-hidden animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-[#333] bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-sm z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#333] transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          <div className="h-8 w-px bg-gray-200 dark:bg-[#333]"></div>
          
          <div>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base font-semibold text-gray-900 dark:text-white bg-transparent outline-none placeholder-gray-400"
              placeholder="Untitled Notebook"
            />
            <div className="flex items-center gap-2 mt-0.5">
               <span className={`text-[10px] uppercase font-bold flex items-center gap-1 ${isKernelReady ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${isKernelReady ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                 {isKernelReady ? 'Kernel Ready' : kernelStatus}
               </span>
               <span className="text-[10px] text-gray-400">• Last run: Just now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Environment Selector Display */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-[#252525] p-1 rounded-lg border border-gray-200 dark:border-[#333]">
             <EnvBadge env={environment} />
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-[#333]"></div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-lg text-xs font-medium transition-colors">
               <ComputeBadge comp={compute} />
            </div>
          </div>
          
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
             {isSaving ? <RotateCw size={14} className="animate-spin" /> : <Save size={14} />}
             <span>{isSaving ? 'Saving' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* Editor Canvas */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1e1e1e] p-4 md:p-8 scroll-smooth">
        <div className="max-w-4xl mx-auto pb-32">
          
          {cells.map((cell, index) => (
            <div 
                key={cell.id} 
                className="group relative mb-6"
                onClick={() => setActiveCellId(cell.id)}
            >
                {/* Cell Gutter Actions (Left) */}
                <div className="absolute -left-12 top-0 bottom-0 w-10 flex flex-col items-center pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cell.type === 'code' && (
                        <button 
                           onClick={() => handleRunCell(cell.id)}
                           className={`p-2 rounded-lg bg-gray-100 dark:bg-[#333] hover:bg-green-500 hover:text-white transition-all mb-2 ${cell.status === 'running' ? 'text-green-600' : 'text-gray-400'}`}
                        >
                           {cell.status === 'running' ? <RotateCw size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                        </button>
                    )}
                    <button 
                        className="p-1.5 text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical size={14} />
                    </button>
                </div>

                {/* Main Cell Content */}
                <div className={`
                    relative rounded-xl border transition-all duration-200
                    ${activeCellId === cell.id 
                        ? 'border-blue-500 ring-4 ring-blue-500/5 bg-white dark:bg-[#252525] shadow-sm' 
                        : 'border-transparent hover:border-gray-200 dark:hover:border-[#333] bg-transparent'
                    }
                `}>
                    
                    {/* Input Area */}
                    {cell.type === 'code' ? (
                        <div className="bg-[#f5f5f7] dark:bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-200 dark:border-[#333]">
                           <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#2a2a2a]">
                               <span className="text-[10px] font-mono text-gray-400">In [{index + 1}]:</span>
                               <div className="flex items-center gap-2">
                                   <button onClick={() => handleDeleteCell(cell.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                               </div>
                           </div>
                           <div className="p-4 relative">
                               <textarea
                                  className="w-full bg-transparent outline-none font-mono text-sm text-gray-800 dark:text-gray-200 resize-none"
                                  value={cell.content}
                                  onChange={(e) => {
                                      setCells(cells.map(c => c.id === cell.id ? { ...c, content: e.target.value } : c));
                                      adjustHeight(e.target);
                                  }}
                                  onFocus={(e) => adjustHeight(e.target)}
                                  spellCheck={false}
                                  rows={Math.max(2, cell.content.split('\n').length)}
                               />
                           </div>
                        </div>
                    ) : (
                        // Markdown Cell
                        <div 
                            className="p-2 min-h-[40px]"
                            onDoubleClick={() => setActiveCellId(cell.id)}
                        >
                            {activeCellId === cell.id ? (
                                <textarea
                                    autoFocus
                                    className="w-full bg-transparent outline-none font-sans text-base text-gray-900 dark:text-white resize-none"
                                    value={cell.content}
                                    onChange={(e) => {
                                        setCells(cells.map(c => c.id === cell.id ? { ...c, content: e.target.value } : c));
                                        adjustHeight(e.target);
                                    }}
                                    onBlur={() => setActiveCellId(null)}
                                    rows={Math.max(1, cell.content.split('\n').length)}
                                    placeholder="Type markdown..."
                                />
                            ) : (
                                <div className="prose dark:prose-invert max-w-none">
                                    <MarkdownRenderer content={cell.content || 'Start typing...'} />
                                </div>
                            )}
                            {/* Action Menu for Markdown */}
                            {activeCellId === cell.id && (
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <button onClick={() => handleDeleteCell(cell.id)} className="p-1.5 bg-gray-100 dark:bg-[#333] rounded-md text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Output Area */}
                    {cell.type === 'code' && cell.output && (
                        <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-200">
                             <div className="flex items-center gap-2 mb-2 px-1">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Out [{index + 1}]:</span>
                                {cell.status === 'success' && <Check size={10} className="text-green-500" />}
                                {cell.status === 'error' && <AlertCircle size={10} className="text-red-500" />}
                             </div>
                             
                             {cell.output.type === 'error' && (
                                 <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30 overflow-x-auto text-red-600 dark:text-red-400 font-mono text-xs">
                                     <pre>{cell.output.data as string}</pre>
                                 </div>
                             )}

                             {cell.output.type === 'text' && (
                                 <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-[#333] overflow-x-auto text-gray-700 dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">
                                     {cell.output.data as string}
                                 </div>
                             )}

                             {cell.output.type === 'table' && (
                                 <div className="bg-white dark:bg-[#111] rounded-xl border border-gray-200 dark:border-[#333] overflow-hidden shadow-sm">
                                    {cell.output.visualHint && (
                                        <div className="p-4 border-b border-gray-200 dark:border-[#333]">
                                            <ChatChart 
                                                data={cell.output.data as TableData} 
                                                type={cell.output.visualHint} 
                                            />
                                        </div>
                                    )}
                                    <div className="p-2">
                                        <EmbeddedTable 
                                            data={cell.output.data as TableData} 
                                            fileName="Result"
                                            visualHint={cell.output.visualHint}
                                            onExpand={() => {}} 
                                        />
                                    </div>
                                 </div>
                             )}
                        </div>
                    )}
                </div>

                {/* Add Cell Gutter (Bottom) */}
                <div className="h-4 group/add flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="h-px bg-gray-200 dark:bg-[#333] w-full relative">
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                             <button onClick={() => handleAddCell('code', cell.id)} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-[#333] border border-gray-200 dark:border-[#444] text-[10px] font-bold uppercase tracking-wide text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-all shadow-sm transform hover:scale-105">
                                 <Plus size={10} /> Code
                             </button>
                             <button onClick={() => handleAddCell('markdown', cell.id)} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-[#333] border border-gray-200 dark:border-[#444] text-[10px] font-bold uppercase tracking-wide text-gray-500 hover:text-purple-500 hover:border-purple-500 transition-all shadow-sm transform hover:scale-105">
                                 <Plus size={10} /> Text
                             </button>
                        </div>
                    </div>
                </div>
            </div>
          ))}

          {/* Empty State / Bottom Add */}
          {cells.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 dark:border-[#333] rounded-3xl">
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-[#252525] rounded-full">
                      <Terminal size={24} className="opacity-50" />
                  </div>
                  <p className="mb-6 font-medium">Notebook is empty</p>
                  <div className="flex gap-3">
                      <button onClick={() => handleAddCell('code')} className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium text-sm hover:opacity-90 transition-all">
                          <Plus size={16} /> Add Code Block
                      </button>
                      <button onClick={() => handleAddCell('markdown')} className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#333] text-gray-700 dark:text-white border border-gray-200 dark:border-[#444] rounded-full font-medium text-sm hover:bg-gray-50 transition-all">
                          <FileText size={16} /> Add Text
                      </button>
                  </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};