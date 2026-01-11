import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, X, Columns } from 'lucide-react';
import { ITableData, ITableField } from '@/lib/page.types';

interface TableEditorProps {
  block: ITableField;
  onChange: (updates: Partial<ITableField>) => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({ block, onChange }) => {
  const data: ITableData = block.tableData || { columns: [], rows: [] };
  const [newColName, setNewColName] = useState('');

  const addColumn = () => {
    const name = newColName.trim();
    if (!name) return;

    if (data.columns.some(c => c.toLowerCase() === name.toLowerCase())) {
      alert("Column name must be unique");
      return;
    }

    // Add new column to columns list and initialize it in all rows
    const updatedRows = data.rows.map(row => ({ ...row, [name]: '' }));

    onChange({
      tableData: {
        columns: [...data.columns, name],
        rows: updatedRows
      }
    });
    setNewColName('');
  };

  const removeColumn = (colName: string) => {
    // Filter out the column
    const newColumns = data.columns.filter(c => c !== colName);

    // Remove the data key from all rows
    const newRows = data.rows.map(row => {
      const newRow = { ...row };
      delete newRow[colName];
      return newRow;
    });

    onChange({
      tableData: {
        columns: newColumns,
        rows: newRows
      }
    });
  };

  const addRow = () => {
    const newRow = data.columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    onChange({
      tableData: { ...data, rows: [...data.rows, newRow] }
    });
  };

  const updateCell = (rIdx: number, col: string, val: string) => {
    const newRows = [...data.rows];
    newRows[rIdx] = { ...newRows[rIdx], [col]: val };
    onChange({ tableData: { ...data, rows: newRows } });
  };

  const removeRow = (idx: number) => {
    onChange({ tableData: { ...data, rows: data.rows.filter((_, i) => i !== idx) } });
  };

  return (
    <div className="space-y-4">
      {/* Column Management Header */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Columns size={14} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Manage Columns</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {data.columns.map(col => (
            <div key={col} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full shadow-sm text-xs font-medium text-slate-700 dark:text-slate-200">
              {col}
              <button
                type="button"
                onClick={() => removeColumn(col)}
                className="p-0.5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-600 dark:hover:bg-red-900/30 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                title={`Delete ${col} column`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {data.columns.length === 0 && <span className="text-xs text-slate-400 italic">No columns defined</span>}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 h-8 px-3 rounded text-sm border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Enter column name..."
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addColumn();
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
          />
          <Button type="button" size="sm" variant="secondary" onClick={addColumn} disabled={!newColName.trim()}>
            Add
          </Button>
        </div>
      </div>

      {/* Table Data Editor */}
      {data.columns.length > 0 && (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm bg-white dark:bg-slate-900">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {data.columns.map(c => (
                  <th key={c} className="p-3 text-left text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider min-w-[150px]">
                    {c}
                  </th>
                ))}
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.rows.map((row, rIdx) => (
                <tr key={rIdx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {data.columns.map(col => (
                    <td key={col} className="p-1.5">
                      <input
                        className="w-full p-2 rounded border border-transparent hover:border-slate-200 focus:border-blue-500 bg-transparent dark:hover:border-slate-700 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        value={row[col] ?? ''}
                        onChange={(e) => updateCell(rIdx, col, e.target.value)}
                        onMouseDown={(e) => e.stopPropagation()}
                        placeholder="..."
                      />
                    </td>
                  ))}
                  <td className="p-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(rIdx)}
                      className="p-1.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 dark:text-slate-600 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                      title="Remove row"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={data.columns.length + 1} className="p-8 text-center text-slate-400 dark:text-slate-500 italic">
                    <div className="flex flex-col items-center gap-2">
                      <span>Table is empty</span>
                      <Button type="button" size="sm" variant="outline" onClick={addRow}>Add First Row</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data.rows.length > 0 && (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={addRow}
          className="w-full border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Plus size={12} className="mr-1.5" /> Add Row
        </Button>
      )}
    </div>
  );
};