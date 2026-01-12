
import React, { useState, useRef, useEffect } from 'react';
import { X, Database, Zap, Check, ArrowRight, ChevronDown, Star, Cpu, AlertCircle } from 'lucide-react';
import { Environment, Compute, Notebook } from '../types';

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (notebook: Notebook) => void;
}

export const CreateNotebookModal: React.FC<CreateNotebookModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [env, setEnv] = useState<Environment>('python-lite');
  const [compute, setCompute] = useState<Compute>('cpu-std');
  const [isMachinesOpen, setIsMachinesOpen] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const machinesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (machinesDropdownRef.current && !machinesDropdownRef.current.contains(event.target as Node)) {
        setIsMachinesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const newNotebook: Notebook = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description || 'No description provided.',
      author: 'You',
      date: 'Just now',
      category: 'Draft',
      // Gradient is handled dynamically by the parent component for variety
      gradient: '', 
      icon: Database, // Default icon
      environment: env,
      compute: compute,
      cells: []
    };
    onCreate(newNotebook);
    
    // Reset form
    setTitle('');
    setDescription('');
    setEnv('python-lite');
    setCompute('cpu-std');
    setTitleError(false);
  };

  const environments = [
    { 
      id: 'python', 
      label: 'Python 3.11', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 
      desc: 'Data Science & ML' 
    },
    { 
      id: 'r', 
      label: 'R 4.2', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg', 
      desc: 'Statistical Analysis' 
    },
    { 
      id: 'sql', 
      label: 'SQL', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      desc: 'Data Extraction' 
    },
    { 
      id: 'python-lite', 
      label: 'Python Lite', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 
      desc: 'Fast Scripts' 
    },
  ];

  const machines = [
    { 
      id: 'cpu-std', 
      label: 'CPU (Default)', 
      specs: '2 vCPU, 8 GB RAM', 
      price: 'Free', 
      desc: 'Best for quick exploration', 
      pro: false 
    },
    { 
      id: 'cpu-pro', 
      label: 'CPU Pro', 
      specs: '8 vCPU, 32 GB RAM', 
      price: '$0.12/h', 
      desc: 'Data processing & mid-size models', 
      pro: true 
    },
    { 
      id: 'gpu-t4', 
      label: 'GPU T4', 
      specs: '4 vCPU, 16 GB GPU', 
      price: '$0.65/h', 
      desc: 'Deep learning & image processing', 
      pro: true 
    },
    { 
      id: 'tpu-v5', 
      label: 'TPU v5', 
      specs: 'v5e-8 chip', 
      price: '$1.20/h', 
      desc: 'Large scale training & inference', 
      pro: true 
    },
  ];

  const selectedMachine = machines.find(m => m.id === compute) || machines[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#1f1f1f] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-[#333] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2f2f2f]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">New Notebook</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] dark:text-gray-400 rounded-full transition-colors focus:outline-none focus:ring-0"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content - Hidden Scrollbar */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
          <div className="space-y-8">
            
            {/* Title & Desc */}
            <div className="space-y-6">
               <div className="group">
                  <div className="flex justify-between items-baseline">
                    <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors ${titleError ? 'text-red-500' : 'text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white'}`}>
                        Name <span className="text-red-500">*</span>
                    </label>
                    {titleError && <span className="text-[10px] font-medium text-red-500 animate-in fade-in">Required</span>}
                  </div>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        if (e.target.value.trim()) setTitleError(false);
                    }}
                    placeholder="e.g. Q3 Sales Analysis"
                    className={`
                        w-full text-xl font-medium bg-transparent border-b py-2 focus:outline-none focus:ring-0 transition-colors 
                        text-gray-900 dark:text-white
                        ${titleError 
                            ? 'border-red-500 placeholder-red-300 dark:placeholder-red-900/50' 
                            : 'border-gray-200 dark:border-[#333] focus:border-gray-400 dark:focus:border-gray-500 placeholder-gray-300 dark:placeholder-gray-600'
                        }
                    `}
                    autoFocus
                  />
               </div>
               <div className="group">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">Description <span className="normal-case opacity-50 font-medium tracking-normal text-gray-300 dark:text-gray-600">(Optional)</span></label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe the analysis..."
                    className="w-full bg-transparent border-b border-gray-200 dark:border-[#333] py-2 focus:border-gray-400 dark:focus:border-gray-500 focus:outline-none focus:ring-0 transition-colors resize-none text-sm text-gray-600 dark:text-gray-300 h-16 placeholder-gray-300 dark:placeholder-gray-600 leading-relaxed"
                  />
               </div>
            </div>

            {/* Environment Selection */}
            <div>
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Runtime Environment</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {environments.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setEnv(e.id as Environment)}
                      className={`
                        flex items-center gap-4 p-3 rounded-xl border text-left transition-all duration-200 group focus:outline-none focus:ring-0
                        ${env === e.id 
                            ? 'border-transparent bg-gray-100 dark:bg-[#2a2a2a] shadow-inner' 
                            : 'border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444] hover:bg-gray-50 dark:hover:bg-[#252525]'
                        }
                      `}
                    >
                       <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                          {e.logo ? (
                            <img src={e.logo} alt={e.label} className="w-8 h-8 object-contain" />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{e.label}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{e.desc}</div>
                       </div>
                       {env === e.id && (
                         <div className="text-black dark:text-white animate-in zoom-in spin-in-12 duration-300">
                            <Check size={16} strokeWidth={2.5} />
                         </div>
                       )}
                    </button>
                  ))}
               </div>
            </div>

            {/* Machines Selection (Dropdown) */}
            <div className="relative" ref={machinesDropdownRef}>
               <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Machines</label>
               
               <button
                 onClick={() => setIsMachinesOpen(!isMachinesOpen)}
                 className={`
                    w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left focus:outline-none focus:ring-0
                    ${isMachinesOpen 
                        ? 'border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-[#252525]' 
                        : 'border-gray-200 dark:border-[#333] bg-transparent hover:bg-gray-50 dark:hover:bg-[#252525]'
                    }
                 `}
               >
                  <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-lg ${selectedMachine.pro ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-gray-100 dark:bg-[#333] text-gray-600 dark:text-gray-400'}`}>
                          {selectedMachine.id.startsWith('gpu') || selectedMachine.id.startsWith('tpu') ? <Zap size={18} /> : <Cpu size={18} />}
                      </div>
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedMachine.label}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedMachine.price === 'Free' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-[#333] dark:text-gray-300'}`}>
                                  {selectedMachine.price}
                              </span>
                              {selectedMachine.pro && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedMachine.specs} <span className="mx-1.5 opacity-50">|</span> {selectedMachine.desc}
                          </div>
                      </div>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isMachinesOpen ? 'rotate-180' : ''}`} />
               </button>

               {/* Dropdown List */}
               {isMachinesOpen && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                       {machines.map((m) => (
                           <div 
                                key={m.id}
                                onClick={() => { setCompute(m.id as Compute); setIsMachinesOpen(false); }}
                                className={`
                                    p-3 px-4 flex items-center justify-between cursor-pointer border-b border-gray-100 dark:border-[#2f2f2f] last:border-0 hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors
                                    ${compute === m.id ? 'bg-gray-50 dark:bg-[#252525]' : ''}
                                `}
                           >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{m.label}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${m.price === 'Free' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-[#333] dark:text-gray-400'}`}>
                                            {m.price}
                                        </span>
                                        {m.pro && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-mono text-[10px] uppercase tracking-wide opacity-80">{m.specs}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[#444]"></span>
                                        <span className="truncate">{m.desc}</span>
                                    </div>
                                </div>
                                {compute === m.id && <Check size={16} className="text-black dark:text-white" />}
                           </div>
                       ))}
                   </div>
               )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2f2f2f] bg-gray-50/50 dark:bg-[#1a1a1a] flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors focus:outline-none focus:ring-0"
           >
             Cancel
           </button>
           <button 
             onClick={handleSubmit}
             className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white dark:text-black bg-black dark:bg-white hover:opacity-90 transition-all shadow-lg active:scale-95 focus:outline-none focus:ring-0"
           >
             <span>Create Notebook</span>
             <ArrowRight size={16} strokeWidth={2} />
           </button>
        </div>
      </div>
    </div>
  );
};
