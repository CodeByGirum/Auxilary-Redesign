
import { TableData } from '../types/chat';

export const executeSQL = async (query: string, data: TableData): Promise<{ type: 'table' | 'text' | 'error', data: TableData | string }> => {
  return new Promise((resolve) => {
    try {
      // Access alasql from window since it's loaded via CDN
      const alasql = (window as any).alasql;
      
      if (!alasql) {
        resolve({ type: 'error', data: "Analysis Engine (AlaSQL) not loaded." });
        return;
      }

      // Polyfill strftime if it doesn't exist (commonly used by models trained on SQLite)
      if (!alasql.fn.strftime) {
        alasql.fn.strftime = (format: string, dateStr: string) => {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return dateStr;
          
          return format
            .replace('%Y', date.getFullYear().toString())
            .replace('%m', (date.getMonth() + 1).toString().padStart(2, '0'))
            .replace('%d', date.getDate().toString().padStart(2, '0'))
            .replace('%H', date.getHours().toString().padStart(2, '0'))
            .replace('%M', date.getMinutes().toString().padStart(2, '0'))
            .replace('%S', date.getSeconds().toString().padStart(2, '0'))
            .replace('%j', Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000).toString().padStart(3, '0'))
            .replace('%w', date.getDay().toString());
        };
      }

      // Polyfill string_split (Fix for: alasql.fn.string_split is not a function)
      if (!alasql.fn.string_split) {
        alasql.fn.string_split = (str: string, delimiter: string) => {
          if (typeof str !== 'string') return [];
          return str.split(delimiter || ',');
        };
      }

      // Polyfill json_extract (often used by Gemini for complex data)
      if (!alasql.fn.json_extract) {
        alasql.fn.json_extract = (jsonStr: string, path: string) => {
          try {
            const obj = JSON.parse(jsonStr);
            // Very simple path handler: $.key
            const key = path.replace('$.', '');
            return obj[key];
          } catch {
            return null;
          }
        };
      }

      if (!data || !data.rows) {
        resolve({ type: 'error', data: "No active dataset found for analysis." });
        return;
      }

      // Pre-check for forbidden/unsupported commands
      if (query.trim().toLowerCase().startsWith('pragma')) {
         resolve({ 
            type: 'text', 
            data: "Schema inspection via PRAGMA is not supported. Please refer to the table context provided above for column names." 
         });
         return;
      }

      // Clean the query: Remove quotes around 'data' table name to prevent param substitution failure
      const cleanQuery = query.replace(/"data"/gi, 'data').replace(/'data'/gi, 'data');

      // Replace 'data' keyword with AlaSQL parameter placeholder '?'
      const executableSql = cleanQuery.replace(/\bdata\b/gi, '?');

      // Count parameters needed (occurrences of ?)
      const paramCount = (executableSql.match(/\?/g) || []).length;
      
      // Pass the rows as the parameter for every occurrence of ?
      const params = paramCount > 0 ? Array(paramCount).fill(data.rows) : [];

      // Create a safe execution environment
      const result = alasql(executableSql, params);

      if (Array.isArray(result) && result.length > 0) {
        // If result is an array of objects, format as TableData
        if (typeof result[0] === 'object' && result[0] !== null) {
           const headers = Object.keys(result[0]);
           const rows = result.map((r: any, i: number) => ({ ...r, id: `res-${i}` }));
           resolve({ 
             type: 'table', 
             data: { headers, rows } 
           });
        } else {
           // Array of primitives?
           resolve({ type: 'text', data: JSON.stringify(result, null, 2) });
        }
      } else if (Array.isArray(result) && result.length === 0) {
        resolve({ type: 'text', data: "No results found." });
      } else {
         // Scalar result or other
         resolve({ type: 'text', data: String(result) });
      }

    } catch (e: any) {
      console.error("SQL Execution Error:", e);
      let msg = e.message || "Execution failed";
      if (msg.includes("Parse error")) {
          msg = `Syntax Error: ${msg}. Please ensure keywords are spaced correctly and aliases use snake_case (e.g., AS total_sales).`;
      }
      resolve({ type: 'error', data: msg });
    }
  });
};
