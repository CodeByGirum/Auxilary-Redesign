
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TableData } from '../../types/chat';
import { Grid, Settings2, PieChart, Sparkles, Table as TableIcon, X, Check } from 'lucide-react';
import { DataGridView } from './views/DataGridView';
import { PivotView } from './views/PivotView';
import { VisualsView } from './views/VisualsView';
import { NotebookView } from './views/NotebookView';
import { PivotConfig } from '../../utils/tableUtils';
import { NotebookReport } from '../types';

interface TableDrawerProps {
  isOpen: boolean;
  data: TableData | null;
  fileName: string;
  visualHint?: string;
  onClose: () => void;
  onSave: (newData: TableData) => void;
  mode?: 'fixed' | 'inline';
}

export const TableDrawer: React.FC<TableDrawerProps> = ({
  isOpen,
  data,
  fileName,
  visualHint,
  onClose,
  onSave,
  mode = 'fixed',
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'pivot' | 'visuals' | 'analysis'>('data');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Data State
  const [rows, setRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  
  // View States
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [pivotConfig, setPivotConfig] = useState<PivotConfig>({
    rows: [], columns: [], values: [], aggregation: 'sum'
  });
  const [visualsConfig, setVisualsConfig] = useState<{ chartType: 'bar' | 'pie' | 'line', themeColor: string }>({
    chartType: 'bar', themeColor: 'blue'
  });
  const [notebookReport, setNotebookReport] = useState<NotebookReport | null>(null);

  const saveTimerRef = useRef<any>(null);
  const lastUpdateRef = useRef<string>('');

  // Initialize once or when forced externally
  useEffect(() => {
    if (data) {
      const dataHash = JSON.stringify({ h: data.headers, rCount: data.rows.length });
      // Only reset if it's a completely different dataset, not a silent autosave update from parent
      if (lastUpdateRef.current !== dataHash) {
        setRows(data.rows);
        setHeaders(data.headers);
        lastUpdateRef.current = dataHash;
      }

      if (data.metadata) {
         if (data.metadata.filters) setFilters(data.metadata.filters);
         if (data.metadata.sortConfig) setSortConfig(data.metadata.sortConfig);
         if (data.metadata.pivotConfig) setPivotConfig(data.metadata.pivotConfig);
         if (data.metadata.visualsConfig) setVisualsConfig(data.metadata.visualsConfig);
         if (data.metadata.notebookReport) setNotebookReport(data.metadata.notebookReport);
      }
      if (visualHint && ['bar', 'pie', 'line'].includes(visualHint)) {
          setActiveTab('visuals');
          setVisualsConfig(prev => ({ ...prev, chartType: visualHint as any }));
      }
    }
  }, [data, visualHint]);

  // Persist logic - Silent background save
  const persistState = useCallback(() => {
      const metadata = {
          pivotConfig,
          visualsConfig,
          notebookReport,
          filters,
          sortConfig
      };
      onSave({ headers, rows, metadata });
      setLastSaved(new Date());
  }, [headers, rows, pivotConfig, visualsConfig, notebookReport, filters, sortConfig, onSave]);

  // 3-second Autosave Effect - Truly in the background
  useEffect(() => {
    if (!isOpen) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    
    saveTimerRef.current = setTimeout(() => {
        persistState();
    }, 3000);

    return () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [rows, pivotConfig, visualsConfig, filters, sortConfig, isOpen, persistState]);

  const handleRowUpdate = useCallback((id: string, updates: Record<string, any>) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const handleAddRow = useCallback(() => {
    const newRow: any = { id: `row-${Date.now()}` };
    headers.forEach(h => newRow[h] = '');
    setRows(prev => [...prev, newRow]);
  }, [headers]);

  const handleDeleteRow = useCallback((id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  }, []);

  const processedRows = useMemo(() => {
    let res = [...rows];
    Object.keys(filters).forEach((key) => {
      const val = filters[key].toLowerCase();
      if (val) res = res.filter((r) => r[key]?.toString().toLowerCase().includes(val));
    });
    if (sortConfig) {
      res.sort((a, b) => {
        const av = a[sortConfig.key];
        const bv = b[sortConfig.key];
        if (av < bv) return sortConfig.dir === 'asc' ? -1 : 1;
        if (av > bv) return sortConfig.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return res;
  }, [rows, filters, sortConfig]);

  const containerClasses = mode === 'inline'
    ? 'w-full h-full flex flex-col bg-white dark:bg-[#1e1e1e] overflow-hidden'
    : `fixed inset-y-0 right-0 z-[60] w-[95vw] md:w-[90vw] lg:w-[1200px] bg-white dark:bg-[#1e1e1e] shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-[#333] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;

  if (mode === 'inline' && !isOpen) return null;

  return (
    <div className={containerClasses}>
      <div className="h-14 flex items-center justify-between px-6 flex-shrink-0 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#333] z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm">
            <TableIcon size={18} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white tracking-tight">{fileName}</h2>
            <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-medium uppercase tracking-widest text-gray-400">
                    {lastSaved ? `Autosaved ${lastSaved.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` : 'Live Workspace'}
                </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-xl">
          {[
            { id: 'data', label: 'Grid', icon: Grid },
            { id: 'pivot', label: 'Pivot', icon: Settings2 },
            { id: 'visuals', label: 'Chart', icon: PieChart },
            { id: 'analysis', label: 'Notebook', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wider rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon size={13} strokeWidth={2} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={persistState}
            className="flex items-center gap-2 px-5 py-1.5 bg-black dark:bg-white text-white dark:text-black text-xs font-medium rounded-full hover:opacity-80 transition-all active:scale-95 shadow-sm"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-all"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative bg-[#F5F5F7] dark:bg-[#1e1e1e]">
        {activeTab === 'data' && (
          <DataGridView
            headers={headers}
            rows={processedRows}
            onRowUpdate={handleRowUpdate}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
            filters={filters}
            setFilters={setFilters}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        )}
        {activeTab === 'pivot' && (
           <PivotView 
              headers={headers} 
              rows={processedRows} 
              config={pivotConfig}
              setConfig={setPivotConfig}
           />
        )}
        {activeTab === 'visuals' && (
          <VisualsView
            headers={headers}
            rows={processedRows}
            fileName={fileName}
            config={visualsConfig}
            setConfig={setVisualsConfig}
          />
        )}
        {activeTab === 'analysis' && (
          <NotebookView
            headers={headers}
            rows={processedRows}
            fileName={fileName}
            report={notebookReport}
            setReport={setNotebookReport}
            triggerOnMount={!notebookReport}
          />
        )}
      </div>
    </div>
  );
};
