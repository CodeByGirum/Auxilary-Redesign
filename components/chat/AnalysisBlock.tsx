
import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { EmbeddedTable } from './EmbeddedTable';
import { ChatChart } from './ChatChart';
import { TableData } from '../../types/chat';

interface AnalysisBlockProps {
  code: string;
  result?: {
    type: 'table' | 'text' | 'error';
    data: TableData | string;
    visualHint?: string;
  };
  onExpandTable?: (data: TableData, title: string, visualHint?: string) => void;
}

// Mini-component for Single Value Results
const StatResult = ({ label, value }: { label: string, value: any }) => (
  <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm inline-flex flex-col min-w-[160px] animate-in fade-in duration-300">
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</span>
    <div className="flex items-center gap-2">
       <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{value}</span>
       {typeof value === 'number' && (
         <div className="p-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <TrendingUp size={12} />
         </div>
       )}
    </div>
  </div>
);

export const AnalysisBlock: React.FC<AnalysisBlockProps> = ({ code, result, onExpandTable }) => {
  return (
    <div className="my-6 animate-in fade-in duration-300">
      {/* 1. The Code Artifact */}
      <CodeBlock language="sql" code={code} />

      {/* 2. The Result Artifacts */}
      {result && (
        <div className="mt-4 flex flex-col gap-4 items-start">
           {result.type === 'error' && (
             <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-800 flex gap-2 items-start font-mono shadow-sm w-full">
                 <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                 {result.data as string}
             </div>
           )}

           {result.type === 'text' && (
             <div className="rounded-xl border border-gray-200 dark:border-[#333] overflow-hidden bg-white dark:bg-[#1e1e1e] shadow-sm w-full">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525]">
                   <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Output</span>
                </div>
                <pre className="font-mono text-xs text-gray-800 dark:text-gray-300 whitespace-pre-wrap p-4">
                   {result.data as string}
                </pre>
             </div>
           )}
           
           {result.type === 'table' && (
             <>
               {/* A. Chart Visualization (If applicable) */}
               {result.visualHint ? (
                 <ChatChart 
                   data={result.data as TableData} 
                   type={result.visualHint} 
                   onExpand={() => onExpandTable && onExpandTable(result.data as TableData, "Analysis Result", result.visualHint)}
                 />
               ) : (
                 /* B. Scalar / Stat Check */
                 (() => {
                    const tableData = result.data as TableData;
                    const isScalar = tableData.rows.length === 1 && tableData.headers.length === 1;
                    
                    if (isScalar) {
                        const header = tableData.headers[0];
                        const val = tableData.rows[0][header];
                        return <StatResult label={header} value={val} />;
                    }
                    
                    // C. Standard Table (Only if not scalar and no chart)
                    return (
                        <EmbeddedTable 
                            data={tableData} 
                            fileName="Analysis Result" 
                            visualHint={result.visualHint}
                            onExpand={() => onExpandTable && onExpandTable(tableData, "Analysis Result", result.visualHint)} 
                        />
                    );
                 })()
               )}
             </>
           )}
        </div>
      )}
    </div>
  );
};
