import React, { useState } from 'react';
import { IFieldWithoutSubSection } from '@/lib/page.types';
import { GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface BlockWrapperProps {
  block: IFieldWithoutSubSection;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  block, isFirst, isLast, children, onDelete, onMoveUp, onMoveDown, onDragStart, onDragOver, onDrop
}) => {
  const [canDrag, setCanDrag] = useState(false);

  return (
    <div
      className="group bg-white border border-slate-200 rounded-md transition-all hover:border-blue-300 hover:shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-900"
      draggable={canDrag}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between p-1.5 bg-slate-50 border-b border-slate-100 select-none dark:bg-slate-800/80 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 p-1 dark:text-slate-500 dark:hover:text-slate-400"
            onMouseEnter={() => setCanDrag(true)}
            onMouseLeave={() => setCanDrag(false)}
          >
            <GripVertical size={14} />
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-1.5 py-0.5 rounded border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-500">
            {block.type.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={onMoveUp} disabled={isFirst} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 dark:text-slate-500 dark:hover:text-blue-400"><ArrowUp size={12} /></button>
          <button type="button" onClick={onMoveDown} disabled={isLast} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-20 dark:text-slate-500 dark:hover:text-blue-400"><ArrowDown size={12} /></button>
          <button type="button" onClick={onDelete} className="p-1 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"><Trash2 size={12} /></button>
        </div>
      </div>
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};