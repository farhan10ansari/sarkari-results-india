import React, { useState } from 'react';
import { Section, SubSection, BlockType } from '@/admin/types';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, ChevronDown, ChevronRight, ArrowUp, ArrowDown, LayoutPanelTop } from 'lucide-react';
import { BlockEditor } from '@/admin/editor/BlockEditor';
import { useJobStore } from '@/admin/useJobStore';

interface DynamicEditorProps {
  section: Section;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const DynamicEditor: React.FC<DynamicEditorProps> = ({
  section,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const {
    updateSection, deleteSection, addSubSection,
    updateSubSection, addBlock, moveChild, reorderChildren, deleteChild
  } = useJobStore();

  const [isExpanded, setIsExpanded] = useState(true);
  const [canDragSection, setCanDragSection] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [draggedParentId, setDraggedParentId] = useState<string | null>(null);
  const [canDragSub, setCanDragSub] = useState<Record<string, boolean>>({});

  const handleBlockDragStart = (e: React.DragEvent, id: string, parentId: string | 'root') => {
    e.stopPropagation();
    setDraggedBlockId(id);
    setDraggedParentId(parentId);
  };

  const handleBlockDrop = (e: React.DragEvent, targetId: string, targetParentId: string | 'root') => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedBlockId || draggedParentId !== targetParentId) return;

    const items = targetParentId === 'root'
      ? section.children
      : (section.children.find(c => c.id === targetParentId) as SubSection).children;

    const startIdx = items.findIndex(i => i.id === draggedBlockId);
    const endIdx = items.findIndex(i => i.id === targetId);

    reorderChildren(section.id, startIdx, endIdx, targetParentId === 'root' ? undefined : targetParentId);
    setDraggedBlockId(null);
  };

  const renderAddBlockButtons = (subSectionId?: string) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {[BlockType.KEY_VALUE, BlockType.TABLE, BlockType.MARKDOWN, BlockType.LINKS, BlockType.DATES].map(type => (
        <Button
          key={type}
          type="button" size="sm" variant="outline"
          onClick={() => addBlock(section.id, type, subSectionId)}
          className="text-[10px] py-1 h-6 px-1.5"
        >+ {type.split('_')[0]}</Button>
      ))}
      {!subSectionId && (
        <Button
          type="button" size="sm" variant="secondary"
          onClick={() => addSubSection(section.id)}
          className="text-[10px] py-1 h-6 px-1.5 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
        >+ Sub-Section</Button>
      )}
    </div>
  );

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg shadow-sm mb-6 overflow-hidden dark:bg-slate-900 dark:border-slate-800 transition-colors"
      draggable={canDragSection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200 select-none dark:bg-slate-800/50 dark:border-slate-800">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 p-1 dark:text-slate-500 dark:hover:text-slate-300"
            onMouseEnter={() => setCanDragSection(true)}
            onMouseLeave={() => setCanDragSection(false)}
          ><GripVertical size={16} /></div>
          <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          <input
            value={section.title}
            onChange={(e) => updateSection(section.id, e.target.value)}
            className="font-bold text-lg text-slate-900 bg-transparent border-none focus:ring-2 focus:ring-blue-100 p-0 rounded px-1 w-full max-w-md outline-none dark:text-slate-100 dark:focus:ring-slate-800"
            placeholder="Section Title"
            onMouseDown={e => e.stopPropagation()}
          />
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onMoveUp} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded dark:text-slate-400 dark:hover:bg-slate-800"><ArrowUp size={16} /></button>
          <button type="button" onClick={onMoveDown} className="p-1.5 text-slate-500 hover:bg-slate-200 rounded dark:text-slate-400 dark:hover:bg-slate-800"><ArrowDown size={16} /></button>
          <button type="button" onClick={() => deleteSection(section.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"><Trash2 size={16} /></button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-slate-50/10 dark:bg-slate-900/10">
          {section.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === section.children.length - 1;

            if (child.type === 'SUB_SECTION') {
              const sub = child as SubSection;
              return (
                <div
                  key={sub.id}
                  className="bg-white border border-slate-200 rounded-md shadow-sm dark:bg-slate-800/30 dark:border-slate-800"
                  draggable={canDragSub[sub.id] || false}
                  onDragStart={(e) => handleBlockDragStart(e, sub.id, 'root')}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBlockDrop(e, sub.id, 'root')}
                >
                  <div className="flex items-center justify-between p-2 bg-slate-50 border-b border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                        onMouseEnter={() => setCanDragSub(prev => ({ ...prev, [sub.id]: true }))}
                        onMouseLeave={() => setCanDragSub(prev => ({ ...prev, [sub.id]: false }))}
                      ><GripVertical size={14} /></div>
                      <LayoutPanelTop size={14} className="text-blue-500" />
                      <input
                        value={sub.title}
                        onChange={(e) => updateSubSection(section.id, sub.id, e.target.value)}
                        className="font-bold text-slate-900 bg-transparent border-none focus:ring-1 focus:ring-blue-100 text-sm w-full rounded px-1 outline-none dark:text-slate-200 dark:focus:ring-slate-700"
                        onMouseDown={e => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveChild(section.id, index, 'up')} disabled={isFirst} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 dark:text-slate-500 dark:hover:text-blue-400"><ArrowUp size={14} /></button>
                      <button type="button" onClick={() => moveChild(section.id, index, 'down')} disabled={isLast} className="p-1 text-slate-400 hover:text-blue-600 disabled:opacity-30 dark:text-slate-500 dark:hover:text-blue-400"><ArrowDown size={14} /></button>
                      <button type="button" onClick={() => deleteChild(section.id, sub.id)} className="text-slate-300 hover:text-red-500 p-1 dark:text-slate-600 dark:hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="p-1 space-y-2">
                    {sub.children.map((block, bIndex) => (
                      <BlockEditor
                        key={block.id}
                        sectionId={section.id}
                        subSectionId={sub.id}
                        block={block}
                        isFirst={bIndex === 0}
                        isLast={bIndex === sub.children.length - 1}
                        onDragStart={(e) => handleBlockDragStart(e, block.id, sub.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleBlockDrop(e, block.id, sub.id)}
                        index={bIndex}
                      />
                    ))}
                    <div className="p-1 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Add block</span>
                      {renderAddBlockButtons(sub.id)}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <BlockEditor
                  key={child.id}
                  sectionId={section.id}
                  block={child as any}
                  isFirst={isFirst}
                  isLast={isLast}
                  onDragStart={(e) => handleBlockDragStart(e, child.id, 'root')}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBlockDrop(e, child.id, 'root')}
                  index={index}
                />
              );
            }
          })}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Section Blocks</span>
            {renderAddBlockButtons()}
          </div>
        </div>
      )}
    </div>
  );
};