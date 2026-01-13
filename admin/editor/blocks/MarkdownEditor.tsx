import React, { useState } from 'react';
import { IMarkdownField } from '@/lib/page.types';
import { Eye, Edit2 } from 'lucide-react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface MarkdownEditorProps {
  block: IMarkdownField;
  onChange: (updates: Partial<IMarkdownField>) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ block, onChange }) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="text-[10px] flex items-center gap-1 text-blue-600 font-bold uppercase tracking-wider cursor-pointer"
        >
          {isPreview ? <><Edit2 size={10} /> Edit</> : <><Eye size={10} /> Preview</>}
        </button>
      </div>
      {isPreview ? (
        <div className="p-3 border rounded-md bg-slate-50 dark:bg-slate-800 min-h-[100px]">
          <MarkdownRenderer
            content={block.value || '*No content provided*'}
            size="sm"
            textColor="text-slate-800 dark:text-slate-200"
            headingColor="text-slate-900 dark:text-white"
            backgroundColor="bg-slate-50 dark:bg-slate-800"
          />
        </div>
      ) : (
        <textarea
          className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-inner"
          value={block.value || ''}
          onChange={(e) => onChange({ value: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Enter markdown formatted text..."
        />
      )}
    </div>
  );
};