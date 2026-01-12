
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Maximize2, BarChart3 } from 'lucide-react';
import { TableData } from '../../types/chat';
import { COLOR_THEMES } from '../table/types';

interface ChatChartProps {
  data: TableData;
  type: 'bar' | 'line' | 'pie' | 'area' | string;
  onExpand?: () => void;
}

export const ChatChart: React.FC<ChatChartProps> = ({ data, type, onExpand }) => {
  const { headers, rows } = data;

  const chartInfo = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    
    const firstRow = rows[0];
    const labelKey = headers.find(h => typeof firstRow[h] === 'string') || headers[0];
    const valueKeys = headers.filter(h => typeof firstRow[h] === 'number' && h !== labelKey);
    const finalValueKeys = valueKeys.length > 0 ? valueKeys : headers.filter(h => h !== labelKey).slice(0, 1);
    
    return { labelKey, valueKeys: finalValueKeys };
  }, [headers, rows]);

  if (!chartInfo || rows.length === 0) return null;

  const colors = COLOR_THEMES['blue'];
  const monoFont = { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 500 };

  return (
    <div className="w-full my-6 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-200 dark:border-[#333] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Chart Header - Standardized to match CodeBlock */}
      <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#262626] border-b border-gray-200 dark:border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-2">
                  {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />)}
              </div>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 lowercase">visual_insight</span>
          </div>
          <button 
            onClick={onExpand}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <Maximize2 size={14} />
            <span>Expand</span>
          </button>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 p-6">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={rows}
                dataKey={chartInfo.valueKeys[0]}
                nameKey={chartInfo.labelKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                paddingAngle={4}
                stroke="none"
              >
                {rows.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }} />
            </PieChart>
          ) : type === 'line' ? (
            <LineChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey={chartInfo.labelKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ ...monoFont, fill: '#999' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ ...monoFont, fill: '#999' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
              />
              {chartInfo.valueKeys.map((key, i) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[i % colors.length]} 
                  strokeWidth={3} 
                  dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} 
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={rows} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey={chartInfo.labelKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ ...monoFont, fill: '#999' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ ...monoFont, fill: '#999' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'JetBrains Mono', fontSize: '11px' }}
              />
              {chartInfo.valueKeys.map((key, i) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={colors[i % colors.length]} 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
