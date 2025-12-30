import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Section, ContentBlock, BlockType } from '@/admin/types';
import { ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

interface PreviewSectionProps {
  section: Section;
}

const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case BlockType.MARKDOWN:
      return (
        <div className="prose prose-sm prose-slate max-w-none text-slate-800 dark:text-slate-200 mb-4 prose-headings:dark:text-slate-100 prose-strong:dark:text-white">
          <ReactMarkdown>{block.value || ''}</ReactMarkdown>
        </div>
      );

    case BlockType.KEY_VALUE:
    case BlockType.DATES:
      return (
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-2 last:mb-4">
          <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {block.type === BlockType.DATES && <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            {block.key}
          </span>
          <span className="text-slate-700 dark:text-slate-300 text-right font-medium">{block.value}</span>
        </div>
      );

    case BlockType.LINKS:
      return (
        <a
          href={block.value}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all group mb-3 last:mb-4 shadow-sm"
        >
          <span className="font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight text-sm">{block.key}</span>
          <span className="flex items-center text-blue-700 dark:text-blue-400 text-xs font-bold group-hover:underline uppercase tracking-widest">
            Visit Link <ExternalLink className="ml-2 w-4 h-4" />
          </span>
        </a>
      );

    case BlockType.TABLE:
      const tableData = block.tableData || { columns: [], rows: [] };
      if (tableData.columns.length === 0) return null;
      return (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl mb-6 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-900 dark:text-slate-100 uppercase bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {tableData.columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 font-black tracking-widest">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tableData.rows.map((row, rIdx) => (
                <tr key={rIdx} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  {tableData.columns.map((col, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-slate-800 dark:text-slate-300 font-medium">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
};

export const PreviewSection: React.FC<PreviewSectionProps> = ({ section }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-8 transition-all hover:shadow-md">
      <div className="bg-slate-50 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3 tracking-tighter">
          <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          {section.title}
        </h3>
      </div>
      <div className="p-6 lg:p-8">
        {section.children.map(child => {
          if (child.type === 'SUB_SECTION') {
            return (
              <div key={child.id} className="mb-10 last:mb-0">
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-6 border-l-4 border-blue-600 dark:border-blue-400 pl-4 uppercase tracking-tight">
                  {child.title}
                </h4>
                <div className="space-y-1">
                  {child.children.map(block => <BlockRenderer key={block.id} block={block} />)}
                </div>
              </div>
            )
          } else {
            return <BlockRenderer key={child.id} block={child as ContentBlock} />
          }
        })}
      </div>
    </div>
  );
};