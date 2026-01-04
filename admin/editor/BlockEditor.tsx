import React from 'react';
import { ContentBlock, BlockType } from '@/admin/types';
import { BlockWrapper } from '@/admin/editor/BlockWrapper';
import { KeyValueEditor } from '@/admin/editor/blocks/KeyValueEditor';
import { MarkdownEditor } from '@/admin/editor/blocks/MarkdownEditor';
import { TableEditor } from '@/admin/editor/blocks/TableEditor';
import { usePageStore } from '@/admin/usePageStore';

interface BlockEditorProps {
  sectionId: string;
  subSectionId?: string;
  block: ContentBlock;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = (props) => {
  const { block, sectionId, subSectionId, index } = props;
  const { updateBlock, deleteChild, moveChild } = usePageStore();

  const handleUpdate = (updates: Partial<ContentBlock>) => {
    updateBlock(sectionId, block.id, updates, subSectionId);
  };

  const handleDelete = () => {
    if (confirm("Delete this block?")) {
      deleteChild(sectionId, block.id, subSectionId);
    }
  };

  const handleMoveUp = () => moveChild(sectionId, index, 'up', subSectionId);
  const handleMoveDown = () => moveChild(sectionId, index, 'down', subSectionId);

  const renderInnerEditor = () => {
    switch (block.type) {
      case BlockType.KEY_VALUE:
      case BlockType.DATE:
      case BlockType.LINK:
        return <KeyValueEditor block={block} onChange={handleUpdate} />;
      case BlockType.MARKDOWN:
        return <MarkdownEditor block={block} onChange={handleUpdate} />;
      case BlockType.TABLE:
        return <TableEditor block={block} onChange={handleUpdate} />;
      default:
        return <div className="text-xs text-red-500">Unknown block type</div>;
    }
  };

  return (
    <BlockWrapper
      {...props}
      onDelete={handleDelete}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
    >
      {renderInnerEditor()}
    </BlockWrapper>
  );
};