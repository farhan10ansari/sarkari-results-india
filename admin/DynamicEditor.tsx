import React, { useState } from 'react';
// import { Section, SubSection, BlockType } from '@/admin/types';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical, ChevronDown, ChevronRight, ArrowUp, ArrowDown, LayoutPanelTop } from 'lucide-react';
import { BlockEditor } from '@/admin/editor/BlockEditor';
import { usePageStore } from '@/admin/usePageStore';
import { FieldType, ISection, ISubSectionField } from '@/lib/page.types';

interface DynamicEditorProps {
  section: ISection;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const DynamicEditor: React.FC<DynamicEditorProps> = ({
  section,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  isFirst = false,
  isLast = false
}) => {
  const {
    updateSection, deleteSection, addSubSection,
    updateSubSection, addBlock, moveChild, reorderChildren, deleteChild
  } = usePageStore();

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
      : (section.children.find(c => c._id === targetParentId) as ISubSectionField).children;

    const startIdx = items.findIndex(i => i._id === draggedBlockId);
    const endIdx = items.findIndex(i => i._id === targetId);

    reorderChildren(section._id, startIdx, endIdx, targetParentId === 'root' ? undefined : targetParentId);
    setDraggedBlockId(null);
  };

  const renderAddBlockButtons = (subSectionId?: string) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {[FieldType.KEY_VALUE, FieldType.TABLE, FieldType.MARKDOWN, FieldType.LINK, FieldType.DATE].map(type => (
        <Button
          key={type}
          type="button" size="sm" variant="outline"
          onClick={() => addBlock(section._id, type, subSectionId)}
          className="text-[10px] py-1 h-6 px-1.5 cursor-pointer"
        >+ {type.split('_')[0]}</Button>
      ))}
      {!subSectionId && (
        <Button
          type="button" size="sm" variant="secondary"
          onClick={() => addSubSection(section._id)}
          className="text-[10px] py-1 h-6 px-1.5 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40 cursor-pointer"
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
          <Button type="button" onClick={() => setIsExpanded(!isExpanded)} variant="ghost" size="icon-sm" className="h-7 w-7 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </Button>
          <input
            value={section.title}
            onChange={(e) => updateSection(section._id, e.target.value)}
            className="font-bold text-lg text-slate-900 bg-transparent border-none focus:ring-2 focus:ring-blue-100 p-0 rounded px-1 w-full max-w-md outline-none dark:text-slate-100 dark:focus:ring-slate-800"
            placeholder="Section Title"
            onMouseDown={e => e.stopPropagation()}
          />
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" onClick={onMoveUp} disabled={isFirst} variant="ghost" size="icon-sm" className="h-8 w-8 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"><ArrowUp size={16} /></Button>
          <Button type="button" onClick={onMoveDown} disabled={isLast} variant="ghost" size="icon-sm" className="h-8 w-8 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800"><ArrowDown size={16} /></Button>
          <Button type="button" onClick={() => deleteSection(section._id)} variant="ghost" size="icon-sm" className="h-8 w-8 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"><Trash2 size={16} /></Button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-slate-50/10 dark:bg-slate-900/10">
          {section.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === section.children.length - 1;

            if (child.type === 'SUB_SECTION') {
              const sub = child as ISubSectionField;
              return (
                <div
                  key={sub._id}
                  className="bg-white border border-slate-200 rounded-md shadow-sm dark:bg-slate-800/30 dark:border-slate-800"
                  draggable={canDragSub[sub._id] || false}
                  onDragStart={(e) => handleBlockDragStart(e, sub._id, 'root')}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBlockDrop(e, sub._id, 'root')}
                >
                  <div className="flex items-center justify-between p-2 bg-slate-50 border-b border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400"
                        onMouseEnter={() => setCanDragSub(prev => ({ ...prev, [sub._id]: true }))}
                        onMouseLeave={() => setCanDragSub(prev => ({ ...prev, [sub._id]: false }))}
                      ><GripVertical size={14} /></div>
                      <LayoutPanelTop size={14} className="text-blue-500" />
                      <input
                        value={sub.title}
                        onChange={(e) => updateSubSection(section._id, sub._id, e.target.value)}
                        className="font-bold text-slate-900 bg-transparent border-none focus:ring-1 focus:ring-blue-100 text-sm w-full rounded px-1 outline-none dark:text-slate-200 dark:focus:ring-slate-700"
                        onMouseDown={e => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button type="button" onClick={() => moveChild(section._id, index, 'up')} disabled={isFirst} variant="ghost" size="icon-sm" className="h-7 w-7 text-slate-400 hover:text-blue-600 disabled:opacity-30 dark:text-slate-500 dark:hover:text-blue-400"><ArrowUp size={14} /></Button>
                      <Button type="button" onClick={() => moveChild(section._id, index, 'down')} disabled={isLast} variant="ghost" size="icon-sm" className="h-7 w-7 text-slate-400 hover:text-blue-600 disabled:opacity-30 dark:text-slate-500 dark:hover:text-blue-400"><ArrowDown size={14} /></Button>
                      <Button type="button" onClick={() => deleteChild(section._id, sub._id)} variant="ghost" size="icon-sm" className="h-7 w-7 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"><Trash2 size={14} /></Button>
                    </div>
                  </div>

                  <div className="p-1 space-y-2">
                    {sub.children.map((block, bIndex) => (
                      <BlockEditor
                        key={block._id}
                        sectionId={section._id}
                        subSectionId={sub._id}
                        block={block}
                        isFirst={bIndex === 0}
                        isLast={bIndex === sub.children.length - 1}
                        onDragStart={(e) => handleBlockDragStart(e, block._id, sub._id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleBlockDrop(e, block._id, sub._id)}
                        index={bIndex}
                      />
                    ))}
                    <div className="p-1 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Add block</span>
                      {renderAddBlockButtons(sub._id)}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <BlockEditor
                  key={child._id}
                  sectionId={section._id}
                  block={child as any}
                  isFirst={isFirst}
                  isLast={isLast}
                  onDragStart={(e) => handleBlockDragStart(e, child._id, 'root')}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleBlockDrop(e, child._id, 'root')}
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